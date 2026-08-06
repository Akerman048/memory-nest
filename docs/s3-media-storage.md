# AWS S3 media storage

Memory Nest keeps the S3 bucket private. The authenticated API issues a 10-minute presigned `PUT` URL, the browser uploads directly to S3, and the API confirms the object with `HeadObject` before saving the memory. Read URLs expire after one hour.

## 1. Create the bucket

Deploy the included CloudFormation template:

```bash
aws cloudformation deploy \
  --template-file infra/aws/s3-media.yaml \
  --stack-name memory-nest-media \
  --parameter-overrides \
    BucketName=YOUR_GLOBALLY_UNIQUE_BUCKET_NAME \
    FrontendOrigin=https://YOUR_FRONTEND_DOMAIN \
  --region YOUR_AWS_REGION
```

For local browser uploads, temporarily deploy with `FrontendOrigin=http://localhost:3000`. An S3 CORS rule accepts only one exact origin in this template; add both production and local origins manually when both environments must work simultaneously.

The template enables encryption at rest, blocks every form of public access, disables ACLs through `BucketOwnerEnforced`, requires TLS, and retains the bucket if the CloudFormation stack is deleted.

## 2. Grant the backend least-privilege access

Attach this policy to the IAM role used by the backend. For local development, it may be attached to a dedicated IAM user, but an IAM role is preferred in production.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "MemoryNestMediaObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/children/*"
    }
  ]
}
```

Do not make the bucket or its objects public. Do not put AWS credentials in the frontend or in any `NEXT_PUBLIC_*` variable.

## 3. Configure the backend

Copy `backend/.env.example` to `backend/.env` and set:

```dotenv
AWS_REGION=eu-west-1
AWS_S3_BUCKET=your-private-bucket-name
```

The AWS SDK uses its default Node.js credential provider chain. On AWS infrastructure, configure the task, instance, Lambda, or service role. For local development only, `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` can be placed in the ignored `backend/.env` file; temporary credentials additionally require `AWS_SESSION_TOKEN`.

## 4. Apply the database migration

```bash
cd backend
pnpm prisma migrate deploy
pnpm prisma generate
```

## Upload limits and accepted formats

- Images: JPEG, PNG, WebP, or GIF; maximum 25 MB.
- Videos: MP4, WebM, or QuickTime; maximum 250 MB.
- Upload URLs expire after 10 minutes.
- Download URLs expire after one hour.

The API verifies the uploaded object's size and MIME type before associating it with a memory. An interrupted upload cannot be finalized as a memory.

## Clean interrupted uploads

A presigned URL creates a pending database record before the browser uploads. Run the cleanup command daily to remove uploads that were not finalized within 24 hours:

```bash
cd backend
pnpm media:cleanup
```

Schedule this command with the production platform's cron or scheduled-task facility. It processes up to 500 pending assets per run and removes both the S3 object (when present) and its database record.

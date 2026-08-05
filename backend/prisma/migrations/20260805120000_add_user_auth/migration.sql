-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('PARENT', 'GUARDIAN', 'FAMILY_MEMBER', 'OTHER');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "passwordHash" TEXT,
ADD COLUMN "accountRole" "AccountRole" NOT NULL DEFAULT 'OTHER';

-- Existing development users cannot authenticate until they reset a password.
UPDATE "User" SET "passwordHash" = 'account-disabled' WHERE "passwordHash" IS NULL;

ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "accountRole" DROP DEFAULT;

# Database

## User

- id
- email
- passwordHash
- name
- createdAt

## Child

- id
- ownerId
- name
- birthDate
- avatarUrl
- createdAt

## Memory

- id
- childId
- authorId
- title
- description
- memoryDate
- createdAt

## Media

- id
- memoryId
- type
- storageKey
- mimeType
- size
- createdAt
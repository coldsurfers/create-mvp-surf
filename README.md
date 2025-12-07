# create-mvp-surf

## What's the point?
- 지속 가능한 MVP를 위한 template 프로젝트입니다.
- pnpm workspace를 활용한 모노레포입니다.
- lint 툴로써, biome를 선택했어요.

## apps

### server
- Fastify와 AWS Lambda, serverless framework를 활용하여 개발해요.

## packages

### api-sdk
- swagger와 openapi-fetch, openapi-typescript를 사용하여 api fetcher에 대한 SDK를 만들어줘요.

### prisma-schema
- Supabase와 PosgreSQL 조합으로 model들을 안정적으로 운영할 수 있게 해줘요.
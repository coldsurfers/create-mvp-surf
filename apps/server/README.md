# server

## What
- Fastify server 구축을 위한 템플릿입니다.

## Steps
- `.env`파일을 `.env.sample`을 참고하여 생성해주세요.
- `pnpm dev` 명령어로 로컬환경 실행할 수 있어요

## Swagger
- Swagger docs를 제공해요
- 로컬환경에서는 `localhost:3001/docs`에서 확인해요

## Deploy
- 개발환경은 `pnpm deploy:dev`
- 운영환경은 `pnpm deploy:prod`
- Turbo와 함께라면 `pnpm turbo run deploy:server:prod` or `pnpm turbo run deploy:server:dev`

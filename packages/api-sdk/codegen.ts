const dotenv = require('dotenv');
const { execSync } = require('node:child_process');

dotenv.config({
  path: './.env',
});

async function codegen() {
  const stage = process.env.STAGE;
  let swaggerDocUrl = process.env.SWAGGER_DEV_HOST;
  if (stage === 'dev') {
    swaggerDocUrl = process.env.SWAGGER_DOC_URL_DEVELOPMENT;
  }
  if (stage === 'prod') {
    swaggerDocUrl = process.env.SWAGGER_DOC_URL_PRODUCTION;
  }
  if (!swaggerDocUrl) {
    throw new Error('SWAGGER_DOC_URL is not set');
  }
  execSync(
    `npx openapi-typescript ${swaggerDocUrl} -o types/api.ts --alphabetize && pnpm format:fix`,
    {
      stdio: 'inherit',
    }
  );
}

codegen();

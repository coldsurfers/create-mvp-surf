import { UserDTOSchema } from '@/dtos/user.dto';
import { SWAGGER_HOST } from '@/lib/constants';
import { jwtPlugin } from '@/plugins/plugins.jwt';
import userRoute from '@/routes/user.route';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import {
  createJsonSchemaTransformObject,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import z from 'zod';

dotenv.config();

export const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) {
      // 서버 간 요청 등 Origin이 없는 경우 허용
      cb(null, true);
      return;
    }

    // 이곳에 허용할 도메인을 추가해주세요!
    const allowedBase = process.env.API_HOST_URL;
    if (!allowedBase) {
      throw new Error('ALLOWED_BASE is not set, allowedBase로 검색하세요.');
    }
    const url = new URL(origin);

    // for nextjs like client localhost
    const isLocalHost = url.hostname === 'localhost' && url.port === '3000';

    if (isLocalHost) {
      cb(null, true);
    } else if (url.hostname === allowedBase || url.hostname.endsWith(`.${allowedBase}`)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'x-anonymous-user-id'],
});

app.register(jwtPlugin);

app.register(rateLimit, {
  global: false,
  // max: 100, // Maximum number of requests
  // timeWindow: '1 minute', // Time window in milliseconds or a human-readable format
  // keyGenerator: (req) => req.ip, // Generate a unique key based on the request IP
  // ban: 2, // Ban an IP if it exceeds the limit `ban` times
  // errorResponseBuilder: (req, context) => {
  //   return {
  //     statusCode: 429,
  //     error: 'Too Many Requests',
  //     message: `You have exceeded the request limit of ${context.max} per ${context.timeWindow}`,
  //   }
  // },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

z.globalRegistry.add(UserDTOSchema, { id: 'User' });

app.register(fastifySwagger, {
  swagger: {
    host: SWAGGER_HOST,
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      AccessTokenAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter the access token, e.g. "<token>"',
      },
    },
  },
  transform: jsonSchemaTransform,
  openapi: {
    info: {
      title: 'API Docs',
      description: 'Swagger service API docs',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        AccessTokenAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
    tags: [
      {
        name: 'v1',
      },
      {
        name: 'user',
      },
    ],
  },
  transformObject: createJsonSchemaTransformObject({
    zodToJsonConfig: { target: 'openapi-3.0' },
  }),
  // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
  //
  // transform: createJsonSchemaTransform({
  //   skipList: [ '/documentation/static/*' ]
  // })
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    defaultModelsExpandDepth: 1, // Show schemas in the Models section
    // docExpansion: 'none', // Collapse all the docs by default
  },
  staticCSP: true,
  transformStaticCSP(header) {
    return header;
  },
});

app.register(userRoute, { prefix: '/v1/user' });

console.log('Hello, this is server');

import { getUserByIdHandler, getUsersHandler } from '@/controllers/user.controller';
import { ErrorResponseDTOSchema } from '@/dtos/error-response.dto';
import { UserDTOSchema } from '@/dtos/user.dto';
import type { FastifyPluginCallback } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

const userRoute: FastifyPluginCallback = (fastify, _, done) => {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        tags: ['v1', 'user'],
        response: {
          200: UserDTOSchema.array(),
          500: ErrorResponseDTOSchema,
        },
      },
    },
    getUsersHandler
  );
  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        tags: ['v1', 'user'],
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: UserDTOSchema,
          404: ErrorResponseDTOSchema,
          500: ErrorResponseDTOSchema,
        },
      },
    },
    getUserByIdHandler
  );
  done();
};

export default userRoute;

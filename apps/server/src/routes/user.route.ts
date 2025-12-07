import type { FastifyPluginCallback } from 'fastify';

const userRoute: FastifyPluginCallback = (fastify, _, done) => {
  done();
};

export default userRoute;

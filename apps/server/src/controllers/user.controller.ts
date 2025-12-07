import type { ErrorResponseDTO } from '@/dtos/error-response.dto';
import type { UserDTO } from '@/dtos/user.dto';
import { AppError } from '@/lib/error/error.app-error';
import { UserRepositoryImpl } from '@/repositories/user.repository.impl';
import { UserService } from '@/services/user.service';
import type { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

const userService = new UserService(new UserRepositoryImpl());

interface GetUsersHandlerRoute extends RouteGenericInterface {
  Reply: {
    200: UserDTO[];
    500: ErrorResponseDTO;
  };
}

export const getUsersHandler = async (
  req: FastifyRequest<GetUsersHandlerRoute>,
  rep: FastifyReply<GetUsersHandlerRoute>
) => {
  try {
    const users = await userService.getUsers();
    return rep.status(200).send(users);
  } catch (e) {
    console.error(e);
    if (e instanceof AppError) {
      return rep.status(e.statusCode as keyof GetUsersHandlerRoute['Reply']).send({
        code: e.code,
        message: e.message,
      });
    }
    return rep.status(500).send({
      code: 'UNKNOWN',
      message: 'internal server error',
    });
  }
};

interface GetUserByIdHandlerRoute extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Reply: {
    200: UserDTO;
    404: ErrorResponseDTO;
    500: ErrorResponseDTO;
  };
}

export const getUserByIdHandler = async (
  req: FastifyRequest<GetUserByIdHandlerRoute>,
  rep: FastifyReply<GetUserByIdHandlerRoute>
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return rep.status(404).send({ code: 'USER_NOT_FOUND', message: 'user not found' });
    }
    return rep.status(200).send(user);
  } catch (e) {
    console.error(e);
    if (e instanceof AppError) {
      return rep.status(e.statusCode as keyof GetUserByIdHandlerRoute['Reply']).send({
        code: e.code,
        message: e.message,
      });
    }
    return rep.status(500).send({
      code: 'UNKNOWN',
      message: 'internal server error',
    });
  }
};

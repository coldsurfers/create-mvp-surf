import { z } from 'zod';

export const errorCodeSchema = z.union([
  z.literal('INVALID_ACCESS_TOKEN'),
  z.literal('USER_NOT_FOUND'),
  z.literal('INVALID_USER'),
  z.literal('ACCESS_TOKEN_NOT_FOUND'),
  z.literal('UNKNOWN'),
]);

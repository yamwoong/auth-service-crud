import { RequestHandler } from 'express';

/**
 * Wraps an Express route handler (sync or async) to forward errors to the error middleware.
 * Ensures clean error forwarding without try/catch in every controller.
 */

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

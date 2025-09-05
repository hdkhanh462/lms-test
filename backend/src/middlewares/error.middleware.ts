import { NextFunction, Request, Response } from "express";

import HttpException from "@/exceptions/http-exception";
import { ZodError } from "zod";

export default function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  // console.error(error);

  if (error instanceof ZodError) {
    return response.status(400).json({
      statusCode: 400,
      message: "Validation Error",
      errors: error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  response.status(statusCode).json({
    statusCode,
    message,
    code: error.code,
  });
}

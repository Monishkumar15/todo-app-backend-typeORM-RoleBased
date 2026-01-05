import { Request, Response, NextFunction } from "express";

export const responseInterceptor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const oldJson = res.json.bind(res);

  res.json = (body: any) => {
    const statusCode = res.statusCode;

    const isSuccess = statusCode >= 200 && statusCode < 300;

    return oldJson({
      success: isSuccess,
      ...(isSuccess ? { data: body } : body),
    });
  };

  next();
};

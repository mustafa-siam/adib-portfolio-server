import { NextFunction, Request, Response } from 'express';

export const parseFormDataJson = (req: Request, _res: Response, next: NextFunction) => {
  const jsonFields = ['overview', 'process', 'testimonial', 'tags'];

  for (const field of jsonFields) {
    if (typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        // leave as-is; validation will report it
      }
    }
  }

  if (typeof req.body.isFeatured === 'string') {
    req.body.isFeatured = req.body.isFeatured === 'true';
  }

  next();
};

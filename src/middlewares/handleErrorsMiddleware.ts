import { Request, Response, NextFunction } from "express";

export default function handleErrorsMiddleware(error, req: Request, res: Response, next: NextFunction) {

    if (error.status === 401) return res.sendStatus(401);
    if (error.status === 404) return res.sendStatus(404);
    if (error.status === 422) return res.sendStatus(422);

    return res.sendStatus(500);
}

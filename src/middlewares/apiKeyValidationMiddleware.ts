import { Request, Response, NextFunction } from "express";
import * as companyRepository from "../repositories/companyRepository.js";

export default async function apiKeyValidationMiddleware(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"] as string;

    const company = await companyRepository.findByApiKey(apiKey);

    if (!company) throw { status: 404 };

    res.locals.companyId = company.id;

    next();
}
import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

export async function createCard(req: Request, res: Response) {
    const { companyId } = res.locals;
    const { employeeId, type } = req.body;

    await cardService.validateCreation(employeeId, companyId, type);
    await cardService.create(employeeId, type);

    res.sendStatus(201);
}
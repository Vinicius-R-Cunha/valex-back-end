import { Request, Response } from "express";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
    const { companyId } = res.locals;
    const { employeeId, type } = req.body;

    await cardService.validateCreation(employeeId, companyId, type);
    const cardData = await cardService.create(employeeId, type);

    res.status(201).send(cardData);
}

export async function activateCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { password, cvc } = req.body;

    await cardService.validateActivation(parseFloat(cardId), cvc);
    await cardService.activate(parseFloat(cardId), password);

    res.sendStatus(200);
}

export async function getBalance(req: Request, res: Response) {
    const { cardId } = req.params;

    await cardService.validateCard(parseFloat(cardId));
    const balance = await cardService.balance(parseFloat(cardId));

    res.status(200).send(balance);
}
import { Request, Response } from "express";
import * as rechargeService from '../services/rechargeService.js';

export async function rechargeCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { amount } = req.body;

    await rechargeService.validateRecharge(parseFloat(cardId));
    await rechargeService.recharge(parseFloat(cardId), amount);

    res.status(200).send('opa');
}
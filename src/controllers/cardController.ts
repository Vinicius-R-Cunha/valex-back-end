import { Request, Response } from "express";

export async function createCard(req: Request, res: Response) {
    res.send('ok');
}
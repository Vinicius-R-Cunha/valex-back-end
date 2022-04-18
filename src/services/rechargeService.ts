import * as rechargeRepository from '../repositories/rechargeRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

export async function validateRecharge(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if (!card) throw { status: 404 };
    if (cardExpired(card.expirationDate)) throw { status: 422 };

    return;
}

function cardExpired(expirationDate: string) {
    const todayInMilliseconds = dayjs().valueOf();
    const expirationDateInMilliseconds = dayjs(expirationDate, "MM/YY").endOf('month').valueOf();

    if (expirationDateInMilliseconds - todayInMilliseconds < 0) {
        return true;
    }

    return false;
}

export async function recharge(cardId: number, amount: number) {
    return await rechargeRepository.insert({ cardId, amount });
}
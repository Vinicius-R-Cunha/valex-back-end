import * as cardRepository from "../repositories/cardRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);
import bcrypt from "bcrypt";

export async function pay(cardId: number, businessId: number, amount: number) {
    return await paymentRepository.insert({ cardId, businessId, amount });
}

export async function validatePayment(cardId: number, password: string, businessId: number, amount: number) {
    const card = await cardRepository.findById(cardId);
    if (!card) throw { status: 404 };
    if (cardExpired(card.expirationDate)) throw { status: 422 };
    if (!passwordIsCorrect(card.password, password)) throw { status: 401 };

    const business = await businessRepository.findById(businessId);
    if (!business) throw { status: 404 };
    if (business.type !== card.type) throw { status: 422 };

    const recharges = await rechargeRepository.findByCardId(cardId);
    const transactions = await paymentRepository.findByCardId(cardId);
    const balance = calculateBalance(recharges, transactions);

    if (amount > balance) throw { status: 401 };

    return;
}

function passwordIsCorrect(encryptedSecurityCode: string, password: string) {
    return bcrypt.compareSync(password, encryptedSecurityCode);
}

function cardExpired(expirationDate: string) {
    const todayInMilliseconds = dayjs().valueOf();
    const expirationDateInMilliseconds = dayjs(expirationDate, "MM/YY").endOf('month').valueOf();

    if (expirationDateInMilliseconds - todayInMilliseconds < 0) {
        return true;
    }

    return false;
}

function calculateBalance(recharges, transactions) {
    let totalRecharges = 0;
    recharges.map(recharge => {
        totalRecharges += recharge?.amount
    });

    let totalTransactions = 0;
    transactions.map(transaction => {
        totalTransactions += transaction?.amount
    });

    return totalRecharges - totalTransactions;
}
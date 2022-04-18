import { faker } from "@faker-js/faker";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

export async function create(employeeId: number, type: cardRepository.TransactionTypes) {
    const cardData = await getCardData(employeeId, type);

    const { number, securityCode, expirationDate, cardholderName } = cardData;

    await cardRepository.insert(encryptSecurityCode(cardData));

    return {
        number,
        securityCode,
        expirationDate,
        cardholderName
    }
}

function encryptSecurityCode(cardData: cardRepository.CardInsertData) {
    const encryptedSecurityCode = bcrypt.hashSync(cardData.securityCode, 10);

    return {
        ...cardData,
        securityCode: encryptedSecurityCode
    }
}

export async function validateCreation(employeeId: number, companyId: number, type: cardRepository.TransactionTypes) {
    const employee = await employeeRepository.findById(employeeId);

    if (!employee) throw { status: 404 };
    if (employee.companyId !== companyId) throw { status: 401 };

    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (card) throw { status: 422 };
}

async function getCardData(employeeId: number, type: cardRepository.TransactionTypes) {
    const cardholderName = await getEmployeeName(employeeId);
    const [number, securityCode] = generateCardNumberCvv();
    const expirationDate = getExpirationDate();

    return {
        employeeId: employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type
    }
}

async function getEmployeeName(employeeId: number) {
    const { fullName } = await employeeRepository.findById(employeeId);
    return formatName(fullName);
}

function generateCardNumberCvv() {
    const number = faker.finance.creditCardNumber('mastercard');
    const securityCode = faker.finance.creditCardCVV();
    return [number, securityCode];
}

function getExpirationDate() {
    return dayjs().add(5, "year").format("MM/YY");
}

function formatName(name: string) {
    const nameArray = name.toUpperCase().split(' ');

    let cardholderName = nameArray[0];
    for (let i = 1; i < (nameArray.length - 1); i++) {
        if (nameArray[i].length >= 3) {
            cardholderName += ` ${nameArray[i][0]}`;
        }
    }

    return cardholderName + ` ${nameArray[nameArray.length - 1]}`;
}

export async function validateActivation(cardId: number, cvc: string) {
    const card = await cardRepository.findById(cardId);
    if (!card) throw { status: 404 };
    if (card.password) throw { status: 409 };
    if (!cvvIsCorrect(card.securityCode, cvc)) throw { status: 401 };
    if (cardExpired(card.expirationDate)) throw { status: 422 };

    return;
}

function cvvIsCorrect(encryptedSecurityCode: string, cvc: string) {
    return bcrypt.compareSync(cvc, encryptedSecurityCode);
}

function cardExpired(expirationDate: string) {
    const todayInMilliseconds = dayjs().valueOf();
    const expirationDateInMilliseconds = dayjs(expirationDate, "MM/YY").endOf('month').valueOf();

    if (expirationDateInMilliseconds - todayInMilliseconds < 0) {
        return true;
    }

    return false;
}

export async function activate(cardId: number, password: string) {
    return await cardRepository.update(cardId, { password: bcrypt.hashSync(password, 10) });
}

export async function validateCard(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if (!card) throw { status: 404 };

    return;
}

export async function balance(cardId: number) {
    const recharges = await rechargeRepository.findByCardId(cardId);
    const transactions = await paymentRepository.findByCardId(cardId);
    const balance = calculateBalance(recharges, transactions);

    return {
        balance,
        transactions,
        recharges
    };
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
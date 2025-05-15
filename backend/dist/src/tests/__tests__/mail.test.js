"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = require("@utils/mail");
jest.mock('nodemailer');
describe('sendResetPasswordEmail', () => {
    it('should send email with correct parameters', async () => {
        const sendMailMock = jest.fn().mockResolvedValue('Email sent');
        const createTransportMock = { sendMail: sendMailMock };
        nodemailer_1.default.createTransport.mockReturnValue(createTransportMock);
        const to = 'user@example.com';
        const resetLink = 'http://localhost:3001/reset-password?token=testtoken123';
        const result = await (0, mail_1.sendResetPasswordEmail)(to, resetLink);
        expect(nodemailer_1.default.createTransport).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
            to,
            subject: expect.stringContaining('Reset'),
            html: expect.stringContaining(resetLink),
        }));
        expect(result).toBe('Email sent');
    });
});

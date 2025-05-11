import nodemailer from 'nodemailer';
import { sendResetPasswordEmail } from '@utils/mail';

jest.mock('nodemailer');

describe('sendResetPasswordEmail', () => {
  it('should send email with correct parameters', async () => {
    const sendMailMock = jest.fn().mockResolvedValue('Email sent');
    const createTransportMock = { sendMail: sendMailMock };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(createTransportMock);

    const to = 'user@example.com';
    const resetLink = 'http://localhost:3001/reset-password?token=testtoken123';

    const result = await sendResetPasswordEmail(to, resetLink);

    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to,
        subject: expect.stringContaining('Reset'),
        html: expect.stringContaining(resetLink),
      })
    );
    expect(result).toBe('Email sent');
  });
});

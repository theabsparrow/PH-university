import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.email_sent_from,
      pass: config.email_app_password,
    },
  });

  await transporter.sendMail({
    from: config.email_sent_from,
    to,
    subject: 'Reset you password soon',
    text: 'With this link  reset you password. this link is only valid for 10 minutes',
    html,
  });
};

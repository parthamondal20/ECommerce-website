import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `MyShop123@gmail.com`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

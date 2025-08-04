"use server";
import { cookies } from "next/headers";
import sendgrid from "@sendgrid/mail";
import { setEmail } from "../user";
import { getAuthenticatedUser } from "../auth";
import CryptoJS from "crypto-js";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const encryptOTP = (otp: string) => {
  const secretKey = process.env.OTP_SECRET_KEY as string;
  return CryptoJS.AES.encrypt(otp, secretKey).toString();
};

const decryptOTP = (encryptedOtp: string) => {
  const secretKey = process.env.OTP_SECRET_KEY as string;
  const bytes = CryptoJS.AES.decrypt(encryptedOtp, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const sendOTPEmail = async (email: string, otp: string) => {
  const message = {
    from: "info@znsconnect.io",
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
    to: email,
  };
  await sendgrid.send(message);
};

// PRIVATE ROUTER ONLY
export const sendOTP = async (email: string) => {
  const user = await getAuthenticatedUser();
  if (user) {
    const otp = generateOTP();
    if (email) {
      const encryptedOtp = encryptOTP(otp);
      cookies().set({ name: `otp_${email}`, value: encryptedOtp });
      sendOTPEmail(email, otp);
    }
  }
};

// PRIVATE ROUTER ONLY
export const verifyOTP = async (email: string, otp: string) => {
  const user = await getAuthenticatedUser();
  if (user && email) {
    const encryptedOtp = cookies().get(`otp_${email}`)?.value;
    if (encryptedOtp) {
      const decryptedOtp = decryptOTP(encryptedOtp);
      if (decryptedOtp === otp) {
        await setEmail(user.id, email);
        return true;
      }
    }
    return false;
  }
};

// New function without authentication check
export const sendOTPUnauthenticated = async (email: string) => {
  const otp = generateOTP();
  if (email) {
    const encryptedOtp = encryptOTP(otp);
    cookies().set({ name: `otp_${email}`, value: encryptedOtp });
    await sendOTPEmail(email, otp);
    return true;
  }
  return false;
};

// New function without authentication check
export const verifyOTPUnauthenticated = async (
  email: string,
  otp: string,
  userId: string
) => {
  if (email) {
    const encryptedOtp = cookies().get(`otp_${email}`)?.value;
    if (encryptedOtp) {
      const decryptedOtp = decryptOTP(encryptedOtp);
      if (decryptedOtp === otp) {
        await setEmail(userId, email);
        return true;
      }
    }
    return false;
  }
  return false;
};

import { NETWORKS } from "@/config/chains";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Statistic } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const ascii = (a: any) => a.charCodeAt(0);
export const gtEq = (a: any, b: any) => a >= b;
export const ltEq = (a: any, b: any) => a <= b;

export const formatPrice = (value: number, length = 3) => {
  return value.toLocaleString("en", {
    minimumFractionDigits: length,
    maximumFractionDigits: length + 2,
  });
};

export const decodeImageData = (dataUri: string) => {
  if (!dataUri) {
    return null;
  }
  try {
    const base64Json = dataUri.split(",")[1];
    const jsonString = atob(base64Json);
    const jsonData = JSON.parse(jsonString);
    const imageWithPrefix = jsonData?.image;
    if (!imageWithPrefix) {
      console.error("Invalid image property:", imageWithPrefix);
      return null;
    }
    const base64Image = imageWithPrefix.split(",")[1];
    const decodedImage = atob(base64Image);
    return decodedImage;
  } catch (error) {
    console.error("Invalid image data:", error);
    return null;
  }
};

export const copyToClipboard = (text: string = "", callback?: () => void) => {
  if (!navigator.clipboard) {
    console.error("Clipboard API not supported");
    return;
  }
  navigator.clipboard.writeText(text ?? "").then(callback, (err) => {
    console.error("Failed to copy:", err);
  });
};

export const getSanitizedValue = (value: string, defaultReturn: number = 0) => {
  const sanitizedValue = value.replace(/\D/g, "");
  if (sanitizedValue !== "" && parseInt(sanitizedValue, 10) > 0) {
    return Number(sanitizedValue);
  } else {
    return defaultReturn;
  }
};

const baseUrl = process.env.NEXT_PUBLIC_IMAGE_SEVICE_URL;
export const getDomainUrl = (
  chainId?: NETWORKS | null,
  domainId?: number | string
) => {
  if (chainId && domainId) return `${baseUrl}${chainId}/${domainId}.png`;
  else return "";
};

export const mergeStatistics = (data: Statistic[]) => {
  let totalDomains = 0;
  let uniqueOwners = 0;
  let giftCards = 0;

  data?.forEach((item) => {
    totalDomains += item.domains;
    uniqueOwners += item.owner;
    giftCards += item.gifts;

    // Assuming each `owner` in `data` is unique per chain
  });

  return { totalDomains, uniqueOwners, giftCards };
};

export const calculatePercent = (A: number, B: number) => {
  // Calculate the percentage
  if (B === 0) return 0;

  let percentage = (A / B) * 100;

  // Check if the percentage is an integer
  if (Number.isInteger(percentage)) {
    // Return the integer value (no decimal places)
    return percentage.toString();
  } else {
    // Return the value rounded to 1 decimal place
    return percentage.toFixed(1);
  }
};

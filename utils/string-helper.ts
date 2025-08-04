export const toDomainUrl = (domainText: string) => {
  let domain = domainText.toLowerCase();
  domain = domain.trim();
  domain = domain.replace(/\s+/g, "-");
  domain = domain.replace(/-{2,}/g, "-");
  return domain;
};

export const validateForDomain = (searchText: string) => {
  const pattern = /^[a-z0-9A-Z\s\-]*$/;
  return pattern.test(searchText);
};

// social usernames validators
export const LinkValidators: { [key: string]: RegExp } = {
  twitter: /^[A-Za-z0-9_]{4,15}$/,
  telegram: /^[a-zA-Z][a-zA-Z0-9_]{3,30}[a-zA-Z0-9]$/,
  linkedin: /^[a-zA-Z][a-zA-Z0-9-]{1,98}[a-zA-Z0-9]$/,
  discord: /^[\w.-]{1,32}(#[0-9]{4})?$/,
  website: /^https?:\/\/(?:[\w-]+\.)+[\w-]+(?:\/[\w-./?%&=]*)?$/,
  application: /^https?:\/\/(?:[\w-]+\.)+[\w-]+(?:\/[\w-./?%&=]*)?$/,
  medium: /^https:\/\/([A-Za-z0-9-_]+\.)*medium\.com([A-Za-z0-9-_\/]*)$/,
  mirror: /^https:\/\/([A-Za-z0-9-_]+\.)*mirror\.xyz([A-Za-z0-9-_\/]*)$/,
};

/**
 * Shorten a wallet address by displaying only the first and last parts of it.
 *
 * @param address - The full wallet address to be shortened.
 * @param charsToShow - Number of characters to show at the start and end of the address.
 * @returns The shortened wallet address.
 */
export const shortenWalletAddress = (
  address: string,
  charsToShow: number = 4
): string => {
  // Check if the address is valid and long enough
  if (address.length <= 2 * charsToShow) {
    return address; // Return the address as is if it's too short to shorten
  }

  const start = address.slice(0, charsToShow + 2);
  const end = address.slice(-charsToShow);
  return `${start}...${end}`;
};

export const shortenWalletAddress2 = (
  address: string,
  charsToShow: number = 7
): string => {
  // Check if the address is valid and long enough
  if (address.length <= charsToShow) {
    return address; // Return the address as is if it's too short to shorten
  }
  const end = address.slice(-charsToShow).toUpperCase();
  return `....${end}`;
};

export const shortenWalletAddress3 = (
  address: string,
  charsToShowHead: number = 3,
  charsToShowTail: number = 4
): string => {
  // Check if the address is valid and long enough
  if (address.length <= 2 + charsToShowHead + charsToShowTail) {
    return address; // Return the address as is if it's too short to shorten
  }

  const start = address.slice(0, charsToShowHead + 2);
  const end = address.slice(-charsToShowTail);
  return `${start}...${end}`;
};

export function isValidEthereumAddress(address: string): boolean {
  if (address.length !== 42) {
    return false;
  }

  if (address.slice(0, 2) !== "0x") {
    return false;
  }

  const hexPart = address.slice(2);
  const hexRegex = /^[0-9a-fA-F]{40}$/;

  return hexRegex.test(hexPart);
}

export const makeMultisuffix = (count: number = 0, unit: string) => {
  return count > 1 ? `${unit}s` : unit;
};

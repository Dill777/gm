import { useDebouncedCallback } from "use-debounce";

export const useDebouncedCall = (
  callback: (...args: any) => void,
  timeout: number = 400,
  mode = {
    leading: false,
    trailing: true,
  }
) => {
  return useDebouncedCallback(callback, timeout, mode);
};

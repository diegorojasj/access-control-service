import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { AppStore } from "@/core/AppContext";
import { useMutateRequest } from "./useRequest";

const ALGO = "AES-GCM" as const;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const PBKDF2_ITERATIONS = 100_000;

type CryptoSuccess = { success: true; data: string };
type CryptoFailure = { success: false; error: string };
type CryptoResult = CryptoSuccess | CryptoFailure;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const encode = (data: string) => {
    const newData = new TextEncoder().encode(data)
    return btoa(newData.join('-'))
}

export const decode = (base64: string) => {
  try {
    // ? base64 to string
    const data = atob(base64)
    // ? String to array(bytes[] = ArrayBuffer)
    const bytes = data.split('-')
    // ? bytes to string
    const newData = Array.from(bytes, (byte) => String.fromCodePoint(Number(byte))).join('')
    // ? Result
    return { success: true, data: newData }
  } catch (err) {
    return { success: false, error: (err as { message: string }).message }
  }
}

async function deriveKey(secret: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
    const raw = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        "PBKDF2",
        false,
        ["deriveKey"],
    );
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
        raw,
        { name: ALGO, length: 256 },
        false,
        ["encrypt", "decrypt"],
    );
}

export async function encrypt(plaintext: string, secret: string): Promise<CryptoResult> {
    try {
        const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
        const iv   = crypto.getRandomValues(new Uint8Array(IV_BYTES));
        const key  = await deriveKey(secret, salt);

        const ciphertext = await crypto.subtle.encrypt(
            { name: ALGO, iv },
            key,
            new TextEncoder().encode(plaintext),
        );

        const packed = new Uint8Array(SALT_BYTES + IV_BYTES + ciphertext.byteLength);
        packed.set(salt);
        packed.set(iv, SALT_BYTES);
        packed.set(new Uint8Array(ciphertext), SALT_BYTES + IV_BYTES);

        return { success: true, data: btoa(String.fromCharCode(...packed)) };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

export async function decrypt(encoded: string, secret: string): Promise<CryptoResult> {
    try {
        const packed     = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
        const salt       = packed.slice(0, SALT_BYTES) as Uint8Array<ArrayBuffer>;
        const iv         = packed.slice(SALT_BYTES, SALT_BYTES + IV_BYTES) as Uint8Array<ArrayBuffer>;
        const ciphertext = packed.slice(SALT_BYTES + IV_BYTES) as Uint8Array<ArrayBuffer>;

        const key       = await deriveKey(secret, salt);
        const plaintext = await crypto.subtle.decrypt({ name: ALGO, iv }, key, ciphertext);

        return { success: true, data: new TextDecoder().decode(plaintext) };
    } catch (err) {
        return { success: false, error: (err as Error).message };
    }
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ')
  const cookie = cookies.find((c) => c.startsWith(`${name}=`))
  if (!cookie) return null

  // Get the value after the first '=' and decode it
  const value = cookie.substring(name.length + 1)
  try {
    return decodeURIComponent(value)
  } catch {
    // If decoding fails, return the raw value
    return value
  }
}

export const decodePermissions = (permission: string) => {

  try {
    const binaryStrings = permission.split(' ')
    const isValidBinary = binaryStrings.every((bin: string) => /^[01]{8}$/.test(bin))
    if (!isValidBinary) {
      return ''
    }
    if (binaryStrings.length > 200) {
      return ''
    }
    const bytes = new Uint8Array(binaryStrings.map((binary) => Number.parseInt(binary, 2)))
    const decoder = new TextDecoder('utf-8', { fatal: true })
    const decoded = decoder.decode(bytes)
    if (!/^[A-Z]:[A-Z]+$/.test(decoded)) {
      return ''
    }
    if (decoded.length > 100) {
      return ''
    }
    return decoded
  } catch (error) {
    return ''
  }
}
    
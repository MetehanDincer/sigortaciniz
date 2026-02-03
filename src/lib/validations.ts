import { z } from "zod";

/**
 * Shared Zod validation schemas for forms
 */

export const tcSchema = z.string()
    .length(11, "TC Kimlik Numarası 11 haneli olmalıdır.")
    .regex(/^\d+$/, "TC Kimlik Numarası sadece rakamlardan oluşmalıdır.");

export const phoneSchema = z.string()
    .length(11, "Telefon numarası 05XXXXXXXXX formatında 11 haneli olmalıdır.")
    .startsWith("05", "Telefon numarası 05 ile başlamalıdır.");

export const birthDateSchema = z.string()
    .length(10, "Doğum tarihi GG.AA.YYYY formatında olmalıdır.")
    .refine((val) => {
        const parts = val.split(".");
        if (parts.length !== 3) return false;
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        const currentYear = new Date().getFullYear();

        if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
        if (day < 1 || day > 31) return false;
        if (month < 1 || month > 12) return false;
        if (year < 1900 || year > currentYear) return false;

        return true;
    }, "Geçersiz doğum tarihi.");

export const buildYearSchema = z.string()
    .min(4, "Yıl 4 haneli olmalıdır.")
    .refine((val) => {
        const year = parseInt(val);
        const currentYear = new Date().getFullYear();
        return !isNaN(year) && year >= 1900 && year <= currentYear;
    }, "Geçersiz inşa yılı.");

/**
 * Form input masking and formatting utilities
 */

export const maskTC = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 11);
};

export const maskPhone = (value: string) => {
    let cleaned = value.replace(/\D/g, "");

    // Ensure it starts with 0
    if (cleaned.length > 0 && cleaned[0] !== '0') {
        cleaned = '0' + cleaned;
    }

    // Ensure it starts with 05
    if (cleaned.length > 1 && cleaned[1] !== '5') {
        cleaned = cleaned[0] + '5' + cleaned.slice(1);
    }

    return cleaned.slice(0, 11);
};

export const maskBirthDate = (value: string) => {
    let cleaned = value.replace(/\D/g, "");
    let day = cleaned.slice(0, 2);
    let month = cleaned.slice(2, 4);
    let year = cleaned.slice(4, 8);

    // Validate day (max 31)
    if (day.length === 2) {
        let d = parseInt(day);
        if (d > 31) day = "31";
        if (d === 0) day = "01";
    }

    // Validate month (max 12)
    if (month.length === 2) {
        let m = parseInt(month);
        if (m > 12) month = "12";
        if (m === 0) month = "01";
    }

    // Validate year (not in future)
    if (year.length === 4) {
        let y = parseInt(year);
        const currentYear = new Date().getFullYear();
        if (y > currentYear) year = currentYear.toString();
    }

    let result = day;
    if (cleaned.length > 2) result += "." + month;
    if (cleaned.length > 4) result += "." + year;

    return result.slice(0, 10);
};

export const maskNumber = (value: string, maxLength: number = 10) => {
    return value.replace(/\D/g, "").slice(0, maxLength);
};

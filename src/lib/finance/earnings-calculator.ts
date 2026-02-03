import { COMMISSION_RATES, COMPANY_SHARE_RATE, PARTNER_SPLIT_RATE, ProductType } from './commission-rates';

export interface EarningsCalculation {
    productType: ProductType;
    totalPremium: number;
    commissionRate: number;
    baseCommission: number;
    companyShare: number;
    partnerShare: number;
    partnerEarning: number;
}

/**
 * Calculate partner earnings based on product type and premium
 * 
 * Formula: (Total Premium × Commission Rate × 0.70) ÷ 2
 * 
 * Breakdown:
 * 1. Base Commission = Total Premium × Commission Rate
 * 2. Company Share = Base Commission × 30%
 * 3. Partner Share = Base Commission × 70%
 * 4. Partner Earning = Partner Share ÷ 2
 * 
 * @param productType - Type of insurance product
 * @param totalPremium - Total premium amount in TRY
 * @returns Detailed earnings calculation breakdown
 * @throws Error if premium is zero or negative
 */
export function calculateEarnings(
    productType: ProductType,
    totalPremium: number
): EarningsCalculation {
    // Validation
    if (totalPremium <= 0) {
        throw new Error('Total premium must be greater than zero');
    }

    if (!COMMISSION_RATES[productType]) {
        throw new Error(`Invalid product type: ${productType}`);
    }

    // Get commission rate for product
    const commissionRate = COMMISSION_RATES[productType];

    // Step 1: Calculate base commission
    const baseCommission = totalPremium * commissionRate;

    // Step 2: Calculate company share (30%)
    const companyShare = baseCommission * COMPANY_SHARE_RATE;

    // Step 3: Calculate partner share (70%)
    const partnerShare = baseCommission * (1 - COMPANY_SHARE_RATE);

    // Step 4: Calculate final partner earning (50% of partner share)
    const partnerEarning = partnerShare * PARTNER_SPLIT_RATE;

    return {
        productType,
        totalPremium: Number(totalPremium.toFixed(2)),
        commissionRate,
        baseCommission: Number(baseCommission.toFixed(2)),
        companyShare: Number(companyShare.toFixed(2)),
        partnerShare: Number(partnerShare.toFixed(2)),
        partnerEarning: Number(partnerEarning.toFixed(2)),
    };
}

/**
 * Format currency amount in Turkish Lira
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Validate if a product type is valid
 */
export function isValidProductType(type: string): type is ProductType {
    return type in COMMISSION_RATES;
}

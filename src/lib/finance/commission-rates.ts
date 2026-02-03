/**
 * Hard-coded commission rates by product type
 * These rates are immutable and cannot be changed by users
 * 
 * @constant COMMISSION_RATES - Product-specific commission percentages
 */
export const COMMISSION_RATES = {
    trafik: 0.10,    // 10% - Traffic Insurance
    kasko: 0.15,     // 15% - Comprehensive Insurance
    tss: 0.20,       // 20% - Tamamlayıcı Sağlık Sigortası (Supplementary Health)
    oss: 0.20,       // 20% - Özel Sağlık Sigortası (Private Health)
    dask: 0.125,     // 12.5% - Earthquake Insurance
    konut: 0.125,    // 12.5% - Home Insurance
} as const;

export type ProductType = keyof typeof COMMISSION_RATES;

/**
 * Company share coefficient (30%)
 * Partner receives 70% of base commission
 */
export const COMPANY_SHARE_RATE = 0.30;

/**
 * Partner split coefficient (50%)
 * Partner's 70% is split in half
 */
export const PARTNER_SPLIT_RATE = 0.50;

/**
 * Get product type display name in Turkish
 */
export function getProductTypeName(productType: ProductType): string {
    const names: Record<ProductType, string> = {
        trafik: 'Trafik Sigortası',
        kasko: 'Kasko',
        tss: 'Tamamlayıcı Sağlık Sigortası',
        oss: 'Özel Sağlık Sigortası',
        dask: 'DASK',
        konut: 'Konut Sigortası',
    };
    return names[productType];
}

/**
 * Format commission rate as percentage
 */
export function formatCommissionRate(rate: number): string {
    return `%${(rate * 100).toFixed(rate === 0.125 ? 1 : 0)}`;
}

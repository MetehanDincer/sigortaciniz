/**
 * Özellik bayrakları (feature flags)
 * ----------------------------------
 * Uygulamanın belirli bölümlerini tek noktadan açıp kapatmak için kullanılır.
 */

/**
 * SEDDK uyumluluğu nedeniyle GEÇİCİ olarak gizlenen bölümler
 * (müşteri "Giriş Yap" / "Panelim" gibi kısımlar).
 *
 *   true  → bölümler GİZLİ  (mevcut durum / SEDDK süreci)
 *   false → bölümler GÖRÜNÜR (normal hâl)
 *
 * ─────────────────────────────────────────────────────────────
 *  GERİ AÇMAK İÇİN (tek adım):
 *    Aşağıdaki DEFAULT_SEDDK_HIDDEN değerini `false` yapıp deploy edin.
 *
 *    Alternatif (kod değiştirmeden): ortam değişkeni tanımlayın →
 *      NEXT_PUBLIC_SEDDK_HIDDEN=false
 *    (Vercel'de env olarak eklemek + redeploy yeterli.)
 * ─────────────────────────────────────────────────────────────
 *
 * NOT: Bu bayrak YALNIZCA arayüz görünürlüğünü etkiler. İlgili tüm kodlar,
 *      sayfalar ve rotalar dosyalarda çalışır hâlde kalır.
 */
const DEFAULT_SEDDK_HIDDEN = true

export const SEDDK_HIDDEN =
    process.env.NEXT_PUBLIC_SEDDK_HIDDEN != null
        ? process.env.NEXT_PUBLIC_SEDDK_HIDDEN === "true"
        : DEFAULT_SEDDK_HIDDEN

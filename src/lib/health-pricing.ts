// Gösterge (tahmini) sağlık sigortası prim hesaplayıcı.
// ÖNEMLİ: Buradaki rakamlar API'den GELMEZ; müşteriye fikir vermek için
// üretilen ORTALAMA gösterge fiyatlardır. Gerçek teklif, TC kimlik ile sigorta
// şirketi ekranından uzman tarafından verilir.
//
// Rakamları güncellemek için aşağıdaki BASE / *_FACTOR / INSURERS tablolarını
// düzenlemeniz yeterli — hesaplama otomatik uyum sağlar.

export type Product = "tss" | "oss" | "dogum" | "yabanci"
export type Gender = "kadin" | "erkek"

export const PRODUCTS: { value: Product; label: string }[] = [
    { value: "tss", label: "Tamamlayıcı Sağlık Sigortası" },
    { value: "oss", label: "Özel Sağlık Sigortası" },
    { value: "dogum", label: "Doğum Sigortası" },
    { value: "yabanci", label: "Yabancı Sağlık Sigortası" },
]

export const CITIES = [
    "İstanbul", "Ankara", "İzmir",
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Antalya",
    "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
    "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
    "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
    "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta",
    "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis",
    "Kırıkkale", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
    "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize",
    "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ",
    "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
]

// 30 yaş / erkek / İstanbul baz alınarak yıllık baz prim (TL) — GÜNCELLENEBİLİR
// Özel Sağlık Sigortası (oss), Tamamlayıcı Sağlık Sigortası'nın (tss) tam 4 katıdır.
// Tüm çarpanlar (yaş/cinsiyet/şehir/şirket) her iki üründe de aynı olduğu için,
// oss bazını tss × 4 yapmak her teklifte "oss = tss × 4" sonucunu garanti eder.
const TSS_BASE = 11000
const OSS_TSS_KAT = 4 // özel sağlık = tamamlayıcı × 4
const BASE: Record<Product, number> = {
    tss: TSS_BASE,
    oss: TSS_BASE * OSS_TSS_KAT,
    dogum: 15000,
    yabanci: 9000,
}

// Yaşa göre çarpan.
// 0-30 yaş: SABİT (rakip gibi 18-30 arası aynı fiyat).
// 30 sonrası: yıl bazında kademeli ve giderek hızlanan artış.
function ageFactor(age: number): number {
    if (age <= 17) return 0.8
    if (age <= 30) return 1.0
    if (age <= 45) return 1.0 + (age - 30) * 0.03 // 31→1.03 ... 45→1.45
    if (age <= 60) return 1.45 + (age - 45) * 0.05 // 46→1.50 ... 60→2.20
    return 2.2 + (age - 60) * 0.08 // 61→2.28 ...
}

// Cinsiyet çarpanı (doğurganlık çağı vb. — sade tutuldu)
function genderFactor(gender: Gender): number {
    return gender === "kadin" ? 1.05 : 1.0
}

// Şehir çarpanı (büyük şehirlerde hastane maliyeti yüksek)
function cityFactor(city: string): number {
    const c = city.toLocaleLowerCase("tr")
    if (c === "istanbul") return 1.15
    if (c === "ankara") return 1.1
    if (c === "izmir" || c === "kocaeli") return 1.08
    return 1.0
}

export interface InsurerQuote {
    key: string
    name: string
    network: string
    ayaktaAdet: number
    yatarak: string
    girisYasi: string
    gecmisHastalik: boolean
    yenileme: string
    yearly: number
    installments: number
    monthly: number
}

// Sigorta şirketleri — göreli fiyat çarpanı + teminat özellikleri (GÜNCELLENEBİLİR)
const INSURERS = [
    { key: "doga", name: "Doğa Sigorta", mult: 1.0, network: "Klas Network", ayaktaAdet: 6, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "demir", name: "Demir Sigorta", mult: 1.02, network: "Platin Network", ayaktaAdet: 5, girisYasi: "0-60 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 9 },
    { key: "neova", name: "Neova Sigorta", mult: 1.04, network: "Geniş Ağ", ayaktaAdet: 5, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "ankara", name: "Ankara Sigorta", mult: 1.06, network: "Standart Network", ayaktaAdet: 5, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "hdi", name: "HDI Sigorta", mult: 1.08, network: "Geniş Ağ", ayaktaAdet: 6, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "turkiye", name: "Türkiye Sigorta", mult: 1.1, network: "Geniş Ağ", ayaktaAdet: 6, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 9 },
    { key: "quick", name: "Quick Sigorta", mult: 1.12, network: "Standart Network", ayaktaAdet: 4, girisYasi: "0-65 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "mapfre", name: "Mapfre Sigorta", mult: 1.15, network: "Geniş Ağ", ayaktaAdet: 6, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "anadolu", name: "Anadolu Sigorta", mult: 1.18, network: "Platin Network", ayaktaAdet: 7, girisYasi: "0-65 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 9 },
    { key: "axa", name: "AXA Sigorta", mult: 1.22, network: "Geniş Ağ", ayaktaAdet: 7, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "metlife", name: "MetLife", mult: 1.25, network: "Standart Network", ayaktaAdet: 5, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "allianz", name: "Allianz Sigorta", mult: 1.28, network: "Platin Network", ayaktaAdet: 8, girisYasi: "0-65 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
    { key: "acibadem", name: "Acıbadem Sigorta", mult: 1.32, network: "Premium Network", ayaktaAdet: 8, girisYasi: "0-64 Yaş", yenileme: "ÖBYG - 3 Yıl", installments: 8 },
]

export interface EstimateInput {
    product: Product
    gender: Gender
    age: number
    city: string
}

/** Gösterge ortalama primleri hesaplar (ucuzdan pahalıya sıralı). */
export function estimatePremiums({ product, gender, age, city }: EstimateInput): InsurerQuote[] {
    const base = BASE[product] * ageFactor(age) * genderFactor(gender) * cityFactor(city)
    return INSURERS.map((ins) => {
        const yearly = Math.round((base * ins.mult) / 10) * 10
        const monthly = Math.round(yearly / ins.installments / 10) * 10
        return {
            key: ins.key,
            name: ins.name,
            network: ins.network,
            ayaktaAdet: ins.ayaktaAdet,
            yatarak: "Limitsiz",
            girisYasi: ins.girisYasi,
            gecmisHastalik: false,
            yenileme: ins.yenileme,
            yearly,
            installments: ins.installments,
            monthly,
        }
    }).sort((a, b) => a.yearly - b.yearly)
}

export function formatTL(n: number): string {
    return n.toLocaleString("tr-TR")
}

import { MetadataRoute } from 'next'
import { getAgencyConfig } from '@/lib/agency'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const agency = await getAgencyConfig()
    const baseUrl = `https://${agency?.domain || 'uygunsigortaci.com'}`

    const routes = [
        '',
        '/hizmetlerimiz',
        '/blog',
        '/blog/trafik-sigortasi-nedir-neleri-kapsar',
        '/blog/kasko-yaptirirken-dikkat-edilmesi-gerekenler',
        '/blog/tamamlayici-saglik-sigortasi-avantajlari',
        '/blog/dask-nedir-zorunlu-mu',
        '/blog/ozel-saglik-sigortasi-ve-tss-farki',
        '/blog/konut-sigortasi-neden-gerekli',
        '/blog/kronik-hastaligi-olanlar-tss-yaptirabilir-mi',
        '/blog/bebek-ve-cocuklar-icin-saglik-sigortasi',
        '/blog/saglik-sigortasi-vergi-indirimi-nasil-yapilir',
        '/teklif/trafik',
        '/teklif/kasko',
        '/teklif/dask',
        '/teklif/konut-sigortasi',
        '/teklif/tamamlayici-saglik',
        '/teklif/ozel-saglik',
        '/iptal/trafik',
        '/iptal/kasko',
        '/kurumsal/egitim',
        '/iletisim',
        '/gizlilik-politikasi',
        '/kullanim-kosullari',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))
}

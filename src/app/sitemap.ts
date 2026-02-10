import { MetadataRoute } from 'next'
import { getAgencyConfig } from '@/lib/agency'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const agency = await getAgencyConfig()
    const baseUrl = `https://${agency?.domain || 'uygunsigortaci.com'}`

    const routes = [
        '',
        '/blog',
        '/teklif/trafik',
        '/teklif/kasko',
        '/teklif/dask',
        '/teklif/konut-sigortasi',
        '/teklif/tamamlayici-saglik',
        '/teklif/ozel-saglik',
        '/iletisim',
        '/hakkimizda',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))
}

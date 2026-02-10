import { MetadataRoute } from 'next'
import { getAgencyConfig } from '@/lib/agency'

export default async function robots(): Promise<MetadataRoute.Robots> {
    const agency = await getAgencyConfig()
    const baseUrl = `https://${agency?.domain || 'uygunsigortaci.com'}`

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/panel/', '/auth/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}

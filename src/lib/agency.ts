import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function getAgencyConfig() {
    const headerList = await headers()
    const host = headerList.get('x-agency-host') || 'uygunsigortaci.com'

    // Clean host for local dev if needed
    const cleanHost = host.replace(':3000', '')

    const supabase = await createClient()

    // Try to find agency by domain
    const { data: agency } = await supabase
        .from('agencies')
        .select('*')
        .eq('domain', cleanHost)
        .eq('is_active', true)
        .single()

    if (agency) return agency

    // Fallback to default agency (Uygunsigortacı)
    const { data: defaultAgency } = await supabase
        .from('agencies')
        .select('*')
        .eq('slug', 'uygun-sigortaci')
        .single()

    return defaultAgency
}

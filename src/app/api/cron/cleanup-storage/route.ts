import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: Request) {
    // Basic security check via Auth header or secret query param
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const THREE_DAYS_AGO = new Date()
    THREE_DAYS_AGO.setDate(THREE_DAYS_AGO.getDate() - 3)

    try {
        console.log('🧹 [Cleanup Cron] Starting storage cleanup for files older than 3 days...')

        // 1. Find leads older than 3 days that still have files
        const { data: oldLeads, error: fetchError } = await supabase
            .from('leads')
            .select('id, offer_url, policy_url, created_at')
            .lt('created_at', THREE_DAYS_AGO.toISOString())
            .or('offer_url.is.not.null,policy_url.is.not.null')

        if (fetchError) throw fetchError
        if (!oldLeads || oldLeads.length === 0) {
            return NextResponse.json({ message: 'No old files to cleanup' })
        }

        const filesToDelete: string[] = []
        const leadIdsToUpdate: string[] = []

        oldLeads.forEach(lead => {
            if (lead.offer_url) {
                const parts = lead.offer_url.split('/leads/')
                if (parts.length > 1) filesToDelete.push(parts[1])
            }
            if (lead.policy_url) {
                const parts = lead.policy_url.split('/leads/')
                if (parts.length > 1) filesToDelete.push(parts[1])
            }
            leadIdsToUpdate.push(lead.id)
        })

        // 2. Delete files from storage
        if (filesToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('leads')
                .remove(filesToDelete)

            if (storageError) console.error('Storage Cleanup Error:', storageError)
        }

        // 3. Update database to clear URLs
        const { error: updateError } = await supabase
            .from('leads')
            .update({
                offer_url: null,
                policy_url: null
            })
            .in('id', leadIdsToUpdate)

        if (updateError) throw updateError

        return NextResponse.json({
            message: 'Cleanup completed',
            filesDeleted: filesToDelete.length,
            leadsUpdated: leadIdsToUpdate.length
        })

    } catch (error: any) {
        console.error('Cleanup Cron Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

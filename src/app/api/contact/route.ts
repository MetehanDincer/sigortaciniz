
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, referenceNumber, ...data } = body

    // Get affiliate ID from body, cookies or current session
    const cookieStore = await cookies()
    let affiliateId: string | null | undefined = referenceNumber || cookieStore.get('affiliate_id')?.value
    let referralSource: string | null | undefined = cookieStore.get('affiliate_source')?.value

    // Sanitize values to ensure empty strings are treated as null/undefined
    if (typeof affiliateId === 'string' && affiliateId.trim() === '') {
      affiliateId = null
    }
    if (typeof referralSource === 'string' && referralSource.trim() === '') {
      referralSource = null
    }

    const supabase = await createClient()

    /* 
       DİKKAT: Giriş yapmış kullanıcının affiliate_id'sini otomatik alma (fallback) mantığı kaldırıldı.
       Böylece partnerler kendi panelleri dışında (normal site gezginleri gibi) test yaparken 
       talepler yanlışlıkla kendilerine atanmaz. Partnerler panelden işlem yaparken bu ID'yi 
       zaten form içeriğiyle (body) gönderiyor.
    */
    // const { data: { user } } = await supabase.auth.getUser()
    // if (user) {
    //   const { data: profile } = await supabase.from('profiles').select('affiliate_id').eq('id', user.id).single()
    //   if (profile) affiliateId = profile.affiliate_id
    // }

    // 1. Console Log
    console.log("---------------------------------------------------")
    console.log("📨 YENİ FORM TALEBİ GELDİ!")
    console.log("TÜR:", type)
    console.log("REFERANS:", affiliateId || "Doğrudan")
    console.log("VERİLER:", JSON.stringify(data, null, 2))
    console.log("---------------------------------------------------")

    // 2. Email Notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sigortaciniz.2025@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: '"Uygun Sigortacı Web Sitesi" <sigortaciniz.2025@gmail.com>',
      to: "sigortaciniz.2025@gmail.com",
      subject: `Yeni Sigorta Teklif Talebi: ${type} ${affiliateId ? '(İş Ortağı)' : ''}`,
      html: `
        <h2>Yeni Teklif Talebi Var! 🚀</h2>
        <p><strong>Sigorta Türü:</strong> ${type}</p>
        <p><strong>İş Ortağı ID:</strong> ${affiliateId || "Doğrudan Giriş"}</p>
        <hr />
        <h3>Müşteri Bilgileri:</h3>
        <ul style="list-style: none; padding: 0;">
          ${Object.entries(data)
          .map(([key, value]) => `
              <li style="margin-bottom: 10px;">
                <strong style="text-transform: capitalize;">${key.replace(/([A-Z])/g, " $1")}:</strong> 
                ${value}
              </li>
            `)
          .join("")}
        </ul>
      `,
    }

    if (process.env.EMAIL_PASSWORD) {
      await transporter.sendMail(mailOptions)
    }

    // 3. Round Robin Assignment Logic
    // Get all active admins ordered by admin_code
    const { data: admins, error: adminsError } = await supabase
      .from('admin_profiles')
      .select('id, admin_code')
      .eq('is_active', true)
      .order('admin_code', { ascending: true })

    if (adminsError) {
      console.error("❌ Admin listesi çekilirken hata oluştu:", adminsError)
    }

    let assignedAdminId = null
    let assignedAdminCode = "Sistem"

    if (admins && admins.length > 0) {
      // Get the last assigned admin_id from leads to see who's next
      const { data: lastLeads } = await supabase
        .from('leads')
        .select('assigned_admin_id')
        .not('assigned_admin_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)

      const lastLead = lastLeads?.[0]

      if (!lastLead) {
        // First lead ever: assign to the first admin
        assignedAdminId = admins[0].id
        assignedAdminCode = admins[0].admin_code
        console.log("ℹ️ İlk talep: Atanan Admin:", assignedAdminCode)
      } else {
        // Find the index of the last admin and pick the next one
        const lastIndex = admins.findIndex(a => a.id === lastLead.assigned_admin_id)
        const nextIndex = (lastIndex === -1) ? 0 : (lastIndex + 1) % admins.length
        assignedAdminId = admins[nextIndex].id
        assignedAdminCode = admins[nextIndex].admin_code
        console.log("ℹ️ Round-Robin Atama: Önceki İndex:", lastIndex, "Sonraki:", assignedAdminCode)
      }
    } else {
      console.warn("⚠️ Hiç aktif admin bulunamadı! Talep sahipsiz kalabilir.")
    }

    // 4. Save to Supabase Leads table
    let lead = null
    let dbError = null

    // Try to insert and select (works for logged in users/admins)
    const result = await supabase.from('leads').insert({
      affiliate_id: affiliateId || null,
      type: type,
      details: { ...data, referral_source: referralSource },
      status: 'Bekliyor',
      assigned_admin_id: assignedAdminId
    }).select().single()

    lead = result.data
    dbError = result.error

    // FALLBACK: If RLS prevents selection (common for guests), perform a plain insert
    if (dbError && (dbError.code === '42501' || dbError.message?.includes('permission denied'))) {
      console.log("ℹ️ RLS uyarısı (Misafir Kullanıcı), sadece kayıt yapılıyor...")
      const retryResult = await supabase.from('leads').insert({
        affiliate_id: affiliateId || null,
        type: type,
        details: { ...data, referral_source: referralSource },
        status: 'Bekliyor',
        assigned_admin_id: assignedAdminId
      })

      if (!retryResult.error) {
        console.log("✅ Talep (Sadece Kayıt) başarıyla yapıldı.")
        return NextResponse.json({ success: true, message: "Form başarıyla alındı." })
      } else {
        dbError = retryResult.error
      }
    }

    if (dbError) {
      console.error("❌ Veritabanı kayıt hatası:", dbError)
      return NextResponse.json(
        { success: false, message: "Talep kaydedilirken bir hata oluştu.", error: dbError.message },
        { status: 500 }
      )
    }

    console.log("✅ Talep başarıyla kaydedildi. ID:", lead?.id)

    // 5. Create Initial Log
    if (lead) {
      const { error: logError } = await supabase.from('lead_logs').insert({
        lead_id: lead.id,
        action: 'ASSIGNED',
        details: `Teklif talebi alındı ve otomatik olarak ${assignedAdminCode} kodlu admine atandı.`
      })
      if (logError) console.error("⚠️ Log kaydı oluşturulamadı:", logError)
    }

    return NextResponse.json({ success: true, message: "Form başarıyla alındı." })
  } catch (error) {
    console.error("❌ Form işleme hatası:", error)
    return NextResponse.json(
      { success: false, message: "Bir hata oluştu." },
      { status: 500 }
    )
  }
}

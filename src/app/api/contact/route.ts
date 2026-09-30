
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { cookies } from "next/headers"
import { createServiceClient } from "@/lib/supabase/service"

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

    // Reklam/kaynak bilgisi (UTM + gclid) — AttributionCapture tarafından yazılan çerezlerden
    const attributionKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'] as const
    const attribution: Record<string, string> = {}
    for (const key of attributionKeys) {
      const val = cookieStore.get(key)?.value
      if (val && val.trim() !== '') attribution[key] = val
    }

    // Service-role client: sunucu tarafı güvenilir kayıt (RLS'e takılmaz).
    // Misafir müşterilerde "insert edildi ama geri okunamadı (RLS)" kaynaklı
    // sahte hata sorununu çözer.
    const supabase = createServiceClient()

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

    // 2b. Müşteriye karşılama e-postası (form içinde e-posta verildiyse)
    const customerEmail = typeof data.email === 'string' ? data.email.trim() : ''
    if (customerEmail && process.env.EMAIL_PASSWORD) {
      const welcomeMailOptions = {
        from: '"Uygun Sigortacı" <sigortaciniz.2025@gmail.com>',
        to: customerEmail,
        subject: "Talebiniz bize ulaştı | Uygun Sigortacı",
        text: [
          "Merhaba,",
          "",
          "Bize ulaştığınız için teşekkür ederiz.",
          "",
          "Talebiniz başarıyla alınmıştır. Uzman ekibimiz sizin için uygun sigorta seçeneklerini değerlendirecek ve en kısa sürede sizinle iletişime geçecektir.",
          "",
          "Bizim için önemli olan yalnızca poliçe düzenlemek değil; ihtiyacınızı doğru anlamak, doğru teminatı sunmak ve ihtiyaç duyduğunuzda yanınızda olmak.",
          "",
          "Uygun Sigortacı ailesine hoş geldiniz.",
          "",
          "Uygun Sigortacı Ekibi",
          "Sigortanız bizden sorulur.",
        ].join("\n"),
        html: `
          <div style="background:#f5f3ff;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
              <tr>
                <td style="background:#7c3aed;padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold;">
                  Uygunsigortacı.com
                </td>
              </tr>
              <tr>
                <td style="padding:28px;color:#1f2937;font-size:15px;line-height:1.6;">
                  <p style="margin:0 0 16px;">Merhaba,</p>
                  <p style="margin:0 0 16px;">Bize ulaştığınız için teşekkür ederiz.</p>
                  <p style="margin:0 0 16px;">Talebiniz başarıyla alınmıştır. Uzman ekibimiz sizin için uygun sigorta seçeneklerini değerlendirecek ve en kısa sürede sizinle iletişime geçecektir.</p>
                  <p style="margin:0 0 16px;">Bizim için önemli olan yalnızca poliçe düzenlemek değil; ihtiyacınızı doğru anlamak, doğru teminatı sunmak ve ihtiyaç duyduğunuzda yanınızda olmak.</p>
                  <p style="margin:0 0 24px;font-weight:bold;color:#7c3aed;">Uygun Sigortacı ailesine hoş geldiniz.</p>
                  <p style="margin:0;font-weight:bold;">Uygun Sigortacı Ekibi</p>
                  <p style="margin:4px 0 0;color:#6b7280;font-style:italic;">Sigortanız bizden sorulur.</p>
                </td>
              </tr>
            </table>
          </div>
        `,
      }
      try {
        await transporter.sendMail(welcomeMailOptions)
      } catch (welcomeMailError) {
        console.error("⚠️ Müşteri karşılama maili gönderilemedi:", welcomeMailError)
      }
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

    // 4. Save to Supabase Leads table (service-role ile RLS bypass)
    const { data: lead, error: dbError } = await supabase.from('leads').insert({
      affiliate_id: affiliateId || null,
      type: type,
      details: { ...data, referral_source: referralSource, attribution },
      status: 'Bekliyor',
      assigned_admin_id: assignedAdminId
    }).select().single()

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

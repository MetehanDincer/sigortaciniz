
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
    let affiliateId = referenceNumber || cookieStore.get('affiliate_id')?.value
    let referralSource = cookieStore.get('affiliate_source')?.value

    const supabase = await createClient()

    // Fallback: If no affiliateId yet, check if the user is logged in
    if (!affiliateId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('affiliate_id').eq('id', user.id).single()
        if (profile) affiliateId = profile.affiliate_id
      }
    }

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
      from: '"Sigortacınız Web Sitesi" <sigortaciniz.2025@gmail.com>',
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
    const { data: admins } = await supabase
      .from('admin_profiles')
      .select('id, admin_code')
      .eq('is_active', true)
      .order('admin_code', { ascending: true })

    let assignedAdminId = null
    let assignedAdminCode = "Sistem"

    if (admins && admins.length > 0) {
      // Get the last assigned admin_id from leads to see who's next
      const { data: lastLead } = await supabase
        .from('leads')
        .select('assigned_admin_id')
        .not('assigned_admin_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!lastLead) {
        // First lead ever: assign to the first admin
        assignedAdminId = admins[0].id
        assignedAdminCode = admins[0].admin_code
      } else {
        // Find the index of the last admin and pick the next one
        const lastIndex = admins.findIndex(a => a.id === lastLead.assigned_admin_id)
        const nextIndex = (lastIndex + 1) % admins.length
        assignedAdminId = admins[nextIndex].id
        assignedAdminCode = admins[nextIndex].admin_code
      }
    }

    // 4. Save to Supabase Leads table
    const { data: lead, error: dbError } = await supabase.from('leads').insert({
      affiliate_id: affiliateId || null,
      type: type,
      details: { ...data, referral_source: referralSource },
      status: 'Bekliyor',
      assigned_admin_id: assignedAdminId
    }).select().single()

    if (dbError) {
      console.error("❌ Veritabanı kayıt hatası:", dbError)
    }

    // 5. Create Initial Log
    if (lead) {
      await supabase.from('lead_logs').insert({
        lead_id: lead.id,
        action: 'ASSIGNED',
        details: `Teklif talebi alındı ve otomatik olarak ${assignedAdminCode} kodlu admine atandı.`
      })
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

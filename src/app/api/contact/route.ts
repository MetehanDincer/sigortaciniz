
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

    // 3. Save to Supabase Leads table
    const { error: dbError } = await supabase.from('leads').insert({
      affiliate_id: affiliateId || null,
      type: type,
      details: data,
      status: 'Bekliyor'
    })

    if (dbError) {
      console.error("❌ Veritabanı kayıt hatası:", dbError)
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

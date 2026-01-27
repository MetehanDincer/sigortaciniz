
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    // 1. Konsola yazdır (Geliştirme aşamasında kontrol için)
    console.log("---------------------------------------------------")
    console.log("📨 YENİ FORM TALEBİ GELDİ!")
    console.log("TÜR:", type)
    console.log("VERİLER:", JSON.stringify(data, null, 2))
    console.log("---------------------------------------------------")

    // 2. Email Gönderme İşlemi
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
      subject: `Yeni Sigorta Teklif Talebi: ${type}`,
      html: `
        <h2>Yeni Teklif Talebi Var! 🚀</h2>
        <p><strong>Sigorta Türü:</strong> ${type}</p>
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
      console.log("✅ Email başarıyla servise iletildi!")
    } else {
      console.log("⚠️ EMAIL_PASSWORD eksik olduğu için mail atılamadı (Sadece konsol logu).")
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

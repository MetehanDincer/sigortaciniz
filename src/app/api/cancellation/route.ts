
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()

        const type = formData.get("type") as string
        const tcNumber = formData.get("tcNumber") as string
        const plate = formData.get("plate") as string
        const file = formData.get("file") as File | null

        console.log("---------------------------------------------------")
        console.log("📨 YENİ İPTAL TALEBİ GELDİ!")
        console.log("TÜR:", type)
        console.log("TC:", tcNumber)
        console.log("PLAKA:", plate)
        console.log("DOSYA:", file ? file.name : "Yok")
        console.log("---------------------------------------------------")

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sigortaciniz.2025@gmail.com",
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        let attachments = []
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer())
            attachments.push({
                filename: file.name,
                content: buffer,
            })
        }

        const mailOptions = {
            from: '"Sigortacınız Web Sitesi" <sigortaciniz.2025@gmail.com>',
            to: "sigortaciniz.2025@gmail.com",
            subject: `🚨 İptal Talebi: ${type} - ${plate}`,
            html: `
        <h2>Yeni Poliçe İptal Talebi! 🚨</h2>
        <p><strong>Sigorta Türü:</strong> ${type}</p>
        <p><strong>TC Kimlik No:</strong> ${tcNumber}</p>
        <p><strong>Plaka:</strong> ${plate}</p>
        <hr />
        <p>Noter satış sözleşmesi ekte yer almaktadır.</p>
      `,
            attachments: attachments,
        }

        if (process.env.EMAIL_PASSWORD) {
            await transporter.sendMail(mailOptions)
        } else {
            console.warn("⚠️ EMAIL_PASSWORD environment variable is not set. Email not sent.")
        }

        return NextResponse.json({ success: true, message: "İptal talebi başarıyla iletildi." })
    } catch (error) {
        console.error("❌ İptal talebi işleme hatası:", error)
        return NextResponse.json(
            { success: false, message: "Bir hata oluştu." },
            { status: 500 }
        )
    }
}

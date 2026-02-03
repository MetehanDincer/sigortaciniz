"use client"

import { QRCodeSVG } from "qrcode.react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Share2, Linkedin, Twitter, Instagram, Copy, Check } from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface QRCodeDialogProps {
    value: string
    title?: string
    partnerName?: string
}

export function QRCodeDialog({ value, title = "Referans QR Kodu", partnerName = "İş Ortağımız" }: QRCodeDialogProps) {
    // Extract Ref and Base URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    let refCode = ''
    try {
        const urlObj = new URL(value, baseUrl)
        refCode = urlObj.searchParams.get('ref') || ''
    } catch (e) { }

    const qrValue = refCode ? `${baseUrl}/?ref=${refCode}&src=qr` : value
    const linkValue = refCode ? `${baseUrl}/?ref=${refCode}&src=link` : value
    const socialValue = refCode ? `${baseUrl}/?ref=${refCode}&src=social` : value

    const downloadQRCode = () => {
        // Create a temporary canvas to convert SVG to PNG
        const svg = document.getElementById("qr-code-svg")
        if (!svg) return

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        // Serialize SVG XML
        const serializer = new XMLSerializer()
        const svgStr = serializer.serializeToString(svg)
        const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" })
        const url = URL.createObjectURL(svgBlob)

        img.onload = () => {
            canvas.width = 1000 // High resolution
            canvas.height = 1000
            if (ctx) {
                // Increase canvas height effectively to make room for text
                const canvasWidth = 1000
                const canvasHeight = 1200 // +200px for text area
                canvas.width = canvasWidth
                canvas.height = canvasHeight

                // White Background
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw Text
                ctx.fillStyle = "#334155"; // Slate-700
                ctx.font = "bold 50px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`Sigortacınız / ${partnerName}`, canvasWidth / 2, 100);

                // Draw QR Image
                ctx.drawImage(img, 0, 150, 1000, 1000)

                const pngUrl = canvas.toDataURL("image/png")
                const downloadLink = document.createElement("a")
                downloadLink.href = pngUrl
                downloadLink.download = `sigortaciniz-qr-code.png`
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)
                URL.revokeObjectURL(url)
            }
        }
        img.src = url
    }

    const shareUrl = linkValue
    const shareText = "Sigorta teklifi almak için QR kodumu kullanın veya linke tıklayın!"

    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                // Try to share the image if possible, otherwise just text/url
                const svg = document.getElementById("qr-code-svg")
                if (svg) {
                    const canvas = document.createElement("canvas")
                    const ctx = canvas.getContext("2d")
                    const img = new Image()
                    const serializer = new XMLSerializer()
                    const svgStr = serializer.serializeToString(svg)
                    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" })
                    const url = URL.createObjectURL(svgBlob)

                    img.onload = async () => {
                        canvas.width = 1000
                        canvas.height = 1000
                        if (ctx) {
                            const canvasWidth = 1000
                            const canvasHeight = 1200
                            canvas.width = canvasWidth
                            canvas.height = canvasHeight

                            ctx.fillStyle = "white";
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            ctx.fillStyle = "#334155";
                            ctx.font = "bold 50px sans-serif";
                            ctx.textAlign = "center";
                            ctx.fillText(`Sigortacınız / ${partnerName}`, canvasWidth / 2, 100);

                            ctx.drawImage(img, 0, 150, 1000, 1000)

                            canvas.toBlob(async (blob) => {
                                if (blob) {
                                    const file = new File([blob], "sigortaciniz-qr.png", { type: "image/png" })
                                    try {
                                        await navigator.share({
                                            title: 'Sigortacınız Referans',
                                            text: shareText,
                                            files: [file]
                                        })
                                    } catch (e) {
                                        // Fallback to text share if file share fails
                                        await navigator.share({
                                            title: 'Sigortacınız Referans',
                                            text: shareText,
                                            url: shareUrl
                                        })
                                    }
                                }
                            }, 'image/png')
                        }
                    }
                    img.src = url
                } else {
                    await navigator.share({
                        title: 'Sigortacınız Referans',
                        text: shareText,
                        url: shareUrl
                    })
                }
            } catch (error) {
                console.error("Error sharing:", error)
            }
        } else {
            alert("Mobil cihazlarda veya desteklenen tarayıcılarda bu özelliği kullanabilirsiniz.")
        }
    }

    const openSocial = (network: 'twitter' | 'linkedin' | 'whatsapp') => {
        let url = ''
        switch (network) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(socialValue)}`
                break
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(socialValue)}`
                break
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + socialValue)}`
                break
        }
        window.open(url, '_blank')
    }

    const [isCopied, setIsCopied] = useState(false)
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(linkValue)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error("Link kopyalanamadı:", err)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 font-bold shadow-sm border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <QrCode className="h-4 w-4" /> QR Oluştur
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Bu QR kodu müşterilerinizle paylaşarak onları doğrudan referanslı teklif sayfanıza yönlendirebilirsiniz.
                        <br /><br />
                        <span className="font-bold text-slate-700">QR kodunuzu müşterilerinize okutarak doğrudan teklif verebilir, alınan teklifin sonuçlarınızı profilden görüntüleyebilirsiniz.</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-center font-bold text-lg text-slate-800 mb-4 bg-white px-6 py-2 rounded-lg shadow-sm border border-slate-100">
                        Sigortacınız / {partnerName}
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={qrValue}
                            size={250}
                            level={"H"}
                            includeMargin={true}
                            imageSettings={{
                                src: "/logo.jpg",
                                x: undefined,
                                y: undefined,
                                height: 40,
                                width: 40,
                                excavate: true,
                            }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-4 font-medium text-center max-w-[250px]">
                        Kamerayı açıp okuttuklarında otomatik olarak sizin referans kodunuzla işlem yapacaklar.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" size="icon" className="w-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border-none" onClick={() => openSocial('whatsapp')} title="WhatsApp">
                            <span className="font-bold text-lg">W</span>
                        </Button>
                        <Button variant="outline" size="icon" className="w-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 border-none" onClick={() => openSocial('twitter')} title="Twitter / X">
                            <Twitter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 border-none" onClick={() => openSocial('linkedin')} title="LinkedIn">
                            <Linkedin className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-full bg-pink-500/10 text-pink-600 hover:bg-pink-500/20 border-none" onClick={handleWebShare} title="Instagram & Diğer (Mobil)">
                            <Instagram className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2 w-full">
                        <Button onClick={copyLink} variant="outline" className="flex-1 gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {isCopied ? "Kopyalandı" : "Linki Kopyala"}
                        </Button>
                        <Button onClick={downloadQRCode} className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700">
                            <Download className="h-4 w-4" /> PNG İndir
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

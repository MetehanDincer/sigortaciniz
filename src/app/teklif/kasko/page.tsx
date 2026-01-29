"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Car, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const formSchema = z.object({
    tcNumber: z.string().length(11, "TC Kimlik Numarası 11 haneli olmalıdır."),
    birthDate: z.string().min(1, "Doğum tarihi zorunludur."),
    plateNumber: z.string()
        .min(1, "Plaka zorunludur.")
        .regex(/^[A-Z0-9]+$/, "Plaka sadece büyük harf ve rakam içerebilir, boşluk kullanmayın.")
        .transform(val => val.toUpperCase().replace(/\s/g, '')),
    licenseSerial: z.string()
        .regex(/^[A-Z]{2}\d{6}$/, "Ruhsat Seri No 2 harf ve 6 rakam olmalıdır (örn: AB123456).")
        .transform(val => val.toUpperCase().replace(/\s/g, '')),
    phoneNumber: z.string().min(10, "Telefon numarası en az 10 haneli olmalıdır."),
})

type FormValues = z.infer<typeof formSchema>

export default function KaskoSigortasiPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        try {
            // 1. Send email notification
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "Kasko Sigortası", ...data }),
            })

            // 2. Format birth date as DD.MM.YYYY
            const formattedDate = data.birthDate.replace(/(\d{2})(\d{2})(\d{4})/, '$1.$2.$3');

            // 3. Redirect to WhatsApp
            const message = `Merhaba, Kasko Sigortası teklifi almak istiyorum:\n\n` +
                `🆔 TC: ${data.tcNumber}\n` +
                `📅 Doğum Tarihi: ${formattedDate}\n` +
                `🚗 Plaka: ${data.plateNumber}\n` +
                `📄 Ruhsat Seri: ${data.licenseSerial}\n` +
                `📞 Telefon: ${data.phoneNumber}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/905379473464?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            setIsSuccess(true)
        } catch (error) {
            alert("Bir hata oluştu. Lütfen tekrar deneyiniz.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                <div className="mb-6 rounded-full bg-green-100 p-6">
                    <Send className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold">Talebiniz Alındı!</h1>
                <p className="mb-8 max-w-md text-muted-foreground">
                    Kasko sigortası talebiniz bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <Button asChild>
                    <Link href="/">Ana Sayfaya Dön</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-muted/30 py-12">
                <div className="container max-w-md px-4 mx-auto">
                    <div className="rounded-xl border bg-card p-8 shadow-sm">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <div className="mb-4 rounded-full bg-primary/10 p-4">
                                <Car className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold">Kasko Sigortası Teklifi</h1>
                            <p className="text-muted-foreground">
                                Kapsamlı kasko sigortası için bilgilerinizi giriniz.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="tcNumber">TC Kimlik Numarası</Label>
                                <Input
                                    id="tcNumber"
                                    placeholder="11 haneli TC no"
                                    maxLength={11}
                                    {...register("tcNumber")}
                                />
                                {errors.tcNumber && (
                                    <span className="text-xs text-destructive">
                                        {errors.tcNumber.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birthDate">Doğum Tarihi</Label>
                                <Input
                                    id="birthDate"
                                    placeholder="aa.gg.yyyy"
                                    {...register("birthDate")}
                                />
                                {errors.birthDate && (
                                    <span className="text-xs text-destructive">
                                        {errors.birthDate.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="plateNumber">Plaka</Label>
                                <Input
                                    id="plateNumber"
                                    placeholder="34 ABC 123"
                                    className="uppercase"
                                    {...register("plateNumber")}
                                />
                                {errors.plateNumber && (
                                    <span className="text-xs text-destructive">
                                        {errors.plateNumber.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="licenseSerial">Ruhsat Seri No</Label>
                                <Input
                                    id="licenseSerial"
                                    placeholder="Örn: AB 123456"
                                    {...register("licenseSerial")}
                                />
                                {errors.licenseSerial && (
                                    <span className="text-xs text-destructive">
                                        {errors.licenseSerial.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Telefon Numarası</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="05XX XXX XX XX"
                                    {...register("phoneNumber")}
                                />
                                {errors.phoneNumber && (
                                    <span className="text-xs text-destructive">
                                        {errors.phoneNumber.message}
                                    </span>
                                )}
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? "Gönderiliyor..." : "Teklif Al"}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Heart, ArrowLeft, Send } from "lucide-react"
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
    gender: z.enum(["erkek", "kadin"]).refine((val) => val !== undefined, {
        message: "Cinsiyet seçimi zorunludur.",
    }),
    phoneNumber: z.string().min(10, "Telefon numarası en az 10 haneli olmalıdır."),
})

type FormValues = z.infer<typeof formSchema>

export default function TamamlayiciSaglikPage() {
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
                body: JSON.stringify({ type: "Tamamlayıcı Sağlık Sigortası", ...data }),
            })

            // 2. Format birth date as DD.MM.YYYY
            const formattedDate = data.birthDate.replace(/(\d{2})(\d{2})(\d{4})/, '$1.$2.$3');

            const message = `Merhaba, Tamamlayıcı Sağlık Sigortası teklifi almak istiyorum:\n\n` +
                `🆔 TC: ${data.tcNumber}\n` +
                `📅 Doğum Tarihi: ${formattedDate}\n` +
                `👤 Cinsiyet: ${data.gender}\n` +
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
                    Tamamlayıcı sağlık sigortası talebiniz bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
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
                                <Heart className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold">Tamamlayıcı Sağlık Sigortası</h1>
                            <p className="text-muted-foreground">
                                Teklif almak için lütfen bilgilerinizi giriniz.
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
                                <Label>Cinsiyet</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="erkek"
                                            {...register("gender")}
                                            className="w-4 h-4 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Erkek</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="kadin"
                                            {...register("gender")}
                                            className="w-4 h-4 text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Kadın</span>
                                    </label>
                                </div>
                                {errors.gender && (
                                    <span className="text-xs text-destructive">
                                        {errors.gender.message}
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

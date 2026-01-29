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

const formSchema = z.object({
    tcNumber: z.string().length(11, "TC Kimlik Numarası 11 haneli olmalıdır."),
    birthDate: z.string().min(1, "Doğum tarihi zorunludur."),
    gender: z.enum(["erkek", "kadin"]).refine((val) => val !== undefined, {
        message: "Cinsiyet seçimi zorunludur.",
    }),
    phoneNumber: z.string().min(10, "Telefon numarası en az 10 haneli olmalıdır."),
})

type FormValues = z.infer<typeof formSchema>

export default function HealthInsurancePage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })

    // Auto-format birth date with dots (DD.MM.YYYY)
    const formatBirthDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) value = value.slice(0, 2) + '.' + value.slice(2);
        if (value.length >= 5) value = value.slice(0, 5) + '.' + value.slice(5);
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value;
    };

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        try {
            // 1. Send email notification
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "Sağlık Sigortası", ...data }),
            })

            if (!response.ok) console.error("Email hatası");

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
                    Sağlık sigortası talebiniz bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <Button asChild>
                    <Link href="/">Ana Sayfaya Dön</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="container max-w-md px-4">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Ana Sayfaya Dön
                </Link>

                <div className="rounded-xl border bg-card p-8 shadow-sm">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-4 rounded-full bg-primary/10 p-4">
                            <Heart className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Tamamlayıcı Sağlık & Özel Sağlık</h1>
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
                                placeholder="GG.AA.YYYY"
                                maxLength={10}
                                {...register("birthDate")}
                                onChange={(e) => {
                                    formatBirthDate(e);
                                    register("birthDate").onChange(e);
                                }}
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
                                placeholder="05XXXXXXXXX"
                                maxLength={11}
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
        </div>
    )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Car, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"
import { maskTC, maskPhone, maskBirthDate } from "@/lib/masks"
import { tcSchema, phoneSchema, birthDateSchema } from "@/lib/validations"

const formSchema = z.object({
    tcNumber: tcSchema,
    birthDate: birthDateSchema,
    plateNumber: z.string()
        .min(1, "Plaka zorunludur.")
        .regex(/^[A-Z0-9]+$/, "Plaka sadece büyük harf ve rakam içerebilir, boşluk kullanmayın.")
        .transform(val => val.toUpperCase().replace(/\s/g, '')),
    licenseSerial: z.string().min(1, "Ruhsat Seri No zorunludur."),
    phoneNumber: phoneSchema,
    referenceNumber: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function TrafikSigortasiPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data: profileData } = await supabase.from('profiles').select('affiliate_id').eq('id', user.id).single()
                setProfile(profileData)
            }
        }
        checkUser()
    }, [])

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })

    // Auto-populate reference number when profile is loaded
    useEffect(() => {
        if (profile?.affiliate_id) {
            setValue("referenceNumber", profile.affiliate_id)
        }
    }, [profile, setValue])


    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        try {
            // 1. Send email notification
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "Trafik Sigortası", ...data }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Hatası:", errorData);
                alert("Talebiniz kaydedilemedi: " + (errorData.message || "Bilinmeyen bir hata"));
                return;
            }

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
                    Trafik sigortası talebiniz bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <Button asChild>
                    <Link href={user ? "/panel" : "/"}>
                        {user ? "Panele Dön" : "Ana Sayfaya Dön"}
                    </Link>
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
                            <h1 className="text-2xl font-bold">Trafik Sigortası Teklifi</h1>
                            <p className="text-muted-foreground">
                                Zorunlu trafik sigortası için bilgilerinizi giriniz.
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
                                    onChange={(e) => {
                                        e.target.value = maskTC(e.target.value);
                                        register("tcNumber").onChange(e);
                                    }}
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
                                        e.target.value = maskBirthDate(e.target.value);
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
                                <Label htmlFor="plateNumber">Plaka</Label>
                                <Input
                                    id="plateNumber"
                                    placeholder="34 ABC 123"
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
                                    placeholder="Örn: AB123456"
                                    maxLength={8}
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
                                    placeholder="05XXXXXXXXX"
                                    maxLength={11}
                                    {...register("phoneNumber")}
                                    onChange={(e) => {
                                        e.target.value = maskPhone(e.target.value);
                                        register("phoneNumber").onChange(e);
                                    }}
                                />
                                {errors.phoneNumber && (
                                    <span className="text-xs text-destructive">
                                        {errors.phoneNumber.message}
                                    </span>
                                )}
                            </div>

                            {profile?.affiliate_id && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <Label htmlFor="referenceNumber" className="text-primary font-bold flex items-center gap-2">
                                        Referans Numaranız <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded text-primary uppercase">Otomatik</span>
                                    </Label>
                                    <Input
                                        id="referenceNumber"
                                        readOnly
                                        className="bg-slate-50 border-primary/20 font-mono font-bold text-primary"
                                        {...register("referenceNumber")}
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium italic">
                                        Bu numara size özeldir ve talebinizle birlikte iletilecektir.
                                    </p>
                                </div>
                            )}

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

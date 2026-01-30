"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Car, ArrowLeft, Send } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
    productType: z.enum(["trafik", "kasko", "ikisi"]),
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
    referenceNumber: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function VehicleInsurancePage() {
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
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productType: "trafik",
        },
    })

    // Auto-populate reference number when profile is loaded
    useEffect(() => {
        if (profile?.affiliate_id) {
            setValue("referenceNumber", profile.affiliate_id)
        }
    }, [profile, setValue])

    // Auto-format birth date with dots (DD.MM.YYYY)
    const formatBirthDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\\D/g, '');
        if (value.length >= 2) value = value.slice(0, 2) + '.' + value.slice(2);
        if (value.length >= 5) value = value.slice(0, 5) + '.' + value.slice(5);
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value;
    };

    const productType = watch("productType")

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        try {
            // 1. Send email notification
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "Araç Sigortası", ...data }),
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
                    Bilgileriniz bize ulaştı. En kısa sürede sizin için en uygun teklifi çalışıp iletişime geçeceğiz.
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
                            <Car className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Araç Sigortası Teklifi</h1>
                        <p className="text-muted-foreground">
                            Trafik ve Kasko teklifleri için bilgilerinizi giriniz.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Teklif Türü Seçimi */}
                        <div className="space-y-2">
                            <Label>Teklif Türü</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setValue("productType", "trafik")}
                                    className={`rounded-md border p-2 text-sm font-medium transition-colors ${productType === "trafik"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "bg-background text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    Trafik
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue("productType", "kasko")}
                                    className={`rounded-md border p-2 text-sm font-medium transition-colors ${productType === "kasko"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "bg-background text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    Kasko
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue("productType", "ikisi")}
                                    className={`rounded-md border p-2 text-sm font-medium transition-colors ${productType === "ikisi"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "bg-background text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    İkisi de
                                </button>
                            </div>
                        </div>

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
        </div>
    )
}

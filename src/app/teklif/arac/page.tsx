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

const formSchema = z.object({
    productType: z.enum(["trafik", "kasko", "ikisi"]),
    tcNumber: z.string().length(11, "TC Kimlik Numarası 11 haneli olmalıdır."),
    birthDate: z.string().min(1, "Doğum tarihi zorunludur."),
    plateNumber: z.string().min(1, "Plaka zorunludur."),
    licenseSerial: z.string().min(1, "Ruhsat Seri No zorunludur."),
    phoneNumber: z.string().min(10, "Telefon numarası en az 10 haneli olmalıdır."),
})

type FormValues = z.infer<typeof formSchema>

export default function VehicleInsurancePage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

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

    const productType = watch("productType")

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "Araç Sigortası", ...data }),
            })

            if (response.ok) {
                setIsSuccess(true)
            } else {
                alert("Bir hata oluştu. Lütfen tekrar deneyin.")
            }
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
        </div>
    )
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Home, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const formSchema = z.object({
    ownerTc: z.string().length(11, "Tapu Sahibi TC No 11 haneli olmalıdır."),
    ownerBirthDate: z.string().min(1, "Tapu Sahibi Doğum Tarihi zorunludur."),
    address: z.string().min(5, "Açık adres zorunludur."),
    squareMeters: z.string().min(1, "Metrekare zorunludur."),
    totalFloors: z.string().min(1, "Kat sayısı zorunludur."),
    floorLevel: z.string().min(1, "Bulunduğu kat zorunludur."),
    buildYear: z.string().min(4, "Bina inşa yılı zorunludur."),
    phoneNumber: z.string().min(10, "Telefon numarası en az 10 haneli olmalıdır."),
})

type FormValues = z.infer<typeof formSchema>

export default function DASKPage() {
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
                body: JSON.stringify({ type: "DASK (Deprem Sigortası)", ...data }),
            })

            if (!response.ok) console.error("Email hatası");

            // 2. Format birth date as DD.MM.YYYY
            const formattedDate = data.ownerBirthDate.replace(/(\d{2})(\d{2})(\d{4})/, '$1.$2.$3');

            const message = `Merhaba, DASK Sigortası teklifi almak istiyorum:\n\n` +
                `TC: ${data.ownerTc}\n` +
                `Doğum Tarihi: ${formattedDate}\n` +
                `Telefon: ${data.phoneNumber}\n` +
                `Adres: ${data.address}\n` +
                `Alan: ${data.squareMeters} m2\n` +
                `Kat: ${data.floorLevel}/${data.totalFloors}\n` +
                `İnşa Yılı: ${data.buildYear}`;

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
                    DASK sigortası talebiniz bize ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
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
                                <Home className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold">DASK Teklifi</h1>
                            <p className="text-muted-foreground">
                                Zorunlu deprem sigortası için bilgileri giriniz.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="ownerTc">Tapu Sahibi TC</Label>
                                <Input
                                    id="ownerTc"
                                    placeholder="11 haneli TC no"
                                    maxLength={11}
                                    {...register("ownerTc")}
                                />
                                {errors.ownerTc && (
                                    <span className="text-xs text-destructive">
                                        {errors.ownerTc.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ownerBirthDate">Tapu Sahibi Doğum Tarihi</Label>
                                <Input
                                    id="ownerBirthDate"
                                    placeholder="GG.AA.YYYY"
                                    maxLength={10}
                                    {...register("ownerBirthDate")}
                                    onChange={(e) => {
                                        formatBirthDate(e);
                                        register("ownerBirthDate").onChange(e);
                                    }}
                                />
                                {errors.ownerBirthDate && (
                                    <span className="text-xs text-destructive">
                                        {errors.ownerBirthDate.message}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Adres</Label>
                                <Input
                                    id="address"
                                    placeholder="Mahalle, Cadde, Sokak, No..."
                                    {...register("address")}
                                />
                                {errors.address && (
                                    <span className="text-xs text-destructive">
                                        {errors.address.message}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="squareMeters">Metrekare (m²)</Label>
                                    <Input
                                        id="squareMeters"
                                        type="number"
                                        placeholder="120"
                                        {...register("squareMeters")}
                                    />
                                    {errors.squareMeters && (
                                        <span className="text-xs text-destructive">
                                            {errors.squareMeters.message}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="buildYear">Bina İnşa Yılı</Label>
                                    <Input
                                        id="buildYear"
                                        type="number"
                                        placeholder="2010"
                                        {...register("buildYear")}
                                    />
                                    {errors.buildYear && (
                                        <span className="text-xs text-destructive">
                                            {errors.buildYear.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="totalFloors">Binadaki Kat Sayısı</Label>
                                    <Input
                                        id="totalFloors"
                                        type="number"
                                        placeholder="5"
                                        {...register("totalFloors")}
                                    />
                                    {errors.totalFloors && (
                                        <span className="text-xs text-destructive">
                                            {errors.totalFloors.message}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="floorLevel">Bulunduğu Kat</Label>
                                    <Input
                                        id="floorLevel"
                                        type="number"
                                        placeholder="3"
                                        {...register("floorLevel")}
                                    />
                                    {errors.floorLevel && (
                                        <span className="text-xs text-destructive">
                                            {errors.floorLevel.message}
                                        </span>
                                    )}
                                </div>
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
            </main>
            <Footer />
        </div>
    )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
    name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    message: z.string().min(10, "Mesajınız en az 10 karakter olmalıdır"),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true)
        try {
            // Statik export için mail servisi yerine WhatsApp yönlendirmesi kullanıyoruz
            const message = `Merhaba, yeni bir iletişim formu talebim var:\n\n` +
                `👤 Ad Soyad: ${data.name}\n` +
                `📞 Telefon: ${data.phone}\n` +
                `📧 E-posta: ${data.email}\n` +
                `💬 Mesaj: ${data.message}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/905379473464?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            setIsSuccess(true)
            reset()
        } catch (error) {
            alert("Bağlantı hatası oluştu. Lütfen tekrar deneyin.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center py-24">
                    <div className="container max-w-md px-4 mx-auto text-center">
                        <div className="bg-card border rounded-3xl p-12 shadow-xl animate-in fade-in zoom-in duration-500">
                            <div className="mb-8 flex justify-center">
                                <div className="bg-green-100 p-6 rounded-full text-green-600 animate-bounce">
                                    <CheckCircle2 className="h-16 w-16" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-extrabold mb-4">Mesajınız Alındı!</h2>
                            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                                Bizimle iletişime geçtiğiniz için teşekkür ederiz. Uzman ekibimiz en kısa sürede size geri dönüş yapacaktır.
                            </p>
                            <Button size="lg" className="w-full text-lg h-14 font-bold" onClick={() => setIsSuccess(false)}>
                                Yeni Mesaj Gönder
                            </Button>
                            <Link href="/" className="inline-block mt-6 text-primary font-semibold hover:underline">
                                Ana Sayfaya Dön
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                <div className="container max-w-screen-2xl px-4 py-16 md:py-24 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Contact Info */}
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight mb-6">Bize Ulaşın</h1>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
                                Sigorta ihtiyaçlarınız için uzman ekibimizle her zaman yanınızdayız. Sorularınız, teklif talepleriniz veya görüşleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz.
                            </p>

                            <div className="space-y-8 w-full">
                                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                                        <Phone className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">Telefon</h3>
                                        <a href="tel:05379473464" className="text-muted-foreground hover:text-primary transition-colors text-lg font-medium">
                                            0 537 947 34 64
                                        </a>
                                        <p className="text-sm text-muted-foreground mt-1">Hafta içi 09:00 - 18:00</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                                        <Mail className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">E-posta</h3>
                                        <a href="mailto:info@sigortaciniz.com" className="text-muted-foreground hover:text-primary transition-colors text-lg font-medium">
                                            info@sigortaciniz.com
                                        </a>
                                        <p className="text-sm text-muted-foreground mt-1">7/24 Bize yazabilirsiniz</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">Adres</h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed">
                                            Meşrutiyet Mah. Rumeli Cad. Konfor Çarşısı<br />
                                            No:40 İç Kapı No:47<br />
                                            Nişantaşı / Şişli / İstanbul
                                        </p>
                                        <a
                                            href="https://maps.google.com/?q=Meşrutiyet+Mah.+Rumeli+Cad.+Konfor+Çarşısı+No:40+Nişantaşı+İstanbul"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-primary hover:underline mt-2 inline-block"
                                        >
                                            Yol Tarifi Al
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card border rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">İletişim Formu</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">Adınız Soyadınız</label>
                                        <input
                                            type="text"
                                            id="name"
                                            {...register("name")}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="Adınız Soyadınız"
                                        />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium">Telefon</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            {...register("phone")}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="05XX XXX XX XX"
                                        />
                                        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">E-posta</label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register("email")}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="ornek@email.com"
                                    />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Mesajınız</label>
                                    <textarea
                                        id="message"
                                        {...register("message")}
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                        placeholder="Mesajınızı buraya yazınız..."
                                    ></textarea>
                                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                                </div>
                                <Button size="lg" className="w-full text-base font-semibold" disabled={isSubmitting}>
                                    {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                                </Button>
                            </form>

                            {/* Logo Section below form */}
                            <div className="mt-12 pt-8 border-t flex flex-col items-center justify-center opacity-30 group hover:opacity-100 transition-opacity duration-500">
                                <div className="relative h-80 w-80 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <Image
                                        src="/logo.jpg"
                                        alt="Sigortacınız Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="mt-4 text-3xl font-bold text-muted-foreground/60 group-hover:text-primary transition-colors duration-500">
                                    Sigortacınız<span className="text-primary group-hover:text-foreground">.</span>com
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm border bg-muted">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.708673242794!2d28.987556909520325!3d41.05349951652282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab73966580911%3A0xc3c9453c5cd6f11c!2zTWXFn3J1dGl5ZXQgTWFoLiBSdW1lbGkgQ2FkLiBLb25mb3Igw4dhcsWfxLFzxLEgTm86NDAgxLDDpyBLYXDEsSBObzo0NyBOacWfYW50YcWfxLEgLyDFnmnFn2xpIC8gxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1769538257100!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ofis Konumu"
                        ></iframe>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

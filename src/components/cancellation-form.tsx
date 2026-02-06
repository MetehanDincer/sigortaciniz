"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Camera, CheckCircle2, AlertCircle, Loader2, UploadCloud } from "lucide-react"

interface CancellationFormProps {
    type: "Trafik" | "Kasko";
    title: string;
}

export function CancellationForm({ type, title }: CancellationFormProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [formData, setFormData] = useState({
        tcNumber: "",
        plate: ""
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (!file) {
                throw new Error("Lütfen noter satış sözleşmesini yükleyiniz.")
            }

            const formDataToSend = new FormData()
            formDataToSend.append("type", type)
            formDataToSend.append("tcNumber", formData.tcNumber)
            formDataToSend.append("plate", formData.plate)
            formDataToSend.append("file", file)

            const response = await fetch("/api/cancellation", {
                method: "POST",
                body: formDataToSend,
            })

            const result = await response.json()

            setSuccess(true)
        } catch (err: any) {
            console.error("❌ İptal talebi hatası:", err);
            setError(err.message || "Bir hata oluştu. Lütfen tekrar deneyiniz.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-4 bg-slate-50">
                    <Card className="w-full max-w-lg border-none shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <CardContent className="p-12 text-center space-y-6">
                            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">İptal Talebiniz Alındı!</h2>
                            <p className="text-slate-600 font-medium text-lg">
                                {title} talebiniz başarıyla tarafımıza ulaştı. <br />
                                Uzmanlarımız en kısa sürede sizinle iletişime geçecektir.
                            </p>
                            <Button asChild className="h-14 px-10 text-lg font-bold shadow-xl shadow-primary/20 mt-4 rounded-2xl w-full">
                                <a href="/">Ana Sayfaya Dön</a>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <main className="flex-grow container max-w-2xl mx-auto py-12 px-4">
                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden transition-all hover:shadow-primary/5">
                    <CardHeader className="bg-primary p-10 text-white text-center">
                        <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight mb-2">{title}</CardTitle>
                        <CardDescription className="text-primary-foreground/80 font-medium text-base">
                            Lütfen aşağıdaki bilgileri eksiksiz doldurunuz.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 lg:p-12 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="tcNumber" className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">TC Kimlik Numarası</Label>
                                <Input
                                    id="tcNumber"
                                    required
                                    placeholder="11 Haneli TC Kimlik No"
                                    maxLength={11}
                                    value={formData.tcNumber}
                                    onChange={(e) => setFormData({ ...formData, tcNumber: e.target.value })}
                                    className="h-14 rounded-2xl border-slate-200 focus:border-primary focus:ring-primary/20 text-lg font-semibold"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="plate" className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Araç Plakası</Label>
                                <Input
                                    id="plate"
                                    required
                                    placeholder="34 ABC 123"
                                    value={formData.plate}
                                    onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                                    className="h-14 rounded-2xl border-slate-200 focus:border-primary focus:ring-primary/20 text-lg font-semibold uppercase"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Noter Satış Sözleşmesi</Label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="notary-file"
                                        required
                                    />
                                    <label
                                        htmlFor="notary-file"
                                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden"
                                    >
                                        {file ? (
                                            <div className="flex flex-col items-center p-4">
                                                <div className="bg-green-100 p-3 rounded-xl mb-2">
                                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 text-center line-clamp-1">{file.name}</span>
                                                <span className="text-xs text-slate-400 font-medium">Dosyayı değiştirmek için tıkla</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="bg-slate-100 p-4 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                                                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-primary" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">Görsel veya PDF Yükle</span>
                                                <span className="text-xs text-slate-400 font-medium mt-1">Sürükle bırak veya tıkla</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm font-bold">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 text-lg font-extrabold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        İptal Talebi Gönder
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    )
}

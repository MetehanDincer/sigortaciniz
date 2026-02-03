"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COMMISSION_RATES, getProductTypeName, formatCommissionRate, ProductType } from "@/lib/finance/commission-rates"
import { calculateEarnings, formatCurrency } from "@/lib/finance/earnings-calculator"
import { Loader2, Calculator, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface EarningsModalProps {
    isOpen: boolean
    onClose: () => void
    leadId: string
    affiliateId: string
    onSuccess: () => void
}

export function EarningsModal({ isOpen, onClose, leadId, affiliateId, onSuccess }: EarningsModalProps) {
    const [step, setStep] = useState<'input' | 'confirm'>('input')
    const [loading, setLoading] = useState(false)
    const [productType, setProductType] = useState<string>("")
    const [premium, setPremium] = useState<string>("")
    const [calculation, setCalculation] = useState<any>(null)

    const handleCalculate = () => {
        if (!productType || !premium) {
            toast.error("Lütfen ürün tipi ve prim tutarını giriniz")
            return
        }

        try {
            const result = calculateEarnings(productType as any, Number(premium))
            setCalculation(result)
            setStep('confirm')
        } catch (error) {
            toast.error("Hesaplama hatası")
        }
    }

    const handleProcess = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/process-earning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    productType,
                    totalPremium: Number(premium)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'İşlem başarısız')
            }

            toast.success("Kazanç başarıyla hesaplandı ve cüzdana yansıtıldı")
            onSuccess()
            onClose()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setStep('input')
        setCalculation(null)
        setPremium("")
        setProductType("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-primary" />
                        Kazanç Hesapla & Yansıt
                    </DialogTitle>
                    <DialogDescription>
                        Referans Kodu: <span className="font-bold text-primary">{affiliateId}</span>
                    </DialogDescription>
                </DialogHeader>

                {step === 'input' ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Poliçe Türü</Label>
                            <Select value={productType} onValueChange={setProductType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(COMMISSION_RATES).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {getProductTypeName(type as ProductType)} - {formatCommissionRate(COMMISSION_RATES[type as ProductType])}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Toplam Prim (TL)</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={premium}
                                onChange={(e) => setPremium(e.target.value)}
                            />
                        </div>

                        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex gap-3 text-sm text-yellow-800">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>
                                <strong>Dikkat:</strong> Bu işlem geri alınamaz. Lütfen tutarı ve poliçe türünü dikkatle kontrol ediniz.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg space-y-3 border">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Ürün:</span>
                                <span className="font-medium">{getProductTypeName(productType as any)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Toplam Prim:</span>
                                <span className="font-medium">{formatCurrency(calculation.totalPremium)}</span>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Komisyon Oranı:</span>
                                <span className="font-medium">{formatCommissionRate(calculation.commissionRate)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Baz Komisyon:</span>
                                <span>{formatCurrency(calculation.baseCommission)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Şirket Payı (%30):</span>
                                <span>{formatCurrency(calculation.companyShare)}</span>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div className="flex justify-between items-center bg-primary/10 p-3 rounded -mx-2">
                                <span className="font-bold text-primary">İş Ortağı Kazancı:</span>
                                <span className="font-black text-xl text-primary">{formatCurrency(calculation.partnerEarning)}</span>
                            </div>
                            <p className="text-xs text-center text-slate-400">
                                (Baz Komisyon × %70) ÷ 2 formülü uygulanmıştır.
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 'input' ? (
                        <>
                            <Button variant="outline" onClick={onClose}>İptal</Button>
                            <Button onClick={handleCalculate} disabled={!productType || !premium}>Hesapla</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={reset} disabled={loading}>Geri Dön</Button>
                            <Button onClick={handleProcess} disabled={loading} className="gap-2">
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Onayla ve Yansıt
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

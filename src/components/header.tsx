"use client"

import Link from "next/link"
import { Menu, X, Phone, ChevronDown, Rocket, Building2, FileX, ShieldX, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser()
            setUser(currentUser)

            if (currentUser) {
                const { data: adminData } = await supabase
                    .from('admin_profiles')
                    .select('admin_code')
                    .eq('id', currentUser.id)
                    .single()
                setIsAdmin(!!adminData)
            } else {
                setIsAdmin(false)
            }
        }
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                const { data: adminData } = await supabase
                    .from('admin_profiles')
                    .select('admin_code')
                    .eq('id', currentUser.id)
                    .single()
                setIsAdmin(!!adminData)
            } else {
                setIsAdmin(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
                        <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                            <Image
                                src="/logo.jpg"
                                alt="Uygun Sigortacı Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-primary leading-none">
                            UygunSigortacı<span className="text-foreground">.</span>com
                        </span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                    <Link href="/hizmetlerimiz" className="hover:text-primary transition-colors">Hizmetlerimiz</Link>

                    {/* Kurumsal Dropdown */}
                    <div className="relative">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 hover:text-primary transition-colors outline-none font-bold text-primary py-4 cursor-pointer">
                                    Kurumsal <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48 p-2 rounded-xl shadow-xl border-slate-100">
                                <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer">
                                    <Link href="/#hakkimizda" className="flex items-center gap-2 font-semibold">
                                        <Building2 className="h-4 w-4 text-primary" /> Hakkımızda
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer">
                                    <Link href="/blog" className="flex items-center gap-2 font-semibold">
                                        <Rocket className="h-4 w-4 text-primary" /> Blog
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer">
                                    <Link href="/kurumsal/egitim" className="flex items-center gap-2 font-semibold">
                                        <BookOpen className="h-4 w-4 text-primary" /> Eğitim
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* İptal İşlemleri Dropdown */}
                    <div className="relative">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 hover:text-primary transition-colors outline-none py-4 cursor-pointer">
                                    İptal İşlemleri <ChevronDown className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl shadow-xl border-slate-100">
                                <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer">
                                    <Link href="/iptal/trafik" className="flex items-center gap-2 font-semibold">
                                        <FileX className="h-4 w-4 text-red-500" /> Trafik Sigortası İptali
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-lg p-3 cursor-pointer">
                                    <Link href="/iptal/kasko" className="flex items-center gap-2 font-semibold">
                                        <ShieldX className="h-4 w-4 text-red-500" /> Kasko Sigortası İptali
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Link href="/iletisim" className="hover:text-primary transition-colors">İletişim</Link>
                </nav>
                <div className="flex items-center gap-3">
                    <a href="tel:05379473464" className="hidden lg:flex items-center gap-1.5 text-foreground hover:text-primary transition-colors">
                        <Phone className="h-4 w-4" />
                        <span className="font-semibold text-sm">0 537 947 34 64</span>
                    </a>
                    <Button asChild className="hidden sm:flex h-9 px-4 text-sm font-semibold">
                        <Link href="/hizmetlerimiz">Teklif Al</Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <Button asChild variant="ghost" className="hidden lg:flex h-9 px-3 text-sm font-bold text-primary hover:text-primary/80 hover:bg-primary/5">
                                <Link href="/admin/operasyon">Temsilci Paneli</Link>
                            </Button>
                        )}
                        <Button asChild variant="outline" className="hidden sm:flex h-9 px-4 text-sm font-semibold">
                            {user ? (
                                <Link href="/panel">Panelim</Link>
                            ) : (
                                <Link href="/giris">Giriş Yap</Link>
                            )}
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <nav className="container px-4 py-4 flex flex-col gap-4">
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-primary font-medium py-2 pl-4"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/hizmetlerimiz"
                            className="text-muted-foreground hover:text-primary font-medium py-2 pl-4"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Hizmetlerimiz
                        </Link>

                        {/* Kurumsal Mobile */}
                        <div className="flex flex-col gap-2 pl-4">
                            <span className="text-primary font-bold py-2">Kurumsal</span>
                            <Link
                                href="/#hakkimizda"
                                className="text-muted-foreground hover:text-primary font-medium py-1 pl-4 border-l border-slate-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Hakkımızda
                            </Link>
                            <Link
                                href="/blog"
                                className="text-muted-foreground hover:text-primary font-medium py-1 pl-4 border-l border-slate-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Blog
                            </Link>
                            <Link
                                href="/kurumsal/egitim"
                                className="text-muted-foreground hover:text-primary font-medium py-1 pl-4 border-l border-slate-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Eğitim
                            </Link>
                        </div>

                        {/* İptal İşlemleri Mobile */}
                        <div className="flex flex-col gap-2 pl-4">
                            <span className="text-muted-foreground font-bold py-2">İptal İşlemleri</span>
                            <Link
                                href="/iptal/trafik"
                                className="text-muted-foreground hover:text-primary font-medium py-1 pl-4 border-l border-slate-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Trafik Sigortası İptali
                            </Link>
                            <Link
                                href="/iptal/kasko"
                                className="text-muted-foreground hover:text-primary font-medium py-1 pl-4 border-l border-slate-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Kasko Sigortası İptali
                            </Link>
                        </div>

                        <Link
                            href="/iletisim"
                            className="text-muted-foreground hover:text-primary font-medium py-2 pl-4"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            İletişim
                        </Link>
                        <Button asChild className="w-full">
                            <Link href="/hizmetlerimiz" onClick={() => setMobileMenuOpen(false)}>
                                Teklif Al
                            </Link>
                        </Button>
                        <div className="flex flex-col gap-2 w-full">
                            {isAdmin && (
                                <Button asChild variant="ghost" className="w-full justify-start font-bold text-primary py-2 px-4 h-auto">
                                    <Link href="/admin/operasyon" onClick={() => setMobileMenuOpen(false)}>Temsilci Paneli</Link>
                                </Button>
                            )}
                            <Button asChild variant="outline" className="w-full">
                                {user ? (
                                    <Link href="/panel" onClick={() => setMobileMenuOpen(false)}>Panelim</Link>
                                ) : (
                                    <Link href="/giris" onClick={() => setMobileMenuOpen(false)}>Giriş Yap</Link>
                                )}
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}

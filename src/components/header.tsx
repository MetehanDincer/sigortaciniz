"use client"

import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import Image from "next/image"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 lg:h-24 max-w-screen-2xl items-center justify-between px-4">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-1 transition-opacity hover:opacity-80">
                        <div className="relative h-14 w-14 lg:h-16 lg:w-16 overflow-hidden rounded-xl">
                            <Image
                                src="/logo.jpg"
                                alt="Sigortacınız Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-primary leading-none mt-1">
                            Sigortacınız<span className="text-foreground">.</span>com
                        </span>
                    </Link>
                </div>
                <nav className="hidden md:flex gap-8 text-base font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                    <Link href="/hizmetlerimiz" className="hover:text-primary transition-colors">Hizmetlerimiz</Link>
                    <Link href="/#hakkimizda" className="hover:text-primary transition-colors">Hakkımızda</Link>
                    <Link href="/iletisim" className="hover:text-primary transition-colors">İletişim</Link>
                    <Link href="/blog" className="hover:text-primary transition-colors font-semibold text-primary">Blog</Link>
                </nav>
                <div className="flex items-center gap-4 lg:gap-6">
                    <a href="tel:05379473464" className="hidden lg:flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                        <Phone className="h-5 w-5" />
                        <span className="font-semibold text-base">0 537 947 34 64</span>
                    </a>
                    <Button asChild className="hidden sm:flex h-11 px-6 text-base font-semibold">
                        <Link href="/hizmetlerimiz">Teklif Al</Link>
                    </Button>
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
                            className="text-primary font-medium py-2 border-l-4 border-primary pl-4"
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
                        <Link
                            href="/#hakkimizda"
                            className="text-muted-foreground hover:text-primary font-medium py-2 pl-4"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Hakkımızda
                        </Link>
                        <Link
                            href="/iletisim"
                            className="text-muted-foreground hover:text-primary font-medium py-2 pl-4"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            İletişim
                        </Link>
                        <Link
                            href="/blog"
                            className="text-primary font-bold py-2 pl-4"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Button asChild className="w-full">
                            <Link href="/hizmetlerimiz" onClick={() => setMobileMenuOpen(false)}>
                                Teklif Al
                            </Link>
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    )
}


import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-background pt-16 pb-8">
            <div className="container px-4 max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                <Image
                                    src="/logo.jpg"
                                    alt="Uygun Sigortacı Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold text-foreground">
                                UygunSigortacı<span className="text-foreground">.</span>com
                            </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Sigorta sektöründeki deneyimimiz ve müşteri odaklı yaklaşımımızla, geleceğinizi güven altına alıyoruz.
                        </p>
                        <div className="space-y-3">
                            <a href="tel:05379473464" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>0 537 947 34 64</span>
                            </a>
                            <a href="mailto:info@uygunsigortaci.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>info@uygunsigortaci.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">Hizmetlerimiz</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="/teklif/trafik" className="hover:text-primary transition-colors">Trafik Sigortası</Link></li>
                            <li><Link href="/teklif/kasko" className="hover:text-primary transition-colors">Kasko Sigortası</Link></li>
                            <li><Link href="/teklif/tamamlayici-saglik" className="hover:text-primary transition-colors">Tamamlayıcı Sağlık</Link></li>
                            <li><Link href="/teklif/ozel-saglik" className="hover:text-primary transition-colors">Özel Sağlık</Link></li>
                            <li><Link href="/teklif/dask" className="hover:text-primary transition-colors">DASK</Link></li>
                            <li><Link href="/teklif/konut-sigortasi" className="hover:text-primary transition-colors">Konut Sigortası</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">Hızlı Bağlantılar</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link></li>
                            <li><Link href="/hizmetlerimiz" className="hover:text-primary transition-colors">Tüm Hizmetler</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog / Bilgi Merkezi</Link></li>
                            <li><Link href="/iletisim" className="hover:text-primary transition-colors">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">Yasal</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="/gizlilik-politikasi" className="hover:text-primary transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="/kullanim-kosullari" className="hover:text-primary transition-colors">Kullanım Koşulları</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © 2024 Uygun Sigortacı. Tüm hakları saklıdır.
                    </p>
                    <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                            <span className="sr-only">Facebook</span>
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" /></svg>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,1.17.05,1.8.25,2.23.41a3.73,3.73,0,0,1,1.39.9,3.73,3.73,0,0,1,.9,1.39c.17.43.36,1.06.41,2.23.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.05,1.17-.25,1.8-.41,2.23a3.73,3.73,0,0,1-.9,1.39,3.73,3.73,0,0,1-1.39.9c-.43.17-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.73,3.73,0,0,1-1.39-.9,3.73,3.73,0,0,1-.9-1.39c-.17-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23a3.73,3.73,0,0,1,.9-1.39,3.73,3.73,0,0,1,1.39-.9c.43-.17,1.06-.36,2.23-.41,1.27-.06,1.65-.07,4.85-.07M12,0C8.74,0,8.33,0,7.05.07a6.23,6.23,0,0,0-2.06.39A6.1,6.1,0,0,0,2.54,2.54,6.23,6.23,0,0,0,1.5,4.6a6.23,6.23,0,0,0-.4,2.06C1.06,8.33,1,8.74,1,12s0,3.67.07,4.95a6.23,6.23,0,0,0,.39,2.06,6.1,6.1,0,0,0,2.05,2.45,6.23,6.23,0,0,0,2.06,1.05c1.27.06,1.68.07,4.95.07s3.67,0,4.95-.07a6.23,6.23,0,0,0,2.06-.39,6.1,6.1,0,0,0,2.45-2.05,6.23,6.23,0,0,0,1.05-2.06c.06-1.27.07-1.68.07-4.95s0-3.67-.07-4.95a6.23,6.23,0,0,0-.39-2.06A6.1,6.1,0,0,0,21.46,2.54a6.23,6.23,0,0,0-2.06-1.05C18.12.07,17.71,0,14.45,0H12ZM12,5.83A6.17,6.17,0,1,0,18.17,12,6.17,6.17,0,0,0,12,5.83Zm0,10.18A4,4,0,1,1,16,12,4,4,0,0,1,12,16.01ZM19.5,5.94a1.44,1.44,0,1,1-1.44-1.44A1.44,1.44,0,0,1,19.5,5.94Z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

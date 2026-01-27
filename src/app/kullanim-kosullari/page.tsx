import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsOfUsePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-muted/20 py-16 md:py-24">
                <div className="container px-4 max-w-4xl mx-auto">
                    <div className="bg-card rounded-3xl border shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-8 text-center">
                            Kullanım Koşulları ve Kullanıcı Sözleşmesi
                        </h1>

                        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">1. Taraflar ve Tanımlar</h2>
                                <p>
                                    İşbu sözleşme, Meşrutiyet Mah. Rumeli Cad. Konfor Çarşısı No:40 Nişantaşı / İstanbul adresinde mukim <strong>Sigortaciniz.com</strong> (bundan sonra "Şirket" olarak anılacaktır) ile web sitesini ziyaret eden veya hizmetlerden yararlanan gerçek/tüzel kişiler (bundan sonra "Kullanıcı" olarak anılacaktır) arasındaki kullanım şartlarını belirler.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">2. Hizmetin Kapsamı</h2>
                                <p>
                                    Sigortaciniz.com, sigorta sözleşmesi yaptırmak isteyen kullanıcılar ile sigorta şirketlerini bir araya getiren bir aracılık platformudur. Şirketimiz, sigorta şirketlerinden teklif alarak kullanıcıya sunar ve poliçe düzenleme süreçlerine rehberlik eder. Sigorta teminatı ve tazminat ödemeleri tamamen ilgili sigorta şirketinin sorumluluğundadır.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">3. Bilgilerin Doğruluğu</h2>
                                <p>
                                    Kullanıcı, teklif alma ve poliçe düzenleme aşamalarında verdiği bilgilerin (T.C. Kimlik No, araç bilgileri, sağlık beyanı vb.) eksiksiz ve doğru olduğunu taahhüt eder. Yanlış veya eksik beyanlardan dolayı doğabilecek poliçe iptali veya tazminat ödenmemesi durumlarında Sigortaciniz.com sorumlu tutulamaz. Verdiğiniz bilgilerin doğruluğu sigorta poliçenizin geçerliliği için kritik önem taşır.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">4. Ödeme ve Provizyon</h2>
                                <p>
                                    Sigorta poliçesi ödemeleri, kullanıcının seçtiği sigorta şirketinin altyapısı üzerinden ve şirket tarafından belirlenen yöntemlerle (Kredi kartı, EFT vb.) gerçekleştirilir. Ödemenin başarıyla tamamlanması ve ilgili şirket tarafından onaylanması ile poliçe yürürlüğe girer.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">5. Fikri Mülkiyet Hakları</h2>
                                <p>
                                    Sigortaciniz.com web sitesinde yer alan logo, tasarım, marka, yazılım, metin ve görsellerin tüm fikri ve sınai mülkiyet hakları Şirketimize aittir. İşbu materyallerin izinsiz kopyalanması, çoğaltılması, dağıtılması veya ticari amaçla kullanılması yasaktır ve yasal yaptırımlara tabidir.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">6. Gizlilik ve Veri Güvenliği</h2>
                                <p>
                                    Kullanıcının Site/Uygulama üzerinden paylaştığı tüm kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında ve sitemizde yer alan "Gizlilik Politikası" doğrultusunda işlenmekte ve korunmaktadır. Kullanıcı, siteyi kullanarak bu veri işleme şartlarını kabul etmiş sayılır.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">7. Sözleşme Değişiklikleri</h2>
                                <p>
                                    Sigortaciniz.com, işbu Kullanım Koşulları'nı ve Kullanıcı Sözleşmesi'ni dilediği zaman, önceden haber vermeksizin güncelleme veya değiştirme hakkını saklı tutar. Güncel sözleşme metni sitede yayınlandığı andan itibaren tüm kullanıcılar için bağlayıcı hale gelir.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">8. Yetkili Mahkeme</h2>
                                <p>
                                    İşbu sözleşmenin yorumlanmasından veya uygulanmasından doğabilecek her türlü uyuşmazlığın çözümünde Türkiye Cumhuriyeti kanunları uygulanacak olup, İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
                                </p>
                            </section>
                        </div>

                        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                            Son Güncelleme: 27 Ocak 2026
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

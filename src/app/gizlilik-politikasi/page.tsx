import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 bg-muted/20 py-16 md:py-24">
                <div className="container px-4 max-w-4xl mx-auto">
                    <div className="bg-card rounded-3xl border shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-8 text-center">
                            Gizlilik Politikası
                        </h1>

                        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-8">
                            <p>
                                Bu web sitesini ziyaret etmeniz ve bu site vasıtasıyla sunduğumuz hizmetlerden yararlanmanız sırasında size ve talep ettiğiniz hizmetlere ilişkin olarak elde ettiğimiz bilgilerin ne şekilde kullanılacağı ve korunacağı işbu ‘Gizlilik Politikası”nda belirtilen şartlara tabidir. Bu web sitesini ziyaret etmekle ve bu site vasıtasıyla sunduğumuz hizmetlerden yararlanmayı talep etmekle işbu ‘Gizlilik Politikası‘nda belirtilen şartları kabul etmektesiniz.
                            </p>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">1. Bilgilerin Kullanılması ve Korunması</h2>
                                <p className="mb-4">
                                    Web sitemiz, girilen bilgilerin güvenliği açısından ‘SSL‘ sistemi ile donatılmıştır. Bu nedenle verilen bilgiler internetteki diğer kişiler tarafından görülemez. Bu koruma, e-posta gibi yollarla gönderilen bilgiler için etkili değildir. Üyelerimizle ilgili olarak elde ettiğimiz bilgiler, kendi ticari sırlarımıza gösterdiğimiz özen derecesinde gizli olarak korunmaktadır. Bu bilgilere ancak üyemizin talep ettiği hizmeti yerine getirmek amacıyla ve hizmetin gerektirdiği ölçüde şirketimiz personeli ve sigorta şirketlerinin personeli tarafından ulaşılabilmektedir.
                                </p>
                                <p>
                                    Sigortaciniz.com’dan gönderilen e-postaların alt kısmında bulunan “Sigortaciniz.com bültenlerini almak istemiyorsanız tıklayın.” linkine tıklayarak, <strong>info@sigortaciniz.com</strong> adresine e-posta göndererek ya da <strong>0 537 947 34 64</strong> numaralı destek hattımızdan arayarak e-posta gönderim listesinden kolayca çıkabilir, yine aynı kanallar üzerinden zaman zaman hizmetlerimiz ve poliçenizin durumu hakkında bilgi vermek amacı ile gönderdiğimiz SMS’leri almak istemediğinizi iletebilirsiniz.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">2. Bilgi Kaynakları</h2>
                                <p className="mb-6">
                                    Sizinle ilgili olarak elde ettiğimiz bilgiler size en uygun hizmeti sunmamızı ve bu hizmetlerin kalitesini sürekli olarak artırmayı temin etmeye yöneliktir. Bu bilgiler aşağıda belirtilen üç şekilde temin edilmektedir.
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">a. Sizin Tarafınızdan Sağlanan Bilgiler</h3>
                                        <p>
                                            Sizin web sitemizi kullanarak veya e-posta, faks gibi diğer yollarla bize sağladığınız bilgiler tarafımızdan alınmakta ve kaydedilmektedir. Bu yolla elde edilen bilgiler tamamen özgür iradenizle tarafımıza sağladığınız bilgilerdir. Bu bilgileri bize verip vermemekte serbestsiniz ancak size daha çabuk, doğru, etkili ve kaliteli hizmet sunabilmemiz için web sitemizde sizden talep edilen bilgilerin tamamını vermenizi öneriyoruz. Ayrıca talep ettiğiniz hizmetin gerektirdiği zorunlu bilgileri vermemeniz durumunda talebinizin yerine getirilmesinin mümkün olamayacağı tarafınızdan dikkate alınmalıdır. Verdiğiniz bilgilerin doğru ve eksiksiz olması sizin sorumluluğunuzdadır. Yanlış, yanıltıcı veya eksik bilgi vermeyiniz. Yanlış, yanıltıcı veya eksik bilgi verilmesi veya beyanlarda bulunulması, talep ettiğiniz sigortanın geçerliliğini, bizim ve/veya sigorta şirketinin size ve/veya sigortalıya karşı olan sorumluluklarını ve poliçeye dayalı sigorta tazminatı talep haklarını etkileyebilir. Böyle bir durumda Sigortaciniz.com hiçbir sorumluluk kabul etmez. Yanlış, yanıltıcı veya eksik bilgi vermeniz nedeniyle Sigortaciniz.com bir zarara uğradığı takdirde bu zararı tazmin yükümlülüğü tarafınıza aittir.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">b. Otomatik Olarak Sağlanan Bilgiler</h3>
                                        <p>
                                            Web sitemizi ziyaretiniz sırasında bilgisayarlar ve işletim sistemlerimizin sizi otomatik olarak tanımasına yarayan ve ‘çerez’ olarak adlandırılan tanımlama sistemi yoluyla daha önce sitemize yaptığınız ziyaretlerde ve aldığınız hizmetlerde elde edilen bilgilerdir. Bilgisayarınızın ‘yardım’ menüsünde bu özelliği kısıtlamak veya tamamen etkisiz hale getirmek için ne yapmanız gerektiğini bulabilirsiniz. Ancak, bu şekilde elde ettiğimiz bilgiler size vereceğimiz hizmetin daha çabuk ve kaliteli olmasında kullanılacağından bu özelliği açık bırakmanızı öneririz.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">c. Diğer Kaynaklardan Sağlanan Bilgiler</h3>
                                        <p>
                                            Sigorta poliçelerinizin zamanında yenilenmesi ve adres, telefon numarası gibi bilgilerinizin güncel tutulması gibi amaçlarla sigorta yaptırdığınız sigorta şirketlerinden, TRAMER ve ticaret sicili gibi kaynaklardan elde edilen bilgilerdir.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-foreground mb-4">3. Diğer Kullanım Şartları</h2>
                                <p className="mb-4">
                                    Burada belirtilen şartların dışında web sitemizi ziyaret eden ve/veya hizmet talebinde bulunan herkes ‘Kullanıcı Sözleşmesi‘ bölümünde belirtilen hükümleri de okumuş ve içeriğini aynen kabul etmiş sayılır.
                                </p>
                                <p>
                                    ‘Gizlilik Politikası‘ ve ‘Kullanıcı Sözleşmesi‘ bölümlerindeki hükümler ve bu hükümlerde Sigortaciniz.com tarafından zaman zaman yapılan değişiklikler, Sigortaciniz.com ile sizin aranızda kurulan hukuki ilişkinin tamamını oluşturur ve tarafları bağlar. Aksi yazılı olarak ayrıca kararlaştırılmadıkça Sigortaciniz.com’e karşı bu hükümlere aykırı hiçbir talepte bulunulamaz ve hak ileri sürülemez.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

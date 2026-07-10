# Iron_Steel_FullStack

### Proje Açıklaması ### - Türkçe

1. Aşama: Mobil Fikir ve Mimari Seçimi

İlk olarak demir-çelik sektöründeki satış temsilcilerinin sahadaki ERP sistemleri yerine toplantı esnasında hızlıca veri görebileceği, pazarlamaya yatkın modern bir mobil platform fikri üzerine odaklandık. Bu platform için sektör standardı olan aşağıda yer alan mimariyi seçtik: 

* Veritabanı: PostgreSQL
* Container Çalışma Ortamı: Docker
* Backend: Java Spring Boot (REST API)
* Mobil: React Native (Javascript)

2. Aşama: Docker ile Veritabanı Altyapısının Kurulması

Yerel PostgreSQL servislerinin sürüm sıkıntıları ve port çakışmaları nedeniyle containerization yinteminden faydalandık. 

* Bilgisayarımızın eski sürümleri ve arızalarından tamamen izole, temiz bir PostgreSQL konteynerını dış dünyaya belirlediğimiz şifreler ve portlar aracılığıyla bağladık. 
* Böylece "Benim bilgisayarımda çalışması/servis bulunamadı." gibi sorumlardan Docker tüneliyle çözüm bulduk.

3. Aşama: pgAdmin ile Demir-Çelik veri şemasının çizilmesi 

Veritabanı yönetim arayüzü olan pgAdmin 4 ile önceden belirlediğimiz porta bağlandık. Ardından Kaggle gibi platformlardan veri almak yerine kendi geliştirdiğimizin mobil uygulamanın ekranlarına birebir uyum sağlayacak, uygulama gereksinimlerine uygun şekilde bir demir-çelik veri şeması tasarladık: 

* customers: Şirket adları, borç durumları, vadesi geçmiş (riskli) borçlar ve kredi limitleri
* products: sıcak/soğuk rulo saclar, inşaat demirleri, çelik kalite numaraları, kalınlıklar, tonaj bazlı stoklar ve ton fiyatları
* orders & campaigns: Son siparişlerin sevkiyat durumlar ('Sevkiyatta', 'Üretimde') ve satışçıların sahada elini güçlendirecek aktif pazarlama kampanyaları 

4. Aşama: Spring Boot Katmanlı Mimari İnşası

Backend tarafındakodun sürdürülebilir ve temiz olması için kurumsal yazılım dünyasının standardı olan Katmanlı Mimari (Layered Architecture) prensibini uyguladık. 
Aşağı yer alan sınıfları tek tek inşa ettik: 

* entity (Modeller): Veritabanındaki tabloları Java nesnelerine dönüştürdük.
* repository (Veri Erişim): Spring Data JPA kullanarak tek satır SQL yazmadan veritabanına sorgu atabilen arayüzleri tanımladık.
* service (İş Mantığı): Verilerin ham halini işleyen ve kontrol eden servis katmanlarını yazdık. 
* controller (REST API/ Dış Kapı): Mobil uygulamanın HTTP istekleri (GET) ile tetikleyeceği uç noktaları (endpoints) dünyaya açtık. 
* config (CORS Güvenliği): İleride mobil cihazları backende bağlanırken tarayıcı/cihaz güvenlik duvarlarına takılmasını engelleyen global CORS ayarını yaptık. 

5. Aşama: Derleme (Compilation) ve Entegraston Hatalarının Çözümü

Projeyi derlerken Java'nın çeşitli kurallarından kaynaklı hataları, paket ve import uyuşmazlıkları, yanlış port yapılandırmaları gibi fazla sayıda hatayı analiz ederek erittik. 

Son olarak Maven'ın eski kopyaları okumasını engellemek için 'target' klasörünü manuel olarak temizleyip tetiğe bastık. 

## Güncel olarak neredeyiz? ##

Şu an backend sunucumuz arka planda tıkır tıkır çalışmakta. Tarayıcıdan adresleri çağırdığımızda PostgreSQL veritabanındaki tonaj fiyatları, cari risk grafik verileri ve sevkiyat durumları JSON formatında ekrana dökülüyor. Yanin sistemin veri sağlayan motor kısmı (Backend) tam anlamıyla hazır sayılır. 

Bundan sonraki adımımız, bu hazır motorun React Native ile mobil arayüz (Frontend) giydirmek ve sahada koşturan satış temsilcilerinin telefonunda bu verileri elde etmek! 
# Iron_Steel_FullStack

### Proje Açıklaması ###

 - Türkçe

Demir-Çelik CRM (Müşteri İlişkileri Yönetimi)/ERP (Kurumsal Kaynak Planlama) Mobile & API Ekosistem

Bu proje, demir-çelik sektörü için özelleştirilmiş kurumsal düzeyde bir FullStack CRM/ERP uygulamasıdır. Ölçeklenebilir bir backend mimarisine, izole konteynerler içinde çalışan güvenli bir ilişkisel veritabanı ekosistemine ve Rol Tabanlı Erişim Kontrolü (RBAC) ile yönetilen dinamik bir çapraz platform mobil uygulamaya sahiptir. 

## Sistem Mimarisi 
Sistem, modern kurumsal altyapı standartlarına uygun olarak birbirinden bağımsız üç katman halinde tasarlanmıştır: 

```text
[ React Native App (TypeScript) ]
              |
    HTTP REST / JSON (Axios)
               |
[ Spring Boot REST API ]
              | 
    JDBC / Hibernate ORM 
              | 
    [PostgreSQL (Isolated Docker Container) ]


1. Aşama: Mobil Fikir ve Mimari Seçimi

İlk olarak demir-çelik sektöründeki satış temsilcilerinin sahadaki ERP sistemleri yerine toplantı esnasında hızlıca veri görebileceği, pazarlamaya yatkın modern bir mobil platform fikri üzerine odaklandık. Bu platform için sektör standardı olan aşağıda yer alan mimariyi seçtik: 

* Veritabanı: PostgreSQL
* Container Çalışma Ortamı: Docker
* Backend: Java Spring Boot (REST API)
* Mobil: React Native (TypeScript)

2. Aşama: Docker ile Veritabanı Altyapısının Kurulması

* PostgreSQL: Demir-Çelik sektörünün tonaj, hassas döviz bakiyeleri ve çok boyutlu satış süreçlerini takip etmek için karmaşık veri bütünlüğü kurallarıyla yapılandırılmış İlişkisel Veritabanı (RDBMS) kullanıldı. 

* Docker & Containerization: Veritabanı, ana bilgisayardan tamamen izole edilerek Docker konteyneri içinde calıştırılmıştır, bu sayede yüksek taşınabilirlik ve güvenlik sağlanmıştır. 

* Veritabanı İndexleri: Coğrafi bölgeler ve yabancı anahtar (Foreign Key) ilişkileri gibi sık sorgulanan sütunlarda stratejik indeksler kullanılarak performans optimizasyonu yapılmıştır. 

3. Aşama: pgAdmin ile Demir-Çelik veri şemasının çizilmesi 

Veritabanı yönetim arayüzü olan pgAdmin 4 ile önceden belirlediğimiz porta bağlandık. Ardından Kaggle gibi platformlardan veri almak yerine kendi geliştirdiğimizin mobil uygulamanın ekranlarına birebir uyum sağlayacak, uygulama gereksinimlerine uygun şekilde bir demir-çelik veri şeması tasarladık.

4. Aşama: Spring Boot Katmanlı Mimari İnşası

Backend tarafındakodun sürdürülebilir ve temiz olması için kurumsal yazılım dünyasının standardı olan Katmanlı Mimari (Layered Architecture) prensibini uyguladık. 

* Java 17+ & Spring Boot: Yüksek işlem hacmine sahip kurumsal iş yüklerini yöneten, kurumsal düzeyde backend iskeleti inşa edildi. 

* Spring Data JPA & Hibernate ORM: Java nesnelerini PostgreSQL şemalarıyla sorunsuz bir şekilde eşleştiren ve veri erişim katmanlarını soyutlayan Nesne-İlişkisel (ORM) çerçevesi yapılandırıldı.

* RESTful API Services: İşlemsel JSON verilerini güvenli bir şekilde işlemek için tasarlanmış durumsuz (Stateless) API uç noktaları oluşturuldu. 

5. Aşama: Sunum Katmanı 

* React Native & TypeScript: Gerçek yerel (native) kodlara derlenen, üretime hazır, çapraz platform mobil ekosistem. TypeScript ile derleme zamanı katı tip güvenliği sağlanmıştır. 

* React Navigation (Stack): Ekranlar arası durum geçişlerini, sayfa yığınlarını ve derin bağlantı bileşenlerini yöneten gelişmiş navigasyon altyapısı geliştirilme sürecindedir. 

* Axios: Açık ağ topolojileri üzerinden istemci-sunucu haberleşmesini koordine etmek için yapılandırılmış asenkron HTTP istemcisi kullanılmaktadır. 

* AsyncStorage: Kullanıcı oturumlarının sürekliliği için güvenlik tokenlarını şifreleyen ve cihaz hafızasında saklayan yerel depolama katmanı geliştirilme aşamasında. 

🔒 Güvenlik ve Erişim Kontrolü 

Ekosistem, gelişmiş bir Rol Tabanlı Erişim Kontrolü (RBAC) protokolü uyguyacaktır. Kullanıcılar kimlik doğrulaması yaptığında, backend onların sistem yetkilerini değerlendirir ve Base64 ile kodlanmış bir oturum token'ı üretir. 

Dinamik Arayüz Yönetimi: 
Mobil frontend bu token'ı çözer ve Dashboard Kullanıcı Arayüzünü anlık olarak şu şekilde dinamik olarak şekillendirir: 

Role                Yetki Sınırı                Yetenekler
DİREKTÖR            Tam İşlem Erişimi           Tüm finansal analizleri, siparişleri ve cari kartları görebilir. 
SATIŞ TEMSİLCİSİ    Operasyonel Erişim          Müşteri ziyaret raporları ve ürün kataloglarına erişebilir. 
STAJYER             Salt-okunur Erişim          Sadece genel Müşteri Listesini görebilir. Finansal modüller arayüzden gizlenir. 

## Projeyi Çalıştırma 

1. Aşama: PostgreSQL veritabanını ve Docker'ı ayağa kaldırmak için iki yöntem: 

1- Docker Desktop ile manuel olarak 'iron-steel-postgres' isimli imaj çalıştırılır. 
2- Terminal komutu çalıştırılır: 

docker run --name iron-steel-postgres -e POSTGRES_PASSWORD=your_secure_password -p 5432:5432 -d postgres

2. Aşama: Backend'i başlatma:
// backend ile ilgili klasöre gidilir 
cd com.demircelik.api 
// mvn ile Spring Boot ayağa kaldırılır. 
.\mvnw spring-boot:run

3. Aşama: Mobil Uygulamayı Başlatma: 
// Frontend ile ilgili klasöre gidilir
cd DemirCelikMobil
// Metro Bundler başlatılır 
npm start 
// Port yönlendirmesi yapılır (isteğe göre)
adb reverse tcp:8081 tcp:8081
// Görsel sunum için android başlatılır
npx react-native run-android

** Endüstri standardı tam yığın entegrasyonları takip eden bir mühendislik projesi olarak geliştirilmiştir. 

### Project Description

 - English

Iron-Steel CRM (Customer Relational Management)/ERP (Enterprise Resource Planning) Mobile & API Ecosystem

This project is an enterprise-grade, full-stack CRM/ERM application customized for the iron and steel industry. It features a scalable backend architecture, a secure relational database ecosystem running inside isolated containers, and a dynamic cross-platform mobile application driven by Role-Based Access Control (RBAC).

## System Architecture
The system is engineered across three decoupled layers adhering to modern corporate infrastructure standards:

```text
[ React Native App (TypeScript) ]
              |
    HTTP REST / JSON (Axios)
               |
[ Spring Boot REST API ]
              | 
    JDBC / Hibernate ORM 
              | 
    [PostgreSQL (Isolated Docker Container) ]


1. Step: Mobile Idea and Architecture Choice 
Firstly, we focused on a modern mobile platform that sales representers in iron-steel industry can see data during meeting immediately instead of basic ERP systems. We choice following architecture that is industry standard for this platform: 

* Database: PostgreSQL
* Container Environment: Docker
* Backend: Java Spring Boot (REST API)
* Mobile: React Native (TypeScript)

2. Step: Installing Database Infrastructure by Docker

* PostgreSQL: Relational Database Management System (RDBMS) configured with complex data integrity rules to track high-precision steel tonnages, currency balances, and multidimensional sales pipelines. 

* Docker & Containerization: The database is fully containerized and isolated from the host environment, ensuring high portability and security. 

* Database Indices: Custom performance tracking optimized via strategic indices on frequently queried columns like geographical regions and foreign key relations. 

3. Step: Creating Iron-Steel Data Schema by pgAdmin

We connected to predetermined port with pgAdmin 4 which is database management interface. Then, we created a iron-steel data schema that fully adapt with our developed mobile application. 

3. Aşama: pgAdmin ile Demir-Çelik veri şemasının çizilmesi 

Veritabanı yönetim arayüzü olan pgAdmin 4 ile önceden belirlediğimiz porta bağlandık. Ardından Kaggle gibi platformlardan veri almak yerine kendi geliştirdiğimizin mobil uygulamanın ekranlarına birebir uyum sağlayacak, uygulama gereksinimlerine uygun şekilde bir demir-çelik veri şeması tasarladık.

4. Step: Building Spring Boot Layered Architecture
We implemented Layered Architecture that is enterprise software world's standard for being clean and sustainable in backend part. 

* Java 17+ & Spring Boot: Enterprise-grade backend framework handling high-throughput corporate workloads. 

* Spring Data JPA & Hibernate ORM: Object-Relational Mapping(ORM) framework utilized to abstract data access layers, mapping Java entities to PostgreSQL schemas seanlessly. 

* RESTful API Services: Stateless endpoints engineered to handle transactional JSON payloads securely. 

5. Step: Presentation Layer: 

* React Native & TypeScript: A production-ready, cross-platform mobile ecosystem compiling into native binaries. TypeScript provides strict compile-time type-safety. 

* React Navigation (Stack): Advanced navigation infrastructure managing statful transitions, screen stacks, and deep-linking components.

* Axios: Asynchronous HTTP client configured to orchestrate client-server handshakes via explicit networking topologies. 

* AsyncStorage: Persistent on-device local storage to encrypt and cache state-level security tokens for seamless user sessions. 

🔒 Security & Access Control 
The ecosystem implements and advanced Role-Based Access Control (RBAC) protocol. When users authenticate, the backend evaluates their system clearance and yields a Base64-encoded session payload (Simulated Token).

Dynamic UI Rendering Framework
The mobile frontend decoded this runtime asset and dynamically renders the Dashboard UI accordingly: 
Role         Access Clearance                     UI Capabilities               
DIRECTOR     Full Executive Access                Can view financial risk analytics, ledger collection, orders, and customer logs.
SALES_REP    Operational Access                   Authorized for customer visits, CRM entries, and product catalogs.
INTERN       Restricted Read-Only                 Limited exclusively to general Customer Registry lookup. Financial modules are strippped from the UI. 

Execution and Deployment

1. Step: Two methods to deploy PostgreSQL database and Docker 

1- Manuelly, run 'iron-steel-postgres' named image by Docker Desktop. 
2- Run the terminal command: 

docker run --name iron-steel-postgres -e POSTGRES_PASSWORD=your_secure_password -p 5432:5432 -d postgres

2. Step: Start Backend: 
// Go to related folder
cd com.demircelik.api 
// deploy Spring Boot with mvn
.\mvnw spring-boot:run

3. Step: Start the Mobile Application: 
// Go to frontend related folder
cd DemirCelikMobil
// run Metro Bundler 
npm start 
// Do port direction (up to you)
adb reverse tcp:8081 tcp:8081
//run android for visualization
npx react-native run-android

** It is developed as an engineering project that follows industry standard-full stack entegrations. 


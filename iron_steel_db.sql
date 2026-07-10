-- MÜŞTERİLER TABLOSU --
CREATE TABLE customers (
id SERIAL PRIMARY KEY,
company_name VARCHAR(255) NOT NULL,
tax_number VARCHAR(11) UNIQUE,
total_debt NUMERIC(12, 2) DEFAULT 0.00, -- toplam borç --
overdue_debt NUMERIC(12, 2) DEFAULT 0.00, -- vadesi geçmiş (riskli) borc --
credit_limit NUMERIC(12, 2) DEFAULT 0.00, -- şirketin tanıdığı kredi limiti --
city VARCHAR(50)
);

-- ÜRÜNLER TABLOSU --
CREATE TABLE products (
id SERIAL PRIMARY KEY,
product_name VARCHAR(255) NOT NULL,
product_type VARCHAR(100),
steel_quality VARCHAR(50),
thickness_mm NUMERIC(5, 2),
stock_tons NUMERIC(10, 2) DEFAULT 0.00,
price_per_ton NUMERIC(10, 2) NOT NULL
);

-- SİPARİŞLER TABLOSU --
CREATE TABLE orders (
id SERIAL PRIMARY KEY, 
customer_id INT REFERENCES customers(id), -- hangi müşterinin siparişi --
order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
total_amount NUMERIC(12, 2),
delivery_status VARCHAR(50)
);

-- KAMPANYALAR VE DUYURULAR TABLOSU --
CREATE TABLE campaigns (
id SERIAL PRIMARY KEY,
customer_id INT REFERENCES customers(id),
order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
total_amount NUMERIC(12, 2),
delivery_status VARCHAR(50)
);

-- MÜŞTERİ VERİLERİ EKLEME (MOCK DATA) --
INSERT INTO customers (company_name, tax_number, total_debt, overdue_debt, credit_limit, city) VALUES
('Müşteri şirket 1 A.Ş.', '12345678901', 450000.00, 120000.00, 1000000.00, 'İstanbul'),
('Müşteri Şirket 2 A.Ş.', '98765432109', 850000.00, 0.00, 1500000.00, 'Zonguldak'),
('Müşteri Şirket 3 A.Ş.', '45678901234', 0.00, 0.00, 500000.00, 'Ankara');

-- ÜRÜN VERİLERİ EKLEME (MOCK DATA) --
INSERT INTO products (product_name, product_type, steel_quality, thickness_mm, stock_tons, price_per_ton) VALUES
('Sıcak Haddelenmiş Asitlnemiş Sac', 'Rulo Sac', 'S235JR', 4.00, 120.50, 720.00),
('Soğuk Haddelenmiş Sac', 'Rulo Sac', 'DC01', 1.20, 45.00, 850.00),
('Galvenizli Sac', 'Sac', 'B420C', 12.00, 300.00, 680.00),
('Boyalı Sac', 'Sac', 'S275JR', 2.00, 15.50, 790.00);

-- SİPARİŞ VERİLERİ EKLEME --
INSERT INTO orders (customer_id, total_amount, delivery_status) VALUES
(1, 35000.00, 'Sevkiyatta'),
(1, 12000.00, 'Teslim Edildi'),
(2, 145000.00, 'Üretimde');

--KAMPANYA VERİLERİ EKLEME --
-- INSERT INTO campaigns (title, description, discount_rate, start_date, end_date) VALUES
-- ('Sıcak Haddelenmiş Sacda Toplu alımda indirim', ' %3 nakit indirimi vs. vs...', 3.00, '2026-07-01', '2026-08-01');

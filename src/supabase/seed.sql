-- Seed data for demo purposes
-- Note: In production, users should be created through the signup flow

-- Seed products
INSERT INTO products (code, name, size, color, price, description, stock) VALUES
    ('PRD001', 'Сүү 1л', '1л', 'Цагаан', 3500, 'Эрүүл мэндийн сүү', 150),
    ('PRD002', 'Талх', '500г', 'Бор', 2000, 'Шинэ талх', 200),
    ('PRD003', 'Төмс', '1кг', 'Шар', 1500, 'Шинэ төмс', 300),
    ('PRD004', 'Лууван', '1кг', 'Улаан', 2500, 'Шинэ лууван', 100),
    ('PRD005', 'Сонгино', '1кг', 'Улаан', 1800, 'Шинэ сонгино', 150)
ON CONFLICT (code) DO NOTHING;

-- Seed stocks
INSERT INTO stocks (product_code, qty, warehouse) VALUES
    ('PRD001', 150, 'Агуулах A'),
    ('PRD002', 200, 'Агуулах A'),
    ('PRD003', 300, 'Агуулах A'),
    ('PRD004', 100, 'Агуулах B'),
    ('PRD005', 150, 'Агуулах B')
ON CONFLICT DO NOTHING;

-- Note: Users must be created through Supabase Auth signup
-- Demo credentials (to be created via signup API):
-- Phone: 99000000, Password: super123, Role: super_admin, Name: Супер Админ
-- Phone: 99000001, Password: admin123, Role: admin, Name: Админ Дорж
-- Phone: 99000002, Password: operator123, Role: operator, Name: Оператор Болд
-- Phone: 99112233, Password: driver123, Role: driver, Name: Жолооч Бат
-- Phone: 99112234, Password: lead123, Role: driver_lead, Name: Ахлагч Цэрэн
-- Phone: 99112235, Password: account123, Role: accounting, Name: Нягтлан Сара
-- Phone: 99112236, Password: warehouse123, Role: warehouse, Name: Агуулах Ганбат

-- SQL Script to manually create demo users in Supabase
-- Run this in Supabase SQL Editor AFTER creating auth users in Authentication UI

-- Instructions:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" and create each user with:
--    - Email: {phone}@logistics.mn (e.g., 99000000@logistics.mn)
--    - Password: {password from table below}
--    - Auto Confirm User: YES
-- 3. Copy the User ID (UUID) from the created user
-- 4. Run the corresponding INSERT below with the User ID

-- User 1: Super Admin
-- Email: 99000000@logistics.mn, Password: super123
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99000000', 'Супер Админ', 'super_admin');

-- User 2: Admin  
-- Email: 99000001@logistics.mn, Password: admin123
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99000001', 'Админ Дорж', 'admin');

-- User 3: Operator
-- Email: 99000002@logistics.mn, Password: operator123
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99000002', 'Оператор Болд', 'operator');

-- User 4: Driver
-- Email: 99112233@logistics.mn, Password: driver123
INSERT INTO user_profiles (id, phone, name, role, driver_name)
VALUES ('PASTE_USER_ID_HERE', '99112233', 'Жолооч Бат', 'driver', 'Бат');

-- User 5: Driver Lead
-- Email: 99112234@logistics.mn, Password: lead123
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99112234', 'Ахлагч Цэрэн', 'driver_lead');

-- User 6: Accounting
-- Email: 99112235@logistics.mn, Password: account123
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99112235', 'Нягтлан Сара', 'accounting');

-- User 7: Warehouse
-- Email: 99112236@logistics.mn, Password: warehouse123
INSERT INTO user_profiles (id, phone, name, role)
VALUES ('PASTE_USER_ID_HERE', '99112236', 'Агуулах Ганбат', 'warehouse');

-- Verify users were created
SELECT id, phone, name, role, created_at 
FROM user_profiles 
ORDER BY created_at DESC;

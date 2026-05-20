INSERT INTO users (username, password_hash)
VALUES
('admin', '$2a$10$mockhashforadminuser'),
('manager', '$2a$10$mockhashformanageruser');

INSERT INTO categories (name)
VALUES
('Phone'),
('Tablet'),
('Accessory'),
('Other');

INSERT INTO tags (name)
VALUES
('apple'),
('ios'),
('android'),
('flagship'),
('camera'),
('budget'),
('tablet'),
('productivity'),
('stylus'),
('audio'),
('watch'),
('fitness'),
('charger'),
('battery'),
('mouse'),
('office'),
('usb-c'),
('travel');

INSERT INTO products (name, description, price, category_id, image_url)
VALUES
('iPhone 16 Pro', 'Premium Apple smartphone with powerful camera and fast performance.', 1199.00, (SELECT id FROM categories WHERE name = 'Phone'), 'https://picsum.photos/seed/iphone-16-pro/800/600'),
('Samsung Galaxy S25', 'Flagship Android phone with AMOLED display and high refresh rate.', 1099.00, (SELECT id FROM categories WHERE name = 'Phone'), 'https://picsum.photos/seed/samsung-galaxy-s25/800/600'),
('Google Pixel 9', 'Google smartphone focused on clean Android experience and AI camera features.', 899.00, (SELECT id FROM categories WHERE name = 'Phone'), 'https://picsum.photos/seed/google-pixel-9/800/600'),
('Xiaomi 14T', 'Affordable performance phone with long battery life and fast charging.', 599.00, (SELECT id FROM categories WHERE name = 'Phone'), 'https://picsum.photos/seed/xiaomi-14t/800/600'),
('iPad Air 6', 'Lightweight tablet for study, design work, entertainment, and productivity.', 699.00, (SELECT id FROM categories WHERE name = 'Tablet'), 'https://picsum.photos/seed/ipad-air-6/800/600'),
('Samsung Galaxy Tab S10', 'Android tablet with large display, stylus support, and multitasking features.', 799.00, (SELECT id FROM categories WHERE name = 'Tablet'), 'https://picsum.photos/seed/galaxy-tab-s10/800/600'),
('Lenovo Tab Plus', 'Portable tablet for watching movies, browsing, reading, and online learning.', 329.00, (SELECT id FROM categories WHERE name = 'Tablet'), 'https://picsum.photos/seed/lenovo-tab-plus/800/600'),
('AirPods Pro 2', 'Wireless noise cancelling earbuds with spatial audio and compact charging case.', 249.00, (SELECT id FROM categories WHERE name = 'Accessory'), 'https://picsum.photos/seed/airpods-pro-2/800/600'),
('Galaxy Watch 7', 'Smartwatch for fitness tracking, notifications, health monitoring, and daily use.', 299.00, (SELECT id FROM categories WHERE name = 'Accessory'), 'https://picsum.photos/seed/galaxy-watch-7/800/600'),
('Anker PowerCore 20000', 'High capacity portable power bank for phones, tablets, and travel charging.', 69.00, (SELECT id FROM categories WHERE name = 'Accessory'), 'https://picsum.photos/seed/anker-powercore-20000/800/600'),
('Logitech MX Master 3S', 'Wireless productivity mouse with ergonomic design and precise scrolling.', 99.00, (SELECT id FROM categories WHERE name = 'Accessory'), 'https://picsum.photos/seed/logitech-mx-master-3s/800/600'),
('USB-C Travel Hub', 'Compact USB-C hub with HDMI, USB ports, and card reader for daily work.', 45.00, (SELECT id FROM categories WHERE name = 'Other'), 'https://picsum.photos/seed/usb-c-travel-hub/800/600');

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('apple', 'ios', 'flagship', 'camera')
WHERE p.name = 'iPhone 16 Pro';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('android', 'flagship')
WHERE p.name = 'Samsung Galaxy S25';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('android', 'camera')
WHERE p.name = 'Google Pixel 9';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('android', 'budget')
WHERE p.name = 'Xiaomi 14T';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('apple', 'tablet', 'productivity')
WHERE p.name = 'iPad Air 6';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('android', 'tablet', 'stylus')
WHERE p.name = 'Samsung Galaxy Tab S10';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('tablet', 'budget')
WHERE p.name = 'Lenovo Tab Plus';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('apple', 'audio')
WHERE p.name = 'AirPods Pro 2';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('watch', 'fitness')
WHERE p.name = 'Galaxy Watch 7';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('charger', 'battery', 'travel')
WHERE p.name = 'Anker PowerCore 20000';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('mouse', 'productivity', 'office')
WHERE p.name = 'Logitech MX Master 3S';

INSERT INTO product_tags (product_id, tag_id)
SELECT p.id, t.id
FROM products p
JOIN tags t ON t.name IN ('usb-c', 'office', 'travel')
WHERE p.name = 'USB-C Travel Hub';

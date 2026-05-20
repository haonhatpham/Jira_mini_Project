SELECT
  p.id,
  p.name,
  p.price,
  c.name AS category,
  ARRAY_AGG(t.name ORDER BY t.name) AS tags,
  p.image_url,
  p.created_at,
  p.updated_at
FROM products p
JOIN categories c ON c.id = p.category_id
LEFT JOIN product_tags pt ON pt.product_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
GROUP BY p.id, c.name
ORDER BY p.id;

SELECT image_url, COUNT(*)
FROM products
GROUP BY image_url
HAVING COUNT(*) > 1;

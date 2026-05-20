const { connect, query } = require("../config/db");

const PRODUCT_SELECT = `
  SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    c.name AS category,
    COALESCE(
      ARRAY_AGG(t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL),
      '{}'
    ) AS tags,
    p.image_url AS "imageUrl",
    p.created_at AS "createdAt",
    p.updated_at AS "updatedAt"
  FROM products p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN product_tags pt ON pt.product_id = p.id
  LEFT JOIN tags t ON t.id = pt.tag_id
`;

const PRODUCT_GROUP = `
  GROUP BY p.id, c.name
`;

async function findAllProducts() {
  const result = await query(`
    ${PRODUCT_SELECT}
    ${PRODUCT_GROUP}
    ORDER BY p.id
  `);

  return result.rows.map(mapProductRow);
}

async function findProducts(options) {
  const { whereSql, values } = buildProductFilters(options.filters);
  const offset = (options.page - 1) * options.limit;
  const sortColumn = getSortColumn(options.sort);
  const sortOrder = options.order.toUpperCase();

  const productsResult = await query(`
    ${PRODUCT_SELECT}
    ${whereSql}
    ${PRODUCT_GROUP}
    ORDER BY ${sortColumn} ${sortOrder}, p.id ASC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `, [...values, options.limit, offset]);

  const countResult = await query(`
    SELECT COUNT(DISTINCT p.id)::int AS total
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ${whereSql}
  `, values);

  return {
    data: productsResult.rows.map(mapProductRow),
    total: countResult.rows[0].total,
  };
}

async function findProductById(id) {
  const result = await query(`
    ${PRODUCT_SELECT}
    WHERE p.id = $1
    ${PRODUCT_GROUP}
  `, [id]);

  return result.rows[0] ? mapProductRow(result.rows[0]) : null;
}

async function createProduct(productInput) {
  const client = await connect();

  try {
    await client.query("BEGIN");

    const categoryId = await findCategoryId(client, productInput.category);
    const productResult = await client.query(
      `
        INSERT INTO products (name, description, price, category_id, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [
        productInput.name,
        productInput.description,
        productInput.price,
        categoryId,
        productInput.imageUrl,
      ],
    );

    const productId = productResult.rows[0].id;
    await replaceProductTags(client, productId, productInput.tags);
    await client.query("COMMIT");

    return findProductById(productId);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function replaceProduct(id, productInput) {
  const client = await connect();

  try {
    await client.query("BEGIN");

    const existingProduct = await client.query(
      "SELECT id FROM products WHERE id = $1",
      [id],
    );

    if (existingProduct.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const categoryId = await findCategoryId(client, productInput.category);

    await client.query(
      `
        UPDATE products
        SET
          name = $1,
          description = $2,
          price = $3,
          category_id = $4,
          image_url = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
      `,
      [
        productInput.name,
        productInput.description,
        productInput.price,
        categoryId,
        productInput.imageUrl,
        id,
      ],
    );

    await replaceProductTags(client, id, productInput.tags);
    await client.query("COMMIT");

    return findProductById(id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function deleteProduct(id) {
  await query("DELETE FROM products WHERE id = $1", [id]);
  return true;
}

async function findCategoryId(client, categoryName) {
  const result = await client.query(
    "SELECT id FROM categories WHERE name = $1",
    [categoryName],
  );

  if (result.rowCount === 0) {
    const error = new Error("Category not found");
    error.statusCode = 400;
    throw error;
  }

  return result.rows[0].id;
}

async function replaceProductTags(client, productId, tags) {
  await client.query("DELETE FROM product_tags WHERE product_id = $1", [productId]);

  for (const tagName of tags) {
    const tagResult = await client.query(
      `
        INSERT INTO tags (name)
        VALUES ($1)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `,
      [tagName],
    );

    await client.query(
      `
        INSERT INTO product_tags (product_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `,
      [productId, tagResult.rows[0].id],
    );
  }
}

function mapProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    tags: row.tags || [],
    imageUrl: row.imageUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function buildProductFilters(filters) {
  const values = [];
  const clauses = [];

  function addValue(value) {
    values.push(value);
    return `$${values.length}`;
  }

  if (filters.search) {
    const searchParam = addValue(`%${filters.search}%`);
    clauses.push(`(
      p.name ILIKE ${searchParam}
      OR p.description ILIKE ${searchParam}
      OR c.name ILIKE ${searchParam}
      OR EXISTS (
        SELECT 1
        FROM product_tags search_pt
        JOIN tags search_t ON search_t.id = search_pt.tag_id
        WHERE search_pt.product_id = p.id
          AND search_t.name ILIKE ${searchParam}
      )
    )`);
  }

  if (filters.category) {
    clauses.push(`c.name = ${addValue(filters.category)}`);
  }

  if (filters.minPrice !== null) {
    clauses.push(`p.price >= ${addValue(filters.minPrice)}`);
  }

  if (filters.maxPrice !== null) {
    clauses.push(`p.price <= ${addValue(filters.maxPrice)}`);
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
}

function getSortColumn(sort) {
  const sortColumns = {
    id: "p.id",
    name: "p.name",
    price: "p.price",
    category: "c.name",
    createdAt: "p.created_at",
    updatedAt: "p.updated_at",
  };

  return sortColumns[sort];
}

module.exports = {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProducts,
  findProductById,
  replaceProduct,
};

-- Users (both customers and admins)
CREATE TABLE IF NOT EXISTS users (
    id              TEXT PRIMARY KEY,
    username        TEXT NOT NULL UNIQUE,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    phone           TEXT DEFAULT '',
    avatar          TEXT DEFAULT '',
    role            TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')),
    status          TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','disabled')),
    last_login      TEXT DEFAULT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Categories (adjacency list for tree)
CREATE TABLE IF NOT EXISTS categories (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    parent_id       TEXT DEFAULT NULL REFERENCES categories(id) ON DELETE SET NULL,
    description     TEXT DEFAULT '',
    image           TEXT DEFAULT '',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    description     TEXT DEFAULT '',
    price           REAL NOT NULL DEFAULT 0,
    original_price  REAL DEFAULT NULL,
    cost_price      REAL DEFAULT NULL,
    stock           INTEGER NOT NULL DEFAULT 0,
    category_id     TEXT DEFAULT NULL REFERENCES categories(id) ON DELETE SET NULL,
    brand           TEXT DEFAULT '',
    images          TEXT NOT NULL DEFAULT '[]',
    specs           TEXT NOT NULL DEFAULT '[]',
    tags            TEXT DEFAULT '',
    is_featured     INTEGER NOT NULL DEFAULT 0,
    is_new          INTEGER NOT NULL DEFAULT 0,
    is_recommended  INTEGER NOT NULL DEFAULT 0,
    weight          REAL DEFAULT 0,
    sales_count     INTEGER NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive','draft')),
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Product SKUs (multi-spec variants)
CREATE TABLE IF NOT EXISTS product_skus (
    id              TEXT PRIMARY KEY,
    product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    spec_info       TEXT NOT NULL DEFAULT '{}',
    price           REAL DEFAULT NULL,
    stock           INTEGER NOT NULL DEFAULT 0,
    sku_code        TEXT NOT NULL UNIQUE,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id              TEXT PRIMARY KEY,
    order_no        TEXT NOT NULL UNIQUE,
    user_id         TEXT DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
    status          TEXT NOT NULL DEFAULT 'pending_payment'
                        CHECK(status IN ('pending_payment','paid','shipped','delivered','cancelled','refunded')),
    total_amount    REAL NOT NULL DEFAULT 0,
    discount_amount REAL NOT NULL DEFAULT 0,
    shipping_fee    REAL NOT NULL DEFAULT 0,
    payment_method  TEXT DEFAULT '',
    shipping_address TEXT NOT NULL DEFAULT '{}',
    remark          TEXT DEFAULT '',
    paid_at         TEXT DEFAULT NULL,
    shipped_at      TEXT DEFAULT NULL,
    delivered_at    TEXT DEFAULT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
    id              TEXT PRIMARY KEY,
    order_id        TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      TEXT DEFAULT NULL,
    product_name    TEXT NOT NULL,
    product_image   TEXT DEFAULT '',
    spec_info       TEXT DEFAULT '{}',
    price           REAL NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1,
    subtotal        REAL NOT NULL
);

-- Shopping cart
CREATE TABLE IF NOT EXISTS cart_items (
    id              TEXT PRIMARY KEY,
    user_id         TEXT DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id      TEXT DEFAULT NULL,
    product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku_id          TEXT DEFAULT NULL REFERENCES product_skus(id) ON DELETE SET NULL,
    spec_info       TEXT DEFAULT '{}',
    quantity        INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, session_id, product_id, sku_id)
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    subtitle        TEXT DEFAULT '',
    image_url       TEXT NOT NULL,
    link_url        TEXT DEFAULT '',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id              TEXT PRIMARY KEY,
    product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id         TEXT DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
    order_id        TEXT DEFAULT NULL,
    rating          INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    content         TEXT DEFAULT '',
    images          TEXT NOT NULL DEFAULT '[]',
    is_approved     INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_name   TEXT NOT NULL,
    phone           TEXT NOT NULL,
    province        TEXT NOT NULL,
    city            TEXT NOT NULL,
    district        TEXT NOT NULL,
    detail          TEXT NOT NULL,
    zip_code        TEXT DEFAULT '',
    is_default      INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Favorites / Wishlist
CREATE TABLE IF NOT EXISTS favorites (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, product_id)
);

-- Browse history
CREATE TABLE IF NOT EXISTS browse_history (
    id              TEXT PRIMARY KEY,
    user_id         TEXT DEFAULT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id      TEXT DEFAULT NULL,
    product_id      TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id              TEXT PRIMARY KEY,
    content         TEXT NOT NULL,
    link_url        TEXT DEFAULT '',
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Site settings (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
    id              TEXT PRIMARY KEY,
    key             TEXT NOT NULL UNIQUE,
    value           TEXT NOT NULL DEFAULT '',
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status  ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug    ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user      ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status    ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product  ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user   ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user        ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session     ON cart_items(session_id);

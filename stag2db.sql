-- Central product catalog (shared across all stores)
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    barcode VARCHAR(100) UNIQUE,
    category VARCHAR(100),
    unit_price DECIMAL(10,2) NOT NULL CHECK(unit_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Cities reference table (normalized city data)
CREATE TABLE cities (
    city_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50),
    UNIQUE (name, state_province, country)  -- Prevent duplicate city entries
);

-- Stores table with city relationship
CREATE TABLE stores (
    store_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),  -- Physical address
    city_id INTEGER REFERENCES cities(city_id),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Store inventory (store-specific stock levels)
CREATE TABLE store_inventory (
    inventory_id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    current_quantity INTEGER NOT NULL DEFAULT 0 CHECK(current_quantity >= 0),
    reorder_level INTEGER DEFAULT 0 CHECK(reorder_level >= 0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (store_id, product_id)  -- Ensure one inventory record per product per store
);

-- Stock movements (all inventory transactions)
CREATE TABLE stock_movements (
    movement_id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL REFERENCES stores(store_id),
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity_change INTEGER NOT NULL,
    movement_type VARCHAR(20) NOT NULL CHECK(movement_type IN (
        'STOCK_IN', 'SALE', 'MANUAL_REMOVAL', 'ADJUSTMENT', 
        'TRANSFER_IN', 'TRANSFER_OUT', 'RETURN', 'LOSS'
    )),
    reference_id VARCHAR(100),
    source_store_id INTEGER REFERENCES stores(store_id),  -- For transfers
    destination_store_id INTEGER REFERENCES stores(store_id),  -- For transfers
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER  -- User who initiated the movement
);

-- Simple admin users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'viewer')) NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



-- Suppliers table (added)
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city_id INTEGER REFERENCES cities(city_id),
    tax_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product-supplier relationship (added)
CREATE TABLE product_suppliers (
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    supplier_product_code VARCHAR(100),
    base_cost DECIMAL(10,2) CHECK(base_cost >= 0),
    lead_time_days INTEGER DEFAULT 0,
    PRIMARY KEY (product_id, supplier_id)
);

-- Add supplier reference to stock movements (modified)
ALTER TABLE stock_movements 
ADD COLUMN supplier_id INTEGER REFERENCES suppliers(supplier_id),
ADD COLUMN unit_cost DECIMAL(10,2);

-- Add supplier indexes (added)
CREATE INDEX idx_suppliers_city ON suppliers(city_id);
CREATE INDEX idx_product_suppliers_product ON product_suppliers(product_id);
CREATE INDEX idx_product_suppliers_supplier ON product_suppliers(supplier_id);
-- Indexes for performance
CREATE INDEX idx_stock_movements_store_product ON stock_movements(store_id, product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_store_inventory_store_product ON store_inventory(store_id, product_id);
CREATE INDEX idx_stores_city ON stores(city_id);


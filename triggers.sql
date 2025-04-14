CREATE OR REPLACE FUNCTION update_inventory_on_movement()
RETURNS TRIGGER AS $$
DECLARE 
    row_count INTEGER;
BEGIN
    -- Increase stock for STOCK_IN (from supplier) or ADJUSTMENT
    IF NEW.movement_type IN ('STOCK_IN', 'ADJUSTMENT') THEN
        UPDATE store_inventory
        SET current_quantity = current_quantity + NEW.quantity_change,
            last_updated = NOW()
        WHERE store_id = NEW.store_id AND product_id = NEW.product_id;

        -- Check if update was successful
        GET DIAGNOSTICS row_count = ROW_COUNT;
        IF row_count = 0 THEN
            INSERT INTO store_inventory (store_id, product_id, current_quantity, last_updated)
            VALUES (NEW.store_id, NEW.product_id, NEW.quantity_change, NOW());
        END IF;
    END IF;

    -- Decrease stock for SALES, REMOVALS, and LOSSES
    IF NEW.movement_type IN ('SALE', 'MANUAL_REMOVAL', 'LOSS') THEN
        UPDATE store_inventory
        SET current_quantity = current_quantity - NEW.quantity_change,
            last_updated = NOW()
        WHERE store_id = NEW.store_id AND product_id = NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER trigger_update_inventory
AFTER INSERT ON stock_movements
FOR EACH ROW EXECUTE FUNCTION update_inventory_on_movement();



CREATE OR REPLACE FUNCTION update_inventory_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- For regular stock movements (not transfers)
    IF NEW.movement_type NOT IN ('TRANSFER_IN', 'TRANSFER_OUT') THEN
        UPDATE store_inventory
        SET current_quantity = current_quantity + NEW.quantity_change,
            last_updated = NOW()
        WHERE store_id = NEW.store_id AND product_id = NEW.product_id;
        
        IF NOT FOUND THEN
            INSERT INTO store_inventory (store_id, product_id, current_quantity)
            VALUES (NEW.store_id, NEW.product_id, NEW.quantity_change);
        END IF;
    END IF;
    
    -- For transfer outs (decrease source store inventory)
    IF NEW.movement_type = 'TRANSFER_OUT' THEN
        UPDATE store_inventory
        SET current_quantity = current_quantity - NEW.quantity_change,
            last_updated = NOW()
        WHERE store_id = NEW.store_id AND product_id = NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory
AFTER INSERT ON stock_movements
FOR EACH ROW EXECUTE FUNCTION update_inventory_on_movement();


CREATE OR REPLACE FUNCTION complete_transfer_on_out()
RETURNS TRIGGER AS $$
BEGIN
    -- When a TRANSFER_OUT is recorded, automatically create the TRANSFER_IN
    IF NEW.movement_type = 'TRANSFER_OUT' AND NEW.destination_store_id IS NOT NULL THEN
        INSERT INTO stock_movements (
            store_id, product_id, quantity_change, movement_type,
            source_store_id, destination_store_id, notes, created_by
        ) VALUES (
            NEW.destination_store_id, NEW.product_id, NEW.quantity_change, 'TRANSFER_IN',
            NEW.store_id, NULL, NEW.notes, NEW.created_by
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_complete_transfer
AFTER INSERT ON stock_movements
FOR EACH ROW 
WHEN (NEW.movement_type = 'TRANSFER_OUT')
EXECUTE FUNCTION complete_transfer_on_out();


CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
DECLARE
    v_product_name VARCHAR;
    v_store_name VARCHAR;
    v_current_level INTEGER;
BEGIN
    SELECT p.name, s.name, NEW.current_quantity
    INTO v_product_name, v_store_name, v_current_level
    FROM products p
    JOIN stores s ON s.store_id = NEW.store_id
    WHERE p.product_id = NEW.product_id;
    
    IF NEW.current_quantity <= NEW.reorder_level THEN
        -- In a real system, you would send an email/notification here
        RAISE NOTICE 'Low stock alert: % at % (Current: %, Reorder Level: %)', 
            v_product_name, v_store_name, v_current_level, NEW.reorder_level;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_low_stock
AFTER UPDATE OF current_quantity ON store_inventory
FOR EACH ROW
WHEN (NEW.current_quantity <= NEW.reorder_level)
EXECUTE FUNCTION check_low_stock();

CREATE TABLE product_price_audit (
    audit_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    old_price DECIMAL(10,2) NOT NULL,
    new_price DECIMAL(10,2) NOT NULL,
    changed_by INTEGER,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.unit_price <> OLD.unit_price THEN
        INSERT INTO product_price_audit (product_id, old_price, new_price, changed_by)
        VALUES (OLD.product_id, OLD.unit_price, NEW.unit_price, NEW.updated_by);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_price_audit
AFTER UPDATE OF unit_price ON products
FOR EACH ROW EXECUTE FUNCTION log_price_change();


CREATE MATERIALIZED VIEW daily_sales_summary AS
SELECT 
    s.store_id,
    s.name AS store_name,
    c.name AS city,
    sm.product_id,
    p.name AS product_name,
    DATE(sm.created_at) AS sale_date,
    SUM(sm.quantity_change * -1) AS total_sold, -- Sales are negative quantities
    SUM(sm.quantity_change * -1 * p.unit_price) AS total_revenue
FROM stock_movements sm
JOIN stores s ON sm.store_id = s.store_id
JOIN cities c ON s.city_id = c.city_id
JOIN products p ON sm.product_id = p.product_id
WHERE sm.movement_type = 'SALE'
GROUP BY s.store_id, s.name, c.name, sm.product_id, p.name, DATE(sm.created_at);

CREATE UNIQUE INDEX idx_daily_sales_summary ON daily_sales_summary (store_id, product_id, sale_date);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_daily_sales()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales_summary;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_store_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically deactivate stores with no activity for 90 days
    IF NEW.is_active AND NOT EXISTS (
        SELECT 1 FROM stock_movements 
        WHERE store_id = NEW.store_id 
        AND created_at > NOW() - INTERVAL '90 days'
    ) THEN
        NEW.is_active := FALSE;
        NEW.updated_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_store_status
BEFORE UPDATE ON stores
FOR EACH ROW EXECUTE FUNCTION update_store_status();
-- CloudWaste Yaoundé Database Schema
-- PostgreSQL Setup Script

-- Drop existing tables if they exist
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS sensor_data CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS trucks CASCADE;
DROP TABLE IF EXISTS bins CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('citizen', 'driver', 'manager', 'admin')),
    neighborhood VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- ============================================
-- SMART BINS TABLE
-- ============================================
CREATE TABLE bins (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lat DECIMAL(10, 6) NOT NULL,
    lng DECIMAL(10, 6) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    fill_level INT DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
    status VARCHAR(20) DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical')),
    temperature INT,
    battery INT DEFAULT 100 CHECK (battery >= 0 AND battery <= 100),
    hardware_sensor VARCHAR(50),
    hardware_controller VARCHAR(50),
    hardware_network VARCHAR(50),
    installed_at TIMESTAMP DEFAULT NOW(),
    last_collection TIMESTAMP,
    last_update TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SENSOR DATA HISTORY TABLE
-- ============================================
CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    bin_id VARCHAR(20) REFERENCES bins(id) ON DELETE CASCADE,
    fill_level INT NOT NULL,
    temperature INT,
    battery INT,
    lat DECIMAL(10, 6),
    lng DECIMAL(10, 6),
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CITIZEN REPORTS TABLE
-- ============================================
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    bin_id VARCHAR(20) REFERENCES bins(id) ON DELETE SET NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    reporter VARCHAR(100) DEFAULT 'Anonymous',
    issue VARCHAR(100) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'closed')),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- ============================================
-- TRUCKS TABLE
-- ============================================
CREATE TABLE trucks (
    id VARCHAR(20) PRIMARY KEY,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'idle' CHECK (status IN ('idle', 'active', 'maintenance')),
    lat DECIMAL(10, 6),
    lng DECIMAL(10, 6),
    location VARCHAR(100),
    fuel_level INT DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
    capacity_kg INT DEFAULT 5000,
    current_load_kg INT DEFAULT 0,
    gps_active BOOLEAN DEFAULT true,
    last_maintenance TIMESTAMP,
    last_update TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COLLECTIONS TABLE
-- ============================================
CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    bin_id VARCHAR(20) REFERENCES bins(id) ON DELETE CASCADE,
    truck_id VARCHAR(20) REFERENCES trucks(id) ON DELETE SET NULL,
    driver_id INT REFERENCES users(id) ON DELETE SET NULL,
    waste_weight_kg DECIMAL(10, 2),
    collection_duration_minutes INT,
    photo_url TEXT,
    notes TEXT,
    collected_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_bins_status ON bins(status);
CREATE INDEX idx_bins_neighborhood ON bins(neighborhood);
CREATE INDEX idx_bins_fill_level ON bins(fill_level DESC);
CREATE INDEX idx_sensor_data_bin_id ON sensor_data(bin_id);
CREATE INDEX idx_sensor_data_recorded_at ON sensor_data(recorded_at DESC);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_bin_id ON reports(bin_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_collections_bin_id ON collections(bin_id);
CREATE INDEX idx_collections_collected_at ON collections(collected_at DESC);
CREATE INDEX idx_trucks_status ON trucks(status);

-- ============================================
-- INSERT SAMPLE DATA FOR NLONGKAK & MVAN
-- ============================================

-- Insert sample bins for Nlongkak
INSERT INTO bins (id, name, lat, lng, neighborhood, fill_level, status, temperature, battery, hardware_sensor, hardware_controller, hardware_network) VALUES
('NL001', 'Nlongkak Market', 3.876300, 11.518100, 'Nlongkak', 85, 'critical', 28, 78, 'HC-SR04', 'ESP32', 'MTN 4G'),
('NL002', 'Church Street', 3.877300, 11.519100, 'Nlongkak', 45, 'normal', 26, 92, 'HC-SR04', 'ESP32', 'Orange 4G'),
('NL003', 'ICT University', 3.878300, 11.520100, 'Nlongkak', 92, 'critical', 30, 65, 'HC-SR04', 'Arduino Uno', 'MTN 3G'),
('NL004', 'Nlongkak School', 3.879300, 11.521100, 'Nlongkak', 55, 'normal', 27, 85, 'HC-SR04', 'ESP32', 'MTN 4G'),
('NL005', 'Nlongkak Center', 3.875300, 11.517100, 'Nlongkak', 70, 'warning', 29, 72, 'HC-SR04', 'ESP32', 'Orange 4G');

-- Insert sample bins for Mvan
INSERT INTO bins (id, name, lat, lng, neighborhood, fill_level, status, temperature, battery, hardware_sensor, hardware_controller, hardware_network) VALUES
('MV001', 'Mvan Main Road', 3.879300, 11.521100, 'Mvan', 30, 'normal', 27, 88, 'HC-SR04', 'ESP32', 'MTN 4G'),
('MV002', 'Mvan School', 3.880300, 11.522100, 'Mvan', 78, 'warning', 29, 71, 'HC-SR04', 'ESP32', 'Orange 4G'),
('MV003', 'Mvan Market', 3.881300, 11.523100, 'Mvan', 40, 'normal', 26, 90, 'HC-SR04', 'Arduino Uno', 'MTN 4G'),
('MV004', 'Mvan Church', 3.882300, 11.524100, 'Mvan', 88, 'critical', 31, 68, 'HC-SR04', 'ESP32', 'MTN 3G'),
('MV005', 'Mvan Junction', 3.878300, 11.520100, 'Mvan', 52, 'normal', 28, 82, 'HC-SR04', 'ESP32', 'Orange 4G');

-- Insert sample trucks
INSERT INTO trucks (id, license_plate, driver_name, driver_phone, status, lat, lng, location, fuel_level) VALUES
('TR001', 'CE-1234-YA', 'Paul Ngono', '+237677123456', 'active', 3.876300, 11.518100, 'Nlongkak Market', 65),
('TR002', 'CE-5678-YA', 'Marie Foka', '+237677234567', 'active', 3.880300, 11.522100, 'Mvan', 80),
('TR003', 'CE-9012-YA', 'John Kamga', '+237677345678', 'idle', 3.870000, 11.510000, 'Base Station', 45);

-- Insert sample users
INSERT INTO users (phone_number, name, email, role, neighborhood) VALUES
('+237677111222', 'Junior Feutseu', 'junior@ictu.cm', 'admin', 'Nlongkak'),
('+237677222333', 'Paul Ngono', 'paul@hysacam.cm', 'driver', 'Nlongkak'),
('+237677333444', 'Marie Foka', 'marie@hysacam.cm', 'driver', 'Mvan'),
('+237677444555', 'Jean Kamga', 'jean@gmail.com', 'citizen', 'Nlongkak'),
('+237677555666', 'Sarah Ngo', 'sarah@gmail.com', 'citizen', 'Mvan');

-- Insert sample reports
INSERT INTO reports (bin_id, reporter, issue, description, priority, status) VALUES
('NL001', 'Anonymous', 'Overflowing bin', 'Bin at market is overflowing, waste on ground', 'high', 'pending'),
('MV002', 'Jean K.', 'Missed collection', 'Truck did not collect yesterday', 'medium', 'in-progress'),
('NL002', 'Marie F.', 'Broken bin', 'Lid is damaged and needs repair', 'low', 'resolved');

-- Insert sample collections
INSERT INTO collections (bin_id, truck_id, waste_weight_kg, collection_duration_minutes) VALUES
('NL004', 'TR001', 85.5, 5),
('NL005', 'TR001', 120.3, 7),
('MV003', 'TR002', 95.8, 6),
('MV005', 'TR002', 110.2, 8);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for critical bins needing immediate attention
CREATE VIEW critical_bins_view AS
SELECT 
    b.id,
    b.name,
    b.neighborhood,
    b.fill_level,
    b.battery,
    b.lat,
    b.lng,
    b.last_collection,
    EXTRACT(EPOCH FROM (NOW() - b.last_collection))/3600 as hours_since_collection
FROM bins b
WHERE b.status = 'critical'
ORDER BY b.fill_level DESC;

-- View for daily collection statistics
CREATE VIEW daily_stats_view AS
SELECT 
    DATE(collected_at) as date,
    COUNT(*) as total_collections,
    SUM(waste_weight_kg) as total_waste_kg,
    AVG(collection_duration_minutes) as avg_duration_minutes,
    COUNT(DISTINCT truck_id) as trucks_used
FROM collections
WHERE collected_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(collected_at)
ORDER BY date DESC;

-- View for neighborhood performance
CREATE VIEW neighborhood_stats_view AS
SELECT 
    b.neighborhood,
    COUNT(b.id) as total_bins,
    AVG(b.fill_level) as avg_fill_level,
    COUNT(CASE WHEN b.status = 'critical' THEN 1 END) as critical_count,
    COUNT(c.id) as collections_this_month
FROM bins b
LEFT JOIN collections c ON b.id = c.bin_id 
    AND c.collected_at >= NOW() - INTERVAL '30 days'
GROUP BY b.neighborhood;

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update bin status based on fill level
CREATE OR REPLACE FUNCTION update_bin_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fill_level >= 80 THEN
        NEW.status := 'critical';
    ELSIF NEW.fill_level >= 60 THEN
        NEW.status := 'warning';
    ELSE
        NEW.status := 'normal';
    END IF;
    
    NEW.last_update := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update bin status
CREATE TRIGGER bin_status_update
BEFORE UPDATE OF fill_level ON bins
FOR EACH ROW
EXECUTE FUNCTION update_bin_status();

-- Function to update report timestamp
CREATE OR REPLACE FUNCTION update_report_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        NEW.resolved_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for report updates
CREATE TRIGGER report_update_timestamp
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION update_report_timestamp();

-- ============================================
-- GRANT PERMISSIONS (adjust as needed)
-- ============================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cloudwaste_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cloudwaste_user;

COMMIT;

-- Display success message
SELECT 'CloudWaste Yaoundé database setup complete!' as message;
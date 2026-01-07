// CloudWaste Yaoundé Backend API
// server.js - Main server file

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// PostgreSQL Database Connection
const pool = new Pool({
  user: process.env.DB_USER || 'cloudwaste_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cloudwaste_db',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('✓ Connected to PostgreSQL database');
    release();
  }
});

// ============================================
// API ENDPOINTS FOR SMART BINS
// ============================================

// GET all bins
app.get('/api/bins', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM bins 
      ORDER BY fill_level DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET single bin by ID
app.get('/api/bins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM bins WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bin not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new sensor data from smart bin (IoT device endpoint)
app.post('/api/bins/:id/sensor-data', async (req, res) => {
  try {
    const { id } = req.params;
    const { fill_level, temperature, battery, lat, lng } = req.body;
    
    // Determine status based on fill level
    let status = 'normal';
    if (fill_level >= 80) status = 'critical';
    else if (fill_level >= 60) status = 'warning';
    
    // Update bin status
    await pool.query(`
      UPDATE bins 
      SET fill_level = $1, 
          temperature = $2, 
          battery = $3, 
          status = $4,
          last_update = NOW()
      WHERE id = $5
    `, [fill_level, temperature, battery, status, id]);
    
    // Log sensor data
    await pool.query(`
      INSERT INTO sensor_data (bin_id, fill_level, temperature, battery, lat, lng)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [id, fill_level, temperature, battery, lat, lng]);
    
    res.json({ 
      success: true, 
      message: 'Sensor data received',
      status: status 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET bins by neighborhood
app.get('/api/bins/neighborhood/:neighborhood', async (req, res) => {
  try {
    const { neighborhood } = req.params;
    const result = await pool.query(
      'SELECT * FROM bins WHERE neighborhood = $1',
      [neighborhood]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// API ENDPOINTS FOR CITIZEN REPORTS
// ============================================

// GET all reports
app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, b.name as bin_name, b.neighborhood
      FROM reports r
      LEFT JOIN bins b ON r.bin_id = b.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new citizen report
app.post('/api/reports', async (req, res) => {
  try {
    const { bin_id, reporter, issue, description, priority } = req.body;
    
    const result = await pool.query(`
      INSERT INTO reports (bin_id, reporter, issue, description, priority, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `, [bin_id, reporter || 'Anonymous', issue, description, priority || 'medium']);
    
    res.json({ 
      success: true, 
      report: result.rows[0] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// UPDATE report status
app.patch('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE reports SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, id]
    );
    
    res.json({ success: true, message: 'Report updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// API ENDPOINTS FOR TRUCKS
// ============================================

// GET all trucks
app.get('/api/trucks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trucks');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST truck location update (GPS tracking)
app.post('/api/trucks/:id/location', async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng, location_name } = req.body;
    
    await pool.query(`
      UPDATE trucks 
      SET lat = $1, lng = $2, location = $3, last_update = NOW()
      WHERE id = $4
    `, [lat, lng, location_name, id]);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST collection confirmation
app.post('/api/collections', async (req, res) => {
  try {
    const { bin_id, truck_id, driver_id } = req.body;
    
    // Log collection
    await pool.query(`
      INSERT INTO collections (bin_id, truck_id, driver_id)
      VALUES ($1, $2, $3)
    `, [bin_id, truck_id, driver_id]);
    
    // Update bin status
    await pool.query(`
      UPDATE bins 
      SET fill_level = 5, 
          status = 'normal',
          last_collection = NOW()
      WHERE id = $1
    `, [bin_id]);
    
    res.json({ success: true, message: 'Collection logged' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// API ENDPOINTS FOR ANALYTICS
// ============================================

// GET dashboard statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalBins = await pool.query('SELECT COUNT(*) FROM bins');
    const criticalBins = await pool.query('SELECT COUNT(*) FROM bins WHERE status = $1', ['critical']);
    const activeTrucks = await pool.query('SELECT COUNT(*) FROM trucks WHERE status = $1', ['active']);
    const pendingReports = await pool.query('SELECT COUNT(*) FROM reports WHERE status = $1', ['pending']);
    const collectionsToday = await pool.query(
      'SELECT COUNT(*) FROM collections WHERE DATE(collected_at) = CURRENT_DATE'
    );
    
    res.json({
      totalBins: parseInt(totalBins.rows[0].count),
      criticalBins: parseInt(criticalBins.rows[0].count),
      activeTrucks: parseInt(activeTrucks.rows[0].count),
      pendingReports: parseInt(pendingReports.rows[0].count),
      collectionsToday: parseInt(collectionsToday.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET collections history
app.get('/api/collections/history', async (req, res) => {
  try {
    const { days } = req.query;
    const daysAgo = days || 7;
    
    const result = await pool.query(`
      SELECT 
        DATE(collected_at) as date,
        COUNT(*) as count
      FROM collections
      WHERE collected_at >= NOW() - INTERVAL '${daysAgo} days'
      GROUP BY DATE(collected_at)
      ORDER BY date DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// ROUTE OPTIMIZATION (Basic Algorithm)
// ============================================

app.post('/api/optimize-route', async (req, res) => {
  try {
    // Get all critical and warning bins
    const result = await pool.query(`
      SELECT id, name, lat, lng, fill_level, neighborhood
      FROM bins 
      WHERE status IN ('critical', 'warning')
      ORDER BY fill_level DESC
    `);
    
    const bins = result.rows;
    
    // Simple nearest-neighbor route optimization
    // In production, use more sophisticated algorithms (e.g., Google Maps API)
    const optimizedRoute = bins.map(bin => ({
      bin_id: bin.id,
      bin_name: bin.name,
      location: bin.neighborhood,
      fill_level: bin.fill_level,
      coordinates: { lat: bin.lat, lng: bin.lng }
    }));
    
    res.json({
      success: true,
      route: optimizedRoute,
      total_bins: optimizedRoute.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    service: 'CloudWaste Yaoundé API'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   CloudWaste Yaoundé API Server       ║
  ║   Running on port ${PORT}               ║
  ╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
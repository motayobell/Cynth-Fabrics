import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import Database from 'better-sqlite3';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure persistent storage paths
// On Hostinger, you can set DATA_DIR to a folder outside your git repo (e.g., /home/u12345/cynth_data)
// This ensures your uploads and database are NOT deleted when you push new updates.
let DATA_DIR = process.env.DATA_DIR;
if (!DATA_DIR) {
  try {
    const home = os.homedir();
    // Hostinger and typical cPanel servers use paths like /home/username, /home1/username, /home2/username, etc.
    // If we're on a real server environment with a valid user home dir (not local root or system directories) we put our database there.
    if (home && home !== '/' && home !== '/root' && (home.includes('/home') || home.includes('/Users/')) && fs.existsSync(home)) {
      DATA_DIR = path.join(home, 'cynth_data');
    } else {
      DATA_DIR = __dirname;
    }
  } catch (err) {
    DATA_DIR = __dirname;
  }
}

const uploadsDir = path.join(DATA_DIR, 'uploads');
const publicDir = path.join(DATA_DIR, 'public');
const dbPath = path.join(DATA_DIR, 'database.sqlite');

// Ensure directories exist
try {
  [uploadsDir, publicDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('Using directory at:', dir);
    }
  });
} catch (err) {
  console.error('Could not create storage directories:', err);
}

// Initialize SQLite Database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    category TEXT,
    stock INTEGER,
    status TEXT,
    image TEXT,
    description TEXT,
    images TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    data TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerName TEXT,
    customerEmail TEXT,
    customerPhone TEXT,
    totalAmount REAL,
    status TEXT,
    items TEXT,
    shippingAddress TEXT,
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT,
    avatar TEXT,
    status TEXT,
    lastLogin TEXT,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    data TEXT
  );
`);

// Seed initial site content dynamically from initialPages.json if empty or default
try {
  let initialPagesData = '{"pages":[]}';
  const initialPagesPath = path.join(__dirname, 'initialPages.json');
  if (fs.existsSync(initialPagesPath)) {
    const rawData = fs.readFileSync(initialPagesPath, 'utf8');
    // Validate we can parse it
    const parsedData = JSON.parse(rawData);
    initialPagesData = JSON.stringify({ pages: parsedData });
    console.log('Loaded default siteContent seed from initialPages.json');
  }

  // Insert default row if not exists
  const insertStmt = db.prepare('INSERT OR IGNORE INTO content (id, data) VALUES (?, ?)');
  insertStmt.run('siteContent', initialPagesData);

  // If already exists but has empty/minimal pages array (e.g. '{"pages":[]}'), migrate it to the rich initial pages layout
  const currentContent = db.prepare('SELECT * FROM content WHERE id = ?').get('siteContent');
  if (currentContent) {
    try {
      const parsedCurrent = JSON.parse(currentContent.data);
      if (!parsedCurrent || !parsedCurrent.pages || parsedCurrent.pages.length === 0) {
        const updateStmt = db.prepare('UPDATE content SET data = ? WHERE id = ?');
        updateStmt.run(initialPagesData, 'siteContent');
        console.log('Successfully seeded/migrated empty siteContent row on Hostinger to use preloaded initialPages!');
      }
    } catch (parseErr) {
      // Repair if corrupted JSON
      const updateStmt = db.prepare('UPDATE content SET data = ? WHERE id = ?');
      updateStmt.run(initialPagesData, 'siteContent');
      console.log('Repaired invalid siteContent database row with initialPages.json');
    }
  }
} catch (seedErr) {
  console.error('Error during site content database seeding/migration:', seedErr);
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '500mb' }));
  app.use(express.urlencoded({ limit: '500mb', extended: true }));

  // Disable caching for all API routes - Very aggressive to bypass Hostinger/LiteSpeed caches
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    res.set('Vary', '*');
    next();
  });

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // --- API Routes ---

  // Products API
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]')
    })));
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (product) {
      res.json({
        ...product,
        images: JSON.parse(product.images || '[]')
      });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.post('/api/products', (req, res) => {
    const product = req.body;
    const stmt = db.prepare(`
      INSERT INTO products (id, name, price, category, stock, status, image, description, images, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      product.id,
      product.name,
      product.price,
      product.category,
      product.stock,
      product.status,
      product.image,
      product.description,
      JSON.stringify(product.images || []),
      new Date().toISOString(),
      new Date().toISOString()
    );
    res.json({ success: true });
  });

  app.put('/api/products/:id', (req, res) => {
    const product = req.body;
    const stmt = db.prepare(`
      UPDATE products SET 
        name = ?, price = ?, category = ?, stock = ?, status = ?, image = ?, description = ?, images = ?, updatedAt = ?
      WHERE id = ?
    `);
    stmt.run(
      product.name,
      product.price,
      product.category,
      product.stock,
      product.status,
      product.image,
      product.description,
      JSON.stringify(product.images || []),
      new Date().toISOString(),
      req.params.id
    );
    res.json({ success: true });
  });

  app.delete('/api/products/:id', (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Content API
  app.get('/api/content/:id', (req, res) => {
    const content = db.prepare('SELECT * FROM content WHERE id = ?').get(req.params.id);
    if (content) {
      res.json(JSON.parse(content.data));
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  });

  app.post('/api/content/:id', (req, res) => {
    const stmt = db.prepare('INSERT OR REPLACE INTO content (id, data) VALUES (?, ?)');
    stmt.run(req.params.id, JSON.stringify(req.body));
    res.json({ success: true });
  });

  // Orders API
  app.get('/api/orders', (req, res) => {
    const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    res.json(orders.map(o => ({
      ...o,
      items: JSON.parse(o.items || '[]'),
      shippingAddress: JSON.parse(o.shippingAddress || '{}')
    })));
  });

  app.post('/api/orders', (req, res) => {
    const order = req.body;
    const stmt = db.prepare(`
      INSERT INTO orders (id, customerName, customerEmail, customerPhone, totalAmount, status, items, shippingAddress, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      order.id,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.totalAmount,
      order.status,
      JSON.stringify(order.items),
      JSON.stringify(order.shippingAddress),
      new Date().toISOString()
    );
    res.json({ success: true });
  });

  app.put('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Users API
  app.get('/api/users', (req, res) => {
    const users = db.prepare('SELECT id, name, email, role, avatar, status, lastLogin, password FROM users').all();
    res.json(users);
  });

  app.post('/api/users', (req, res) => {
    const user = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO users (id, name, email, role, avatar, status, lastLogin, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      user.id,
      user.name,
      user.email,
      user.role,
      user.avatar,
      user.status || 'Active',
      user.lastLogin || new Date().toISOString(),
      user.password || null
    );
    res.json({ success: true });
  });

  app.put('/api/users/:id', (req, res) => {
    const user = req.body;
    const stmt = db.prepare(`
      UPDATE users SET 
        name = ?, email = ?, role = ?, avatar = ?, status = ?, lastLogin = ?
      WHERE id = ?
    `);
    stmt.run(
      user.name,
      user.email,
      user.role,
      user.avatar,
      user.status,
      user.lastLogin,
      req.params.id
    );
    res.json({ success: true });
  });

  // Settings API
  app.get('/api/settings/:id', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings WHERE id = ?').get(req.params.id);
    if (settings) {
      res.json(JSON.parse(settings.data));
    } else {
      res.status(404).json({ error: 'Settings not found' });
    }
  });

  app.post('/api/settings/:id', (req, res) => {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (id, data) VALUES (?, ?)');
    stmt.run(req.params.id, JSON.stringify(req.body));
    res.json({ success: true });
  });

  // Upload endpoint
  app.post('/api/upload', (req, res) => {
    upload.single('media')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      res.json({ url: `/uploads/${req.file.filename}` });
    });
  });

  app.post('/api/upload-logo', (req, res) => {
    upload.single('logo')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      
      const oldPath = req.file.path;
      const newPath = path.join(publicDir, 'logo.png');
      
      try {
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
        fs.renameSync(oldPath, newPath);
        res.json({ success: true, url: '/logo.png' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to save logo' });
      }
    });
  });

  app.post('/api/invoice/send', (req, res) => {
    console.log(`[Mock Email Service] Sending invoice for order ${req.body.orderId}`);
    setTimeout(() => res.json({ success: true }), 1000);
  });

  // Serve uploads ALWAYS (both dev and prod environments)
  app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
  }));

  // Vite/Static serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use(express.static(publicDir));
    app.get('*', (req, res) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads and public directories exist with safety
const uploadsDir = path.join(__dirname, 'uploads');
const publicDir = path.join(__dirname, 'public');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at:', uploadsDir);
  }
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Created public directory at:', publicDir);
  }
} catch (err) {
  console.error('Could not create directories:', err);
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Double check directory exists before each upload
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

  // CRITICAL: Health check for Hostinger/Cloud deployment
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // API Routes Placeholder
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // Upload endpoint with better error handling
  app.post('/api/upload', (req, res) => {
    upload.single('media')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        console.error('Unknown upload error:', err);
        return res.status(500).json({ error: `Server error: ${err.message}` });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Return the public URL path
      res.json({ url: `/uploads/${req.file.filename}` });
    });
  });

  // Specific logo upload endpoint
  app.post('/api/upload-logo', (req, res) => {
    upload.single('logo')(req, res, (err) => {
      if (err) {
        console.error('Logo upload error:', err);
        return res.status(500).json({ error: `Upload error: ${err.message}` });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const oldPath = req.file.path;
      const newPath = path.join(__dirname, 'public', 'logo.png');
      
      try {
        if (fs.existsSync(newPath)) {
          fs.unlinkSync(newPath);
        }
        fs.renameSync(oldPath, newPath);
        res.json({ success: true, url: '/logo.png' });
      } catch (err) {
        console.error('Error moving logo:', err);
        res.status(500).json({ error: 'Failed to save logo' });
      }
    });
  });

  app.post('/api/invoice/send', (req, res) => {
    const { orderId, customerEmail, storeEmail, messageTemplate, totalAmount, shippingFee, paymentDetails } = req.body;
    
    // In a real application, this would use a service like SendGrid, AWS SES, or Nodemailer
    // to generate a PDF and send an email to the customer.
    console.log(`[Mock Email Service] Sending invoice for order ${orderId} to ${customerEmail}`);
    console.log(`[Mock Email Service] From: ${storeEmail}`);
    console.log(`[Mock Email Service] Message Template: ${messageTemplate}`);
    console.log(`[Mock Email Service] Total Amount: ${totalAmount}, Shipping Fee: ${shippingFee}`);
    console.log(`[Mock Email Service] Payment Details: ${paymentDetails}`);
    
    // Simulate network delay
    setTimeout(() => {
      res.json({ success: true, message: 'Invoice generated and sent to customer successfully.' });
    }, 1500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (err) => {
    console.error('Server failed to start:', err);
  });
}

startServer().catch(err => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});

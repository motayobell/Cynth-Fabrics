import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes Placeholder
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // Upload endpoint
  app.post('/api/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the public URL path
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  app.post('/api/invoice/send', (req, res) => {
    const { orderId, customerEmail, totalAmount, shippingFee, paymentDetails } = req.body;
    
    // In a real application, this would use a service like SendGrid, AWS SES, or Nodemailer
    // to generate a PDF and send an email to the customer.
    console.log(`[Mock Email Service] Sending invoice for order ${orderId} to ${customerEmail}`);
    console.log(`[Mock Email Service] Total Amount: ${totalAmount}, Shipping Fee: ${shippingFee}`);
    console.log(`[Mock Email Service] Payment Details: ${paymentDetails}`);
    
    // Simulate network delay
    setTimeout(() => {
      res.json({ success: true, message: 'Invoice generated and sent to customer successfully.' });
    }, 1500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (placeholder for build)
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes Placeholder
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
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

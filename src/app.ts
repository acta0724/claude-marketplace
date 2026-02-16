import express, { Application } from 'express';
import { authRouter } from './authRoutes';

export function createApp(): Application {
  const app = express();
  
  app.use(express.json());
  
  // Routes
  app.use('/api/auth', authRouter);
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  
  return app;
}

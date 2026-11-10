import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeDatabase, seedDemoData } from './database/db';
import hazardsRouter from './routes/hazards';
import incidentsRouter from './routes/incidents';
import journeysRouter from './routes/journeys';
import toolsRouter from './routes/tools';
import authRouter from './routes/auth';
import { errorHandler, notFound } from './middleware/validation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize SQLite database
initializeDatabase();
if (process.env.SEED_DEMO_DATA !== 'false') {
  seedDemoData();
}

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow local dev & tile loading
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health and readiness endpoints
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development',
  });
});

app.get('/ready', (_req, res) => {
  res.json({ ready: true, database: 'connected' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/hazards', hazardsRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/journeys', journeysRouter);
app.use('/api', toolsRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🛡️  ShieldSafe backend running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

export default app;

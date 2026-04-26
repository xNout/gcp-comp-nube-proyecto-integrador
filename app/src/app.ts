import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import expressLayouts from 'express-ejs-layouts';
import { APP_CONFIG } from './config/app.config';
import { MESSAGES } from './config/messages.config';
import { THEME } from './config/theme.config';
import pageRoutes from './routes/page.routes';
import evidenceRoutes from './routes/evidence.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { formatFileSize, formatDate } from './utils/format.util';

const app: Application = express();

// Security headers
app.use(helmet(APP_CONFIG.helmetOptions));

// Logging
app.use(morgan(APP_CONFIG.morganFormat));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.resolve(APP_CONFIG.staticPath)));

// View engine
app.set('view engine', APP_CONFIG.viewEngine);
app.set('views', path.resolve(APP_CONFIG.viewsPath));
app.use(expressLayouts);
app.set('layout', 'layout');

// Inject config and helpers into all views
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.CONFIG = APP_CONFIG;
  res.locals.MESSAGES = MESSAGES;
  res.locals.THEME = THEME;
  res.locals.formatFileSize = formatFileSize;
  res.locals.formatDate = formatDate;
  next();
});

// Routes
app.use(pageRoutes);
app.use(evidenceRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;

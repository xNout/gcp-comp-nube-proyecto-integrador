import app from './app';
import { APP_CONFIG } from './config/app.config';

const PORT = APP_CONFIG.port;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[${APP_CONFIG.serviceName}] Server running on port ${PORT} in ${APP_CONFIG.nodeEnv} mode`);
});

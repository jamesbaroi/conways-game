import express from 'express';
import morgan from 'morgan';
import hbs from 'express-handlebars';
import { host, port, nodenv } from './config/env.config.js';
import { routerMain } from './routes/main.routes.js';

// Create express app
const app = express();

// Log in dev
if (nodenv === 'development') { app.use(morgan('dev')); }

// Parse utf-8 / json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set template engine
app.engine('.hbs', hbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './src/views'); // use full path in production

// Add static files
app.use(express.static('src/public')); // use full path in production

// Add routes
app.use('/', routerMain);

// Serve app
app.listen(port || 8082, () => {
  console.log(`Server running in ${nodenv} at http://${host}:${port}`);
});
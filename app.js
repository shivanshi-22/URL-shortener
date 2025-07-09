import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import shortenerRoutes from './routes/shortener.js';

const app = express();
const PORT = 3000;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', shortenerRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const express = require('express');
const path = require('path');
const shortenerRoutes = require('./routes/shortener');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', shortenerRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

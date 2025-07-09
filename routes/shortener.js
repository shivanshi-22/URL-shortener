const express = require('express');
const { nanoid } = require('nanoid');
const { isValidUrl } = require('../utils/helpers');
const store = require('../data/store');

const router = express.Router();

router.post('/shorten', (req, res) => {
  const { longUrl, customCode } = req.body;
  if (!isValidUrl(longUrl)) return res.status(400).send('Invalid URL');

  const code = customCode || nanoid(6);
  if (store.urls[code]) return res.status(409).send('Short code already exists');

  store.urls[code] = {
    longUrl,
    createdAt: new Date(),
    visits: [],
  };

  res.json({ shortUrl: `http://localhost:3000/${code}` });
});

router.get('/:code', (req, res) => {
  const { code } = req.params;
  const entry = store.urls[code];
  if (!entry) return res.status(404).send('URL not found');

  entry.visits.push(new Date());
  res.redirect(entry.longUrl);
});

router.get('/stats/:code', (req, res) => {
  const entry = store.urls[req.params.code];
  if (!entry) return res.status(404).send('Not found');
  res.json(entry);
});

module.exports = router;

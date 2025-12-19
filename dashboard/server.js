import dotenv from 'dotenv';
import path from 'path'; // Added this
import { fileURLToPath } from 'url'; // Added this
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000; // Better for "Going Live"

app.use(cors()); 
app.use(express.json()); 

const FINNHUB_KEY = process.env.FINNHUB_KEY;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function protectRoute(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'No token provided. You must be logged in.' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  req.user = data.user;
  next();
}

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim().length < 2) {
    return res.json({ result: [] });
  }
  const finnhubUrl = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${FINNHUB_KEY}`;
  res.set('Cache-Control', 'no-store');
  console.log(`--- RECEIVED /api/search REQUEST ---`);
  console.log(`Query: "${query}"`);
  console.log(`Fetching Finnhub URL: ${finnhubUrl}`);
  try {
    const resp = await fetch(finnhubUrl);
    const data = await resp.json();
    console.log(`Finnhub Response Status: ${resp.status}`);
    console.log(`Finnhub Response Data Count: ${data.result ? data.result.length : 0}`);
    res.json({ result: data.result || [] });
  } catch (err) {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ result: [], error: 'Server error', details: err.message });
  } finally {
    console.log('--- FINISHED /api/search REQUEST ---');
  }
});

app.get('/api/profile', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });
  try {
    const resp = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/quote', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });
  try {
    const resp = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  } 
});

app.get('/api/candles', async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });

  try {
    const resp = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=6mo`);
    const data = await resp.json();

    if (!data.chart.result) return res.status(404).json({ error: 'No candle data' });

    const result = data.chart.result[0];
    const t = result.timestamp;
    const o = result.indicators.quote[0].open;
    const h = result.indicators.quote[0].high;
    const l = result.indicators.quote[0].low;
    const c = result.indicators.quote[0].close;
    const v = result.indicators.quote[0].volume;

    const candles = t.map((ts, i) => ({
      t: ts,
      o: o[i],
      h: h[i],
      l: l[i],
      c: c[i],
      v: v[i] 
    }));

    res.json(candles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/logo', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL parameter is required.');
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        res.setHeader('Content-Type', response.headers.get('content-type'));
        response.body.pipe(res); 
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).send('Error fetching image.');
    }
});

app.get('/api/wishlist', protectRoute, async (req, res) => {

  const userId = req.user.id; 

  const { data, error } = await supabase
    .from('wishlist')
    .select('id, ticker_symbol, created_at') 
    .eq('user_id', userId); 

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/api/wishlist', protectRoute, async (req, res) => {
  const userId = req.user.id;
  const { ticker } = req.body; 

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker symbol is required.' });
  }

  const { data, error } = await supabase
    .from('wishlist')
    .insert([
      { user_id: userId, ticker_symbol: ticker }
    ])
    .select();
  
  if (error) {
    if (error.code === '23505') { 
      return res.status(409).json({ error: 'Ticker already in wishlist.' });
    }
    return res.status(500).json({ error: error.message });
  }
  
  res.status(201).json({ message: 'Ticker added to wishlist!', data: data[0] });
});

app.delete('/api/wishlist', protectRoute, async (req, res) => {
  const userId = req.user.id;
  const { ticker } = req.body; 

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker symbol is required.' }); 
  }

  const { data, error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('ticker_symbol', ticker); 

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Ticker removed from wishlist.' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
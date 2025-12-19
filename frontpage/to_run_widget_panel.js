import express from 'express';
import cors from 'cors';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname)));

const endpoints = {
  nasdaq: 'https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC', 
  sp500: 'https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC', 
  dowjones: 'https://query1.finance.yahoo.com/v8/finance/chart/%5EDJI' 
};


async function getData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.chart || !data.chart.result) throw new Error("Invalid data");

    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const previous = meta.previousClose;
    const change = (price - previous).toFixed(2);
    const percent = ((change / previous) * 100).toFixed(2);

    return { price, change, percent };
  } catch (err) {
    console.error("Error fetching data from", url, err);
    return null;
  }
}

app.get('/api/market', async (req, res) => {
  const nasdaq = await getData(endpoints.nasdaq);
  const sp500 = await getData(endpoints.sp500);
  const dowjones = await getData(endpoints.dowjones);
  res.json({ nasdaq, sp500, dowjones });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on port', PORT));

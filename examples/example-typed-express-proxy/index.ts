import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Для поддержки JSON в POST
app.use(express.json());

// Прокси endpoint: GET /api/users -> https://jsonplaceholder.typicode.com/users
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при проксировании запроса' });
  }
});

// Прокси endpoint: POST /api/posts -> https://jsonplaceholder.typicode.com/posts
app.post('/api/posts', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при проксировании запроса' });
  }
});

app.listen(PORT, () => {
  console.log(`Express-прокси сервер запущен на http://localhost:${PORT}`);
});

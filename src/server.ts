import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World!',
    name: 'Rafael',
  });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
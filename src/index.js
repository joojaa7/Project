import app from './app.js';

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, '10.120.32.51', () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

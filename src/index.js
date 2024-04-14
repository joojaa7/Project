import app from './app.js';

const hostname = '127.0.0.1';
const port = 5500;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

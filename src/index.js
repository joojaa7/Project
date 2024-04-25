import app from './app.js';

const hostname = 'https://10.120.32.51';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

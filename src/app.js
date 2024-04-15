import express from 'express';
import api from './api/index.js';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static('Code'));
app.use('/', express.static('uploads'));

app.use('/', api);

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

export default app;

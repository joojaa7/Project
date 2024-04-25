import express from 'express';
import api from './api/index.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended: true}));

app.use('/restaurant/', express.static('Code'));
app.use('/restaurant/', express.static('uploads'));

app.use('/restaurant/', api);
app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
  console.log('Welcome to my REST API!')
});

export default app;

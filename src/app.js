import express from 'express';
import api from './api/index.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/restaurant/', express.static('uploads'));

app.use('/restaurant/', api);

export default app;

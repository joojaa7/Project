import express from 'express';
import api from './api/index.js';
import path from 'path';
import {fileURLToPath} from 'url';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/restaurant/', express.static('Code'));
app.use('/restaurant/', express.static('uploads'));

app.use('/restaurant/', api);


export default app;

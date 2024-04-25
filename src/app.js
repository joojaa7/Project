import express from 'express';
import api from './api/index.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/restaurant/', express.static('Code'));
app.use('/restaurant/', express.static('uploads'));

app.use((function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin (you can restrict this to specific origins)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
  next();
}), '/restaurant/', api);
app.get('/restaurant/get', (req, res) => {
  res.send('Welcome to my REST API!');
});


export default app;

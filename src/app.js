import express from 'express';
import api from './api/index.js';
import cors from 'cors';

const app = express();
const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/restaurant/', express.static('Code'));
app.use('/restaurant/', express.static('uploads'));

app.use('/restaurant/', api);
app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

export default app;

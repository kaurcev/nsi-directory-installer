require('dotenv').config({ path: '/home/kaurcev/Рабочий стол/nsi-directory-installer/backend/.env' });
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const app = express();
const PORT = process.env.PORT;
const NSI_KEY = process.env.NSI_KEY;

if (!NSI_KEY) {
  return res.status(500).json({
    status: false,
    message: 'У вас неверно настроены переменные окружения!',
    data: null
  });
}

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logsDir,
  maxFiles: 7,
  compress: 'gzip',
  size: '10M',
});

app.use(morgan('combined', {
  stream: accessLogStream,
  skip: (req) => req.originalUrl === '/healthcheck'
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const nsiRouter = require('./routers/nsi');
app.use('/nsi', nsiRouter);


app.get('/healthcheck', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Логи с ротацией хранятся в ${logsDir}`);
});
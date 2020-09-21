const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routers = require('../routes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ limit: '150mb', extended: true, parameterLimit: 150000 }));
app.use(cookieParser());

app.use('/', routers.main);

app.listen(8000, (port) => {
    console.log('Example app listening on port 3000!', port);
  });

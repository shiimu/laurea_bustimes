const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const bustimeRoute = require('./routes/bustimes');
app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.set('view engine', 'ejs');

app.use('/', bustimeRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server starting at port ${PORT}`));

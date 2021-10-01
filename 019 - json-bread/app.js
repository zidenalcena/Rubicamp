const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');
const app = express();

const port = 3000;

const readJson = fs.readFileSync('./database/data.json');
let data = JSON.parse(readJson);

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
  let newData = [];
  
  let newDate;
  for (let i = 0; i < data.length; i++) {
    if (data[i].Date !== 'kosong') {
      const splittedDate = data[i].Date.split('-');
      const month = formatDate(splittedDate[1]);
      newDate = `${splittedDate[2]} ${month} ${splittedDate[0]}`;
      data[i].displayedDate = newDate;
    }
    newData.push(data[i]);
  }

  res.render('index', { newData });
});

app.get('/add', (req, res) => res.render('add'));

app.get('/edit/:id', (req, res) => {
  let dataId;
  for (let i = 0; i < data.length; i++) {
    if (Number(req.params.id) === data[i].ID) {
      dataId = i;
    }
  }

  res.render('edit', { data: data[dataId] });
});

app.post('/add', (req, res) => {
  const id = data.length + 1;
  const str = req.body.String || 'kosong';
  const itg = parseInt(req.body.Integer) || 'kosong';
  const flt = parseFloat(req.body.Float) || 'kosong';
  const date = req.body.Date || 'kosong';
  const bln = req.body.Boolean ? true : false;

  const newData = {
    ID: id,
    String: str,
    Integer: itg,
    Float: flt,
    Date: date,
    Boolean: bln
  };

  data.push(newData);

  fs.writeFileSync('./database/data.json', JSON.stringify(data));
  res.redirect('/');
});

app.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const str = req.body.String || 'kosong';
  const itg = parseInt(req.body.Integer) || 'kosong';
  const flt = parseFloat(req.body.Float) || 'kosong';
  const date = req.body.Date || 'kosong';
  const bln = req.body.Boolean ? true : false;

  let index;
  for (let i = 0; i < data.length; i++) {
    if (data[i].ID === Number(id)) index = i;
  }

  data[index].String = str;
  data[index].Integer = itg;
  data[index].Float = flt;
  data[index].Date = date;
  data[index].Boolean = bln;

  fs.writeFileSync('./database/data.json', JSON.stringify(data));
  res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    if (Number(req.params.id) !== data[i].ID) {
      newData.push(data[i]);
    }
  }

  data = newData;
  fs.writeFileSync('./database/data.json', JSON.stringify(data));
  res.redirect('/');
});

const formatDate = month => {
  switch (month) {
    case '01':
      month = 'January';
      break;
    case '02':
      month = 'February';
      break;
    case '03':
      month = 'Maret';
      break;
    case '04':
      month = 'April';
      break;
    case '05':
      month = 'May';
      break;
    case '06':
      month = 'June';
      break;
    case '07':
      month = 'July';
      break;
    case '08':
      month = 'August';
      break;
    case '09':
      month = 'September';
      break;
    case '10':
      month = 'October';
      break;
    case '11':
      month = 'November';
      break;
    case '12':
      month = 'Desember';
      break;
    default:
      break;
  }
  return month;
};

app.listen(port, () => console.log(`json-bread listening on port ${port}!`));

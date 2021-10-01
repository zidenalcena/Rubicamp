const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const port = 3000;

const indexRoutes = require('./routes/index');
const addRoutes = require('./routes/add');
const editRoutes = require('./routes/edit');
const deleteRoutes = require('./routes/delete');
const errorRoutes = require('./routes/404');


app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

app.use('/', indexRoutes);
app.use('/add', addRoutes);
app.use('/edit', editRoutes);
app.use('/delete', deleteRoutes);
app.use('*', errorRoutes);

app.listen(port, () => console.log(`sqlite3-bread listening on port ${port}!`));

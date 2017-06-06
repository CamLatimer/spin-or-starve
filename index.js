require('dotenv-safe').load();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8081;
const exphbs = require('express-handlebars');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.render('main-layout')
});
app.get('*', function(req, res){
  res.render('main-layout')
})


app.listen(port, function () {
  console.log('App listening on port ' + port);
});

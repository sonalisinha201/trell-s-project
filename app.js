const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const { monitorEventLoopDelay } = require('perf_hooks');
const app = express();

mongoose
  .connect('mongodb://localhost:27017/trelll', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongo connected!');
  })
  .catch((e) => {
    console.log(e.message);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const querySchema = new mongoose.Schema({
  keywords: String,
});

const Query = mongoose.model('Query', querySchema);

app.get('/', async (req, res) => {
  const querys = await Query.find({});
  if (!querys) {
    querys.insertMany([
      { keywords: 'test search' },
      { keywords: 'first search' },
    ]);
  }

  res.render('index.ejs', { querys });
});

app.post('/', async (req, res) => {
  req.body.keywords = req.body.query;
  const newQuery = new Query(req.body);
  await newQuery.save();
  res.redirect('/');
});

app.listen(8080, () => {
  console.log('Running!');
});

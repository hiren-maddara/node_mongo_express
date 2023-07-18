const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

app.use((rq, rs, n) => {
  rq.requestTime = new Date().toISOString(); //add a time property on the req object
  n();
});

app.get('/api/v1/tours', (req, res) => {
  console.log(req.requestTime);
  res.status(202).json({ null: [] });
});

// start the server
app.listen(3000, '127.0.0.1', () => {
  console.log('server started at http://127.0.0.1:3000');
}); //port, host, callback

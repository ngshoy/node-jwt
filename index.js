const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8888;
const users = [{
    id: 1,
    username: 'admin',
    password: 'admin'
  },
  {
    id: 2,
    username: 'guest',
    password: 'guest'
  },
]

app.use(bodyParser.json());
app.use(cors());

app.get('/health', (req, res) => {
  const localTime = (new Date()).toLocaleTimeString();
  res
    .status(200)
    .send(`Server time is ${localTime}`);
});

app.get('/secret', (req, res) => {

})

app.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400);
    res.send('You need a username and password');
    return;
  }

  const user = users.find(u => {
    return u.username === req.body.username && u.password === req.body.password;
  });

  if (!user) {
    res.status(401);
    res.send('User not found');
    return;
  }

  const token = jwt.sign({
    sub: user.id,
    username: user.username
  }, 'mysupersecretekey', {
    expiresIn: '3 hours'
  });
  res
    .status(200)
    .send({
      access_token: token
    });
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
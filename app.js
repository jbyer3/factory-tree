const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')

const factoryRoutes = require("./routes/factories");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('whatup from express')
})

app.use('/api/factories/', factoryRoutes)

app.listen(port, () => console.log('listening on', port))


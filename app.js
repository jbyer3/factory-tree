const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')

const factoryRoutes = require("./routes/factories");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log(`msg from socket is`, msg)
    io.emit('chat message', msg);
  });
  socket.on('deletron', function(data){
    console.log(data)
    io.emit('deletron', data)
  })
});

app.use('/api/factories/', factoryRoutes)

server.listen(port, () => console.log('listening on', port))
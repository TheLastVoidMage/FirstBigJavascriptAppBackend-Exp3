const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/eventhandlers.js', (req, res) => {
  res.sendFile(__dirname + '/eventhandlers.js');
});

io.on('connection', (socket) => {
  console.log('a user connected with socket id ' + socket.id);
  //console.log(socket.id);
  //console.log(socket.client.conn.server);
  io.emit('connect-count', socket.client.conn.server.clientsCount);
  io.emit('connect-user', {"socketId": socket.id});

  // Chat Message Listener
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });

  // User Update Listener
  socket.on('user-update', (jsonData) => {
    io.emit('user-update', jsonData);
  });

  // User Typing Listener
  socket.on('user-typing', (jsonData) => {
    io.emit('user-typing', jsonData);
  });

  // Disconnect Event Listener 
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('connect-count', socket.client.conn.server.clientsCount);
    io.emit('disconnect-user', {"socketId": socket.id});
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path')


const app = express(); //just an express server

const server = http.createServer(app);
const io = socket(server); //socketio need an hhtp server to serve the functionality

const chess = new Chess();
let players = {};
let currentPlayer = 'w';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res) => {
  res.render('index',{title : 'CHESS-Online'})
});

io.on('connection', function(UniqueSocket){
    console.log('connected')

    if(!players.white){
      players.white = UniqueSocket.id;
      UniqueSocket.emit('PlayerRole','w');

    }
    else if(!players.black){
      players.black = UniqueSocket.id;
      UniqueSocket.emit('PlayerRole', 'b');
    } else {
      UniqueSocket.emit('SpectatorRole')
    }
    UniqueSocket.on('disconnect',function () {
      if(UniqueSocket.id === players.white){
        delete players.white
      }
      else if(UniqueSocket.id === players.black){
        delete players.black
      }
    });
    UniqueSocket.on('move',(move) => {
      try {
        if (chess.turn() === 'w' && UniqueSocket.id !== players.white) return;
        if (chess.turn() === 'b' && UniqueSocket.id !== players.black) return;

     const result = chess.move(move);

     if (result ){
       currentPlayer = chess.turn();
       io.emit('move',move);
       io.emit('boardState', chess.fen());
     }else{
       console.log('Invalid Move :',move);
       UniqueSocket.emit('Invalid move:',move)
     }

      } catch (e) {
        console.log(e)
         console.log('Invalid Move :',move);

      }
      
    });

});


server.listen(3000,() => {
  console.log('server is running on port 3000')
})

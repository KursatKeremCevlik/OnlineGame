const socketio = require('socket.io');
const io = socketio();

const socketApi = { };
socketApi.io = io;

let isGameRunning = false;
const PlayerArr = [];
const coinArr = [];
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const isSolidTile = (x, y) => {
  // X, y => TargetX, TargetY
  const startTileX = Math.floor(x / 64);
  const startTileY = Math.floor(y / 64);
  if(!map[startTileY][startTileX]){return true;}
}

const addCoin = () => {
  const x = Math.floor(Math.random() * 440) + 100;
  const y = Math.floor(Math.random() * 256) + 96;
  const coin = {
    x: x,
    y: y,
    type: 0
  }
  coinArr.push(coin);
}

const calculateDistance = (x1, x2, y1, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

io.on('connection', (socket) => {
  socket.emit('MAP_UPDATE', map);
  socket.on('CONNECT_ME', (data) => {
    const firstX = Math.floor(Math.random() * 440) + 100;
    const firstY = Math.floor(Math.random() * 256) + 96;
    const Player = {
      name: data.name.toLowerCase(),
      x: firstX,
      y: firstY,
      dirx: 0,
      diry: 0,
      targetx: firstX,
      targety: firstY,
      type: Math.floor(Math.random() * 4),
      coins: 0,
      medkits: 0,
      id: socket.id
    }
    PlayerArr.push(Player);
  });

  socket.on('disconnect', () => {
    for(var i = 0; i < PlayerArr.length; i++){
      if(PlayerArr[i].id == socket.id){
        PlayerArr.splice(i, 1);
      }
    }
  });
  socket.on('PLAYER_DIR_UPDATE', (data) => {
    const player = PlayerArr.filter(Player => Player.id == socket.id);
    if(data.dirx !== undefined){
      player[0].dirx = data.dirx;
    }
    if(data.diry !== undefined){
      player[0].diry = data.diry;
    }
  });
});
let now = Date.now();
let counter = true;
setInterval(() => {
  if(PlayerArr.length == 1 && counter){
    isGameRunning = true;
    counter = false;
  }
  if(PlayerArr.length == 0){
    isGameRunning = false;
    counter = true;
  }
  if(isGameRunning){
    if(Date.now() - now > 2000){
      now = Date.now();
      addCoin();
    }
    for(var i = 0; i < PlayerArr.length; i++){
      const targetx = PlayerArr[i].targetx + PlayerArr[i].dirx * 6;
      const targety = PlayerArr[i].targety + PlayerArr[i].diry * 6;
      if(isSolidTile(targetx, targety)){
        PlayerArr[i].x = PlayerArr[i].x + (targetx - PlayerArr[i].x) * 1.2;
        PlayerArr[i].y = PlayerArr[i].y + (targety - PlayerArr[i].y) * 1.2;
        PlayerArr[i].targetx = PlayerArr[i].x;
        PlayerArr[i].targety = PlayerArr[i].y;
        for(var j = 0; j < coinArr.length; j++){
          if(calculateDistance(PlayerArr[i].x, coinArr[j].x, PlayerArr[i].y, coinArr[j].y) < 20){
            PlayerArr[i].coins += 20;
            coinArr.splice(j, 1);
          }
        }
      }
    }
  }
  io.sockets.emit('PLAYERS_UPDATE', PlayerArr);
  io.sockets.emit('COINS_UPDATE', coinArr);
}, 1000/30);

module.exports = socketApi;
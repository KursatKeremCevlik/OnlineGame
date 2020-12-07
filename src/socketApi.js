const socketio = require('socket.io');
const io = socketio();

const socketApi = { };
socketApi.io = io;

let isGameRunning = false;

const PlayerArr = [];
let bulletArr = [];
let coinArr = [];

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 448;
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]
let lastCircleCollapsedAt = Date.now();
let circleClosingDistance = 320;
let circleCenterX = CANVAS_WIDTH/2;
let circleCenterY = CANVAS_HEIGHT/2;

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
      bullets: 0,
      health: 100,
      isDead: false,
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
  socket.on('PURCHASE_MATERIAL', (data) => {
    const player = PlayerArr.filter(Player => Player.id === socket.id);
    if(data.type === 'medkit'){
      if(player[0].coins >= 100){
        player[0].medkits += 1;
        player[0].coins -= 100;
      }
    }
    if(data.type === 'bullet'){
      if(player[0].coins >= 50){
        player[0].bullets += 1;
        player[0].coins -= 50;
      }
    }
  });
  socket.on('USE_MATERIAL', (data) => {
    const player = PlayerArr.filter(Player => Player.id === socket.id);
    if(data.type === 'medkit'){
      if(player[0].medkits){
        player[0].medkits -= 1;
        if(player[0].health < 80){
          player[0].health += 20;
        }else{
          player[0].health = 100;
        }
      }
    }
    if(data.type === 'bullet'){
      // if(player[0].bullets){
        player[0].bullets -= 1;
        const bullet = {
          startX: data.startX,
          startY: data.startY,
          targetX: data.targetX,
          targetY: data.targetY,
          x: data.startX,
          y: data.startY,
          circleDistance: 10
        }
        bulletArr.push(bullet);
      // }
    }
  });
});
let coinTime = Date.now();
let circleTime = Date.now();
let bulletTime = Date.now();
let counter = true;
setInterval(() => {
  if(PlayerArr.length == 3 && counter){
    isGameRunning = true;
    counter = false;
  }
  if(PlayerArr.length == 0){
    isGameRunning = false;
    counter = true;
    circleClosingDistance = 320;
    coinArr = [];
    bulletArr = [];
  }
  if(isGameRunning){
    io.sockets.emit('GAME_STATE', {isGameRunning});
    let newArr = [];
    for(var i = 0; i < PlayerArr.length; i++){
      if(!PlayerArr[i].isDead){newArr.push(PlayerArr[i])}
    }
    if(newArr.length < 2){
      isGameRunning = false;
      const player = newArr[0];
      io.sockets.emit('PLAYERS_UPDATE', PlayerArr);
      io.sockets.emit('COINS_UPDATE', coinArr);
      io.sockets.emit('CIRCLE_UPDATE', {circleCenterX, circleCenterY, circleClosingDistance});
      setTimeout(() => {
        io.sockets.emit('WINNER_NAME', {name: player.name});
      });
    }
    if(Date.now() - coinTime > 3500){
      coinTime = Date.now();
      addCoin();
    }
    if(Date.now() - circleTime > 100){
      circleClosingDistance = Math.max(0, circleClosingDistance - 1);
      circleTime = Date.now();
    }
   for(var i = 0; i < PlayerArr.length; i++){
      const targetx = PlayerArr[i].targetx + PlayerArr[i].dirx * 6;
      const targety = PlayerArr[i].targety + PlayerArr[i].diry * 6;
      if(!PlayerArr[i].isDead){
        if(PlayerArr[i].health < 1){
          PlayerArr[i].isDead = true;
        }
        if(calculateDistance(PlayerArr[i].x, circleCenterX, PlayerArr[i].y, circleCenterY) > circleClosingDistance){
          PlayerArr[i].health -= 0.2;
        }
      }
      if(isSolidTile(targetx, targety) && !PlayerArr[i].isDead){
        PlayerArr[i].x = PlayerArr[i].x + (targetx - PlayerArr[i].x) * 1.2;
        PlayerArr[i].y = PlayerArr[i].y + (targety - PlayerArr[i].y) * 1.2;
        PlayerArr[i].targetx = PlayerArr[i].x;
        PlayerArr[i].targety = PlayerArr[i].y;
        for(var j = 0; j < coinArr.length; j++){
          if(calculateDistance(PlayerArr[i].x, coinArr[j].x, PlayerArr[i].y, coinArr[j].y) < 20){
            PlayerArr[i].coins += 200;
            coinArr.splice(j, 1);
          }
        }
      }
    }
    for(var i = 0; i < bulletArr.length; i++){
      bulletArr[i].x -= 1;
      bulletArr[i].y -= 1;
    }
  }
  io.sockets.emit('PLAYERS_UPDATE', PlayerArr);
  io.sockets.emit('COINS_UPDATE', coinArr);
  io.sockets.emit('BULLETS_UPDATE', bulletArr);
  io.sockets.emit('CIRCLE_UPDATE', {circleCenterX, circleCenterY, circleClosingDistance});
}, 1000/30);

module.exports = socketApi;
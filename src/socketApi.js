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
// 0 => grass / çimen
// 1 => forest / orman
// 2 => home / ev
// 3, 4 => castle / kale
// 5 => statue / heykel
// 6, 7, 8, 9, 10 => windmill / yel değirmeni
// 11, 12, 13, 14 => ways / yollar
// 15 => small tree / küçük ağaç
// 16, 17 => bush / çalı
// 18 => small forest
// 19 => cut trees (small)
// 20 => cut trees (big)
// 21 => stone / taş
let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 20, 0, 0, 18, 21, 0, 15, 6, 1],
  [1, 11, 17, 21, 0, 0, 19, 0, 0, 11, 1],
  [1, 14, 12, 12, 12, 3, 12, 12, 12, 13, 1],
  [1, 11, 21, 0, 17, 0, 0, 0, 15, 11, 1],
  [1, 11, 16, 0, 21, 0, 16, 0, 20, 11, 1],
  [1, 7, 0, 0, 0, 15, 0, 0, 21, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]
const notSolid = [0, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const shouldPeopleCount = 1;

const isSolidTile = (x, y) => {
  // x, y => TargetX, TargetY
  const startTileX = Math.floor(x / 64);
  const startTileY = Math.floor(y / 64);
  const tile = map[startTileY][startTileX];
  for(var i = 0; i < notSolid.length; i++){
    if(notSolid[i] == tile){
      return true;
    }
  }
}

const addCoin = (coinType) => {
  let a = true;
  while(a){
    const x = Math.floor(Math.random() * 520) + 100;
    const y = Math.floor(Math.random() * 336) + 96;
    if(isSolidTile(x, y)){
      const coin = {
        x: x,
        y: y,
        type: coinType
      }
      coinArr.push(coin);
      a = false;
    }
  }
}

const calculateDistance = (x1, x2, y1, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

io.on('connection', (socket) => {
  socket.emit('MAP_UPDATE', map);
  socket.emit('SHOULD_PEOPLE_COUNT', shouldPeopleCount);
  socket.on('CONNECT_ME', (data) => {
    let a = true;
    while(a){
      const firstX = Math.floor(Math.random() * 520) + 100;
      const firstY = Math.floor(Math.random() * 336) + 96;
      if(isSolidTile(firstX, firstY)){
        const Player = {
          name: data.name.toLowerCase(),
          x: firstX,
          y: firstY,
          dirx: 0,
          diry: 0,
          targetx: firstX,
          targety: firstY,
          type: Math.floor(Math.random() * 24),
          coins: 0,
          medkits: 0,
          bullets: 0,
          health: 100,
          isDead: false,
          id: socket.id
        }
        PlayerArr.push(Player);
        a = false;
      }
    }
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
      if(!player[0].isDead && isGameRunning){
        // player[0].bullets -= 1;
        const bulletTargetX = data.targetX;
        const bulletTargetY = data.targetY;
        const bullet = {
          startX: data.startX,
          startY: data.startY,
          targetX: bulletTargetX,
          targetY: bulletTargetY,
          x: data.startX,
          y: data.startY,
          dx: 2,
          dy: -2,
          fromWho: socket.id,
          circleDistance: 4,
          deadTime: 0,
          isDead: false
        }
        bulletArr.push(bullet);
      }
    }
  });
});
let coinTime = Date.now();
let bulletTime = Date.now();
let windMillTime = Date.now();
let counter = true;
setInterval(() => {
  if(PlayerArr.length == shouldPeopleCount && counter){
    isGameRunning = true;
    counter = false;
  }
  if(PlayerArr.length == 0){
    isGameRunning = false;
    counter = true;
    coinArr = [];
    bulletArr = [];
  }
  if(isGameRunning){
    io.sockets.emit('GAME_STATE', {isGameRunning});
    let newArr = [];
    for(var i = 0; i < PlayerArr.length; i++){
      if(!PlayerArr[i].isDead){newArr.push(PlayerArr[i])}
    }
    /*
    if(newArr.length < 2){
      isGameRunning = false;
      const player = newArr[0];
      io.sockets.emit('PLAYERS_UPDATE', PlayerArr);
      io.sockets.emit('COINS_UPDATE', coinArr);
      setTimeout(() => {
        io.sockets.emit('WINNER_NAME', {name: player.name});
      });
    }*/
    if(Date.now() - coinTime > 3500){
      const type = Math.floor(Math.random() * 100);
      let coinType;
      if(type < 10){
        // Large coin
        coinType = 0;
      }else if(type >= 10 && type < 30){
        // Big coin
        coinType = 1;
      }else if(type >= 30 && type < 60){
        // Middle coin
        coinType = 2;
      }else if(type >= 60){
        // Small coin
        coinType = 3;
      }
      coinTime = Date.now();
      addCoin(coinType);
    }
    for(var i = 0; i < PlayerArr.length; i++){
      const targetx = PlayerArr[i].targetx + PlayerArr[i].dirx * 6;
      const targety = PlayerArr[i].targety + PlayerArr[i].diry * 6;
      if(!PlayerArr[i].isDead){
        if(PlayerArr[i].health < 1){
          PlayerArr[i].isDead = true;
        }
      }
      if(isSolidTile(targetx, targety) && !PlayerArr[i].isDead){
        PlayerArr[i].x = PlayerArr[i].x + (targetx - PlayerArr[i].x) * 1.2;
        PlayerArr[i].y = PlayerArr[i].y + (targety - PlayerArr[i].y) * 1.2;
        PlayerArr[i].targetx = PlayerArr[i].x;
        PlayerArr[i].targety = PlayerArr[i].y;
        for(var j = 0; j < coinArr.length; j++){
          if(calculateDistance(PlayerArr[i].x, coinArr[j].x, PlayerArr[i].y, coinArr[j].y) < 20){
            const coinType = coinArr[j].type;
            if(coinType == 0){
              // Large coin
              PlayerArr[i].coins += 200;
            }else if(coinType == 1){
              // Big coin
              PlayerArr[i].coins += 150;
            }else if(coinType == 2){
              // Middle coin
              PlayerArr[i].coins += 100;
            }else if(coinType == 3){
              // Small coin
              PlayerArr[i].coins += 50;
            }
            coinArr.splice(j, 1);
          }
        }
      }
    }

    for(var i = 0; i < bulletArr.length; i++){
      const targetX = bulletArr[i].targetX;
      const targetY = bulletArr[i].targetY;
      const startX = bulletArr[i].startX;
      const startY = bulletArr[i].startY;

      if(isSolidTile(bulletArr[i].x, bulletArr[i].y)){
        const speed = 1000;
        const lineX = targetX - startX;
        const lineY = targetY - startY;
        const lineHeight = Math.floor(Math.sqrt((lineX*lineX)+(lineY*lineY)))
        const currentLineX = lineX/(lineHeight/speed);
        const currentLineY = lineY/(lineHeight/speed);
        
        const stepWidthFactor = 100;
        bulletArr[i].x += bulletArr[i].dx;
        bulletArr[i].y += bulletArr[i].dy;
  
        
        bulletArr[i].dx = (startX - startX + currentLineX) / stepWidthFactor * 1;
        bulletArr[i].dy = (startY - startY + currentLineY) / stepWidthFactor * 1;
      }else{
        if(!bulletArr[i].isDead){
          bulletArr[i].isDead = true;
          bulletArr[i].deadTime = Date.now();
        }
      }
      if(bulletArr[i].isDead){
        bulletArr.splice(i, 1);
      }
      for(var j = 0; j < PlayerArr.length; j++){
        if(!PlayerArr[j].isDead && bulletArr[i]){
          if(calculateDistance(PlayerArr[j].x, bulletArr[i].x, PlayerArr[j].y, bulletArr[i].y) < 20){
            if(bulletArr[i].fromWho !== PlayerArr[j].id && !PlayerArr[j].isDead){
              PlayerArr[j].health -= 10;
              bulletArr.splice(i, 1);
            }
          }
        }
      }
    }
  }
  io.sockets.emit('PLAYERS_UPDATE', PlayerArr);
  io.sockets.emit('COINS_UPDATE', coinArr);
  io.sockets.emit('BULLETS_UPDATE', bulletArr);
  // io.sockets.emit('MAP_UPDATE', map);
  // io.sockets.emit('CIRCLE_UPDATE', {circleCenterX, circleCenterY, circleClosingDistance});
}, 1000/30);

module.exports = socketApi;
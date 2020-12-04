const socketio = require('socket.io');
const io = socketio();

const socketApi = { };
socketApi.io = io;

const PlayerArr = [];
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

const isSolidTile = (x, y) => {
  // X, y => TargetX, TargetY
  const startTileX = Math.floor(x / 64);
  const startTileY = Math.floor(y / 64);
  if(!map[startTileY][startTileX]){
    return true;
  }else{
    return false;
  }
}

io.on('connection', (socket) => {
  socket.emit('MAP_UPDATE', map);
  socket.on('CONNECT_ME', (data) => {
    const firstX = Math.floor(Math.random() * 400) + 100;
    const firstY = Math.floor(Math.random() * 250) + 100;
    const Player = {
      name: data.name.toLowerCase(),
      x: firstX,
      y: firstY,
      dirx: 0,
      diry: 0,
      targetx: firstX,
      targety: firstY,
      type: Math.floor(Math.random() * 4),
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
setInterval(() => {
  for(var i = 0; i < PlayerArr.length; i++){
    const targetx = PlayerArr[i].targetx + PlayerArr[i].dirx * 6;
    const targety = PlayerArr[i].targety + PlayerArr[i].diry * 6;
    if(isSolidTile(targetx, targety)){
      PlayerArr[i].x = PlayerArr[i].x + (targetx - PlayerArr[i].x) * 1.2;
      PlayerArr[i].y = PlayerArr[i].y + (targety - PlayerArr[i].y) * 1.2;
      PlayerArr[i].targetx = PlayerArr[i].x;
      PlayerArr[i].targety = PlayerArr[i].y;
    }
  }
  io.sockets.emit('PLAYERS_UPDATE', PlayerArr);
}, 1000/30);

module.exports = socketApi;
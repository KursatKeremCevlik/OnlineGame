$(() => {
  window.onload = function() {
    const name = document.getElementById('name');
    $('#permiss').on('click', () => {
      if(name.value){
        // Open game
        $('.name-area').hide();
        const element = document.getElementById('canvas-home');
        element.style.display = 'flex';
        const socket = io.connect('/');
        // Canvas settings
        const CANVAS_WIDTH = 640;
        const CANVAS_HEIGHT = 448;
        // const TILE_WIDTH = 30.7; // 64px
        // const TILE_HEIGHT = 23.2; // 64px
        const TILE_WIDTH = 64; // 64px
        const TILE_HEIGHT = 64; // 64px
        socket.emit('CONNECT_ME', {name: name.value});
    
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        const tile0 = document.getElementById('tile0');
        const tile1 = document.getElementById('tile1');
        const chrc0 = document.getElementById('chrc0');
        const chrc1 = document.getElementById('chrc1');
        const chrc2 = document.getElementById('chrc2');
        const chrc3 = document.getElementById('chrc3');
        const images = {
          tiles: {
            0: tile0,
            1: tile1,
          },
          users: {
            0: chrc0,
            1: chrc1,
            2: chrc2,
            3: chrc3
          }
        }
    
        let mainMap;
        /*ctx.drawImage(images.tiles[1], 0, 0, TILE_WIDTH, TILE_HEIGHT,
        0, 0,
        TILE_WIDTH, TILE_HEIGHT); */
        socket.on('MAP_UPDATE', (map) => {mainMap = map});
        const drawMap = () => {
          if(mainMap){
            for(var i = 0; i < mainMap.length; i++){
              for(var j = 0; j < mainMap[i].length; j++){
                ctx.drawImage(images.tiles[mainMap[i][j]], j*TILE_WIDTH, i*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
              }
            }
          }
        }
        const updateUser = (UserArr) => {
          ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          drawMap();
          for(var i = 0; i < UserArr.length; i++){
            ctx.drawImage(images.users[UserArr[i].type], UserArr[i].x - TILE_WIDTH/2, UserArr[i].y - TILE_HEIGHT/2);
            ctx.font = '18px comic sans';
            ctx.fillStyle = 'black';
            ctx.textAlign = "center";
            ctx.fillText(UserArr[i].name, UserArr[i].x, UserArr[i].y - 20);
          }
        }
        let UserArr = [];
        setInterval(() => {
          updateUser(UserArr);
        }, 1000/60);
        drawMap();
        const onKeyDown = (event) => {
          const keyCode = event.keyCode;
          // LEFT
          if (keyCode === 65 || keyCode === 37) {
            socket.emit('PLAYER_DIR_UPDATE', {dirx: -1});
          }
          // RIGHT
          else if (keyCode === 68 || keyCode === 39) {
            socket.emit('PLAYER_DIR_UPDATE', {dirx: 1});
          }
          // UP
          if (keyCode === 87 || keyCode === 38) {
            socket.emit('PLAYER_DIR_UPDATE', {diry: -1});
          }
          // DOWN
          else if (keyCode === 83 || keyCode === 40) {
            socket.emit('PLAYER_DIR_UPDATE', {diry: 1});
          }
        }
        const onKeyUp = (event) => {
          const keyCode = event.keyCode;
          // LEFT - right
          if ((keyCode === 65 || keyCode === 68) || (keyCode === 37 || keyCode === 39)) {
            socket.emit('PLAYER_DIR_UPDATE', {dirx: 0});
          }
          // UP - down
          if ((keyCode === 83 || keyCode === 87) || (keyCode === 38 || keyCode === 40)) {
            socket.emit('PLAYER_DIR_UPDATE', {diry: 0});
          }
        }
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        socket.on('PLAYERS_UPDATE', (PlayerArr) => {
          UserArr = [];
          for(var i = 0; i < PlayerArr.length; i++){
            const Player = {
              name: PlayerArr[i].name,
              x: PlayerArr[i].x,
              y: PlayerArr[i].y,
              dirx: PlayerArr[i].dirx,
              diry: PlayerArr[i].diry,
              targetx: PlayerArr[i].firstX,
              targety: PlayerArr[i].firstY,
              type: PlayerArr[i].type
            }
            UserArr.push(Player);
          }
        });
      }else{
        // Close game
      }
    });
  }
});

// 32 -- 67
// ? -- 88
$(() => {
  window.onload = function() {
    const name = document.getElementById('name');
    $('#permiss').on('click', () => {
      if(name.value){
        // Open game
        $('.name-area').hide();
        // Canvas settings
        const CANVAS_WIDTH = 640;
        const CANVAS_HEIGHT = 448;
        
        const element = document.getElementById('canvas-home');
        element.style.display = 'flex';
        const canvasElement = document.createElement('canvas');
        canvasElement.id = 'myCanvas';
        canvasElement.width = CANVAS_WIDTH;
        canvasElement.height = CANVAS_HEIGHT;
        element.appendChild(canvasElement);
        const socket = io.connect('/');
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
        const Coin = document.getElementById('coin');
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
          },
          environments: {
            0: Coin
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
                ctx.drawImage(
                  images.tiles[mainMap[i][j]],
                  j*64, i*64
                );
              }
            }
          }
        }
        const updateUser = (UserArr, CoinArr) => {
          let currentPlayer;
          for(var i = 0; i < UserArr.length; i++){
            if(UserArr[i].id == socket.id){
              currentPlayer = UserArr[i];
            }
          }
          setTimeout(() => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawMap();
            for(var i = 0; i < UserArr.length; i++){
              ctx.drawImage(
                images.users[UserArr[i].type], 
                UserArr[i].x - TILE_WIDTH/2, UserArr[i].y - TILE_HEIGHT/2
              );
              ctx.font = '18px comic sans';
              ctx.fillStyle = 'black';
              ctx.textAlign = "center";
              ctx.fillText(currentPlayer.name, currentPlayer.x, currentPlayer.y - 20);
              ctx.font = '14px arial';
              ctx.fillStyle = 'white';
              ctx.textAlign = "left";
              ctx.fillText(`BAKIYE: ₺${currentPlayer.coins}`, 20, CANVAS_HEIGHT - 20);
            }
            for(var i = 0; i < CoinArr.length; i++){
              ctx.drawImage(
                images.environments[CoinArr[i].type],
                CoinArr[i].x - TILE_WIDTH/2, CoinArr[i].y - TILE_HEIGHT/2
              );
            }
          });
        }
        let UserArr = [];
        let CoinArr = [];
        setInterval(() => {
          updateUser(UserArr, CoinArr);
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
              coins: PlayerArr[i].coins,
              type: PlayerArr[i].type,
              id: PlayerArr[i].id,
              medkits: PlayerArr[i].medkits
            }
            UserArr.push(Player);
          }
        });
        socket.on('COINS_UPDATE', (coinArr) => {
          CoinArr = [];
          for(var i = 0; i < coinArr.length; i++){
            const Coin = {
              x: coinArr[i].x,
              y: coinArr[i].y,
              type: coinArr[i].type
            }
            CoinArr.push(Coin);
          }
        });
      }
    });
  }
});

// 32 -- 67
// ? -- 88
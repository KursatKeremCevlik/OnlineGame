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
        element.style.height = `${this.innerHeight-16}px`
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

        let circleCenterX;
        let circleCenterY;
        let circleClosingDistance;
        let isGameOver = false;
        let isGameRunning = false;
        let screenWidth;
        let screenHeight;
        let startMouseX;
        let startMouseY;
        let mouseX;
        let mouseY;
        let currentPlayer;
        let totalUserCount = 3;
    
        let mainMap;
        /*ctx.drawImage(images.tiles[1], 0, 0, TILE_WIDTH, TILE_HEIGHT,
        0, 0,
        TILE_WIDTH, TILE_HEIGHT); */
        socket.on('MAP_UPDATE', (map) => {mainMap = map});
        socket.on('GAME_STATE', (data) => {
          isGameRunning = data.isGameRunning;
        });
        socket.on('CIRCLE_UPDATE', (data) => {
          circleCenterX = data.circleCenterX;
          circleCenterY = data.circleCenterY;
          circleClosingDistance = data.circleClosingDistance;
        });
        const drawMap = (currentPlayer) => {
          if(mainMap){
            // const cameraCornerX = currentPlayer.x - CANVAS_WIDTH / 2;
            // const cameraCornerY = currentPlayer.y - CANVAS_HEIGHT / 2;
            // const offsetX = currentPlayer.x % TILE_WIDTH;
            // const offsetY = currentPlayer.y % TILE_HEIGHT;
            // const startTileX = Math.floor(cameraCornerX / TILE_WIDTH) - 1;
            // const startTileY = Math.floor(cameraCornerY / TILE_HEIGHT) - 1;
            
            // const cols = CANVAS_WIDTH / TILE_WIDTH + 2;
            // const rows = CANVAS_HEIGHT / TILE_HEIGHT + 2;
            // for(var j = 0; j < rows; j++){
            //   for(var k = 0; k < cols; k++){
            //     let imageType;
            //     try{
            //       imageType = startTileX + k >= 0 && startTileY + j >= 0 ? mainMap[startTileY + j][startTileX + k] : undefined
            //     } catch(err) {}
            //     if(imageType == undefined){
            //       ctx.fillStyle = 'black';
            //       ctx.fillRect(k * TILE_WIDTH, j * TILE_HEIGHT,
            //       TILE_WIDTH, TILE_HEIGHT);
            //     }else{
            //       ctx.drawImage(
            //         images.tiles[imageType], 0, 0, TILE_WIDTH, TILE_HEIGHT,
            //         k * TILE_WIDTH - offsetX, j * TILE_HEIGHT - offsetY,
            //         TILE_WIDTH, TILE_HEIGHT
            //       );
            //     }
            //   }
            // }
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
        const updateCircle = () => {
          ctx.beginPath();
          ctx.arc(
            circleCenterX, circleCenterY,
            circleClosingDistance,
            0, 2*Math.PI);
          ctx.stroke();
        }
        const updateUsers = (UserArr, CoinArr, BulletArr) => {
          for(var i = 0; i < UserArr.length; i++){
            if(UserArr[i].id == socket.id){
              currentPlayer = UserArr[i];
            }
          }
          setTimeout(() => {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            drawMap(currentPlayer);
            for(var i = 0; i < UserArr.length; i++){
              if(!UserArr[i].isDead){
                ctx.drawImage(
                  images.users[UserArr[i].type],
                  // CANVAS_WIDTH/2, CANVAS_HEIGHT/2
                  UserArr[i].x - TILE_WIDTH/2, UserArr[i].y - TILE_HEIGHT/2
                );
                // Render player name
                ctx.font = '18px comic sans';
                ctx.fillStyle = 'black';
                ctx.textAlign = "center";
                ctx.fillText(UserArr[i].name, UserArr[i].x, UserArr[i].y - 20);
                //
                // Render health bar
                ctx.fillStyle = 'black';
                ctx.fillRect((UserArr[i].x + 16) - TILE_WIDTH/2, UserArr[i].y + 20, 32, 12)
                ctx.fillStyle = 'lightgreen';
                ctx.fillRect((UserArr[i].x + 16 + 2) - TILE_WIDTH/2, UserArr[i].y + 22, 28 * (UserArr[i].health / 100), 8)
                //
                
                // Render line
                // let lineX = (mouseX-currentPlayer.x)-startMouseX;
                // let lineY = (mouseY-currentPlayer.y)-startMouseY;
                // const lineHeight = Math.floor(Math.sqrt((lineX*lineX)+(lineY*lineY)))
                // let currentLineX;
                // let currentLineY;
                // if(lineHeight > 100){
                //   currentLineX = lineX/(lineHeight/100);
                //   currentLineY = lineY/(lineHeight/100);
                //   ctx.moveTo(currentPlayer.x, currentPlayer.y);
                //   ctx.lineTo(currentPlayer.x+currentLineX, currentPlayer.y+currentLineY);
                //   ctx.stroke();
                // }else{
                //   ctx.moveTo(currentPlayer.x, currentPlayer.y);
                //   ctx.lineTo(currentPlayer.x+lineX, currentPlayer.y+lineY);
                //   ctx.stroke();
                // }
                // Render hepler lines
                // ctx.moveTo(currentPlayer.x, currentPlayer.y);
                // ctx.lineTo(currentPlayer.x + lineX, currentPlayer.y);
                // ctx.font = '14px arial';
                // ctx.fillText(Math.floor(lineX), currentPlayer.x+lineX/2, currentPlayer.y-5);
                // ctx.stroke();
                // ctx.moveTo(currentPlayer.x + lineX, currentPlayer.y);
                // ctx.lineTo(currentPlayer.x + lineX, currentPlayer.y + lineY);
                // ctx.font = '14px arial';
                // ctx.fillText(Math.floor(lineY), currentPlayer.x+lineX-15, currentPlayer.y+lineY/2);
                // ctx.stroke();

                // Render money and medkit counts
                ctx.font = '14px arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = "left";
                ctx.fillText(`MONEY: ₺${currentPlayer.coins}`, 20, CANVAS_HEIGHT - 20);
                ctx.fillText(`MEDKIT: ${currentPlayer.medkits}`, 130, CANVAS_HEIGHT - 20);
                // ctx.fillText(`BULLET: ${currentPlayer.bullets}`, 240, CANVAS_HEIGHT - 20);

                if(!isGameRunning){
                  ctx.font = '40px arial';
                  ctx.fillStyle = 'white';
                  ctx.textAlign = "center";
                  const remainingPeople = totalUserCount - UserArr.length;
                  ctx.fillText(`GAME START WITH ${remainingPeople} PEOPLE`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
                }
              }
              /*
              ctx.drawImage(
                images.users[UserArr[i].type], 
                UserArr[i].x - TILE_WIDTH/2, UserArr[i].y - TILE_HEIGHT/2
              );
              ctx.font = '18px comic sans';
              ctx.fillStyle = 'black';
              ctx.textAlign = "center";
              ctx.fillText(UserArr[i].name, UserArr[i].x, UserArr[i].y - 20);
              */
            }
            for(var i = 0; i < CoinArr.length; i++){
              ctx.drawImage(
                images.environments[CoinArr[i].type],
                CoinArr[i].x - TILE_WIDTH/2, CoinArr[i].y - TILE_HEIGHT/2
              );
            }
            updateCircle();
            updateBullets(BulletArr);
          });
        }
        const updateBullets = (bulletArr) => {
          if(bulletArr[0]){
            for(var i = 0; i < bulletArr.length; i++){
              ctx.moveTo(bulletArr[i].startX, bulletArr[i].startY);
              ctx.lineTo(bulletArr[i].targetX, bulletArr[i].targetY);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(
                bulletArr[i].startX, bulletArr[i].startY,
                bulletArr[i].circleDistance,
                0, 2*Math.PI);
              ctx.fill();
              ctx.stroke();
            }
          }
        }
        let UserArr = [];
        let CoinArr = [];
        let BulletArr = [];
        setInterval(() => {
          if(!isGameOver){
            updateUsers(UserArr, CoinArr, BulletArr);
          }
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
          // M
          if (keyCode === 77) {
            socket.emit('PURCHASE_MATERIAL', {type: 'medkit'});
          }
          // N
          if (keyCode === 78) {
            socket.emit('USE_MATERIAL', {type: 'medkit'});
          }
          // B
          // if (keyCode === 66) {
          //   socket.emit('PURCHASE_MATERIAL', {type: 'bullet'});
          // }
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
        let fireCounter = 0;
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        // window.addEventListener('click', event => {
        //   if(fireCounter){
        //     const data = {
        //       type: 'bullet', 
        //       startX: currentPlayer.x,
        //       startY: currentPlayer.y,
        //       targetX: mouseX-startMouseX,
        //       targetY: mouseY-startMouseY,
        //       x: currentPlayer.x,
        //       y: currentPlayer.y
        //     }
        //     // targetX = data.targetX + (10 * (data.targetX / data.targetY));
        //     // targetY = data.targetY + (10 * (data.targetY / data.targetX));
        //     socket.emit('USE_MATERIAL', data);
        //   }
        //   fireCounter = 1;
        // });
        window.addEventListener('mousemove', event => {
          if(screenWidth>CANVAS_WIDTH){
            startMouseX = Math.floor((screenWidth-CANVAS_WIDTH)/2);
            endMouseX = startMouseX + CANVAS_WIDTH;
            mouseX = event.x;
          }
          if(screenHeight>CANVAS_HEIGHT){
            startMouseY = Math.floor((screenHeight-CANVAS_HEIGHT)/2);
            endMouseY = startMouseY + CANVAS_HEIGHT;
            mouseY = event.y;
          }
        });
        socket.on('PLAYERS_UPDATE', (PlayerArr) => {
          screenWidth = Math.floor(this.innerWidth);
          screenHeight = Math.floor(this.innerHeight-4);
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
              medkits: PlayerArr[i].medkits,
              bullets: PlayerArr[i].bullets,
              health: PlayerArr[i].health,
              isDead: PlayerArr[i].isDead,
              id: PlayerArr[i].id
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
        socket.on('BULLETS_UPDATE', (bulletArr) => {
          BulletArr = []
          for(var i = 0; i < bulletArr.length; i++){
            const bullet = {
              startX: bulletArr[i].startX,
              startY: bulletArr[i].startY,
              targetX: bulletArr[i].targetX,
              targetY: bulletArr[i].targetY,
              x: bulletArr[i].x,
              y: bulletArr[i].y,
              circleDistance: bulletArr[i].circleDistance
            }
            BulletArr.push(bullet);
          }
        });
        socket.on('WINNER_NAME', (data) => {
          updateUsers(UserArr, CoinArr);
          setTimeout(() => {
            isGameOver = true;
            ctx.font = '40px arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = "center";
            ctx.fillText(`WINNER: ${data.name}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
          });
        });
      }
    });
  }
});

// 32 -- 67
// ? -- 88
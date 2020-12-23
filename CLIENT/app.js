$(() => {
  window.onload = function() {
    const name = document.getElementById('name');
    $('#permiss').on('click', () => {
      if(name.value){
        // Open game
        $('.name-area').hide();
        // Canvas settings
        const CANVAS_WIDTH = 704;
        const CANVAS_HEIGHT = 512;
        
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
        const tile2 = document.getElementById('tile2');
        const tile3 = document.getElementById('tile3');
        const tile4 = document.getElementById('tile4');
        const tile5 = document.getElementById('tile5');
        const windMillTile0 = document.getElementById('windMillTile0');
        const windMillTile1 = document.getElementById('windMillTile1');
        const windMillTile2 = document.getElementById('windMillTile2');
        const windMillTile3 = document.getElementById('windMillTile3');
        const windMillTile4 = document.getElementById('windMillTile4');
        const waysTile0 = document.getElementById('waysTile0');
        const waysTile1 = document.getElementById('waysTile1');
        const waysTile2 = document.getElementById('waysTile2');
        const waysTile3 = document.getElementById('waysTile3');
        const waysTile4 = document.getElementById('waysTile4');
        const waysTile5 = document.getElementById('waysTile5');
        const waysTile6 = document.getElementById('waysTile6');
        const waysTile7 = document.getElementById('waysTile7');
        const waysTile8 = document.getElementById('waysTile8');
        const waysTile9 = document.getElementById('waysTile9');
        const chrc0 = document.getElementById('chrc0');
        const chrc1 = document.getElementById('chrc1');
        const chrc2 = document.getElementById('chrc2');
        const chrc3 = document.getElementById('chrc3');
        const chrc4 = document.getElementById('chrc4');
        const chrc5 = document.getElementById('chrc5');
        const chrc6 = document.getElementById('chrc6');
        const chrc7 = document.getElementById('chrc7');
        const chrc8 = document.getElementById('chrc8');
        const chrc9 = document.getElementById('chrc9');
        const chrc10 = document.getElementById('chrc10');
        const chrc11 = document.getElementById('chrc11');
        const chrc12 = document.getElementById('chrc12');
        const chrc13 = document.getElementById('chrc13');
        const chrc14 = document.getElementById('chrc14');
        const chrc15 = document.getElementById('chrc15');
        const chrc16 = document.getElementById('chrc16');
        const chrc17 = document.getElementById('chrc17');
        const chrc18 = document.getElementById('chrc18');
        const chrc19 = document.getElementById('chrc19');
        const chrc20 = document.getElementById('chrc20');
        const chrc21 = document.getElementById('chrc21');
        const chrc22 = document.getElementById('chrc22');
        const chrc23 = document.getElementById('chrc23');
        const coin0 = document.getElementById('coin0');
        const coin1 = document.getElementById('coin1');
        const coin2 = document.getElementById('coin2');
        const coin3 = document.getElementById('coin3');
        const bullet = document.getElementById('bullet');
        const stone = document.getElementById('stone');
        const images = {
          tiles: {
            0: tile0,
            1: tile1,
            2: tile2,
            3: tile3,
            4: tile4,
            5: tile5,
            6: windMillTile0,
            7: windMillTile1,
            8: windMillTile2,
            9: windMillTile3,
            10: windMillTile4,
            11: waysTile0,
            12: waysTile1,
            13: waysTile2,
            14: waysTile3,
            15: waysTile4,
            16: waysTile5,
            17: waysTile6,
            18: waysTile7,
            19: waysTile8,
            20: waysTile9,
            21: stone
          },
          users: {
            0: chrc0,
            1: chrc1,
            2: chrc2,
            3: chrc3,
            4: chrc4,
            5: chrc5,
            6: chrc6,
            7: chrc7,
            8: chrc8,
            9: chrc9,
            10: chrc10,
            11: chrc11,
            12: chrc12,
            13: chrc13,
            14: chrc14,
            15: chrc15,
            16: chrc16,
            17: chrc17,
            18: chrc18,
            19: chrc19,
            20: chrc20,
            21: chrc21,
            22: chrc22,
            23: chrc23,
          },
          environments: {
            1: bullet
          },
          coins: {
            0: coin0,
            1: coin1,
            2: coin2,
            3: coin3
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
        let totalUserCount = 0;
    
        let mainMap;
        /*ctx.drawImage(images.tiles[1], 0, 0, TILE_WIDTH, TILE_HEIGHT,
        0, 0,
        TILE_WIDTH, TILE_HEIGHT); */
        socket.on('MAP_UPDATE', (map) => {mainMap = map});
        socket.on('SHOULD_PEOPLE_COUNT', (shouldPeopleCount) => {
          totalUserCount = shouldPeopleCount;
          ctx.font = '40px arial';
          ctx.fillStyle = 'white';
          ctx.textAlign = "center";
          const remainingPeople = totalUserCount - UserArr.length;
          ctx.fillText(`GAME START WITH ${remainingPeople} PEOPLE`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        });
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
            for(var i = 0; i < mainMap.length; i++){
              for(var j = 0; j < mainMap[i].length; j++){
                if(mainMap[i][j] == 3){
                  // Draw castle here
                  ctx.drawImage(
                    images.tiles[0],
                    j*TILE_WIDTH, i*TILE_HEIGHT
                  );
                  ctx.drawImage(
                    images.tiles[3],
                    j*TILE_WIDTH, (i*TILE_HEIGHT) - 32
                  );
                  ctx.drawImage(
                    images.tiles[4],
                    j*TILE_WIDTH, (i*TILE_HEIGHT) + 30
                  );
                }else if(mainMap[i][j]==6 || mainMap[i][j]==7 || mainMap[i][j]==8){
                  // Draw windmill here
                  ctx.drawImage(
                    images.tiles[0],
                    j*TILE_WIDTH, i*TILE_HEIGHT
                  );
                  ctx.drawImage(
                    images.tiles[9],
                    j*TILE_WIDTH, i*TILE_HEIGHT - 32
                  );
                  ctx.drawImage(
                    images.tiles[10],
                    j*TILE_WIDTH, i*TILE_HEIGHT + 30
                  );
                  ctx.drawImage(
                    images.tiles[mainMap[i][j]],
                    j*TILE_WIDTH, i*TILE_HEIGHT - 10
                  );
                }else if(mainMap[i][j] !== 0 && mainMap[i][j] !== 1){
                  // Draw environments here
                  ctx.drawImage(
                    images.tiles[0],
                    j*TILE_WIDTH, i*TILE_HEIGHT
                  );
                  ctx.drawImage(
                    images.tiles[mainMap[i][j]],
                    j*TILE_WIDTH, i*TILE_HEIGHT
                  );
                }else{
                  // Draw floor here
                  ctx.drawImage(
                    images.tiles[mainMap[i][j]],
                    j*TILE_WIDTH, i*TILE_HEIGHT
                  );
                }
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
                // ctx.fillText(UserArr[i].name, CANVAS_WIDTH/2 + TILE_WIDTH/2, CANVAS_HEIGHT/2 + 10);
                //
                // Render health bar
                ctx.fillStyle = 'black';
                ctx.fillRect((UserArr[i].x + 16) - TILE_WIDTH/2, UserArr[i].y + 20, 32, 12)
                ctx.fillStyle = 'lightgreen';
                ctx.fillRect((UserArr[i].x + 16 + 2) - TILE_WIDTH/2, UserArr[i].y + 22, 28 * (UserArr[i].health / 100), 8)
                //
                
                // Render line
                let lineX = (mouseX-currentPlayer.x)-startMouseX;
                let lineY = (mouseY-currentPlayer.y)-startMouseY;
                const lineHeight = Math.floor(Math.sqrt((lineX*lineX)+(lineY*lineY)))
                let currentLineX;
                let currentLineY;
                if(!currentPlayer.isDead){
                  if(lineHeight > 100){
                    currentLineX = lineX/(lineHeight/100);
                    currentLineY = lineY/(lineHeight/100);
                    ctx.moveTo(currentPlayer.x, currentPlayer.y);
                    ctx.lineTo(currentPlayer.x+currentLineX, currentPlayer.y+currentLineY);
                    ctx.stroke();
                  }else{
                    ctx.moveTo(currentPlayer.x, currentPlayer.y);
                    ctx.lineTo(currentPlayer.x+lineX, currentPlayer.y+lineY);
                    ctx.stroke();
                  }
                }
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
                images.coins[CoinArr[i].type],
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
              const X = bulletArr[i].x;
              const Y = bulletArr[i].y;
              const startX = bulletArr[i].startX;
              const startY = bulletArr[i].startY;
              const targetX = bulletArr[i].targetX;
              const targetY = bulletArr[i].targetY;

              const lineX = targetX - startX;
              const lineY = targetY - startY;
              const lineHeight = Math.floor(Math.sqrt((lineX*lineX)+(lineY*lineY)))
              let currentLineX;
              let currentLineY;
              /*
              if(lineHeight > 300){
                currentLineX = lineX/(lineHeight/300);
                currentLineY = lineY/(lineHeight/300);
                ctx.moveTo(startX, startY);
                ctx.lineTo(
                  startX + currentLineX, 
                  startY + currentLineY
                );
              }else{
                ctx.moveTo(startX, startY);
                currentLineX = lineX/(lineHeight/300);
                currentLineY = lineY/(lineHeight/300);
                ctx.lineTo(
                  startX + currentLineX, 
                  startY + currentLineY
                );
              }
              */
              ctx.stroke();

              ctx.fillStyle = 'black';
              ctx.beginPath();
              ctx.arc(
                X, Y,
                bulletArr[i].circleDistance,
                0, 2*Math.PI);
              ctx.fill();
              ctx.stroke();
              /*
              ctx.moveTo(startX, startY);
              ctx.lineTo(targetX, startY);
              
              ctx.font = '14px arial';
              ctx.moveTo(targetX, startY);
              ctx.lineTo(targetX, targetY);
              ctx.fillText(Math.floor(lineX), startX+(lineX)/2, startY-5);

              ctx.font = '14px arial';
              ctx.fillText(Math.floor(lineY), targetX+20, startY + lineY/2);
              ctx.stroke();
              */
            }
          }
        }
        let UserArr = [];
        let CoinArr = [];
        let BulletArr = [];
        let windMillTime = Date.now();
        setInterval(() => {
          if(!isGameOver){
            requestAnimationFrame(() => {
              updateUsers(UserArr, CoinArr, BulletArr);
              if(Date.now() - windMillTime > 500){
                let valueArr = [];
                for(var i = 0; i < mainMap.length; i++){
                  for(var j = 0; j < mainMap[i].length; j++){
                    if(mainMap[i][j] == 6){
                      valueArr.push({i: i, j: j, value: 7});
                    }
                    if(mainMap[i][j] == 7){
                      valueArr.push({i: i, j: j, value: 8});
                    }
                    if(mainMap[i][j] == 8){
                      valueArr.push({i: i, j: j, value: 6});
                    }
                  }
                }
                setTimeout(() => {
                  if(valueArr[0]){
                    for(var i = 0; i < valueArr.length; i++){
                      mainMap[valueArr[i].i][valueArr[i].j] = valueArr[i].value;
                    }
                  }
                  setTimeout(() => {
                    valueArr = [];
                  });
                });
                windMillTime = Date.now();
              }
            });
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
        window.addEventListener('click', event => {
          if(fireCounter){
            let bulletX = currentPlayer.x;
            let bulletY = currentPlayer.y;
            const targetX = mouseX-startMouseX;
            const targetY = mouseY-startMouseY;
            setTimeout(() => {
              const data = {
                type: 'bullet', 
                startX: bulletX,
                startY: bulletY,
                targetX: targetX,
                targetY: targetY,
                x: bulletX,
                y: bulletY
              }
              // targetX = data.targetX + (10 * (data.targetX / data.targetY));
              // targetY = data.targetY + (10 * (data.targetY / data.targetX));
              socket.emit('USE_MATERIAL', data);
            });
          }
          fireCounter = 1;
        });
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
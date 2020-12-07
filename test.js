const cameraCornerX = currentPlayer.x - CANVAS_WIDTH / 2;
const cameraCornerY = currentPlayer.y - CANVAS_HEIGHT / 2;
const offsetX = currentPlayer.x % TILE_WIDTH;
const offsetY = currentPlayer.y % TILE_HEIGHT;
const startTileX = Math.floor(cameraCornerX / TILE_WIDTH) - 1
const startTileY = Math.floor(cameraCornerY / TILE_HEIGHT) - 1

const cols = CANVAS_WIDTH / TILE_WIDTH + 2;
const rows = CANVAS_HEIGHT / TILE_HEIGHT + 2;
for (var i = 0; i < this.layers.length; i++) {
  const layer = this.layers[i];
  for (var j = 0; j < rows; j++) {
    for (var k = 0; k < cols; k++) {
      let imageType;
      try {
        imageType = startTileX + k >= 0 && startTileY + j >= 0 ? layer[startTileY + j][ startTileX + k] : undefined;
      } catch(err){}

      if (imageType === undefined) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(k * TILE_WIDTH, j * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
      } else {
        this.ctx.drawImage(
          this.images.tiles[imageType], 0, 0, TILE_WIDTH, TILE_HEIGHT,
          k * TILE_WIDTH - offsetX - 64, j * TILE_HEIGHT - offsetY - 64,
          TILE_WIDTH, TILE_HEIGHT);
      }
    }
  }
}
import * as MAP from '../../utilities/map';
import * as COLLECTABLE from '../../utilities/collectible'

export const WAITING = 1;
export const TURNING_RIGHT = 2;
export const TURNING_LEFT = 3;
export const MOVING_FORWARD = 4;

export const getPlayerObj = () => {
    
    return {
        startX: 0,
        startZ: 0,
        playerDirection: MAP.NORTH,
        playerState: WAITING,
        currentDirection: 0,
        player: {gridX:0, gridY:0, direction: MAP.NORTH},
        turningArc: 0,
        walkingDistance: 0,
        last_update: Date.now(),
        playerInput: {right:0,left:0,up:0,down:0}
    };
}

export const doKeyDown = (event, playerObj) => {
    let keynum;
 
    if(window.event){ //Browser is IE
       keynum = event.keyCode;
    }
    else{
       keynum = event.which;
    }
 
    if(keynum === 37){
       playerObj.playerInput.left = 1;
    }
    else if(keynum === 38){
       playerObj.playerInput.up = 1;
    }
    else if(keynum === 39){
       playerObj.playerInput.right = 1;
    }
    else if(keynum === 40){
       playerObj.playerInput.down = 1;
    }
 }
 
 export const doKeyUp = (event, playerObj) => {
    let keynum;
    
    if(window.event){ //Browser is IE
       keynum = event.keyCode;
    }
    else{
       keynum = event.which;
    }
 
    if(keynum === 37){
       playerObj.playerInput.left = 0;
    }
    else if(keynum === 38){
       playerObj.playerInput.up = 0;
    }
    else if(keynum === 39){
       playerObj.playerInput.right = 0;
    }
    else if(keynum === 40){
       playerObj.playerInput.down = 0;
    }
 }

export const doPlayerMove = (
    mazeGrid, 
    playerObj,
    deltaTime,
    collectables,
    scene
    ) => {


    if(playerObj.playerState === WAITING) {
        if(playerObj.playerInput.left === 1) {
          playerObj.playerState = TURNING_LEFT;
          switch(playerObj.playerDirection){
            case MAP.NORTH:
              playerObj.playerDirection = MAP.WEST;
               break;
            case MAP.EAST:
              playerObj.playerDirection = MAP.NORTH;
               break;
            case MAP.SOUTH:
              playerObj.playerDirection = MAP.EAST;
               break;
            case MAP.WEST:
            default:
              playerObj.playerDirection = MAP.SOUTH;
               break;
         }
         playerObj.player.direction = playerObj.playerDirection;
        }
        else if(playerObj.playerInput.right === 1) {
          playerObj.playerState = TURNING_RIGHT;
          switch(playerObj.playerDirection){
            case MAP.NORTH:
              playerObj.playerDirection = MAP.EAST;
               break;
            case MAP.EAST:
              playerObj.playerDirection = MAP.SOUTH;
               break;
            case MAP.SOUTH:
              playerObj.playerDirection = MAP.WEST;
               break;
            case MAP.WEST:
            default:
              playerObj.playerDirection = MAP.NORTH;
               break;
         }
         playerObj.player.direction = playerObj.playerDirection;
        } else if(playerObj.playerInput.up && MAP.validMove(mazeGrid, playerObj.player.gridX, playerObj.player.gridY, playerObj.player.direction)){
          playerObj.walkingDistance = 0;
          playerObj.startX = playerObj.camera.position.x;
          playerObj.startZ = playerObj.camera.position.z;
          playerObj.playerState = MOVING_FORWARD;
          switch(playerObj.playerDirection){
            case MAP.NORTH:
               playerObj.player.gridX--;
               break;
            case MAP.EAST:
               playerObj.player.gridY++;
               break;
            case MAP.SOUTH:
               playerObj.player.gridX++;
               break;
            case MAP.WEST:
            default:
               playerObj.player.gridY--;
               break;
         }
       }
      }


      if(playerObj.playerState === TURNING_LEFT){
        playerObj.turningArc += Math.PI/2 * deltaTime/1000;
        if(playerObj.turningArc >= Math.PI/2){
          playerObj.turningArc = Math.PI/2;
          playerObj.currentDirection = playerObj.currentDirection + playerObj.turningArc;
          playerObj.turningArc = 0;
          playerObj.playerState = WAITING;
        }
        playerObj.camera.rotation.y = playerObj.currentDirection + playerObj.turningArc;
      }
      
      if(playerObj.playerState === TURNING_RIGHT){
        playerObj.turningArc += Math.PI/2 * deltaTime/1000;
        if(playerObj.turningArc >= Math.PI/2){
          playerObj.turningArc = Math.PI/2;
          playerObj.currentDirection = playerObj.currentDirection - playerObj.turningArc;
          playerObj.turningArc = 0;
          playerObj.playerState = WAITING;
        }
        playerObj.camera.rotation.y = playerObj.currentDirection - playerObj.turningArc;
      }
    if(playerObj.playerState === MOVING_FORWARD) {
        playerObj.walkingDistance += 1 * deltaTime/1000;

        if(playerObj.walkingDistance >= 1){
            playerObj.walkingDistance = 1;
            playerObj.playerState = WAITING;
            COLLECTABLE.processCollectableCollisions(playerObj.player.gridX, playerObj.player.gridY,collectables,scene);
        }
        switch(playerObj.playerDirection){
            case MAP.NORTH:
              playerObj.camera.position.z = playerObj.startZ - playerObj.walkingDistance;
              break;
            case MAP.EAST:
              playerObj.camera.position.x = playerObj.startX + playerObj.walkingDistance;
              break;
            case MAP.SOUTH:
              playerObj.camera.position.z = playerObj.startZ + playerObj.walkingDistance;
              break;
            case MAP.WEST:
            default:
              playerObj.camera.position.x = playerObj.startX - playerObj.walkingDistance;
              break;
        }
      }
}
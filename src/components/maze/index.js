import React from 'react';
import * as THREE from "three";
import '../../App.css';

function createMazeGrid() {
  function MazeCell(northWall, eastWall, southWall, westWall){
    this.northWall = northWall;
    this.eastWall = eastWall;
    this.southWall = southWall;
    this.westWall = westWall;
  }

  const mazeGrid = [Array(2), Array(2)];
  mazeGrid[0][0] = new MazeCell(true, false, false, true);
  mazeGrid[0][1] = new MazeCell(true, true, true, false);
  mazeGrid[1][0] = new MazeCell(false, true, true, true);
  mazeGrid[1][1] = new MazeCell(false,false,false,false);
  return mazeGrid;
}


function placeWallGraphics(scene, mazeGrid){
   var wallGeometry = new THREE.PlaneGeometry( 1, 0.5 );
   var wallMaterial = new THREE.MeshStandardMaterial( );

   mazeGrid.forEach(function(mazeRow, rowCount){
      mazeRow.forEach(function(mazeCell, colCount){
         if(mazeCell.northWall)
           placeWall(colCount, rowCount, 'n');
         if(mazeCell.eastWall)
           placeWall(colCount, rowCount, 'e');
         if(mazeCell.southWall)
            placeWall(colCount, rowCount, 's');
         if(mazeCell.westWall)
            placeWall(colCount, rowCount, 'w');
      });
   });

   function placeWall(x,y,direction){
      var wall = new THREE.Mesh( wallGeometry, wallMaterial );
      wall.position.z = y*1;
      wall.position.x = x*1;
      if(direction === 'n'){
         wall.position.z -= 0.5;
      }
      else if(direction === 'e'){
         wall.position.x += 0.5;
         wall.rotation.y = -Math.PI/2;
      }
      else if(direction === 's'){
         wall.position.z += 0.5;
         wall.rotation.y = Math.PI;
      }
      else if(direction === 'w'){
         wall.position.x -= 0.5;
         wall.rotation.y = Math.PI/2;
      }
      else{
         return false;
      }

      scene.add(wall);
   }
}

function validMove(mazeGrid, x, y, direction){
  if(direction === NORTH)
  {
     return !mazeGrid[x][y].northWall;
  }
  else if(direction === EAST)
  {
     return !mazeGrid[x][y].eastWall;
  }
  else if(direction === SOUTH)
  {
     return !mazeGrid[x][y].southWall;
  }
  else if(direction === WEST)
  {
     return !mazeGrid[x][y].westWall;
  }
  return false;
}

const NORTH = 100;
const EAST = 101;
const WEST = 102;
const SOUTH = 103;
const WAITING = 1;
const TURNING_RIGHT = 2;
const TURNING_LEFT = 3;
const playerInput = {right:0,left:0,up:0,down:0};
const MOVING_FORWARD = 4;
var walkingDistance = 0;
var startX = 0;
var startZ = 0;

const player = {};
player.gridX = 0;
player.gridY = 0;
player.direction = NORTH;

let last_update = Date.now();


function Maze() {

  const { useRef, useEffect } = React
  const playerDirection = useRef(NORTH);
  const playerState = useRef(WAITING);
  const currentDirection = useRef(0);
  const turningArc = useRef(0);
  
  const camera = useRef({});

  useEffect(() => {

    const mazeCanvas = document.getElementById("mazeCanvas");
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: mazeCanvas });
    camera.current = new THREE.PerspectiveCamera( 75, mazeCanvas.width/mazeCanvas.height, 0.1, 1000 );

    let mazeGrid = createMazeGrid();
    placeWallGraphics(scene, mazeGrid);

    function doKeyDown(event){
       let keynum;
    
       if(window.event){ //Browser is IE
          keynum = event.keyCode;
       }
       else{
          keynum = event.which;
       }
    
       if(keynum === 37){
          playerInput.left = 1;
       }
       else if(keynum === 38){
          playerInput.up = 1;
       }
       else if(keynum === 39){
          playerInput.right = 1;
       }
       else if(keynum === 40){
          playerInput.down = 1;
       }
    }
    
    function doKeyUp(event){
       let keynum;
       
       if(window.event){ //Browser is IE
          keynum = event.keyCode;
       }
       else{
          keynum = event.which;
       }
    
       if(keynum === 37){
          playerInput.left = 0;
       }
       else if(keynum === 38){
          playerInput.up = 0;
       }
       else if(keynum === 39){
          playerInput.right = 0;
       }
       else if(keynum === 40){
          playerInput.down = 0;
       }
    }

    window.addEventListener("keydown", doKeyDown, false);
    window.addEventListener("keyup", doKeyUp, false);


    const playerPointLight = new THREE.PointLight();
    playerPointLight.position.set( 0, 0, 0 );
    scene.add( playerPointLight );



    var render = function () {

      requestAnimationFrame( render );
      var now = Date.now();

      var deltaTime = now - last_update;
      last_update = now;


      if(playerState.current === WAITING) {

        if(playerInput.left === 1) {
          playerState.current = TURNING_LEFT;
          switch(playerDirection.current){
            case NORTH:
              playerDirection.current = WEST;
               break;
            case EAST:
              playerDirection.current = NORTH;
               break;
            case SOUTH:
              playerDirection.current = EAST;
               break;
            case WEST:
            default:
              playerDirection.current = SOUTH;
               break;
         }
         player.direction = playerDirection.current;
        }
        else if(playerInput.right === 1) {
          playerState.current = TURNING_RIGHT;
          switch(playerDirection.current){
            case NORTH:
              playerDirection.current = EAST;
               break;
            case EAST:
              playerDirection.current = SOUTH;
               break;
            case SOUTH:
              playerDirection.current = WEST;
               break;
            case WEST:
            default:
              playerDirection.current = NORTH;
               break;
         }
         player.direction = playerDirection.current;
        } else if(playerInput.up && validMove(mazeGrid, player.gridX, player.gridY, player.direction)){
          walkingDistance = 0;
          startX = camera.current.position.x;
          startZ = camera.current.position.z;
          playerState.current = MOVING_FORWARD;
          switch(playerDirection.current){
            case NORTH:
               player.gridX--;
               break;
            case EAST:
               player.gridY++;
               break;
            case SOUTH:
               player.gridX++;
               break;
            case WEST:
            default:
               player.gridY--;
               break;
         }
       }
      }

      if(playerState.current === TURNING_LEFT){
        turningArc.current += Math.PI/2 * deltaTime/1000;
        if(turningArc.current >= Math.PI/2){
          turningArc.current = Math.PI/2;
          currentDirection.current = currentDirection.current + turningArc.current;
          turningArc.current = 0;
          playerState.current = WAITING;
        }
        camera.current.rotation.y = currentDirection.current + turningArc.current;
      }
      
      if(playerState.current === TURNING_RIGHT){
        turningArc.current += Math.PI/2 * deltaTime/1000;
        if(turningArc.current >= Math.PI/2){
          turningArc.current = Math.PI/2;
          currentDirection.current = currentDirection.current - turningArc.current;
          turningArc.current = 0;
          playerState.current = WAITING;
        }
        camera.current.rotation.y = currentDirection.current - turningArc.current;
      }

    if(playerState.current === MOVING_FORWARD) {
        walkingDistance += 1 * deltaTime/1000;

        if(walkingDistance >= 1){
            walkingDistance = 1;
            playerState.current = WAITING;
        }

        switch(playerDirection.current){
            case NORTH:
              camera.current.position.z = startZ - walkingDistance;
              break;
            case EAST:
              camera.current.position.x = startX + walkingDistance;
              break;
            case SOUTH:
              camera.current.position.z = startZ + walkingDistance;
              break;
            case WEST:
            default:
              camera.current.position.x = startX - walkingDistance;
              break;
        }
      }



  console.log("playerInput", playerInput);
  console.log("turningArc", turningArc.current);
  console.log("currentDirection", currentDirection.current);
  console.log("plauerDirection", playerDirection.current);
  console.log("camera y", camera.current.rotation.y);
  console.log("playerState", playerState.current);
  console.log('*************************************');
  
      renderer.render(scene, camera.current);
   };

   render();

   return function cleanup() {
    window.removeEventListener("keydown", doKeyDown, false);
    window.removeEventListener("keyup", doKeyUp, false);
   }

  });

  return <canvas id="mazeCanvas" width="600" height="450" />
}

export default Maze;

import React from 'react';
import * as THREE from "three";
import '../../App.css';
import * as MAP from '../../utilities/map';
import * as PLAYER from '../../utilities/player';
import * as COLLECTABLE from '../../utilities/collectible'

function Maze() {

  const { useEffect } = React

  const playerObj = PLAYER.getPlayerObj();

  useEffect(() => {

    const mazeCanvas = document.getElementById("mazeCanvas");
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas: mazeCanvas });
    playerObj.camera = new THREE.PerspectiveCamera( 75, mazeCanvas.width/mazeCanvas.height, 0.1, 1000 );

    const mazeGrid = MAP.getMazeGridObj(scene);

    const collectables = COLLECTABLE.createCollectiblesList();
    COLLECTABLE.placeCollectableGraphics(scene, collectables);

    window.addEventListener("keydown", function(evt) { PLAYER.doKeyDown(evt, playerObj) }, false);
    window.addEventListener("keyup", function(evt) { PLAYER.doKeyUp(evt, playerObj) }, false);


    const playerPointLight = new THREE.PointLight();
    playerPointLight.position.set( 0, 0, 0 );
    scene.add( playerPointLight );

    var render = function () {

      requestAnimationFrame( render );

      const now = Date.now();
      let deltaTime = now - playerObj.last_update;
      playerObj.last_update = now;

      PLAYER.doPlayerMove(
        mazeGrid, 
        playerObj,
        deltaTime,
        collectables,
        scene
        );

        playerPointLight.position.x = playerObj.camera.position.x;
        playerPointLight.position.y = playerObj.camera.position.y;
        playerPointLight.position.z = playerObj.camera.position.z;

        COLLECTABLE.doCollectablesMove(collectables, deltaTime);
 
        console.log("coordinates ", playerObj.player.gridX, playerObj.player.gridY);
        console.log("playerDirection ", playerObj.playerDirection);

/*   console.log("walkingDistance", walkingDistance.current);
  console.log("playerInput", playerObj.playerInput);
  console.log("turningArc", turningArc.current);
  console.log("currentDirection", currentDirection.current);
  console.log("plauerDirection", playerDirection.current);
  console.log("camera y", playerObj.camera.rotation.y);
  console.log("playerState", playerState.current);
  console.log('*************************************'); */
  
      renderer.render(scene, playerObj.camera);
   };

   render();

   return function cleanup() {
    window.removeEventListener("keydown", function(evt) { PLAYER.doKeyDown(evt, playerObj) }, false);
    window.removeEventListener("keyup", function(evt) { PLAYER.doKeyUp(evt, playerObj) }, false);
   }

  });

  return <canvas id="mazeCanvas" width="600" height="450" />
}

export default Maze;

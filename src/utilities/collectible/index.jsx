import * as THREE from "three";

export const createCollectiblesList = (number, mazeGrid) => {

    const collectableGeometry = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
    const collectableMaterial = new THREE.MeshStandardMaterial( {color: 0x000088} );

    const totalCollectibles = number;
    let collectablesCollected = 0;

    var collectables = [];

    var width = mazeGrid[0].length;
    var height = mazeGrid.length;

    for(var i=0; i < number; i++){
      var x;
      var y;
      var unique = false; //Set loop flag up so the loop runs at least once

      while(!unique){
         x = Math.floor(Math.random()*width);
         y = Math.floor(Math.random()*height);
         unique = true; //Assume the random coordinate is empty
         collectables.forEach(function(collectable){
            if(collectable.x == x && collectable.y == y){
               unique = false; //Oops! Square already has a collecatble. Reset flag so we loop again
            }
         });
      }

      //If we've gotten here the loop must have found an empty square and exited
      collectables.push({
         x:x, 
         y:y, 
         action:function(){
            collectablesCollected++;
            alert("You have picked up "+collectablesCollected+" out of "+totalCollectibles+" collectables");
            if(collectablesCollected == totalCollectibles){
               alert("Congratulations! You won the game! Refresh the page to play again.");
            }
         },
         obj: new THREE.Mesh(collectableGeometry, collectableMaterial)
      });
   }
 
    return collectables;
 }

export const  placeCollectableGraphics = (scene, collectables) => {
    collectables.forEach(collectable => {
       const { obj : collectableObject } = collectable;
       collectableObject.position.z = collectable.x;
       collectableObject.position.x = collectable.y;
       scene.add(collectableObject);
    });
 }

 export const doCollectablesMove = (collectables, deltaTime) => {
    //Make our collectables spin
    collectables.forEach(collectable => {
    const { obj : collectableObject } = collectable;
    collectableObject.rotation.x += 2 * deltaTime/1000;
    collectableObject.rotation.y += 2 * deltaTime/1000;
    });  
 }

 export const processCollectableCollisions = (x, y,collectables,scene) => {
    collectables.forEach(function(collectable,index){
       if(collectable.x == x && collectable.y == y){
          collectable.action(); //Run the object's event
          scene.remove(collectable.obj); //Remove graphics from scene
          collectables.splice(index,1); //Remove collectable from list
       }
    });
 }
import * as THREE from "three";

export const createCollectiblesList = () => {

    const collectableGeometry = new THREE.BoxGeometry( 0.25, 0.25, 0.25 );
    const collectableMaterial = new THREE.MeshStandardMaterial( {color: 0x000088} );

    var collectables = [];
    collectables.push(
       {
          x:0,
          y:1,
          action:() => {alert("You picked up a collectable");},
          obj: new THREE.Mesh(collectableGeometry, collectableMaterial)

       });
 
    collectables.push(
       {
          x:1,
          y:0,
          action:() => {alert("You picked up a different collectable");},
          obj: new THREE.Mesh(collectableGeometry, collectableMaterial)
       });
 
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
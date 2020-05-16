import * as THREE from "three";

export const NORTH = 100;
export const EAST = 101;
export const WEST = 102;
export const SOUTH = 103;

export const getMazeGridObj = (scene) => {
   const mazeGrid = createMazeGrid();
    placeWallGraphics(scene, mazeGrid);
    return mazeGrid;
}

export const createMazeGrid = () => {
    function MazeCell(northWall, eastWall, southWall, westWall) {
        this.northWall = northWall;
        this.eastWall = eastWall;
        this.southWall = southWall;
        this.westWall = westWall;
      }
      const mazeGrid = [Array(3), Array(3), Array(3)];
      mazeGrid[0][0] = new MazeCell(true, false, false, true);
      mazeGrid[0][1] = new MazeCell(true, false, true, false);
      mazeGrid[0][2] = new MazeCell(true, true, false, false);
      mazeGrid[1][0] = new MazeCell(false, true, false, true);
      mazeGrid[1][1] = new MazeCell(true,true,true,true);
      mazeGrid[1][2] = new MazeCell(false,true,false,true);
      mazeGrid[2][0] = new MazeCell(false, false, true, true);
      mazeGrid[2][1] = new MazeCell(true,false,true,false);
      mazeGrid[2][2] = new MazeCell(false,true,true,false);
      return mazeGrid;
}

export const placeWallGraphics = (scene, mazeGrid) => {
    const wallGeometry = new THREE.PlaneGeometry( 1, 0.5 );
    const wallMaterial = new THREE.MeshStandardMaterial( );
    const placeWall = (x,y,direction) => {
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
 

}

export const validMove = (mazeGrid, x, y, direction) => {
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
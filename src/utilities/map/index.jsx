import * as THREE from "three";
import React from 'react';

export const NORTH = 100;
export const EAST = 101;
export const WEST = 102;
export const SOUTH = 103;

export const getMazeGridObj = (scene) => {
 //  const mazeGrid = createMazeGrid();
 const mazeGrid = createMazeGridPims(20,20);
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

export const createMazeGridPims = (width, height) => {
   //  console.log("calling createMazeGridPims");
     function MazeCell(northWall, eastWall, southWall, westWall) {
        this.northWall = northWall;
        this.eastWall = eastWall;
        this.southWall = southWall;
        this.westWall = westWall;
      }
      function checkWall(wallListIdx) {
   //      console.log("mazeGrid = ", mazeGrid);
        let cellToCheck = {};
  //      console.log("wallList[" + wallListIdx + "] = ", wallList[wallListIdx]);
        switch(wallList[wallListIdx]['dir']) {
           case NORTH :
              cellToCheck = {x: wallList[wallListIdx].x, z:wallList[wallListIdx].z+1};
              break;
           case SOUTH : 
              cellToCheck = {x: wallList[wallListIdx].x, z:wallList[wallListIdx].z-1};
              break;
           case EAST :
              cellToCheck = {x: wallList[wallListIdx].x+1, z:wallList[wallListIdx].z};
              break;
           case WEST :
           default :
              cellToCheck = {x: wallList[wallListIdx].x-1, z:wallList[wallListIdx].z};
              break;
        }
   //     console.log("cell to check = ", cellToCheck);
        if (((cellToCheck.x < 0)||(cellToCheck.x >= width))||((cellToCheck.z < 0)||(cellToCheck.z >= height))) {
    //       console.log("OUT OF BOUNDS");
           wallList.splice(wallListIdx, 1);
           return;
        }
        if (visitedCells.some((cell) => ((cell.x === cellToCheck.x) && (cell.z === cellToCheck.z)))) {
     //      console.log("VISITED ALREADY");
           wallList.splice(wallListIdx, 1);
           return;
        } else {
           if (wallList[wallListIdx].dir === EAST) 
           {
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: SOUTH});
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: EAST});
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: WEST});
              mazeGrid[cellToCheck.x][cellToCheck.z].northWall = false;
              mazeGrid[wallList[wallListIdx].x][wallList[wallListIdx].z].southWall = false;
           }
           if (wallList[wallListIdx].dir === WEST) {
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: NORTH});
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: EAST});
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: WEST});
              mazeGrid[cellToCheck.x][cellToCheck.z].southWall = false;
              mazeGrid[wallList[wallListIdx].x][wallList[wallListIdx].z].northWall = false;
           }
           if (wallList[wallListIdx].dir === SOUTH) 
           {
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: NORTH});
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: SOUTH});
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: WEST});
              mazeGrid[cellToCheck.x][cellToCheck.z].eastWall = false;
              mazeGrid[wallList[wallListIdx].x][wallList[wallListIdx].z].westWall = false;
           }
           if (wallList[wallListIdx].dir === NORTH) {
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: NORTH});
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: SOUTH});
              wallList.push({x:cellToCheck.x, z:cellToCheck.z, dir: EAST});
              mazeGrid[cellToCheck.x][cellToCheck.z].westWall = false;
              mazeGrid[wallList[wallListIdx].x][wallList[wallListIdx].z].eastWall = false;
           }
           visitedCells.push({x:cellToCheck.x, z:cellToCheck.z});
           wallList.splice(wallListIdx, 1);
   //        console.log("mazeGrid = ", mazeGrid);
           return mazeGrid;
        }
  
      }
      //const mazeGrid = [Array(width), Array(height)];
      const mazeGrid = [];
      const visitedCells = [];
      for (let i=0; i< width; i++) {
        mazeGrid.push(Array(height));
        visitedCells.push(Array(height));
      }
      const wallList = [];
      for (let i = 0; i<width; i++) {
         for (let j = 0; j< height; j++) {
           mazeGrid[i][j] = new MazeCell(true,true,true,true);
           visitedCells[i][j] = false;
         }
      }
  //    console.log("initial MazeGrid = ", mazeGrid);
      const startX = Math.floor(Math.random() * width);
      const startZ = Math.floor(Math.random() * height);
      visitedCells[startX][startZ] = true;
      wallList.push({x:startX, z:startZ, dir: NORTH});
      wallList.push({x:startX, z:startZ, dir: SOUTH});
      wallList.push({x:startX, z:startZ, dir: EAST});
      wallList.push({x:startX, z:startZ, dir: WEST});
  
      do {
   //      console.log("********************************");
    //     console.log("wallList.length = ", wallList.length);
         let currentWallListIdx = Math.floor(Math.random() * (wallList.length - 1));
         checkWall(currentWallListIdx);
      } while ((wallList.length > 0));
      console.log("mazeGrid = ", mazeGrid);
      return mazeGrid;
  }

export const displayMazeGrid = (mazeGrid, playerObj, collectables) => {
   const { player : {gridX, gridY, direction} } = playerObj;
   const getCellContent = (rowIdx, cellIdx) => {
      let cellContent;
      if ((gridX === rowIdx)&&(gridY === cellIdx)) {
         switch(direction) {
            case NORTH :
               cellContent = '\u2191';
               break;
            case SOUTH :
               cellContent = '\u2193';
               break;
            case EAST :
               cellContent = '\u2192';
               break;
            case WEST :
               cellContent = '\u2190';
               break;
            default :
               break;
         }
      } else {
         collectables.forEach(collectable => {
            if ((collectable.x === rowIdx)&&(collectable.y === cellIdx)) {
               cellContent = '\u25A0';
            }
         });
      }
      return <span>{cellContent}</span>
   }
   const getCellClasses = (cell) => {
      let cellClasses = ""
      if (cell.eastWall) {
         cellClasses += "east_wall"
      }
      if (cell.westWall) {
         cellClasses += " west_wall"
      }
      if (cell.northWall) {
         cellClasses += " north_wall"
      }
      if (cell.southWall) {
         cellClasses += " south_wall"
      }
      return cellClasses;
   };
   const displayMazeGridColumns = (row, rowIdx) => row.map((cell, cellIdx) => <div key={cellIdx} className={`map_cell ${getCellClasses(cell)}`}>{getCellContent(rowIdx, cellIdx)}</div>);
   const displayMazeGridRows = mazeGrid => mazeGrid.map((row, rowIdx) => <div key={rowIdx} className={'map_row'}>{displayMazeGridColumns(row, rowIdx)}</div>);
   return <div className={'map_container'}>{displayMazeGridRows(mazeGrid)}</div>
   
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
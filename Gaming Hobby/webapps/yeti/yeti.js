// --------------------------------------------------------------------------
// 
// BUGS (fixes):
// 
//  procedural generation errors:
//
// 1. exit can be placed on player or wall
//      (check and exclude player coords)
// 
// 2. walls can block player in 
//      (avoid placing walls on diagonal)
//      (only allow walls in cardinal directions from other walls)
// 
// --------------------------------------------------------------------------

//has game begun?
let begin = false;

//level
let level = {
  w : 16,
  h : 12,
  entx : 1,
  enty : 6,
  exitx : 0,
  exity : 0,
};

//player
let player = {
  x : 1,
  y : 1,
};

//walls
let wall = {
  x : [],
  y : [],
};

//for browser input detection
$(document).keydown(function(key) {
  if (key.which == 37){
    // console.log("left key pressed!");
    move("l");
  };

  if (key.which == 38){
    // console.log("up key pressed!");
    move("u");
  };

  if (key.which == 39){
    // console.log("right key pressed!");
    move("r");
  };

  if (key.which == 40){
    // console.log("down key pressed!");
    move("d");
  };

});


//when new game is pressed
$(".newgame").on("click", function(){
  start();
});

//when quit is pressed
$(".quit").on("click", function(){
  end();
});

function start(){
  clearLevel();
  player.x = level.entx;
  player.y = level.enty;
  drawLevel();
  begin = true;
};

function end(){
  clearLevel();
  begin = false;
};

function drawLevel(){
  $(".square").addClass("green");
  addWall();
  addPlr();
  addExt();
  checkObst(level.exitx, level.exity, wall);
};

function clearLevel(){
  remPlr();
  remExt();
  remWall();
  $(".square").removeClass("green");
};

//randomly generate 'num' of walls
//!add check for diagonal so only generate in cardinal directions
function genWalls(num){
  for(i = 0; i < num; i++){
    let y = Math.floor(Math.random() * (level.h) + 1);
    // console.log(genY);
    wall.y.push(y);
    let x = Math.floor(Math.random() * (level.w) + 1);
    // console.log(genX);
    wall.x.push(x);    
  };
};


//generate and print exit
function addExt(){

  let x = 0;
  let y = 0;

  for(k = 0; k < 1; ){
    //gen exit location
    x = genCoord(level.w);
    y = genCoord(level.h);
    
    //check for obstruction
    for(i = 0; i < 1;){
      if(checkObst(x, y, wall) == false ){
        level.exity = y;
        level.exitx = x;
        $("#"+ level.exity + "-" + level.exitx).text("E");
        return;
      };
    };
  };
};


//testing gen and check
function testing(){

  //generate coord
  let x = genCoord(level.w);
  let y = genCoord(level.h);

  //check for obstruction
  for(i = 0; i < 1;){
    if(checkObst(x, y, wall) == false ){
      i = 1;
    };
  };

};

//generates random coord within given bound
function genCoord(bound){
  let coord = Math.floor(Math.random() * (bound) + 1);
  return coord;
};

//checks given coords 'x' and 'y' against given 'bound' array
//returns true if no object found at coords
//returns false if coords are empty
function checkObst(x, y, bound){
  
  //object to check for obstruction
  let obj = bound;
  let cx = x;
  let cy = y;

  //check each x for match
  for(i = 0; i < obj.x.length; i++){
    //if matching x found, check y
    if(cx == obj.x[i]){
      let check = obj.y[i];
      //if obj found at x and y coords
      if (cy == check){
        return true;
      //if x and y coords are empty (no object found), return false
      } else { 
        return false;
      };
    };
  };
};

function remExt(){
  $("#"+ level.exity + "-" + level.exitx).text("");
  level.exitx = 0;
  level.exity = 0;
};

//print player
function addPlr(){
  $("#"+ player.y + "-" + player.x).text("@");
};

function remPlr(){
  $("#"+ player.y + "-" + player.x).text("");
};


function addWall(){
  //generate walls
  genWalls(1000);
  //print walls
  for(i = 0; i < wall.x.length; i++){
    $("#"+ wall.y[i] + "-" + wall.x[i]).text("[]");
  };
};

function remWall(){
  for(i = 0; i < wall.x.length; i++){
    $("#"+ wall.y[i] + "-" + wall.x[i]).text("");
  };
  wall.y = [];
  wall.x = [];
};

//engine for player movement
function up(){
  const nxt = player.y - 1;
  return nxt;
};
function down(){
  const nxt = player.y + 1;
  return nxt;
};
function left(){
  const nxt = player.x - 1;
  return nxt;
};
function right(){
  const nxt = player.x + 1;
  return nxt;
};

//call move
function move(dir){
  if (begin == true){

    if (checkWall(dir) == false){
      remPlr();
      if(dir == "u"){
        if (player.y != 1){
          const nxt = up();
          player.y = nxt;
        };
      } else if(dir == "d"){
        if (player.y != level.h){
          const nxt = down();
          player.y = nxt;
        };
      } else if(dir == "l"){
        if (player.x != 1){
          const nxt = left();
          player.x = nxt;
        };
      } else if(dir == "r"){
        if (player.x != level.w){
          const nxt = right();
          player.x = nxt;
        };
      };
      addPlr();
      
      if(checkExt()){
        end();
      };

    };
  };
};


function checkExt(){
  if (level.exitx == player.x && level.exity == player.y){
    console.log("exit!");
    return true;
  } else {
    return false;
  };
};


//recieve direction of travel
//compare to all walls
//return true if space empty, false if occupied
function checkWall(dir){

  if (dir == "u"){
    if (checkUp()){
      return true;
    } else {
      return false;
    };
  };

  if (dir == "d"){
    if (checkDn()){
      return true;
    } else {
      return false;
    };
  };

  if (dir == "l"){
    if (checkLe()){
      return true;
    } else {
      return false;
    };
  };

  if (dir == "r"){
    if (checkRi()){
      return true;
    } else {
      return false;
    };
  };

};


//collision detection for walls
function checkUp(){
  for(i = 0; i < wall.y.length; i++){
    if(player.x == wall.x[i]){
      let check = wall.y[i];
      if(player.y == check + 1){
        console.log("wall above!");
        return true;
      };
    };
  };
};

function checkDn(){
  for(i = 0; i < wall.y.length; i++){
    if(player.x == wall.x[i]){
      let check = wall.y[i];
      if(player.y == check - 1){
        console.log("wall below!");
        return true;
      };
    };
  };
};

function checkLe(){
  for(i = 0; i < wall.x.length; i++){
    if(player.y == wall.y[i]){
      let check = wall.x[i];
      if(player.x == check + 1){
        console.log("wall left!");
        return true;
      };
    };
  };
};

function checkRi(){
  for(i = 0; i < wall.x.length; i++){
    if(player.y == wall.y[i]){
      let check = wall.x[i];
      if(player.x == check - 1){
        console.log("wall right!");
        return true;
      };
    };
  };
};
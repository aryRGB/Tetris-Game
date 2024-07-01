//making the squares
const gamescreen= document.getElementById("grid");
for(let i=0;i<210;i++){
    let box= document.createElement("div");
    box.className="square";        
    gamescreen.appendChild(box);
    if(i>=200){
        box.classList.add("end");
        box.classList.add("originalend")
    }
    if(i%10==0){
        box.classList.add("leftwall")
    }
    else if((i+1)%10==0){
        box.classList.add("rightwall")
    }
}
let sqarray=Array.from(document.querySelectorAll(".square"));

//creating tetrominoes

const I=[
    [1,11,21,31],
    [10,11,12,13],
    [1,11,21,31],
    [10,11,12,13]
]
const L=[
    [1,11,21,22],
    [10,11,12,20],
    [0,1,11,21],
    [2,10,11,12]
]
const J=[
    [1,2,11,21],
    [10,11,12,22],
    [1,11,21,20],
    [10,20,21,22]
]
const T=[
    [10,11,12,21],
    [1,10,11,21],
    [1,10,11,12],
    [1,11,12,21]
]
const S=[
    [0,1,11,12],
    [2,11,12,21],
    [0,1,11,12],
    [2,11,12,21]
]
const Z=[
    [11,12,20,21],
    [0,10,11,21],
    [11,12,20,21],
    [0,10,11,21]
]
const O=[
    [0,1,10,11],
    [0,1,10,11],
    [0,1,10,11],
    [0,1,10,11]
]

const tetrominoes=[I,J,L,O,S,T,Z];

//randomly select a tetromino
let rnd=Math.random();
let tStyle=Math.floor(rnd*7);
let frnd=Math.random()
let tConfig=Math.floor(rnd*4);
let currentTetromino=tetrominoes[tStyle][tConfig];
let currentPosition=5;

//next tetromino
rnd=Math.random();
let nexttStyle=Math.floor(rnd*7);
frnd=Math.random();
let nexttConfig=Math.floor(rnd*4);

//next display and refreshnext
const next=document.getElementById("next-tetromino")
for(let i=0;i<36;i++){
    let newsquare=document.createElement("div");
    newsquare.className="next-square"
    next.appendChild(newsquare)
}
let nxtArray=Array.from(document.querySelectorAll(".next-square"))
function refreshNext(){
    nxtArray.forEach(element =>{
        if(element.classList.contains("selected")){
            element.classList.remove("selected")
        }
    })
    switch (nexttStyle) {
        case 0:
            nxtArray[13].classList.add("selected")
            nxtArray[14].classList.add("selected")
            nxtArray[15].classList.add("selected")
            nxtArray[16].classList.add("selected")
            break;
        case 1:
            nxtArray[9].classList.add("selected")
            nxtArray[15].classList.add("selected")
            nxtArray[21].classList.add("selected")
            nxtArray[20].classList.add("selected")
            break;
        case 2:
            nxtArray[8].classList.add("selected")
            nxtArray[14].classList.add("selected")
            nxtArray[20].classList.add("selected")
            nxtArray[21].classList.add("selected")
            break;
        case 3:
            nxtArray[14].classList.add("selected")
            nxtArray[15].classList.add("selected")
            nxtArray[20].classList.add("selected")
            nxtArray[21].classList.add("selected")
            break;
        case 4:
            nxtArray[14].classList.add("selected")
            nxtArray[15].classList.add("selected")
            nxtArray[21].classList.add("selected")
            nxtArray[22].classList.add("selected")
            break;
        case 5:
            nxtArray[14].classList.add("selected")
            nxtArray[15].classList.add("selected")
            nxtArray[16].classList.add("selected")
            nxtArray[21].classList.add("selected")
            break;
        case 6:
            nxtArray[15].classList.add("selected")
            nxtArray[16].classList.add("selected")
            nxtArray[20].classList.add("selected")
            nxtArray[21].classList.add("selected")
            break;
        default:
            break;
    }
}

//main functions
const tetrominoColors=["blue","green","red","yellow","cyan","purple","orange"]
function color(){
    currentTetromino.forEach(element => {
        sqarray[currentPosition+element].classList.add("colored")
        sqarray[currentPosition+element].style.backgroundColor=tetrominoColors[tStyle]
    });
}

function uncolor(){
    currentTetromino.forEach(element => {
        sqarray[currentPosition+element].classList.remove("colored")
        sqarray[currentPosition+element].style.backgroundColor="transparent"
    });
}

//make the block fall
function down(){
    uncolor()
    currentPosition +=10;
    color()
    stop()
}

//stopping the block when it reaches the end
function isAtEnd(element){
    return sqarray[currentPosition+ element+ 10].classList.contains("end");
}
function makeEnd(element){
    sqarray[currentPosition+ element].classList.add("end")
}
function stop(){
    if(currentTetromino.some(blockPosition => isAtEnd(blockPosition))){
        currentTetromino.forEach(blockPosition => makeEnd(blockPosition))
        //start new tetromino
        tStyle=nexttStyle
        tConfig=nexttConfig
        currentTetromino=tetrominoes[tStyle][tConfig]
        
        rnd=Math.random();
        nexttStyle=Math.floor(rnd*7);
        frnd=Math.random();
        nexttConfig=Math.floor(rnd*4);

        refreshNext()
        score()
        currentPosition=5
        color()
        gameOver()
    }
}

//
function left(){
    if(!currentTetromino.some(element=>{
        let isFixed=sqarray[element+currentPosition-1].classList.contains("end")      
        let isspace=((currentPosition+element)%10==0)
        return isspace || isFixed;
    })){
        uncolor()
        currentPosition-=1
        color()
    }
}

function right(){
    if(!currentTetromino.some(element=>{
        let isFixed=sqarray[element+currentPosition+1].classList.contains("end")
        let isspace=((currentPosition+element+1)%10==0)
        return isspace || isFixed;
    })){
        uncolor()
        currentPosition+=1
        color()
    }
}

function rotate(){
    uncolor()
    let newtConfig;
    if(tConfig==3){
        newtConfig=0
    }
    else{
        newtConfig=tConfig+1
    }
    currentTetromino=tetrominoes[tStyle][newtConfig]
    let clashingleft=currentTetromino.some(element =>{
        return sqarray[currentPosition+element].classList.contains("leftwall")
    })
    let clashingright=currentTetromino.some(element =>{
        return sqarray[currentPosition+element].classList.contains("rightwall")
    })
    if(currentTetromino.some(element => {
        let isFixed=sqarray[currentPosition+element].classList.contains("end")
        return isFixed
    })){
        currentTetromino=tetrominoes[tStyle][tConfig]
        color()
    }
    else if(clashingleft && clashingright){
        currentTetromino=tetrominoes[tStyle][tConfig]
        color()
    }
    else{
        tConfig=newtConfig
        color()
    }

}
document.addEventListener('keydown', (e)=>{
    if (e.keyCode==37){
        left()
    }
    else if(e.keyCode==39){
        right()
    }
    else if(e.keyCode==40){
        down()
    }
    else if(e.keyCode==38){
        rotate()
    }
})

//start button and score
const scoreDisplay=document.getElementById("current-score");
const start=document.getElementById("start-button");
const gameOverDisplay=document.getElementById("gameover")
let currentScore=0
let intervalId =0
start.addEventListener("click", () => {
    if(intervalId){
        clearInterval(intervalId)
        intervalId=0
    }
    else{
        color()
        intervalId=setInterval(down, 1000)
        refreshNext()
    }
})

function score(){
    for (let i = 0; i < 199; i+=10) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  
        if(row.every(element => sqarray[element].classList.contains("end"))) {
          currentScore +=100
          scoreDisplay.innerHTML = currentScore;
          row.forEach(element => {
            sqarray[element].classList.remove("end")
            sqarray[element].classList.remove("colored")
            sqarray[element].style.backgroundColor ='transparent'
          })
          const Removed = sqarray.splice(i, 10)
          
          sqarray = Removed.concat(sqarray)
          sqarray.forEach(element => grid.appendChild(element))
        }
    }
    
}
scoreDisplay.innerHTML=currentScore

function gameOver(){
    if(currentTetromino.some(element=> sqarray[currentPosition+element+10].classList.contains("end"))){
        gameOverDisplay.innerHTML= "Game Over"
        clearInterval(intervalId)
    } 
}

//get the canvas, canvas context, and dpi
let canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext('2d'),
    dpi = window.devicePixelRatio;

var bodyWidth =  document.getElementsByTagName("BODY")[0].offsetWidth;
var bodyHeight = document.getElementsByTagName("BODY")[0].offsetHeight;

//Save the initial position
var origin = {
    x: bodyWidth/2,
    y: bodyHeight/2
}

//Save the actual position
var actualPosition;


//Array that contains the 8 possible directions in which the point can move
var directions = [ 0.0,  Math.PI/4, Math.PI/2, (3*Math.PI)/4, Math.PI,  (5*Math.PI)/4,  (3*Math.PI)/2,  (7*Math.PI)/4 ];

//Actual direction of the point 
var ndir = 0;

//This counter controls if the point must return to its original position or go in one of the other eight
var counter = 0;

//object to draw -> Initial point
var myRect = { 
    x: bodyWidth/2,
    y: bodyHeight/2,
    w: 15,
    h: 15
}

var opacity = 0;

function fix_dpi() {

    //create a style object that returns width and height
    let style = {
      height() {
        return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
      },
      width() {
        return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
      }
    }
  
    //set the correct attributes for a crystal clear image!
    canvas.setAttribute('width', style.width() * dpi);
    canvas.setAttribute('height', style.height() * dpi);
  
}

//Move in any of the eight directions a distance not longer than the 80% of the page width
function move(){
    var n = Math.floor(Math.random()*directions.length);
    ndir = n;
    var theta = directions[n];
    var x = Math.sin(theta) * ((bodyHeight/2)*0.60);
    var y = Math.cos(theta) * ((bodyHeight/2)*0.60);
    myRect.x = myRect.x + x;
    myRect.y = myRect.y + y;
}

//Error induced
function moveError(dir){
    var n = Math.floor(Math.random()*2);
    var direct1 = directions[dir];
    var direct2 = directions[(dir + 4)%directions.length];
    var options = [direct1, direct2];
    var theta = options[n];
    var x = Math.sin(theta) * ((bodyHeight/2)*0.10);
    var y = Math.cos(theta) * ((bodyHeight/2)*0.10);
    myRect.x = myRect.x + x;
    myRect.y = myRect.y + y;
}

function draw() {

  //call the dpi fix every time 
  //canvas is redrawn
  fix_dpi();


  //Draw
  ctx.fillRect(myRect.x, myRect.y, myRect.w, myRect.h);
  
}

function probability(n){
    if(n < 0 || n > 100)
    {
        n = 50; //Standard probability to induce error.
    }
    n = n/10;
    return Math.random() < n;
}

function initGame(error){
    //Add the listener to make the point move when the pointer is over it
    canvas.addEventListener('mousemove', e => {
        if ((e.clientX>=myRect.x)&(e.clientX<=myRect.x+myRect.w)&(e.clientY>=myRect.y)&(e.clientY<=myRect.y+myRect.h)){
            
            if(counter == 0){
                move();
                counter = 1;
            }else{
                if(probability(error) && counter == 1){
                    moveError(ndir);
                    counter = 2;
                }else if(counter == 2){
                    myRect.x = origin.x;
                    myRect.y = origin.y;
                    counter = 0;
                }
            }
        }
        requestAnimationFrame(draw);
    })

    requestAnimationFrame(draw);
}


function initSetup(){
   document.getElementById("manual").className = "row row-cols-1 row-cols-md-3 g-3 divExplanationOut mx-5 shadow p-3 mb-5 bg-white rounded";
   setTimeout(function(){
        document.getElementById('manual').remove();
        document.getElementById('data_error').className = "row g-3 divDataIn w-25 shadow p-3 mb-5 mx-5 bg-white rounded"; 
  }, 3000)

}

function initGame_Setup(){
    var inputs = document.getElementById("data_error").elements;
    var error = inputs["error_data_value"].value;
    document.getElementById("data_error").className = "row g-3 divDataOut w-25 shadow p-3 mb-5 mx-5 bg-white rounded";
    setTimeout(function(){
         document.getElementById('data_error').remove(); 
         document.getElementById('myCanvas').style.display = 'block';
         document.getElementById('gameBar').className = "navbar navbar-custom position-absolute border-bottom h-25 w-100";
         initGame(error);
   }, 3000)
 
 }

function doWork(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/hola", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "value": "value"
    }));
}

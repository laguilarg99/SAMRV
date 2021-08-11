// //Save the relative size of the point
// //0.4º Diameter
// var SizePoint;

// //Save the maximun space in which a point can move
// //30º Straight head
// var SpaceSizeMax;

// //Save the maximun distance that a point can move
// //25º Max
// var SizeMaxM;

// //Save the minimun distance that a point can move
// //10º Min
// var SizeMinM;

// //Maximun moving distance to make the user error
// //5º Displacing the target
// var SizeErrorMax;

// //Minimun moving distance to make the user error
// //3º Displacing the target
// var SizeErrorMin;

// //Minimun Distance to consider the movement correct
// //3º in vertical and horizontal directions
// var SizeCorrect;

// //Eye to Screen distance in mm
// var GazeScreen = 0;

// GazeScreen = prompt("Enter the aprox. distance between you and the monitor in mm:");

// //Convert angles from degrees to radians and viceversa according to the parameter:
// // 0 = degrees -> radians
// // 1 = radians -> degrees
// function convert(angle, type){
//     var result = 0.0;

//     switch (type){
//         case 0:
//             result = angle*(Math.PI/180); //radians
//             break;
//         case 1:
//             result = angle*(180/Math.PI); //degrees
//             break;
//         default:
//             break;
//     }

//     return result;
// }

// function initValues(){
    
//     var point = convert(0.4,0),
//         radius = convert(30, 0),
    
//         MaxMove = convert(25, 0),
//         MinMove = convert(10,0),
//         MaxError = convert(5,0),
//         MinError = convert(3,0),
//         correct = MinError;
        
//     //Point size
//     //0.4º de diametro
//     TamPunto = GazeScreen * Math.tan(point);
    
//     //Area where the point appears
//     //30º max circle - Min: Determined by a 45º parabola
//     SpaceSizeMax = GazeScreen * Math.tan(radius);

//     //Movement of the point
//     //10-25º in any direction
//     SizeMaxM = GazeScreen * Math.tan(MaxMove);
//     SizeMinM = GazeScreen * Math.tan(MinMove);

//     //Error que pueden sufrir los puntos de forma inducida
//     //3-5º en cualquier dirección
//     SizeErrorMax = GazeScreen * Math.tan(MaxError);
//     SizeErrorMin = GazeScreen * Math.tan(MinError);

//     //Check that the value is correct <3º Vertical and Horizontal
//     TamCorrect = GazeScreen * Math.tan(correct);
// }


// //get the canvas, canvas context, and dpi
// let canvas = document.getElementById('myCanvas'),
//     ctx = canvas.getContext('2d'),
//     dpi = window.devicePixelRatio;
// function fix_dpi() {

// //create a style object that returns width and height
//   let style = {
//     height() {
//       return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
//     },
//     width() {
//       return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
//     }
//   }
// //set the correct attributes for a crystal clear image!
//   canvas.setAttribute('width', style.width() * dpi);
//   canvas.setAttribute('height', style.height() * dpi);

// }

// var bodyWidth =  document.getElementsByTagName("BODY")[0].offsetWidth;
// var bodyHeight = document.getElementsByTagName("BODY")[0].offsetHeight;

// //Save the initial position
// var origin = {
//     x: bodyWidth/2,
//     y: bodyHeight/2
// }

// //Save the actual position
// var actualPosition;

// //In order to calculate when an error is induce
// //we calculate the probability of a complex spike after a sacade.
// //We use a 65% probability based on other experiments results so 
// function probability(n){
//     return Math.random() < n;
// }

// //Array that contains the 8 possible directions in which the point can move
// var directions = [ 0.0,  Math.PI/4, Math.PI/2, (3*Math.PI)/4, Math.PI,  (5*Math.PI)/4,  (3*Math.PI)/2,  (7*Math.PI)/4 ];

// //Actual direction of the point 
// var ndir = 0;

// //This counter controls if the point must return to its original position or go in one of the other eight
// var counter = 0;

// //object to draw -> Initial point
// var myRect = { 
//     x: bodyWidth/2,
//     y: bodyHeight/2,
//     w: 10,
//     h: 10
// }

// function move(){
//     var n = Math.floor(Math.random()*directions.length);
//     ndir = n;
//     var theta = directions[n];
//     var positionRange = Math.random() * (SizeMaxM - SizeMinM) + SizeMinM;
//     var x = Math.sin(theta) * positionRange;
//     var y = Math.cos(theta) * positionRange;
//     myRect.x = myRect.x + x;
//     myRect.y = myRect.y + y;
// }

// function moveError(dir){
//     var n = Math.floor(Math.random()*2);
//     var direct1 = directions[dir];
//     var direct2 = directions[(dir + 4)%directions.length];
//     var options = [direct1, direct2];
//     var theta = options[n];
//     var positionRange =  Math.random() * (SizeErrorMax - SizeErrorMin) + SizeErrorMin;
//     var x = Math.sin(theta) * positionRange;
//     var y = Math.cos(theta) * positionRange;
//     myRect.x = myRect.x + x;
//     myRect.y = myRect.y + y;
// }

// function draw() {

//   //call the dpi fix every time 
//   //canvas is redrawn
//   fix_dpi();

//   //Draw
//   ctx.fillRect(myRect.x, myRect.y, myRect.w, myRect.h);
// }

// initValues();

// //Add the listener to make the point move when the pointer is over it
// canvas.addEventListener('mousemove', e => {
//     if ((e.clientX>=myRect.x)&(e.clientX<=myRect.x+myRect.w)&(e.clientY>=myRect.y)&(e.clientY<=myRect.y+myRect.h)){
        
//         if(counter == 0){
//             move();
//             counter = 1;
//         }else{
//             if(probability(0.65) && counter == 1){
//                 moveError(ndir);
//                 counter = 2;
//             }else if(counter == 2){
//                 myRect.x = origin.x;
//                 myRect.y = origin.y;
//                 counter = 0;
//             }
//         }
//     }
//     requestAnimationFrame(draw);
// })

// requestAnimationFrame(draw);

function doWork(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/hola", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        "value": "value"
    }));
}
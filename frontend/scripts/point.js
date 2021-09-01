
//get the canvas, canvas context, and dpi
let canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext('2d'),
    dpi = 1.0;

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

//Current mouse velocity
var velocity = 0;

//variable to save all the velocity values
var velocity_arr = [];

//variable to save the time taken to end a try
var time = [];

//variable to save the begining of a try
var start = 0;

//variable to save the end of a try
var end = 0;

//variable to save the actual position the pointer
var mouse_pos = [];

//variable to save the actual position of the target
var pixel_pos = [];
pixel_pos.push([origin.x, origin.y]);

//variable to know if It is necessary or not to draw the point
var is_over_velocity = false;

//Variable to control how many times the move error function is called
var counter_moveError = 0;

//Variable to control how many times the point dissapear
var counter_dissapear = 0;

//Frequency to calculate the velocity 10ms
var time_out = 10;

function diff (num1, num2) {
    if (num1 > num2) {
      return (num1 - num2);
    } else {
      return (num2 - num1);
    }
  };

  
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
    var x = Math.sin(directions[dir]) * ((bodyHeight/2)*0.10);
    var y = Math.cos(directions[dir]) * ((bodyHeight/2)*0.10);
    myRect.x = myRect.x + x;
    myRect.y = myRect.y + y;
}

function draw() {

  //call the dpi fix every time 
  //canvas is redrawn
  fix_dpi();


  //Draw
  ctx.fillRect(myRect.x, myRect.y, myRect.w, myRect.h);

  //Draw exit information
  var text = "Press f to exit...";
  ctx.font = "20px Arial";
  ctx.fillText(text, bodyWidth-200, bodyHeight-30);

    
}


function draw_empty() {

    //call the dpi fix every time 
    //canvas is redrawn
    fix_dpi();
    
    //Draw exit information
    var text = "Press f to exit...";
    ctx.font = "20px Arial";
    ctx.fillText(text, bodyWidth-200, bodyHeight-30);
      
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
    makeGraph();
    
    //Add the listener to end the game and sent data to backend
    document.addEventListener('keydown', function(event) {
        if(event.code == "KeyF"){
            velocity_arr.push(time);
            velocity_arr.push(pixel_pos);
            velocity_arr.push(mouse_pos);
            var data_end = JSON.stringify(velocity_arr);
            
            sentData(data_end);

            document.getElementById('myCanvas').className = "opacityOut";
            document.getElementById('gameBar').className = "opacityOut navbar navbar-custom position-absolute h-20 w-100";  
            
            setTimeout(function(){
                document.getElementById('myCanvas').remove()
                document.getElementById('gameBar').remove()
                window.alert("Succesfully finished!")
                location.reload();
            }, 2500)
          
            
        }
    });

    
    //Add the listener to make the point move when the pointer is over it
    canvas.addEventListener('mousemove', e => {    
        
        mouse_pos.push([e.clientX, e.clientY]);

  
        if(pixel_pos[pixel_pos.length - 1][0] != myRect.x || pixel_pos[pixel_pos.length - 1][1] != myRect.y)
            pixel_pos.push([myRect.x, myRect.y]);

        if(counter == 1){
            var distance_origin = function(){
                var deltaX = diff(e.clientX, origin.x);
                var deltaY = diff(e.clientY, origin.y);
                let dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

                return dist;
            }

            var dist = distance_origin();

            if(dist >= ((bodyHeight/2)*0.10) && counter_dissapear == 0){
                is_over_velocity = true;
                if(probability(error) && counter_moveError == 0){
                    moveError(ndir);
                    counter_moveError = 1;
                }
                counter_dissapear = 1;
            }

            if(is_over_velocity){
                setTimeout(function(){
                    is_over_velocity = false;
                },300);
                setTimeout(function(){
                    document.getElementById('body').style.cursor = 'default';
                },450);
            }
        }

        if ((e.clientX>=myRect.x)&(e.clientX<=myRect.x+myRect.w)&(e.clientY>=myRect.y)&(e.clientY<=myRect.y+myRect.h)){
            if(counter == 0){
                move();
                start = (new Date()).getTime();
                counter = 1;
            }else if(counter == 1){
                counter = 2;
                counter_moveError = 0;
                counter_dissapear = 0;
            }else if(counter == 2){
                end = (new Date().getTime());
                var total_time = end -start;
                time.push(total_time);
                myRect.x = origin.x;
                myRect.y = origin.y;
                counter = 0;
            }
        }
        if(!is_over_velocity)
            requestAnimationFrame(draw);
        if(is_over_velocity){
            requestAnimationFrame(draw_empty);
            document.getElementById('body').style.cursor = 'none';
        }
    })
    if(!is_over_velocity)
        requestAnimationFrame(draw);
    if(is_over_velocity){
        requestAnimationFrame(draw_empty);
        document.getElementById('body').style.cursor = 'none';
    }
}

function makeGraph() {
    var e, l = -1, r = -1, t = 0, a = [];
    $("html").mousemove(function(i) {
        var o = i.pageX
          , e = i.pageY;
        -1 < l && (t += Math.max(Math.abs(o - l), Math.abs(e - r))),
        l = o,
        r = e
    });
    var h = function() {
        var i = (new Date).getTime();
        if (e && e != i) {
            var o = Math.round(t / (i - e) * 1e3);
            document.getElementById("velocity").innerHTML = o + "px/s";
            if(o != 0)
                velocity = o;
            velocity_arr.push(velocity);
            a.push(o),
            30 < a.length && a.splice(0, 1),
            t = 0,
            $("#sparkline4").sparkline(a, {
                type: "line",
                width: "100%",
                height: "150",
                chartRangeMax: 77,
                maxSpotColor: !1,
                minSpotColor: !1,
                spotColor: !1,
                lineWidth: 1,
                lineColor: "#3051d3",
                fillColor: "rgba(48, 81, 211, 0.3)",
                highlightLineColor: "rgba(24,147,126,.1)",
                highlightSpotColor: "rgba(24,147,126,.2)"
            })
        }
        e = i,
        setTimeout(h, time_out);
    };
    setTimeout(h, time_out);
}

function initSetup(){
   document.getElementById("manual").className = "row row-cols-1 row-cols-md-3 g-3 divExplanationOut mx-5 shadow p-3 mb-5 bg-white rounded";
   setTimeout(function(){
        document.getElementById('manual').remove();
        document.getElementById('data_error').className = "row g-3 divDataIn w-25 shadow p-3 mb-5 mx-5 bg-white rounded"; 
  }, 2000)

}

function initGame_Setup(){
    var inputs = document.getElementById("data_error").elements;
    var error = inputs["error_data_value"].value;
    if(!error)
        error = 50;
    document.getElementById("data_error").className = "row g-3 divDataOut w-25 shadow p-3 mb-5 mx-5 bg-white rounded";
    setTimeout(function(){
         document.getElementById('data_error').remove(); 
         document.getElementById('myCanvas').style.display = 'block';
         initGame(error);
         document.getElementById('gameBar').className = "opacityOn navbar navbar-custom position-absolute h-20 w-100";  
   }, 2000)
 
 }


function sentData(data){
    var url = "http://ec2-18-215-129-32.compute-1.amazonaws.com:5000/processdata";
    var PostRequest = $.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json',
        data: data
    });
}

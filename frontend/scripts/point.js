
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
            var data_end = JSON.stringify(velocity_arr);
            
            document.getElementById('myCanvas').className = "opacityOut";
            document.getElementById('gameBar').className = "opacityOut navbar navbar-custom position-absolute h-20 w-100 shadow p-3 mb-5 bg-white rounded";  
            setTimeout(function(){
                document.getElementById('myCanvas').remove()
                document.getElementById('gameBar').remove()
            }, 2500)
            
            sentData(data_end, function(handledata){
                setTimeout(function(){
                    document.getElementById('showdataimg').innerHTML = handledata;
                    var velocity_avg_final_value = parseInt(document.getElementById('velocity_avg_value').innerHTML);
                    if(velocity_avg_final_value < 400){
                        document.getElementById('avg_velocity').className = "alert alert-danger text-center mx-5 mt-5";
                    }else if(velocity_avg_final_value >= 400 && velocity_avg_final_value < 1000){
                        document.getElementById('avg_velocity').className = "alert alert-warning text-center mx-5 mt-5";
                    }else if(velocity_avg_final_value >= 1000){
                        document.getElementById('avg_velocity').className = "alert alert-success text-center mx-5 mt-5";
                    }

                    document.getElementById('avg_velocity').innerHTML = document.getElementById('velocity_avg_value').innerHTML;
                    document.getElementById('showdata').className = "row row-cols-1 row-cols-md-2 g-2 divEndDataIn mx-5 shadow p-3 mb-5 bg-white rounded";
                }, 3000)
            });
            
        }
    });

    //Add the listener to make the point move when the pointer is over it
    canvas.addEventListener('mousemove', e => {     
        if(probability(error) && counter == 1 && velocity > 1200){
            moveError(ndir);
            counter = 2;
        } 
        if ((e.clientX>=myRect.x)&(e.clientX<=myRect.x+myRect.w)&(e.clientY>=myRect.y)&(e.clientY<=myRect.y+myRect.h)){
            
            if(counter == 0){
                move();
                start = (new Date()).getTime();
                counter = 1;
            }else if(counter == 1){
                counter = 2;
            }else if(counter == 2){
                end = (new Date().getTime());
                var total_time = end -start;
                time.push(total_time);
                myRect.x = origin.x;
                myRect.y = origin.y;
                counter = 0;
            }
        }
        requestAnimationFrame(draw);
    })

    requestAnimationFrame(draw);
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
            velocity = o;
            velocity_arr.push(o);
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
        setTimeout(h, 300)
    };
    setTimeout(h, 300)
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
         document.getElementById('gameBar').className = "opacityOn navbar navbar-custom position-absolute h-20 w-100 shadow p-3 mb-5 bg-white rounded";  
   }, 2000)
 
 }


function sentData(data, handledata){
    var url = "http://127.0.0.1:5000/processdata";
    var PostRequest = $.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json',
        data: data,
        success: function(response){
            handledata(response);
        }
    });

    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", "http://127.0.0.1:5000/hola", true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify({
    //     "value": "value"
    // }));
}

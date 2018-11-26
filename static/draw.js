var canvasFront = document.getElementById('front-canvas');
var canvasBack = document.getElementById('back-canvas');
var ctxf = canvasFront.getContext('2d');
var ctxb = canvasBack.getContext('2d');

var canvasWidth = document.getElementById('canvas-width');
var canvasHeight = document.getElementById('canvas-height');

var canvasPosition;
var mouseX = document.getElementById('mouseX');
var mouseXl = document.getElementById('mouseX');
var mouseY = document.getElementById('mouseY');
var mouseYl = document.getElementById('mouseY');
console.log(mouseX, mouseY, mouseXl, mouseYl)

var tools = [], sizes = [];
tools.pencil = document.getElementById('pencil');
tools.eraser = document.getElementById('eraser');

sizes.small = document.getElementById('small');
sizes.middle = document.getElementById('middle');
sizes.big = document.getElementById('big');

var eraserSize = 8;
var eraserCursor = "url('/static/img/eraser.jpeg'), auto";
var canvasClear = document.getElementById('clear-canvas'),
    fileImg = document.getElementById('file-Img'),
    properties = document.getElementById('properties'),
    imgWidth = document.getElementById('img-width'),
    imgHeight = document.getElementById('img-height');

var startX = 100, startY = 100;

window.onload = function() {
  canvasPosition = canvasBack.getBoundingClientRect();
}

canvasWidth.onchange = function() {
  canvasFront.width = canvasWidth.value;
  canvasBack.width = canvasWidth.value;
}

canvasHeight.onchange = function() {
  canvasFront.height = canvasHeight.value;
  canvasBack.height = canvasHeight.value;
}

canvasFront.onmousemove = function(e) {
  mouseX = e.clientX - canvasPosition.left;
  mouseY = e.clientY - canvasPosition.top;
  mouseXl.innerHTML = mouseX;
  mouseYl.innerHTML = mouseY;
}

canvasClear.onclick = function() {
  canvasBack.width = canvasBack.width;
  canvasFront.width = canvasFront.width;
}

addAllHandlers(tools, "tool-active");
addAllHandlers(sizes, "size-active");

function addAllHandlers(arr, className){
  for (var item in arr) {
    arr[item].onmousedown = addHandler(arr[item], arr, className);
  }
}

function addHandler(element, arr, className) {
  return function() {
    removeAllClasses(arr);
    element.setAttribute("class", className);
  }
}

function removeAllClasses(arr) {
  for (var item in arr) {
    arr[item].removeAttribute("class");
  }
}

sizes.small.onclick = function() {
  ctxb.lineWidth = 1;
  eraserSize = 8;
  eraserCursor = "url('/static/img/eraser.jpeg'), auto";
}
sizes.middle.onclick = function() {
  ctxb.lineWidth = 5;
  eraserSize = 16;
  eraserCursor = "url('/static/img/eraser.jpeg'), auto";
  console.log("This is working??")
}
sizes.big.onclick = function() {
  ctxb.lineWidth = 15;
  eraserSize = 32;
  eraserCursor = "url('/static/img/eraser.jpeg'), auto";
}

var processing = false;
var operations = [];

operations['mousedown'] = function() {
  processing = true;
  ctxb.beginPath();
  console.log('mouse down!');
}

operations['mouseup'] = function() {
  processing = false;
}

canvasFront.addEventListener("mousedown", operations["mousedown"]);

canvasFront.addEventListener("mouseup", operations["mouseup"]);

canvasFront.addEventListener("mousemove", operations["mousemove"]);
// canvasFront.onmousemove = operations["mousemove"];

tools.pencil.onclick = function() {
  canvasFront.style.cursor = "pointer";
  console.log("This is working?")
  operations['mousemove'] = function() {
    console.log(processing);
    if (processing) {
      console.log("This is working???")
      ctxb.lineTo(mouseX, mouseY);
      ctxb.stroke();
      console.log("This is working")
    };
  };
};

/*
tools.eraser.onclick = function() {
  operations['mousemove'] = function() {
    canvasFront.style.cursor = eraserCursor;
    if (processing) {
      ctxb.clearRect(mouseX, mouseY, eraserSize, eraserSize);
    };
  };
};
*/

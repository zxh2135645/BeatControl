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
    fileImg = document.getElementById('img-file'),
    properties = document.getElementById('properties'),
    imgWidth = document.getElementById('img-width'),
    imgHeight = document.getElementById('img-height');

var startX = 0, startY = 0;

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
  console.log(processing);
}

operations['mouseup'] = function() {
  processing = false;
  console.log(processing);
}

operations_mousemove = function() {};
operations_mousemoveErase = function() {};

canvasFront.addEventListener("mousedown", operations["mousedown"]);
canvasFront.addEventListener("mouseup", operations["mouseup"]);

canvasFront.addEventListener("mousemove", operations_mousemove);
canvasFront.addEventListener("mousemove", operations_mousemoveErase);
//canvasBack.addEventListener("mousedown", operations["mousedown"]);

//canvasBack.addEventListener("mouseup", operations["mouseup"]);

//canvasBack.addEventListener("mousemove", operations["mousemove"]);
//canvasFront.onmousemove = operations["mousemove"];
//$("#front-canvas").mousemove(operations["mousemove"]);
//$("#back-canvas").mousemove(operations["mousemove"]);

tools.pencil.onclick = function() {
  canvasFront.removeEventListener("mousemove", operations_mousemoveErase);
  canvasFront.style.cursor = "crosshair";
  console.log("This is working?")
  console.log(processing)
  console.log('No Way!')
  operations_mousemove = function() {
    //console.log(processing);
    if (processing) {
      //console.log("This is working???")
      ctxb.lineTo(mouseX, mouseY);
      ctxb.stroke();
      //ctxf.lineTo(mouseX, mouseY);
      //ctxf.stroke();
      //console.log("This is working")
    };
  };
  canvasFront.addEventListener("mousemove", operations_mousemove);
};


tools.eraser.onclick = function() {
  canvasFront.removeEventListener("mousemove", operations_mousemove);
  operations_mousemoveErase = function() {
    canvasFront.style.cursor = eraserCursor;
    if (processing) {
      ctxb.clearRect(mouseX, mouseY, eraserSize, eraserSize);
    };
  };
  canvasFront.addEventListener("mousemove", operations_mousemoveErase);
};



color.onchange = function(e) {
  ctxb.strokeStyle = e.srcElement.value;
}

fileImg.onchange = function() {
  var file = fileImg.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var dataUri = event.target.result;
    img = new Image();
    img.onload = function() {
      ctxb.strokeRect(startX, startY, img.width, img.height);
      ctxb.drawImage(img, startX, startY);
    };
    img.src = dataUri;
    properties.style.display = 'block';
    imgWidth.value = img.width;
    imgHeight.value = img.height;
  };
  reader.readAsDataURL(file);
}

imgWidth.addEventListener("change", changeImgSize);
imgHeight.addEventListener("change", changeImgSize);

function changeImgSize() {
  canvasFront.width = canvasFront.width;
  ctxf.strokeRect(startX, startY, imgWidth.value, imgHeight.value);
  ctxf.drawImage(img, startX, startY, imgWidth.value, imgHeight.value);
}

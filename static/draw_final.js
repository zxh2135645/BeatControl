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

var myColor = document.getElementById("myColor").value;
ctxf.strokeStyle = myColor;

var tools = [], sizes = [];
tools.pencil = document.getElementById('pencil');
tools.eraser = document.getElementById('eraser');

sizes.small = document.getElementById('small');
sizes.middle = document.getElementById('middle');
sizes.big = document.getElementById('big');

var eraserSize = 8;
var eraserCursor = "url('/static/img/eraser.jpeg'), auto";
var canvasClear = document.getElementById('clear-canvas'),
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
  ctxf.lineWidth = 1;
  eraserSize = 8;
  eraserCursor = "url('/static/img/eraser.jpeg'), auto";
}
sizes.middle.onclick = function() {
  ctxf.lineWidth = 5;
  eraserSize = 16;
  eraserCursor = "url('/static/img/eraser.jpeg'), auto";
  console.log("This is working??")
}
sizes.big.onclick = function() {
  ctxf.lineWidth = 15;
  eraserSize = 32;
  eraserCursor = "url('/static/img/eraser.jpeg'), auto";
}

var processing = false;
var operations = [];

operations['mousedown'] = function() {
  processing = true;
  ctxf.beginPath();
  console.log('mouse down!');
}

operations['mouseup'] = function() {
  if (processing) {
    processing = false;
    //cPush();
  };
};

operations['mouseleave'] = function() {
  if (processing) {
    processing = false;
    //cPush();
  };
};

operations_mousemove = function() {};
operations_mousemoveErase = function() {};

canvasFront.addEventListener("mousedown", operations["mousedown"]);
canvasFront.addEventListener("mouseup", operations["mouseup"]);
canvasFront.addEventListener("mouseleave", operations["mouseleave"]);

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
  operations_mousemove = function() {
    //console.log(processing);
    if (processing) {
      //console.log("This is working???")
      ctxf.lineTo(mouseX, mouseY);
      ctxf.stroke();
      //cPush();
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
      ctxf.clearRect(mouseX, mouseY, eraserSize, eraserSize);
      //cPush();
    };
  };
  canvasFront.addEventListener("mousemove", operations_mousemoveErase);
};



color.onchange = function(e) {
  ctxf.strokeStyle = e.srcElement.value;
  console.log(ctxf.strokeStyle);
}

imgWidth.addEventListener("change", changeImgSize);
imgHeight.addEventListener("change", changeImgSize);

function changeImgSize() {
  canvasFront.width = canvasFront.width;
  ctxf.strokeRect(startX, startY, imgWidth.value, imgHeight.value);
  ctxf.drawImage(img, startX, startY, imgWidth.value, imgHeight.value);
}

// Downloaidng two files
function saveImage(url) {
  var ua = window.navigator.userAgent;

  if (ua.indexOf("Chrome") > 0) {
    //document.location.href = canvasFront.toDataURL("image/png").replace("image/png", "image/octet-stream");

    var link = document.createElement('a');
    link.download = url;
    link.href = canvasFront.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
  }
  else {
    alert("Please use Chrome");
  };
};
/*
var button = document.getElementById('btn-download');
button.addEventListener('click', function(e) {
  var dataURL = canvasFront.toDataURL('image/png');
  document.write('<img src="'+dataURL+'"/>');
});*/

var cPushArray = new Array();
var cStep = -1;

function cPush() {
    cStep++;
    if (cStep < cPushArray.length) { cPushArray.length = cStep; }
    cPushArray.push(canvasFront.toDataURL());
    document.title = cStep + ":" + cPushArray.length;
}

function cUndo() {
    if (cStep > 0) {
        console.log(cStep);
        console.log(cPushArray);
        cStep--;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctxf.drawImage(canvasPic, 0, 0); }
        document.title = cStep + ":" + cPushArray.length;
    }
}

/*
function cRedo() {
    if (cStep < cPushArray.length-1) {
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
    }
}
*/

function myFunction() {
    var x = document.getElementById("front-canvas");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function loadImgBack(img_url) {
  var canvasBack = document.getElementById("back-canvas");
  var ctxb = canvasBack.getContext("2d");
  var canvasWidth = document.getElementById('canvas-width');
  var canvasHeight = document.getElementById('canvas-height');

  var img = new Image();
  img.onload = function() {
    ctxb.strokeRect(0, 0, canvasWidth.value, canvasHeight.value);
    ctxb.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);
  }
  //img.src = 'http://static.tumblr.com/25bac3efec28a6f14a446f7c5f46b685/hywphoq/ufoniwv6n/tumblr_static_ldhkrazuoqo4g0s0sk8s4s4s.jpg';
  img.src = img_url;
}

function loadImgFront(img_url) {
  var canvasFront = document.getElementById("front-canvas");
  var ctxf = canvasFront.getContext("2d");
  var canvasWidth = document.getElementById('canvas-width');
  var canvasHeight = document.getElementById('canvas-height');

  var img = new Image();
  img.onload = function() {
    //ctxf.globalAlpha = 0.3;
    ctxf.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);
    //cPush();
  }
  //img.src = 'http://static.tumblr.com/25bac3efec28a6f14a446f7c5f46b685/hywphoq/ufoniwv6n/tumblr_static_ldhkrazuoqo4g0s0sk8s4s4s.jpg';
  img.src = img_url;
}

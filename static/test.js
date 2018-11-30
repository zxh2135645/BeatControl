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
    ctxf.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value);
  }
  //img.src = 'http://static.tumblr.com/25bac3efec28a6f14a446f7c5f46b685/hywphoq/ufoniwv6n/tumblr_static_ldhkrazuoqo4g0s0sk8s4s4s.jpg';
  img.src = img_url;
}
/*
var FileInput = document.getElementById('file_input');
FileInput.addEventListener("change", function(e){
  console.log("running?");
   var URL = window.webkitURL || window.URL;
   var url = URL.createObjectURL(e.target.files[0]);
   loadImg(url);
}, false); */

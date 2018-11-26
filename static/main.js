var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var img1 = loadImage('https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png', main);
var img2 = loadImage('http://introcs.cs.princeton.edu/java/31datatype/peppers.jpg', main);

var imagesLoaded = 0;
function main() {
    imagesLoaded += 1;

    if(imagesLoaded == 2) {
        // composite now
        ctx.drawImage(img1, 0, 0);

        ctx.globalAlpha = 0.5;
        ctx.drawImage(img2, 0, 0);
    }
}

function loadImage(src, onload) {
    // http://www.thefutureoftheweb.com/blog/image-onload-isnt-being-called
    var img = new Image();

    img.onload = onload;
    img.src = src;

    return img;
}

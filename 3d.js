Math.lerp = function (from, to, progress) {
    return from + ((to - from) * progress);
};

var Colour = function(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
}

var CircleDrawer = function(from_colour, mid_colour, to_colour, rotations, offset, step_size) {
    this.from_colour = from_colour;
    this.mid_colour = mid_colour;
    this.to_colour = to_colour;
    this.two_pi = 3.14 * 2;
    this.rotations = rotations;
    this.indicator_done = false;
    this.radius = null;
    this.offset = offset;
    this.step_size = step_size;
}

CircleDrawer.prototype.get_colour = function(step) {
    var progress = step / this.two_pi;

    if (progress <= 0.5) {
        var colour_a = this.from_colour;
        var colour_b = this.mid_colour;
    } else {
        var colour_a = this.mid_colour;
        var colour_b = this.to_colour;
        progress -= 0.5;
    }
    progress *= 2;

    var red = parseInt(Math.lerp(colour_a.red, colour_b.red, progress) * 255);
    var green = parseInt(Math.lerp(colour_a.green, colour_b.green, progress) * 255);
    var blue = parseInt(Math.lerp(colour_a.blue, colour_b.blue, progress) * 255);

    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

CircleDrawer.prototype.draw_circle = function(step) {
    context.strokeStyle = this.get_colour(step);

    context.beginPath();

    for (var x = 0; x < this.two_pi * this.rotations; x += step) {
        var sin_x = Math.sin(x + this.offset * this.two_pi);
        var cos_y = Math.cos(x + this.offset * this.two_pi);
        context.lineTo(sin_x * (this.radius - 2), cos_y * (this.radius - 2));
    
}
    context.stroke();

    if (step < this.two_pi) {
        setTimeout(function(){this.draw_circle(step + this.step_size);}.bind(this), 1);
    }
}

CircleDrawer.prototype.main = function() {
    var side = Math.min(innerWidth, innerHeight) - 25;
    this.radius = side / 2;

    canvasElement = document.getElementsByTagName("canvas")[0];
    canvasElement.width = side;
    canvasElement.height = side; 

    context = canvasElement.getContext("2d");
    context.translate(this.radius, this.radius);
    context.lineWidth = 0.2
;
    this.draw_circle(this.step_size);
}

function init() {
    var from_colour = new Colour(Math.random(), Math.random(), Math.random());
    var mid_colour = new Colour(Math.random(), Math.random(), Math.random());
    var to_colour = new Colour(Math.random(), Math.random(), Math.random());
    var rotations = parseInt(Math.random() * 3) + 1;
    var offset = Math.random();
    var step_size = Math.lerp(0.005, 0.01, 1);

    var circle_drawer = new CircleDrawer(from_colour, mid_colour, to_colour, rotations, offset, step_size);
    circle_drawer.main();
}

document.addEventListener("DOMContentLoaded", init);
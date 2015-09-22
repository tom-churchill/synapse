Math.lerp = function (from, to, progress) {
    return from + ((to - from) * progress);
};

var Input = function() {
    this.mouse_x = null;
    this.mouse_y = null;

    document.onmousemove = function(event){this.set_mouse_info(event);}.bind(this)
}

Input.prototype.set_mouse_info = function(event) {
    this.mouse_x = event.pageX / window.innerWidth;
    this.mouse_y = event.pageY / window.innerHeight;
}

var Colour = function(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
}

Colour.get_random_colour = function() {
    return new Colour(Math.random(), Math.random(), Math.random());
}

CircleDrawer = function() {
    this.old_mouse_x = null;
    this.old_mouse_y =null;
    this.radius = null;
    this.mouse_changed = true;
    this.timeout = null;
}

CircleDrawer.prototype.assign_properties = function(from_colour, mid_colour, to_colour, rotations, offset, step_size, input) {
    this.from_colour = from_colour;
    this.mid_colour = mid_colour;
    this.to_colour = to_colour;
    this.two_pi = 3.14 * 2;
    this.rotations = rotations;
    this.indicator_done = false;
    this.offset = offset;
    this.step_size = step_size;
    this.is_running = false;
    this.first_run = true;
    this.input = input;
    this.progress = 0;
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

CircleDrawer.prototype.draw_circle = function(step, first_run) {
    clearTimeout(this.timeout)
    this.first_run = false;
    this.is_running = true;
    context.strokeStyle = this.get_colour(step);

    context.beginPath();

    for (var x = 0; x < this.two_pi * this.rotations; x += step) {
        var sin_x = Math.sin(x + this.offset * this.two_pi);
        var cos_y = Math.cos(x + this.offset * this.two_pi);
        context.lineTo(sin_x * (this.radius - 2), cos_y * (this.radius - 2));
    }
    context.stroke();

    if (step < this.two_pi) {
        if (first_run == true) { 
            this.progress = step;
            this.timeout = setTimeout(function(first_run){this.draw_circle(step + this.step_size, first_run);}.bind(this, first_run), this.step_size * 100);
        } else {
            if (step < this.progress) {
                this.draw_circle(step + this.step_size, first_run);
            } else {
                this.progress = step;
                this.timeout = setTimeout(function(first_run){this.draw_circle(step + this.step_size, first_run);}.bind(this, first_run), this.step_size * 100);
            }
        }
    } else {
        this.is_running = false;
    }
}

CircleDrawer.prototype.main = function() {
    if (this.has_mouse_changed()) {
        var side = Math.min(innerWidth, innerHeight) - 25;
        this.radius = side / 2;

        canvasElement = document.getElementsByTagName("canvas")[0];
        canvasElement.width = side;
        canvasElement.height = side;

        context = canvasElement.getContext("2d");
        context.translate(this.radius, this.radius);
        context.lineWidth = 0.2
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
        var mouse_x = this.input.mouse_x;
        if (mouse_x == null) {
            mouse_x = 0.5;
        }

        var mouse_y = this.input.mouse_y;
        if (mouse_y == null) {
            mouse_y = 0.5;
        }
        this.step_size = Math.lerp(0.005, 0.04, Math.abs(mouse_x - 0.5) * 2);
        this.rotations = Math.lerp(0, 3, 1 - Math.abs(mouse_y - 0.5) * 2);

        this.draw_circle(this.step_size, this.first_run);
    }
}


CircleDrawer.prototype.has_mouse_changed = function() {
    var mouse_changed = false;
    if (
        this.old_mouse_x != this.input.mouse_x ||
        this.old_mouse_y != this.input.mouse_y ||
        this.first_run == true
    ) {
        mouse_changed = true;
    }

    this.old_mouse_x = this.input.mouse_x;
    this.old_mouse_y = this.input.mouse_y;

    return mouse_changed;
}

CircleDrawer.prototype.reset_mouse = function() {
    this.old_mouse_x = null;
    this.old_mouse_y = null;
}

var Controller = function(input) {
    this.interval = null;
    this.circle_drawer = new CircleDrawer();
    this.input = input;
}

Controller.prototype.init = function() {
    var body = document.getElementsByTagName("body")[0];
    body.onclick = function(){this.init();}.bind(this);
    
    var from_colour = Colour.get_random_colour();
    var mid_colour = Colour.get_random_colour();
    var to_colour = Colour.get_random_colour();
    var rotations = parseInt(Math.random() * 3) + 1;
    var offset = Math.random();
    var step_size = Math.lerp(0.005, 0.01, Math.random());

    this.circle_drawer.reset_mouse();
    this.circle_drawer.assign_properties(from_colour, mid_colour, to_colour, rotations, offset, step_size, this.input);

    clearInterval(this.interval);
    clearTimeout(this.circle_drawer.timeout)
    
    this.interval = setInterval(function(){this.circle_drawer.main();}.bind(this), 20);
}
input = new Input();
controller = new Controller(input);
document.addEventListener("DOMContentLoaded", function(){controller.init();}.bind(controller));

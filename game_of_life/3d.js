
var Controller = function() {
    this.side = Math.min(innerWidth, innerHeight) - 25;
    this.radius = this.side / 2;
    this.cells = []
    this.create_start_cells();
    this.cell_colour = '#dddddd';
}

Controller.prototype.init = function() {

    var element = document.getElementById('image');
    style = window.getComputedStyle(element);
    this.cell_colour = style.getPropertyValue('color');

    canvasElement = document.getElementsByTagName("canvas")[0];
    canvasElement.width = this.side;
    canvasElement.height = this.side;

    this.context = canvasElement.getContext("2d");
    this.context.translate(this.radius, this.radius);
    this.context.lineWidth = 0.2
    this.context.clearRect(0, 0, canvasElement.width, canvasElement.height);

    this.draw_cells();
    this.iterate();
    this.timeout = setTimeout(function(){this.init();}.bind(this), 400);
}

Controller.prototype.iterate = function() {
    var new_cells = []
    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            var alive = this.cells[y * 100 + x] || false;

            var left = this.cells[y * 100 + x - 1] || false;
            var top_left = this.cells[(y - 1) * 100 + x - 1] || false;
            var top = this.cells[(y - 1) * 100 + x] || false;
            var top_right = this.cells[(y - 1) * 100 + x + 1] || false;
            var right = this.cells[y * 100 + x + 1] || false;
            var bottom_right = this.cells[(y + 1) * 100 + x + 1] || false;
            var bottom = this.cells[(y + 1) * 100 + x] || false;
            var bottom_left = this.cells[(y + 1) * 100 + x - 1] || false;

            var alive_neighbours = left + top_left + top + top_right + right + bottom_right + bottom + bottom_left;

            if (alive == true) {
                if (alive_neighbours <= 1) {
                    alive = false;
                }

                if (alive_neighbours == 2 || alive_neighbours == 3) {
                    alive = true;
                }

                if (alive_neighbours >= 4) {
                    alive = false;
                }
            } else {
                if (alive_neighbours == 3) {
                    alive = true;
                }
            }

            new_cells[y * 100 + x] = alive;
        }
    }

    this.cells = new_cells;
}

Controller.prototype.draw_cells = function() {
    for (var x = 0; x < 100; x++) {
        for (var y = 0; y < 100; y++) {
            var value = this.cells[y * 100 + x] || false;
            if (value == 1) {
                this.draw_rect(x, y);
            }
        }
    }
}

Controller.prototype.create_start_cells = function() {
    for (var i = 0; i < 3000; i++) {
        var x = parseInt(Math.random() * 100);
        var y = parseInt(Math.random() * 100);

        this.cells[y * 100 + x] = true;
    }
}

Controller.prototype.draw_rect = function(x, y) {
    var cell_width = this.side / 100;
    var cell_height = this.side / 100;
    var red = parseInt(Math.random() * 255);
    var green = parseInt(Math.random() * 255);
    var blue = parseInt(Math.random() * 255);

    this.context.beginPath();
    this.context.fillStyle = "rgb(" + red + ", " + green + ", " + blue + ")";

    this.context.fillStyle = "#dddddd";
    this.context.fillStyle = this.cell_colour;
    var x = (x * cell_width) - this.radius;
    var y = (y * cell_height) - this.radius;
    this.context.arc(x, y, cell_width / 2, 0, 2 * Math.PI, true);
    this.context.fill();
    this.context.stroke();
}

controller = new Controller();
document.addEventListener("DOMContentLoaded", function(){controller.init();}.bind(controller));

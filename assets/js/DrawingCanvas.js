// Configs
math.config({
    matrix: 'Array' // Choose 'Matrix' (default) or 'Array'
})

// Functions 

// get all the coordinates of each pixel in canvas 
function getCoordinates(size_of_pixels, amount_of_division) {
    pixel_positions = math.zeros(amount_of_division, amount_of_division)
    return pixel_positions.map((row, x) => {
        return row.map((cell, y) => {
            return [size_of_pixels * x, size_of_pixels * y]
        })
    })
}

// classes 
class Drawing_Canvas {
    // elementId, size of canvas, and amount of time the canvas is divided into pixels
    constructor(elementId, size, amount_of_division) {
        var self = this;
        
        this.isDrawing = false,

        // max a matrix of -1's to represent white pixels
        this.pixels = math.multiply(math.ones(amount_of_division, amount_of_division), -1)

        // last position mouse was hovering
        this.last_pos_x = null
        this.last_pos_y = null

        // get the element and create canvas
        this.canvas = document.getElementById(elementId)
        this.context = this.canvas.getContext("2d");

        // set canvas width and hight
        this.canvas.width = size
        this.canvas.height = size

        // set colour of canvas to white
        this.context.fillStyle = "#fff";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Find the size of the pixels and get there positions
        this.size_of_pixels = size / amount_of_division
        this.pixel_pos = getCoordinates(this.size_of_pixels, amount_of_division)

        // event listener to start toggling pixel
        this.canvas.addEventListener('mousedown', function (event) {
            this.isDrawing = true
            self.togglePixel(this.last_pos_x, this.last_pos_y)
        }, false);

        // keep updating the position on the canvas
        this.canvas.addEventListener('mousemove', function (event) {
            const rect = document.getElementById(elementId).getBoundingClientRect();

            let pos = {
                x: Math.floor((event.clientX - rect.left) / self.size_of_pixels),
                y: Math.floor((event.clientY - rect.top) / self.size_of_pixels)
            }

            // of the mouse is down toggling the pixels occurs
            if (this.isDrawing) {
                // check if the mouse moved from the same pixel so that 'flashing of pixel dose on occur
                if ((pos.x !== this.last_pos_x) || (pos.y !== this.last_pos_y)) {
                    self.togglePixel(pos.x, pos.y)
                }
            }

            // sent the last position
            this.last_pos_x = pos.x
            this.last_pos_y = pos.y
        }, false);

        // stop the toggling of the pixels
        this.canvas.addEventListener('mouseup', function () {
            this.isDrawing = false
        }, false);

        // stop the toggling of the pixels
        this.canvas.addEventListener('mouseleave', function () {
            this.isDrawing = false
        }, false);

        // TODO: Fix gray lines appearing while drawing  
        // Toggles the array representing the pixel and graphically at the x y Coordinate
        this.togglePixel = (x, y) => {
            if (this.pixels[x][y] === 1) {
                this.pixels[x][y] = -1
                this.context.fillStyle = "#fff";
                this.context.strokeStyle = "#fff";
            } else {
                this.pixels[x][y] = 1
                this.context.fillStyle = "#000";
                this.context.strokeStyle = "#000";
            }
            let p_ = this.pixel_pos[x][y]
            this.context.fillRect(p_[0], p_[1], this.size_of_pixels, this.size_of_pixels);
        }
    }
}
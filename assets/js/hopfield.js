// Configs
math.config({
    matrix: 'Array' // Choose 'Matrix' (default) or 'Array'
})

canvas_config = {
    // size of canvases and the amount of times divided
    size: 300,
    div_num: 8
}

// Creating Drawing canvases
var Drawing_Canvas_1 = new Drawing_Canvas('myCanvas1', canvas_config.size, canvas_config.div_num)
var Drawing_Canvas_2 = new Drawing_Canvas('myCanvas2', canvas_config.size, canvas_config.div_num)
var Drawing_Canvas_3 = new Drawing_Canvas('myCanvas3', canvas_config.size, canvas_config.div_num)

// check if all canvases are in active
function checkCanvases() {
    no_activated_pixels = math.multiply(math.ones(canvas_config.div_num, canvas_config.div_num), -1)
    // if they are not active add a class highlighting the canvases in red (other wise remove the class that is highlighting the canvases)
    if (math.deepEqual(no_activated_pixels, Drawing_Canvas_1.pixels)) {
        Drawing_Canvas_1.canvas.classList.add("outlineWarning");
    } else {
        Drawing_Canvas_1.canvas.classList.remove("outlineWarning");
    }

    if (math.deepEqual(no_activated_pixels, Drawing_Canvas_2.pixels)) {
        Drawing_Canvas_2.canvas.classList.add("outlineWarning");
    } else {
        Drawing_Canvas_2.canvas.classList.remove("outlineWarning");
    }

    if (math.deepEqual(no_activated_pixels, Drawing_Canvas_3.pixels)) {
        Drawing_Canvas_3.canvas.classList.add("outlineWarning");
    } else {
        Drawing_Canvas_3.canvas.classList.remove("outlineWarning");
    }

    if (
        !math.deepEqual(no_activated_pixels, Drawing_Canvas_1.pixels) &&
        !math.deepEqual(no_activated_pixels, Drawing_Canvas_2.pixels) &&
        !math.deepEqual(no_activated_pixels, Drawing_Canvas_3.pixels)
    ) return true; else return false;
}

function hopfield() {
    // if there all active use the NN
    if(checkCanvases()) {
        // passing all the pixel values to the NN
        hopfield_NN(Drawing_Canvas_1.pixels, Drawing_Canvas_2.pixels, Drawing_Canvas_3.pixels)
    }
}

// All the matrixes need to be the same size
function hopfield_NN(matrix1, matrix2, matrix3) {
    // first to train the NN
    this.training_data_1 = matrix_to_vector(matrix1)
    this.training_data_2 = matrix_to_vector(matrix2)

    // final one for testing which one is most similar
    this.input_data = matrix_to_vector(matrix3)

    this.width = canvas_config.div_num

    // Number of neurones need to be used 
    this.n_neurons = this.width ** 2

    // Connection/ Weights of all the neurons
    this.weights = math.zeros(this.n_neurons, this.n_neurons)

    // setting the weights
    this.weights = train(this.n_neurons, this.training_data_1, this.weights)
    this.weights = train(this.n_neurons, this.training_data_2, this.weights)

    // getting the results
    res = test(this.training_data_1, this.training_data_2, this.weights, this.input_data)

    // resting the weights
    this.weights = math.zeros(this.n_neurons, this.n_neurons)

    // display the results
    showDirection(res);
}

// get the 2-D array and make it into one long array
function matrix_to_vector(pixels) {
    trainingData = []
    pixels.forEach(row => {
        trainingData = trainingData.concat(row)
    })
    return trainingData
}

// Used for later project
// function 1D_array_to_pixel_format(data, width) {
//     pos = -1
//     pixels = math.zeros(width, width)

//     return pixels.map((row, x) => {
//         return row.map((val, y) => {
//             pos += 1
//             return data[pos]
//         })
//     })
// }

// training the network
function train(neu, training_data, w) {
    // multiply the two vectors to have a matrix (this will find the weights of each pixels)
    m_ = multiplyVV(training_data, training_data)
    // add with the previous weights 
    w = math.add(w, m_)
    // Remove the diagonal (neurons don't connect with them selves)
    for (let i = 0; i < neu; i++) {
        w[i][i] = 0
    }
    return w
}

// multiplying 2 vectors with a transpose
function multiplyVV(vector1, vector2) {
    // vector2 is transposed
    return vector1.map((num1) => {
        return vector2.map(x_ => x_ * num1)
    })
}

// get the results from the NN
function test(comp_1, comp_2, weights, input_data) {
    data_ = input_data

    // try a x times to see if match found
    x = 100
    for (let index = 0; index < x; index++) {
        data_ = retrieve_pattern(weights, data_)
        if (math.deepEqual(data_, comp_1)) {
            return 1
        } else if (math.deepEqual(data_, comp_2)) {
            return 2
        }
    }
    return 0
}


function retrieve_pattern(weights, data) {
    res = data
    // loop true every 'pixel' to see activation
    for (let x = 0; x < data.length; x++) {
        raw_v = math.dot(weights[x], data)
        // step function
        if (raw_v > 0) {
            res[x] = 1
        } else {
            res[x] = -1
        }
    }
    return res
}

// used to show the direction of what side the image resembles
function showDirection(side) {
    sideTag = document.getElementById("side")
    if (side === 1) {
        sideTag.innerHTML = "<=";
    } else if (side === 2) {
        sideTag.innerHTML = "=>";
    }
}
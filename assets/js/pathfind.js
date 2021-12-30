// ?? TODO ?? //
// Fix path finder when maze is empty
// Fix/make sure that is working correctly A* 
// clear the path when starting again
// fix when working on the same tile twice in a row (mouse over is getting involved)
// no path found error


const movements = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]]
const idTag = "el"
let maze = [
    [0, -1, -1, -1, -1, -1, -1, 1, -1, -1],
    [-1, -1, -1, -1, 1, -1, -1, 1, -1, -1],
    [1, 1, 1, 1, 1, -1, -1, 1, -1, -1],
    [-1, -1, -1, -1, -1, -1, 1, 1, -1, -1],
    [-1, -1, -1, -1, -1, 1, 1, 1, -1, -1],
    [-1, -1, -1, -1, -1, 1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 1, 1, -1, 1, -1, -1],
    [-1, 1, 1, 1, 1, -1, -1, 1, -1, -1],
    [-1, -1, -1, -1, 1, -1, -1, 1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, 1, -1, 2]
] // change white to -1 
let pathViewed = []


//              /////////////////////////////////////////////////////////////////////////////
//              /////////////////////////////////////////////////////////////////////////////
// canvas stuff /////////////////////////////////////////////////////////////////////////////
//              /////////////////////////////////////////////////////////////////////////////
//              /////////////////////////////////////////////////////////////////////////////
let option = 2

function select(option_) {
    option = option_
}

function getBoxPos(size_of_block, amount_of_division) {
    box_positions = maze // change back to zeros !!!!!!!!!
    return box_positions.map((row, x) => {
        return row.map((cell, y) => {
            return [size_of_block * x, size_of_block * y]
        })
    })
}

togglePixel = (Draw_can, x, y) => {
    Draw_can.pixels[x][y] = option
}

array_to_drawing = (Draw_can) => {
    Draw_can.pixels.forEach((row, x_) => {
        row.forEach((color, y_) => {
            if (color === 0) {
                Draw_can.context.fillStyle = "#8a2be2"
            } else if (color === 1) {
                Draw_can.context.fillStyle = "#000";
            } else if (color === 2) {
                Draw_can.context.fillStyle = "#dede05"
            } else if (color === 3) {
                Draw_can.context.fillStyle = "#00ffff"
            } else if (color === 4) {
                Draw_can.context.fillStyle = "#65de0b"
            } else if (color === -1) {
                Draw_can.context.fillStyle = "#fff";
            }
            let p_ = Draw_can.pixel_pos[x_][y_]
            Draw_can.context.fillRect(p_[0], p_[1], Draw_can.size_of_block, Draw_can.size_of_block);
        })
    })
}

clear_movement_pixels = (Draw_can) => {
    Draw_can.pixels.forEach((row, x_) => {
        row.forEach((color, y_) => {
            if ((color === 3) || (color === 4)) {
                Draw_can.pixels[x_][y_] = -1
            }
            let p_ = Draw_can.pixel_pos[x_][y_]
            Draw_can.context.fillRect(p_[0], p_[1], Draw_can.size_of_block, Draw_can.size_of_block);
        })
    })
    array_to_drawing(Draw_can)
}

draw = (Draw_can, pos_block_x, pos_block_y) => {
    togglePixel(Draw_can, pos_block_x, pos_block_y)
    array_to_drawing(Draw_can);
}

stop_drawing = (Draw_can) => {
    Draw_can.isDrawing = false
    Draw_can.pos_block_x_old = 10000
    Draw_can.pos_block_y_old = 10000
}

startDrawing = (Draw_can, pos) => {
    pos_block_x = Math.floor(pos.x / Draw_can.size_of_block)
    pos_block_y = Math.floor(pos.y / Draw_can.size_of_block)
    if ((pos_block_x !== Draw_can.pos_block_x_old) || (pos_block_y !== Draw_can.pos_block_y_old)) {
        draw(Draw_can, pos_block_x, pos_block_y)
    }
    Draw_can.pos_block_x_old = pos_block_x
    Draw_can.pos_block_y_old = pos_block_y
}


// classes 
class Drawing_Canvas {
    constructor(elementId, size, amount_of_division) {
        this.isDrawing = false,

        this.pixels = maze // change into creating maze

        this.pos_block_x_old = 10000
        this.pos_block_y_old = 10000

        this.canvas = document.getElementById(elementId)
        this.context = this.canvas.getContext("2d");

        this.canvas.width = size
        this.canvas.height = size

        this.context.fillStyle = "#fff";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.stroke();

        this.size_of_block = size / amount_of_division
        this.pixel_pos = getBoxPos(this.size_of_block, amount_of_division)

    }
}

// Configs

canvas_config = {
    size: 300,
    div_num: maze.length // later change to rows and cols
}

var Drawing_Canvas_1 = new Drawing_Canvas('myCanvas1', canvas_config.size, canvas_config.div_num)
array_to_drawing(Drawing_Canvas_1)

function reset() {
    Drawing_Canvas_1.pixels = [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ]
    array_to_drawing(Drawing_Canvas_1)
}


Drawing_Canvas_1.canvas.addEventListener('mousedown', function (event) {
    const rect = Drawing_Canvas_1.canvas.getBoundingClientRect();
    pos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
    Drawing_Canvas_1.isDrawing = true
    startDrawing(Drawing_Canvas_1, pos)
}, false);

//            /////////////////////////////////////////////////////////////////////////////
//            /////////////////////////////////////////////////////////////////////////////
// tree stuff /////////////////////////////////////////////////////////////////////////////
//            /////////////////////////////////////////////////////////////////////////////
//            /////////////////////////////////////////////////////////////////////////////

class Node {
    constructor(parent, position) {
        this.parent = parent

        this.position = position

        this.g = 0
        this.h = 0
        this.f = 0
    }
}

function compare_nodes(n1, n2) {
    return (n1.position[0] === n2.position[0] && n1.position[1] === n2.position[1])
}



async function aStar(maze_, start_, end_) {
    let open_list = []
    let closed_list = []

    let start_node = new Node(null, start_)
    let end_node = new Node(null, end_)

    open_list.push(start_node)

    while (open_list.length > 0) {

        // get current node
        const current_node_details = await get_current_node(open_list);

        let current_node = current_node_details[0]
        let current_index = current_node_details[1]

        // Pop current off open list, add to closed list
        open_list.splice(current_index, 1)

        closed_list.push(current_node)

        // Found the goal
        if (compare_nodes(current_node, end_node)) {
            return await get_path(current_node)
        }


        // Generate children
        let children = await get_children(current_node, maze_)

        // Loop through children and Add the child to the open list
        open_list = await notInOtherLists(current_node, end_node, children, open_list, closed_list)

    }
}

function get_current_node(open_list) {

    return new Promise(resolve => {
        let node_details = new Array()

        let current_node = open_list[0]

        node_details.push(open_list[0])
        node_details.push(0)

        open_list.forEach((item, index) => {
            if (item.f < current_node.f) {
                node_details[0] = item // current node
                node_details[1] = index // current index
            }
        });
        pathViewed.push(node_details[0].position)

        resolve(node_details)
    })
}

function get_path(current) {
    let path = []
    return new Promise(resolve => {
        while (current !== null) {
            path.push(current.position)
            current = current.parent
        }
        resolve(path.reverse()) // Return reversed path
    })
}

function get_children(current_node, maze) {
    let children = []

    return new Promise(resolve => {
        for (let index = 0; index < movements.length; index++) {
            const new_position = movements[index];

            // Get node position
            let node_position = [current_node.position[0] + new_position[0], current_node.position[1] + new_position[1]]

            //Make sure within range
            if ((node_position[0] > (maze.length - 1)) || (node_position[0] < 0) || (node_position[1] > (maze[maze.length - 1].length - 1)) || (node_position[1] < 0)) continue;


            // Make sure walkable terrain
            if (maze[node_position[0]][node_position[1]] == 1) continue;

            // Create new node
            let new_node = new Node(current_node, node_position)

            // Append
            children.push(new_node)

        }

        resolve(children)
    })

}


async function notInList(child, list) {
    for (let index = 0; index < list.length; index++) {
        const node = list[index];

        if (compare_nodes(child, node))
            return false;
    }
    return true;
}


async function notInOtherLists(current_node, end_node, children_, open_list_, closed_list_) {
    let i = 0
    let send = null
    while (i < children_.length) {

        send = await notInList(children_[i], open_list_)
        send = await notInList(children_[i], closed_list_)

        if (send) {
            // Create the f, g, and h values
            children_[i].g = current_node.g + 1
            children_[i].h = (Math.pow(children_[i].position[0] - end_node.position[0]), 2) + (Math.pow((children_[i].position[1] - end_node.position[1]), 2))
            children_[i].f = children_[i].g + children_[i].h
            // Add the child to the open list

            open_list_.push(children_[i])
        }

        i++
        if (i >= children_.length) {
            // open_list_.forEach(item => {
            //     console.log(item.position)
            // })
            return open_list_;
        }



    }
};


function get(i) {
    return new Promise(resolve => {
        let x = 0
        while (x < Drawing_Canvas_1.pixels.length) {
            let row = Drawing_Canvas_1.pixels[x]
            let y = 0
            while (y < row.length) {
                if(row[y] === i){
                    resolve([x,y])
                }
                y ++

            }
            
    
            x++
            if (x >= Drawing_Canvas_1.pixels.length ) {
                // open_list_.forEach(item => {
                //     console.log(item.position)
                // })
                resolve(false)
            }
        }
    })
}

async function start() {

    let start = await get(0)
    let end = await get(2)

    console.log(start, end);
    
    if (start && end) {
        aStar(Drawing_Canvas_1.pixels, start, end).then(path_ => {
            changeMaze(path_)
        })
    } else {
        console.log("no start or end");
        
    }

}


async function changeMaze(path_done) {
    for (let index = 0; index < pathViewed.length; index++) {
        const element = pathViewed[index];
        console.log(element);
        await placePice(3, 20).then(x => {
            maze[element[0]][element[1]] = x
            array_to_drawing(Drawing_Canvas_1)

        })
    }

    for (let index = 0; index < path_done.length; index++) {
        const element = path_done[index];
        console.log(element);
        await placePice(4, 100).then(x => {
            maze[element[0]][element[1]] = x
            array_to_drawing(Drawing_Canvas_1)

        })
    }

}

function placePice(type, speed) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(type)
        }, speed);
    })
}
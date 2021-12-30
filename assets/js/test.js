

children = ["child1", "child2", "child3"]
const closed_list = ["closed1", "closed2", "closed3"]
const open_list = ["open1", "open2", "open3"]

async function notInList(child, list) {
    for (let index = 0; index < list.length; index++) {
        const node = list[index];
        console.log(node);
        
        // if (compare_nodes(child, closed_node))
        if (child === 1)
            return false;
    }
    return true;
}


async function* notInOtherLists(children_, open_list_, closed_list_) {
    i = 0
    while (i < children_.length) {
        setTimeout(function() {}, 3000);
        send = await notInList(i, open_list_)
        send = await notInList(i, closed_list_)

        if(send)
            yield children_[i];
        
        i ++
    }
};


async function loop_children(children, open_list, closed_list) {
    for await (let child of notInOtherLists(children, open_list, closed_list)) {
        if (child) {
            console.log(child);
            
            // Create the f, g, and h values
            child.g = current_node.g + 1
            child.h = (Math.pow(child.position[0] - end_node.position[0]), 2) + (Math.pow((child.position[1] - end_node.position[1]), 2))
            child.f = child.g + child.h
            // Add the child to the open list
            open_list.push(child)
        }
    }
}

(function () {
    loop_children(children, open_list, closed_list)
})();


// loop
// .... loop
// .... set ver
// .... loop

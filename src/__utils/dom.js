export function isParent(node, parentNode, mode = false) {
    if (node == parentNode && mode == false) return false;
    let currentNode = node;
    //如果node不在html子树内，会出bug
    while (currentNode != document.documentElement) {
        currentNode = currentNode.parentNode;
        if (currentNode == parentNode) return true;
    }
    return false;
}

export function parentTest(node, condiation) {
    let currentNode = node;
    while (currentNode != document.documentElement) {
        currentNode = currentNode.parentNode;
        if (condiation(currentNode)) return true;
    }
    return false;
}

export function insertAfter(target, ele) {
    let parentNode = target.parentNode;
    if (parentNode.lastChild == target) {
        parentNode.appendChild(ele);
    }
    else {
        parentNode.insertBefore(ele, target.nextSibling);
    }
}
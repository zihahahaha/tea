export function listItem(obj) {
    this.pre = undefined;
    this.next = undefined;
    for (let i in obj) {
        this[i] = obj[i];
    }
}

export function list() {
    this.head = undefined;
    this.tail = undefined;
    this.num = 0;
}
list.prototype.deleteHead = function () {
    if (this.num == 1) {
        this.num--;
        this.head.next.pre = undefined;
        this.head = this.tail = undefined;
    }
    else if (this.num == 0) return;
    else {
        this.num--;
        this.head = this.head.next;
        this.head.pre = undefined;
    }
};
list.prototype.deleteTail = function () {
    if (this.num == 0) return;
    else if (this.num == 1) {
        this.head = this.tail = undefined;
        this.num--;
    }
    else {
        this.tail = this.tail.pre;
        this.tail.next = undefined;
        this.num--;
    }

}
list.prototype.add = function (item) {
    if (this.num == 0) {
        this.head = this.tail = item;
    }
    else if (this.num == 1) {
        this.head.next = item;
        this.tail = item;
        item.pre = this.head;
    }
    else {
        this.tail.next = item;
        item.pre = this.tail;
        this.tail = item;
    }
    this.num++;
}

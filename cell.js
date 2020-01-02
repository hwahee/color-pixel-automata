//Cell Status Enum
const D = 0, A = 1, M = 2, T = 3, F = 4;

function Cell(s = 0, r = 0, g = 0, b = 0) {
    this.status = s;
    this.red = r;
    this.green = g;
    this.blue = b;
}
Cell.prototype.getColor = function () {
    return "rgba(" + this.red + "," + this.green + "," + this.blue + ",1)";
}
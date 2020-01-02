var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//useful functions
function probability(percent) {
    if (Math.random() < percent / 100) return true;
    else return false;
}

//forehead settings
var cell_size = 10;
var color_original_ratio = 20;

//cell field settings
var field_col = parseInt(canvas.width / cell_size);
var field_row = parseInt(canvas.height / cell_size);
var CellField = [];
var CellFieldNext = [];

for (var r = 0; r < field_row; r++) {
    CellField[r] = new Array();
    CellFieldNext[r] = new Array();
    for (var c = 0; c < field_col; c++) {
        CellField[r][c] = new Cell();
        CellFieldNext[r][c] = new Cell();
    }
}

//define methods of CellField
CellField.transition = function () {
    for (var r = 0; r < field_row; r++) {
        for (var c = 0; c < field_col; c++) {
            switch (this[r][c].status) {
                case D:
                    percent = 0;
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            if (!((i == 0 && j == 0) || (r + i < 0 || field_row <= r + i) || (c + j < 0 || field_col <= c + j))) {//no index at boundary
                                if (this[r + i][c + j].status == T) {
                                    percent += 12.5;
                                }
                            }
                        }
                    }
                    if (probability(percent)) {
                        CellFieldNext[r][c].status = A;
                    }
                    else {
                        CellFieldNext[r][c].status = D;
                    }
                    break;
                case A:
                    if (true) { //Always
                        CellFieldNext[r][c].status = M;
                    }
                    break;
                case M:
                    rgb_around = { red: 0, green: 0, blue: 0 };
                    T_count = 0;
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            if (!((i == 0 && j == 0) || (r + i < 0 || field_row <= r + i) || (c + j < 0 || field_col <= c + j))) {//no index at boundary
                                if (this[r + i][c + j] != undefined && this[r + i][c + j].status == T) {
                                    rgb_around.red += this[r + i][c + j].red;
                                    rgb_around.green += this[r + i][c + j].green;
                                    rgb_around.blue += this[r + i][c + j].blue;
                                    T_count += 1;
                                }
                            }
                        }
                    }
                    if (T_count != 0) {
                        rgb_around.red = parseInt(rgb_around.red / T_count);
                        rgb_around.green = parseInt(rgb_around.green / T_count);
                        rgb_around.blue = parseInt(rgb_around.blue / T_count);
                        CellFieldNext[r][c].red = parseInt((this[r][c].red * color_original_ratio + rgb_around.red * (100 - color_original_ratio)) / 100);
                        CellFieldNext[r][c].green = parseInt((this[r][c].green * color_original_ratio + rgb_around.green * (100 - color_original_ratio)) / 100);
                        CellFieldNext[r][c].blue = parseInt((this[r][c].blue * color_original_ratio + rgb_around.blue * (100 - color_original_ratio)) / 100);
                    }
                    else {
                        CellFieldNext[r][c].red = CellField[r][c].red;
                        CellFieldNext[r][c].green = CellField[r][c].green;
                        CellFieldNext[r][c].blue = CellField[r][c].blue;
                    }
                    if (probability(5)) {//step next by n% probability
                        CellFieldNext[r][c].status = T;
                    }
                    else {
                        CellFieldNext[r][c].status = M;
                    }
                    break;
                case T:
                    if (probability(1)) {//step next by n% probability
                        CellFieldNext[r][c].status = F;
                    }
                    else if (probability(1)) {//step previous by n% probability
                        CellFieldNext[r][c].status = M;
                    }
                    else {
                        CellFieldNext[r][c].status = T;
                    }
                    break;
                case F:
                    break;
            }
        }
    }
    for (var r = 0; r < field_row; r++) {
        for (var c = 0; c < field_col; c++) {
            this[r][c] = CellFieldNext[r][c];
        }
    }
}
CellField.draw = function () {
    for (var r = 0; r < field_row; r++) {
        for (var c = 0; c < field_col; c++) {
            ctx.beginPath();
            ctx.rect(c * cell_size, r * cell_size, cell_size, cell_size);
            ctx.fillStyle = this[r][c].getColor();
            ctx.fill();
            ctx.closePath();
            if (true && this[r][c].status != D && this[r][c].status != F) {
                ctx.beginPath();
                ctx.arc(c * cell_size + cell_size / 2, r * cell_size + cell_size / 2, 1, 0, 6.28, false);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

CellField[field_row / 4][field_col / 2] = new Cell(3, 255, 0, 0);
CellField[field_row / 2][field_col / 4 + 10] = new Cell(3, 0, 255, 0);
CellField[field_row / 2-2][field_col / 2+5] = new Cell(3, 0, 0, 255);


function draw() {
    CellField.transition();
    CellField.draw();
}

//For beginning original field and next field must be the same
for (var r = 0; r < field_row; r++) {
    for (var c = 0; c < field_col; c++) {
        CellFieldNext[r][c] = CellField[r][c];
    }
}
setInterval(draw, 40);


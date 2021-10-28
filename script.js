
let ctx = document.getElementById("gc").getContext("2d");

let wr = document.getElementById("wr");
let wn = document.getElementById("wn");
let wb = document.getElementById("wb");
let wq = document.getElementById("wq");
let wk = document.getElementById("wk");
let wp = document.getElementById("wp");
let br = document.getElementById("br");
let bn = document.getElementById("bn");
let bb = document.getElementById("bb");
let bq = document.getElementById("bq");
let bk = document.getElementById("bk");
let bp = document.getElementById("bp");

let prex, prey;

class Piece {
    constructor(id, x, y, image) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.image = image;
        this.isGrabbed = false;
    }
};

let pieces_arr;

document.addEventListener("mousedown", (e) => {
    for (let i = 0; i < pieces_arr.length; i++) {
        if (e.clientX > pieces_arr[i].x * 100 + 10 && e.clientX < pieces_arr[i].x * 100 + 110 && 
            e.clientY > pieces_arr[i].y * 100 + 10 && e.clientY < pieces_arr[i].y * 100 + 110) {
            pieces_arr[i].isGrabbed = true;
            prex = pieces_arr[i].x;
            prey = pieces_arr[i].y;
            pieces_arr[i].x = e.clientX - 50;
            pieces_arr[i].y = e.clientY - 50;
        }
    }
});

document.addEventListener("mousemove", (e) => {
    for (let i = 0; i < pieces_arr.length; i++) {
        if (pieces_arr[i].isGrabbed == true) {
            pieces_arr[i].x = e.clientX - 50;
            pieces_arr[i].y = e.clientY - 50;
        }
    }
});

document.addEventListener("mouseup", (e) => {
    for (let i = 0; i < pieces_arr.length; i++) {
        if (pieces_arr[i].isGrabbed) {
            pieces_arr[i].isGrabbed = false;
            pieces_arr[i].x = e.clientX - 10 - ((e.clientX - 10) % 100);
            pieces_arr[i].y = e.clientY - 10 - ((e.clientY - 10) % 100);
            pieces_arr[i].x /= 100;
            pieces_arr[i].y /= 100;
            if (game_eval(prex, prey, pieces_arr[i].x, pieces_arr[i].y)) {
                for (let j = 0; j < pieces_arr.length; j++) {
                    if (i == j) {
                        continue;
                    }
                    if (pieces_arr[j].x == pieces_arr[i].x && pieces_arr[j].y == pieces_arr[i].y) {
                        pieces_arr.splice(j, 1);
                        console.log(prex, prey, pieces_arr[i].x, pieces_arr[i].y);
                        break;
                    }
                }
            } else {
                pieces_arr[i].x = prex;
                pieces_arr[i].y = prey;
            }
        }
    }
});

function gui() {
    let count = 0;

    ctx.clearRect(0, 0, 800, 800);
    for (let i = 0; i < 800; i += 100) {
        for (let j = 0; j < 800; j += 100) {
            if (count % 2 == 0) {
                ctx.fillStyle = "#628b96"; //"#ffce9e";
                ctx.fillRect(i, j, 100, 100);
            }
            count++;
        }
        count++;
    }

    for (let i = 0; i < pieces_arr.length; i++) {
        if (!pieces_arr[i].isGrabbed) {
            ctx.drawImage(pieces_arr[i].image, pieces_arr[i].x * 100 + 10, pieces_arr[i].y * 100 + 15, 80, 80);
        } else {
            ctx.drawImage(pieces_arr[i].image, pieces_arr[i].x, pieces_arr[i].y, 80, 80);
        }
    }
}

let play = setInterval(gui, 1000/60);
reset();

function reset() {
    pieces_arr = [
        new Piece('r', 0, 0, br), new Piece('n', 1, 0, bn), new Piece('b', 2, 0, bb), new Piece('q', 3, 0, bq), new Piece('k', 4, 0, bk), new Piece('B', 5, 0, bb), new Piece('n', 6, 0, bn), new Piece('r', 7, 0, br),
        new Piece('p', 0, 1, bp), new Piece('p', 1, 1, bp), new Piece('p', 2, 1, bp), new Piece('p', 3, 1, bp), new Piece('p', 4, 1, bp), new Piece('P', 5, 1, bp), new Piece('p', 6, 1, bp), new Piece('p', 7, 1, bp),
    
        /////////////////////////////////////////////
    
        new Piece('R', 0, 7, wr), new Piece('N', 1, 7, wn), new Piece('B', 2, 7, wb), new Piece('Q', 3, 7, wq), new Piece('K', 4, 7, wk), new Piece('B', 5, 7, wb), new Piece('N', 6, 7, wn), new Piece('R', 7, 7, wr),
        new Piece('P', 0, 6, wp), new Piece('P', 1, 6, wp), new Piece('P', 2, 6, wp), new Piece('P', 3, 6, wp), new Piece('P', 4, 6, wp), new Piece('P', 5, 6, wp), new Piece('P', 6, 6, wp), new Piece('P', 7, 6, wp)
    ];

    game = 1;
    board = [
            [[ 1, 0],[ 1, 1],[ 1, 2],[ 1, 3],[ 1, 4],[ 1, 2],[ 1, 1],[ 1, 0]],
            [[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5]],
            [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
            [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
            [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
            [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
            [[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5]],
            [[ 0, 0],[ 0, 1],[ 0, 2],[ 0, 3],[ 0, 4],[ 0, 2],[ 0, 1],[ 0, 0]]
    ];
    king = [
            [7, 4],
            [0, 4]
    ];
    pieces = [
            ["\u265c", "\u265e", "\u265d", "\u265b", "\u265a", "\u265f"],
            ["\u2656", "\u2658", "\u2657", "\u2655", "\u2654", "\u2659"]
    ];
    player = 0;

    play = setInterval(gui, 1000/60);

    document.getElementById("reload").style.display = "none";
}
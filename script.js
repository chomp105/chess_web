let ctx = document.getElementById("gc").getContext("2d");

ctx.fillStyle = "red";

class Piece {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.isGrabbed = 0;
    }
};

let pieces = [
    new Piece('r', 0, 0), new Piece('n', 1, 0), new Piece('b', 2, 0), new Piece('q', 3, 0), new Piece('k', 4, 0), new Piece('B', 5, 0), new Piece('n', 6, 0), new Piece('r', 7, 0),
    new Piece('p', 0, 1), new Piece('p', 1, 1), new Piece('p', 2, 1), new Piece('p', 3, 1), new Piece('p', 4, 1), new Piece('P', 5, 1), new Piece('p', 6, 1), new Piece('p', 7, 1),

    /////////////////////////////////////////////

    new Piece('R', 0, 7), new Piece('N', 1, 7), new Piece('B', 2, 7), new Piece('Q', 3, 7), new Piece('K', 4, 7), new Piece('B', 5, 7), new Piece('N', 6, 7), new Piece('R', 7, 7),
    new Piece('P', 0, 6), new Piece('P', 1, 6), new Piece('P', 2, 6), new Piece('P', 3, 6), new Piece('P', 4, 6), new Piece('P', 5, 6), new Piece('P', 6, 6), new Piece('P', 7, 6)
];

document.addEventListener("mousedown", (e) => {
    for (let i = 0; i < 32; i++) {
        if (e.clientX > pieces[i].x * 100 + 10 && e.clientX < pieces[i].x * 100 + 110 && 
            e.clientY > pieces[i].y * 100 + 10 && e.clientY < pieces[i].y * 100 + 110) {
            pieces[i].isGrabbed = true;
            pieces[i].x = e.clientX - 20;
            pieces[i].y = e.clientY;
        }
    }
});

document.addEventListener("mousemove", (e) => {
    for (let i = 0; i < 32; i++) {
        if (pieces[i].isGrabbed == true) {
            pieces[i].x = e.clientX - 20;
            pieces[i].y = e.clientY;
        }
    }
});

document.addEventListener("mouseup", (e) => {
    for (let i = 0; i < 32; i++) {
        if (pieces[i].isGrabbed) {
            pieces[i].isGrabbed = false;
            pieces[i].x -= pieces[i].x % 100;
            pieces[i].y -= pieces[i].y % 100;
            pieces[i].x /= 100;
            pieces[i].y /= 100;
            for (let j = 0; j < 32; j++) {
                if (i == j) {
                    continue;
                }
                if (pieces[j].x == pieces[i].x && pieces[j].y == pieces[i].y) {
                    pieces.splice(j, 1);
                }
            }
        }
    }
});

function game() {
    let count = 0;

    ctx.clearRect(0, 0, 800, 800);
    for (let i = 0; i < 800; i += 100) {
        for (let j = 0; j < 800; j += 100) {
            if (count % 2 == 0) {
                ctx.fillStyle = "#ffce9e";
                ctx.fillRect(i, j, 100, 100);
            }
            count++;
        }
        count++;
    }

    for (let i = 0; i < 32; i++) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        if (!pieces[i].isGrabbed) {
            ctx.fillText(pieces[i].id, pieces[i].x * 100 + 40, pieces[i].y * 100 + 60);
            ctx.strokeText(pieces[i].id, pieces[i].x * 100 + 40, pieces[i].y * 100 + 60);
        } else {
            ctx.fillText(pieces[i].id, pieces[i].x, pieces[i].y);
            ctx.strokeText(pieces[i].id, pieces[i].x, pieces[i].y);
        }
    }
}

setInterval(game, 1000/60);
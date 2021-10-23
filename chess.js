function not(input) {
    if (input == 0) {
        return 1;
    }
    return 0;
}

let game = 1;

function main() { //TODO: implement advanced moves (castling, en passant, queening)
    // game board with pieces and blank spaces
    let board = [
            [[ 1, 0],[ 1, 1],[ 1, 2],[ 1, 3],[ 1, 4],[ 1, 2],[ 1, 1],[ 1, 0]],
            [[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5],[ 1, 5]],
            [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
            [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
            [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
            [[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1],[-1,-1]],
            [[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5],[ 0, 5]],
            [[ 0, 0],[ 0, 1],[ 0, 2],[ 0, 3],[ 0, 4],[ 0, 2],[ 0, 1],[ 0, 0]]
    ];
    let king = [
            [7, 4],
            [0, 4]
    ];
    let pieces = [
            ["\u265c", "\u265e", "\u265d", "\u265b", "\u265a", "\u265f"],
            ["\u2656", "\u2658", "\u2657", "\u2655", "\u2654", "\u2659"]
    ];
    let player = 0;
    // game loop

    while(game) {
        print_board(board, pieces);
        console.log("player " + (player + 1) + ": ");
        // input for the movement
        let sx, sy, ex, ey;
        sx = parseInt(prompt("1"));
        sy = parseInt(prompt("2"));
        ex = parseInt(prompt("3"));
        ey = parseInt(prompt("4"));
        sx--;sy--;ex--;ey--;
        if (board[sy][sx][0] != player) {
            continue;
        } else if (move(board, sx, sy, ex, ey, king, player, game)) {
            player = not(player);
        }
    }
    print_board(board, pieces);
    console.log("Checkmate\n");
    return 0;
}

function print_board(board, pieces) {
    // loops through board and prints pieces to screen along with spaces
    for (let i = 0; i < 8; i++) {
        if (i != 0) {
		console.log("├───┼───┼───┼───┼───┼───┼───┼───┤\n");
        } else {
            console.log("┌───┬───┬───┬───┬───┬───┬───┬───┐\n");	
        }
        let row = '';
        for (let j = 0; j < 8; j++) {
            if (board[i][j][0] != -1) {
                row += "│ " + pieces[board[i][j][0]][board[i][j][1]] + " ";
            } else {
                row += "│   ";
            }
        }
        console.log(row + "│\n");
    }
    console.log("└───┴───┴───┴───┴───┴───┴───┴───┘\n");
}

function move(board, sx, sy, ex, ey, king, player, game) {
    if (eval(board, sx, sy, ex, ey)) {
        // "checks" for check... get it? check and check... lol
        if (not(check(board, sx, sy, ex, ey, king[player]))) {
            transfer_piece(board, sx, sy, ex, ey);
	        if (sx == king[player][1] && sy == king[player][0]) {
                king[player][0] = ey;
                king[player][1] = ex;
            }
        } else {
            return 0;
        }
        // checks for checkmate and stops game if it returns true
        if (checkmate(board, king, player)) {
            game = 0;
        }
        return 1;
    }
    return 0;
}

function checkmate(board, king, player) {
    // loops through every spot on the board and for each spot, if it is an enemy of the current player,
    // it checks if it can move somewhere that will prevent check for the enemy king
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[j][i][0] != -1 && board[j][i][0] != board[king[player][0]][king[player][1]][0]) {
                for (let k = 0; k < 8; k++) {
                    for (let l = 0; l < 8; l++) {
                        // if there is a move which is safe, it returns false
                        if (not(check(board, i, j, k, l, king[!player]))) {
			                return 0;
                        }
                    }
                }
            }
        }
    }
    return 1;
}

function check(board, sx, sy, ex, ey, king) {
    let nboard = [
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []],
        [[], [], [], [], [], [], [], []]
    ];
    // copies board to new board to perform check function
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            nboard[i][j][0] = board[i][j][0];
            nboard[i][j][1] = board[i][j][1];
        }
    }
    if (eval(board, sx, sy, ex, ey) && not((sx == ex) && (sy == ey)) && board[ey][ex][0] != board[sy][sx][0]) {
        // moves piece on the new board and sets kingx and kingy to their correct positions
        transfer_piece(nboard, sx, sy, ex, ey);
        let kingy = king[0];
        let kingx = king[1];
	    if (sx == king[1] && sy == king[0]) {
            kingy = ey;
       	    kingx = ex;
        }
        // loops through every spot on the board and checks to see if it can attack the king
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (nboard[j][i][0] != -1 && nboard[j][i][0] != nboard[kingy][kingx][0]) {
                    if (eval(nboard, i, j, kingx, kingy)) {
                        return 1;
                    }
                }
            }
        }
        return 0;
    }
    return 1;
}

function transfer_piece(board, sx, sy, ex, ey) {
    // checks that a move has occurred and that the end point is not a team member
    if (not((sx == ex) && (sy == ey)) && board[ey][ex][0] != board[sy][sx][0]) {
        // moves piece info to specified area
        board[ey][ex][0] = board[sy][sx][0];
        board[ey][ex][1] = board[sy][sx][1];
        // clears out previous position
        board[sy][sx][0] = -1;
        board[sy][sx][1] = -1;
    }
}

function eval(board, sx, sy, ex, ey) {
    // finds piece type and team from starting position
    let p_type = board[sy][sx][1];
    // x and y distance are the end point minus the start point
    let xdist = ex - sx;
    let ydist = ey - sy;
    // checks player type to see which conditions to check
    switch(p_type) {
        case 0:
            return check_rook(board, sx, sy, ex, ey, xdist, ydist);
        case 1:
            return check_knight(xdist, ydist);
        case 2:
            return check_bishop(board, sx, sy, xdist, ydist);
        case 3:
            return check_queen(board, sx, sy, ex, ey, xdist, ydist);
        case 4:
            return check_king(xdist, ydist);
        case 5:
            return check_pawn(board, sx, sy, ex, ey, xdist, ydist);
        default:
            return 0;
    }
}

function check_rook(board, sx, sy, ex, ey, xdist, ydist) {
    // makes sure piece moves in correct direction
    if ((sx != ex) != (sy != ey)) {
        // loops through all the spaces the piece is going through and makes sure nothing is in its path
        // see bishop comments for explanation of logic
        if (Math.abs(xdist) > 0) {
            for (let i = 1; i < Math.abs(xdist); i++) {
                if (board[sy][sx + (i * xdist / Math.abs(xdist))][0] != -1) {
                    return 0;
                }
            }
        } else {
            for (let i = 1; i < Math.abs(ydist); i++) {
                if (board[sy + (i * ydist / Math.abs(ydist))][sx][0] != -1) {
                    return 0;
                }
            }
        }
        return 1;
    }
    return 0;
}

function check_knight(xdist, ydist) {
    // checks if the moves are in the correct pattern for a knight (L shape)
    //if (((abs(xdist) == 2) && (abs(ydist) == 1)) || ((abs(xdist) == 1) && (abs(ydist) == 2))) {
    if ((Math.abs(xdist) + Math.abs(ydist) == 3) && (Math.abs(xdist) == 1 || Math.abs(ydist) == 1)) {
        return 1;
    }
    return 0;
}

function check_bishop(board, sx, sy, xdist, ydist) {
    // makes sure that bishop is moving in a diagonal
    if (Math.abs(xdist) == Math.abs(ydist)) {
        // checks if there is something in the way of the bishop
        // it loops through, and it multiplies "i" and dist and divides it by abs(dist). this means that there only has to be one for loop
        // if the bishop moves in a negative x direction then "i" will become a negative due to the equation
        for (let i = 1; i < Math.abs(xdist); i++) {
            if (board[sy + (i * ydist / Math.abs(ydist))][sx + (i * xdist / Math.abs(xdist))][0] != -1) {
                return 0;
            }
        }
        return 1;
    }
    return 0;
}

function check_queen(board, sx, sy, ex, ey, xdist, ydist) {
    // checks if the queen is moving like a rook or bishop and uses the according function
    if ((sx != ex) != (sy != ey)) {
        return check_rook(board, sx, sy, ex, ey, xdist, ydist);
    } else if (Math.abs(xdist) == Math.abs(ydist)) {
        return check_bishop(board, sx, sy, xdist, ydist);
    }
    return 0;
}

function check_king(xdist, ydist) {
    // checks that king is only moving one space away
    if (Math.abs(xdist) < 2 && Math.abs(ydist) < 2) {
        return 1;
    }
    return 0;
}

function check_pawn(board, sx, sy, ex, ey, xdist, ydist) {
    // checks if pawn is moving forward once, twice for first move, or attacking
    // !(ydist + abs(ydist)) == !board[sy][sx][0] tests to see if the pawn is moving in the right direction.
    // ydist + abs(ydist) makes sure that the number is either 0 or positive
    if (((((xdist == 0 && Math.abs(ydist) == 1) || (xdist == 0 && Math.abs(ydist) == 2 && (sy == 1 || sy == 6))) && board[ey][ex][0] == -1) ||
         ((Math.abs(xdist) == 1 && Math.abs(ydist) == 1) && board[ey][ex][0] != -1)) && not(ydist + Math.abs(ydist)) == not(board[sy][sx][0])) {
        return 1;
    }
    return 0;
}
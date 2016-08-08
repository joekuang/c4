function Game() {
    this.ROWS = 6;
    this.COLUMNS = 7;
    this.board = []
    this.player = 0;
    this.winner = -1;
    this.ongoing = false;

    this.newGame = function() {
        this.board = [];
        for (var i = 0; i < this.ROWS; i += 1) {
            var col = [];
            for (var j = 0; j < this.COLUMNS; j += 1) {
                col.push(-1);
            }
            this.board.push(col);
        }
        this.winner = -1;
    }

    this.placePiece = function(col) {
        if (! this.fullCol(col)) {
            for (var i = 0; i < this.ROWS; i += 1) {
                if (this.board[i][col] === -1) {
                    this.board[i][col] = this.player;
                    this.winner = this.wonGame(i, col);
                    break;
                }
            }
            this.switchPlayer();
        }
    }

    this.whoWon = function() {
        return this.winner;
    }

    this.isWon = function() {
        return this.winner != -1;
    }

    // === Helper Methods === 

    this.switchPlayer = function() {
        this.player = 1 - this.player;
    }

    this.wonGame = function(row, col) {
        if (this.horizontalCheck(row, col) ||
                this.verticalCheck(row, col) ||
                this.diagonalCheck(row, col)) {
            return this.player;
        } else {
            return -1;
        }
    }

    this.getPiece = function(row, col) {
        return this.board[row][col];
    }

    this.fullCol = function(col) {
        return this.board[this.ROWS - 1][col] != -1;
    }

    this.horizontalCheck = function(row, col) {
        var count = 0;

        for (var i = col; i >= 0; i -= 1) {
            if (this.board[row][i] != this.player) {
                break;
            }
            count += 1;
        }
        for (var j = col + 1; j < this.COLUMNS; j += 1) {
            if (this.board[row][j] != this.player) {
                break;
            }
            count += 1;
        }
        return (count >= 4);
    }

    this.verticalCheck = function(row, col) {
        var count = 0;

        for (var i = row; i >= 0; i -= 1) {
            if (this.board[i][col] != this.player) {
                break;
            }
            count += 1;
        }
        return (count >= 4);
    }

    this.diagonalCheck = function(row, col) {
        var count = 0;
        var i = row;
        var j = col;
        
        while (i >= 0 && j >= 0) {
            if (this.board[i][j] != this.player) {
                break;
            }
            count += 1;
            i--;
            j--;
        }
        i = row + 1;
        j = col + 1;
        while (i < this.COLUMNS && j < this.COLUMNS) {
            if (this.board[i][j] != this.player) {
                break;
            }
            count += 1;
            i++;
            j++;
        }

        if (count >= 4) {
            return true;
        } else {
            count = 0;
        }

        i = row;
        j = col;
        while (i < this.COLUMNS && j >= 0) {
            if (this.board[i][j] != this.player) {
                break;
            }
            count += 1;
            i++;
            j--;
        }
        i = row - 1;
        j = col + 1;
        while (i >= 0 && j < this.COLUMNS) {
            if (this.board[i][j] != this.player) {
                break;
            }
            count += 1;
            i--;
            j++;
        }

        return count >= 4;
    }
}

// var c4 = new Game();
module.exports = new Game();
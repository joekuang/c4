package c4;

class CBoard {

	private int[][] _board;
	private int _turn;
	private int _winner;
	// private final int black = -1;
	// private final int red = 1;

	CBoard() {
		_board = new int[8][8];
		_turn = 1;
	}

	void newGame() {
		_board = new int[8][8];
		_turn = -1 * _turn;
		_winner = 0;
	}

	void placePiece(int piece, int col) {
		checkCol(col);
		int row;

		for (int i = 0; i < _board[col].length; i++) {
			if (_board[col][i] == 0) {
				_board[col][i] = piece;
				row = i;
				break;
			}
		}

		_winner = checkWin(piece, row, col);
	}

	int checkWin(int piece, int row, int col) {
		if (horizontalCheck(piece, row, col) ||
				verticalCheck(piece, row, col) ||
				diagonalCheck(piece, row, col)) {
			return piece;
		} else {
			return 0;
		}
	}


	/** === Helper Methods === */

	private void checkCol(int col) {
		// Later.
	}

	private boolean horizontalCheck(int piece, int row, int col) {
		int count = 1;

		for (int i = col - 1; i >= 0; i--) {
			if (_board[i][row] != piece) {
				break;
			}
			count += 1;
		}
		for (int j = col + 1; j <= 7; j++) {
			if (_board[j][row] != piece) {
				break;
			}
		}
		return (count >= 4);
	}

	private boolean verticalCheck(int piece, int row, int col) {
		int count = 1;

		for (int i = row - 1; i >= 0; i--) {
			if (_board[col][i] != piece) {
				break;
			}
			count += 1;
		}
		return (count >= 4);
	}

	private boolean diagonalCheck(int piece, int row, int col) {
		int count = 0;
		int i = col;
		int j = row;
		
		while (i >= 0 && j >= 0) {
			if (_board[i][j] != piece) {
				break;
			}
			count += 1;
			i--;
			j--;
		}
		i = col;
		j = row;
		while (i <= 7 && j <= 7) {
			if (_board[i][j] != piece) {
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

		i = col;
		j = row;
		while (i <= 7 && j >= 0) {
			if (_board[i][j] != piece) {
				break;
			}
			count += 1;
			i++;
			j--;
		}
		i = col;
		j = row;
		while (i >= 0 && j <= 7) {
			if (_board[i][j] != piece) {
				break;
			}
			count += 1;
			i--;
			j++;
		}

		return (count >= 4);
	}



}
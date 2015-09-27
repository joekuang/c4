package c4;

class CBoard {

	private int[][] _board;
	private int _first;
	private int _turn;
	private int _winner;
	// private final int black = -1;
	// private final int red = 1;

	protected final int ROWS = 6;
	protected final int COLUMNS = 7;

	CBoard() {
		_board = new int[ROWS][COLUMNS];
		_turn = _first = 1;
	}

	int getPiece(int row, int col) {
		return _board[row][col];
	}

	void newGame() {
		_board = new int[ROWS][COLUMNS];
		_first = 1 - 0;
		_turn = _first;
		_winner = 0;
	}

	void placePiece(int piece, int row) {
		checkrow(row);
		int col = 0;

		for (int i = 0; i < _board[row].length; i++) {
			if (_board[row][i] == 0) {
				_board[row][i] = piece;
				col = i;
				break;
			}
		}

		_winner = checkWin(piece, col, row);
	}

	int checkWin(int piece, int col, int row) {
		if (horizontalCheck(piece, col, row) ||
				verticalCheck(piece, col, row) ||
				diagonalCheck(piece, col, row)) {
			return piece;
		} else {
			return 0;
		}
	}


	/** === Helper Methods === */


	private void checkrow(int row) {
		// Later.
	}

	private boolean horizontalCheck(int piece, int col, int row) {
		int count = 1;

		for (int i = row - 1; i >= 0; i--) {
			if (_board[i][col] != piece) {
				break;
			}
			count += 1;
		}
		for (int j = row + 1; j <= 7; j++) {
			if (_board[j][col] != piece) {
				break;
			}
		}
		return (count >= 4);
	}

	private boolean verticalCheck(int piece, int col, int row) {
		int count = 1;

		for (int i = col - 1; i >= 0; i--) {
			if (_board[row][i] != piece) {
				break;
			}
			count += 1;
		}
		return (count >= 4);
	}

	private boolean diagonalCheck(int piece, int col, int row) {
		int count = 0;
		int i = row;
		int j = col;
		
		while (i >= 0 && j >= 0) {
			if (_board[i][j] != piece) {
				break;
			}
			count += 1;
			i--;
			j--;
		}
		i = row;
		j = col;
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

		i = row;
		j = col;
		while (i <= 7 && j >= 0) {
			if (_board[i][j] != piece) {
				break;
			}
			count += 1;
			i++;
			j--;
		}
		i = row;
		j = col;
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
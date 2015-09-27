package c4;

class CBoard {

	private int[][] _board;
	private int _first;
	protected int player;
	private int _winner;
	// private final int black = -1;
	// private final int red = 1;

	protected final int ROWS = 6;
	protected final int COLUMNS = 7;

	CBoard() {
		_board = new int[ROWS][COLUMNS];
		player = _first = 1;
	}

	int getPiece(int row, int col) {
		return _board[row][col];
	}

	void newGame() {
		_board = new int[ROWS][COLUMNS];
		player = _first = -1 * _first;
		_winner = 0;
	}

	void switchPlayer() {
		player = -1 * player;
	}


	void placePiece(int col) {
		for (int i = 0; i < ROWS; i++) {
			if (_board[i][col] == 0) {
				_board[i][col] = player;
				col = i;
				break;
			}
		}
		switchPlayer();
	}

	int checkWin(int col, int row) {
		if (horizontalCheck(col, row) ||
				verticalCheck(col, row) ||
				diagonalCheck(col, row)) {
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
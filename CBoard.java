package c4;

class CBoard {

	private int[][] _board;
	private int _first;
	protected int player;
	private int _winner;

	protected static final int ROWS = 6;
	protected static final int COLUMNS = 7;

	CBoard() {
		_board = new int[ROWS][COLUMNS];
		player = _first = 1;
	}

	int getPiece(int row, int col) {
		return _board[row][col];
	}

	void newGame() {
		for (int i = 0; i < ROWS; i++) {
			for (int j = 0; j < COLUMNS; j++) {
				_board[i][j] = 0;
			}
		}
		player = _first = -1 * _first;
		_winner = 0;
	}

	void switchPlayer() {
		player = -1 * player;
	}


	void placePiece(int col) {
		if (! fullCol(col)) {
			for (int i = 0; i < ROWS; i++) {
				if (_board[i][col] == 0) {
					_board[i][col] = player;
					_winner = wonnered(i, col);
					break;
				}
			}
			switchPlayer();
		}
	}

	int wonnered(int row, int col) {
		if (horizontalCheck(row, col) ||
				verticalCheck(row, col) ||
				diagonalCheck(row, col)) {
			return player;
		} else {
			return 0;
		}
	}




	/** === Helper Methods === */


	private boolean fullCol(int col) {
		return (_board[ROWS - 1][col] != 0);
	}

	private boolean horizontalCheck(int row, int col) {
		int count = 0;

		for (int i = col; i >= 0; i--) {
			if (_board[row][i] != player) {
				break;
			}
			count += 1;
		}
		for (int j = col + 1; j < COLUMNS; j++) {
			if (_board[row][j] != player) {
				break;
			}
			count += 1;
		}
		return (count >= 4);
	}

	private boolean verticalCheck(int row, int col) {
		int count = 0;

		for (int i = row; i >= 0; i--) {
			if (_board[i][col] != player) {
				break;
			}
			count += 1;
		}
		return (count >= 4);
	}

	private boolean diagonalCheck(int row, int col) {
		int count = 0;
		int i = row;
		int j = col;
		
		while (i >= 0 && j >= 0) {
			if (_board[i][j] != player) {
				break;
			}
			count += 1;
			i--;
			j--;
		}
		i = row + 1;
		j = col + 1;
		while (i < COLUMNS && j < COLUMNS) {
			if (_board[i][j] != player) {
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
		while (i < COLUMNS && j >= 0) {
			if (_board[i][j] != player) {
				break;
			}
			count += 1;
			i++;
			j--;
		}
		i = row - 1;
		j = col + 1;
		while (i >= 0 && j < COLUMNS) {
			if (_board[i][j] != player) {
				break;
			}
			count += 1;
			i--;
			j++;
		}

		return (count >= 4);
	}



}
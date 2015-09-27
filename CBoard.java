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

		_winner = checkWin(row, col);
	}

	int checkWin(int piece, int row, int col) {
		if (horizontalCheck(row) ||
				verticalCheck(col) ||
				diagonalCheck(row, col)) {
			return piece;
		} else {
			return 0;
		}
	}

	private boolean rowCheck(int row) {
		
	}

	/** === Helper Methods === */

	private void checkCol(int col) {
		// Later.
	}

}
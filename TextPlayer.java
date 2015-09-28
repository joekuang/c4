package c4;

import java.util.Scanner;
import java.util.NoSuchElementException;

class TextPlayer extends Player {

	private Scanner _inp;

	TextPlayer(CBoard game) {
		super(game);
		_inp = new Scanner(System.in);
	}

	void play() {
		// _game.placePiece(1);
		// display();
		while (tru) {
			display();

		}
	}

	void display() {
		System.out.println("\tCHOOSE A COLUMN\t");
		System.out.print("\t");
		for (int k = 0; k < CBoard.COLUMNS; k++) {
			System.out.print(String.format(".%d.", k));
		}
		System.out.println();
		for (int i = CBoard.ROWS - 1; i >= 0; i--) {
			System.out.print(String.format("ROW %d: \t", i));
			for (int j = 0; j < CBoard.COLUMNS; j++) {
				if (_game.getPiece(i, j) == 0) {
					System.out.print(" - ");
				} else {
					System.out.print(" " + 
							(_game.getPiece(i, j) == 1? 1: 2)
							+ " ");
				}
			}
			System.out.println();
		}
	}

	private int input() {
		while (true) {
            System.err.print(String.format("Player %d's turn > ",
            								(_game.player == 1? 1: 2)));
            System.err.flush();
            if (! _input.hasNext()) {
            	break;
            }
            
	}

}
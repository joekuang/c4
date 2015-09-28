package c4;

import java.util.Scanner;
import java.util.NoSuchElementException;

class TextPlayer extends Player {

	private Scanner _input;

	TextPlayer(CBoard game) {
		super(game);
		_input = new Scanner(System.in);
	}

	void play() {
		// _game.placePiece(1);
		// display();
		while (true) {
			display();
			if (_game.isWonned()) {
				System.out.println(String.format("Player %d Wins.", (_game.whoWonned() == 1? 1: 2)));
				break;
			}
			int col = Integer.parseInt(input());
			_game.placePiece(col);
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

	private String input() {
		while (true) {
            System.err.print(String.format("Player %d's turn > ",
            								(_game.player == 1? 1: 2)));
            System.err.flush();
            if (! _input.hasNext()) {
            	break;
            }
            try {
            	String line = _input.nextLine();
            	Integer.parseInt(line);
            	return line;
            } catch (NumberFormatException e) {
            	System.out.println("Improper input, choose a column from 0 - 7.");
            }
        }
        return null;
	}

}
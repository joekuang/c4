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
		_game.placePiece(1, 1);
		_game.placePiece(1, 1);
		_game.placePiece(1, 1);
		_game.placePiece(1, 1);
		display();
	}

	void display() {
		for (int i = 7; i >= 0; i--) {
			for (int j = 0; j <= 7; j++) {
				if (_game.getPiece(i, j) == 0) {
					System.out.print(" - ");
				} else {
					System.out.print(" " + _game.getPiece(i, j) + " ");
				}
			}
			System.out.println();
		}
	}

}
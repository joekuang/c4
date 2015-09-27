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
		
	}

}
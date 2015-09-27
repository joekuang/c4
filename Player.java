package c4;

abstract class Player {

	protected CBoard _game;

	protected Player (CBoard game) {
		_game = game;
	}

	abstract void play();

}
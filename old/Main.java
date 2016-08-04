package c4;

public class Main {

	public static void main(String... args) {
		CBoard game = new CBoard();
		Player p = new TextPlayer(game);
		p.play();
	}

}
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require("socket.io")(http);
var c4 = require("./game");
var clients = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/c4.html');
});

io.on("connection", function(socket) {
    console.log("A user has connected.")
    clients.push(socket.id);
    console.log(clients);

    startGame();
    display();
    
    socket.on("disconnect", function() {
        console.log("A user has disconnected");
        var index = clients.indexOf(socket.id);
        clients.splice(index, 1);
        console.log(clients);
        
        if (c4.inGame() && index < 2) {
            c4.endGame();
            restartGame("A player has left.");
        }
    });

    socket.on('place', function(msg) {
        if (c4.ongoing) {
            var id = msg.slice(1);
            if (clients.indexOf(id) === c4.player) {
                var col = parseInt(msg[0]);
                c4.placePiece(col);
                display();
                if (c4.isWon()) {
                    endGame();
                    restartGame();
                } else if (c4.boardFull()) {
                    endGame();
                    restartGame('Neither player wins.');
                }
            }
        }
    });

});

http.listen(process.env.PORT || 3000, function(){
    console.log('Starting C4');
    console.log(__dirname);
});

function startGame() {
    if (clients.length >= 2 && !c4.inGame() && !c4.isWon()) {
        clearDisplay();
        c4.newGame();
    }
}

function restartGame(status) {
    status = status || '';
    if (status) {
        io.emit('status', status);
    }
    io.emit('turn', "Next game begins soon...");
    var prev = clients.shift();
    if (prev) {
        clients.push(prev);
    }
    setTimeout(function() {
        startGame();
        display();
    }, 10000);

}

function spectators() {
    for (var i = 2; i < clients.length; i += 1) {
        io.to(clients[i]).emit('status', "Spectating...");
    }
}

function display() {
    if (c4.isWon()) {
        var players = ['Red', 'Yellow'];
        io.emit('status', players[c4.whoWon()] + " wins.");
        io.emit('turn', "Next game begins soon...");
        displayBoard();
    } else if (c4.inGame()) {
        io.to(clients[0]).emit('status', 'Playing as RED');
        io.to(clients[1]).emit('status', 'Playing as YELLOW');
        io.emit('turn', player[c4.player] + "'s turn.");
        spectators();
        displayBoard();
    } else {
        io.emit('wait');
    }
}

function displayBoard() {
    var col_str = [];
    for (var j = 0; j < c4.COLUMNS; j += 1) {
        var tmp = [];
        for (var i = 0; i < c4.ROWS; i += 1) {
            var p = c4.getPiece(i, j);
            if (p === -1) {
                break;
            } else if (p === 0) {
                tmp.push('R');
            } else if (p === 1) {
                tmp.push('Y');
            }
        }
        col_str.push(tmp.join(''));
    }
    io.emit('display', col_str.join('-'));
}

function clearDisplay() {
    io.emit('clear');
}

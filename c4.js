var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require("socket.io")(http);
var c4 = require("./game");
var clients = [];
var icons = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/c4.html');
});

io.on("connection", function(socket) {
    choose(socket);

    socket.on("chosen", function(icon) {
        var taken = false;
        for (var key in icons) {
            if (icon === icons[key]) {
                taken = true;
            }
        }
        if (!taken && clients.indexOf(socket.id) === -1 && !icons[socket.id]) {
            console.log("A user has connected.")
            clients.push(socket.id);
            icons[socket.id] = icon;
            console.log(icons);
            console.log(clients);
            io.to(socket.id).emit('start', icon);
            startGame();
            display();
        } else {
            io.to(socket.id).emit('taken');
            choose(socket);
        }
    
    });

    
    socket.on("disconnect", function() {
        var index = clients.indexOf(socket.id);
        if (index >= 0) {
            console.log("A user has disconnected");
            delete icons[socket.id];
            clients.splice(index, 1);
            console.log(icons);
            console.log(clients);
            displayQueue();
            if (c4.inGame() && index < 2) {
                c4.endGame();
                restartGame("A player has left.");
            }
        }
    });

    socket.on('place', function(msg) {
        if (c4.inGame()) {
            var id = msg.slice(1);
            if (clients.indexOf(id) === c4.currPlayer()) {
                var col = parseInt(msg[0]);
                c4.placePiece(col);
                display();
                if (c4.isWon()) {
                    c4.endGame();
                    restartGame();
                } else if (c4.boardFull()) {
                    c4.endGame();
                    restartGame('Neither player wins.');
                }
            }
        }
    });

    socket.on('idle', function(id) {
        var index = clients.indexOf(id);
        if (index != -1) {
            if (c4.inGame() && index === c4.currPlayer()) {
                // io.to(id).emit('status', "You have been disconnected.");
                io.to(id).emit('turn', "An ongoing turn has idle timeout of 5 minutes.");
                socket.disconnect();
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
        emitClients('status', status);
    }
    emitClients('turn', "Next game begins soon...");
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
    var players = ['Red', 'Yellow'];
    if (c4.isWon()) {
        emitClients('status', players[c4.whoWon()] + " wins.");
        emitClients('turn', "Next game begins soon...");
        displayBoard();
    } else if (c4.inGame()) {
        io.to(clients[0]).emit('status', 'Playing as RED');
        io.to(clients[1]).emit('status', 'Playing as YELLOW');
        emitClients('turn', players[c4.currPlayer()] + "'s turn.");
        spectators();
        displayBoard();
    } else {
        clearDisplay();
        emitClients('wait');
    }
    displayQueue();
}

function displayQueue() {
    var queue = [];
    for (var i = 0; i < clients.length; i += 1) {
        queue.push(icons[clients[i]]);
    }
    emitClients('queue', queue.join('-'));
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
    emitClients('display', col_str.join('-'));
}

function clearDisplay() {
    emitClients('clear');
}

function emitClients(e, msg) {
    for (var i = 0; i < clients.length; i += 1) {
        io.to(clients[i]).emit(e, msg);
    }
}

function choose(socket) {
    var used = [];
    for (var key in icons) {
        used.push(icons[key]);
    }
    io.to(socket.id).emit('choices', used.join('-'));
}


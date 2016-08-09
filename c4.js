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

    // Push user socket id to CLIENTS
    console.log("A user has connected.")
    clients.push(socket.id);
    console.log(clients);

    // Attempt to start a new game
    startNewGame();
    // Display
    display();
    
    socket.on("disconnect", function() {
        // On disconnect, remove socket id from CLIENTS
        console.log("A user has disconnected");
        var index = clients.indexOf(socket.id);
        clients.splice(index, 1);

        // If a ongoing player disconnects.
        if (c4.ongoing && index < 2) {
            // Move previous player to end of line.
            var prev = clients.shift();
            if (prev) {
                clients.push(prev);
            }
            // Start a new game with existing clients.
            startNewGame();
            display();
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
                    c4.ongoing = false;
                    var players = ['Red', 'Yellow'];
                    io.emit('won', players[c4.whoWon()]);
                    var prev = clients.shift();
                    if (prev) {
                        clients.push(prev);
                    }
                    setTimeout(startNewGame, 10000);
                    display();
                } else if (c4.boardFull()) {
                    c4.ongoing = false;
                    io.emit('won', 'Neither player');
                    var prev = clients.shift();
                    if (prev) {
                        clients.push(prev);
                    }
                    setTimeout(startNewGame, 10000);
                    display();
                }
            }
        }
    });


});

http.listen(process.env.PORT || 3000, function(){
  console.log('Starting C4');
  console.log(__dirname);
});

function startNewGame() {
    if (!c4.ongoing) {
        c4.newGame();
        clearDisplay();
        c4.ongoing = false;
        if (clients.length >= 2) {
            var player = ['Red', 'Yellow'];
            io.to(clients[0]).emit('start', 'Playing as RED');
            io.to(clients[1]).emit('start', 'Playing as YELLOW');
            c4.ongoing = true;
            io.emit('turn', player[c4.player]);
        }
    }
}

function spectators() {
    for (var i = 2; i < clients.length; i += 1) {
        io.to(clients[i]).emit('spectate');
    }
}

function display() {
    if (c4.ongoing) {
        var player = ['Red', 'Yellow'];
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

        var display_msg = col_str.join('-');
        io.emit('display', display_msg);
        io.emit('turn', player[c4.player]);
        spectators();
    } else {
        io.emit('wait');
    }
}

function clearDisplay() {
    io.emit('clear');
}
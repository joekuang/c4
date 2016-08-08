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

    // Notify spectators;
    spectators();

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
            spectators();
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
                    setTimeout(startNewGame, 10000);
                }
            }
        }
    });


});

http.listen(3000, function(){
  console.log('listening on *:3000');
  console.log(__dirname);
});

function startNewGame() {
    c4.newGame();
    clearDisplay();
    c4.ongoing = false;
    if (clients.length >= 2) {
        io.to(clients[0]).emit('start', 'Playing as RED');
        io.to(clients[1]).emit('start', 'Playing as YELLOW');
        c4.ongoing = true;
    } else {
        io.emit('wait');
    }
}

function spectators() {
    for (var i = 2; i < clients.length; i += 1) {
        io.to(clients[i]).emit('spectate');
    }
}

function display() {
    if (c4.ongoing) {
        var col_num = [0,0,0,0,0,0,0];
        for (var j = 0; j < c4.COLUMNS; j += 1) {
            for (var i = 0; i < c4.ROWS; i += 1) {
                if (c4.getPiece(i, j) === -1) {
                    break;
                }
                col_num[j] += 1;
            }
        } 

        var col_first = [];
        for (var j = 0; j < c4.COLUMNS; j += 1) {
            var p = c4.getPiece(0, j);
            if (p === -1) {
                col_first.push('E');
            } else if (p === 0) {
                col_first.push('R');
            } else if (p === 1) {
                col_first.push('Y');
            }
        }

        var col_str = [];
        for (var k = 0; k < col_num.length; k += 1) {
            col_str.push(col_first[k] + col_num[k].toString());
        }
        var display_msg = col_str.join('-');
        console.log(display_msg);
        io.emit('display', display_msg);
    }
}

function clearDisplay() {
    io.emit('clear');
}
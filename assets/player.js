$(document).ready(function() {
    var socket = io();

    socket.on('connect', function() {
        console.log('Connected');
        socket.emit('ready', socket.id);
    })

    socket.on('start', function(msg) {
        $('.notification').text(msg);
    });

    socket.on('wait', function() {
        $('.notification').text('Waiting for players...');
    })

    socket.on('spectate', function() {
        $('.notification').text('Spectating...');
    });

    socket.on('won', function(msg) {
        $('.notification').text(msg + " wins. Next game starts in 10 seconds.");
    });

    socket.on('clear', function() {
        $('.piece').each(function() {
            if ($(this).hasClass('fall')) {
                $(this).removeClass('fall');
            }
            if ($(this).hasClass('red')) {
                $(this).removeClass('red');
            }
            if ($(this).hasClass('yellow')) {
                $(this).removeClass('yellow');
            }
        });
    });

    socket.on('display', function(msg) {
        var cols = $('.board').find('.col').toArray();
        var col_display = msg.split('-');
        var col_first = [];
        var col_num = [];
        for (var i = 0; i < col_display.length; i += 1) {
            col_first.push(col_display[i][0]);
            col_num.push(parseInt(col_display[i][1], 10));
        }

        var players = ['R', 'Y'];
        var p_class = ['red', 'yellow'];
        for (var j = 0; j < cols.length; j += 1) {
            // console.log($(cols[i]).attr("class").toString());
            if (col_num[j] === 0) {
                continue;
            } else {
                var pieces = $(cols[j]).find('.piece').toArray();
                pieces.reverse();
                var p = players.indexOf(col_first[j]);
                for (var k = 0; k < col_num[j]; k += 1) {
                    $(pieces[k]).addClass(p_class[p]);
                    p = 1 - p;
                    $(pieces[k]).addClass('fall');
                }
            }
        }

    });

    $(".col").click(function(e) {
        var num = $(this).attr("class").toString().split(' ')[1];
        socket.emit('place', num + '/#' + socket.id);
        // console.log(num + '/#' + socket.id);
        e.stopPropagation();
    });

});
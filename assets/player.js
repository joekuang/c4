// Idle Timer
var timeout = 0;

$(document).ready(function() {
    var socket = io();

    socket.on('connect', function() {
        console.log('Connected');
        // socket.emit('ready', socket.id);
    })

    socket.on('status', function(msg) {
        $('.status').text(msg);
    });

    socket.on('turn', function(msg) {
        $('.turn').text(msg);
    });

    socket.on('wait', function() {
        $('.status').text('Waiting for players...');
        $('.turn').text('');
    })

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
        var players = { 'R':'red', 'Y':'yellow'};

        for (var i = 0; i < col_display.length; i += 1) {
            var tmp = col_display[i];
            var pieces = $(cols[i]).find('.piece').toArray();
            pieces.reverse();
            for (var j = 0; j < tmp.length; j += 1) {
                if (!$(pieces[j]).hasClass('fall')) {
                    $(pieces[j]).addClass('fall');
                    $(pieces[j]).addClass(players[tmp[j]]);
                }
            }
        }

    });

    $(".col").click(function(e) {
        var num = $(this).attr("class").toString().split(' ')[1];
        socket.emit('place', num + '/#' + socket.id);
        e.stopPropagation();
    });


    // var timer = setInterval(function() {
    //     timeout += 1;
    //     if (timeout == 6) {
    //         socket.emit('idle');
    //         console.log('idle');
    //     }
    // }, 10000);

    // $(this).mousemove(function() { 
    //     timeout = 0;
    // });

    // $(this).keypress(function() { 
    //     timeout = 0;
    // });

});

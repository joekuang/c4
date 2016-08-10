// Idle Timer
var timeout = 0;
// Choose
var chosen = false;

$(document).ready(function() {
    var socket = io();

    socket.on('connect', function() {
        console.log('Connected');
    });

    socket.on('choices', function(msg) {
        $('.choice').each(function() {
            $(this).show();
        });
        var used = msg.split('-');
        for (var i = 0; i < used.length; i += 1) {
            if (used[i]) {
                $(document.getElementById(used[i])).hide();
            }
        }
        if (used.length <= 12) {
            $(".prompt").text("Choose an icon!");
        } else {
            $(".prompt").text("Room currently full; check back later!");
            chosen = true;
        }
    });

    socket.on('taken', function() {
        $('.prompt').text('Icon has already been taken, choose another!')
    });

    socket.on('start', function(choice) {
        chosen = true;
        $(".choice").not($(document.getElementById(choice))).each(function() {
            $(this).hide();
        });
        $(".choose").fadeOut(1500, function() {
            $(this).hide();
        });
        setTimeout(function() {
            $('.notification').show();
            $('.board').show();
            $('.queue').show();
        }, 1500);
    });

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

    socket.on('queue', function(msg) {
        var queue = msg.split('-');
        var icons = $('.queue').find('.icon').toArray();

        $('.icon').each(function() { 
            $(this).attr('class', 'icon');
            $(this).removeAttr('id');
        });

        for (var i = 0; i < queue.length; i += 1) {
            $(icons[i]).attr('id', queue[i]);
            if (i === 0) {
                $(icons[i]).addClass('wrap-red');
            } else if (i === 1) {
                $(icons[i]).addClass('wrap-yellow');
            }
        }
    });

    $(".choice").click(function(e) {
        if (!chosen) {
            var icon = $(this).attr("id");
            socket.emit('chosen', icon);
        }
    });

    $(".col").click(function(e) {
        var num = $(this).attr("class").toString().split(' ')[1];
        socket.emit('place', num + '/#' + socket.id);
        console.log(num);
        e.stopPropagation();
    });


    var timer = setInterval(function() {
        timeout += 1;
        if (timeout >= 4) {
            socket.emit('idle', '/#' + socket.id);
            console.log('Idle for 4 minutes.');
        }
    }, 60000);

    $(this).mousemove(function() { 
        timeout = 0;
    });

    $(this).keypress(function() { 
        timeout = 0;
    });

});

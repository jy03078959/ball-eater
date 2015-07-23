(function (ctx) {
    "use strict";
    var Game = cc.Class.extend({
        MapInfo: {
            size:{width:500,height:500},
            playerCache: {}
        },
        ctor: function () {
            var me = this;
            me.initUi();
        },
        init: function () {
            var me = this;
            me.initSocket();
            me.initGame();
            me.initUi();
        },
        initUi: function () {
            var me = this;
            $("#btn_login").click(function () {
                me.joinGame({
                    name: $('#txt_player_name').val()
                })
            })
        },
        initGame: function () {
            var me = this;
            var scene = new MyScene();
            scene.init();
            me.setGameLayer(scene.baseLayer);
            cc.director.runScene(scene);
        },
        getWinSize: function () {
            var me = this;
            var size = cc.director.getWinSize();
            return size;
        },
        getMapSize: function () {
            var me = this;
            return me.MapInfo.size;
        },
        setGameLayer: function (layer) {
            var me = this;
            me.gameLayer = layer;
        },
        initSocket: function () {
            var me = this;

            var host = "172.16.1.186";
            var ws = null;
            ws = new WebSocket('ws://' + host, 'viga_v1');
            ws.onopen = function () {
                console.log('connected');
                me.ws_send({action: 'sync'});
            };

            ws.onerror = function (error) {
                console.error(error);
            };

            ws.onmessage = function (message) {
                var json = null;
                try {
                    json = JSON.parse(message.data);
                } catch (e) {
                    return;
                }
                // handle incoming message
                console.log(json);
                var action = json && json.action ? json.action : '';
                if ($.isFunction(me["ws_" + action])) {
                    me["ws_" + action](json)
                }

            };
            me.ws = ws;
        },
        ws_sync: function (json) {
            var me = this;
            me.MapInfo.size.height = json.info.height;
            me.MapInfo.size.width = json.info.width;
            me.gameLayer.setContentSize(me.MapInfo.size);
            me.MapInfo.playerCache = {};
            for (var id in json.info.players) {
                var player2 = json.info.players[id];
                me.addPlayer(player2);
            };
        },
        ws_quit: function (json) {
            var me = this;
            me.removeOnePlayer(json.player);
        },
        ws_update: function (json) {
            var me = this;
            var circle = me.MapInfo.playerCache[json.player];
            circle.updataStatus(json.info);
        },
        ws_play: function (json) {
            var me = this;
        },
        ws_join: function (json) {
            var me = this;
            me.removeOnePlayer(json.info.id);
            me.myInfo = json.info;
            me.addPlayer(me.myInfo);
        },
        ws_send: function (json) {
            var me = this;
            me.ws.send(JSON.stringify(json));
        },
        joinGame: function (data) {
            var me = this;
            me.ws_send({
                action: 'join',
                name: name,
                color: '#f00'
            });
        },
        addPlayer: function (player) {
            var me = this;
            var player = new Player(player);
            var info = player.getDataInfo();
            me.MapInfo.playerCache[info.id] = player;
            me.gameLayer.addPlayer(player);
            if (me.myInfo && me.myInfo.id==info.id) {
                me.gameLayer.follow(player)
            }
            return player;
        },
        getMyPlayer: function () {
            var me = this;
            if (me.myInfo) {
                return me.MapInfo.playerCache[me.myInfo.id];
            }
        },
        changeDirection: function (pos) {
            var me = this;
            var myPlayer = me.getMyPlayer();
            if (myPlayer) {
                myPlayer.upDataDirection(pos);
                /*me.ws_send({
                    action: 'move',
                    speedx: speed.x,
                    speedy: speed.y
                });*/
            }
        },
        removeOnePlayer: function (id) {
            var me = this;
            var player = me.MapInfo.playerCache[id];
            if (player) {
                player.dispose();
            }
            delete me.MapInfo.playerCache[id];
        }

    });
    ctx.Game = new Game();
})(this)

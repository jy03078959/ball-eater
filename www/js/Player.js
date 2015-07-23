/**
 * Created by wang6 on 2015/7/21.
 */
var Player = cc.Node.extend({
    minspeed:1,
    maxspeed:100,
    ctor: function (data) {
        var me = this;
        this._super(data);
        me.ema = EMA.getProxy();
        me.baseData = data;
        me.updataStatus(data);

        me.scheduleUpdate();
    },
    init: function () {
        var me = this;
        me.draw = new cc.DrawNode();
        this.addChild(me.draw);
        var msize = Game.getMapSize();
        me.moveRect = cc.rect(0,0,msize.width,msize.height);
    },
    onExit: function () {
        var me = this;
        this._super();
        me.ema.dispose();
    },
    getDataInfo: function () {
        var me = this;
        return me.baseData;
    },
    updataStatus: function (data) {
        var me = this;
        me.baseData = data;
        me.setPosition(data.x,data.y);
    },
    update: function (dt) {
        var me = this;
        if (me.draw) {
            me.draw.clear();
            var size = me.getContentSize();
            me.draw.drawDot(cc.p(size.width / 2, size.height / 2), me.baseData.r, cc.color(0, 0, 255));
        }
        if (me.speed&&me.moveRect) {
            var x = me.x+me.speed.x;
            var y = me.y+me.speed.y;
            x = Math.max(x,me.moveRect.x);
            y = Math.max(y,me.moveRect.y);
            x = Math.min(x,me.moveRect.x+me.moveRect.width);
            y = Math.min(y,me.moveRect.y+me.moveRect.height);
            me.x = x;
            me.y = y;
        }
    },
    upDataDirection: function (pos) {
        var me = this;
        me.speed = me.getSpeed(pos);
    },
    getSpeed: function (pos) {
        var me = this;
        var winSize = Game.getWinSize();
        var speed_scale = 10;
        var speedx = (pos.x - winSize.width / 2);
        var speedy = (pos.y - winSize.height / 2);
        var speed = cc.pNormalize(cc.p(speedx,speedy));
        speed = cc.pMult(speed,speed_scale);
        return speed;
    },

    dispose: function () {
        var me = this;
        me.removeFromParent()
    }
})
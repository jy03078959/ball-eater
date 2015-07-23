/**
 * Created by wang6 on 2015/7/21.
 */
var BaseLayer = cc.LayerColor.extend({
    ctor: function (data) {
        var me = this;
        this._super(data);
    },
    init: function () {
        var me = this;
        this.scheduleUpdate();
        me.setContentSize(Game.getMapSize());
        if ('mouse' in cc.sys.capabilities)
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (event) {
                    if (event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().processEvent(event);
                }
            }, this);
        if (cc.sys.capabilities.hasOwnProperty('touches')) {
            cc.eventManager.addListener({
                prevTouchId: -1,
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: function (touches, event) {
                    var touch = touches[0];
                    if (this.prevTouchId != touch.getID())
                        this.prevTouchId = touch.getID();
                    else event.getCurrentTarget().processEvent(touches[0]);
                }
            }, this);
        }
    },
    addPlayer: function (player) {
        var me = this;
        me.addChild(player);
        player.init();
    },
    follow: function (player) {
        var me = this;
        var msize = Game.getMapSize();
        var wsize = Game.getWinSize();
        me.stopAllActions();
        this.runAction(cc.follow(player, cc.rect(0, 0, msize.width, msize.height)));
    },
    /**
     * 处理touch事件
     * @param event
     */
    processEvent: function (event) {
        console.log(event);
        Game.changeDirection(event.getLocation());
        return true;
    },
    update: function (dt) {
        var me = this;

    }
});
var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var me = this;

    },
    init: function () {
        var me = this;
        var layer = new BaseLayer(cc.color(0,200,0));
        me.addChild(layer);
        layer.init();
        me.baseLayer = layer;
    }
});
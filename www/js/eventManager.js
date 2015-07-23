(function(ctx){

    var EventManager = cc.Class.extend({
        ctor: function() {
            this.events = [];
        },
        bind: function(type, fn) {
            if(type && typeof type === "string" && fn && fn.constructor && typeof fn === "function"){

                var handlers = this.events[type];
                if (!handlers) {
                    handlers = this.events[type] = [];
                }

                var i = handlers.length;
                while(i--) {
                    if(handlers[i] == fn) {
                        return false;
                    }
                }
                handlers.push(fn);
                return true;
            }
            return false;
        },
        unbind: function(type, fn) {

            if(type && type.constructor && type.constructor == String) {

                if(!fn) {
                    delete this.events[type];
                    return true;
                }else if(fn && typeof fn === "function"){
                    var handlers = this.events[type];
                    if(handlers && handlers.length) {
                        var i = handlers.length;
                        while(i--) {
                            if(handlers[i] == fn) {
                                handlers.splice(i,1);
                                break;
                            }
                        }
                        return true;
                    }
                    return false;
                }
            }
            return false;
        },
        clear:function(){
            var me = this;
            this.events = [];
        },
        fire: function(type) {
            var handlers;
            if(type && typeof type === "string" && (handlers = this.events[type]) && handlers.length){
                var fn;
                var i = 0;
                var len = arguments.length;
                //Debug.trace("Trigger <b>" + type + "</b> , " + handlers.length + ' handlers left');
                //增强性能
                if(len == 1) {
                    while ((fn = handlers[i++])) {
                        fn();
                    }
                }else if(len == 2) {
                    while ((fn = handlers[i++])) {
                        fn(arguments[1]);
                    }
                } else if(len == 3) {
                    while ((fn = handlers[i++])) {
                        fn(arguments[1], arguments[2]);
                    }
                } else if(len == 4) {
                    while ((fn = handlers[i++])) {
                        fn(arguments[1], arguments[2], arguments[3]);
                    }
                } else if(len == 5) {
                    while ((fn = handlers[i++])) {
                        fn(arguments[1], arguments[2], arguments[3], arguments[4]);
                    }

                } else if(len == 6) {
                    while ((fn = handlers[i++])) {
                        fn(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    }
                } else if(len == 7) {
                    while ((fn = handlers[i++])) {
                        fn(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                    }
                } else {
                    var params = [];
                    for(var i = 1; i < len; i++) params.push(arguments[i]);
                    while ((fn = handlers[i++])) {
                        fn.apply(document, params);
                    }
                }
                return true;
            }
            return false;
        },
        count: function(type) {
            var handlers = this.events[type];
            return handlers ? handlers.length : 0;
        },
        getProxy: function() {
            return new DisposeableEventManagerProxy(this);
        }
    });
    function DisposeableEventManagerProxy(msgslot) {
        this.msgslot = msgslot;
        this.msgs = [];
        var fire = msgslot.fire;
        var async = msgslot.async;
        this.fire = function(){fire.apply(msgslot, arguments)};
        this.async = function(){async.apply(msgslot, arguments)};
    }
    DisposeableEventManagerProxy.prototype = {
        bind: function(type, fn) {
            var result = this.msgslot.bind(type, fn);
            if(result) {
                this.msgs.push([type,fn]);
            }
            return result;
        },
        unbind: function(type, fn) {
            var msgslot = this.msgslot;
            var msgs = this.msgs;

            if(fn && typeof fn === "function") {
                var result = msgslot.unbind(type, fn);
                var i = msgs.length;
                while(--i >= 0){
                    if(msgs[i][0] == type && msgs[i][1] == fn) {
                        msgs.splice(i,1);
                    }
                }
                return result;
            }
            else{
                var i = this.msgs.length;
                while(i--){
                    if(msgs[i][0] == type) {
                        msgslot.unbind(type, msgs[i][1])
                        msgs.splice(i,1);
                    }
                }
                return true;
            }
        },
        dispose: function() {
            if(this.msgs == null) return;
            var msgs = this.msgs;
            var msgslot = this.msgslot;
            var i = msgs.length;
            while(i--){
                msgslot.unbind(msgs[i][0], msgs[i][1]);
            }
            this.msgslot = null;
            this.msgs = null;
        }
    };

//global Event Manager
    ctx.EMA = ctx.EMA || new EventManager();
})(this)


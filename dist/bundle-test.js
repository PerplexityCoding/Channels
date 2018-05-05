'use strict';

var Channel = /** @class */ (function () {
    function Channel(Channels, channelName) {
        this.handlersById = {};
        this.handlersByMessage = {};
        this.Channels = Channels;
        this.name = channelName;
    }
    Channel.prototype.on = function (message, cb) {
        var handler = {
            id: Channel.handlerIdCpt++,
            cb: cb
        };
        this.handlersById[handler.id] = handler;
        var handlers = this.handlersByMessage[message];
        if (!handlers) {
            handlers = [];
            this.handlersByMessage[message] = handlers;
        }
        handlers.push(handler.id);
        return handler.id;
    };
    Channel.prototype.emit = function (message, data) {
        var handlers = this.handlersByMessage[message];
        if (handlers != null) {
            for (var i = 0; i < handlers.length; i++) {
                var handlerId = handlers[i];
                var handler = this.handlersById[handlerId];
                if (handler) {
                    (function (handler) {
                        setTimeout(function () {
                            handler.cb(data);
                        }, 0);
                    })(handler);
                }
                else {
                    handlers.splice(i, 1);
                    i--;
                }
            }
        }
        return handlers != null && handlers.length > 0;
    };
    Channel.prototype.off = function (handlerId) {
        if (this.handlersById[handlerId] != null) {
            delete this.handlersById[handlerId];
            return true;
        }
        return false;
    };
    Channel.prototype.remove = function () {
        return this.Channels.remove(this.name);
    };
    Channel.handlerIdCpt = 0;
    return Channel;
}());

var Channels = /** @class */ (function () {
    function Channels() {
    }
    Channels.on = function (message, cb) {
        return Channels.globalChannel.on(message, cb);
    };
    Channels.emit = function (message, data) {
        return Channels.globalChannel.emit(message, data);
    };
    Channels.off = function (handlerId) {
        return Channels.globalChannel.off(handlerId);
    };
    Channels.get = function (channelName) {
        var channels = Channels.channels;
        var channel = channels[channelName];
        if (!channel) {
            channel = new Channel(Channels, channelName);
            channels[channelName] = channel;
        }
        return channel;
    };
    Channels.remove = function (channelName) {
        var channels = Channels.channels;
        var channel = channels[channelName];
        if (channel) {
            delete channels[channelName];
            return true;
        }
        return false;
    };
    Channels.channels = [];
    Channels.globalChannel = new Channel(Channels, '__GLOBAL');
    return Channels;
}());

module.exports = Channels;

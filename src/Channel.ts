import {ChannelCallback, IChannel, IHandler} from "./index.d";

export class Channel implements IChannel {

    private static handlerIdCpt = 0;

    private readonly handlersById: {[key: number] : IHandler} = {};
    private readonly handlersByMessage: {[key: string]: IHandler[]} = {};
    private readonly name;
    private readonly Channels;

    constructor(Channels, channelName) {
        this.Channels = Channels;
        this.name = channelName;
    }

    public on(message: string, cb: ChannelCallback) {
        const handler = {
            id: Channel.handlerIdCpt++,
            cb: cb
        };

        this.handlersById[handler.id] = handler;

        let handlers = this.handlersByMessage[message];
        if (! handlers) {
            handlers = [];
            this.handlersByMessage[message] = handlers;
        }

        handlers.push(handler.id);

        return handler.id;
    }

    public emit(message: string, data: any) {
        const handlers = this.handlersByMessage[message];

        if (handlers != null) {
            for (let i = 0; i < handlers.length; i++) {
                const handlerId = handlers[i];

                const handler = this.handlersById[handlerId];
                if (handler) {
                    ((handler) => { // No body expect emit to be call synchronously
                        setTimeout(() => {
                            handler.cb(data);
                        }, 0)
                    })(handler);
                } else {
                    handlers.splice(i, 1);
                    i--;
                }
            }
        }

        return handlers != null && handlers.length > 0;
    }

    public off(handlerId: number) {
        if (this.handlersById[handlerId] != null) {
            delete this.handlersById[handlerId];
            return true;
        }

        return false;
    }

    public remove() {
        return this.Channels.remove(this.name);
    }
}

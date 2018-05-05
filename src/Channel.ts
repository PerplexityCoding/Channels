import {ChannelCallback, IChannel, IHandler} from "./index.d";

export class Channel implements IChannel {

    private static handlerIdCpt = 0;

    private static handlersById: {[key: number] : IHandler} = {};
    private static handlersByMessage: {[key: string]: IHandler[]} = {};

    public on(message: string, cb: ChannelCallback) {
        const handler = {
            id: Channel.handlerIdCpt++,
            cb: cb
        };

        Channel.handlersById[handler.id] = handler;

        let handlers = Channel.handlersByMessage[message];
        if (! handlers) {
            handlers = [];
            Channel.handlersByMessage[message] = handlers;
        }

        handlers.push(handler.id);

        return handler.id;
    }

    public emit(message: string, data: any) {
        let handlers = Channel.handlersByMessage[message];

        if (handlers != null) {
            for (let i = 0; i < handlers.length; i++) {
                const handlerId = handlers[i];

                const handler = Channel.handlersById[handlerId];
                if (handler) {
                    setTimeout(() => { // No body expect emit to be call synchronously
                        handler.cb(data);
                    }, 0)
                } else {
                    handlers.splice(i, 1);
                    i--;
                }
            }
        }

        return handlers != null && handlers.length > 0;
    }

    public off(handlerId: number) {
        if (Channel.handlersById[handlerId] != null) {
            delete Channel.handlersById[handlerId];
            return true;
        }

        return false;
    }
}

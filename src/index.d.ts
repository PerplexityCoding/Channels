export type ChannelCallback = () => void

export interface IChannel {
    on(message: string, cb: ChannelCallback): number;
    emit(message: string, data: any);
    off(handlerId: number);
}

interface IHandler {
    id: number;
    cb: ChannelCallback;
}

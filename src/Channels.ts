import {Channel} from "./Channel";
import {ChannelCallback, IChannel} from "./index.d";

export class Channels implements IChannel {

    private static channels: Channel[] = [];
    private static globalChannel = new Channel();

    public on(message: string, cb: ChannelCallback) {
        Channels.globalChannel.on(message, cb);
    }

    public emit(message: string, data: any) {
        Channels.globalChannel.emit(message, data);
    }

    public off(handlerId: number) {
        Channels.globalChannel.off(handlerId);
    }

    public get(channelName: string) {
        const channels = Channels.channels;

        let channel = channels[channelName];
        if (! channel) {
            channel = new Channel();
            channels[channelName] = channel;
        }

        return channel;
    }
}

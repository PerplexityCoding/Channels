import {Channel} from "./Channel";
import {ChannelCallback} from "./index.d";

export default class Channels {
    private static channels: Channel[] = [];
    private static globalChannel = new Channel(Channels, '__GLOBAL');

    public static on(message: string, cb: ChannelCallback) {
        return Channels.globalChannel.on(message, cb);
    }

    public static emit(message: string, data: any) {
        return Channels.globalChannel.emit(message, data);
    }

    public static off(handlerId: number) {
        return Channels.globalChannel.off(handlerId);
    }

    public static get(channelName: string) {
        const channels = Channels.channels;

        let channel = channels[channelName];
        if (! channel) {
            channel = new Channel(Channels, channelName);
            channels[channelName] = channel;
        }

        return channel;
    }

    public static remove(channelName: string) {
        const channels = Channels.channels;

        let channel = channels[channelName];

        if (channel) {
            delete channels[channelName];
            return true;
        }

        return false;
    }
}

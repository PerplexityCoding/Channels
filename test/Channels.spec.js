const Channels = require('../dist/bundle-test');

describe('test channel', () => {

    function testChannelBasic(channel, done) {
        const handlerId = channel.on('my-message', (data) => {
            expect(data).toEqual('hello');
            done();
        });

        expect(handlerId).toBeDefined();

        const messageSent = channel.emit('my-message', 'hello');
        expect(messageSent).toBe(true);
    }

    function testChannelOnOff(channel, done) {
        const handlerId = channel.on('my-message', (data) => {
            done.fail(new Error('Fail!'));
        });
        expect(handlerId).toBeDefined();

        const removed = channel.off(handlerId);
        expect(removed).toBe(true);

        const messageSent = channel.emit('my-message', 'hello');
        expect(messageSent).toBe(true);

        setTimeout(() => {
            done();
        }, 100);
    }

    test('global channel basic use', (done) => {
        testChannelBasic(Channels, done);
    });

    test('global channel on/off', (done) => {
        testChannelOnOff(Channels, done);
    });

    test('custom channel basic use', (done) => {
        const channel = Channels.get('my-custom-channel');
        testChannelBasic(channel, done);
    });

    test('custom channel on/off', (done) => {
        const channel = Channels.get('my-custom-channel');
        testChannelOnOff(channel, done);
    });

    test('custom channel remove', () => {
        const channel1 = Channels.get('my-custom-channel');
        const channel2 = Channels.get('my-custom-channel');

        expect(channel2).toBe(channel1);

        const removed = Channels.remove('my-custom-channel');
        expect(removed).toBe(true);

        const channel3 = Channels.get('my-custom-channel');

        expect(channel3).not.toBe(channel1);
    });

    test('custom channel remove with helper method', () => {
        const channel1 = Channels.get('my-custom-channel');
        const channel2 = Channels.get('my-custom-channel');

        expect(channel2).toBe(channel1);

        const removed = channel1.remove();
        expect(removed).toBe(true);

        const channel3 = Channels.get('my-custom-channel');
        expect(channel3).not.toBe(channel1);
    });

    test('global channel remove wrong channel', () => {
        const removed = Channels.remove('my-other-channel');
        expect(removed).toBe(false);
    });

    test('global channel emit message, no listeners', () => {
        const messageSent = Channels.emit('my-other-channel');
        expect(messageSent).toBe(false);
    });

    test('global channel remove inexistant handlers', () => {
        const removed = Channels.off(1);
        expect(removed).toBe(false);
    });

});
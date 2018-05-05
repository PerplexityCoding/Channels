let Channels = require('../dist/bundle-test');

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

        let removed = channel.off(handlerId);
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
        let channel1 = Channels.get('my-custom-channel');
        let channel2 = Channels.get('my-custom-channel');

        expect(channel2).toBe(channel1);

        let removed = Channels.remove('my-custom-channel');
        expect(removed).toBe(true);

        let channel3 = Channels.get('my-custom-channel');

        expect(channel3).not.toBe(channel1);
    });

    test('global channel remove wrong channel', () => {
        let removed = Channels.remove('my-other-channel');
        expect(removed).toBe(false);
    });

    test('global channel emit message, no listeners', () => {
        let messageSent = Channels.emit('my-other-channel');
        expect(messageSent).toBe(false);
    });

    test('global channel remove inexistant handlers', () => {
        let removed = Channels.off(1);
        expect(removed).toBe(false);
    });


});
describe('buffer', () => {

    const expect = require("chai").expect;
    const {DynamicBuffer} = require("../src");

    it('saving data in buffer', () => {

        const db = new DynamicBuffer();

        const bytes = [1, 4, 0, 255, 0, 21, 48, 1, 13];
        expect(bytes).deep.equal(db.setBuffer(new Uint8Array(bytes).buffer).bytes);

        const byteOverflowMinus = [-1];
        expect(byteOverflowMinus).not.deep.equal(db.setBuffer(new Uint8Array(byteOverflowMinus).buffer).bytes);

        const byteOverflowPlus = [256];
        expect(byteOverflowPlus).not.deep.equal(db.setBuffer(new Uint8Array(byteOverflowPlus).buffer).bytes);

    });

    it('buffer', () => {

        const db = new DynamicBuffer();

        const buffer = new Uint8Array([0, 12, 123, 4, 12]).buffer;
        db.writeBuffer(buffer);

        db.pointer.offset = 0;

        expect(db.readBuffer(buffer.byteLength)).deep.equal(buffer);

    });

    it('boolean', () => {

        const booleanList = [true, true, false, true, false, false];
        const db = new DynamicBuffer();

        booleanList.forEach((val) => db.writeBoolean(val));
        db.pointer.offset = 0;

        booleanList.forEach((val) => expect(val).equal(db.readBoolean()));

    });

    it('mixing types', () => {
        // todo adjust
    });

});

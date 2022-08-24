describe('offset', () => {

    const expect = require("chai").expect;
    const {DynamicBuffer} = require("../src");

    it('offset usage', () => {

        const pointer = {offset: 0};
        const int8s = new Int8Array([-30, 4, 25]).buffer;
        const db = new DynamicBuffer(int8s);

        pointer.offset = 2;
        expect(db.readInt8(pointer)).equal(25);

        pointer.offset = 0;
        expect(db.readInt8(pointer)).equal(-30);
        expect(db.readInt8(pointer)).equal(4);

        pointer.offset = 1;
        expect(db.readInt8(pointer)).equal(4);
        expect(db.readInt8(pointer)).equal(25);

    });

});

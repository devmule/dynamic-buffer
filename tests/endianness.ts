describe('endianness', () => {

    const expect = require("chai").expect;
    const {DynamicBuffer} = require("../src");

    it('float64', () => {

        const db = new DynamicBuffer();

        const a = Number.MAX_VALUE;

        db.isLittleEndian = true;
        db.writeFloat64(a);

        db.isLittleEndian = false;
        db.writeFloat64(a);

        db.pointer.offset = 0;


        db.isLittleEndian = true;
        expect(db.readFloat64()).equal(a);

        db.isLittleEndian = false;
        expect(db.readFloat64()).equal(a);


    });

});

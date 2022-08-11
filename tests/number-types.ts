describe('number types', () => {

    const expect = require("chai").expect;
    const DynamicBuffer = require("../src");

    it('int8/uint8', () => {

        const db = new DynamicBuffer();

        // in values
        const int8List = [-100, -10, 20, 100];
        const uint8List = [0, 20, 100, 255];

        int8List.forEach((val) => db.writeInt8(val));
        uint8List.forEach((val) => db.writeUint8(val));

        db.byteOffset = 0;

        int8List.forEach((val) => expect(val).equal(db.readInt8()));
        uint8List.forEach((val) => expect(val).equal(db.readUint8()));

        // overflow
        db.byteOffset = 0;

        const int8ListOverflow = [-129, 128];
        const uint8ListOverflow = [-1, 256];

        int8ListOverflow.forEach((val) => db.writeInt8(val));
        uint8ListOverflow.forEach((val) => db.writeUint8(val));

        int8ListOverflow.forEach((val) => expect(val).not.equal(db.readInt8()));
        uint8ListOverflow.forEach((val) => expect(val).not.equal(db.readUint8()));

    });

    it('int16/uint16', () => {

        const db = new DynamicBuffer();

        // in values
        const int16List = [-32768, 0, 32767];
        const uint16List = [0, 65535];

        int16List.forEach((val) => db.writeInt16(val));
        uint16List.forEach((val) => db.writeUint16(val));

        db.byteOffset = 0;

        int16List.forEach((val) => expect(val).equal(db.readInt16()));
        uint16List.forEach((val) => expect(val).equal(db.readUint16()));

        // overflow
        db.byteOffset = 0;
        const int16ListOverflow = [-32769, 32768];
        const uint16ListOverflow = [-1, 65536];

        int16ListOverflow.forEach((val) => db.writeInt16(val));
        uint16ListOverflow.forEach((val) => db.writeUint16(val));

        db.byteOffset = 0;

        int16ListOverflow.forEach((val) => expect(val).not.equal(db.readInt16()));
        uint16ListOverflow.forEach((val) => expect(val).not.equal(db.readUint16()));

    });

    it('int32/uint32', () => {

        const db = new DynamicBuffer();

        // in values
        const int32List = [-2147483648, 0, 2147483647];
        const uint32List = [0, 4294967295];

        int32List.forEach((val) => db.writeInt32(val));
        uint32List.forEach((val) => db.writeUint32(val));

        db.byteOffset = 0;

        int32List.forEach((val) => expect(val).equal(db.readInt32()));
        uint32List.forEach((val) => expect(val).equal(db.readUint32()));

        // overflow
        db.byteOffset = 0;

        const int32ListOverflow = [-2147483649, 2147483648];
        const uint32ListOverflow = [-1, 4294967296];

        int32ListOverflow.forEach((val) => db.writeInt32(val));
        uint32ListOverflow.forEach((val) => db.writeUint32(val));

        db.byteOffset = 0;

        int32ListOverflow.forEach((val) => expect(val).not.equal(db.readInt32()));
        uint32ListOverflow.forEach((val) => expect(val).not.equal(db.readUint32()));

    });

    it('float32', () => {
        // todo adjust
    });

    it('float64', () => {
        // todo adjust
    });

});

describe('number types', () => {

    const expect = require("chai").expect;
    const {DynamicBuffer} = require("../src");

    it('int8', () => {
        const db = new DynamicBuffer();
        // in values
        const int8List = [-100, -10, 20, 100];
        int8List.forEach((val) => db.writeInt8(val));
        db.pointer.offset = 0;
        int8List.forEach((val) => expect(val).equal(db.readInt8()));
        // overflow
        db.pointer.offset = 0;
        const int8ListOverflow = [-129, 128];
        int8ListOverflow.forEach((val) => db.writeInt8(val));
        int8ListOverflow.forEach((val) => expect(val).not.equal(db.readInt8()));
    });

    it('uint8', () => {
        const db = new DynamicBuffer();
        // in values
        const uint8List = [0, 20, 100, 255];
        uint8List.forEach((val) => db.writeUint8(val));
        db.pointer.offset = 0;
        uint8List.forEach((val) => expect(val).equal(db.readUint8()));
        // overflow
        db.pointer.offset = 0;
        const uint8ListOverflow = [-1, 256];
        uint8ListOverflow.forEach((val) => db.writeUint8(val));
        uint8ListOverflow.forEach((val) => expect(val).not.equal(db.readUint8()));
    });

    it('int16', () => {
        const db = new DynamicBuffer();
        // in values
        const int16List = [-32768, 0, 32767];
        int16List.forEach((val) => db.writeInt16(val));
        db.pointer.offset = 0;
        int16List.forEach((val) => expect(val).equal(db.readInt16()));
        // overflow
        db.pointer.offset = 0;
        const int16ListOverflow = [-32769, 32768];
        int16ListOverflow.forEach((val) => db.writeInt16(val));
        db.pointer.offset = 0;
        int16ListOverflow.forEach((val) => expect(val).not.equal(db.readInt16()));
    });

    it('uint16', () => {
        const db = new DynamicBuffer();
        // in values
        const uint16List = [0, 65535];
        uint16List.forEach((val) => db.writeUint16(val));
        db.pointer.offset = 0;
        uint16List.forEach((val) => expect(val).equal(db.readUint16()));
        // overflow
        db.pointer.offset = 0;
        const uint16ListOverflow = [-1, 65536];
        uint16ListOverflow.forEach((val) => db.writeUint16(val));
        db.pointer.offset = 0;
        uint16ListOverflow.forEach((val) => expect(val).not.equal(db.readUint16()));
    });

    it('int32', () => {
        const db = new DynamicBuffer();
        // in values
        const int32List = [-2147483648, 0, 2147483647];
        int32List.forEach((val) => db.writeInt32(val));
        db.pointer.offset = 0;
        int32List.forEach((val) => expect(val).equal(db.readInt32()));
        // overflow
        db.pointer.offset = 0;
        const int32ListOverflow = [-2147483649, 2147483648];
        int32ListOverflow.forEach((val) => db.writeInt32(val));
        db.pointer.offset = 0;
        int32ListOverflow.forEach((val) => expect(val).not.equal(db.readInt32()));
    });

    it('uint32', () => {
        const db = new DynamicBuffer();
        // in values
        const uint32List = [0, 4294967295];
        uint32List.forEach((val) => db.writeUint32(val));
        db.pointer.offset = 0;
        uint32List.forEach((val) => expect(val).equal(db.readUint32()));
        // overflow
        db.pointer.offset = 0;
        const uint32ListOverflow = [-1, 4294967296];
        uint32ListOverflow.forEach((val) => db.writeUint32(val));
        db.pointer.offset = 0;
        uint32ListOverflow.forEach((val) => expect(val).not.equal(db.readUint32()));
    });

    it('float32', () => {
        const db = new DynamicBuffer();
        // in values
        const float32List = [
            1.40129846432481707092372958328991613128026194187652e-45,
            3.40282346638528859811704183484516925440000000000000e+38
        ];
        float32List.forEach((val) => db.writeFloat32(val));
        db.pointer.offset = 0;
        float32List.forEach((val) => expect(val).equal(db.readFloat32()));
        // overflow
        db.pointer.offset = 0;
        const float32ListOverflow = [
            // max/min float64
            4.94065645841246544176568792868221372365059802614325e-324,
            1.79769313486231570814527423731704356798070567525845e+308
        ];
        float32ListOverflow.forEach((val) => db.writeFloat32(val));
        db.pointer.offset = 0;
        float32ListOverflow.forEach((val) => expect(val).not.equal(db.readFloat32()));
    });

    it('float64', () => {
        const db = new DynamicBuffer();
        // in values
        db.writeFloat64(Number.MIN_VALUE);
        db.writeFloat64(Number.MAX_VALUE);
        db.pointer.offset = 0;
        expect(Number.MIN_VALUE).equal(db.readFloat64())
        expect(Number.MAX_VALUE).equal(db.readFloat64())
    });

});

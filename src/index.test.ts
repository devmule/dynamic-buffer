import {expect} from "chai";
import DynamicBuffer from "./index";

describe('DynamicBuffer', () => {

    it('buffer converting', () => {

        const db = new DynamicBuffer();

        const bytes = [1, 4, 0, 255, 0, 21, 48, 1, 13];
        const original = new Uint8Array(bytes).buffer;

        db.fromBuffer(original);
        const generated = db.generateBuffer();

        expect(original).deep.equal(generated);

    });

    it('reading & writing strings', () => {

        const strings = [
            "simple ascii chars",
            "旅ロ京青利セムレ弱改フヨス波府かばぼ意送でぼ調掲察たス日西重ケアナ住橋ユムミク順待ふかんぼ人奨貯鏡すびそ",
            "Hello🦁⏲Ⓜ♈♿♟⛔✒, world"
        ]

        const db = new DynamicBuffer();

        strings.forEach((string) => db.writeString(string));

        db.byteOffset = 0;

        strings.forEach((string) => expect(string).equal(db.readString()))

    });

    it('boolean', () => {

        const booleanList = [true, true, false, true, false, false];
        const db = new DynamicBuffer();

        booleanList.forEach((val) => db.writeBoolean(val));
        db.byteOffset = 0;

        booleanList.forEach((val) => expect(val).equal(db.readBoolean()));

    });

    it('int8/uint8', () => {

        const int8List = [-10, 20, -100, 100];
        const uint8List = [10, 20, 100, 255];

        const db = new DynamicBuffer();

        int8List.forEach((val) => db.writeInt8(val));
        uint8List.forEach((val) => db.writeUint8(val));

        db.byteOffset = 0;

        int8List.forEach((val) => expect(val).equal(db.readInt8()));
        uint8List.forEach((val) => expect(val).equal(db.readUint8()));

    });

    it('int16/uint16', () => {

        const int16List = [-32768, 0, 32767];
        const uint16List = [0, 65535];

        const db = new DynamicBuffer();

        int16List.forEach((val) => db.writeInt16(val));
        uint16List.forEach((val) => db.writeUint16(val));

        db.byteOffset = 0;

        int16List.forEach((val) => expect(val).equal(db.readInt16()));
        uint16List.forEach((val) => expect(val).equal(db.readUint16()));

    });

    it('int32/uint32', () => {

        const int32List = [-2147483648, 0, 2147483647];
        const uint32List = [0, 4294967295];

        const db = new DynamicBuffer();

        int32List.forEach((val) => db.writeInt32(val));
        uint32List.forEach((val) => db.writeUint32(val));

        db.byteOffset = 0;

        int32List.forEach((val) => expect(val).equal(db.readInt32()));
        uint32List.forEach((val) => expect(val).equal(db.readUint32()));

    });

    it('float32', () => {
    });

    it('float64', () => {
    });

    it('mixing types', () => {
    });

});

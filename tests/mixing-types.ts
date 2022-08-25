describe('mixing types', () => {

    const expect = require("chai").expect;
    const {DynamicBuffer} = require("../src");

    it('mixing number types', () => {

        const db = new DynamicBuffer();

        const pointerWrite = {offset: 0};
        const pointerRead = {offset: 0};

        const types: [number, Function, Function][] = [
            [255, db.readUint8.bind(db), db.writeUint8.bind(db)],
            [127, db.readInt8.bind(db), db.writeInt8.bind(db)],
            [255, db.readUint16.bind(db), db.writeUint16.bind(db)],
            [255, db.readInt16.bind(db), db.writeInt16.bind(db)],
            [255, db.readUint32.bind(db), db.writeUint32.bind(db)],
            [255, db.readInt32.bind(db), db.writeInt32.bind(db)],
            [255, db.readFloat32.bind(db), db.writeFloat32.bind(db)],
            [255, db.readFloat64.bind(db), db.writeFloat64.bind(db)],
        ]

        types.forEach(([value, read, write]) => write(value, pointerWrite));

        types.forEach(([value, read, write]) => expect(read(pointerRead)).equal(value));

    });

});

describe('string types', () => {

    const expect = require("chai").expect;
    const {DynamicBuffer} = require("../src");

    it('strings', () => {

        const strings = [
            "simple ascii chars",
            "旅ロ京青利セムレ弱改フヨス波府かばぼ意送でぼ調掲察たス日西重ケアナ住橋ユムミク順待ふかんぼ人奨貯鏡すびそ",
            "Hello🦁⏲Ⓜ♈♿♟⛔✒, world"
        ]

        const db = new DynamicBuffer();

        strings.forEach((string) => db.writeString(string));

        db.pointer.offset = 0;

        strings.forEach((string) => expect(string).equal(db.readString()))

    });

});

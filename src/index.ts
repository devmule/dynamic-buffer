const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const viewFloat64 = new Float64Array(1);
const viewFloat32 = new Float32Array(viewFloat64.buffer);
const viewInt32 = new Int32Array(viewFloat64.buffer);

export default class DynamicBuffer {

    public readonly bytes: number[] = [];
    public byteOffset: number = 0;

    constructor(buffer?: ArrayBufferLike) {
        if (buffer) this.fromBuffer(buffer);
    }

    fromBuffer(buffer: ArrayBufferLike): void {
        this.byteOffset = 0;
        this.bytes.length = 0;
        const array = new Uint8Array(buffer);
        array.forEach((byte, index) => this.bytes[index] = byte);
    }

    generateBuffer(): ArrayBufferLike {
        return new Uint8Array(this.bytes).buffer;
    }

    readBoolean(byteOffset?: number): boolean {
        return Boolean(this.bytes[byteOffset ?? this.byteOffset++]);
    }

    writeBoolean(value: boolean, byteOffset?: number) {
        this.bytes[byteOffset ?? this.byteOffset++] = value ? 1 : 0;
    }

    readInt8(byteOffset?: number): number {
        return this.readUint8(byteOffset) << 24 >> 24;
    }

    writeInt8(value: number, byteOffset?: number): void {
        byteOffset = byteOffset ?? this.byteOffset++;
        this.bytes[byteOffset] = value & 255;
    }

    readUint8(byteOffset?: number): number {
        byteOffset = byteOffset ?? this.byteOffset++;
        return this.bytes[byteOffset];
    }

    writeUint8(value: number, byteOffset?: number): void {
        byteOffset = byteOffset ?? this.byteOffset++;
        this.bytes[byteOffset] = value & 255;
    }

    readInt16(byteOffset?: number): number {
        return this.readUint16(byteOffset) << 16 >> 16;
    }

    writeInt16(value: number, byteOffset?: number): void {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 2;
        this.bytes[byteOffset++] = (value) & 255;
        this.bytes[byteOffset++] = (value >> 8) & 255;
    }

    readUint16(byteOffset?: number): number {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 2;
        return (
            this.bytes[byteOffset++] |
            this.bytes[byteOffset++] << 8
        );
    }

    writeUint16(value: number, byteOffset?: number): void {
        this.writeInt16(value, byteOffset);
    }

    readInt32(byteOffset?: number): number {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 4;
        return (
            this.bytes[byteOffset++] |
            this.bytes[byteOffset++] << 8 |
            this.bytes[byteOffset++] << 16 |
            this.bytes[byteOffset++] << 24
        );
    }

    writeInt32(value: number, byteOffset?: number): void {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 4;
        this.bytes[byteOffset++] = (value) & 255;
        this.bytes[byteOffset++] = (value >> 8) & 255;
        this.bytes[byteOffset++] = (value >> 16) & 255;
        this.bytes[byteOffset++] = (value >> 24) & 255;
    }

    readUint32(byteOffset?: number): number {
        return this.readInt32(byteOffset) >>> 0;
    }

    writeUint32(value: number, byteOffset?: number): void {
        this.writeInt32(value, byteOffset);
    }

    readFloat32(byteOffset?: number): number {
        viewInt32[0] = this.readInt32(byteOffset);
        return viewFloat32[0];
    }

    writeFloat32(value: number, byteOffset?: number): void {
        viewFloat32[0] = value;
        this.writeInt32(viewInt32[0], byteOffset);
    }

    readFloat64(byteOffset?: number, littleEndian: boolean = true): number {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        viewInt32[littleEndian ? 0 : 1] = this.readInt32(byteOffset);
        viewInt32[littleEndian ? 1 : 0] = this.readInt32(byteOffset + 4);
        if (!provided) this.byteOffset += 8;
        return viewFloat64[0];
    }

    writeFloat64(value: number, byteOffset?: number, littleEndian: boolean = true): void {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        viewFloat64[0] = value;
        this.writeInt32(viewInt32[littleEndian ? 0 : 1], byteOffset);
        this.writeInt32(viewInt32[littleEndian ? 1 : 0], byteOffset + 4);
        if (!provided) this.byteOffset += 8;
    }

    readString(byteOffset?: number): string {

        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        const byteLength = this.readUint32(byteOffset);
        if (!provided) this.byteOffset += (byteLength + 4);

        byteOffset += 4;
        const stringBuffer = new Uint8Array(byteLength);
        for (let i = 0; i < byteLength; i++) {
            stringBuffer[i] = this.readUint8(byteOffset++);
        }
        return textDecoder.decode(stringBuffer);

    }

    writeString(value: string, byteOffset?: number): void {

        const stringBuffer = textEncoder.encode(value);
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += (stringBuffer.byteLength + 4);

        this.writeUint32(stringBuffer.byteLength, byteOffset);
        byteOffset += 4;
        for (let i = 0; i < stringBuffer.byteLength; i++) {
            this.writeUint8(stringBuffer[i], byteOffset++)
        }

    }


}

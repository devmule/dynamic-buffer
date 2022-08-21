const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const viewFloat64 = new Float64Array(1);
const viewFloat32 = new Float32Array(viewFloat64.buffer);
const viewInt32 = new Int32Array(viewFloat64.buffer);
const viewUint32 = new Uint32Array(viewFloat64.buffer);
const viewInt16 = new Int16Array(viewFloat64.buffer);
const viewUint16 = new Uint16Array(viewFloat64.buffer);
const viewInt8 = new Int8Array(viewFloat64.buffer);
const viewUint8 = new Uint8Array(viewFloat64.buffer);

/**
 * @module dynamic-buffer
 * */

/**
 * @class {DynamicBuffer}
 * @description A {@link DynamicBuffer} class provides an interface for reading and writing different low-level data types.
 * */
class DynamicBuffer {

    /**
     * @description List of bytes - number values between 0 and 255.
     *  It is ***not recommended*** to modify it directly,
     *  use {@link DynamicBuffer} methods instead.
     * */
    public readonly bytes: number[] = [];

    /**
     * @description Pointing byte on which reading or writing will continue if byteOffset param is not provided.
     * */
    public byteOffset: number = 0;

    constructor(buffer?: ArrayBufferLike) {
        if (buffer) this.setBuffer(buffer);
    }

    /**
     * @description Set {@link DynamicBuffer.bytes} from provided {@link ArrayBufferLike} buffer.
     * @param {ArrayBufferLike} buffer
     * @return {this} self.
     * */
    setBuffer(buffer: ArrayBufferLike): this {
        this.byteOffset = 0;
        this.bytes.length = 0;
        const array = new Uint8Array(buffer);
        array.forEach((byte, index) => this.bytes[index] = byte);
        return this;
    }

    /**
     * @description Generate {@link ArrayBufferLike} from {@link DynamicBuffer.bytes} and return it.
     * @return {ArrayBufferLike} Generated {@link ArrayBufferLike}.
     * */
    generateBuffer(): ArrayBufferLike {
        return new Uint8Array(this.bytes).buffer;
    }

    /**
     * @description Returns a section of {@link DynamicBuffer}.
     * @param {number} [start] Zero-based byte index at which to begin slicing.
     * @param {number} [end] Byte index before which to end slicing.
     * @return {DynamicBuffer} New instance of {@link DynamicBuffer}.
     * @throws {RangeError} {@link RangeError} if given start index is greater than given end index.
     * */
    slice(start?: number, end?: number): DynamicBuffer {
        if (start == undefined || start < 0) start = 0;
        if (end == undefined || end > this.bytes.length) end = this.bytes.length;
        if (start > end) {
            throw new RangeError(`Start index (${start} given) can not be greater than end index (${end} given)`);
        }
        const len = end - start;
        const dynamicBuffer = new DynamicBuffer();
        for (let i = 0; i < len; i++) {
            dynamicBuffer.bytes[i] = this.bytes[i + start];
        }
        return dynamicBuffer;
    }

    /**
     * @description Returns a section of {@link DynamicBuffer} in {@link ArrayBufferLike} format.
     * @param {number} byteLength Count of bytes that will be read.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {ArrayBufferLike} {@link ArrayBufferLike}
     * */
    readBuffer(byteLength: number, byteOffset?: number): ArrayBufferLike {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        const buffer = new Uint8Array(byteLength);
        for (let i = 0; i < byteLength; i++) buffer[i] = this.bytes[i + byteOffset];
        if (!provided) this.byteOffset += byteLength;
        return buffer.buffer;
    }

    /**
     * @description Writes a section of {@link ArrayBufferLike}.
     * @param {ArrayBufferLike} buffer Buffer which values will be written.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeBuffer(buffer: ArrayBufferLike, byteOffset?: number): this {
        const view = new Uint8Array(buffer);
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += buffer.byteLength;
        for (let i = 0; i < buffer.byteLength; i++) this.bytes[i + byteOffset] = view[i];
        return this;
    }

    /**
     * @description Read byte as {@link boolean} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {boolean} byte as {@link boolean}.
     * */
    readBoolean(byteOffset?: number): boolean {
        return Boolean(this.bytes[byteOffset ?? this.byteOffset++]);
    }

    /**
     * @description Write {@link boolean} value as one single byte at byteOffset.
     * @param {boolean} value {@link boolean} value that will be written as byte.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeBoolean(value: boolean, byteOffset?: number): this {
        this.bytes[byteOffset ?? this.byteOffset++] = value ? 1 : 0;
        return this;
    }

    /**
     * @description Read byte as Int8 {@link number} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {number} Int8 as {@link number}.
     * */
    readInt8(byteOffset?: number): number {
        return this.readUint8(byteOffset) << 24 >> 24;
    }

    /**
     * @description Write Int8 {@link number} as byte at byteOffset.
     * @param {number} value Int8 as {@link number}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeInt8(value: number, byteOffset?: number): this {
        byteOffset = byteOffset ?? this.byteOffset++;
        this.bytes[byteOffset] = value & 255;
        return this;
    }

    /**
     * @description Read byte as Uint8 {@link number} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {number} Uint8 as {@link number}.
     * */
    readUint8(byteOffset?: number): number {
        byteOffset = byteOffset ?? this.byteOffset++;
        return this.bytes[byteOffset];
    }

    /**
     * @description Write Uint8 {@link number} as byte at byteOffset.
     * @param {number} value Uint8 as {@link number}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeUint8(value: number, byteOffset?: number): this {
        byteOffset = byteOffset ?? this.byteOffset++;
        this.bytes[byteOffset] = value & 255;
        return this;
    }

    /**
     * @description Read 2 bytes as Int16 {@link number} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {number} Int16 as {@link number}.
     * */
    readInt16(byteOffset?: number): number {
        viewUint16[0] = this.readUint16(byteOffset);
        return viewInt16[0];
    }

    /**
     * @description Write Int16 {@link number} as 2 bytes at byteOffset.
     * @param {number} value Int16 as {@link number}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeInt16(value: number, byteOffset?: number): this {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 2;
        viewInt16[0] = value;
        this.bytes[byteOffset/**/] = viewInt8[0];
        this.bytes[byteOffset + 1] = viewInt8[1];
        return this;
    }

    /**
     * @description Read 2 bytes as Uint16 {@link number} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {number} Uint16 as {@link number}.
     * */
    readUint16(byteOffset?: number): number {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 2;
        viewUint8[0] = this.bytes[byteOffset/**/];
        viewUint8[1] = this.bytes[byteOffset + 1];
        return viewUint16[0];
    }

    /**
     * @description Write Uint16 {@link number} as 2 bytes at byteOffset.
     * @param {number} value Uint16 as {@link number}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeUint16(value: number, byteOffset?: number): this {
        this.writeInt16(value, byteOffset);
        return this;
    }

    /**
     * @description Read 4 bytes as Int32 {@link number} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {number} Int32 as {@link number}.
     * */
    readInt32(byteOffset?: number): number {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 4;
        viewInt8[0] = this.bytes[byteOffset/**/];
        viewInt8[1] = this.bytes[byteOffset + 1];
        viewInt8[2] = this.bytes[byteOffset + 2];
        viewInt8[3] = this.bytes[byteOffset + 3];
        return viewInt32[0];
    }

    /**
     * @description Write Int32 {@link number} as 4 bytes at byteOffset.
     * @param {number} value Int32 as {@link number}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeInt32(value: number, byteOffset?: number): this {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 4;
        viewInt32[0] = value;
        this.bytes[byteOffset/**/] = viewInt8[0];
        this.bytes[byteOffset + 1] = viewInt8[1];
        this.bytes[byteOffset + 2] = viewInt8[2];
        this.bytes[byteOffset + 3] = viewInt8[3];
        return this;
    }

    /**
     * @description Read 4 bytes as Uint32 {@link number} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {number} Uint32 as {@link number}.
     * */
    readUint32(byteOffset?: number): number {
        viewInt32[0] = this.readInt32(byteOffset);
        return viewUint32[0];
    }

    /**
     * @description Write Uint32 {@link number} as 4 bytes at byteOffset.
     * @param {number} value Uint32 as {@link number}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeUint32(value: number, byteOffset?: number): this {
        this.writeInt32(value, byteOffset);
        return this;
    }

    /**
     * @description Read 4 bytes as Float32 {@link number} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {number} Float32 as {@link number}.
     * */
    readFloat32(byteOffset?: number): number {
        viewInt32[0] = this.readInt32(byteOffset);
        return viewFloat32[0];
    }

    /**
     * @description Write Float32 {@link number} as 4 bytes at byteOffset.
     * @param {number} value Float32 as {@link number}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeFloat32(value: number, byteOffset?: number): this {
        viewFloat32[0] = value;
        this.writeInt32(viewInt32[0], byteOffset);
        return this;
    }

    /**
     * @description Read 8 bytes as Float64 {@link number} at byteOffset.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {number} Float64 as {@link number}.
     * */
    readFloat64(byteOffset?: number): number {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 8;
        viewInt32[0] = this.readInt32(byteOffset);
        viewInt32[1] = this.readInt32(byteOffset + 4);
        return viewFloat64[0];
    }

    /**
     * @description Write Float64 {@link number} as 8 bytes at byteOffset.
     * @param {number} value Float32 as {@link number}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeFloat64(value: number, byteOffset?: number): this {
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += 8;
        viewFloat64[0] = value;
        this.writeInt32(viewInt32[0], byteOffset);
        this.writeInt32(viewInt32[1], byteOffset + 4);
        return this;
    }

    /**
     * @description Read length of string in bytes and {@link string} at byteOffset in unicode.
     * @param {number} [byteOffset] Zero-based byte index at which to begin reading.
     * @return {string} {@link string}.
     * */
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

    /**
     * @description Write length of string in bytes and {@link string} at byteOffset in unicode.
     * @param {string} value {@link string}.
     * @param {number} [byteOffset] Zero-based byte index at which to begin writing.
     * @return {this} self.
     * */
    writeString(value: string, byteOffset?: number): this {

        const stringBuffer = textEncoder.encode(value);
        const provided = byteOffset !== undefined;
        byteOffset = byteOffset ?? this.byteOffset;
        if (!provided) this.byteOffset += (stringBuffer.byteLength + 4);

        this.writeUint32(stringBuffer.byteLength, byteOffset);
        byteOffset += 4;
        for (let i = 0; i < stringBuffer.byteLength; i++) {
            this.writeUint8(stringBuffer[i], byteOffset++)
        }
        return this;

    }


}

export = DynamicBuffer;

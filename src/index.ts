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
 * @interface
 * @description Pointing on byte on which reading or writing will continue.
 * */
export interface IPointer {
    offset: number
}

/**
 * @class {DynamicBuffer}
 * @description A {@link DynamicBuffer} class provides an interface for reading and writing different low-level data types.
 * */
export class DynamicBuffer {

    /**
     * @description List of bytes - number values between 0 and 255.
     *  It is ***not recommended*** to modify it directly,
     *  use {@link DynamicBuffer} methods instead.
     * */
    public readonly bytes: number[] = []

    /**
     * @description Default {@link IPointer} which is used if {@link IPointer} is not provided in methods as param.
     * */
    public readonly pointer: IPointer = {offset: 0}

    constructor(buffer?: ArrayBufferLike) {
        if (buffer) this.setBuffer(buffer);
    }

    /**
     * @description Set {@link DynamicBuffer.bytes} from provided {@link ArrayBufferLike} buffer.
     * @param {ArrayBufferLike} buffer
     * @return {this} self.
     * */
    setBuffer(buffer: ArrayBufferLike): this {
        this.pointer.offset = 0;
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
     * @param {IPointer} [pointer]
     * @return {ArrayBufferLike} {@link ArrayBufferLike}
     * */
    readBuffer(byteLength: number, pointer: IPointer = this.pointer): ArrayBufferLike {
        const buffer = new Uint8Array(byteLength);
        for (let i = 0; i < byteLength; i++) {
            buffer[i] = this.bytes[pointer.offset++];
        }
        return buffer.buffer;
    }

    /**
     * @description Writes a section of {@link ArrayBufferLike}.
     * @param {ArrayBufferLike} buffer Buffer which values will be written.
     * @param {IPointer} [pointer]
     * @return {this} self.
     * */
    writeBuffer(buffer: ArrayBufferLike, pointer: IPointer = this.pointer): this {
        const view = new Uint8Array(buffer);
        for (let i = 0; i < buffer.byteLength; i++) {
            this.bytes[pointer.offset++] = view[i];
        }
        return this;
    }

    /**
     * @description Read byte as {@link boolean} at offset.
     * @param {IPointer} [pointer]
     * @return {boolean} byte as {@link boolean}.
     * */
    readBoolean(pointer: IPointer = this.pointer): boolean {
        return Boolean(this.bytes[pointer.offset++]);
    }

    /**
     * @description Write {@link boolean} value as one single byte at offset.
     * @param {boolean} value {@link boolean} value that will be written as byte.
     * @param {IPointer} [pointer]
     * @return {this} self.
     * */
    writeBoolean(value: boolean, pointer: IPointer = this.pointer): this {
        this.bytes[pointer.offset++] = value ? 1 : 0;
        return this;
    }

    /**
     * @description Read byte as Int8 {@link number} at offset.
     * @param {IPointer} [pointer]
     * @return {number} Int8 as {@link number}.
     * */
    readInt8(pointer: IPointer = this.pointer): number {
        return this.readUint8(pointer) << 24 >> 24;
    }

    /**
     * @description Write Int8 {@link number} as byte at offset.
     * @param {number} value Int8 as {@link number}.
     * @param {IPointer} [pointer]
     * @return {this} self.
     * */
    writeInt8(value: number, pointer: IPointer = this.pointer): this {
        this.bytes[pointer.offset++] = value & 255;
        return this;
    }

    /**
     * @description Read byte as Uint8 {@link number} at offset.
     * @param {IPointer} [pointer]
     * @return {number} Uint8 as {@link number}.
     * */
    readUint8(pointer: IPointer = this.pointer): number {
        return this.bytes[pointer.offset++];
    }

    /**
     * @description Write Uint8 {@link number} as byte at offset.
     * @param {number} value Uint8 as {@link number}.
     * @param {IPointer} [pointer]
     * @return {this} self.
     * */
    writeUint8(value: number, pointer: IPointer = this.pointer): this {
        this.bytes[pointer.offset++] = value & 255;
        return this;
    }

    /**
     * @description Read 2 bytes as Int16 {@link number} at offset.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {number} Int16 as {@link number}.
     * */
    readInt16(pointer: IPointer = this.pointer, littleEndian: boolean = true): number {
        viewUint16[0] = this.readUint16(pointer, littleEndian);
        return viewInt16[0];
    }

    /**
     * @description Write Int16 {@link number} as 2 bytes at offset.
     * @param {number} value Int16 as {@link number}.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {this} self.
     * */
    writeInt16(value: number, pointer: IPointer = this.pointer, littleEndian: boolean = true): this {
        viewInt16[0] = value;
        this.bytes[pointer.offset++] = viewInt8[littleEndian ? 0 : 1];
        this.bytes[pointer.offset++] = viewInt8[littleEndian ? 1 : 0];
        return this;
    }

    /**
     * @description Read 2 bytes as Uint16 {@link number} at offset.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {number} Uint16 as {@link number}.
     * */
    readUint16(pointer: IPointer = this.pointer, littleEndian: boolean = true): number {
        viewUint8[littleEndian ? 0 : 1] = this.bytes[pointer.offset++];
        viewUint8[littleEndian ? 1 : 0] = this.bytes[pointer.offset++];
        return viewUint16[0];
    }

    /**
     * @description Write Uint16 {@link number} as 2 bytes at offset.
     * @param {number} value Uint16 as {@link number}.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {this} self.
     * */
    writeUint16(value: number, pointer: IPointer = this.pointer, littleEndian: boolean = true): this {
        this.writeInt16(value, pointer, littleEndian);
        return this;
    }

    /**
     * @description Read 4 bytes as Int32 {@link number} at offset.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {number} Int32 as {@link number}.
     * */
    readInt32(pointer: IPointer = this.pointer, littleEndian: boolean = true): number {
        viewInt8[littleEndian ? 0 : 3] = this.bytes[pointer.offset++];
        viewInt8[littleEndian ? 1 : 2] = this.bytes[pointer.offset++];
        viewInt8[littleEndian ? 2 : 1] = this.bytes[pointer.offset++];
        viewInt8[littleEndian ? 3 : 0] = this.bytes[pointer.offset++];
        return viewInt32[0];
    }

    /**
     * @description Write Int32 {@link number} as 4 bytes at offset.
     * @param {number} value Int32 as {@link number}.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {this} self.
     * */
    writeInt32(value: number, pointer: IPointer = this.pointer, littleEndian: boolean = true): this {
        viewInt32[0] = value;
        this.bytes[pointer.offset + (littleEndian ? 0 : 3)] = viewInt8[0];
        this.bytes[pointer.offset + (littleEndian ? 1 : 2)] = viewInt8[1];
        this.bytes[pointer.offset + (littleEndian ? 2 : 1)] = viewInt8[2];
        this.bytes[pointer.offset + (littleEndian ? 3 : 0)] = viewInt8[3];
        pointer.offset += 4;
        return this;
    }

    /**
     * @description Read 4 bytes as Uint32 {@link number} at offset.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {number} Uint32 as {@link number}.
     * */
    readUint32(pointer: IPointer = this.pointer, littleEndian: boolean = true): number {
        viewInt32[0] = this.readInt32(pointer, littleEndian);
        return viewUint32[0];
    }

    /**
     * @description Write Uint32 {@link number} as 4 bytes at offset.
     * @param {number} value Uint32 as {@link number}.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {this} self.
     * */
    writeUint32(value: number, pointer: IPointer = this.pointer, littleEndian: boolean = true): this {
        this.writeInt32(value, pointer, littleEndian);
        return this;
    }

    /**
     * @description Read 4 bytes as Float32 {@link number} at offset.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {number} Float32 as {@link number}.
     * */
    readFloat32(pointer: IPointer = this.pointer, littleEndian: boolean = true): number {
        viewInt32[0] = this.readInt32(pointer, littleEndian);
        return viewFloat32[0];
    }

    /**
     * @description Write Float32 {@link number} as 4 bytes at offset.
     * @param {number} value Float32 as {@link number}.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {this} self.
     * */
    writeFloat32(value: number, pointer: IPointer = this.pointer, littleEndian: boolean = true): this {
        viewFloat32[0] = value;
        this.writeInt32(viewInt32[0], pointer, littleEndian);
        return this;
    }

    /**
     * @description Read 8 bytes as Float64 {@link number} at offset.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {number} Float64 as {@link number}.
     * */
    readFloat64(pointer: IPointer = this.pointer, littleEndian: boolean = true): number {
        viewInt32[littleEndian ? 0 : 1] = this.readInt32(pointer, littleEndian);
        viewInt32[littleEndian ? 1 : 0] = this.readInt32(pointer, littleEndian);
        return viewFloat64[0];
    }

    /**
     * @description Write Float64 {@link number} as 8 bytes at offset.
     * @param {number} value Float32 as {@link number}.
     * @param {IPointer} [pointer]
     * @param {boolean} [littleEndian] Indicates whether stored in little- or big-endian format.
     * @return {this} self.
     * */
    writeFloat64(value: number, pointer: IPointer = this.pointer, littleEndian: boolean = true): this {
        viewFloat64[0] = value;
        this.writeInt32(viewInt32[littleEndian ? 0 : 1], pointer, littleEndian);
        this.writeInt32(viewInt32[littleEndian ? 1 : 0], pointer, littleEndian);
        return this;
    }

    /**
     * @description Read length of string in bytes and {@link string} at offset in unicode.
     * @param {IPointer} [pointer]
     * todo different string types
     * @return {string} {@link string}. todo write describe reading
     * */
    readString(pointer: IPointer = this.pointer): string {

        const byteLength = this.readUint32(pointer);
        const stringBuffer = new Uint8Array(byteLength);
        for (let i = 0; i < byteLength; i++) {
            stringBuffer[i] = this.readUint8(pointer);
        }
        return textDecoder.decode(stringBuffer);

    }

    /**
     * @description Write length of string in bytes and {@link string} at offset in unicode.
     * @param {string} value {@link string}.
     * @param {IPointer} [pointer]
     * @return {this} self.
     * */
    writeString(value: string, pointer: IPointer = this.pointer): this {

        const stringBuffer = textEncoder.encode(value);

        this.writeUint32(stringBuffer.byteLength, pointer);
        for (let i = 0; i < stringBuffer.byteLength; i++) {
            this.writeUint8(stringBuffer[i], pointer);
        }
        return this;

    }


}

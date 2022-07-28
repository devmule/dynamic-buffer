export function roundBitsToBytes(bitsCount: number): number {
    let bytesCount = 0;
    let roundedBits = 0;
    while (roundedBits < bitsCount) {
        roundedBits += 8;
        bytesCount++;
    }
    return bytesCount;
}

export class DynamicBitBuffer {

    private bitOffset: number = 0;
    private readonly bits: boolean[] = [];

    constructor(buffer?: ArrayBufferLike) {
        if (buffer) this.fromBuffer(buffer);
    }

    fromBuffer(buffer: ArrayBufferLike): void {

        this.bitOffset = 0;
        this.bits.length = 0;

        const view = new Uint8Array(buffer);

        for (let offset = 0; offset < view.length; offset++) {
            const uint8 = view[offset]
            this.bits.push(
                Boolean(uint8 & 1),
                Boolean(uint8 & 2),
                Boolean(uint8 & 4),
                Boolean(uint8 & 8),
                Boolean(uint8 & 16),
                Boolean(uint8 & 32),
                Boolean(uint8 & 64),
                Boolean(uint8 & 128),
            )
        }

    }

    generateBuffer(): ArrayBufferLike {

        const bytesCount = roundBitsToBytes(this.bits.length);
        const bitView = new Uint8Array(bytesCount);

        for (let byteIndex = 0; byteIndex < bytesCount; byteIndex++) {
            const shift = byteIndex * 8;
            bitView[byteIndex] = (this.bits[shift] ? 1 : 0)
                | (this.bits[shift + 1] ? 2 : 0)
                | (this.bits[shift + 2] ? 4 : 0)
                | (this.bits[shift + 3] ? 8 : 0)
                | (this.bits[shift + 4] ? 16 : 0)
                | (this.bits[shift + 5] ? 32 : 0)
                | (this.bits[shift + 6] ? 64 : 0)
                | (this.bits[shift + 7] ? 128 : 0);
        }

        return bitView.buffer;

    }

    readBit(offset?: number): boolean {
        offset = offset ?? this.bitOffset++;
        return this.bits[offset] ?? false;
    }

    writeBit(value: boolean, offset?: number): void {
        offset = offset ?? this.bitOffset++;
        this.bits[offset] = value;
    }

}
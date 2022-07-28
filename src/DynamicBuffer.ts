export class DynamicBuffer {

    private pointer: number = 0;
    private bytes: number[] = [];

    fromBuffer(buffer: ArrayBufferLike): void {
    }

    generateBuffer(): ArrayBufferLike {
        return new ArrayBuffer(1); // fixme
    }

}
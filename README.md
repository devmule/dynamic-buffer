# dynamic-buffer

dynamic-buffer lib implements a class `DynamicBuffer` 
which provides an interface for reading and writing different low-level data types 
without the need to define length of the buffer. 


Usage example:
```typescript

import { DynamicBuffer } from "dynamic-buffer"


// writing
const dynamicBufferWrite = new DynamicBuffer();

dynamicBufferWrite.writeBoolean(true);
dynamicBufferWrite.writeInt8(4);
dynamicBufferWrite.writeFloat64(1.7E+308);
dynamicBufferWrite.writeString("str");

const arrayBuffer = dynamicBufferWrite.generateBuffer();
console.log(arrayBuffer);
// ArrayBuffer {
// [Uint8Contents]: <01 04 76 3b 77 30 d1 42 ee 7f 03 00 00 00 73 74 72>,
//     byteLength: 17
// }


// reading
const dynamicBufferRead = new DynamicBuffer(arrayBuffer);
console.log(dynamicBufferRead.readBoolean());
// true
console.log(dynamicBufferRead.readInt8());
// 4
console.log(dynamicBufferRead.readFloat64());
// 1.7e+308
console.log(dynamicBufferRead.readString());
// str

```

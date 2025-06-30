const button = document.querySelector("#button");
const text = document.querySelector("#hash");
const img = document.querySelector("#img");

button.addEventListener("click", async (e) => {
  // download file and get a dataview for easier manupulation
  const req = await fetch("/image.png");
  const buff = await req.arrayBuffer();
  const view = new DataView(buff);

  // gets the png signature
  const sig = buff.slice(0, 8);

  // basically pngs are split in chunks, we wanna add a new text chunk with random text so the final hash is random
  // we now extract all chunks to make it easier to work with
  const splitChunks = () => {
    const chunks = [];
    let offset = 8;

    while (offset < buff.byteLength) {
      const length = view.getUint32(offset);
      const type = new TextDecoder().decode(
        new Uint8Array(buff, offset + 4, 4)
      );
      const data = new Uint8Array(buff, offset + 8, length);
      const crc = view.getUint32(offset + 8 + length);

      chunks.push({ length, type, data, crc });
      offset += 12 + length;
    }

    return chunks;
  };

  const chunks = splitChunks();

  // cyclic redundency algo impl needed for png, an actual package is better in a real app, please dont just take this i mightve messed something up
  const crcTable = (() => {
    let c;
    let table = [];

    for (let n = 0; n < 256; n++) {
      c = n;

      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }

      table[n] = c;
    }

    return table;
  })();

  const crc32 = (buff) => {
    let crc = ~0;

    for (let i = 0; i < buff.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crcTable ^ buff[i]) & 0xff];
    }

    return ~crc >>> 0;
  };

  // now we create our own chunk
  const keyword = "HashScramble"; // used to identify the text chunk
  const random = Math.random().toString(30).slice(2); // create the random value
  const textData = new TextEncoder().encode(keyword + "\0" + random); // create the actual chunk data

  // create the chunk
  const createChunk = (type, data) => {
    const input = new Uint8Array(type.length + data.length);
    input.set(new TextEncoder().encode(type), 0);
    input.set(data, type.length);

    const crc = crc32(input);
    return { type, data, crc };
  };

  const randomChunk = createChunk("tEXt", textData);

  // now we have to construct the png with our new chunk

  const newChunks = [];

  // we gotta insert our own before IEND
  chunks.forEach((chunk) => {
    if (chunk.type == "IEND") newChunks.push(randomChunk);
    newChunks.push(chunk);
  });

  // collect the blob parts
  const parts = [sig];

  newChunks.forEach((chunk) => {
    const lengthBuff = new Uint8Array(4);
    new DataView(lengthBuff.buffer).setUint32(0, chunk.data.length);
    parts.push(lengthBuff);

    const typeBuff = new TextEncoder().encode(chunk.type);
    parts.push(typeBuff);
    parts.push(chunk.data);

    const crcBuff = new Uint8Array(4);
    new DataView(crcBuff.buffer).setUint32(0, chunk.crc);
    parts.push(crcBuff);
  });

  // create the blob
  const blob = new Blob(parts, { type: "image/png" });

  // get the sha256 to display on site (for you to see that it works ;)

  const sha256 = async (blob) => {
    const buff = await blob.arrayBuffer();
    const hashBuff = await crypto.subtle.digest("SHA-256", buff);
    const hashArray = Array.from(new Uint8Array(hashBuff));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // display all the info on the site
  img.src = URL.createObjectURL(blob);
  text.innerText = "Hash:" + (await sha256(blob));
});

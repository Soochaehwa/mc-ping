import ByteBuffer from "bytebuffer";

const ChannelData = (res, version, required) => {
  return {
    res,
    version,
    required,
  };
};

const ModData = (modId, modmarker) => {
  return {
    modId,
    modmarker,
  };
};

const decode = (s) => {
  const size0 = s.charCodeAt(0);
  const size1 = s.charCodeAt(1);
  const size = size0 | (size1 << 15);
  const buf = new ByteBuffer(size);

  let stringIndex = 2;
  let buffer = 0;
  let bitsInBuf = 0;

  while (stringIndex < s.length) {
    while (bitsInBuf >= 8) {
      buf.writeByte(buffer);
      buffer >>>= 8;
      bitsInBuf -= 8;
    }

    let c = s.charCodeAt(stringIndex);
    buffer |= (c & 0x7fff) << bitsInBuf;
    bitsInBuf += 15;
    stringIndex++;
  }
  buf.reset();
  while (buf.remaining() < size) {
    buf.writeByte(buffer);
    buffer >>>= 8;
    bitsInBuf -= 8;
  }

  return buf;
};

const deserialize = (buffer) => {
  const mods = [];
  const channels = [];
  const truncated = buffer.readByte();
  const modSize = buffer.readShort();

  for (let i = 0; i < modSize; i++) {
    const channelSizeAndVersionFlag = buffer.readVarint32();
    const channelSize = channelSizeAndVersionFlag >>> 1;
    const isIgnoreServerOnly = (channelSizeAndVersionFlag & 0b1) != 0;
    const modId = buffer.readVString();
    const modVersion = isIgnoreServerOnly ? "SERVER_ONLY" : buffer.readVString();

    for (let i1 = 0; i1 < channelSize; i1++) {
      const channelName = buffer.readVString();
      const channelVersion = buffer.readVString();
      const requiredOnClient = buffer.readByte() !== 0;
      const id = `${modId}:${channelName}`;
      channels.push(ChannelData(id, channelVersion, requiredOnClient));
    }
    mods.push(ModData(modId, modVersion));
  }

  const nonModChannelCount = buffer.readVarint32();
  for (let i = 0; i < nonModChannelCount; i++) {
    const channelName = buffer.readVString();
    const channelVersion = buffer.readVString();
    const requiredOnClient = buffer.readByte() !== 0;
    channels.push(ChannelData(channelName, channelVersion, requiredOnClient));
  }
  return { mods, channels };
};

export default {
  decode,
  deserialize,
};

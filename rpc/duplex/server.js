const net = require('net')
const CAT_NAMES = require('../cats').CAT_NAMES

const server = net.createServer(socket => {
  // let oldBuffer = null
  
  socket.on('data', buffer => {
    // Concat the remaining buffer on previous multiplexing chain
    // if (oldBuffer) {
    //   buffer = Buffer.concat([oldBuffer, buffer])
    // }

    let packetLength = 0
    while (packetLength = checkBufferCompleteness(buffer)) {
      
      const packet = buffer.slice(0, packetLength)
      buffer = buffer.slice(packetLength)
      console.log(buffer.length)
      const result = decode(packet)

      const catName = CAT_NAMES[result.data]
      console.log(`got cat name: ${catName}.`)
      
      socket.write(
        encode(catName, result.seq)
      )
    }
    
    // oldBuffer = buffer
  })
})

const port = 4000

server.listen(port, () => {
  console.log(`server listening at http://127.0.0.1:${port}`)
})

/**
 * Binary packet encoding function
 */
function encode(data, seq) {
  // Encoding a packet using protocal-buffers in a complex scene is more properly, not the implement here.
  const body = Buffer.from(data)

  // In general, a rpc-call is divided into a fixed-length header and an indefinite-length packet.
  // The header is a payload of a packet sequence number and length for duplex communication.
  const header = Buffer.alloc(6)
  header.writeInt16BE(seq)
  header.writeInt32BE(body.length, 2)

  const buffer = Buffer.concat([header, body])

  return buffer
}

/**
 * Binary packet decoding function
 */
function decode(buffer) {
  const header = buffer.slice(0, 6)
  const seq = header.readInt16BE()

  // Decoding a packet using protocal-buffers in a complex scene is more properly, not the implement here.
  const body = buffer.slice(6).readInt32BE()

  return {
    seq,
    data: body
  }
}

/**
 * Check a buffer if it is complete
 */
function checkBufferCompleteness(buffer) {
  // Return 0 if buffer's length less than 6, it means that the buffer has not been received completely.
  if (buffer.length < 6) {
    return 0
  }
  const bodyLength = buffer.readInt32BE(2)
  return 6 + bodyLength
}
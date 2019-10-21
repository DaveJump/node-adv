const net = require('net')
const CAT_IDS = require('../cats').CAT_IDS

const socket = new net.Socket({})

socket.connect({
  host: '127.0.0.1',
  port: 4000
})

// let oldBuffer = null
socket.on('data', buffer => {
  // Concat the remaining buffer on previous chain
  // if (oldBuffer) {
  //   buffer = Buffer.concat([oldBuffer, buffer])
  // }

  let completeLength = 0
  while (completeLength = checkBufferCompleteness(buffer)) {
    const packet = buffer.slice(0, completeLength)
    buffer = buffer.slice(completeLength)

    const result = decode(packet)
    console.log(`packet ${result.seq}，returns ${result.data}`)
  }

  // oldBuffer = buffer
})

let seq = 0

function encode(data) {
  const body = Buffer.alloc(4)

  body.writeInt32BE(CAT_IDS[data.id])

  const header = Buffer.alloc(6)
  header.writeInt16BE(seq)
  header.writeInt32BE(body.length, 2)

  const buffer = Buffer.concat([header, body])

  console.log(`packet ${seq}, CAT_ID is ${CAT_IDS[data.id]}`)
  seq++
  return buffer
}

function decode(buffer) {
  const header = buffer.slice(0, 6)
  const seq = header.readInt16BE()

  const body = buffer.slice(6)

  return {
    seq,
    data: body.toString()
  }
}

function checkBufferCompleteness(buffer) {
  if (buffer.length < 6) {
    return 0
  }
  const bodyLength = buffer.readInt32BE(2)
  return 6 + bodyLength
}

// Simulating requests intermittently
// let timer = setInterval(() => {
//   let id = Math.floor(Math.random() * CAT_IDS.length)
//   socket.write(encode({ id }))
// }, 200)

// setTimeout(() => {
//   clearInterval(timer)
//   timer = null
//   process.exit()
// }, 200 * 21)

// Simulating multiple requests by TCP-multiplexing
for (let i = 0; i < 20;i ++) {
  let id = Math.floor(Math.random() * CAT_IDS.length)
  socket.write(encode({ id }))
}
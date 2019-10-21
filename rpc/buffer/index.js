const fs = require('fs')
const protobuf = require('protocol-buffers')

// Compile out a javascript object by essential buffer protocal, it contains an encode function and a decode function.
// Note that this operation can be done directly in the process startup during your actual server coding, because it is an unnecessary performance consumption in the http communication process.
const schemas = protobuf(fs.readFileSync(`${__dirname}/schemas.proto`))

const buffer = schemas.Animal.encode({
  id: 1,
  name: 'kitty',
  cat: []
})

console.log(buffer)
console.log(schemas.Animal.decode(buffer))
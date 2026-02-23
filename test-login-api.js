import http from 'http'

const data = JSON.stringify({
  phone: '+998 11 111 11 11',
  pass: '1111'
})

const options = {
  hostname: 'localhost',
  port: 5003,
  path: '/api/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

console.log('Testing login API...')
console.log('Phone: +998 11 111 11 11')
console.log('Pass: 1111')
console.log('')

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`)
  console.log(`Headers: ${JSON.stringify(res.headers)}`)
  
  let body = ''
  res.on('data', (chunk) => {
    body += chunk
  })
  
  res.on('end', () => {
    console.log('Response:', body)
    try {
      const json = JSON.parse(body)
      console.log('Parsed:', JSON.stringify(json, null, 2))
    } catch (e) {
      console.log('Could not parse JSON')
    }
    process.exit(0)
  })
})

req.on('error', (error) => {
  console.error('Error:', error)
  process.exit(1)
})

req.write(data)
req.end()

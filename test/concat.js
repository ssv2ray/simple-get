var get = require('../')
var http = require('http')
var str = require('string-to-stream')
var test = require('tape')

test('get.concat (post, stream body, and json option)', function (t) {
  t.plan(4)

  var server = http.createServer(function (req, res) {
    res.statusCode = 200
    req.pipe(res)
  })

  server.listen(0, function () {
    var port = server.address().port
    var opts = {
      url: 'http://localhost:' + port,
      body: str('{"a": "b"}'),
      method: 'POST',
      json: true
    }
    get.concat(opts, function (err, res, data) {
      t.error(err)
      t.equal(typeof data, 'object')
      t.deepEqual(Object.keys(data), ['a'])
      t.equal(data.a, 'b')
      server.close()
    })
  })
})

test('get.concat', function (t) {
  t.plan(4)
  var server = http.createServer(function (req, res) {
    res.statusCode = 200
    res.end('blah blah blah')
  })

  server.listen(0, function () {
    var port = server.address().port
    get.concat('http://localhost:' + port, function (err, res, data) {
      t.error(err)
      t.equal(res.statusCode, 200)
      t.ok(Buffer.isBuffer(data), '`data` is type buffer')
      t.equal(data.toString(), 'blah blah blah')
      server.close()
    })
  })
})

test('get.concat json', function (t) {
  t.plan(3)
  var server = http.createServer(function (req, res) {
    res.statusCode = 200
    res.end('{"message":"response"}')
  })

  server.listen(0, function () {
    var port = server.address().port
    var opts = {
      url: 'http://localhost:' + port + '/path',
      json: true
    }
    get.concat(opts, function (err, res, data) {
      t.error(err)
      t.equal(res.statusCode, 200)
      t.equal(data.message, 'response')
      server.close()
    })
  })
})

test('get.concat json error', function (t) {
  t.plan(1)
  var server = http.createServer(function (req, res) {
    res.statusCode = 500
    res.end('not json')
  })

  server.listen(0, function () {
    var port = server.address().port
    var opts = {
      url: 'http://localhost:' + port + '/path',
      json: true
    }
    get.concat(opts, function (err, res, data) {
      t.ok(err instanceof Error)
      server.close()
    })
  })
})

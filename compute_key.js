var yaml = require('node-yaml')
var hash = require('hash.js')

var args = process.argv.slice(2);
var user = args[0]

yaml.read('config.dev.yml', function(err,data) { 
    console.log('user: ' + user);

    password = hash.sha256().update(data.apiSecret + user).digest('hex')

    console.log('password: ' + password);
})

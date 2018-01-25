'use strict';

var hash = require('hash.js')
var AWS = require('aws-sdk');
var route53 = new AWS.Route53();

module.exports.dnsupdate = (event, context, callback) => {
  const query_params = event.queryStringParameters;
  const ip = query_params.i;
  const user = query_params.l;
  const pass = query_params.p;

  var domain = process.env.domain; 
  if (user != 'root') {
    domain = "." + user + domain;
  }

  var host = query_params.h;
  if (host.endsWith(domain)) {
    host = host.substr(0, host.length - domain.length)
  }

  var expected_password = hash.sha256().update(process.env.apiSecret + user).digest('hex')

  console.log(JSON.stringify({
    ip: ip,
    user: user,
    pass: pass,
    host: host,
    domain: domain,
    expected_password: expected_password
  }));

  if (pass == expected_password) {
    var params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: host + domain,
              ResourceRecords: [
                {
                  Value: ip
                }
              ],
              TTL: 60,
              Type: "A"
            }
          }
        ],
        Comment: "Updated via dyndns"
      },
      HostedZoneId: process.env.hostedZoneId
    };
    route53.changeResourceRecordSets(params, function (err, data) {
      if (err) {
        callback(null, {
          statusCode: 500,
          body: JSON.stringify(err),
        });
      }
      else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(data),
        });
      }
    });
  }
  else {
    callback(null, {
      statusCode: 403,
      body: JSON.stringify({
        message: "invalid user or password"
      }),
    });
  }
};

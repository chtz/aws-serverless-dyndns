'use strict';

var AWS = require('aws-sdk');
var route53 = new AWS.Route53();

/* module.exports.hello = (event, context, callback) => {
  const request_body = JSON.parse(event.body);

  var params = {
    ChangeBatch: {
      Changes: [
        {
          Action: "UPSERT",
          ResourceRecordSet: {
            Name: "home.iraten.ch.",
            ResourceRecords: [
              {
                Value: request_body.ip
              }
            ],
            TTL: 60,
            Type: "A"
          }
        }
      ],
      Comment: "Updated vis dyndns"
    },
    HostedZoneId: "Z1910YI2GB0C92"
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
}; */

module.exports.dnsupdate = (event, context, callback) => {
  const query_params = event.queryStringParameters;
  const ip = query_params.i;
  const user = query_params.l;
  const pass = query_params.p;
  const domain = query_params.h;

  console.log(JSON.stringify({
    ip: ip,
    user: user,
    pass: pass,
    domain: domain,
  }));

  if (user == process.env.apiUser && pass == process.env.apiPassword) {
    var params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: domain,
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
      HostedZoneId: "Z1910YI2GB0C92"
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


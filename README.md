# aws-serverless-dyndns
fritz.box-ready dyndns endpoint for Route53 (experimental)

# how to

1) configuration

```
$ cat config.dev.yml 
apiSecret: EB1F08A6-2752-4909-AD06-B01BA480FD41
hostedZoneId: "Z1910YI2GB0C92"
domain: ".dyn.p.iraten.ch."
```

2) generate API keys for your users

```
$ node compute_key.js apiUser1
user: apiUser1
password: de8e574b21f81392f3efa28fd7dcad083364f4b3e8d975c8661704f37e2d4e73
```

3) deploy to AWS (pre-cond: working AWS CLI setup)

```
$ ./deploy.sh
...
endpoints:
  GET - https://3m5hefjm72.execute-api.us-east-1.amazonaws.com/dev/dnsupdate
...
```

4) update DNS (simulate fritz.box dyndns update)

```
$ curl 'https://3m5hefjm72.execute-api.us-east-1.amazonaws.com/dev/dnsupdate?i=127.0.0.2&l=apiUser1&p=de8e574b21f81392f3efa28fd7dcad083364f4b3e8d975c8661704f37e2d4e73&h=foo'
{"ChangeInfo":{"Id":"/change/C1G1H5SYS5R6LA","Status":"PENDING","SubmittedAt":"2018-01-25T22:07:13.978Z","Comment":"Updated via dyndns"}}
```

5) verify (after some time)
```
$ nslookup foo.apiUser1.dyn.p.iraten.ch.
...
Address: 127.0.0.2
```

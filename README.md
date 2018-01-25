# aws-serverless-dyndns
fritz.box-ready dyndns endpoint for Route53 (experimental)

# how to

1) configuration

```
$ vi config.dev.yml
apiSecret: mySecretDontShareWithUsers
```

2) generate API keys for your users

```
$ node compute_key.js apiUser1
user: apiUser1
password: 7e353738e4f77453c3e4e91782d46d126bef6e698445874d782066de9271fc76
```

3) deploy to AWS (pre-cond: working AWS CLI setup)

```
$ ./deploy.sh
...
endpoints:
  GET - https://<your endpoint>.execute-api.us-east-1.amazonaws.com/dev/dnsupdate
...
```

4) update DNS (simulate fritz.box dyndns update)

```
curl 'https://<your endpoint>.execute-api.us-east-1.amazonaws.com/dev/dnsupdate?i=127.0.0.1&l=apiUser1&p=7e353738e4f77453c3e4e91782d46d126bef6e698445874d782066de9271fc76&h=home'
$ 
{"ChangeInfo":{"Id":"/change/C23ENPCGQ3DM6A","Status":"PENDING","SubmittedAt":"2018-01-25T21:50:17.240Z","Comment":"Updated via dyndns"}}
```

5) verify (after some time)
```
$ nslookup home.dyn.p.iraten.ch.
...
Address: 127.0.0.1
```

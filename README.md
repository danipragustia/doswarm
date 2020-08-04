# DoSwarm
Simple script to making swarm of Digital Ocean VPS in time.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/doswarm/MKVRipa/LICENSE)

## Why this matter?
The last API Wrapper which provider for Node.js is outdated, so to make it more extendable. I making these script.

## How to use
1. Make Boilerplate config and save it to `config.json`
2. Fill `token` ([API KEY](https://www.digitalocean.com/community/tutorials/how-to-create-a-digitalocean-space-and-api-key#creating-an-access-key)) and `ssh_id` (Your SSH ID from imported to Digital Ocean)
3. Run `node main.js`

## Config Boilerplate
```json
    "token":"",
    "ssh_id":"",
    "size":"s-1vcpu-1gb",
    "image":"ubuntu-16-04-x64",
    "ipv6":true,
    "regions":[
        {
            "slug": "nyc1",
            "state": "y"
        }
    ],
    "public_key":""
}

```


## How to use?
Simply start 'node main.js'

## License
MIT

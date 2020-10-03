const http = require('https')
const util = require('util')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const config = require('./config.json')

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function main() {
    getBalance().then((res) => {
	console.log('Saldo : $' + res.account_balance)
	console.log('1. Buat VPS')
	console.log('2. Cek semua droplets (doswarm)')
	console.log('3. Hapus semua VPS (doswarm)')
	console.log('4. Cek semua droplets (semua)')
	console.log('5. Hapus semua VPS (semua)')
	console.log('6. Lihat Config')
	console.log('10. Import SSH Key')
	console.log('0. Keluar dari program')
	readline.question(`> `, select => {
	    if (select == 1) {
		console.log(config,'\n')
		readline.question('Apa anda yakin untuk membuat droplets [y/n] (default y)?  ', good => {
		    if (good == 'y' || 'Y' || '') {
			console.log('\n[+] Memulai membuat droplets...')
			let i = 1
			let regions = config.regions.filter((x) => x.state == 'y')
			regions.map((xe) => {
			    sleep(3000).then(() => {
				createDroplet(xe.slug, config.size, config.image, config.ipv6).then((res) => {
				    if (i === regions.length) {
					sleep(3000).then(() => {
					    listAllDroplets('doswarm').then((droplets) => {
						if (droplets.meta.total !== 0) {
						    let i = 1
						    droplets['droplets'].map(x => {
							sleep(2000).then(() => {
							    infoDroplet(x.id).then((y) => {
								console.log('  [' + i + '/' + regions.length + '] droplet [' + xe.slug + '] telah terbuat')
								console.log('    [-] IP : ' + y['droplet'].networks['v4'][1].ip_address)
								if (i === droplets.meta.total) {
								    console.log('[+] Selesai')
								    console.log()
								    main()
								} else {
								    //console.log(i + '/' + droplets.meta.total)
								    i++
								}
							    }).catch((err) => {
								Logerror(err)
							    })

							})
						    })
						} else {
						    console.log('[+] Tidak ada droplets')
						    console.log()
						    main()
						}
					    })
					})
				    } else {
					i++
				    }
				}).catch((err) => {
				    Logerror(err)
				})
			    })
			})
		    } else if (good == 'n' || 'N') {
			main()
		    } else {
			main()
		    }
		})
	    } else if (select == 2) {
		console.log('\n[+] Mengambil data...')
		listAllDroplets('doswarm').then((droplets) => {
		    if (droplets.meta.total !== 0) {
			let i = 1
			droplets['droplets'].map(x => {
			    infoDroplet(x.id).then((y) => {
				if (y['droplet'].networks['v4'][1]) {
				    console.log('[' + x.name + '] (' + y['droplet'].region.slug +  ') ' + x.size_slug + ' - ' + y['droplet'].networks['v4'][1].ip_address)
				} else {
				    console.log('[' + x.name + '] (' + y['droplet'].region.slug +  ') ' + x.size_slug + ' - ' + y['droplet'].networks['v4'][0].ip_address)
				}
				if (i === droplets.meta.total) {
				    console.log('\n')
				    main()
				} else {
				    //console.log(i + '/' + droplets.meta.total)
				    i++
				}
			    }).catch((err) => {
				Logerror(err)
			    })
			})
		    } else {
			console.log('[+] Tidak ada droplets')
			console.log()
			main()
		    }
		})
	    } else if (select == 3) {
		console.log()
		readline.question('Apa anda yakin menghapus semua VPS dari doswarm [y/n] (default y)? ', good => {
		    if (good == 'y' || 'Y' || '') {
			sleep(3000).then(() => {
			    deleteAllDroplets('doswarm').then((res) => {
				console.log('[+] VPS telah dihapus!')
				console.log()
				main()
			    }).catch((err) => {
				Logerror(err)
			    })
			})
		    } else if ('good' == 'n' || 'N') {
			main()
		    } else {
			main()
		    }
		})
	    } else if (select == 4) {
		console.log()
		console.log('\n[+] Mengambil data...')
		listFullDroplets().then((droplets) => {
		    if (droplets.meta.total !== 0) {
			let i = 1
			droplets['droplets'].map(x => {
			    infoDroplet(x.id).then((y) => {
				if (y['droplet'].networks['v4'][1]) {
				    console.log('[' + x.name + '] (' + y['droplet'].region.slug +  ') ' + x.size_slug + ' - ' + y['droplet'].networks['v4'][1].ip_address)
				} else {
				    console.log('[' + x.name + '] (' + y['droplet'].region.slug +  ') ' + x.size_slug + ' - ' + y['droplet'].networks['v4'][0].ip_address)
				}
				if (i === droplets.meta.total) {
				    console.log('\n')
				    main()
				} else {
				    //console.log(i + '/' + droplets.meta.total)
				    i++
				}
			    }).catch((err) => {
				Logerror(err)
			    })
			})
		    } else {
			console.log('[+] Tidak ada droplets')
			console.log()
			main()
		    }
		}).catch((err) => {
		    Logerror(err)
		})
		console.log()
	    } else if (select == 5) {
		console.log()
		listFullDroplets().then((droplets) => {
		    if (droplets.meta.total !== 0) {
			let i = 1
			droplets['droplets'].map(x => {
			    deleteDroplet(x.id)
			    console.log('[' + i + '/' + droplets.meta.total + '] Berhasil Hapus (' + x.name + ')')
			    if (i === droplets.meta.total) {
				console.log('\n')
				console.log('[+] VPS telah dihapus!')
				main()
			    } else {
				//console.log(i + '/' + droplets.meta.total)
				i++
			    }
			})
		    }
		})
		console.log()
	    } else if (select == 6) {
		console.log()
		console.log(config)
		console.log()
		main()
	    } else if (select == 10) {
		makeSSH().then((res) => {
		    console.log('\n')
		    console.log(res)
		    console.log('Silahkan diganti ssh_id di config.json dengan ssh_id diatas')
		    console.log('\n')
		    main()
		}).catch((err) => {
		    Logerror(err)
		})
	    } else if (select == 0) {
		readline.close()
		process.exit()
	    } else {
		console.log('\n', 'Invalid command!','\n')
		main()
	    }
	})
    }).catch((err) => {
	Logerror(err)
    })
}

let deleteAllDroplets = (tag) => {
   return new Promise((resolve, reject) => {
	let req = http.request({
	    hostname: 'api.digitalocean.com',
	    path: '/v2/droplets?tag_name=' + tag,
	    method: 'DELETE',
	    headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + config.token
	    }
	}, (res) => {
	    let data = ''
	    res.on('data', (chunk) => {
		data += chunk
	    })
	    res.on('end', () => {
		resolve(data)
	    })

	    res.on('error', (err) => {
		reject(err)
	    })
	})

	req.write('')
	req.end()
    })
}

let deleteDroplet = (id) => {
   return new Promise((resolve, reject) => {
	let req = http.request({
	    hostname: 'api.digitalocean.com',
	    path: '/v2/droplets/' + id,
	    method: 'DELETE',
	    headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + config.token
	    }
	}, (res) => {
	    let data = ''
	    res.on('data', (chunk) => {
		data += chunk
	    })
	    res.on('end', () => {
		resolve(data)
	    })

	    res.on('error', (err) => {
		reject(err)
	    })
	})

	req.write('')
	req.end()
    })
}

let makeSSH = () => {
    return new Promise((resolve, reject) => {
	let req = http.request({
	    hostname: 'api.digitalocean.com',
	    path: '/v2/account/keys',
	    method: 'POST',
	    headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + config.token
	    }
	}, (res) => {
	    let data = ''
	    res.on('data', (chunk) => {
		data += chunk
	    })
	    res.on('end', () => {
		resolve(JSON.parse(data))
	    })

	    res.on('error', (err) => {
		reject(err)
	    })
	})

	req.write(JSON.stringify({
	    "name": "DOSwarm Key",
	    "public_key": config.public_key
	}))
	req.end()
    })
}

let Logerror = (data) => {
    console.log('[ERROR] - ' + data)
    console.log('Ada beberapa kemungkinan :')
    console.log(' - Menggunakan API terlalu cepat')
    console.log(' - Mengubah file config saat proses berjalan')
    console.log('Jika anda yakin bukan masalah diatas, harap buat issue baru')
    console.log('Keluar dari program...')
    process.exit()
}

let infoDroplet = (id) => {
    return new Promise((resolve, reject) => {
	http.get({
	    hostname: 'api.digitalocean.com',
	    path: '/v2/droplets/' + id,
	    method: 'GET',
	    headers: {
		'Authorization': 'Bearer '  + config.token
	    }
	}, (res) => {
	    let data = ''
	    res.on('data', (chunk) => {
		data += chunk
	    })
	    res.on('end', () => {
		resolve(JSON.parse(data))
	    })

	    res.on('error', (err) => {
		reject(err)
	    })
	})
    })
}

let createDroplet = (region, size, image, ipv6) => {
    return new Promise((resolve, reject) => {
	let req = http.request({
	    hostname: 'api.digitalocean.com',
	    path: '/v2/droplets',
	    method: 'POST',
	    headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + config.token
	    }
	}, (res) => {
	    let data = ''
	    res.on('data', (chunk) => {
		data += chunk
	    })
	    res.on('end', () => {
		resolve(JSON.parse(data))
	    })
	    res.on('error', (err) => {
		reject(err)
	    })
	})
	req.write(JSON.stringify({
	    'name': 'doswarm',
	    'region': region,
	    'size': size,
	    'image': image,
	    'ssh_keys': [
		config.ssh_id
	    ],
	    'backups': false,
	    'ipv6': ipv6,
	    'user_data': null,
	    'private_networking': null,
	    'volumes': null,
	    'tags': [
		'doswarm'
	    ]
	}))
	req.end()
    })
}

let getBalance = () => {
    return new Promise((resolve, reject) => {
	http.get({
	    hostname: 'api.digitalocean.com',
	    path: '/v2/customers/my/balance',
	    method: 'GET',
	    headers: {
		'Authorization': 'Bearer ' + config.token
	    }
	}, (res) => {
	    let data =''
	    res.on('data', (chunk) => {
		data += chunk
	    })
	    res.on('end', () => {
		resolve(JSON.parse(data))
	    })
	    res.on('error', (err) => {
		reject(err)
	    })
	})
    })
}

let listAllDroplets = (tag) => {
    return new Promise((resolve, reject) => {
	http.get({
	    hostname: 'api.digitalocean.com',
	    path: '/v2/droplets?tag_name=' + tag,
	    method: 'GET',
	    headers : {
		'Authorization': 'Bearer '  + config.token
	    }
	}, (res) => {
	    let data = ''
	    res.on('data', (chunk) => {
		data += chunk
	    })
	    res.on('end', () => {
		resolve(JSON.parse(data))
	    })

	    res.on('error', (err) => {
		reject(err)
	    })
	})
    })
}

let listFullDroplets = () => {
    return new Promise((resolve, reject) => {
	http.get({
	    hostname: 'api.digitalocean.com',
	    path: '/v2/droplets',
	    method: 'GET',
	    headers : {
		'Authorization': 'Bearer '  + config.token
	    }
	}, (res) => {
	    let data = ''
	    res.on('data', (chunk) => {
		data += chunk
	    })
	    res.on('end', () => {
		resolve(JSON.parse(data))
	    })
	    res.on('error', (err) => {
		reject(err)
	    })
	})
    })
}

main()

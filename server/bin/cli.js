import { Command } from 'commander'
import pkg from '../package.json' assert {type: 'json'}
import { http_server_start } from '../index.js'

const cmd = new Command()

cmd
	.name(Object.keys(pkg.bin)[0])
 	.description('DBA(Dom Based Application) server CLI use for development')
	.version(pkg.version)

cmd
	.command('start')
	.option('-D --dir <path>', 'root dir', './')
	.action(http_server_start)

cmd.parse()
import {createServer} from 'node:http'
import {PassThrough} from 'node:stream'
import {stat, createReadStream, createWriteStream} from 'node:fs'
import {normalize, resolve, join} from 'node:path'
import {createGzip, createDeflate} from 'zlib'
import mime from 'mime'

const ROOT_LIMIT = 'request try access file out of root'
export const ROOT_DIR = './'

// 如果需要支持旧式文件签名，把规则加入support_file列表中，如:.js?ver=7h2h83j
const config = {
	is_spa: true,
	root: './',
	support_file: ['.html', '.xml', '.js', '.mjs', '.css', '.less', '.sass', 'svg', '.png', '.jpg', '.jpeg', '.webp', '.mp4', '.m3m8', '.mp3']
}

const http_server = createServer()
const noop = a => a

async function request_handler(req, res) {

	const mocros = ['/api', '/doc']
	switch (mocros.findIndex((str) => req.url.startsWith(str))){
		case 0: return api_handler(req, res)
		case 1: return doc_handler(req, res)
		case -1:
		default: return await file_handler(req, res)
	}
}

async function file_handler(req, res) {

	let req_path = req.url.split('?')[0]
	let support_file_index = config.support_file.findIndex((file) => req_path.endsWith(file))

	if (support_file_index == -1) {
		req_path = (config.is_spa ? '' : req_path) + 'index.html'
	}

	const root = normalize(resolve(config.root))
	const file = join(root, req_path)
	const is_path_under_root = normalize(resolve(file)).startsWith(root)

	if (is_path_under_root) {

		stat(file, (err) => {

			let req_accept_encoding = req.headers["accept-encoding"]

			if (err) {
				res.writeHead(404)
				res.end(JSON.stringify(err))
			} else {
				let content_type = mime.getType(config.support_file[support_file_index] || 'html')
				res.setHeader('Content-Type', content_type + '; charset=utf-8')
				res.writeHead(200)
				createReadStream(file)
					.on('err', (err) => {
						res.writeHead(500)
						res.end(JSON.stringify(err))
					})
					.pipe(try_encode(req_accept_encoding))
					.pipe(res)
			}
		})
	} else {
		res.writeHead(500)
		res.end()
		console.warn(ROOT_LIMIT)
	}
}

function try_encode(type) {
	let match = /.+(gzip).+(deflate)/ig.exec(type)

	if (!match) return new PassThrough()
	if (match[1]) return createGzip
	if (match[2]) return createDeflate
}

function api_handler(req, res) {
	res.write('api part')
	res.end()
}

function doc_handler(req, res) {
	res.write('api part')
	res.end()
}

function error_handler(err) {
	console.log(err)
}

export function http_server_start(options, command) {
	
	config.root = options.dir

	http_server.listen(3000, (...ser)=>{
		console.log('server running at', 3000)
	})
}


http_server.on('request', request_handler)
http_server.on('error', error_handler)
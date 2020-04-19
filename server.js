const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const mongoClient = require('mongodb').MongoClient
const dbQuery = require('./api/database.js')

let productsList,
    login

dbQuery.dbLoad( 'jordread', '3U4m0btlu4zBnLdm4hvm9L6bUZzSs3YAY1', 'jord', 'products' )
    .then( ( res ) => productsList = res )

http.createServer( function ( req, res ) {

    let filePath = '.' + req.url

    if ( filePath == './' ){

        filePath = './index.html'
        readFile()

    } else if ( req.url === '/api/productsList' ){

        res.statusCode = 200
        res.writeHead( 200, { 'Content-Type': 'application/json' } )
        res.end( JSON.stringify( productsList ), 'utf-8' )

    } else if ( req.url.startsWith( '/api/login' ) ) {

        const queryObject = url.parse( req.url, true ).query
        dbQuery.dbLogin( 'jordread', '3U4m0btlu4zBnLdm4hvm9L6bUZzSs3YAY1', 'jord', 'users', queryObject )
            .then( ( resp ) => {
                res.statusCode = 200
                res.writeHead( 200, { 'Content-Type' : 'application/json' } )
                res.end( JSON.stringify( resp ), 'utf-8' )
            })

    } else if( String( path.extname( req.url ) ) === '' ){

        res.writeHead( 302, { 'Location': '/#' + req.url.replace( '/', '' ) } )
        res.end()

    } else {

        readFile()

    }


    function readFile(){

        let extname = String( path.extname( filePath ) ).toLowerCase()

        let mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        let contentType = mimeTypes[extname] || 'application/octet-stream'

        fs.readFile( filePath, function( error, content ) {
            res.writeHead( 200, { 'Content-Type': contentType } )
            res.end( content, 'utf-8' )
        })
    }

}).listen( 8125 )

console.log( 'Server running at http://127.0.0.1:8125/' )


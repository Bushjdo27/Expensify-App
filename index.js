const http = require('http');
const url = require('url');
const {StringDecoder} = require('string_decoder');
const handlers = require('./lib/handlers')
const config = require('./lib/config');
const helpers = require('./lib/helpers');


const httpServer = http.createServer(function(req , res){
    unifiedServer(req ,res)
});

const unifiedServer = function(req ,res){
    const parseUrl = url.parse(req.url , true);
    const pathname = parseUrl.pathname;
    const trimmedPath = pathname.replace(/^\/+|\/+$/g , "");
    const queryObject = parseUrl.query

    const headers = req.headers;
    const method = req.method.toLowerCase();

    let buffer = '';
    const decoder = new StringDecoder('utf8');

    req.on("data",function(data){
        buffer += decoder.write(data)
    });

    req.on("end", function(){
        buffer += decoder.end()
        const choosenRoute = routes[trimmedPath] !== 'undefined' ? routes[trimmedPath] : routes.notFound;
        const data = {
            queryObject,
            headers,
            method,
            trimmedPath,
            payload: helpers.parseJsonToObject(buffer)
        }
        choosenRoute(data , function(statusCode , payload){

            statusCode = typeof statusCode === 'number' ? statusCode : 200;
            payload = typeof payload === 'object' ? payload : {};

            //res.setHeader('Content-Type' , 'application/json');
            res.writeHeader(statusCode , {
                'Content-Type': 'application/json'
            })
            res.end(JSON.stringify(payload))
        })
    })
    
}

const routes = {
    "home": handlers.home,
    "users": handlers.users,
    "notFound": function(data, callback){
        callback(404 , {Error: "Page not found"})
    }
}

httpServer.listen(config.httpPort , ()=>{
    console.log(`Server is starting at ${config.httpPort}`)
})


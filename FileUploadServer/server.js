import fs from 'fs';
import url from 'url';
import path from 'path';
import http from 'http';

const root = path.resolve(process.argv[2] || '.');
console.debug(`Static root dir: ${root}.`);

//创建服务器
let server = http.createServer(function(request, response){
    console.debug(`${request.method} : ${request.url}`);
    const {method, url} = request;

    if(method === 'GET' && url === '/') {
        fs.readFile('./static/index.html', (err, data) => {
            if(err) {
                response.end(JSON.stringify(err));
            }else {
                response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                response.end(data);
            }
        });
    }else if(method === 'POST' && url === '/upload'){
        const headres = request.headers;
   
        const fileName = decodeURIComponent(headres['file-name']);
        console.log(fileName);

        let _data = [];
        request.on('data', chunk => {
            _data.push(chunk);
            console.log(`Received ${chunk.length} bytes of data.`);
            
        });
        

        request.on('end', () => {
           let postBody = Buffer.concat(_data);
           console.log(`Received ${postBody.length} bytes of postBody.`);
            fs.writeFile(
                `./upload/${fileName}`,
                postBody,
                function (err) {
                    if (err) {
                        console.log(err);
                        response.end(JSON.stringify(err));
                    } else {
                        _data = [];
                        console.log('ok.');
                        response.writeHead(200, { 'Access-Control-Allow-Origin':'*', 
                            'Access-Control-Allow-Headers': 'accept,x-requested-with,Content-Type,X-Custom-Header,file-name', 
                            'Access-Control-Max-Age': 1728000});
                        response.end('ok');
                        
                    }
                }
            );
            response.writeHead(200, {'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*', 
                             'Access-Control-Allow-Headers': 'accept,x-requested-with,Content-Type,X-Custom-Header,file-name', 
                             'Access-Control-Max-Age': 1728000});
            response.end('ok');
            
        });
    }else if(path.extname(url) === '.css') {

        fs.readFile(`.${url}`, (err, data) => {
            if(err) {
                response.end(JSON.stringify(err));
            }else {
                response.writeHead(200, {'Content-Type':'text/css;charset=utf-8','Access-Control-Allow-Origin':'*', 
                'Access-Control-Allow-Headers': 'accept,x-requested-with,Content-Type,X-Custom-Header,file-name', 
                'Access-Control-Max-Age': 1728000});
                response.end(data);
            }
        });

    }else if(path.extname(url) === '.js') {

        fs.readFile(`.${url}`, (err, data) => {
            if(err) {
                response.end(JSON.stringify(err));
            }else {
                response.writeHead(200, {'Content-Type':'text/css;charset=utf-8','Access-Control-Allow-Origin':'*', 
                'Access-Control-Allow-Headers': 'accept,x-requested-with,Content-Type,X-Custom-Header,file-name', 
                'Access-Control-Max-Age': 1728000});
                response.end(data);
            }
        });

    }else {
        response.end('ok');
    }
    
    


    
});


server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');
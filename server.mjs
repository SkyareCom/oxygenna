// OXYGENNA — servidor estático para hospedar a pasta dist/.
// Não modifica o aplicativo, as rotas, a tipografia ou os recursos.
import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';

const root=resolve(process.cwd(),'dist');
const port=Number(process.env.PORT||8080);
const mime={
 '.html':'text/html; charset=utf-8',
 '.mjs':'text/javascript; charset=utf-8',
 '.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8',
 '.json':'application/json; charset=utf-8',
 '.svg':'image/svg+xml',
 '.png':'image/png',
 '.jpg':'image/jpeg',
 '.jpeg':'image/jpeg',
 '.gif':'image/gif',
 '.webp':'image/webp',
 '.avif':'image/avif',
 '.ico':'image/x-icon',
 '.ttf':'font/ttf',
 '.otf':'font/otf',
 '.woff':'font/woff',
 '.woff2':'font/woff2',
 '.mp3':'audio/mpeg',
 '.mp4':'video/mp4',
 '.pdf':'application/pdf',
 '.txt':'text/plain; charset=utf-8'
};
const route=/^\/(?:home|fisiologia|clinica|camara|operacao|capitulo\/[a-z0-9-]+)\/?$/;
const status=(res,code,message)=>{res.writeHead(code,{'Content-Type':'text/plain; charset=utf-8'});res.end(message);};
createServer(async(req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD')return status(res,405,'Method not allowed');
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return status(res,400,'Bad request');}
 if(pathname.includes('\0'))return status(res,400,'Bad request');
 const path=resolve(root,pathname.replace(/^\/+/, '')||'index.html');
 if(!path.startsWith(root+sep))return status(res,403,'Forbidden');
 let file=path,info;
 try{info=await stat(file);if(!info.isFile())throw new Error('Not a file');}
 catch{
  if(pathname!=='/'&&!route.test(pathname))return status(res,404,'Not found');
  file=resolve(root,'index.html');
  try{info=await stat(file);}catch{return status(res,500,'App not found');}
 }
 const ext=extname(file).toLowerCase();
 const type=mime[ext]||'application/octet-stream';
 res.writeHead(200,{
  'Content-Type':type,
  'Content-Length':info.size,
  'Cache-Control':ext==='.html'||ext==='.mjs'||ext==='.js'||ext==='.css'?'no-cache':'public, max-age=86400',
  'X-Content-Type-Options':'nosniff'
 });
 if(req.method==='HEAD')return res.end();
 const stream=createReadStream(file);
 stream.on('error',()=>res.destroy());
 stream.pipe(res);
}).listen(port,'0.0.0.0',()=>{
 console.log('OXYGENNA static server listening on port '+port);
});

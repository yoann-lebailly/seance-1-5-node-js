/*import fs from 'node:fs';
const content = fs.readFile('demo.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});
console.log('Hello World');
/*
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
const server = createServer((req, res) => {
  const fi = createReadStream('index.html');
  fi.pipe(res);
  fi.on('end', () => {
    res.end();
  });
});
server.listen('8888', 'localhost', () => {
  console.log('Server is running on port 8888');
});
*/
import { createServer } from 'node:http';
import { index, create, remove, update } from './functions/api/todos.js';
import { NotFoundError } from './functions/api/error.js';
import { createReadStream } from 'node:fs';
createServer(async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    const url = new URL(req.url, `http://${req.headers.host}`);
    const endpoint = `${req.method}:${url.pathname}`;
    let result;

    console.log(endpoint);
    switch (endpoint) {
      case 'GET:/':
        res.setHeader('Content-Type', 'text/html');
        const rs = createReadStream('index.html');
        rs.pipe(res);
        return;
      case 'GET:/todos':
        result = await index(req, res);
        break;
      case 'POST:/todos':
        result = await create(req, res);
        break;
      case 'DELETE:/todos':
        result = await remove(req, res, url);
        break;
      case 'PUT:/todos':
        result = await update(req, res, url);
        break;
      default:
        res.statusCode = 404;
        result = { error: 'Not Found' };
        break;
    }
    if (result) {
      res.write(JSON.stringify(result));
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.writeHead(404);
    } else {
      throw error;
    }
  }
  res.end();
}).listen(3000);
// test redémaeeage nodemon

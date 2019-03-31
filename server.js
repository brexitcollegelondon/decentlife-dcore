const http = require('http');
const fetch = require('node-fetch');
const dcorejs = require('dcorejs');
const requestHandlers = require('./requestHandlers');

const hostname = 'localhost';
const port = 3000;

let chainId = '';

function initialise() {
  dcorejs.initialize({ chainId, dcoreNetworkWSPaths: ['https://testnet-api.dcore.io'] }, false);
}

function handleRequest(method, url, data) {
  if (!url) {
    return new Promise((resolve) => {
      resolve({
        statusCode: 200, contentType: "text/plain", result: "all good"
      })
    });
  }
  const urlMatches = url.match(/\/(\w+)/);
  if (urlMatches.length > 1) {
    const urlRestMatches = url.match(/\/\w+(.*)/);
    return requestHandlers[method][urlMatches[1]](data, urlRestMatches.length > 1 ? urlRestMatches[1] : undefined);
  }
  return new Promise((resolve) => {
    resolve({
      statusCode: 200, contentType: "text/plain", result: "all good"
    })
  });
}

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;
  let body = "";
  req.on('readable', () => {
    const chunk = req.read();
    if (chunk) {
      body += chunk;
    }
  });
  req.on('end', () => {
    handleRequest(method, url, body)
      .then(({statusCode, contentType, result}) => {
        res.statusCode = statusCode;
        res.setHeader('Content-Type', contentType);
        res.end(result);
      })
      .catch(error => {
        console.error(error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(error);
      });
  });
});

fetch('https://testnet-api.dcore.io/rpc', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "get_chain_id"
  })
})
  .then(res => res.json())
  .then(({ result }) => {
    chainId = result;
    initialise();
    setInterval(initialise, 60000);
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
})
  .catch(err => console.error(err));

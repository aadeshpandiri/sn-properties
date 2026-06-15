const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, length: data.length, has200: res.statusCode === 200 });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function test() {
  const paths = ['/', '/properties', '/contact', '/about'];

  for (const path of paths) {
    try {
      const result = await makeRequest(path);
      console.log(`${path} => STATUS ${result.status} LEN ${result.length}`);
    } catch (err) {
      console.log(`${path} => ERROR ${err.message}`);
    }
  }
}

test().catch(console.error);

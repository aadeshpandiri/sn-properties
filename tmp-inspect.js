const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), '.next');
console.log('CWD', process.cwd());
console.log('dotnext exists', fs.existsSync(dir));
try {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  console.log('entries count', entries.length);
  entries.forEach((e) => {
    console.log('entry', e.name, e.isDirectory(), e.isFile(), e.isSymbolicLink(), e.mode?.toString(8));
  });
} catch (err) {
  console.error('readdir err', err.code, err.message);
}
const trace = path.join(dir, 'trace');
console.log('trace exists', fs.existsSync(trace));
try {
  const stat = fs.lstatSync(trace);
  console.log('trace stat', stat.isFile(), stat.isDirectory(), stat.isSymbolicLink(), stat.mode.toString(8));
} catch (err) {
  console.error('stat err', err.code, err.message);
}
try {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fd = fs.openSync(trace, 'w');
  fs.closeSync(fd);
  console.log('write trace ok');
} catch (err) {
  console.error('write trace err', err.code, err.message);
}
try {
  const stat = fs.statSync(trace);
  console.log('trace final stat', stat.isFile(), stat.size);
} catch (err) {
  console.error('final stat err', err.code, err.message);
}

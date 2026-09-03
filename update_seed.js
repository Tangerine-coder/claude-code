const fs = require('fs');
const path = 'src/lib/seed.ts';
fs.copyFileSync(path, path + '.bak');
let lines = fs.readFileSync(path, 'utf8').split('\n');
const names = ['铸铁珐琅锅 6QT', '不锈钢锅具套装', '智能咖啡机', '便携蓝牙音箱'];
let removed = 0;

for (const name of names) {
  // find the line containing name: '<name>' inside products array
  const idx = lines.findIndex(l => l.includes(`name: '${name}'`));
  if (idx === -1) { console.log('未找到:', name); continue; }
  // walk back to object start "    {"
  let start = idx;
  while (start > 0 && !/^\s*\{\s*$/.test(lines[start])) start--;
  // walk forward to object end "    },"
  let end = idx;
  while (end < lines.length && !/^\s*\},\s*$/.test(lines[end])) end++;
  // remove block including trailing blank/comment line if next is comment
  lines.splice(start, end - start + 1);
  removed++;
  console.log('已删除:', name);
}
fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('seed.ts 删除商品数:', removed);

const path = require('path');
const fs = require('fs');
const MT = require('mark-twain');

const basePath = path.resolve(__dirname, '..', '..', 'BizCharts', 'doc', 'api');
const files = fs.readdirSync(basePath);
const distPath = path.resolve(__dirname, '..', 'docs.json');
const result = [];

files.forEach((file) => {
  const filePath = path.resolve(basePath, file);
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const jsonml = MT(fileData);
  const { meta, content } = jsonml;
  result.push({
    filename: `api/${file}`,
    path: `api/${file.replace(/\.md$/, '')}`,
    ...meta,
    jsonml: content
  });
});
fs.writeFileSync(distPath, JSON.stringify(result, null, 2));

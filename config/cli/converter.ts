#!/usr/bin/env node

const YAML = require('js-yaml');
const { join } = require('path');
const fs = require('fs');

const basePath = join(__dirname, '../');
const filePath = join(basePath, 'openapi.yaml');
const jsonPath = join(basePath, 'converter.openapi.json');

fs.readFile(filePath, 'utf8', (err: Error, raw: any) => {
  if (err) {
    console.error(err);
    return;
  }

  const content = YAML.load(raw);
  if (content === null || content === undefined || content === '') {
    console.error('🚥 加载 openapi.yaml 失败，文件内容为空');
    return;
  }

  const prettyJsonContent = JSON.stringify(content, null, 2);

  console.log('💺 将 OpenAPI YAML 转换为 JSON');
  console.log('💺 加载到版本号为 ', content.openapi);
  console.log('✅ 转换成功');

  fs.writeFileSync(jsonPath, prettyJsonContent, 'utf8');
});

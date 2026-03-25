const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  const log = execSync('git log -3 --pretty=format:"%H|%h|%s|%an|%ai"', { encoding: 'utf-8' });
  const commits = log.trim().split('\n').map(line => {
    const [hash, shortHash, message, author, date] = line.split('|');
    return { hash, shortHash, message, author, date };
  });
  fs.writeFileSync(
    path.join(__dirname, '..', 'lib', 'version.json'),
    JSON.stringify({ commits, generatedAt: new Date().toISOString() }, null, 2)
  );
  console.log('version.json generated with', commits.length, 'commits');
} catch {
  fs.writeFileSync(
    path.join(__dirname, '..', 'lib', 'version.json'),
    JSON.stringify({ commits: [], generatedAt: new Date().toISOString() }, null, 2)
  );
  console.log('version.json generated (no git available)');
}

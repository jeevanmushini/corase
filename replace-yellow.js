const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.json')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
      .replace(/text-\[#FF9F43\]/g, 'text-white')
      .replace(/bg-\[#FF9F43\]/g, 'bg-white')
      .replace(/bg-\[#e88e30\]/g, 'bg-gray-200')
      .replace(/border-\[#FF9F43\]/g, 'border-white')
      .replace(/accent-\[#FF9F43\]/g, 'accent-white')
      .replace(/fill="#FF9F43"/g, 'fill="white"')
      .replace(/from-\[#FF9F43\]/g, 'from-white')
      .replace(/via-\[#FFB966\]/g, 'via-gray-300')
      .replace(/to-\[#FF9F43\]/g, 'to-white')
      .replace(/#FF9F43/g, '#ffffff'); // Catch any remaining raw hexes

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated', filePath);
    }
  }
});

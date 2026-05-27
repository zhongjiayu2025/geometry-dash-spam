const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes("import Breadcrumbs from './Breadcrumbs';")) {
    content = content.replace("import Breadcrumbs from './Breadcrumbs';", "");
    
    if (!content.includes('import dynamic from')) {
      content = content.replace(/import React.*?;\n/, match => match + "import dynamic from 'next/dynamic';\nconst Breadcrumbs = dynamic(() => import('./Breadcrumbs'));\n");
    } else {
      if (!content.includes('const Breadcrumbs = dynamic')) {
         content = content.replace(/import dynamic from 'next\/dynamic';\n/, match => match + "const Breadcrumbs = dynamic(() => import('./Breadcrumbs'));\n");
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log("Updated " + file);
  }
}

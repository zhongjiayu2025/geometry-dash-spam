const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes("import RelatedTools from './RelatedTools';")) {
    content = content.replace("import RelatedTools from './RelatedTools';", "");
    
    if (!content.includes('import dynamic from')) {
      content = content.replace(/import React.*?;\n/, match => match + "import dynamic from 'next/dynamic';\nconst RelatedTools = dynamic(() => import('./RelatedTools'));\n");
    } else {
      content = content.replace(/import dynamic from 'next\/dynamic';\n/, match => match + "const RelatedTools = dynamic(() => import('./RelatedTools'));\n");
    }
    
    fs.writeFileSync(filePath, content);
    console.log("Updated " + file);
  }
}

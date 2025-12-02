const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const designs = [
    { url: 'http://localhost:4321/design-blue', file: 'design-blue.png' },
    { url: 'http://localhost:4321/design-arch', file: 'design-arch.png' },
    { url: 'http://localhost:4321/design-maroon', file: 'design-maroon.png' },
    { url: 'http://localhost:4321/design-clean', file: 'design-clean.png' },
    { url: 'http://localhost:4321/design-classic', file: 'design-classic.png' }
  ];

  for (const design of designs) {
    console.log(`Capturing ${design.file}...`);
    const page = await browser.newPage();
    
    // Standardized size for comparison
    await page.setViewport({ 
      width: 1200, 
      height: 1600,
      deviceScaleFactor: 2
    });
    
    try {
      await page.goto(design.url, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Increased wait time for fonts/images
      
      await page.screenshot({ 
        path: design.file, 
        fullPage: true,
        type: 'png'
      });
      console.log(`✓ Saved ${design.file}`);
    } catch (e) {
      console.error(`✗ Failed to capture ${design.file}:`, e.message);
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log('All design screenshots captured.');
})();

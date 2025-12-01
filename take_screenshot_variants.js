const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const variants = [
    { url: 'http://localhost:4321/lite', file: 'gita-proposal-lite-classic.png' },
    { url: 'http://localhost:4321/lite-minimal', file: 'gita-proposal-lite-minimal.png' },
    { url: 'http://localhost:4321/lite-vibrant', file: 'gita-proposal-lite-vibrant.png' }
  ];

  for (const variant of variants) {
    console.log(`Capturing ${variant.file}...`);
    const page = await browser.newPage();
    
    // A3 size at high DPI (3x quality)
    await page.setViewport({ 
      width: 1684, 
      height: 2382,
      deviceScaleFactor: 3
    });
    
    try {
      await page.goto(variant.url, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Hide Astro dev menu
      await page.evaluate(() => {
        const overlays = document.querySelectorAll('astro-dev-overlay, [data-astro-dev-toolbar]');
        overlays.forEach(el => el.style.display = 'none');
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await page.screenshot({ 
        path: variant.file, 
        fullPage: true,
        type: 'png'
      });
      console.log(`✓ Saved ${variant.file}`);
    } catch (e) {
      console.error(`✗ Failed to capture ${variant.file}:`, e.message);
    }
    
    await page.close();
  }
  
  await browser.close();
  console.log('All screenshots captured.');
})();


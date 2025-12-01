const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // A3 size at high DPI (3x quality)
  // Target width is 842px (CSS width of body), so we match viewport to that
  // height should be flexible to capture full content
  await page.setViewport({ 
    width: 842, 
    height: 1200, // Initial height, will expand
    deviceScaleFactor: 3 // High Res for print quality
  });
  
  await page.goto('http://localhost:4321/lite', { 
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // Hide Astro dev menu
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('astro-dev-overlay, [data-astro-dev-toolbar]');
    overlays.forEach(el => el.style.display = 'none');
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the exact height of the body content to trim screenshot
  const bodyHeight = await page.evaluate(() => {
    return document.body.scrollHeight;
  });

  await page.screenshot({ 
    path: 'gita-proposal-lite-a3.png', 
    fullPage: true, // This captures everything
    type: 'png'
  });
  
  console.log(`✓ Saved gita-proposal-lite-a3.png (Height: ${bodyHeight}px)`);
  
  await browser.close();
})();

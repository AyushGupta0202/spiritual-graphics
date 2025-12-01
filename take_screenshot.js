const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // High quality viewport settings
  await page.setViewport({ 
    width: 1920, 
    height: 1080,
    deviceScaleFactor: 2 // Retina quality
  });
  
  await page.goto('http://localhost:4321', { 
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // Wait for all images and fonts to load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Hide Astro dev menu and any overlays
  await page.evaluate(() => {
    // Hide Astro dev overlay
    const astroOverlay = document.querySelector('astro-dev-overlay');
    if (astroOverlay) {
      astroOverlay.style.display = 'none';
    }
    
    // Hide any dev toolbars or menus
    const devMenus = document.querySelectorAll('[data-astro-dev-toolbar], [id*="astro"], [class*="astro-dev"]');
    devMenus.forEach(el => {
      if (el) el.style.display = 'none';
    });
    
    // Hide shadow DOM elements if any
    const shadowHosts = document.querySelectorAll('astro-dev-overlay');
    shadowHosts.forEach(host => {
      if (host.shadowRoot) {
        const shadowElements = host.shadowRoot.querySelectorAll('*');
        shadowElements.forEach(el => {
          if (el) el.style.display = 'none';
        });
      }
    });
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // High quality screenshot with full page (PNG doesn't support quality parameter)
  await page.screenshot({ 
    path: 'gita-proposal-full-page.png', 
    fullPage: true,
    type: 'png'
  });
  
  await browser.close();
  console.log('High quality screenshot saved as gita-proposal-full-page.png');
})();

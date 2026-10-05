const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({width: 1920, height: 1080});
        await page.goto('https://www.arevin.com/products/fumisure%C2%AE-4x', {waitUntil: 'networkidle2'});
        
        // Take screenshot
        await page.screenshot({path: 'screenshot.png', fullPage: true});
        
        // Extract basic styling
        const styling = await page.evaluate(() => {
            const bodyStyle = window.getComputedStyle(document.body);
            
            // Look for major heading styles
            const h1 = document.querySelector('h1') || document.querySelector('h2');
            const h1Style = h1 ? window.getComputedStyle(h1) : {};
            
            // Find primary button or link colors
            const links = Array.from(document.querySelectorAll('a'));
            const linkStyles = links.length > 0 ? window.getComputedStyle(links[0]) : {};

            return {
                bodyBackgroundColor: bodyStyle.backgroundColor,
                bodyColor: bodyStyle.color,
                bodyFontFamily: bodyStyle.fontFamily,
                headingFontFamily: h1Style.fontFamily || 'N/A',
                headingColor: h1Style.color || 'N/A',
                linkColor: linkStyles.color || 'N/A'
            };
        });
        
        fs.writeFileSync('styling.json', JSON.stringify(styling, null, 2));
        console.log('Successfully captured screenshot and styling.');
        await browser.close();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
})();

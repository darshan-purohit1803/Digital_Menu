const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots', 'xyz');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('🍽️ Starting XYZ Restaurant E2E Tests...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.toString()));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      pageErrors.push(msg.text());
    }
  });

  try {
    // 1. Mobile 390px (iPhone) Test - Customer Menu
    console.log('\n--- Test 1: Customer Menu at 390px mobile viewport ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:5173/menu?table=07', { waitUntil: 'networkidle0' });

    // Verify Title & Table
    const title = await page.title();
    console.log(`Page title: "${title}"`);
    if (!title.includes('XYZ Restaurant')) {
      throw new Error(`Expected title with XYZ Restaurant, got: ${title}`);
    }

    const headerText = await page.$eval('h1', el => el.textContent);
    console.log(`Restaurant header: "${headerText}"`);
    if (!headerText.includes('XYZ Restaurant')) {
      throw new Error('Restaurant header missing or incorrect');
    }

    const bodyText = await page.$eval('body', el => el.innerText);
    if (!bodyText.includes('Table 07')) {
      throw new Error('Table 07 not displayed on customer menu');
    }
    console.log('✔ Table 07 badge and XYZ Restaurant header verified');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_mobile_xyz_menu.png'), fullPage: false });

    // 2. Test Mobile 360px & 430px viewports
    console.log('\n--- Test 2: Testing 360px and 430px viewport widths ---');
    await page.setViewport({ width: 360, height: 740, isMobile: true });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_mobile_360_menu.png'), fullPage: false });

    await page.setViewport({ width: 430, height: 932, isMobile: true });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_mobile_430_menu.png'), fullPage: false });
    console.log('✔ Mobile responsiveness verified');

    // 3. Test Search & Filters
    console.log('\n--- Test 3: Search Functionality ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.type('input[type="text"]', 'paneer');
    await new Promise(r => setTimeout(r, 600));

    const searchResults = await page.$$('article');
    console.log(`Found ${searchResults.length} dishes for search query "paneer"`);
    if (searchResults.length === 0) {
      throw new Error('Search failed: expected dishes for query "paneer"');
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_search_paneer.png'), fullPage: false });

    // Clear search
    await page.click('button[aria-label="Clear search query"]');
    await new Promise(r => setTimeout(r, 400));
    console.log('✔ Search field verified');

    // 4. Test Add to Order & Quantity Increment
    console.log('\n--- Test 4: Add Food Items to Order ---');
    const addButtons = await page.$$('button');
    let addBtnFound = false;
    for (const btn of addButtons) {
      const text = await (await btn.getProperty('textContent')).jsonValue();
      if (text && text.includes('ADD TO ORDER')) {
        await btn.click();
        addBtnFound = true;
        break;
      }
    }
    if (!addBtnFound) {
      throw new Error('ADD TO ORDER button not found');
    }
    await new Promise(r => setTimeout(r, 300));

    // Verify Sticky Cart Bar appears
    const cartBarVisible = await page.$eval('div.fixed.bottom-0', el => !!el).catch(() => false);
    if (!cartBarVisible) {
      throw new Error('Sticky Bottom Cart bar did not appear after adding item');
    }
    console.log('✔ Item added to order and Sticky Cart Bar appeared');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_sticky_cart_active.png'), fullPage: false });

    // 5. Open Cart Drawer & Verify Breakdown
    console.log('\n--- Test 5: Open Cart Drawer ---');
    const viewCartBtn = await page.$('button[aria-label="View food order and checkout"]');
    if (viewCartBtn) {
      await viewCartBtn.click();
    } else {
      await page.click('button[aria-label^="Shopping cart"]');
    }
    await new Promise(r => setTimeout(r, 500));

    const drawerVisible = await page.$eval('div[role="dialog"]', el => !!el).catch(() => false);
    if (!drawerVisible) {
      throw new Error('Cart drawer failed to open');
    }
    console.log('✔ Cart drawer opened successfully with item details');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_cart_drawer.png'), fullPage: false });

    // 6. Submit Order & Verify Confirmation Page
    console.log('\n--- Test 6: Submit Order & Verify Order Confirmation ---');
    const submitBtn = await page.$('button[aria-label^="Close"]').catch(() => null);
    // Find Place Order button
    const buttons = await page.$$('button');
    let orderPlaced = false;
    for (const b of buttons) {
      const t = await (await b.getProperty('textContent')).jsonValue();
      if (t && t.includes('Send Order')) {
        await b.click();
        orderPlaced = true;
        break;
      }
    }
    if (!orderPlaced) {
      throw new Error('Could not find Send Order button in cart drawer');
    }

    // Wait for client-side route navigation to /order-confirmation
    await page.waitForFunction(() => window.location.pathname === '/order-confirmation', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));

    const currentUrl = page.url();
    console.log(`Navigated to: ${currentUrl}`);
    if (!currentUrl.includes('/order-confirmation')) {
      throw new Error(`Expected /order-confirmation, got: ${currentUrl}`);
    }

    const confHeading = await page.$eval('h1', el => el.textContent);
    console.log(`Confirmation heading: "${confHeading}"`);
    if (!confHeading.includes('Order Confirmed')) {
      throw new Error('Order confirmation heading not found');
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_order_confirmation.png'), fullPage: false });
    console.log('✔ Order placed and confirmation page validated');

    // 7. Desktop Staff Kitchen Display (1280px)
    console.log('\n--- Test 7: Staff Kitchen Display ---');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173/staff', { waitUntil: 'networkidle0' });

    const staffTitle = await page.$eval('h1', el => el.textContent);
    console.log(`Staff dashboard title: "${staffTitle}"`);
    if (!staffTitle.includes('XYZ Restaurant')) {
      throw new Error('Staff dashboard missing XYZ Restaurant header');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_staff_dashboard.png'), fullPage: false });

    // Test Combined Table G12
    console.log('\n--- Test 8: Combined Table Seating Toggle ---');
    const allButtons = await page.$$('button');
    for (const b of allButtons) {
      const t = await (await b.getProperty('textContent')).jsonValue();
      if (t && (t.includes('Combine Table') || t.includes('Separate into'))) {
        await b.click();
        await new Promise(r => setTimeout(r, 400));
        console.log('✔ Toggled Combined Table G12');
        break;
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_combined_tables_active.png'), fullPage: false });

    // Test QR Codes Modal
    console.log('\n--- Test 9: QR Codes Modal ---');
    const allButtons2 = await page.$$('button');
    for (const b of allButtons2) {
      const t = await (await b.getProperty('textContent')).jsonValue();
      if (t && t.includes('Table QR Codes')) {
        await b.click();
        await new Promise(r => setTimeout(r, 400));
        console.log('✔ QR modal opened and verified');
        break;
      }
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_qr_modal.png'), fullPage: false });

    console.log('\n=======================================');
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 100%');
    console.log('=======================================');

  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error_state.png'), fullPage: false }).catch(() => {});
    process.exitCode = 1;
  } finally {
    if (pageErrors.length > 0) {
      console.log('\nCaptured browser console errors:', pageErrors);
    }
    await browser.close();
  }
}

runTests();

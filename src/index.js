import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';

const browserURL = 'http://127.0.0.1:21222';

async function html2pdf(html) {
  const browser = await puppeteer.connect({browserURL});

  console.log(">>>>>> Opening page");
  const page = await browser.newPage();
  console.log(">>>>> Page setContent")
  await page.setContent(html, {
    // waitUntil: 'networkidle0'
  });

  console.log(">>>>>> Rendering PDF")
  const pdf = await page.pdf({
    format: 'A4'
  });
  console.log(">>>>> Closing page");
  await page.close();
  await browser.disconnect();
  console.log(">>>>> DONE");
  await writeFile('/tmp/sarlanga.pdf', pdf);
}

html2pdf(`<div>sarlanga</div>`);
import { puppeteer } from "./deps.ts";

async function html2pdf(browserURL = 'http://chrome:9222', html: string) {
  const browser = await puppeteer.connect({ browserURL });

  console.log(">>>>>> Opening page");
  const page = await browser.newPage();
  console.log(">>>>> Page setContent")
  await page.setContent(html, {
      waitUntil: 'networkidle0'
  });

  console.log(">>>>>> Rendering PDF")
  const pdf = await page.pdf({
    format: "a4"
  });
  console.log(">>>>> Closing page");
  await page.close();
  await browser.disconnect();
  console.log(">>>>> DONE");
    // await writeFile('/tmp/sarlanga.pdf', pdf);
  return pdf;
}

export { html2pdf };

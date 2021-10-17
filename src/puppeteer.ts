import { puppeteer } from "./deps.ts";

async function html2pdf(html: string, browserURL?: string) {
  if (!browserURL) {
    const host = await Deno.resolveDns(Deno.env.get('CHROME_HOSTNAME') as string, 'A');
    const port = Deno.env.get('CHROME_PORT');
    browserURL = `http://${host}:${port}`;
  }
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
  return pdf;
}

export { html2pdf };

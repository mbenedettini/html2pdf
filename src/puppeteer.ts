import { puppeteer } from "./deps.ts";
import Hosts from 'https://deno.land/x/deno_hosts@v1.0.1/mod.ts';


async function html2pdf(html: string, browserURL?: string) {
  let host = '';
  if (!browserURL) {
    let host = '';
    if (Deno.env.get('ECS')) {
      console.log(">>>>>>>>>>>>>>>>>>> ECS");
      const hostsPath = "/etc/hosts";  // Hosts file path
      const hosts = new Hosts(Deno.readTextFileSync(hostsPath));
      host = hosts.resolve(Deno.env.get('CHROME_HOSTNAME') as string) as string;
    } else {
      host = (await Deno.resolveDns(Deno.env.get('CHROME_HOSTNAME') as string, 'A'))[0];
    }
    console.log(host);
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

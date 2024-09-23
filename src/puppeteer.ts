import { puppeteer } from "./deps.ts";

async function html2pdf(html: string, browserURL?: string) {
  if (!browserURL) {
    let host = '';
    /*
      HACK because Chrome when using browserURL needs the Host header
      to be localhost or an ip address.
      Deno does not provide a way to do gethostbyname. In Compose, Docker uses
      DNS to inform the ip address of other containers. ECS uses /etc/hosts.
      Therefore this hack to obtain the ip address of the Chrome host.
      
      Getting /json/version to retrieve browserWSEndpoint:
      browserWSEndpoint can be used with either hostname or ip address, the 
      problem is obtaining it. Deno does not allow Host header to be
      provided in fetch(), and there aren't other reliable http client
      implementations.
    */
    host = (await Deno.resolveDns(Deno.env.get('CHROME_HOSTNAME') as string, 'A'))[0];
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
  // Deno.writeFileSync('/app/src/a.pdf', pdf);
  return pdf;
}

export { html2pdf };

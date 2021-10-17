import { oak } from "./deps.ts";
import { html2pdf } from "./puppeteer.ts";

const app = new oak.Application();
const router = new oak.Router();

router.get("/", ctx => {
  ctx.response.body = {
    message: "Hello world"
  };
});


router.post("/html2pdf", async ctx => {
  if (ctx.request.hasBody) {
    const formData: oak.BodyFormData = await ctx.request.body({ type: "form-data" }); // oak can also automatically identify the type
    const fdr: oak.FormDataReader = await formData.value;
    const actualResults: [string, string | oak.FormDataFile][] = [];
    for await (const result of fdr.stream({ maxSize: 400000 })) {
      actualResults.push(result);
    }
    const firstRawHTML = (actualResults[0][1]  as oak.FormDataFile).content as Uint8Array;
    const html = new TextDecoder().decode(firstRawHTML);
    const pdf = await html2pdf(html);
    ctx.response.body = pdf;
    ctx.response.type = 'application/pdf';
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);
await app.listen({ port: 8080 });

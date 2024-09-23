import { oak } from "./deps.ts";
import { html2pdf } from "./puppeteer.ts";

const app = new oak.Application();
const router = new oak.Router();

router.get("/", (ctx: oak.Context) => {
  ctx.response.body = {
    message: "Hello world"
  };
});


router.post("/html2pdf", async (ctx: oak.Context) => {
  if (!ctx.request.hasBody) {
    return;
  }
  const authorizationKey = Deno.env.get("AUTHORIZATION_KEY");
  if (Boolean(authorizationKey) && ctx.request.headers.get("Authorization") !== authorizationKey) {
    ctx.response.status = 401;
    return;
  }
  
  const formData = await ctx.request.body.formData();
  const htmlFile = formData.get("html") as File;
  const html = new TextDecoder().decode(await htmlFile.arrayBuffer());
  const pdf = await html2pdf(html);
  ctx.response.body = pdf;
  ctx.response.type = 'application/pdf';
});

router.post("/html2pdf:json", async (ctx: oak.Context) => {
  const body = ctx.request.body;

  if (body.type() !== "json") {
    return;
  }
  const value = await body.json();
  const html = value.value as string;
  const pdf = await html2pdf(html);
  ctx.response.body = pdf;
  ctx.response.type = 'application/pdf';
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);
await app.listen({ port: 8080 });

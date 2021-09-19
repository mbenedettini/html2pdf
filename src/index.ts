import { oak } from "./deps.ts";
import { html2pdf } from "./puppeteer.ts";

const app = new oak.Application();
const router = new oak.Router();

router.get("/", ctx => {
  ctx.response.body = {
    message: "Hello world"
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);
await app.listen({ port: 8080 });

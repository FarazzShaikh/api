import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const { args } = Deno;
const DEFAULT_PORT = 8000;
const argPort = parse(args).port;

const app = new Application();
app.use(oakCors());

const port = argPort ? Number(argPort) : DEFAULT_PORT;
console.log(port);

app
  .get("/", () => {
    return "HEllo World";
  })
  .get("/github", async (r) => {
    const res = await (await fetch("https://github.com/FarazzShaikh")).text();

    console.log(r.response);
    return res;
  })
  .start({ port: port });

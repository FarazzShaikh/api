import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

const { args } = Deno;
const DEFAULT_PORT = 8000;
const argPort = parse(args).port;

const app = new Application();

const port = argPort ? Number(argPort) : DEFAULT_PORT;
console.log(port);

app
  .get("/", () => {
    return "HEllo World";
  })
  .get("/github", async () => {
    return await (await fetch("https://github.com/FarazzShaikh")).text();
  })
  .start({ port: port });

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

try {
  const { args } = Deno;
  const DEFAULT_PORT = 8000;
  const argPort = parse(args).port;

  const port = argPort ? Number(argPort) : DEFAULT_PORT;
  console.log(port);

  const app = new Application();
  app.use(oakCors());

  const router = new Router();

  router.get("/", ({ response }: { response: any }) => {
    response.body = {
      message: "hello world",
    };
  });

  router.get("/github", async ({ response }: { response: any }) => {
    response.body = await (await fetch("https://github.com/FarazzShaikh")).text();
  });

  router.get("/.well-known/acme-challenge/dpUU_0Sj4LFfsyfhAGinTxx9u7AdOnCHHV99U2aOcXA", async ({ response }: { response: any }) => {
    const __dirname = new URL(".", import.meta.url).pathname;
    const p = path.resolve(__dirname, "./acme-challenge/data.txt");
    response.body = await Deno.readTextFile(p);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log("running on port ", port);
  await app.listen({ port });
} catch (error) {
  console.error(error);
}

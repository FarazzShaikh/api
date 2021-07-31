import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import { Index } from "./routes/index.ts";
import { Data } from "./routes/data.ts";
import { Proxy } from "./routes/proxy.ts";
// import { Subscribe } from "./routes/subscribe.ts";

import { RateLimit } from "./middleware/RateLimit.ts";

try {
  const { args } = Deno;
  const DEFAULT_PORT = 8000;
  const argPort = parse(args).port;
  const port = argPort ? Number(argPort) : DEFAULT_PORT;

  const router = new Router();
  const app = new Application();

  router.get("/", Index);
  router.get("/:route", Data);
  router.get("/ghproxy/:route", Proxy);
  // TODO: Enable after SSL
  // router.get("/subscribe", Subscribe);

  app.use(RateLimit);
  app.use(oakCors());
  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log("Running on port ", port);
  await app.listen({ port });
} catch (error) {
  console.error(error);
}

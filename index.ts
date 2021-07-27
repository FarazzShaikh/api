import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

try {
  const { args } = Deno;
  const DEFAULT_PORT = 8000;
  const argPort = parse(args).port;

  const port = argPort ? Number(argPort) : DEFAULT_PORT;
  console.log(port);

  const app = new Application();
  app.use(oakCors());

  const router = new Router();
  const LIST_ID = Deno.env.get("LIST_ID");
  const KEY = Deno.env.get("KEY");

  router.get("/", ({ response }: { response: any }) => {
    response.body = {
      message: "hello world",
    };
  });

  router.get("/subscribe", async ({ request, response }) => {
    const body = request.body({ type: "form-data" });
    const data = (await body.value.read()).fields;

    const { email, name } = data;

    try {
      const res = await fetch(`https://us6.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
        body: JSON.stringify({
          email_address: email,
          status: "pending",
          merge_fields: {
            FNAME: name,
          },
        }),
        headers: {
          Authorization: `anystring ${KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      response.body = res.body;
      response.status = res.status;
      response.headers = res.headers;
    } catch (error) {
      console.error(error);
      response.status = 500;
    }
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log("running on port ", port);
  await app.listen({ port });
} catch (error) {
  console.error(error);
}

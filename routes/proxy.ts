import { Context } from "../Types.ts";
import "https://deno.land/x/dotenv/load.ts";

export async function Proxy({ params, response }: Context) {
  let { route } = params;

  if (route) {
    route = atob(route);

    const KEY = Deno.env.get("GITHUB_KEY");
    const url = "https://api.github.com/" + route;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `token ${KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      });

      response.body = res.body;
      response.status = res.status;
      response.headers = res.headers;
    } catch (error) {
      console.error(error);
      response.status = 500;
      response.body = error.message;
    }
  } else {
    response.status = 404;
    response.body = "Invalid route";
  }
}

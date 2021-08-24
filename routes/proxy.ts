import { Context } from "../Types.ts";
import "https://deno.land/x/dotenv/load.ts";

function urlDecode($s: string) {
  return atob($s.replace("-", "+").replace("_", "/"));
}

export async function Proxy({ params, response }: Context) {
  let { route } = params;
  console.log(params);

  if (route) {
    if (route.includes("-") || route.includes("_")) {
      route = urlDecode(route);
    } else {
      route = atob(route);
    }

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
      for (const pair of res.headers.entries()) {
        response.headers.append(pair[0], pair[1]);
      }
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

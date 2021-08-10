import { Context } from "../Types.ts";
import "https://deno.land/x/dotenv/load.ts";

export async function Cors({ params, response }: Context) {
  let { route } = params;

  if (route) {
    const url = atob(route);

    try {
      const res = await fetch(url, {
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

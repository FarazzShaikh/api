import { Context } from "../Types.ts";

const validRoutes = ["apps", "libraries", "experiments"];

function isValidRoute(route: string) {
  return validRoutes.includes(route);
}

export async function Data({ params, response }: Context) {
  try {
    const { route } = params;

    if (!isValidRoute(route!)) throw new Error(`Invalid Route: /${route}`);

    response.body = await Deno.readFile(`./data/${route}.json`);
    response.headers.set("content-type", "application/json");
    response.status = 200;
  } catch (error) {
    console.error(error);
    response.body = "Internal Server Error: " + error.message;
    response.headers.set("content-type", "text/plain");
    response.status = 500;
  }
}

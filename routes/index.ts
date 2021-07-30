import { Context } from "../Types.ts";

export function Index({ response }: Context) {
  response.body = "Hello World";
}

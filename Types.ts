import { RouterContext, RouteParams } from "https://deno.land/x/oak/mod.ts";

export type Context = RouterContext<RouteParams, Record<string, any>>;

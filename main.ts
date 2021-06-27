import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";

const app = new Application();

console.log("http://localhost:8080/");

app
  .get("/github", async () => {
    return await (await fetch("https://github.com/FarazzShaikh")).text();
  })
  .start({ port: 3000 });

import { Context } from "../Types.ts";
import "https://deno.land/x/dotenv/load.ts";

export async function Subscribe({ request, response }: Context) {
  const body = request.body({ type: "form-data" });
  const data = (await body.value.read()).fields;

  const LIST_ID = Deno.env.get("LIST_ID");
  const KEY = Deno.env.get("KEY");

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

    for (const pair of res.headers.entries()) {
      response.headers.append(pair[0], pair[1]);
    }
  } catch (error) {
    console.error(error);
    response.status = 500;
  }
}

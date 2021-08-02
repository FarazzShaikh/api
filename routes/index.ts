import { Context } from "../Types.ts";

import { renderMarkdown, Node, Options } from "https://deno.land/x/charmd/mod.ts";
import { colors } from "https://deno.land/x/charmd/deps.ts";

function getHeaderFormatter(head: number) {
  const headingFormats = [
    (value: string) => value, //
    (value: string) => colors.bold(colors.red(colors.underline(value))),
    (value: string) => colors.italic(colors.gray(value)),
    (value: string) => colors.green(value),
  ];

  if (head > headingFormats.length - 1) {
    head = 0;
  }

  return headingFormats[head];
}

const HeaderExt = {
  generateNode(genFn: any, node: Node, parent: Node, options: Options) {
    if (node.type === "heading") {
      const txt = node.children?.map((ch) => genFn(ch, node, options)).join("") || "";
      return getHeaderFormatter(node.depth || 0)(txt);
    }
  },
};

const LinkExt = {
  generateNode(genFn: any, node: Node, parent: Node, options: Options) {
    if (node.type === "link") {
      const linkText = node.children?.map((ch) => genFn(ch, node, options)).join("") || "";
      const link = `${colors.blue(linkText)} → ${colors.cyan(colors.underline(node.url!))}`;
      return colors.green(link);
    }
  },
};

export async function Index({ request, response }: Context) {
  try {
    const agent = request.headers.get("user-agent");
    if (agent?.includes("curl")) {
      response.status = 200;
      response.body = renderMarkdown(await Deno.readTextFile(`./data/About.md`), {
        extensions: [HeaderExt, LinkExt],
      });
    } else {
      response.status = 301;
      response.redirect("https://farazshaikh.com");
    }
  } catch (error) {
    console.error(error);
  }
}

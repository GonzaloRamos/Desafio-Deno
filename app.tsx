// @deno-types="https://deno.land/x/servest@v1.3.4/types/react/index.d.ts"
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://deno.land/x/servest@v1.3.4/types/react-dom/server/index.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import {createApp, contentTypeFilter} from "https://deno.land/x/servest@v1.3.4/mod.ts";

const app = createApp();
const colors: string[] = [];

app.handle("/", async (req) => {
  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/html; charset=UTF-8",
    }),
    body: ReactDOMServer.renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>servest</title>
        </head>
        <body style={{background: "black"}}>
          <form action="/saveColor" method="post">
            <input name="color" placeholder="Ingresar color" />
            <button type="submit">Enviar color</button>
          </form>

          <div style={{backgroundColor: "black"}}>
            <h2 style={{color: "white"}}>Colores ingresados</h2>
            <ul>
              {colors.map((color) => {
                return (
                  <li style={{color: color, fontWeight: "bold"}} key={color}>
                    {color}
                  </li>
                );
              })}
            </ul>
          </div>
        </body>
      </html>
    ),
  });
});

app.post(
  "/saveColor",
  contentTypeFilter("application/x-www-form-urlencoded"),
  async (req) => {
    const bodyForm = await req.formData();
    const userColor = await bodyForm.value("color")!;
    colors.push(userColor.toLocaleLowerCase());
    req.redirect("/");
  }
);
app.listen({port: 8888});

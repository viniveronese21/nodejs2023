import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

// Query parameters: URL Stateful => filtros, paginação, não obrigatorios
// Routes parameters: Identificação de recurso
// Request body: Envio de informações de um formulário (HTTPs)

// http://loclahost:333/users?userId=1&name=Diego

// GET http://localhost:333/users/1
// DELETE http://localhost:333/users/1

// Edição e remoção

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);

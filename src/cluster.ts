import dotenv from "dotenv";
import http from "node:http";
import os from "node:os";
import cluster from "node:cluster";

import { userRouter } from "./routes/user.routes";

dotenv.config();

const hostname: string = "localhost";

const PORT: number = Number(process.env.PORT) || 4000;
const DB_PORT: number = Number(process.env.DB_SERVICE_PORT) || 5000;

if (cluster.isPrimary) {
  const dbServer = http.createServer(userRouter);

  dbServer.listen(DB_PORT, () => {
    console.log(`Database listening on port: ${DB_PORT}`);
  });

  const cpus = os.cpus().length;
  for (let i = 0; i < cpus - 1; i += 1) {
    cluster.fork({ WORKER_PORT: PORT + i + 1 });
  }

  let currentWorker = 0;

  const proxyServer = http.createServer((req, res) => {
    const WORKER_PORT = PORT + ((currentWorker % (cpus - 1)) + 1);
    currentWorker += 1;

    const options = {
      hostname: hostname,
      port: WORKER_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (resFromWorker) => {
      res.writeHead(resFromWorker.statusCode || 500, resFromWorker.headers);
      resFromWorker.pipe(res);
    });

    req.pipe(proxy);

    proxy.on("error", (err) => {
      console.error("Proxy error:", err);
      res.writeHead(500);
      res.end("Internal Server Error");
    });

    console.log(
      `${req.method} ${req.url} forwarded to worker on port: ${WORKER_PORT}`
    );
  });

  proxyServer.listen(PORT, () => {
    console.log(`Load balancer listening on port: ${PORT}`);
  });
} else {
  if (process.env.WORKER_PORT) {
    const PORT = Number(process.env.WORKER_PORT);

    const server = http.createServer((req, res) => {
      const options = {
        hostname: hostname,
        port: DB_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxy = http.request(options, (resFromWorker) => {
        res.writeHead(resFromWorker.statusCode || 500, resFromWorker.headers);
        resFromWorker.pipe(res);
      });

      req.pipe(proxy);

      proxy.on("error", (err) => {
        console.error("Proxy error:", err);
        res.writeHead(500);
        res.end("Internal Server Error");
      });
    });

    server.listen(PORT, hostname, () => {
      console.log(`Worker listening on port: ${PORT}`);
    });
  }
}

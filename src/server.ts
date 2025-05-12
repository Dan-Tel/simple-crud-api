import dotenv from "dotenv";
import http from "node:http";

import { userRouter } from "./routes/user.routes";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

const server = http.createServer(userRouter);

server.listen(PORT, async () => {
  console.log(`server listening on port: ${PORT}`);
});

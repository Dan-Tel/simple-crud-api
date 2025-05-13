import { ServerResponse } from "node:http";

export const response = (
  res: ServerResponse,
  { status = 200, data = {}, contentType = "application/json" }
) => {
  res.writeHead(status, { "Content-Type": contentType });
  res.write(JSON.stringify(data));
  res.end();
};

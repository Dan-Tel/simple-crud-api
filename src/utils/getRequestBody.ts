import { IncomingMessage } from "node:http";

export const getRequestBody = async <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        console.log(typeof body);
        body = body ? JSON.parse(JSON.stringify(body)) : {};

        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
};

import { v4 as uuidv4 } from "uuid";

/**
 * Returns deeplink contents
 * @param chain
 * @param opType
 * @param operations
 * @param app
 * @returns generated deeplink
 */
async function generateDeepLink(chain: string, operations: object[]) {
  return new Promise(async (resolve, reject) => {
    if (!chain || !["EOS", "BEOS", "TLOS"].includes(chain)) {
      return reject(`invalid chain: ${chain}`);
    }

    if (!operations || !Array.isArray(operations) || !operations.length) {
      return reject(`invalid operations: ${operations ? JSON.stringify(operations) : "[]"}`);
    }

    let id;
    try {
      id = await uuidv4();
    } catch (error) {
      console.log({ error, location: "uuid generation failed" });
      reject(error);
      return;
    }

    const request = {
      type: "api",
      id: id,
      payload: {
        method: "injectedCall",
        params: ["signAndBroadcast", JSON.stringify({ actions: operations }), []],
        appName: "EOS Astro tool",
        chain,
        browser: "web browser",
        origin: "localhost",
      },
    };

    let encodedPayload;
    try {
      encodedPayload = encodeURIComponent(JSON.stringify(request));
    } catch (error) {
      console.log({ error, location: "encode payload failed" });
      reject(error);
      return;
    }

    resolve(encodedPayload);
  });
}

export { generateDeepLink };

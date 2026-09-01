import { setSession, verifyPassword } from "../../lib/cms/auth.js";
import { HttpError, json, methodNotAllowed, noStore, readJson, sendError } from "../../lib/cms/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  noStore(res);

  try {
    const body = await readJson(req);
    if (!verifyPassword(body.password)) {
      return json(res, 401, { error: "Invalid password" });
    }
    const session = setSession(res);
    return json(res, 200, {
      authenticated: true,
      expiresAt: session.exp,
      token: "techy-bd-admin-local-token",
      user: { name: "MD Omar Faruk", email: "admin@techybd.com" },
    });
  } catch (error) {
    if (error instanceof HttpError) return sendError(res, error);
    return sendError(res, error);
  }
}

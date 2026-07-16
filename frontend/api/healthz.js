import { applyCors, requireMethod } from "./_cors.js";

export default function handler(req, res) {
  if (applyCors(req, res)) return;
  if (requireMethod(req, res, "GET")) return;

  res.status(200).json({ ok: true });
}

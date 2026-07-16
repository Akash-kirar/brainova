import crypto from "node:crypto";
import { applyCors, requireMethod } from "../_cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (requireMethod(req, res, "POST")) return;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: "Razorpay is not configured on this deployment" });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    const digest = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction not legit!" });
    }

    res.status(200).json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not verify payment" });
  }
}

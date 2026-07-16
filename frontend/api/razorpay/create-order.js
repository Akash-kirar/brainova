import Razorpay from "razorpay";
import { applyCors, requireMethod } from "../_cors.js";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (requireMethod(req, res, "POST")) return;

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: "Razorpay is not configured on this deployment" });
  }

  try {
    const { amount, currency = "INR", receipt = "receipt_1" } = req.body || {};
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100),
      currency,
      receipt,
    });

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create order" });
  }
}

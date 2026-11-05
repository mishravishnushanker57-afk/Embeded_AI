import Razorpay from "../Configs/razorpay.js";
import Billing from "../Models/billing.model.js";
import crypto from "crypto";
import User from "../Models/user.model.js";

export const createOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.userId;

        if (plan !== "pro") {
            return res.status(400).json({
                success: false,
                message: "Invalid plan"
            });
        }

        const amount = 599;

        const order = await Razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        });

        await Billing.create({
            userId,
            amount,
            plan,
            orderId: order.id,
            status: "created"
        });

        return res.status(201).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("createOrder error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create payment order"
        });
    }
};


export const verifyBilling = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const userId = req.userId;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details"
            });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Payment configuration error"
            });
        }

        // Find the order belonging to this user
        const billing = await Billing.findOne({
            orderId: razorpay_order_id,
            userId
        });

        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing order not found"
            });
        }

        if (billing.status === "paid") {
            return res.status(409).json({
                success: false,
                message: "This order has already been processed"
            });
        }

        if (billing.plan !== "pro" || billing.amount !== 599) {
            return res.status(400).json({
                success: false,
                message: "Invalid billing details"
            });
        }

        // Verify Razorpay signature using timing-safe comparison
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(razorpay_signature, "hex");

        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Confirm payment with Razorpay, not just the signature
        const payment = await Razorpay.payments.fetch(razorpay_payment_id);

        if (
            payment.order_id !== razorpay_order_id ||
            payment.status !== "captured" ||
            payment.amount !== billing.amount * 100 ||
            payment.currency !== "INR"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment is not captured or details do not match"
            });
        }

        // Mark billing as paid
        billing.paymentId = razorpay_payment_id;
        billing.status = "paid";
        await billing.save();

        // Activate Pro for 90 days
        const proExpiresAt = new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
        );

        const user = await User.findByIdAndUpdate(
            userId,
            {
                plan: "pro",
                proExpiresAt
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            user
        });

    } catch (error) {
        console.error("verifyBilling error:", error);

        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};
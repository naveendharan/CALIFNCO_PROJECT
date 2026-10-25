/**
 * Razorpay Test Mode Configuration
 * Zero KYC / Documentation required. Uses standard rzp_test_ keys.
 */

export const RAZORPAY_CONFIG = {
  key_id: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag", // Standard Razorpay Test Key
  currency: "INR",
  company_name: "Califnco Water Technologies Pvt Ltd",
  company_description: "Pure Water Purification & Spares Solutions",
  company_logo: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=200&q=80",
  theme_color: "#0284c7" // Deep Ocean Cyan
};

export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  amount: number;
  method: 'upi' | 'card' | 'netbanking';
}

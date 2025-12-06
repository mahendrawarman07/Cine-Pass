import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../calls/bookingCalls";
import { Card, Typography, Button, Spin, message, Space } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    console.log("🎬 PaymentSuccess page loaded!");
    console.log("📍 Current URL:", window.location.href);
    console.log("🔍 All search params:", Object.fromEntries(searchParams));
    
    const verifyPaymentStatus = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        console.log("💳 Session ID from URL:", sessionId);
        
        if (!sessionId) {
          console.error("❌ No session_id found in URL");
          message.error("Invalid payment session. Redirecting to home...");
          setTimeout(() => navigate("/login"), 3000);
          setPaymentStatus("error");
          setLoading(false);
          return;
        }

        console.log("🚀 Calling verifyPayment API with sessionId:", sessionId);
        
        const response = await verifyPayment(sessionId);
        
        console.log("📥 Full Response from verifyPayment:", response);
        console.log("✓ Response success:", response.success);
        console.log("✓ Response message:", response.message);
        console.log("✓ Response data:", response.data);
        
        if (response.success && response.data) {
          console.log("✅ Payment verified successfully!");
          console.log("📦 Booking data:", response.data);
          setBooking(response.data);
          setPaymentStatus("success");
          message.success("Payment successful! Booking confirmed.");
        } else {
          console.error("❌ Payment verification failed");
          console.error("Message:", response.message);
          setPaymentStatus("failed");
          message.error(response.message || "Payment verification failed.");
        }
        setLoading(false);
      } catch (error) {
        console.error("💥 Error in verifyPaymentStatus:");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error:", error);
        
        message.error("Unable to verify payment. Please check your bookings.");
        setPaymentStatus("error");
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [searchParams, navigate]);

  console.log("🎨 Current render state - Status:", paymentStatus, "Loading:", loading);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        padding: 50 
      }}>
        <Spin size="large" />
        <div style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18 }}>Verifying your payment...</Text>
          <br />
          <Text type="secondary">Please wait, this may take a few seconds.</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: 50,
      backgroundColor: '#f0f2f5'
    }}>
      <Card style={{ maxWidth: 600, width: '100%' }}>
        {paymentStatus === "success" && booking && (
          <div style={{ textAlign: "center" }}>
            <CheckCircleOutlined
              style={{ fontSize: 64, color: "#52c41a", marginBottom: 20 }}
            />
            <Title level={2} style={{ color: "#52c41a", marginBottom: 10 }}>
              Payment Successful!
            </Title>
            <Text style={{ fontSize: 16, display: "block", marginBottom: 30 }}>
              Your booking has been confirmed.
            </Text>
            
            <div style={{ 
              textAlign: "left", 
              marginBottom: 30, 
              padding: 20, 
              backgroundColor: "#f5f5f5", 
              borderRadius: 8 
            }}>
              <div style={{ marginBottom: 10 }}>
                <Text strong>Booking ID: </Text>
                <Text>{booking._id}</Text>
              </div>
              <div style={{ marginBottom: 10 }}>
                <Text strong>Seats: </Text>
                <Text>{booking.seats.sort((a, b) => a - b).join(", ")}</Text>
              </div>
              <div style={{ marginBottom: 10 }}>
                <Text strong>Total Amount: </Text>
                <Text>₹{booking.totalAmount}</Text>
              </div>
              <div>
                <Text strong>Status: </Text>
                <Text style={{ color: '#52c41a' }}>CONFIRMED</Text>
              </div>
            </div>
            
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                onClick={() => navigate("/my-bookings")}
              >
                View My Bookings
              </Button>
              <Button 
                size="large" 
                onClick={() => navigate("/home")}
              >
                Book More Tickets
              </Button>
            </Space>
          </div>
        )}

        {(paymentStatus === "failed" || paymentStatus === "error") && (
          <div style={{ textAlign: "center" }}>
            <CloseCircleOutlined
              style={{ fontSize: 64, color: "#ff4d4f", marginBottom: 20 }}
            />
            <Title level={2} style={{ color: "#ff4d4f", marginBottom: 10 }}>
              {paymentStatus === "failed" ? "Payment Failed" : "Verification Error"}
            </Title>
            <Text style={{ fontSize: 16, display: "block", marginBottom: 30 }}>
              {paymentStatus === "failed" 
                ? "Your payment could not be verified. Please check your bookings or contact support."
                : "We couldn't verify your payment. Please check your email for confirmation or contact support."}
            </Text>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                onClick={() => navigate("/my-bookings")}
              >
                Check My Bookings
              </Button>
              <Button 
                size="large" 
                onClick={() => navigate("/home")}
              >
                Go to Home
              </Button>
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
}

export default PaymentSuccess;

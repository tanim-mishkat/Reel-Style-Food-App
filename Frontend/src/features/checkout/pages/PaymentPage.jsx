import React from "react";
import { useCart } from "../../../shared/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/components/ui/Button/Button";

const PaymentPage = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const handleSuccess = async () => {
    try {
      // Simulate order creation
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty
        })),
        total: subtotal,
        timestamp: new Date().toISOString()
      };
      
      console.log("Order created:", orderData);
      clear();
      alert("Payment successful! Order placed.");
      navigate("/");
    } catch (error) {
      alert("Failed to create order");
    }
  };

  const handleFail = () => {
    alert("Payment failed! Please try again.");
    navigate("/checkout");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem", textAlign: "center" }}>
      <h1>Payment</h1>
      
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Total Amount</h3>
        <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#16a34a" }}>
          ${subtotal.toFixed(2)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Button 
          onClick={handleSuccess}
          style={{ backgroundColor: "#16a34a", padding: "1rem" }}
        >
          Simulate Success
        </Button>
        
        <Button 
          onClick={handleFail}
          style={{ backgroundColor: "#dc2626", padding: "1rem" }}
        >
          Simulate Fail
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
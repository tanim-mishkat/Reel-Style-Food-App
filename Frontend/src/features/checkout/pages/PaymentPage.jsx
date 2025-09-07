import React from "react";
import { useCart } from "../../../shared/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../../shared/services/api";
import Button from "../../../shared/components/ui/Button/Button";

const PaymentPage = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const handleSuccess = async () => {
    try {
      const orderData = {
        restaurantId: items[0]?.partnerId,
        items: items.map(item => ({
          foodId: item.id,
          name: item.name,
          qty: item.qty,
          unitPrice: item.price
        })),
        fulfillment: {
          type: 'delivery',
          address: 'Sample address'
        }
      };
      
      const response = await orderService.createOrder(orderData);
      const orderId = response.data.order._id;
      clear();
      alert("Payment successful! Order placed.");
      navigate(`/orders/${orderId}`);
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
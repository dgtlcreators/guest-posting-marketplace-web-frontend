import React, { useState } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, price } = location.state; // Assume price is in dollars
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    try {
      const {data }= await axios.post(
        "http://localhost:5000/create-payment-intent",
        { price: price * 100 } // Convert price to cents
      );

      const {clientSecret }=data
      console.log(data,clientSecret,data.clientSecret )
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          setSuccess(true);
          console.log(userId)
         // const res=await axios.post(`http://localhost:5000/user/${userId}/buyed`);
         // console.log(res)
          setTimeout(() => navigate("/form"), 2000);
        }
      }
    } catch (error) {
      console.log(error);
      setError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-form">
      <h2 className="text-center mb-4">Complete your purchase</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="card-number" className="block mb-2">Card Number</label>
          <CardNumberElement id="card-number" className="p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="card-expiry" className="block mb-2">Expiry Date</label>
          <CardExpiryElement id="card-expiry" className="p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="card-cvc" className="block mb-2">CVC</label>
          <CardCvcElement id="card-cvc" className="p-2 border rounded" />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          disabled={!stripe || processing}
        >
          {processing ? "Processing..." : `Pay $${price}`}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Payment Successful!</div>}
    </div>
  );
};

export default CheckoutForm;

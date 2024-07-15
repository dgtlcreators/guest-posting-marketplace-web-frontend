import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStripe, useElements, CardElement, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import './CheckoutForm.css'; // Import the CSS file

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axios.post('http://localhost:5000/create-payment-intent', { amount: 5000 }).then(response => {
      setClientSecret(response.data.clientSecret);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: 'John Doe', // Replace with actual user details
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
      setPaymentError(result.error.message);
      setLoading(false);
    } else {
      console.log('Payment successful:', result.paymentIntent);
      setPaymentComplete(true);
      setLoading(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    classes: {
      base: 'card-element-input',
      complete: 'card-element-complete',
      empty: 'card-element-empty',
      focus: 'card-element-focus',
      invalid: 'card-element-invalid',
      webkitAutofill: 'card-element-autofill',
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <CardNumberElement id="cardNumber" options={CARD_ELEMENT_OPTIONS} />
      </div>
      <div className="form-group">
        <label htmlFor="cardExpiry">Expiry Date</label>
        <CardExpiryElement id="cardExpiry" options={CARD_ELEMENT_OPTIONS} />
      </div>
      <div className="form-group">
        <label htmlFor="cardCvc">CVC</label>
        <CardCvcElement id="cardCvc" options={CARD_ELEMENT_OPTIONS} />
      </div>

      {paymentError && <div className="error">{paymentError}</div>}
      {paymentComplete && <div className="success">Payment successful!</div>}

      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay $50.00'}
      </button>
    </form>
  );
};

export default CheckoutForm;

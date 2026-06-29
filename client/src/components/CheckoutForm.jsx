import { useState } from 'react';
import axios from 'axios';
import { CreditCard, Lock } from 'lucide-react';

const CheckoutForm = ({ amount, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call our mock payment processing route
      const response = await axios.post('/api/payment/process', {
        amount,
        paymentMethodId: 'mock_pm_' + Math.random().toString(36).substr(2, 9)
      });

      if (response.data.success) {
        onPaymentSuccess(response.data.transactionId);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="mb-6 flex justify-between items-center pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Payment Details
        </h3>
        <span className="text-2xl font-extrabold text-primary">₹{amount}</span>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Cardholder Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            required
            placeholder="4111 1111 1111 1111"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength="19"
            className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">Expiry Date</label>
            <input
              type="text"
              name="expiry"
              required
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleChange}
              maxLength="5"
              className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">CVC</label>
            <input
              type="text"
              name="cvc"
              required
              placeholder="123"
              value={formData.cvc}
              onChange={handleChange}
              maxLength="4"
              className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Pay ₹{amount} Securely
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;

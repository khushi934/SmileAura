// Mock Payment Controller
exports.processPayment = async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this is where you'd call Stripe/Razorpay API
    // const paymentIntent = await stripe.paymentIntents.create({...})
    
    // For mock, we just generate a fake transaction ID and succeed
    const transactionId = 'txn_' + Math.random().toString(36).substr(2, 9);
    
    res.status(200).json({
      success: true,
      transactionId,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Payment failed' });
  }
};

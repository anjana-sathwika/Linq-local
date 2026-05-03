import Razorpay from 'razorpay';

interface RazorpayOptions {
  amount: number; // in paise
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function initializeRazorpay(options: RazorpayOptions): Promise<{ orderId: string; razorpay: any }> {
  // Create order on your server (for now, we'll create it client-side)
  // In production, you should create this on your backend
  
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes,
    }),
  });

  const order = await response.json();

  const razorpay = new (window as any).Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1yourkeyhere',
    amount: order.amount,
    currency: order.currency,
    name: 'LinQ',
    description: 'Unlock profile connections',
    order_id: order.id,
    handler: function (response: any) {
      // Handle successful payment
      console.log('Payment successful:', response);
      
      // You should verify this payment on your backend
      return {
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
      };
    },
    prefill: {
      name: '',
      email: '',
      contact: '',
    },
    theme: {
      color: '#2F5EEA',
    },
    modal: {
      ondismiss: function() {
        console.log('Payment modal dismissed');
      },
    },
  });

  return { orderId: order.id, razorpay };
}

// Client-side order creation (for development)
export async function createOrderClientSide(options: RazorpayOptions) {
  // This is a temporary solution for development
  // In production, create orders on your backend server
  
  const mockOrder = {
    id: `order_${Date.now()}`,
    amount: options.amount,
    currency: options.currency,
    receipt: options.receipt,
    status: 'created',
    notes: options.notes || {},
  };

  return mockOrder;
}

export function openRazorpayCheckout(options: {
  amount: number;
  planType: string;
  userEmail?: string;
  userName?: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}) {
  const razorpayOptions = {
    amount: options.amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: {
      plan_type: options.planType,
      user_email: options.userEmail || '',
    },
  };

  // Create order
  createOrderClientSide(razorpayOptions).then((order) => {
    const razorpay = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1yourkeyhere',
      amount: order.amount,
      currency: order.currency,
      name: 'LinQ',
      description: `Unlock ${options.planType} plan`,
      order_id: order.id,
      handler: function (response: any) {
        options.onSuccess(response.razorpay_payment_id);
      },
    prefill: {
      name: options.userName || '',
      email: options.userEmail || '',
      contact: '',
    },
    theme: {
      color: '#2F5EEA',
    },
    modal: {
      ondismiss: function() {
        options.onError('Payment cancelled');
      },
      escape: false,
      handleback: false,
    },
  });

    razorpay.open();
  }).catch((error) => {
    options.onError('Failed to initialize payment');
  });
}

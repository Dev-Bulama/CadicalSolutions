'use client'

import { useState } from 'react'
import Link from 'next/link'
// import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { CreditCard, Truck, CheckCircle, Lock, ArrowLeft } from 'lucide-react'
import {
  useFlutterwave,
  closePaymentModal,
} from 'flutterwave-react-v3'

export default function CheckoutPage() {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const orderTotal = 219.96

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields')
      return
    }
    setStep('payment')
  }

  const config = {
  public_key:
    process.env
      .NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      
  tx_ref: Date.now().toString(),

  amount: orderTotal,

  currency: 'NGN',

  payment_options:
    'card, banktransfer, ussd',

  customer: {
    email: formData.email,
    phone_number: formData.phone,
    name: `${formData.firstName} ${formData.lastName}`,
  },

  customizations: {
    title: 'Cadical Store',
    description: 'Payment for medical products',
    logo: '/logo.png',
  },
}

  const handleFlutterPayment =
  useFlutterwave(config)
  // const handleFlutterwavePayment = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsProcessing(true)

  //   try {
  //     // Simulate Flutterwave payment
  //     // In production, you'd use the actual Flutterwave SDK
  //     // await new Promise((resolve) => setTimeout(resolve, 2000))
  //     const handleFlutterPayment = useFlutterwave(config)

  //     toast.success('Payment processed successfully!')
  //     setStep('confirmation')
  //   } catch (error) {
  //     toast.error('Payment failed. Please try again.')
  //   } finally {
  //     setIsProcessing(false)
  //   }
  // }

  const handleFlutterwavePayment = async (
  e: React.FormEvent
) => {
  e.preventDefault()

  try {
    handleFlutterPayment({
      callback: async (response) => {
        console.log('FLW RESPONSE:', response)

        // make sure transaction exists
        if (!response.transaction_id) {
          toast.error(
            'No transaction ID returned'
          )

          closePaymentModal()

          return
        }

        try {
          const verifyResponse = await fetch(
            '/api/verify-payment',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify({
                transaction_id:
                  response.transaction_id,
              }),
            }
          )

          if (!verifyResponse.ok) {
            throw new Error(
              'Verification failed'
            )
          }

          const data =
            await verifyResponse.json()

          console.log(
            'VERIFY RESPONSE:',
            data
          )

          if (
            data.status === 'success'
          ) {
            toast.success(
              'Payment successful!'
            )

            setStep(
              'confirmation'
            )
          } else {
            toast.error(
              'Payment verification failed'
            )
          }
        } catch (error) {
          console.error(error)

          toast.error(
            'Error verifying payment'
          )
        } finally {
          closePaymentModal()
        }
      },

      onClose: () => {
        toast.error(
          'Payment cancelled'
        )
      },
    })
  } catch (error) {
    console.error(error)

    toast.error(
      'Unable to initialize payment'
    )
  }
}

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* <Header /> */}

      {/* Progress Steps */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            {['Shipping', 'Payment', 'Confirmation'].map((s, idx) => (
              <div key={s} className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    idx < ['shipping', 'payment', 'confirmation'].indexOf(step)
                      ? 'bg-primary text-primary-foreground'
                      : step === ['shipping', 'payment', 'confirmation'][idx]
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`font-semibold hidden sm:block ${
                    idx <= ['shipping', 'payment', 'confirmation'].indexOf(step)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {s}
                </span>
                {idx < 2 && <div className="h-1 w-12 bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="lg:col-span-2">
            {/* Shipping Form */}
            {step === 'shipping' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="bg-card border border-border rounded-lg p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Shipping Address</h2>
                  </div>

                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          First Name *
                        </label>
                        <Input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Last Name *
                        </label>
                        <Input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Phone</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Address *
                      </label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          City *
                        </label>
                        <Input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          State
                        </label>
                        <Input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Zip Code
                        </label>
                        <Input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      >
                        <option value="">Select country</option>
                        <option value="NG">Nigeria</option>
                        <option value="ZA">South Africa</option>
                        <option value="KE">Kenya</option>
                        <option value="GH">Ghana</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Continue to Payment
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="bg-card border border-border rounded-lg p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Payment Method</h2>
                  </div>

                  <form onSubmit={handleFlutterwavePayment} className="space-y-6">
                    {/* Payment Options */}
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center gap-3 p-4 border border-primary rounded-lg cursor-pointer bg-primary/5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="flutterwave"
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-semibold">Flutterwave Payment</p>
                          <p className="text-sm text-muted-foreground">
                            Secure payment via card, bank transfer, or mobile money
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                      <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-foreground mb-1">Secure Payment</p>
                        <p className="text-muted-foreground">
                          Your payment information is encrypted and secure. We never store your card details.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Complete Purchase'}
                        {!isProcessing && <CreditCard className="h-5 w-5" />}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full gap-2"
                        onClick={() => setStep('shipping')}
                        disabled={isProcessing}
                      >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Shipping
                      </Button>
                    </div>
                  </form>

                  <p className="text-xs text-muted-foreground text-center">
                    Your order will be confirmed after payment
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {step === 'confirmation' && (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                      <CheckCircle className="h-16 w-16 text-green-500 relative" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">
                      Order Confirmed!
                    </h2>
                    <p className="text-muted-foreground">
                      Thank you for your purchase. Your order has been confirmed.
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4 space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number:</span>
                      <span className="font-bold">#CAD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="font-bold">${orderTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-bold text-green-600">Confirmed</span>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-foreground">
                      A confirmation email has been sent to <strong>{formData.email || 'your email'}</strong>
                    </p>
                  </div>

                  <Link href="/products">
                    <Button size="lg" className="w-full gap-2">
                      Continue Shopping
                      <ArrowLeft className="h-5 w-5 rotate-180" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Digital Blood Pressure Monitor</p>
                  <p className="text-sm font-semibold">$89.99</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Sterile Surgical Gloves (100 pairs) x2
                  </p>
                  <p className="text-sm font-semibold">$49.98</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-semibold">$139.97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Shipping</span>
                  <span className="text-sm font-semibold">$9.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tax</span>
                  <span className="text-sm font-semibold">$14.99</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${orderTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

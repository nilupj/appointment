import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PayPalButton from "@/components/PayPalButton";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import { Loader2, CreditCard, IndianRupee } from "lucide-react";

interface PaymentInfo {
  amount: string;
  currency: string;
  description: string;
}

export default function PaymentPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    amount: "1000",
    currency: "USD",
    description: "Medical Consultation"
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      amount: e.target.value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({
      ...paymentInfo,
      description: e.target.value
    });
  };

  const handleCurrencyChange = (currency: string) => {
    setPaymentInfo({
      ...paymentInfo,
      currency
    });
  };

  const handleCardPayment = () => {
    setIsProcessing(true);
    // In a real application, this would make an API call to process the card payment
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Processing",
        description: "Direct card payments are not yet implemented.",
        variant: "default",
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please log in to access the payment page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <a href="/auth">Go to Login</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment | MediConnect</title>
      </Helmet>
      <div className="container py-10">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Make a Payment</CardTitle>
            <CardDescription>Complete your payment securely.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={paymentInfo.amount}
                  onChange={handleAmountChange}
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={paymentInfo.description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div className="grid gap-2">
                <Label>Currency</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={paymentInfo.currency === "USD" ? "default" : "outline"}
                    onClick={() => handleCurrencyChange("USD")}
                    className="flex-1"
                  >
                    USD
                  </Button>
                  <Button
                    variant={paymentInfo.currency === "INR" ? "default" : "outline"}
                    onClick={() => handleCurrencyChange("INR")}
                    className="flex-1"
                  >
                    INR
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="paypal" className="mt-4">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="card">Card/UPI</TabsTrigger>
                </TabsList>
                <TabsContent value="paypal" className="mt-4">
                  <div className="flex justify-center">
                    <PayPalButton
                      amount={paymentInfo.amount}
                      currency={paymentInfo.currency}
                      intent="CAPTURE"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="card" className="mt-4">
                  <div className="grid gap-4">
                    {paymentInfo.currency === "INR" ? (
                      <Button 
                        onClick={async () => {
                          setIsProcessing(true);
                          try {
                            const response = await fetch("/api/phonepe/initiate", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                amount: paymentInfo.amount,
                                transactionId: `TX_${Date.now()}`
                              })
                            });
                            
                            const data = await response.json();
                            if (data.success) {
                              // For mobile devices, redirect to PhonePe app
                              window.location.href = data.data.instrumentResponse.redirectInfo.url;
                            }
                          } catch (error) {
                            console.error("PhonePe payment error:", error);
                            toast({
                              title: "Payment Error",
                              description: "Failed to initiate PhonePe payment",
                              variant: "destructive",
                            });
                          } finally {
                            setIsProcessing(false);
                          }
                        }}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <IndianRupee className="mr-2 h-4 w-4" />
                        )}
                        Pay with PhonePe
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleCardPayment} 
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        Pay with Card
                      </Button>
                    )}
                    <p className="text-xs text-center text-gray-500">
                      * Direct card and PhonePay payments will be implemented soon.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
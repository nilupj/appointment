
import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function PaymentGateway() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [match, params] = useRoute('/payment-gateway/:doctorId/:slot');

  const doctorId = match ? parseInt(params!.doctorId) : null;
  const slot = match ? decodeURIComponent(params!.slot) : null;

  const handlePayment = async (method: string) => {
    setIsLoading(true);
    try {
      // Here we'll integrate actual payment gateway
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating payment
      
      // After successful payment, book the appointment
      const date = new Date().toISOString().split('T')[0];
      const response = await fetch('/api/video-consult/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId,
          slot,
          date,
          paymentMethod: method,
          patientNotes: ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const data = await response.json();
      const doctorName = data[0]?.doctorName || '';
      navigate(`/video-consult/room?doctor=${encodeURIComponent(doctorName)}&appointmentId=${data[0].id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!doctorId || !slot) {
    return <div>Invalid payment request</div>;
  }

  return (
    <div className="container py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={() => handlePayment('razorpay')}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Pay with Razorpay
          </Button>
          
          <Button
            className="w-full"
            onClick={() => handlePayment('card')}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Pay with Card
          </Button>
          
          <Button
            className="w-full"
            onClick={() => handlePayment('phonepe')}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Pay with PhonePe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

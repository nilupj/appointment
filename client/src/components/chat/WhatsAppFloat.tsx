
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloat() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const whatsappNumber = '7994556262'; // Updated number
  
  const handleWhatsAppRedirect = () => {
    try {
      const defaultMessage = 'Hello! I have a question about MediConnect services.';
      const targetNumber = phoneNumber.replace(/[^0-9]/g, '') || whatsappNumber;
      const formattedNumber = targetNumber.startsWith('91') ? targetNumber : `91${targetNumber}`;
      const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message || defaultMessage)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsDialogOpen(false);
      setMessage('');
      setPhoneNumber('');
    } catch (error) {
      console.error('WhatsApp redirect error:', error);
    }
  };
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg"
        >
          <FaWhatsapp className="w-6 h-6 text-white" />
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat on WhatsApp</DialogTitle>
            <DialogDescription>
              Get quick assistance from our medical team via WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">WhatsApp Number (optional)</Label>
              <Input
                id="phoneNumber"
                placeholder="Enter doctor's WhatsApp number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use our support number: {whatsappNumber}
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="How can we help you today?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleWhatsAppRedirect}
              className="bg-green-500 hover:bg-green-600"
            >
              <FaWhatsapp className="mr-2 h-4 w-4" />
              Chat Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

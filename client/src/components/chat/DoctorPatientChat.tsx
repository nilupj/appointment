
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaWhatsapp } from 'react-icons/fa';

interface DoctorInfo {
  name: string;
  phoneNumber: string;
}

export default function DoctorPatientChat({ doctor }: { doctor?: DoctorInfo }) {
  const [message, setMessage] = useState(`Hello Dr. ${doctor?.name || ''}, I would like to discuss my medical condition.`);

  const handleWhatsAppChat = () => {
    const formattedNumber = (doctor?.phoneNumber || '').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/91${formattedNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Chat with {doctor?.name || 'Doctor'}</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md h-24"
          placeholder="Type your message..."
        />
        <Button 
          onClick={handleWhatsAppChat}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          <FaWhatsapp className="mr-2 h-4 w-4" />
          Start WhatsApp Chat
        </Button>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Helmet } from 'react-helmet';

interface VideoConferenceProps {
  roomName?: string;
  doctorName?: string;
  appointmentId?: string;
  onClose?: () => void;
}

export default function VideoConferenceComponent({
  roomName: initialRoomName,
  doctorName = 'Doctor',
  appointmentId,
  onClose
}: VideoConferenceProps) {
  const { user, isLoading } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const isDoctor = user?.role === 'doctor';
  const [roomName, setRoomName] = useState(initialRoomName || '');

  // Generate a random room name if not provided
  useEffect(() => {
    if (!initialRoomName) {
      const randomRoomId = `mediconnect-${Math.random().toString(36).substring(2, 11)}`;
      setRoomName(randomRoomId);
    }
  }, [initialRoomName]);

  const handleJoinMeeting = async () => {
    setIsJoining(true);
    try {
      // Always create a new appointment
      const bookResponse = await fetch('/api/video-consult/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: 3, // Michael Chen's ID
          userId: user.id,
          slot: new Date().toLocaleTimeString(),
          date: new Date().toISOString(),
          status: 'scheduled'
        })
      });
      
      if (!bookResponse.ok) {
        throw new Error('Failed to create consultation');
        return;
      }
      
      const bookData = await bookResponse.json();
      const currentAppointmentId = bookData.id;

      // Join the consultation
      const joinResponse = await fetch('/api/video-consult/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appointmentId: currentAppointmentId })
      });
      
      if (!joinResponse.ok) {
        throw new Error('Failed to join consultation');
      }

      const joinData = await joinResponse.json();
      setRoomName(joinData.roomId);
      setIsInCall(true);
    } catch (error) {
      console.error('Error joining consultation:', error);
      // Show error toast here
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveMeeting = () => {
    setIsInCall(false);
    if (onClose) {
      onClose();
    }
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
            Please log in to join the video consultation.
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
        <title>Video Consultation | MediConnect</title>
      </Helmet>

      {!isInCall ? (
        <Card className="mx-4 sm:mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Join Video Consultation</CardTitle>
            <CardDescription>
              You're about to join a video consultation with {doctorName}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Before joining:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Ensure your camera and microphone are working</li>
                  <li>Find a quiet place with good lighting</li>
                  <li>Have your medical records ready if needed</li>
                  <li>Prepare any questions you want to ask</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleJoinMeeting} 
                  disabled={isJoining}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Join Consultation
                    </>
                  )}
                </Button>
              </div>

              {appointmentId && (
                <p className="text-sm text-center text-muted-foreground">
                  Appointment ID: {appointmentId}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="h-[100vh] sm:h-[80vh] relative">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: true,
              startWithVideoMuted: false,
              prejoinPageEnabled: false,
              hideConferenceSubject: true,
              disableDeepLinking: true,
              websocket: 'wss://meet.jit.si/xmpp-websocket',
              resolution: 720,
              constraints: {
                video: {
                  height: {
                    ideal: 720,
                    max: 720,
                    min: 180
                  }
                }
              }
            }}
            interfaceConfigOverwrite={{
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'chat', 'recording',
                'settings', 'raisehand'
              ],
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
              DISPLAY_WELCOME_PAGE_CONTENT: false
            }}
            userInfo={{
              displayName: user.firstName || user.username,
              email: user.email
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
            }}
            onApiReady={(externalApi) => {
              // You can use the API here
              externalApi.on('videoConferenceLeft', () => {
                handleLeaveMeeting();
              });
            }}
          />

          <div className="absolute top-4 right-4 z-10">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleLeaveMeeting}
              className="px-2 py-1 sm:px-4 sm:py-2"
            >
              End Call
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
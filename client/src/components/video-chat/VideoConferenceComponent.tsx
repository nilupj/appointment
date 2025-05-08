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
  const [isDoctor, setIsDoctor] = useState(false); // Added state to track doctor status
  const [roomName, setRoomName] = useState(initialRoomName || '');

  // Generate a random room name if not provided
  useEffect(() => {
    if (!initialRoomName && appointmentId) {
      const timestamp = new Date().getTime();
      const randomRoomId = `mediconnect-${appointmentId}-${timestamp}`;
      setRoomName(randomRoomId);
      console.log('Generated room name:', randomRoomId);
    }
  }, [initialRoomName, appointmentId]);

  useEffect(() => {
    const checkDoctorStatus = async () => {
      if (appointmentId && user) {
        try {
          const response = await fetch(`/api/video-consult/check-doctor/${appointmentId}`);
          if (!response.ok) {
            throw new Error('Error checking doctor status');
          }
          const data = await response.json();
          setIsDoctor(data.isDoctor);
        } catch (error) {
          console.error('Error checking doctor status:', error);
        }
      }
    };
    checkDoctorStatus();
  }, [appointmentId, user]);


  const handleJoinMeeting = async () => {
    setIsJoining(true);
    try {
      if (!appointmentId) {
        throw new Error('No appointment ID provided');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }


      // Join the consultation.  The server-side should handle room creation and access control.
      const joinResponse = await fetch('/api/video-consult/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appointmentId, isDoctor }) // Include doctor status
      });

      if (!joinResponse.ok) {
        const errorData = await joinResponse.json();
        throw new Error(errorData.message || 'Failed to join consultation');
      }

      const joinData = await joinResponse.json();
      console.log('Join response:', joinData);
      setRoomName(joinData.roomId);
      setIsInCall(true);
    } catch (error) {
      console.error('Error joining consultation:', error);
      alert(error.message || 'Failed to join consultation. Please try again.');
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
        <Card className="mx-4 sm:mx-auto max-w-lg mt-4 sm:mt-8">
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
                <p className="mt-3 text-sm text-primary">
                  {isDoctor ? "As a doctor, you will be the moderator of this call." : "Please wait for the doctor to join the consultation."}
                </p>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={handleJoinMeeting} 
                  disabled={isJoining || (!isDoctor && !roomName)}
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
        <div className="h-screen w-full fixed top-0 left-0 z-50 bg-background">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: false,
              prejoinPageEnabled: false,
              hideConferenceSubject: false,
              disableDeepLinking: true,
              resolution: 720,
              lobby: {
                autoKnock: true,
                enableChat: true
              },
              moderator: isDoctor,
              membersOnly: true,
              enableLobby: true,
              enableClosePage: true,
              enableModeratorIndicator: true,
              disablePolls: true,
              disableReactions: true,
              disableInviteFunctions: true,
              requireDisplayName: true,
              enableLipSync: true,
              notifications: {
                enableNotifications: true,
                enableKnockingParticipants: true
              },
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
              externalApi.on('videoConferenceLeft', () => {
                handleLeaveMeeting();
              });
            }}
          />

          <div className="fixed top-4 right-4 z-[60]">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleLeaveMeeting}
              className="px-3 py-2 text-sm font-medium shadow-lg"
            >
              End Call
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
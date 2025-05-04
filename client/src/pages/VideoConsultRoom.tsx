import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/use-auth';
import VideoConferenceComponent from '@/components/video-chat/VideoConferenceComponent';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function VideoConsultRoom() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<{name: string; appointmentId?: string} | null>(null);
  
  // Parse query parameters to get doctor info
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const doctorName = searchParams.get('doctor') || 'Your Doctor';
    const appointmentId = searchParams.get('appointmentId') || undefined;
    const roomId = searchParams.get('roomId');
    
    setDoctorInfo({
      name: doctorName,
      appointmentId: appointmentId
    });
  }, []);

  const handleClose = () => {
    setShowAlert(true);
  };

  const confirmLeave = () => {
    navigate('/video-consult');
  };

  const cancelLeave = () => {
    setShowAlert(false);
  };

  return (
    <>
      <Helmet>
        <title>Video Consultation | MediConnect</title>
      </Helmet>
      <div className="container py-6">
        <VideoConferenceComponent 
          doctorName={doctorInfo?.name}
          appointmentId={doctorInfo?.appointmentId}
          onClose={handleClose}
        />
        
        <AlertDialog open={showAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Consultation?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end this consultation? The session will be closed and you'll return to the main page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelLeave}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmLeave}>Leave Consultation</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
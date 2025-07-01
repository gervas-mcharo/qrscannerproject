
import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Camera, CameraOff, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  isScanning: boolean;
  onScanResult: (data: string) => void;
  onStartScanning: () => void;
  onStopScanning: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({
  isScanning,
  onScanResult,
  onStartScanning,
  onStopScanning
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isScanning && videoRef.current) {
      startScanner();
    } else if (!isScanning && qrScannerRef.current) {
      stopScanner();
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, [isScanning]);

  const startScanner = async () => {
    if (!videoRef.current) return;

    try {
      setIsLoading(true);
      
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          onScanResult(result.data);
          toast({
            title: "QR Code Scanned!",
            description: "Successfully scanned QR code",
          });
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
      setIsLoading(false);
    } catch (error) {
      console.error('Error starting QR scanner:', error);
      setHasCamera(false);
      setIsLoading(false);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleToggleScanning = () => {
    if (isScanning) {
      onStopScanning();
    } else {
      onStartScanning();
    }
  };

  return (
    <CardContent className="p-6">
      <div className="space-y-6">
        {/* Camera Preview */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square max-w-md mx-auto">
          {isScanning ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              {isLoading && (
                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Starting camera...</p>
                  </div>
                </div>
              )}
              {/* Scanning overlay */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl">
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-blue-400"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-blue-400"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-blue-400"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-blue-400"></div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Camera preview will appear here</p>
                <p className="text-sm mt-2">Tap the button below to start scanning</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleToggleScanning}
            disabled={!hasCamera || isLoading}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : isScanning ? (
              <CameraOff className="w-5 h-5 mr-2" />
            ) : (
              <Camera className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Starting...' : isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </Button>

          {!hasCamera && (
            <p className="text-red-400 text-sm">
              Camera access is required to scan QR codes. Please check your browser permissions.
            </p>
          )}

          <p className="text-slate-400 text-sm">
            Point your camera at a QR code to scan it automatically
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default QRScanner;

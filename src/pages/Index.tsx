
import React, { useState } from 'react';
import QRScanner from '@/components/QRScanner';
import ScanHistory from '@/components/ScanHistory';
import ResultDisplay from '@/components/ResultDisplay';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, History, Scan } from 'lucide-react';

interface ScanResult {
  id: string;
  data: string;
  timestamp: Date;
  type: string;
}

const Index = () => {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanResult = (data: string) => {
    const newResult: ScanResult = {
      id: Date.now().toString(),
      data,
      timestamp: new Date(),
      type: detectDataType(data)
    };
    
    setScanResults(prev => [newResult, ...prev]);
    setCurrentResult(newResult);
    setIsScanning(false);
  };

  const detectDataType = (data: string): string => {
    if (data.startsWith('http://') || data.startsWith('https://')) return 'URL';
    if (data.startsWith('mailto:')) return 'Email';
    if (data.startsWith('tel:')) return 'Phone';
    if (data.startsWith('wifi:')) return 'WiFi';
    return 'Text';
  };

  const startScanning = () => {
    setIsScanning(true);
    setCurrentResult(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">QR Scanner</h1>
          <p className="text-slate-300">Scan QR codes instantly with your camera</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="scanner" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800 border-slate-700">
              <TabsTrigger 
                value="scanner" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <Scan className="w-4 h-4 mr-2" />
                Scanner
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <History className="w-4 h-4 mr-2" />
                History ({scanResults.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <QRScanner
                  isScanning={isScanning}
                  onScanResult={handleScanResult}
                  onStartScanning={startScanning}
                  onStopScanning={stopScanning}
                />
              </Card>
              
              {currentResult && (
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <ResultDisplay result={currentResult} />
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <ScanHistory results={scanResults} onClearHistory={() => setScanResults([])} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;

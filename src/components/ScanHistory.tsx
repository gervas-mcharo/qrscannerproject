
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Copy, ExternalLink, Mail, Phone, Wifi, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScanResult {
  id: string;
  data: string;
  timestamp: Date;
  type: string;
}

interface ScanHistoryProps {
  results: ScanResult[];
  onClearHistory: () => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ results, onClearHistory }) => {
  const copyToClipboard = async (data: string) => {
    try {
      await navigator.clipboard.writeText(data);
      toast({
        title: "Copied!",
        description: "Result copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const openLink = (result: ScanResult) => {
    if (['URL', 'Email', 'Phone'].includes(result.type)) {
      window.open(result.data, '_blank');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'URL':
        return <ExternalLink className="w-4 h-4" />;
      case 'Email':
        return <Mail className="w-4 h-4" />;
      case 'Phone':
        return <Phone className="w-4 h-4" />;
      case 'WiFi':
        return <Wifi className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'URL':
        return 'bg-blue-500';
      case 'Email':
        return 'bg-green-500';
      case 'Phone':
        return 'bg-orange-500';
      case 'WiFi':
        return 'bg-purple-500';
      default:
        return 'bg-slate-500';
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Scan History</CardTitle>
          {results.length > 0 && (
            <Button
              onClick={onClearHistory}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-500" />
            <p className="text-slate-400 text-lg">No scans yet</p>
            <p className="text-slate-500 text-sm mt-2">
              Your scan history will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={result.id}>
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(result.type)}
                        <Badge className={`${getTypeColor(result.type)} text-white text-xs`}>
                          {result.type}
                        </Badge>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {result.timestamp.toLocaleString()}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-slate-300 text-sm font-mono mb-3 break-all">
                      {truncateText(result.data, 100)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(result.data)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-400 hover:bg-slate-700 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>

                      {['URL', 'Email', 'Phone'].includes(result.type) && (
                        <Button
                          onClick={() => openLink(result)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                  {index < results.length - 1 && <Separator className="bg-slate-700" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </>
  );
};

export default ScanHistory;

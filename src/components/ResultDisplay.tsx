
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Mail, Phone, Wifi, FileText, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScanResult {
  id: string;
  data: string;
  timestamp: Date;
  type: string;
}

interface ResultDisplayProps {
  result: ScanResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.data);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Result copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const openLink = () => {
    if (result.type === 'URL') {
      window.open(result.data, '_blank');
    } else if (result.type === 'Email') {
      window.open(result.data, '_blank');
    } else if (result.type === 'Phone') {
      window.open(result.data, '_blank');
    }
  };

  const getTypeIcon = () => {
    switch (result.type) {
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

  const getTypeColor = () => {
    switch (result.type) {
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

  const canOpen = ['URL', 'Email', 'Phone'].includes(result.type);

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            Scan Result
          </div>
          <Badge className={`${getTypeColor()} text-white`}>
            {result.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Result Data */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
          <p className="text-slate-300 text-sm mb-2">Scanned Content:</p>
          <p className="text-white font-mono text-sm break-all leading-relaxed">
            {result.data}
          </p>
        </div>

        {/* Timestamp */}
        <div className="text-slate-400 text-sm">
          Scanned at: {result.timestamp.toLocaleString()}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          {canOpen && (
            <Button
              onClick={openLink}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
};

export default ResultDisplay;

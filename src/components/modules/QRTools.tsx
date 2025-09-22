import { useState, useRef } from "react";
import { QrCode, Camera, Download, Upload, Wifi, User, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeLib from 'qrcode';
import { useToast } from "@/hooks/use-toast";

export function QRTools() {
  const [qrType, setQrType] = useState("text");
  const [qrContent, setQrContent] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [qrColor, setQrColor] = useState("#8B5CF6");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [scanResult, setScanResult] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // WiFi form fields
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");

  // Contact form fields
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactOrg, setContactOrg] = useState("");

  const generateQRCode = async () => {
    let content = "";
    
    switch (qrType) {
      case "text":
        content = qrContent;
        break;
      case "url":
        content = qrContent.startsWith('http') ? qrContent : `https://${qrContent}`;
        break;
      case "wifi":
        content = `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};;`;
        break;
      case "contact":
        content = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL:${contactPhone}\nEMAIL:${contactEmail}\nORG:${contactOrg}\nEND:VCARD`;
        break;
      default:
        content = qrContent;
    }

    if (!content) {
      toast({
        title: "Error",
        description: "Please enter content to generate QR code",
        variant: "destructive"
      });
      return;
    }

    try {
      const options = {
        color: {
          dark: qrColor,
          light: bgColor,
        },
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'M' as const,
      };

      const url = await QRCodeLib.toDataURL(content, options);
      setQrUrl(url);
      
      toast({
        title: "QR Code Generated",
        description: "Your QR code is ready!"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  const downloadQR = () => {
    if (!qrUrl) return;

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrUrl;
    link.click();

    toast({
      title: "Downloaded",
      description: "QR code saved to your downloads"
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll show a placeholder message since we need QR scanner library
    toast({
      title: "QR Scanner",
      description: "QR scanning from file will be available in the next update!",
      variant: "destructive"
    });
  };

  const startCameraScanning = () => {
    // Placeholder for camera scanning functionality
    toast({
      title: "Camera Scanner",
      description: "Camera QR scanning will be available in the next update!",
      variant: "destructive"
    });
  };

  const renderQRForm = () => {
    switch (qrType) {
      case "wifi":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Network Name (SSID)</Label>
              <Input
                placeholder="My WiFi Network"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="WiFi password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label>Security Type</Label>
              <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">No Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label>Organization</Label>
              <Input
                placeholder="ABITALIB GROUP"
                value={contactOrg}
                onChange={(e) => setContactOrg(e.target.value)}
                className="glass"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label>Content</Label>
            {qrType === "url" ? (
              <Input
                placeholder="https://example.com"
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
                className="glass"
              />
            ) : (
              <Textarea
                placeholder="Enter your text here..."
                value={qrContent}
                onChange={(e) => setQrContent(e.target.value)}
                rows={4}
                className="glass"
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-glow">QR Code Tools</h1>
          <p className="text-foreground-muted">Generate and scan QR codes for various purposes</p>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 glass">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Generator
          </TabsTrigger>
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            QR Scanner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Generator Form */}
            <Card className="glass neon-glow">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron">Generate QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Type Selection */}
                <div className="space-y-2">
                  <Label>QR Code Type</Label>
                  <Select value={qrType} onValueChange={setQrType}>
                    <SelectTrigger className="glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      <SelectItem value="text">
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          Text
                        </div>
                      </SelectItem>
                      <SelectItem value="url">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          URL/Website
                        </div>
                      </SelectItem>
                      <SelectItem value="wifi">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4" />
                          WiFi Network
                        </div>
                      </SelectItem>
                      <SelectItem value="contact">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Contact Card
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Form Based on Type */}
                {renderQRForm()}

                {/* Customization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label>QR Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-12 h-10 p-1 glass"
                      />
                      <Input
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="glass"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Background</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 p-1 glass"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="glass"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={generateQRCode} className="w-full" size="lg">
                  <QrCode className="h-4 w-4" />
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>

            {/* QR Preview */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron">QR Code Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                {qrUrl ? (
                  <>
                    <div className="p-4 bg-white rounded-lg shadow-glass">
                      <img src={qrUrl} alt="Generated QR Code" className="w-80 h-80" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={downloadQR} variant="secondary">
                        <Download className="h-4 w-4" />
                        Download PNG
                      </Button>
                      <Button onClick={downloadQR} variant="outline">
                        <Download className="h-4 w-4" />
                        Download SVG
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 w-80 border-2 border-dashed border-border/50 rounded-lg">
                    <QrCode className="h-16 w-16 text-foreground-muted mb-4" />
                    <p className="text-foreground-muted text-center">
                      Generate a QR code to see the preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scanner">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Scanner Interface */}
            <Card className="glass neon-glow">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron">Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button 
                    onClick={startCameraScanning}
                    className="w-full" 
                    size="lg"
                    variant="secondary"
                  >
                    <Camera className="h-5 w-5" />
                    Start Camera Scanner
                  </Button>

                  <div className="text-center text-foreground-muted">or</div>

                  <div className="space-y-2">
                    <Label>Upload QR Code Image</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4" />
                        Choose File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scan Result */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron">Scan Result</CardTitle>
              </CardHeader>
              <CardContent>
                {scanResult ? (
                  <div className="space-y-4">
                    <div className="glass-light p-4 rounded-lg">
                      <p className="text-sm text-foreground-muted mb-2">Scanned Content:</p>
                      <p className="break-all">{scanResult}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigator.clipboard.writeText(scanResult)}
                        variant="outline"
                      >
                        Copy Text
                      </Button>
                      {scanResult.startsWith('http') && (
                        <Button 
                          onClick={() => window.open(scanResult, '_blank')}
                          variant="secondary"
                        >
                          Open URL
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-foreground-muted">
                    <Camera className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-center">
                      Scan a QR code using your camera or upload an image to see the result here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
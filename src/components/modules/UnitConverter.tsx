import { useState, useEffect } from "react";
import { ArrowRightLeft, History, Star, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ConversionHistory {
  id: string;
  from: string;
  to: string;
  fromValue: number;
  toValue: number;
  fromUnit: string;
  toUnit: string;
  category: string;
  timestamp: Date;
}

const conversions = {
  Length: {
    units: ["Meter", "Kilometer", "Centimeter", "Millimeter", "Inch", "Foot", "Yard", "Mile"],
    toMeter: {
      Meter: 1,
      Kilometer: 1000,
      Centimeter: 0.01,
      Millimeter: 0.001,
      Inch: 0.0254,
      Foot: 0.3048,
      Yard: 0.9144,
      Mile: 1609.34
    }
  },
  Weight: {
    units: ["Kilogram", "Gram", "Pound", "Ounce", "Ton", "Stone"],
    toKilogram: {
      Kilogram: 1,
      Gram: 0.001,
      Pound: 0.453592,
      Ounce: 0.0283495,
      Ton: 1000,
      Stone: 6.35029
    }
  },
  Temperature: {
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    convert: (value: number, from: string, to: string) => {
      let celsius = value;
      
      // Convert to Celsius first
      if (from === "Fahrenheit") {
        celsius = (value - 32) * 5/9;
      } else if (from === "Kelvin") {
        celsius = value - 273.15;
      }
      
      // Convert from Celsius to target
      if (to === "Fahrenheit") {
        return celsius * 9/5 + 32;
      } else if (to === "Kelvin") {
        return celsius + 273.15;
      }
      
      return celsius;
    }
  },
  Volume: {
    units: ["Liter", "Milliliter", "Gallon", "Quart", "Pint", "Cup", "Fluid Ounce"],
    toLiter: {
      Liter: 1,
      Milliliter: 0.001,
      Gallon: 3.78541,
      Quart: 0.946353,
      Pint: 0.473176,
      Cup: 0.236588,
      "Fluid Ounce": 0.0295735
    }
  },
  Speed: {
    units: ["Meter/Second", "Kilometer/Hour", "Mile/Hour", "Knot", "Foot/Second"],
    toMeterPerSecond: {
      "Meter/Second": 1,
      "Kilometer/Hour": 0.277778,
      "Mile/Hour": 0.44704,
      Knot: 0.514444,
      "Foot/Second": 0.3048
    }
  }
};

export function UnitConverter() {
  const [category, setCategory] = useState<string>("Length");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [fromValue, setFromValue] = useState<string>("");
  const [toValue, setToValue] = useState<string>("");
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem('conversion-history');
    const savedFavorites = localStorage.getItem('conversion-favorites');
    
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      })));
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('conversion-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('conversion-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (category) {
      const units = conversions[category as keyof typeof conversions].units;
      setFromUnit(units[0]);
      setToUnit(units[1]);
    }
  }, [category]);

  const convert = () => {
    if (!fromValue || !fromUnit || !toUnit || fromValue === "0") return;

    const value = parseFloat(fromValue);
    let result = 0;

    if (category === "Temperature") {
      result = conversions.Temperature.convert(value, fromUnit, toUnit);
    } else {
      const conversionData = conversions[category as keyof typeof conversions] as any;
      const baseKey = category === "Length" ? "toMeter" : 
                     category === "Weight" ? "toKilogram" :
                     category === "Volume" ? "toLiter" : "toMeterPerSecond";
      
      const baseValue = value * conversionData[baseKey][fromUnit];
      result = baseValue / conversionData[baseKey][toUnit];
    }

    setToValue(result.toFixed(6).replace(/\.?0+$/, ""));

    // Add to history
    const conversion: ConversionHistory = {
      id: Date.now().toString(),
      from: fromValue,
      to: result.toString(),
      fromValue: value,
      toValue: result,
      fromUnit,
      toUnit,
      category,
      timestamp: new Date()
    };

    setHistory(prev => [conversion, ...prev.slice(0, 19)]); // Keep last 20
  };

  useEffect(() => {
    if (fromValue && fromUnit && toUnit) {
      convert();
    } else {
      setToValue("");
    }
  }, [fromValue, fromUnit, toUnit, category]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(toValue);
    toast({
      title: "Copied!",
      description: "Result copied to clipboard"
    });
  };

  const addToFavorites = () => {
    const favoriteKey = `${category}:${fromUnit}->${toUnit}`;
    if (!favorites.includes(favoriteKey)) {
      setFavorites(prev => [...prev, favoriteKey]);
      toast({
        title: "Added to Favorites",
        description: "Conversion saved for quick access"
      });
    }
  };

  const loadFavorite = (favoriteKey: string) => {
    const [cat, conversion] = favoriteKey.split(":");
    const [from, to] = conversion.split("->");
    
    setCategory(cat);
    setFromUnit(from);
    setToUnit(to);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <BackButton />
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-glow">Unit Converter</h1>
          <p className="text-foreground-muted">Convert between different units with precision</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Converter */}
        <div className="xl:col-span-2">
          <Card className="glass neon-glow">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {Object.keys(conversions).map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conversion Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2 space-y-2">
                  <Label>From</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="0"
                      value={fromValue}
                      onChange={(e) => setFromValue(e.target.value)}
                      className="glass"
                    />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="glass min-w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {conversions[category as keyof typeof conversions].units.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="ghost" onClick={swapUnits} className="p-2">
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <Label>To</Label>
                  <div className="flex gap-2">
                    <Input
                      value={toValue}
                      readOnly
                      className="glass bg-muted/50"
                    />
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger className="glass min-w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {conversions[category as keyof typeof conversions].units.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {toValue && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={copyResult}>
                    <Copy className="h-4 w-4" />
                    Copy Result
                  </Button>
                  <Button variant="ghost" onClick={addToFavorites}>
                    <Star className="h-4 w-4" />
                    Add to Favorites
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Favorites */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm font-orbitron flex items-center gap-2">
                <Star className="h-4 w-4 text-warning" />
                Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {favorites.length === 0 ? (
                  <p className="text-sm text-foreground-muted">No favorites yet</p>
                ) : (
                  favorites.map((fav) => {
                    const [cat, conversion] = fav.split(":");
                    const [from, to] = conversion.split("->");
                    return (
                      <Button
                        key={fav}
                        variant="ghost"
                        className="w-full justify-start text-xs h-auto p-2"
                        onClick={() => loadFavorite(fav)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{cat}</div>
                          <div className="text-foreground-muted">{from} → {to}</div>
                        </div>
                      </Button>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-sm font-orbitron flex items-center gap-2">
                <History className="h-4 w-4 text-secondary" />
                Recent Conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-foreground-muted">No conversions yet</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="glass-light p-2 rounded-lg text-xs">
                      <div className="font-medium text-primary">{item.category}</div>
                      <div className="text-foreground">
                        {item.fromValue} {item.fromUnit} = {parseFloat(item.toValue.toString()).toFixed(3)} {item.toUnit}
                      </div>
                      <div className="text-foreground-muted">
                        {item.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
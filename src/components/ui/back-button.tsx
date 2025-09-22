import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  label?: string;
  variant?: "default" | "ghost" | "outline";
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function BackButton({ 
  label = "Back", 
  variant = "ghost", 
  className, 
  size = "default" 
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleBack}
      className={`flex items-center gap-2 touch-target ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
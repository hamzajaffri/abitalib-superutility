import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-bg p-4">
      <div className="text-center space-y-4 sm:space-y-6 max-w-md mx-auto">
        <div className="text-6xl sm:text-8xl font-orbitron font-bold text-glow bg-gradient-primary bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-xl sm:text-2xl font-orbitron font-bold text-foreground">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-foreground-muted">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="pt-4">
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-gradient-primary text-primary-foreground hover:shadow-glow-sm transition-all duration-300 border border-primary/20"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

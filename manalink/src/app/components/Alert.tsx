import { useEffect } from "react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = "success", duration = 5000, onClose }) => {
  const typeStyles: Record<typeof type, string> = {
    success: "bg-bg2 text-textcolor border border-green-500",
    error: "bg-bg2 text-danger2 border border-red-500",
    info: "bg-bg2 text-textcolor border border-logo",
    warning: "bg-bg2 text-textcolor border border-yellow-500",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-opacity duration-300 ${typeStyles[type]}`}
    >
      <span className="font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="text-xl font-bold focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;

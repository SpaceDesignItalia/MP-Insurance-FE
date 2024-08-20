import { motion } from "framer-motion";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { cn } from "@nextui-org/react";

interface AlertCardProps {
  isOpen: boolean;
  type: string;
  title: string;
  description: string;
}

export default function AlertCard({
  AlertCardProps,
}: {
  AlertCardProps: AlertCardProps;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-20 right-5 rounded-md p-4 w-1/3 z-50",
        AlertCardProps.type === "success" && "bg-green-50",
        AlertCardProps.type === "warning" && "bg-yellow-50",
        AlertCardProps.type === "error" && "bg-red-50"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex">
          {AlertCardProps.type === "success" && (
            <CheckCircleRoundedIcon
              aria-hidden="true"
              className="h-5 w-5 text-green-400"
            />
          )}
          {AlertCardProps.type === "warning" && (
            <WarningRoundedIcon
              aria-hidden="true"
              className="h-5 w-5 text-yellow-400"
            />
          )}
          {AlertCardProps.type === "error" && (
            <HighlightOffOutlinedIcon
              aria-hidden="true"
              className="h-5 w-5 text-red-400"
            />
          )}

          <div className="ml-3">
            <h3
              className={cn(
                "text-sm font-medium",
                AlertCardProps.type === "success" && "text-green-800",
                AlertCardProps.type === "warning" && "text-yellow-800",
                AlertCardProps.type === "error" && "text-red-800"
              )}
            >
              {AlertCardProps.title}
            </h3>
            <div
              className={cn(
                "mt-2 text-sm",
                AlertCardProps.type === "success" && "text-green-700",
                AlertCardProps.type === "warning" && "text-yellow-700",
                AlertCardProps.type === "error" && "text-red-700"
              )}
            >
              <div
                dangerouslySetInnerHTML={{ __html: AlertCardProps.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

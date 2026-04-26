import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Loader className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

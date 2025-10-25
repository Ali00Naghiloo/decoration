import { VscLoading } from "react-icons/vsc";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 z-50">
      <div className="w-16 h-16 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-6" />
      <div className="text-lg text-gray-700 tracking-wide font-medium animate-spin">
        <VscLoading />
      </div>
    </div>
  );
}

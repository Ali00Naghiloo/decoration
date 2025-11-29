import { VscLoading } from "react-icons/vsc";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 z-50">
      <div className="text-lg text-gray-700 tracking-wide font-medium animate-spin">
        <VscLoading />
      </div>
    </div>
  );
}

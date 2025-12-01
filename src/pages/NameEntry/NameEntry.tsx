import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NameEntry() {
  const navigate = useNavigate();
  return (
    <div className="h-svh bg-background-color flex flex-col justify-center items-center gap-10 text-text-color">
      <button
        onClick={() => {
          navigate("/cart");
        }}
        className="touchable absolute top-1 left-1"
      >
        <ChevronLeft size={50} strokeWidth={3} className="text-text-color" />
      </button>
      <span className="text-4xl font-bold">QUAL É O SEU NOME?</span>
      <input
        type="text"
        className="h-15 w-1/2 border border-border-color rounded-lg text-xl p-4 bg-card-color"
      />
    </div>
  );
}

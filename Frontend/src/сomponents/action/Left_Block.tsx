import { useNavigate } from "react-router-dom";

interface LeftProps {
  step: number;
  text: string;
  totalSteps: number;
}

export default function LeftBlock({ step, text, totalSteps }: LeftProps) {
  const navigate = useNavigate();

  return (
    <div className="left-block">
      <div className="left-block__hide-mobile">
        <p className="left-block__step">Step {step}/{totalSteps}</p>
        <p className="left-block__text">{text}</p>
      </div>
      <button 
        type="button" 
        className="left-block__arrow" 
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        ←
      </button>
    </div>
  );
}
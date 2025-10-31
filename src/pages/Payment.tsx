import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/cart")}>Voltar ao carrinho</button>
    </div>
  );
}

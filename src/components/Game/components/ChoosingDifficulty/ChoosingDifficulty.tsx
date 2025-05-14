import { useState } from "react";
import { Link } from "react-router-dom";
import "./ChoosingDifficulty.css";

const ChoosingDifficulty = () => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);

    return (
        <div className="difficulty-container">
            <h2 className="difficulty-title">Выберите сложность:</h2>
            <button type="button" className="difficulty-button scary-button" onClick={() => setSelectedDifficulty(1)}>
                Легко
            </button>
            <button type="button" className="difficulty-button scary-button" onClick={() => setSelectedDifficulty(2)}>
                Средне
            </button>
            <button type="button" className="difficulty-button scary-button" onClick={() => setSelectedDifficulty(3)}>
                Сложно
            </button>
            <Link to={`/Game`} state={selectedDifficulty} className="difficulty-link scary-button">
                Играть
            </Link>
        </div>
    );
};

export default ChoosingDifficulty;

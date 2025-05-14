import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IResaultParam } from "../../Game";
import { saveToLeaderboard } from "../../../Tables/Leaderboard";

import "./Win.css";
interface IWinProps {
    resultParam: IResaultParam;
}
const Win: React.FC<IWinProps> = ({ resultParam }) => {
    const [name, setName] = useState(""); // Состояние для имени игрока
    const [isNameEntered, setIsNameEntered] = useState(false); // Проверка, введено ли имя
    useEffect(() => {
        if (isNameEntered) {
            saveToLeaderboard(+resultParam.time, name, resultParam.difficulty - 1);
        }
    }, [isNameEntered, resultParam, name]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleNameSubmit = () => {
        if (name.trim() === "") {
            alert("Пожалуйста, введите ваше имя!");
        } else {
            setIsNameEntered(true);
        }
    };
    return (
        <>
            <div className="win-container">
                <h1 className="win-title ">Победа!</h1>
                <p className="result-info">Ваше время: {resultParam.time}</p>
                <p className="result-info">Количество рядов: {resultParam.countRow}</p>
                <p className="result-info">
                    Сложность:
                    {resultParam.difficulty === 1 ? "Легко" : resultParam.difficulty === 2 ? "Средняя" : "Сложная"}
                </p>

                {!isNameEntered ? (
                    <div className="name-input-container">
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Введите ваше имя"
                            className="name-input scary-button"
                        />
                        <button className="win-button scary-button" onClick={handleNameSubmit}>
                            Сохранить и продолжить
                        </button>
                    </div>
                ) : (
                    <div className="win-buttons ">
                        <Link to="/" className="scary-button">
                            Вернуться в меню
                        </Link>
                        <Link to="/Tables" className="scary-button">
                            Таблицы
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};
export default Win;

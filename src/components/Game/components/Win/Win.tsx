import { Link } from "react-router-dom";
import { IResaultParam } from "../../Game";

import "./Win.css";
import { useEffect, useState } from "react";
import { saveToLeaderboard } from "../../../Tables/Leaderboard";
interface IWinProps {
    resultParam: IResaultParam;
}
const Win: React.FC<IWinProps> = ({ resultParam }) => {
    const [name, setName] = useState(""); // Состояние для имени игрока
    const [isNameEntered, setIsNameEntered] = useState(false); // Проверка, введено ли имя
    useEffect(() => {
        if (isNameEntered) {
            saveToLeaderboard(+resultParam.time, name);
        }
    }, [isNameEntered, resultParam, name]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleNameSubmit = () => {
        if (name.trim() === "") {
            alert("Пожалуйста, введите ваше имя!");
        } else {
            setIsNameEntered(true); // Устанавливаем, что имя введено
        }
    };
    return (
        <>
            <div className="win-countainer">
                <p>Ваше время:{resultParam.time}</p>
                <p>Количество рядов:{resultParam.countRow}</p>

                <div className="win-container">
                    <h1 className="win-title">Победа!</h1>
                    {!isNameEntered ? (
                        <div className="name-input-container">
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Введите ваше имя"
                                className="name-input"
                            />
                            <button className="win-button" onClick={handleNameSubmit}>
                                Сохранить и продолжить
                            </button>
                        </div>
                    ) : (
                        <div className="win-buttons">
                            <Link to="/">Вернуться в меню</Link>
                            <Link to="/Tables">Таблицы</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default Win;

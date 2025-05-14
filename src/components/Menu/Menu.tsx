import { Link } from "react-router-dom";
import "./Menu.css"; // Импортируем CSS

const Menu = () => {
    return (
        <div className="menu-container">
            <h1 style={{ fontFamily: "blood", color: "red" }}>The Echo of the Abyss</h1>
            <Link to="/ChoosingDifficulty" className="menu-link scary-button">
                Играть
            </Link>
            <Link to="/Tables" className="menu-link scary-button">
                Таблицы
            </Link>
        </div>
    );
};

export default Menu;

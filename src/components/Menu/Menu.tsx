import { Link } from "react-router-dom";

const Menu = () => {
    return (
        <>
            <div className="menu-container">
                <Link to="/Game">Играть</Link>
                <Link to="/Tables">Таблицы</Link>
            </div>
        </>
    );
};
export default Menu;

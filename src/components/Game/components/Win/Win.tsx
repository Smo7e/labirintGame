import { Link } from "react-router-dom";
import { IResaultParam } from "../../Game";

import "./Win.css";
interface IWinProps {
    resultParam: IResaultParam;
}
const Win: React.FC<IWinProps> = ({ resultParam }) => {
    console.log(1);
    return (
        <>
            <div className="win-countainer">
                <p>Ваше время:{resultParam.time}</p>
                <p>Количество рядов:{resultParam.countRow}</p>

                <Link to="/">Вернуться в меню</Link>
                <Link to="/Tables">Таблицы</Link>
            </div>
        </>
    );
};
export default Win;

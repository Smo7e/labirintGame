import "./App.css";
import { Route, Routes } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import NotFound from "./components/NotFound/NotFound";
import Leaderboard from "./components/Tables/Leaderboard";
import ChoosingDifficulty from "./components/Game/components/ChoosingDifficulty/ChoosingDifficulty";
import Game from "./components/Game/Game";

function App() {
    return (
        <>
            <header></header>
            <main style={{ height: "100%" }} className="main">
                {/* <Leaderboard /> */}
                <Routes>
                    <Route path="/" element={<Menu />} />
                    <Route path="/ChoosingDifficulty" element={<ChoosingDifficulty />} />
                    <Route path="/Game" element={<Game />} />
                    <Route path="/Tables" element={<Leaderboard />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <footer></footer>
        </>
    );
}

export default App;

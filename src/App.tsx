import { useState } from "react";
import Game from "./components/Game/Game";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import NotFound from "./components/NotFound/NotFound";
import Leaderboard from "./components/Tables/Leaderboard";

function App() {
    return (
        <>
            <header></header>
            <main style={{ height: "100%" }}>
                <Leaderboard />
                <Routes>
                    <Route path="/" element={<Menu />} />
                    <Route path="/Game" element={<Game />} />
                    <Route path="/Tables" element={<></>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <footer></footer>
        </>
    );
}

export default App;

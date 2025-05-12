import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type LeaderboardEntry = {
    name: string;
    time: number;
};
const openDB = async (numberTable: number): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("leaderboardDB", 1);
        console.log(request);

        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBRequest).result;
            if (!db.objectStoreNames.contains("leaderboard" + numberTable)) {
                const store = db.createObjectStore("leaderboard" + numberTable, { autoIncrement: true });
                store.createIndex("timeIndex", "time");
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (e) => {
            reject(e);
        };
    });
};
export const saveToLeaderboard = async (time: number, name: string, numberTable = 0) => {
    const newEntry: LeaderboardEntry = {
        name,
        time,
    };

    const db = await openDB(numberTable);

    const transaction = db.transaction("leaderboard" + numberTable, "readwrite");
    const store = transaction.objectStore("leaderboard" + numberTable);

    store.add(newEntry);

    const leaderboard = await new Promise<LeaderboardEntry[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result as LeaderboardEntry[]);
        request.onerror = () => reject("Failed to retrieve leaderboard");
    });

    leaderboard.sort((a, b) => a.time - b.time);

    const topEntries = leaderboard.slice(0, 10);

    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
        topEntries.forEach((entry) => store.add(entry));
    };

    return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject();
    });
};

export const getLeaderboard = async (nameDB: string, numberTable: number): Promise<LeaderboardEntry[]> => {
    const db = await openDB(numberTable);
    const transaction = db.transaction(nameDB, "readonly");
    const store = transaction.objectStore(nameDB);

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
            resolve(request.result as LeaderboardEntry[]);
        };
        request.onerror = () => {
            reject("Failed to retrieve leaderboard");
        };
    });
};

const Leaderboard: React.FC = () => {
    const [leaderboard0, setLeaderboard0] = useState<LeaderboardEntry[]>([]);
    const [leaderboard1, setLeaderboard1] = useState<LeaderboardEntry[]>([]);
    const [leaderboard2, setLeaderboard2] = useState<LeaderboardEntry[]>([]);

    const clearLeaderboard = async (numberTable: number) => {
        const password = prompt("Введите пароль для удаления данных: ");
        if (password === "Password") {
            const db = await openDB(numberTable);
            const transaction = db.transaction("leaderboard" + numberTable, "readwrite");
            const store = transaction.objectStore("leaderboard" + numberTable);
            store.clear();

            transaction.oncomplete = () => {
                setLeaderboard0([]);
                setLeaderboard1([]);
                setLeaderboard2([]);

                alert("Таблица лидеров очищена!");
            };
            transaction.onerror = () => {
                alert("Произошла ошибка при очистке данных.");
            };
        } else {
            alert("Неверный пароль!");
        }
    };
    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data0 = await getLeaderboard("leaderboard", 0);
            const data1 = await getLeaderboard("leaderboard", 1);
            const data2 = await getLeaderboard("leaderboard", 2);

            setLeaderboard0(data0);
            setLeaderboard1(data1);
            setLeaderboard2(data2);
        };

        fetchLeaderboard();
    }, []);

    const leaderboardJsx = (numberTable: number) => {
        console.log(leaderboard0, leaderboard1, leaderboard2);
        return (
            <div className="leaderboard">
                <div style={{ width: "100%", textAlign: "center", fontSize: "3vw" }}>Таблица лидеров</div>
                <table style={{ width: "100%", textAlign: "center" }}>
                    <thead>
                        <tr style={{ fontSize: "min(2vw, 3vh)", height: "min(6.5vh, 6.5vw)", width: "100%" }}>
                            <th>№</th>
                            <th>Имя</th>
                            <th>Время (сек)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {[leaderboard0, leaderboard1, leaderboard2][numberTable].map((entry, index) => (
                            <tr
                                key={index}
                                style={{ fontSize: "min(2vw, 3vh)", height: "min(6.5vh, 6.5vw)", width: "100%" }}
                            >
                                <td>{index + 1}</td>
                                <td>{entry.name}</td>
                                <td>{entry.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    return (
        <>
            <div style={{ display: "flex", height: "80vh", width: "80vw" }}>{leaderboardJsx(2)}</div>

            <button
                style={{ fontSize: "min(2vw, 3vh)", height: "min(6.5vh, 6.5vw)" }}
                onClick={() => {
                    clearLeaderboard(0);
                    clearLeaderboard(1);
                    clearLeaderboard(2);
                }}
            >
                Очистить таблицу
            </button>
            <Link to="/">Меню</Link>
        </>
    );
};

export default Leaderboard;

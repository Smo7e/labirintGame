import React, { useEffect, useState } from "react";
import "./Leaderboard.css";
import { Link } from "react-router-dom";
type LeaderboardEntry = {
    name: string;
    time: number;
};
interface LeaderboardProps {
    titles?: string[];
}

const DB_NAME = "leaderboardDB";
const DB_VERSION = 2;
const TABLE_NAMES = ["leaderboardTable1", "leaderboardTable2", "leaderboardTable3"];

const openDB = async (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBRequest).result as IDBDatabase;

            for (const tableName of TABLE_NAMES) {
                if (!db.objectStoreNames.contains(tableName)) {
                    const store = db.createObjectStore(tableName, { autoIncrement: true });
                    store.createIndex("timeIndex", "time");
                }
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

export const saveToLeaderboard = async (time: number, name: string, tableIndex: number = 0) => {
    if (tableIndex < 0 || tableIndex >= TABLE_NAMES.length) {
        throw new Error("Invalid table index" + (TABLE_NAMES.length - 1));
    }
    const tableName = TABLE_NAMES[tableIndex];

    const newEntry: LeaderboardEntry = {
        name,
        time,
    };

    const db = await openDB();

    const transaction = db.transaction(tableName, "readwrite");
    const store = transaction.objectStore(tableName);

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

export const getLeaderboard = async (tableIndex: number = 0): Promise<LeaderboardEntry[]> => {
    if (tableIndex < 0 || tableIndex >= TABLE_NAMES.length) {
        throw new Error("Invalid table index." + (TABLE_NAMES.length - 1));
    }
    const tableName = TABLE_NAMES[tableIndex];
    const db = await openDB();
    const transaction = db.transaction(tableName, "readonly");
    const store = transaction.objectStore(tableName);

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => {
            const results = request.result as LeaderboardEntry[];
            results.sort((a, b) => a.time - b.time);
            resolve(results);
        };
        request.onerror = () => {
            reject("Failed to retrieve leaderboard");
        };
    });
};

const Leaderboard: React.FC<LeaderboardProps> = ({ titles }) => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[][]>([[], [], []]);
    const numberOfTables = 3;

    useEffect(() => {
        const loadLeaderboards = async () => {
            const allLeaderboards: LeaderboardEntry[][] = [];
            for (let i = 0; i < numberOfTables; i++) {
                try {
                    const lb = await getLeaderboard(i);
                    allLeaderboards.push(lb);
                } catch (error) {
                    console.error(`Failed to load leaderboard ${i + 1}:`, error);
                    allLeaderboards.push([]);
                }
            }
            setLeaderboardData(allLeaderboards);
        };

        loadLeaderboards();
    }, []);

    return (
        <div>
            <Link to="/" className="leaderboard-go-menu scary-button">
                Меню
            </Link>

            <div className="leaderboard-container">
                {[0, 1, 2].map((tableIndex) => (
                    <div key={tableIndex} className="leaderboard">
                        <div className="leaderboard-title">
                            {titles && titles[tableIndex]
                                ? titles[tableIndex]
                                : ` ${tableIndex === 0 ? "Легкая" : tableIndex === 1 ? "Средняя" : "Сложная"} `}
                        </div>
                        <table className="leaderboard-table">
                            <thead>
                                <tr className="leaderboard-header-row">
                                    <th>№</th>
                                    <th>Имя</th>
                                    <th>Время (сек)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {leaderboardData[tableIndex].map((entry, index) => (
                                    <tr key={index} className="leaderboard-data-row">
                                        <td>{index + 1}</td>
                                        <td>{entry.name}</td>
                                        <td>{entry.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;

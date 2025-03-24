import { RigidBody } from "@react-three/rapier";
import { SIZE_MAP } from "../..";
import React, { useEffect, useState } from "react";
import { DoubleSide } from "three";

const COL = 20;
const ROW = 20;
const Maps = () => {
    let [wallArr, setWallArr] = useState<number[][]>([]);

    const generateMaze = (rows: number, cols: number, seed: number = 1): number[][] => {
        // Инициализация генератора случайных чисел (если передан seed)
        let random = (function () {
            let s = seed || Math.random();
            return function () {
                s = (s * 9301 + 49297) % 233280;
                return s / 233280;
            };
        })();
        // Создание матрицы, заполненной стенами
        const maze: number[][] = Array(rows)
            .fill(null)
            .map(() => Array(cols).fill(1));

        // Функция для проверки, находится ли ячейка внутри лабиринта
        function isValid(row: number, col: number): boolean {
            return row >= 0 && row < rows && col >= 0 && col < cols;
        }

        // Алгоритм генерации лабиринта (алгоритм "Randomized Depth-First Search")
        function carvePath(row: number, col: number): void {
            maze[row][col] = 0; // Помечаем текущую ячейку как проход

            const directions = [
                [0, 2], // Вверх
                [2, 0], // Вправо
                [0, -2], // Вниз
                [-2, 0], // Влево
            ];

            // Перемешиваем направления (случайный порядок)
            for (let i = directions.length - 1; i > 0; i--) {
                const j = Math.floor(random() * (i + 1));
                [directions[i], directions[j]] = [directions[j], directions[i]];
            }

            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;

                if (isValid(newRow, newCol) && maze[newRow][newCol] === 1) {
                    // Прорубаем путь к соседней ячейке
                    maze[row + dr / 2][col + dc / 2] = 0; //  Прорубаем стену между ячейками
                    carvePath(newRow, newCol);
                }
            }
        }

        // Выбираем случайную стартовую точку и начинаем генерацию (делаем ее нечетными)
        let startRow = Math.floor((random() * (rows - 1)) / 2) * 2 + 1;
        let startCol = Math.floor((random() * (cols - 1)) / 2) * 2 + 1;

        carvePath(startRow, startCol);

        // Убедимся, что вход и выход доступны
        maze[0][1] = 0; // Вход - верхний левый угол

        const upDownWallnew = Array(rows).fill(1);
        maze.push(upDownWallnew);
        maze.unshift(upDownWallnew);

        maze[rows + 1][cols - 2] = 0; // Выход - нижний правый угол
        maze.forEach((_, index) => {
            maze[index][maze.length - 2] = 1;
        });

        return maze;
    };

    useEffect(() => {
        setWallArr(generateMaze(COL, ROW, Math.random()));
    }, []);
    console.log(2);
    return (
        <>
            {/* <fogExp2 attach="fog" args={["#808080", 0.08]} /> */}
            <RigidBody lockTranslations lockRotations position={[(ROW / 2) * SIZE_MAP, 0, (COL / 2) * SIZE_MAP]}>
                <mesh position={[0, SIZE_MAP * 0.5, 0]} rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[(ROW + 2) * SIZE_MAP, (COL + 5) * SIZE_MAP]} />
                    <meshStandardMaterial color="gray" />
                </mesh>
            </RigidBody>
            {/* <RigidBody lockTranslations lockRotations>
                <mesh position={[0, SIZE_MAP * 1.5, 0]} rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[(COL + 2) * SIZE_MAP, (ROW + 5) * SIZE_MAP]} />
                    <meshStandardMaterial color="gray" side={DoubleSide} />
                </mesh>
            </RigidBody> */}

            {wallArr.map((row, rowIndex) => {
                return row.map((rowNum, rowNumIndex) => {
                    const key = `${rowIndex}-${rowNumIndex}-wall`;

                    return rowNum ? (
                        <RigidBody lockTranslations lockRotations key={key}>
                            <mesh position={[rowNumIndex * SIZE_MAP, SIZE_MAP, rowIndex * SIZE_MAP]}>
                                <boxGeometry args={[SIZE_MAP, SIZE_MAP, SIZE_MAP]} />
                                <meshStandardMaterial color="red" />
                            </mesh>
                        </RigidBody>
                    ) : (
                        <React.Fragment key={key}></React.Fragment>
                    );
                });
            })}
        </>
    );
};
export default Maps;

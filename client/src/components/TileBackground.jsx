import { useEffect, useState } from "react";

const TileBackground = () => {
  const rows = 15; // Number of rows
  const cols = 25; // Number of columns
  const totalTiles = rows * cols;

  const [snakePath, setSnakePath] = useState([]);

  useEffect(() => {
    let currentTile = Math.floor(Math.random() * totalTiles); // Start at a random tile
    const interval = setInterval(() => {
      setSnakePath((prev) => {
        const newPath = [...prev, currentTile];

        // Limit the snake's length
        if (newPath.length > 20) {
          newPath.shift();
        }

        // Move to a random adjacent tile
        const possibleMoves = [
          currentTile - 1, // Left
          currentTile + 1, // Right
          currentTile - cols, // Up
          currentTile + cols, // Down
        ].filter(
          (tile) =>
            tile >= 0 &&
            tile < totalTiles && // Stay within bounds
            !(tile % cols === 0 && currentTile % cols === cols - 1) && // Prevent wrapping right to left
            !(tile % cols === cols - 1 && currentTile % cols === 0) // Prevent wrapping left to right
        );

        currentTile =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return newPath;
      });
    }, 200); // Adjust speed here

    return () => clearInterval(interval);
  }, [totalTiles, cols]);

  return (
    <div className="absolute inset-0 z-10 md:grid md:grid-cols-25 md:grid-rows-15 pointer-events-none">
      {Array.from({ length: totalTiles }).map((_, index) => (
        <div
          key={index}
          className={`border border-green-400 opacity-10 transition-all duration-500 ${
            snakePath.includes(index)
              ? "bg-green-500"
              : "bg-transparent"
          }`}
          style={{ width: "4vw", height: "4vw" }}
        />
      ))}
    </div>
  );
};

export default TileBackground;

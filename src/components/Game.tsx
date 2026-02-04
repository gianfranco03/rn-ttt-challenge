import { winPatterns } from "@/constants/winPatterns";
import type { TBoard, TPlayer } from "@/types/game";
import { Activity, useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Board } from "./Board";
import { Result } from "./Result";

export const Game = ({
	playerGoesFirst,
	resetToMenu,
}: {
	playerGoesFirst: boolean;
	resetToMenu: () => void;
}) => {
	const [board, setBoard] = useState<TBoard>(Array(9).fill(null));
	const [isPlayerTurn, setIsPlayerTurn] = useState(true);
	const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X");
	const [computerSymbol, setComputerSymbol] = useState<"X" | "O">("O");
	const [gameState, setGameState] = useState<"won" | "lost" | "tie" | null>(
		null,
	);
	const [isProcessing, setIsProcessing] = useState(false);

	// Check for winner
	const checkWinner = useCallback((currentBoard: TBoard): TPlayer => {
		for (const pattern of winPatterns) {
			const [a, b, c] = pattern;
			if (
				currentBoard[a] &&
				currentBoard[a] === currentBoard[b] &&
				currentBoard[a] === currentBoard[c]
			) {
				return currentBoard[a];
			}
		}

		return null;
	}, []);

	// Check if board is full
	const isBoardFull = useCallback((currentBoard: TBoard): boolean => {
		return currentBoard.every((cell) => cell !== null);
	}, []);

	// Minimax algorithm for unbeatable
	const minimax = useCallback(
		(currentBoard: TBoard, depth: number, isMaximizing: boolean): number => {
			const winner = checkWinner(currentBoard);

			// Terminal states
			if (winner === computerSymbol) return 10 - depth;
			if (winner === playerSymbol) return depth - 10;
			if (isBoardFull(currentBoard)) return 0;

			if (isMaximizing) {
				let bestScore = -Infinity;
				for (let i = 0; i < 9; i++) {
					if (currentBoard[i] === null) {
						currentBoard[i] = computerSymbol;
						const score = minimax(currentBoard, depth + 1, false);
						currentBoard[i] = null;
						bestScore = Math.max(score, bestScore);
					}
				}
				return bestScore;
			} else {
				let bestScore = Infinity;
				for (let i = 0; i < 9; i++) {
					if (currentBoard[i] === null) {
						currentBoard[i] = playerSymbol;
						const score = minimax(currentBoard, depth + 1, true);
						currentBoard[i] = null;
						bestScore = Math.min(score, bestScore);
					}
				}
				return bestScore;
			}
		},
		[computerSymbol, playerSymbol, checkWinner, isBoardFull],
	);

	// Get best move for computer
	const getBestMove = useCallback(
		(currentBoard: TBoard): number => {
			let bestScore = -Infinity;
			let bestMove = -1;

			for (let i = 0; i < 9; i++) {
				if (currentBoard[i] === null) {
					currentBoard[i] = computerSymbol;
					const score = minimax(currentBoard, 0, false);
					currentBoard[i] = null;

					if (score > bestScore) {
						bestScore = score;
						bestMove = i;
					}
				}
			}

			return bestMove;
		},
		[computerSymbol, minimax],
	);

	// Computer makes a move
	const makeComputerMove = useCallback(
		(currentBoard: TBoard) => {
			setIsProcessing(true);

			// Add slight delay for better UX
			setTimeout(() => {
				const bestMove = getBestMove([...currentBoard]);

				if (bestMove !== -1) {
					const newBoard = [...currentBoard];
					newBoard[bestMove] = computerSymbol;
					setBoard(newBoard);

					const winner = checkWinner(newBoard);
					if (winner === computerSymbol) {
						setGameState("lost");
						Alert.alert("Game Over", "Computer Wins!", [{ text: "OK" }]);
					} else if (isBoardFull(newBoard)) {
						setGameState("tie");
						Alert.alert("Game Over", "It's a Tie!", [{ text: "OK" }]);
					} else {
						setIsPlayerTurn(true);
					}
				}

				setIsProcessing(false);
			}, 500);
		},
		[computerSymbol, getBestMove, checkWinner, isBoardFull],
	);

	// Handle cell press
	const handleCellPress = (index: number) => {
		// Prevent moves when:
		// - Game is not in playing state
		// - Cell is already occupied
		// - It's not player's turn
		// - Computer is processing
		if (board[index] !== null || !isPlayerTurn || isProcessing) {
			return;
		}

		const newBoard = [...board];
		newBoard[index] = playerSymbol;
		setBoard(newBoard);

		const winner = checkWinner(newBoard);
		if (winner === playerSymbol) {
			setGameState("won");
			Alert.alert("Game Over", "You Win!", [{ text: "OK" }]);
		} else if (isBoardFull(newBoard)) {
			setGameState("tie");
			Alert.alert("Game Over", "It's a Tie!", [{ text: "OK" }]);
		} else {
			setIsPlayerTurn(false);
		}
	};

	const resetBoard = (goBack: boolean) => {
		setBoard(Array(9).fill(null));
		setGameState(null);
		setIsPlayerTurn(!!playerGoesFirst);
		if (goBack) resetToMenu();
	};

	// Effect to trigger computer move
	useEffect(() => {
		if (gameState === null && !isPlayerTurn && !isProcessing) {
			makeComputerMove(board);
		}
	}, [isPlayerTurn, board, isProcessing, makeComputerMove, gameState]);

	useEffect(() => {
		if (playerGoesFirst) {
			setPlayerSymbol("X");
			setComputerSymbol("O");
			setIsPlayerTurn(true);
		} else {
			setPlayerSymbol("O");
			setComputerSymbol("X");
			setIsPlayerTurn(false);
		}
	}, [playerGoesFirst]);

	return (
		<View className="items-center flex-1 px-10 pt-20">
			<Text className="text-primary text-5xl mb-4 font-bold">Tic Tac Toe</Text>
			<Activity mode={gameState ? "hidden" : "visible"}>
				<View className="items-center">
					<Text
						testID="game-title"
						className="text-primary text-xl font-medium uppercase"
					>
						{isPlayerTurn && !isProcessing
							? `Your turn `
							: `Computer thinking... `}
					</Text>
					<View className="flex-row justify-between mt-2 items-center gap-10 mb-6">
						<View
							className="items-center"
							style={{ opacity: isPlayerTurn ? 1 : 0.5 }}
						>
							<Text
								testID="game-player-indicator"
								className="text-player-x text-3xl font-bold"
							>
								{playerSymbol}
							</Text>
							<Text
								testID="game-player-symbol"
								className="text-secondary text-lg font-medium"
							>
								PLAYER
							</Text>
						</View>
						<View className="w-[0.5px] h-10 bg-secondary" />
						<View
							className="items-center"
							style={{ opacity: isPlayerTurn ? 0.5 : 1 }}
						>
							<Text
								testID="game-cpu-indicator"
								className="text-player-o text-3xl font-bold"
							>
								{computerSymbol}
							</Text>
							<Text
								testID="game-cpu-symbol"
								className="text-secondary text-lg font-medium"
							>
								CPU
							</Text>
						</View>
					</View>
				</View>
			</Activity>
			<Activity mode={gameState ? "visible" : "hidden"}>
				{(gameState === "won" && (
					<Result
						title="You Won!"
						description="Congratulations on your victory!"
					/>
				)) ||
					(gameState === "lost" && (
						<Result
							title="You Lost!"
							description="Don't be discouraged, try again!"
						/>
					)) ||
					(gameState === "tie" && (
						<Result
							title="It's a Tie!"
							description="Great minds think alike!"
						/>
					))}
			</Activity>
			<Board
				board={board}
				isPlayerTurn={isPlayerTurn}
				isProcessing={isProcessing}
				playerSymbol={playerSymbol}
				computerSymbol={computerSymbol}
				onCellPress={handleCellPress}
			/>
			<View className="h-6" />
			<Activity mode={gameState ? "visible" : "hidden"}>
				<Pressable
					testID="game-play-again-button"
					className="w-full py-4 bg-button-primary rounded-lg justify-center items-center mb-6"
					onPress={() => resetBoard(false)}
				>
					<Text className="text-white text-lg font-bold">Play Again</Text>
				</Pressable>
			</Activity>
			<Pressable
				testID="game-reset-button"
				className="w-full py-4 bg-button-secondary rounded-lg justify-center items-center"
				onPress={() => resetBoard(true)}
			>
				<Text className="text-white text-lg font-bold">Back to Menu</Text>
			</Pressable>
		</View>
	);
};

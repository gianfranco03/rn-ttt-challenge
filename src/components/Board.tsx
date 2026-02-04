import { Pressable, Text, View } from "react-native";

type Player = "X" | "O" | null;
type TCell = { id: string; value: number };

const ROWS: TCell[] = [
	{ id: "row-0", value: 0 },
	{ id: "row-1", value: 1 },
	{ id: "row-2", value: 2 },
];
const COLS: TCell[] = [
	{ id: "col-0", value: 0 },
	{ id: "col-1", value: 1 },
	{ id: "col-2", value: 2 },
];

const Cell = ({
	index,
	value,
	isDisabled,
	playerSymbol,
	computerSymbol,
	onPress,
}: {
	index: number;
	value: Player;
	isDisabled: boolean;
	playerSymbol: Player;
	computerSymbol: Player;
	onPress: (index: number) => void;
}) => {
	return (
		<Pressable
			testID="board-cell"
			key={index}
			className="w-23 h-23 border flex items-center pt-5 bg-cell-bg m-2 rounded-xl"
			style={{
				borderColor: value ? "#333F58" : "#0E234C",
			}}
			onPress={() => onPress(index)}
			disabled={isDisabled}
		>
			<Text
				testID="board-cell-value"
				className={"text-6xl font-bold"}
				style={
					// FIXME: Improve color handling with Uniwind
					value === playerSymbol
						? { color: "#4CAF50" }
						: value === computerSymbol
							? { color: "#F44336" }
							: {}
				}
			>
				{value || ""}
			</Text>
		</Pressable>
	);
};

export const Board = ({
	board,
	isPlayerTurn,
	isProcessing,
	playerSymbol,
	computerSymbol,
	onCellPress,
}: {
	board: Player[];
	isPlayerTurn: boolean;
	isProcessing: boolean;
	playerSymbol: Player;
	computerSymbol: Player;
	onCellPress: (index: number) => void;
}) => {
	return (
		<View className="bg-board-bg rounded-2xl p-2 border-2 border-board-border">
			{ROWS.map((row) => (
				<View key={row.id} className="flex-row">
					{COLS.map((col) => (
						<Cell
							key={col.id}
							index={row.value * 3 + col.value}
							value={board[row.value * 3 + col.value]}
							isDisabled={
								board[row.value * 3 + col.value] !== null ||
								!isPlayerTurn ||
								isProcessing
							}
							playerSymbol={playerSymbol}
							computerSymbol={computerSymbol}
							onPress={onCellPress}
						/>
					))}
				</View>
			))}
		</View>
	);
};

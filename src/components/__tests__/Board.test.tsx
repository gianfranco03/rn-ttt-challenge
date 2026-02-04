import type { TPlayer } from "@/types/game";
import { fireEvent, render } from "@testing-library/react-native";
import { Board } from "../Board";

describe("Board Component", () => {
	it("renders correctly with empty board", () => {
		const board = Array(9).fill(null);
		const { getAllByText } = render(
			<Board
				board={board}
				isPlayerTurn={true}
				isProcessing={false}
				playerSymbol="X"
				computerSymbol="O"
				onCellPress={() => {}}
			/>,
		);

		// Check that all cells are empty
		const cells = getAllByText("");
		expect(cells.length).toBe(9);
	});

	it("renders correctly with player and computer moves", () => {
		const playerSymbol: TPlayer = "X";
		const computerSymbol: TPlayer = "O";
		const board = [
			playerSymbol,
			null,
			computerSymbol,
			null,
			playerSymbol,
			null,
			null,
			computerSymbol,
			null,
		];
		const { getAllByTestId } = render(
			<Board
				board={board}
				isPlayerTurn={false}
				isProcessing={true}
				playerSymbol="X"
				computerSymbol="O"
				onCellPress={() => {}}
			/>,
		);

		// Check that all cells are disabled
		const cells = getAllByTestId("board-cell");
		cells.forEach((cell) => {
			expect(cell.props.accessibilityState.disabled).toBe(true);
		});
	});

	it("calls onCellPress when a cell is pressed", () => {
		const board = Array(9).fill(null);
		const mockOnCellPress = jest.fn();
		const { getAllByTestId } = render(
			<Board
				board={board}
				isPlayerTurn={true}
				isProcessing={false}
				playerSymbol="X"
				computerSymbol="O"
				onCellPress={mockOnCellPress}
			/>,
		);

		const cells = getAllByTestId("board-cell");
		fireEvent.press(cells[0]);

		expect(mockOnCellPress).toHaveBeenCalledWith(0);
	});
});

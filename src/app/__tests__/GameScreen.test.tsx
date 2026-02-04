import TicTacToe from "@/app/index";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

jest.useRealTimers();

describe("Game Component", () => {
	beforeEach(() => {
		jest.spyOn(Alert, "alert");
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("renders correctly", () => {
		const { getByTestId } = render(<TicTacToe />);
		const startButton = getByTestId("menu-player-first-button");
		fireEvent.press(startButton);
		expect(getByTestId("game-title")).toBeTruthy();
		expect(getByTestId("game-player-indicator")).toBeTruthy();
		expect(getByTestId("game-player-symbol")).toBeTruthy();
		expect(getByTestId("game-cpu-indicator")).toBeTruthy();
		expect(getByTestId("game-cpu-symbol")).toBeTruthy();
	});

	test("calls resetToMenu when reset button is pressed", () => {
		const { getByTestId } = render(<TicTacToe />);
		const startButton = getByTestId("menu-player-first-button");
		fireEvent.press(startButton);

		const resetButton = getByTestId("game-reset-button");
		fireEvent.press(resetButton);

		expect(getByTestId("menu-player-first-button")).toBeTruthy();
	});

	test("completes a game and shows loss result", async () => {
		const { getByText, getAllByTestId, getByTestId } = render(<TicTacToe />);
		const startButton = getByTestId("menu-player-first-button");
		fireEvent.press(startButton);

		const cells = getAllByTestId("board-cell-value");

		act(() => {
			fireEvent.press(cells[0]);
		});

		await waitFor(() => {
			expect(cells[4].props.children).toBe("O");
		});

		act(() => {
			fireEvent.press(cells[1]);
		});
		await waitFor(() => {
			expect(cells[2].props.children).toBe("O");
		});

		act(() => {
			fireEvent.press(cells[3]);
		});

		await waitFor(() => {
			expect(getByText("You Lost!")).toBeTruthy();
			expect(getByText("Don't be discouraged, try again!")).toBeTruthy();
			expect(getAllByTestId("game-play-again-button")).toBeDefined();
			expect(Alert.alert).toHaveBeenCalledWith("Game Over", "Computer Wins!", [
				{ text: "OK" },
			]);
		});
	});
});

import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { Game } from "../Game";

jest.useRealTimers();

describe("Game Component", () => {
	beforeEach(() => {
		jest.spyOn(Alert, "alert");
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("renders correctly", () => {
		const mockResetToMenu = jest.fn();
		const { getByTestId } = render(
			<Game playerGoesFirst={true} resetToMenu={mockResetToMenu} />,
		);
		expect(getByTestId("game-title")).toBeTruthy();
		expect(getByTestId("game-player-indicator")).toBeTruthy();
		expect(getByTestId("game-player-symbol")).toBeTruthy();
		expect(getByTestId("game-cpu-indicator")).toBeTruthy();
		expect(getByTestId("game-cpu-symbol")).toBeTruthy();
	});

	test("calls resetToMenu when reset button is pressed", () => {
		const mockResetToMenu = jest.fn();
		const { getByTestId } = render(
			<Game playerGoesFirst={true} resetToMenu={mockResetToMenu} />,
		);

		const resetButton = getByTestId("game-reset-button");
		fireEvent.press(resetButton);

		expect(mockResetToMenu).toHaveBeenCalled();
	});

	test("completes a game and shows loss result", async () => {
		const mockResetToMenu = jest.fn();
		const { getByText, getAllByTestId } = render(
			<Game playerGoesFirst={true} resetToMenu={mockResetToMenu} />,
		);

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
			expect(cells[6].props.children).toBe("O");
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

	test("completes a game and shows tie result", async () => {
		const mockResetToMenu = jest.fn();
		const { getByText, getAllByTestId } = render(
			<Game playerGoesFirst={true} resetToMenu={mockResetToMenu} />,
		);

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
			fireEvent.press(cells[6]);
		});
		await waitFor(() => {
			expect(cells[3].props.children).toBe("O");
		});
		act(() => {
			fireEvent.press(cells[5]);
		});
		await waitFor(() => {
			expect(cells[7].props.children).toBe("O");
		});
		act(() => {
			fireEvent.press(cells[8]);
		});

		await waitFor(() => {
			expect(getByText("It's a Tie!")).toBeTruthy();
			expect(getByText("Great minds think alike!")).toBeTruthy();
			expect(getAllByTestId("game-play-again-button")).toBeDefined();
			expect(Alert.alert).toHaveBeenCalledWith("Game Over", "It's a Tie!", [
				{ text: "OK" },
			]);
		});
	});
});

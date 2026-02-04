import { fireEvent, render } from "@testing-library/react-native";
import { Menu } from "../Menu";

describe("Menu Component", () => {
	it("calls startNewGame with true when 'I'll go first (X)' is pressed", () => {
		const mockStartNewGame = jest.fn();
		const { getByTestId } = render(<Menu startNewGame={mockStartNewGame} />);
		const playerFirstButton = getByTestId("menu-player-first-button");

		fireEvent.press(playerFirstButton);

		expect(mockStartNewGame).toHaveBeenCalledWith(true);
	});

	it("calls startNewGame with false when 'Computer goes first (O)' is pressed", () => {
		const mockStartNewGame = jest.fn();
		const { getByTestId } = render(<Menu startNewGame={mockStartNewGame} />);
		const computerFirstButton = getByTestId("menu-computer-first-button");

		fireEvent.press(computerFirstButton);

		expect(mockStartNewGame).toHaveBeenCalledWith(false);
	});
});

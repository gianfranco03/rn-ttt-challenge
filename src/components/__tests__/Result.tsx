import { render } from "@testing-library/react-native";
import { Result } from "../Result";

describe("Result Component", () => {
	it("renders title and description correctly", () => {
		const title = "You Win!";
		const description = "Congratulations on your victory.";
		const { getByText } = render(
			<Result title={title} description={description} />,
		);

		expect(getByText(title)).toBeTruthy();
		expect(getByText(description)).toBeTruthy();
	});
});

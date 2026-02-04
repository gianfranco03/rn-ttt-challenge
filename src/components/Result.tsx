import { Text } from "react-native";

export const Result = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => (
	<>
		<Text className="text-primary text-2xl font-medium mt-3 mb-4">{title}</Text>
		<Text className="text-secondary text-lg font-medium mb-9">
			{description}
		</Text>
	</>
);

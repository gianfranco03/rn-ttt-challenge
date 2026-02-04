import { Pressable, Text, View } from "react-native";

export const Menu = ({
	startNewGame,
}: {
	startNewGame: (playerGoesFirst: boolean) => void;
}) => (
	<View className="items-center flex-1 px-10 pt-52">
		<Text className="text-primary text-5xl mb-12 font-bold">Tic Tac Toe</Text>
		<Text className="text-secondary text-2xl mb-12">Choose who goes first</Text>
		<Pressable
			testID="menu-player-first-button"
			className="w-full py-4 bg-button-primary rounded-lg justify-center items-center mb-6"
			onPress={() => startNewGame(true)}
		>
			<Text className="text-button-text-primary text-lg font-bold">{`I'll go first (X)`}</Text>
		</Pressable>
		<Pressable
			testID="menu-computer-first-button"
			className="w-full py-4 bg-button-tertiary rounded-lg justify-center items-center"
			onPress={() => startNewGame(false)}
		>
			<Text className="text-button-text-primary text-lg font-bold">
				Computer goes first (O)
			</Text>
		</Pressable>
		<Text className="text-secondary text-center text-base mt-20">
			Tic Tac Toe Challenge - React Native and Expo
		</Text>
		<Text className="text-secondary text-center text-sm mt-4">
			Developed by Gianfranco Hernandez
		</Text>
	</View>
);

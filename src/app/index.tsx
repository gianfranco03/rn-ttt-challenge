import { Game } from "@/components/Game";
import { Menu } from "@/components/Menu";
import type { TGameStep } from "@/types/game";
import { Activity, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TicTacToe = () => {
	const [gameState, setGameState] = useState<TGameStep>("menu");
	const [playerGoesFirst, setPlayerGoesFirst] = useState(true);

	const startNewGame = (playerGoesFirst: boolean) => {
		setPlayerGoesFirst(playerGoesFirst);
		setGameState("playing");
	};

	const resetToMenu = () => {
		setGameState("menu");
	};

	return (
		<View className=" flex-1 bg-background">
			<SafeAreaView style={{ flex: 1 }}>
				<Activity mode={gameState === "menu" ? "visible" : "hidden"}>
					<Menu startNewGame={startNewGame} />
				</Activity>
				<Activity mode={gameState === "playing" ? "visible" : "hidden"}>
					<Game playerGoesFirst={playerGoesFirst} resetToMenu={resetToMenu} />
				</Activity>
			</SafeAreaView>
		</View>
	);
};

export default TicTacToe;

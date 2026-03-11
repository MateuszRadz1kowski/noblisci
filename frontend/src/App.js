import { BrowserRouter, Routes, Route } from "react-router-dom";
import LeafletMap from "./leafletMap";
import NavigationTabs from "./components/navigation";
import NobleWinnersInfo from "./nobleWinnersInfo";
import Charts from "./charts";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<NobleWinnersInfo />} />
				<Route path="/map" element={<LeafletMap />} />
				<Route path="/charts" element={<Charts />} />
			</Routes>

			<NavigationTabs />
		</BrowserRouter>
	);
}

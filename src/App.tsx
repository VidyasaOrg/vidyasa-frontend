import { Route, Routes } from "react-router";
import SearchHomePage from "./pages/SearchHomePage";
import SearchResultPage from "./pages/SearchResultPage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<SearchHomePage />} />
			<Route path="/search" element={<SearchResultPage />} />
		</Routes>
	);
}

export default App;

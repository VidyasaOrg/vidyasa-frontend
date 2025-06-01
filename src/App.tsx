import { Route, Routes } from "react-router";
import SearchHomePage from "./pages/SearchHomePage";
import SearchResultPage from "./pages/SearchResultPage";
import BatchResultPage from "./pages/BatchResultPage";
import InverseDocTermPage from "./pages/InverseDocTermPage";
import InverseDocIdPage from "./pages/InverseDocIdPage";
import NavBar from "./components/NavBar";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
	return (
		<SearchProvider>
			<NavBar />
			<Routes>
				<Route path="/" element={<SearchHomePage />} />
				<Route path="/search" element={<SearchResultPage />} />
				<Route path="/batch-result" element={<BatchResultPage />} />
				<Route path="/inverse-doc-term" element={<InverseDocTermPage />} />
				<Route path="/inverse-doc-id" element={<InverseDocIdPage />} />
			</Routes>
		</SearchProvider>
	);
}

export default App;

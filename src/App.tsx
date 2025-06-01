import { Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import SearchHomePage from "./pages/SearchHomePage";
import SearchResultPage from "./pages/SearchResultPage";
import BatchResultPage from "./pages/BatchResultPage";
import InverseDocTermPage from "./pages/InverseDocTermPage";
import InverseDocIdPage from "./pages/InverseDocIdPage";
import NavBar from "./components/NavBar";
import PageTransition from "./components/PageTransition";
import { SearchProvider } from "./contexts/SearchContext";
import { BatchProvider } from "./contexts/BatchContext";

function App() {
	const location = useLocation();

	return (
		<SearchProvider>
			<BatchProvider>
				<NavBar />
				<AnimatePresence mode="wait">
					<Routes location={location} key={location.pathname}>
						<Route path="/" element={<PageTransition><SearchHomePage /></PageTransition>} />
						<Route path="/search" element={<PageTransition><SearchResultPage /></PageTransition>} />
						<Route path="/batch-result" element={<PageTransition><BatchResultPage /></PageTransition>} />
						<Route path="/inverse-doc-term" element={<PageTransition><InverseDocTermPage /></PageTransition>} />
						<Route path="/inverse-doc-id" element={<PageTransition><InverseDocIdPage /></PageTransition>} />
					</Routes>
				</AnimatePresence>
			</BatchProvider>
		</SearchProvider>
	);
}

export default App;

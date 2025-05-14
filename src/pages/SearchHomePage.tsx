import SearchBar from "@/components/SearchBar";

function SearchHomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-xl w-full space-y-4">
                <h1 className="text-3xl font-bold text-center">IR Search</h1>
                <SearchBar autoFocus redirectToSearch />
            </div>
        </div>
    );
}

export default SearchHomePage;
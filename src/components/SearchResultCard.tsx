interface Document {
    id: number;
    title: string;
    snippet: string;
}

function SearchResultCard({ doc }: { doc: Document }) {
    return (
        <li className="border p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg">{doc.title}</h2>
            <p className="text-sm text-gray-600">{doc.snippet}</p>
        </li>
    );
}

export default SearchResultCard;

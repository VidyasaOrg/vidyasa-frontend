export async function retrieveDocuments(query: string) {
  await new Promise((res) => setTimeout(res, Math.random() * 1000 + 250));
  const mockResults = Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, i) => ({
    id: i,
    title: `Dokumen "${query}" #${i + 1}`,
    snippet: `Dokumen relevan ${i + 1} yang mengandung "${query}".`,
  }));
  return mockResults;
}

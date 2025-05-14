export async function retrieveDocuments(query: string) {
  await new Promise((res) => setTimeout(res, 500)); // simulate latency
  const mockResults = Array.from({ length: Math.floor(Math.random() * 10) + 5 }, (_, i) => ({
    id: i,
    title: `Result for "${query}" #${i + 1}`,
    snippet: `This is a snippet for result ${i + 1}, containing "${query}".`,
  }));
  return mockResults;
}

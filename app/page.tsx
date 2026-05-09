import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-3xl font-bold">AlphaChess</h1>
      <Board />
    </main>
  );
}

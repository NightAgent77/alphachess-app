import Board from "@/components/Board";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function GamePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-xl font-semibold tracking-tight">Game {id}</h1>
      <Board />
    </div>
  );
}

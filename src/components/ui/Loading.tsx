import Navbar from "@/components/Navbar";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = "Carregando..." }: LoadingProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light gradient-bg text-slate-900 font-display">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-slate-500 font-medium">{text}</p>
        </div>
      </main>
    </div>
  );
}

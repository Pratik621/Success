export default function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center py-20 gap-3">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">Loading...</p>
    </div>
  );
}

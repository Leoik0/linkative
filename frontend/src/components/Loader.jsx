export default function Loader({ message = "Carregando..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-blue-700 font-medium">{message}</p>
      </div>
    </div>
  );
}

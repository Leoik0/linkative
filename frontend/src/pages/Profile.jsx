import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { slug } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdmin() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:4000/api/admin?slug=${encodeURIComponent(slug)}`
        );
        if (!res.ok) throw new Error("Perfil não encontrado");
        const data = await res.json();
        setAdmin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmin();
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!admin) return null;

  // Estilo de fundo igual ao Home
  const bgType = admin.bgType || "color";
  const bgValue = admin.bgValue || "#f5f5f5";
  const bgStyle =
    bgType === "color"
      ? { backgroundColor: bgValue }
      : {
          backgroundImage: `url(${bgValue})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={bgStyle}
    >
      <div className="max-w-2xl mx-auto px-4 py-8 ">
        <div className="text-center mb-8 relative w-full flex flex-col items-center justify-center">
          <div className="flex justify-center items-center mb-4 w-full">
            <img
              src={admin.imageUrl}
              alt="Foto de perfil"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg mx-auto"
            />
          </div>
          <div className="flex justify-center items-center gap-2 w-full">
            <h1
              className="text-2xl md:text-3xl font-bold mb-2 text-center mx-auto"
              style={{ color: admin.nomeColor || "#1e293b" }}
            >
              {admin.nome}
            </h1>
          </div>
          <div className="flex justify-center items-center gap-2 w-full">
            <p
              className="max-w-xs mx-auto px-4 text-center"
              style={{ color: admin.bioColor || "#64748b" }}
            >
              {admin.bio && admin.bio.length > 50
                ? admin.bio.slice(0, 50) + "..."
                : admin.bio}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center w-full space-y-3 px-4">
          {admin.links.map((link, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 w-full"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={async (e) => {
                  // Registrar clique antes de redirecionar
                  try {
                    await fetch("http://localhost:4000/api/analytics/click", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        linkId: link.id,
                        referrer: document.referrer || null,
                      }),
                    });
                  } catch (err) {
                    console.error("Erro ao registrar clique:", err);
                  }
                  // O navegador continuará com o redirecionamento normal
                }}
                className="flex items-center justify-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 font-medium text-center"
                style={{
                  color: link.textColor || admin.linkColor || "#2563eb",
                  background: link.color || "#fff",
                  minWidth: 220,
                  maxWidth: 320,
                  width: "100%",
                }}
              >
                <span className="text-xl">{link.icon}</span>
                {link.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

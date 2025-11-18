import React, { useState, useEffect } from "react";

export default function ProfileEditorModal({
  editMode,
  setEditMode,
  bgType,
  setBgType,
  bgValue,
  setBgValue,
  imageUrl,
  setImageUrl,
  nome,
  setNome,
  slug,
  setSlug,
  nomeColor,
  setNomeColor,
  bio,
  setBio,
  bioColor,
  setBioColor,
  links,
  setLinks,
  linkColor,
  setLinkColor,
  handleSave,
  adminId,
}) {
  const [slugStatus, setSlugStatus] = useState(null); // null, "checking", "available", "unavailable", "invalid"
  const [slugError, setSlugError] = useState("");

  // Validação e verificação de slug em tempo real
  useEffect(() => {
    if (!slug || slug.trim() === "") {
      setSlugStatus(null);
      setSlugError("");
      return;
    }

    // Validação de formato (apenas letras, números, hífen)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      setSlugStatus("invalid");
      setSlugError("Use apenas letras minúsculas, números e hífen");
      return;
    }

    // Debounce: aguardar 500ms após a última digitação
    const timeoutId = setTimeout(async () => {
      setSlugStatus("checking");
      try {
        const url = adminId
          ? `http://localhost:4000/api/admin/check-slug/${slug}?currentAdminId=${adminId}`
          : `http://localhost:4000/api/admin/check-slug/${slug}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.available) {
          setSlugStatus("available");
          setSlugError("");
        } else {
          setSlugStatus("unavailable");
          setSlugError("Slug já está em uso");
        }
      } catch (err) {
        setSlugStatus("invalid");
        setSlugError("Erro ao verificar slug");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [slug, adminId]);

  if (!editMode) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl p-4 md:p-8 animate-fadeIn border border-blue-100 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50"
        style={{ maxHeight: "90vh" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold transition"
          onClick={() => setEditMode(false)}
          title="Fechar"
        >
          &times;
        </button>
        <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center tracking-tight">
          Editor de Perfil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full min-w-0">
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
            <label className="block mb-2 text-sm font-semibold text-blue-700">
              Fundo
            </label>
            <div className="flex gap-2 mb-2">
              <button
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  bgType === "color" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setBgType("color")}
              >
                Cor
              </button>
              <button
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  bgType === "image" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setBgType("image")}
              >
                Imagem
              </button>
            </div>
            {bgType === "color" ? (
              <div className="flex items-center gap-3 mb-2">
                {/* Custom color picker para BG */}
                <div className="relative">
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full border-2 border-blue-300 flex items-center justify-center cursor-pointer shadow focus:ring-2 focus:ring-blue-400 transition"
                    style={{ background: bgValue || "#1976d2" }}
                    onClick={() => {
                      const picker = document.getElementById("color-picker-bg");
                      if (picker) picker.click();
                    }}
                    aria-label="Escolher cor de fundo"
                  />
                  <input
                    id="color-picker-bg"
                    type="color"
                    className="absolute left-0 top-0 w-10 h-10 opacity-0 cursor-pointer"
                    value={bgValue}
                    onChange={(e) => setBgValue(e.target.value)}
                    tabIndex={-1}
                  />
                </div>
                <span className="text-sm text-blue-700 font-semibold">
                  {bgValue}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer bg-blue-100 px-3 py-2 rounded-lg shadow hover:bg-blue-200 transition">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.828M7 7h.01M7 7a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V7z"
                    />
                  </svg>
                  <span className="text-blue-700 font-semibold">
                    Escolher imagem
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setBgValue(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <input
                  type="text"
                  className="w-full p-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  value={bgValue}
                  onChange={(e) => setBgValue(e.target.value)}
                  placeholder="URL da imagem de fundo"
                />
              </div>
            )}
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
            <label className="block mb-2 text-sm font-semibold text-blue-700">
              Imagem de Perfil
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-blue-100 px-3 py-2 rounded-lg shadow hover:bg-blue-200 transition mb-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 9.828M7 7h.01M7 7a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V7z"
                />
              </svg>
              <span className="text-blue-700 font-semibold">
                Escolher imagem
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("image", file);
                    try {
                      const res = await fetch(
                        "http://localhost:4000/api/admin/upload",
                        {
                          method: "POST",
                          body: formData,
                        }
                      );
                      const data = await res.json();
                      if (data.imageUrl) {
                        setImageUrl("http://localhost:4000" + data.imageUrl);
                      }
                    } catch (err) {
                      alert("Erro ao enviar imagem");
                    }
                  }
                }}
              />
            </label>
            <input
              type="text"
              className="w-full p-2 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL da imagem de perfil"
            />
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
            <label className="block mb-2 text-sm font-semibold text-blue-700">
              Nome
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-2"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label className="block mb-2 text-sm font-semibold text-blue-700">
              Slug da URL (ex: nomedosite.com/<b>slug</b>)
            </label>
            <div className="relative">
              <input
                type="text"
                className={`w-full p-2 border-2 rounded-lg mb-1 transition ${
                  slugStatus === "available"
                    ? "border-green-400 focus:border-green-500"
                    : slugStatus === "unavailable" || slugStatus === "invalid"
                    ? "border-red-400 focus:border-red-500"
                    : slugStatus === "checking"
                    ? "border-yellow-400"
                    : "border-blue-200 focus:border-blue-400"
                }`}
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                  )
                }
                placeholder="Digite o slug desejado"
                maxLength={32}
              />
              {slugStatus === "checking" && (
                <span className="text-xs text-yellow-600 flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verificando...
                </span>
              )}
              {slugStatus === "available" && (
                <span className="text-xs text-green-600 font-semibold">
                  ✓ Slug disponível
                </span>
              )}
              {slugStatus === "unavailable" && (
                <span className="text-xs text-red-600 font-semibold">
                  ✗ {slugError}
                </span>
              )}
              {slugStatus === "invalid" && (
                <span className="text-xs text-red-600 font-semibold">
                  ✗ {slugError}
                </span>
              )}
            </div>
            <label className="block mb-2 text-sm font-semibold text-blue-700">
              Cor do nome
            </label>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border-2 border-blue-300 flex items-center justify-center cursor-pointer shadow focus:ring-2 focus:ring-blue-400 transition"
                  style={{ background: nomeColor || "#1976d2" }}
                  onClick={() => {
                    const picker = document.getElementById("color-picker-nome");
                    if (picker) picker.click();
                  }}
                  aria-label="Escolher cor do nome"
                />
                <input
                  id="color-picker-nome"
                  type="color"
                  className="absolute left-0 top-0 w-10 h-10 opacity-0 cursor-pointer"
                  value={nomeColor}
                  onChange={(e) => setNomeColor(e.target.value)}
                  tabIndex={-1}
                />
              </div>
              <span className="text-sm text-blue-700 font-semibold">
                {nomeColor}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
            <label className="block mb-2 text-sm font-semibold text-blue-700">
              Bio (máx. 50 caracteres)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-2"
              value={bio}
              maxLength={50}
              onChange={(e) => setBio(e.target.value)}
            />
            <label className="block mb-2 text-sm font-semibold text-blue-700">
              Cor da bio
            </label>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full border-2 border-blue-300 flex items-center justify-center cursor-pointer shadow focus:ring-2 focus:ring-blue-400 transition"
                  style={{ background: bioColor || "#1976d2" }}
                  onClick={() => {
                    const picker = document.getElementById("color-picker-bio");
                    if (picker) picker.click();
                  }}
                  aria-label="Escolher cor da bio"
                />
                <input
                  id="color-picker-bio"
                  type="color"
                  className="absolute left-0 top-0 w-10 h-10 opacity-0 cursor-pointer"
                  value={bioColor}
                  onChange={(e) => setBioColor(e.target.value)}
                  tabIndex={-1}
                />
              </div>
              <span className="text-sm text-blue-700 font-semibold">
                {bioColor}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm col-span-1 md:col-span-2">
            <label className="block mb-2 text-sm font-semibold text-blue-700">
              Links
            </label>
            <span className="block mb-4 text-xs text-blue-500 font-medium">
              Adicione seus links abaixo
            </span>
            {links.map((link, idx) => (
              <div key={idx} className="flex flex-col gap-2 mb-8 w-full">
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg"
                    value={link.title}
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[idx] = {
                        ...newLinks[idx],
                        title: e.target.value,
                      };
                      setLinks(newLinks);
                    }}
                    placeholder="Título"
                  />
                  {/* Bola de cor de fundo do link */}
                  <div className="relative">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center cursor-pointer shadow focus:ring-2 focus:ring-blue-400 transition"
                      style={{ background: link.color || "#1976d2" }}
                      onClick={() => {
                        const picker = document.getElementById(
                          `color-picker-link-bg-${idx}`
                        );
                        if (picker) picker.click();
                      }}
                      aria-label="Escolher cor de fundo do link"
                    />
                    <input
                      id={`color-picker-link-bg-${idx}`}
                      type="color"
                      className="absolute left-0 top-0 w-8 h-8 opacity-0 cursor-pointer"
                      value={link.color || "#1976d2"}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[idx] = {
                          ...newLinks[idx],
                          color: e.target.value,
                        };
                        setLinks(newLinks);
                      }}
                      tabIndex={-1}
                    />
                  </div>
                  {/* Input para cor do texto do link */}
                  <div className="relative ml-2">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center cursor-pointer shadow focus:ring-2 focus:ring-blue-400 transition"
                      style={{ background: link.textColor || linkColor }}
                      onClick={() => {
                        const picker = document.getElementById(
                          `color-picker-link-text-${idx}`
                        );
                        if (picker) picker.click();
                      }}
                      aria-label="Escolher cor do texto do link"
                    />
                    <input
                      id={`color-picker-link-text-${idx}`}
                      type="color"
                      className="absolute left-0 top-0 w-8 h-8 opacity-0 cursor-pointer"
                      value={link.textColor || linkColor}
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[idx] = {
                          ...newLinks[idx],
                          textColor: e.target.value,
                        };
                        setLinks(newLinks);
                      }}
                      tabIndex={-1}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                      setLinks(newLinks);
                    }}
                    placeholder="URL"
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded-full bg-red-100 hover:bg-red-200 transition"
                    onClick={() => {
                      const newLinks = links.filter((_, i) => i !== idx);
                      setLinks(newLinks);
                    }}
                    title="Excluir link"
                    disabled={links.length === 1}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={`mt-2 px-4 py-2 rounded-full bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition ${
                links.length >= 10 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                if (links.length < 10) {
                  setLinks([
                    ...links,
                    { title: "", url: "", color: "#1976d2" },
                  ]);
                }
              }}
              disabled={links.length >= 10}
            >
              + Adicionar link
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-10">
          <button
            className="px-6 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 font-bold text-gray-700 shadow transition"
            onClick={() => setEditMode(false)}
          >
            Cancelar
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-bold shadow-lg transition ${
              slugStatus === "unavailable" ||
              slugStatus === "invalid" ||
              slugStatus === "checking"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            onClick={handleSave}
            disabled={
              slugStatus === "unavailable" ||
              slugStatus === "invalid" ||
              slugStatus === "checking"
            }
            title={
              slugStatus === "unavailable" || slugStatus === "invalid"
                ? "Corrija o slug antes de salvar"
                : slugStatus === "checking"
                ? "Aguarde a verificação do slug"
                : ""
            }
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ProfileEditorModal from "../components/ProfileEditorModal";
import Loader from "../components/Loader";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [bio, setBio] = useState(
    "Desenvolvedor apaixonado por tecnologia e inovação ✨"
  );
  const [imageUrl, setImageUrl] = useState(
    user?.imageUrl || "https://via.placeholder.com/150"
  );
  const [nome, setNome] = useState(user?.fullName || "Seu Nome");
  const [links, setLinks] = useState([
    { title: "GitHub", url: "https://github.com/seu-usuario", icon: "🐱" },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/in/seu-perfil",
      icon: "💼",
    },
    { title: "Twitter", url: "https://twitter.com/seu-usuario", icon: "🐦" },
    { title: "Portfolio", url: "https://seu-portfolio.com", icon: "💻" },
  ]);
  const [slug, setSlug] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [hasAnalytics, setHasAnalytics] = useState(false);
  const [bgType, setBgType] = useState("color");
  const [bgValue, setBgValue] = useState("#f5f5f5");
  const [nomeColor, setNomeColor] = useState("#1e293b");
  const [bioColor, setBioColor] = useState("#64748b");
  const [linkColor, setLinkColor] = useState("#2563eb");

  const userEmail = user?.email || user?.primaryEmailAddress?.emailAddress;
  useEffect(() => {
    // Buscar dados do admin ao carregar a página; criar se não existir
    async function fetchOrCreateAdmin() {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:4000/api/admin?email=" + userEmail
        );
        if (res.ok) {
          const data = await res.json();
          setAdminId(data.id);
          setNome(data.nome);
          setBio(data.bio || "");
          setImageUrl(data.imageUrl || "");
          setBgType(data.bgType || "color");
          setBgValue(data.bgValue || "#f5f5f5");
          setNomeColor(data.nomeColor || "#1e293b");
          setBioColor(data.bioColor || "#64748b");
          setLinkColor(data.linkColor || "#2563eb");
          setLinks(data.links || []);
          setSlug(data.slug || "");
          setHasAnalytics(!!data.hasAnalytics);
          // Dono automático: email do Clerk igual ao do Admin OU flag do banco
          const sameEmail = !!(
            data?.email &&
            userEmail &&
            data.email.toLowerCase() === userEmail.toLowerCase()
          );
          setIsOwner(sameEmail || !!data.isOwner);
        } else if (res.status === 404) {
          // Admin não existe, criar automaticamente
          const createRes = await fetch("http://localhost:4000/api/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              nome: user?.fullName || "Novo Usuário",
              bio: "Olá! Bem-vindo ao meu perfil.",
              imageUrl: user?.imageUrl || "",
            }),
          });
          if (createRes.ok) {
            const newAdmin = await createRes.json();
            setAdminId(newAdmin.id);
            setNome(newAdmin.nome);
            setBio(newAdmin.bio || "");
            setImageUrl(newAdmin.imageUrl || "");
            setIsOwner(!!newAdmin.isOwner);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar/criar admin:", err);
      } finally {
        // pequeno delay para deixar o efeito mais suave
        setTimeout(() => setLoading(false), 250);
      }
    }
    if (userEmail) {
      fetchOrCreateAdmin();
    } else {
      // Espera o Clerk carregar o user
      setLoading(true);
    }
  }, [userEmail, user]);

  const handleSave = async () => {
    if (!isOwner) {
      alert("Você não tem permissão para editar este perfil.");
      return;
    }
    setEditMode(false);
    // Salvar alterações no backend
    const userEmail = user?.email || user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      alert("Email do usuário não encontrado. Não é possível salvar.");
      return;
    }
    const body = {
      email: userEmail,
      nome,
      slug,
      bio,
      imageUrl,
      bgType,
      bgValue,
      nomeColor,
      bioColor,
      linkColor,
      links,
    };
    console.log("Email enviado:", userEmail);
    console.log("Body enviado no PUT:", body);
    try {
      await fetch("http://localhost:4000/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // Não redireciona mais, apenas atualiza o estado
    } catch (err) {
      // erro ao salvar
    }
  };

  if (loading) return <Loader message="Carregando seu perfil..." />;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={
        bgType === "color"
          ? { backgroundColor: bgValue }
          : {
              backgroundImage: `url(${bgValue})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
      }
    >
      <div className="max-w-2xl mx-auto px-4 py-8 ">
        <div className="text-center mb-8 relative w-full flex flex-col items-center justify-center">
          <div className="flex justify-center items-center mb-4 w-full">
            <img
              src={imageUrl}
              alt="Foto de perfil"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg mx-auto"
            />
          </div>
          <div className="flex justify-center items-center gap-2 w-full">
            <h1
              className="text-2xl md:text-3xl font-bold mb-2 text-center mx-auto"
              style={{ color: nomeColor }}
            >
              {nome}
            </h1>
          </div>
          <div className="flex justify-center items-center gap-2 w-full">
            <p
              className="max-w-xs mx-auto px-4 text-center"
              style={{ color: bioColor }}
            >
              {bio.length > 50 ? bio.slice(0, 50) + "..." : bio}
            </p>
          </div>
          {/* Link público do perfil - só para o dono */}
          {slug && isOwner && (
            <div className="mt-4">
              <a
                href={`/perfil/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 font-bold transition"
              >
                Ver perfil público
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center w-full space-y-3 px-4">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 w-full"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 font-medium text-center"
                style={{
                  color: link.textColor || linkColor,
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
      <ProfileEditorModal
        editMode={editMode}
        setEditMode={setEditMode}
        bgType={bgType}
        setBgType={setBgType}
        bgValue={bgValue}
        setBgValue={setBgValue}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        nome={nome}
        setNome={setNome}
        slug={slug}
        setSlug={setSlug}
        nomeColor={nomeColor}
        setNomeColor={setNomeColor}
        bio={bio}
        setBio={setBio}
        bioColor={bioColor}
        setBioColor={setBioColor}
        links={links}
        setLinks={setLinks}
        linkColor={linkColor}
        setLinkColor={setLinkColor}
        handleSave={handleSave}
        adminId={adminId}
      />
      {/* Ícones fixos apenas para o dono */}
      {isOwner && (
        <>
          <button
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            onClick={() => setEditMode(true)}
            title="Editar perfil"
          >
            <FaRegEdit className="w-7 h-7" />
          </button>
          {hasAnalytics && (
            <button
              className="fixed bottom-24 right-6 z-50 p-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              onClick={() => navigate("/dashboard")}
              title="Ver Dashboard"
            >
              📊
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

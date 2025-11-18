// Hook customizado para gerenciar dados do admin
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import ApiService from "../services/apiService";
import { DEFAULT_PROFILE } from "../config/constants";

export const useAdmin = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const userEmail = user?.email || user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    async function fetchOrCreateAdmin() {
      if (!userEmail) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);

        // Tenta buscar admin existente
        try {
          const data = await ApiService.getAdminByEmail(userEmail);
          setAdmin(data);

          // Determina ownership
          const sameEmail =
            data?.email &&
            userEmail &&
            data.email.toLowerCase() === userEmail.toLowerCase();
          setIsOwner(sameEmail || !!data.isOwner);
        } catch (error) {
          // Se 404, cria novo admin
          if (error.message.includes("404")) {
            const newAdmin = await ApiService.createAdmin({
              email: userEmail,
              nome: user?.fullName || "Novo Usuário",
              bio: "Olá! Bem-vindo ao meu perfil.",
              imageUrl: user?.imageUrl || "",
            });
            setAdmin(newAdmin);
            setIsOwner(!!newAdmin.isOwner);
          } else {
            throw error;
          }
        }
      } catch (err) {
        console.error("Erro ao buscar/criar admin:", err);
      } finally {
        setTimeout(() => setLoading(false), 250);
      }
    }

    fetchOrCreateAdmin();
  }, [userEmail, user]);

  const updateAdmin = async (adminData) => {
    try {
      const updated = await ApiService.updateAdmin(adminData);
      setAdmin(updated);
      return updated;
    } catch (error) {
      console.error("Erro ao atualizar admin:", error);
      throw error;
    }
  };

  return {
    admin,
    loading,
    isOwner,
    updateAdmin,
  };
};

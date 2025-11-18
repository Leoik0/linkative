import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <Loader message="Carregando sua sessão..." />;

  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

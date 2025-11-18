import { SignIn, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isSignedIn } = useUser();

  // Se o usuário já estiver autenticado, redireciona para a home
  if (isSignedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignIn />
    </div>
  );
};

export default Login;

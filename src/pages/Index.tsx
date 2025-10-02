
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1F2C]">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-6 text-white">Platform Analytics Dashboard</h1>
        <p className="text-xl text-gray-300 mb-8">
          Monitor platform growth, user engagement, and class performance metrics with our comprehensive admin dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/admin/dashboard">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

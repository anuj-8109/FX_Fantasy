import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/superadmin/superadmindashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-sm w-full p-6 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground">
          No account?{" "}
          <Link className="underline" to="/register">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;

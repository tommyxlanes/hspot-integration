// components/LoginForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginForm({
  onSubmit,
}: {
  onSubmit: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(email, password); // 🔌 your login logic here
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto space-y-6 text-white"
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-gray-100 text-black hover:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

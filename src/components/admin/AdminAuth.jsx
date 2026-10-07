import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Button from "../common/Button";

export default function AdminAuth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await onLogin(email, password);

    if (!result?.success) {
      setError(result?.error || "Invalid email or password.");
    }

    setLoading(false);
  }

  return (
    <div className="grid-paper min-h-[70vh] px-5 py-16 lg:px-8">
      <div className="mx-auto flex w-full max-w-xl items-center">
        <form onSubmit={submit} className="brutal-border brutal-shadow w-full bg-paper p-7 sm:p-10">
          <div className="mb-8 inline-flex items-center gap-3 border-[3px] border-ink bg-orange px-4 py-2">
            <LockKeyhole size={18} />
            <span className="mono text-[10px] font-bold uppercase tracking-[0.15em]">RESTRICTED AREA</span>
          </div>

          <h1 className="display text-7xl leading-[.82] sm:text-8xl">ADMIN<br />ACCESS</h1>

          <p className="mono mt-6 text-xs uppercase leading-5 text-black/60">
            Sign in with your Paper Vault administrator account.
          </p>

          <div className="mt-8">
            <label className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.15em]">EMAIL</label>
            <input
              className="focus-ring brutal-border w-full bg-white px-4 py-4 font-bold outline-none"
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setError(""); }}
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="mt-5">
            <label className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.15em]">PASSWORD</label>
            <div className="relative">
              <input
                className="focus-ring brutal-border w-full bg-white px-4 py-4 pr-14 font-bold outline-none"
                type={show ? "text" : "password"}
                value={password}
                onChange={(event) => { setPassword(event.target.value); setError(""); }}
                autoComplete="current-password"
                required
              />
              <button type="button" onClick={() => setShow((value) => !value)} className="absolute right-0 top-0 grid h-full w-12 place-items-center" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <div className="mono mt-3 bg-orange px-3 py-2 text-[10px] font-bold uppercase">{error}</div>}
          </div>

          <Button type="submit" disabled={loading} className="mt-6 w-full">
            {loading ? "Signing in..." : "Enter admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}

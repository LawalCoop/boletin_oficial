import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import {
  ADMIN_SESSION_COOKIE,
  normalizeAdminRedirectPath,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const next = normalizeAdminRedirectPath(params.next);
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (await verifyAdminSessionToken(token)) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#ffffff_45%,#f8f8f8_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border bg-bg shadow-[0_20px_80px_rgba(17,17,17,0.08)] md:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden min-h-[560px] overflow-hidden bg-[radial-gradient(circle_at_top_left,#0066CC18_0%,transparent_40%),linear-gradient(140deg,#0f1720_0%,#19324f_52%,#2d6aa1_100%)] px-10 py-12 text-white md:flex md:flex-col md:justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.04)_100%)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
                <ShieldCheck className="h-3.5 w-3.5" />
                Acceso restringido
              </span>
              <h1 className="mt-6 max-w-sm font-[family-name:var(--font-lora)] text-4xl font-medium leading-tight">
                Panel operativo del Boletín Oficial
              </h1>
            </div>
          </section>

          <section className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-10">
            <Link
              href="/"
              className="mb-10 text-sm font-medium text-text-muted transition hover:text-text-primary"
            >
              Volver al portal
            </Link>

            <div className="mb-8 space-y-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-lora)] text-3xl font-medium text-text-primary">
                  Ingreso admin
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                  Ingresá tus credenciales para acceder al panel de
                  procesamiento y a los endpoints administrativos.
                </p>
              </div>
            </div>

            <AdminLoginForm next={next} />
          </section>
        </div>
      </div>
    </main>
  );
}

import { LogOut, ShieldCheck } from "lucide-react";

import SectionLabel from "../components/common/SectionLabel";
import UploadForm from "../components/admin/UploadForm";
import UploadList from "../components/admin/UploadList";
import { useAdmin } from "../hooks/useAdmin";

export default function Admin() {
  const {
    authenticated,
    loading,
    logout,
  } = useAdmin();

  if (loading) {
    return (
      <section className="min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="mono border-t-[3px] border-ink py-8 text-xs uppercase">
            Checking admin session...
          </div>
        </div>
      </section>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <SectionLabel number="06">
              RESTRICTED · ADMIN
            </SectionLabel>

            <h1 className="display mt-5 text-[clamp(5rem,12vw,11rem)] leading-[.78]">
              MANAGE
              <br />

              <span
                className="text-transparent"
                style={{
                  WebkitTextStroke: "3px #090909",
                }}
              >
                ARCHIVE.
              </span>
            </h1>
          </div>

          <button
            onClick={logout}
            className="focus-ring inline-flex items-center gap-2 font-bold uppercase hover:text-orange"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {/* UPLOAD FORM */}
        <div className="mt-16">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck size={22} />

            <div className="mono text-[10px] font-bold uppercase tracking-[0.15em]">
              UPLOAD NEW PAPER
            </div>
          </div>

          <UploadForm />
        </div>

        {/* RECENT UPLOADS */}
        <div className="mt-16">
          <div className="mb-4">
            <div className="mono text-[10px] font-bold uppercase tracking-[0.15em]">
              RECENT UPLOADS
            </div>

            <div className="display mt-2 text-4xl">
              QUEUE
            </div>
          </div>

          <UploadList />
        </div>

      </div>
    </section>
  );
}
import { useEffect, useState } from "react";
import { Clock3, FileText } from "lucide-react";
import { formatDate } from "../../utils/format";
import { supabase } from "../../lib/supabase";

export default function UploadList() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPapers() {
      try {
        setLoading(true);
        setError("");

        const { data, error: papersError } = await supabase
          .from("papers")
          .select(`
            id,
            year,
            exam_type,
            file_name,
            file_size_bytes,
            uploaded_at,
            subjects (
              code,
              name
            )
          `)
          .order("created_at", { ascending: false })
          .limit(10);

        if (papersError) throw papersError;
        setPapers(data || []);
      } catch (err) {
        console.error("Error loading recent uploads:", err);
        setError(err.message || "Unable to load recent uploads.");
      } finally {
        setLoading(false);
      }
    }

    loadPapers();
  }, []);

  if (loading) return <div className="brutal-border bg-neutral-200 p-8"><div className="mono text-xs uppercase">Loading recent uploads...</div></div>;

  if (error) return <div className="brutal-border bg-orange p-8"><div className="mono text-xs font-bold uppercase">{error}</div></div>;

  if (!papers.length) return <div className="brutal-border bg-neutral-200 p-8"><div className="mono text-xs uppercase">No uploads yet.</div></div>;

  return (
    <div className="border-t-[3px] border-ink">
      {papers.map((paper) => {
        const fileSizeMB = paper.file_size_bytes
          ? (paper.file_size_bytes / (1024 * 1024)).toFixed(1) + " MB"
          : "-";

        return (
          <div key={paper.id} className="grid gap-4 border-b-[3px] border-ink py-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center border-2 border-ink bg-paper"><FileText size={16} /></span>
                <div>
                  <div className="display text-3xl">{paper.subjects?.name || "Unknown subject"}</div>
                  <div className="mono mt-1 text-[9px] uppercase tracking-wider">
                    {paper.subjects?.code || "-"} · {paper.year} · {paper.exam_type}
                  </div>
                </div>
              </div>
              <div className="mono mt-3 text-[9px] uppercase tracking-wider text-black/55">
                {paper.file_name} · {fileSizeMB}
              </div>
            </div>

            <div className="mono flex items-center gap-2 text-[9px] uppercase">
              <Clock3 size={14} />
              {formatDate(paper.uploaded_at)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

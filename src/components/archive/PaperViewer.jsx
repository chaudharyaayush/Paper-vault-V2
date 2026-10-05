import { Download, ExternalLink, X } from "lucide-react";

export default function PaperViewer({
  paper,
  subjectName,
  onClose,
}) {
  if (!paper) return null;

  const fileUrl = paper.fileUrl || null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col border-[4px] border-ink bg-paper shadow-[10px_10px_0_#c9ff00]">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 border-b-[3px] border-ink bg-acid p-4">
          <div>
            <div className="mono text-[9px] font-bold uppercase tracking-[0.15em]">
              PDF PREVIEW
            </div>

            <div className="display text-3xl">
              {subjectName} · {paper.year}
            </div>
          </div>

          <button
            onClick={onClose}
            className="focus-ring grid h-11 w-11 place-items-center border-[3px] border-ink bg-paper hover:bg-orange"
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        {/* PDF */}
        <div className="min-h-[55vh] flex-1 bg-neutral-200 p-3">
          {fileUrl ? (
            <iframe
              title={`Preview ${paper.file_name}`}
              src={fileUrl}
              className="h-[65vh] w-full border-[3px] border-ink bg-white"
            />
          ) : (
            <div className="grid h-[65vh] place-items-center border-[3px] border-ink bg-white p-8 text-center">
              <div>
                <div className="display text-6xl">
                  PDF
                  <br />
                  PREVIEW
                </div>

                <p className="mono mt-5 max-w-md text-xs uppercase leading-5">
                  PDF URL could not be generated.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col justify-between gap-3 border-t-[3px] border-ink p-4 sm:flex-row">
          <div className="mono text-[10px] uppercase">
            {paper.file_name || "Paper"} ·{" "}
            {paper.file_size_bytes
              ? `${(
                  paper.file_size_bytes /
                  (1024 * 1024)
                ).toFixed(1)} MB`
              : "-"}
          </div>

          <div className="flex gap-2">

            {/* OPEN */}
            <a
              href={fileUrl || undefined}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => {
                if (!fileUrl) {
                  event.preventDefault();
                }
              }}
              className={`inline-flex items-center gap-2 border-[3px] border-ink px-4 py-2 text-xs font-bold uppercase ${
                fileUrl
                  ? "bg-green hover:bg-acid"
                  : "cursor-not-allowed bg-neutral-300"
              }`}
            >
              OPEN
              <ExternalLink size={15} />
            </a>

            {/* DOWNLOAD */}
            <a
              href={fileUrl || undefined}
              download={paper.file_name}
              onClick={(event) => {
                if (!fileUrl) {
                  event.preventDefault();
                }
              }}
              className={`inline-flex items-center gap-2 border-[3px] border-ink px-4 py-2 text-xs font-bold uppercase ${
                fileUrl
                  ? "bg-orange hover:bg-acid"
                  : "cursor-not-allowed bg-neutral-300"
              }`}
            >
              DOWNLOAD
              <Download size={15} />
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}
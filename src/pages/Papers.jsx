import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Search } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Breadcrumbs from "../components/navigation/Breadcrumbs";
import SectionLabel from "../components/common/SectionLabel";
import PaperRow from "../components/archive/PaperRow";
import PaperViewer from "../components/archive/PaperViewer";
import EmptyState from "../components/common/EmptyState";

import {
  getCourses,
  getSemesters,
  getSubjects,
  getPapers,
  getPaperFileUrl,
} from "../lib/paperVaultApi";

export default function Papers() {
  const {
    departmentSlug,
    courseSlug,
    semesterNumber,
    subjectSlug,
  } = useParams();

  const [subject, setSubject] = useState(null);
  const [papers, setPapers] = useState([]);

  const [selectedPaper, setSelectedPaper] =
    useState(null);

  const [yearFilter, setYearFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadPaperData() {
      try {
        setLoading(true);
        setError("");

        const [
          coursesData,
          semestersData,
          subjectsData,
          papersData,
        ] = await Promise.all([
          getCourses(),
          getSemesters(),
          getSubjects(),
          getPapers(),
        ]);

        const normalizedSubjectSlug =
          String(subjectSlug || "")
            .trim()
            .toLowerCase();

        const matchedSubject =
          subjectsData.find((item) => {
            const databaseSlug =
              String(item.slug || "")
                .trim()
                .toLowerCase();

            return (
              databaseSlug ===
              normalizedSubjectSlug
            );
          });

        if (!matchedSubject) {
          throw new Error(
            `Subject not found. URL slug: ${subjectSlug}`
          );
        }

        const subjectPapers =
          papersData.filter(
            (paper) =>
              String(paper.subject_id) ===
              String(matchedSubject.id)
          );

        setSubject(matchedSubject);
        setPapers(subjectPapers);
      } catch (err) {
        console.error(
          "Error loading papers:",
          err
        );

        setError(
          err.message ||
            "Unable to load papers."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPaperData();
  }, [subjectSlug]);

  const subjectPapers = useMemo(() => {
    if (yearFilter === "ALL") {
      return papers;
    }

    return papers.filter(
      (paper) =>
        String(paper.year) ===
        String(yearFilter)
    );
  }, [papers, yearFilter]);

  const years = [
    ...new Set(
      papers.map((paper) => paper.year)
    ),
  ].sort((a, b) => b - a);

  async function handlePreview(paper) {
    try {
      const fileUrl =
        await getPaperFileUrl(
          paper.storage_path
        );

      if (!fileUrl) {
        throw new Error(
          "Could not create PDF URL."
        );
      }

      setSelectedPaper({
        ...paper,
        fileUrl,
      });
    } catch (err) {
      console.error(
        "Error opening paper:",
        err
      );

      alert(
        "Unable to open this PDF."
      );
    }
  }

  async function handleDownload(paper) {
    try {
      const fileUrl =
        await getPaperFileUrl(
          paper.storage_path
        );

      if (!fileUrl) {
        throw new Error(
          "Could not create PDF URL."
        );
      }

      const link =
        document.createElement("a");

      link.href = fileUrl;
      link.download =
        paper.file_name ||
        "paper.pdf";

      link.target = "_blank";
      link.rel = "noreferrer";

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(
        "Error downloading paper:",
        err
      );

      alert(
        "Unable to download this PDF."
      );
    }
  }

  if (loading) {
    return (
      <section className="min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="mono border-t-[3px] border-ink py-8 text-xs uppercase">
            Loading papers...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="mono border-t-[3px] border-ink py-8 text-xs uppercase text-red-600">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!subject) {
    return (
      <div className="p-10">
        <EmptyState title="Subject not found" />
      </div>
    );
  }

  return (
    <>
      <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">

          <Breadcrumbs
            items={[
              {
                label: departmentSlug,
                to: `/${departmentSlug}`,
              },
              {
                label: courseSlug,
                to: `/${departmentSlug}/${courseSlug}`,
              },
              {
                label: `SEM ${semesterNumber}`,
                to: `/${departmentSlug}/${courseSlug}/${semesterNumber}`,
              },
              {
                label: subject.code,
              },
            ]}
          />

          <div className="mt-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <SectionLabel number="05">
                QUESTION PAPER ARCHIVE
              </SectionLabel>

              <div className="mono mt-5 text-xs font-bold uppercase tracking-[0.14em]">
                {subject.code}
              </div>

              <h1 className="display mt-2 max-w-5xl text-[clamp(4rem,9vw,9rem)] leading-[.8]">
                {subject.name}
              </h1>
            </div>

            <Link
              to={`/${departmentSlug}/${courseSlug}/${semesterNumber}`}
              className="focus-ring inline-flex items-center gap-2 font-bold uppercase hover:underline"
            >
              <ArrowLeft size={18} />
              All subjects
            </Link>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-5 border-y-[3px] border-ink py-4 sm:flex-row sm:items-center">
            <div className="mono text-[10px] font-bold uppercase tracking-[0.14em]">
              {subjectPapers.length} PAPERS ·{" "}
              {years.length} YEARS AVAILABLE
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setYearFilter("ALL")
                }
                className={`border-[3px] border-ink px-3 py-2 text-[10px] font-bold uppercase ${
                  yearFilter === "ALL"
                    ? "bg-acid"
                    : "bg-paper hover:bg-acid"
                }`}
              >
                ALL YEARS
              </button>

              {years.map((year) => (
                <button
                  key={year}
                  onClick={() =>
                    setYearFilter(
                      String(year)
                    )
                  }
                  className={`border-[3px] border-ink px-3 py-2 text-[10px] font-bold uppercase ${
                    yearFilter ===
                    String(year)
                      ? "bg-green"
                      : "bg-paper hover:bg-acid"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 hidden border-b-[3px] border-ink pb-3 sm:grid sm:grid-cols-[100px_1fr_100px_110px_150px] mono text-[9px] font-bold uppercase tracking-[0.14em]">
            <span>YEAR</span>
            <span>PAPER</span>
            <span className="text-right">
              SIZE
            </span>
            <span className="text-right">
              UPLOADED
            </span>
            <span className="text-right">
              ACTION
            </span>
          </div>

          <div>
            {subjectPapers.length ? (
              subjectPapers.map((paper) => (
                <PaperRow
                  key={paper.id}
                  paper={paper}
                  onPreview={handlePreview}
                  onDownload={handleDownload}
                />
              ))
            ) : (
              <EmptyState
                title="No papers yet"
                description="This subject does not have a paper for the selected year."
              />
            )}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="brutal-border bg-lavender p-6">
              <Search size={26} />

              <div className="display mt-12 text-4xl">
                MISSING A PAPER?
              </div>

              <p className="mono mt-3 text-xs uppercase leading-5">
                Use the admin upload workflow
                to add a missing PDF during the
                current prototype stage.
              </p>
            </div>

            <div className="brutal-border bg-green p-6">
              <Download size={26} />

              <div className="display mt-12 text-4xl">
                SAVE TIME.
              </div>

              <p className="mono mt-3 text-xs uppercase leading-5">
                Papers are connected to
                Supabase Storage.
              </p>
            </div>
          </div>

        </div>
      </section>

      <PaperViewer
        paper={selectedPaper}
        subjectName={subject.name}
        onClose={() =>
          setSelectedPaper(null)
        }
      />
    </>
  );
}
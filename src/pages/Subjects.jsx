import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../components/navigation/Breadcrumbs";
import SectionLabel from "../components/common/SectionLabel";
import SubjectRow from "../components/archive/SubjectRow";
import EmptyState from "../components/common/EmptyState";

import {
  getCourses,
  getSemesters,
  getSubjects,
} from "../lib/paperVaultApi";

export default function Subjects() {
  const {
    departmentSlug,
    courseSlug,
    semesterNumber,
  } = useParams();

  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjectsData() {
      try {
        setLoading(true);
        setError("");

        const [coursesData, semestersData, subjectsData] =
          await Promise.all([
            getCourses(),
            getSemesters(),
            getSubjects(),
          ]);

        setCourses(coursesData);
        setSemesters(semestersData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error("Error loading subjects:", err);
        setError("Unable to load subjects. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadSubjectsData();
  }, []);

  const course = courses.find(
    (item) => item.slug === courseSlug
  );

  const semester = semesters.find(
    (item) =>
      item.course_id === course?.id &&
      String(item.semester_number) === String(semesterNumber)
  );

  const semesterSubjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSemester =
        subject.semester_id === semester?.id;

      const matchesSearch =
        !normalized ||
        subject.name?.toLowerCase().includes(normalized) ||
        subject.code?.toLowerCase().includes(normalized);

      return matchesSemester && matchesSearch;
    });
  }, [subjects, semester, query]);

  return (
    <section className="min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <Breadcrumbs
          items={[
            {
              label: departmentSlug,
              to: `/${departmentSlug}`,
            },
            {
              label:
                course?.short_name ||
                course?.shortName ||
                courseSlug,
              to: `/${departmentSlug}/${courseSlug}`,
            },
            {
              label: `SEM ${semesterNumber}`,
            },
          ]}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <SectionLabel number="04">
              SEMESTER {semesterNumber}
            </SectionLabel>

            <h1 className="display mt-5 text-[clamp(5rem,12vw,11rem)] leading-[.78]">
              SUBJECT
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

          <div>
            <label className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.15em]">
              SEARCH SUBJECT / CODE
            </label>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={19}
              />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                className="focus-ring brutal-border w-full bg-acid py-4 pl-12 pr-12 font-bold uppercase outline-none"
                placeholder="E.G. NETWORKS"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X size={19} />
                </button>
              )}
            </div>

            <div className="mono mt-3 flex items-center gap-2 text-[9px] uppercase text-black/55">
              <SlidersHorizontal size={13} />

              {loading
                ? "Loading subjects..."
                : `${semesterSubjects.length} subjects found`}
            </div>
          </div>
        </div>

        <div className="mt-16">
          {loading ? (
            <div className="mono border-t-[3px] border-ink py-8 text-xs uppercase">
              Loading subjects...
            </div>
          ) : error ? (
            <div className="mono border-t-[3px] border-ink py-8 text-xs uppercase text-red-600">
              {error}
            </div>
          ) : semesterSubjects.length ? (
            semesterSubjects.map((subject, index) => (
              <SubjectRow
                key={subject.id}
                subject={subject}
                index={index}
              />
            ))
          ) : (
            <EmptyState
              title="No subjects found"
              description="Try another subject name or subject code."
            />
          )}
        </div>
      </div>
    </section>
  );
}
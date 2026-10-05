import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../components/navigation/Breadcrumbs";
import SectionLabel from "../components/common/SectionLabel";
import SubjectRow from "../components/archive/SubjectRow";
import EmptyState from "../components/common/EmptyState";

import {
  getCourses,
  getSemesters,
  getSubjectsBySemesterId,
} from "../lib/paperVaultApi";

export default function Subjects() {
  const {
    departmentSlug,
    courseSlug,
    semesterNumber,
  } = useParams();

  const [course, setCourse] = useState(null);
  const [semester, setSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const actualSemesterNumber = String(
    semesterNumber || ""
  ).replace("semester-", "");

  useEffect(() => {
    async function loadSubjectsData() {
      try {
        setLoading(true);
        setError("");

        const [coursesData, semestersData] =
          await Promise.all([
            getCourses(),
            getSemesters(),
          ]);

        console.log("COURSE SLUG FROM URL:", courseSlug);
        console.log(
          "ALL COURSES FROM SUPABASE:",
          coursesData
        );

        const normalizedCourseSlug = String(
          courseSlug || ""
        )
          .trim()
          .toLowerCase();

        const matchedCourse = coursesData.find((item) => {
          const databaseSlug = String(item.slug || "")
            .trim()
            .toLowerCase();

          return databaseSlug === normalizedCourseSlug;
        });

        if (!matchedCourse) {
          throw new Error(
            `Course not found. URL slug: ${courseSlug}`
          );
        }

        console.log("MATCHED COURSE:", matchedCourse);

        const matchedSemester = semestersData.find(
          (item) => {
            const semesterMatches =
              String(item.semester_number) ===
              actualSemesterNumber;

            const courseMatches =
              String(item.course_id) ===
              String(matchedCourse.id);

            return semesterMatches && courseMatches;
          }
        );

        if (!matchedSemester) {
          throw new Error(
            `Semester ${actualSemesterNumber} not found for this course`
          );
        }

        console.log(
          "MATCHED SEMESTER:",
          matchedSemester
        );

        const subjectsData =
          await getSubjectsBySemesterId(
            matchedSemester.id
          );

        console.log(
          "SUBJECTS FROM SUPABASE:",
          subjectsData
        );

        setCourse(matchedCourse);
        setSemester(matchedSemester);
        setSubjects(subjectsData || []);
      } catch (err) {
        console.error("Error loading subjects:", err);

        setError(
          err.message || "Unable to load subjects."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSubjectsData();
  }, [courseSlug, actualSemesterNumber]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSubjects = subjects.filter((subject) => {
    const subjectName = String(
      subject.name || ""
    ).toLowerCase();

    const subjectCode = String(
      subject.code || ""
    ).toLowerCase();

    return (
      !normalizedQuery ||
      subjectName.includes(normalizedQuery) ||
      subjectCode.includes(normalizedQuery)
    );
  });

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
                course?.name ||
                courseSlug,
              to: `/${departmentSlug}/${courseSlug}`,
            },
            {
              label: `SEM ${actualSemesterNumber}`,
            },
          ]}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <SectionLabel number="04">
              SEMESTER {actualSemesterNumber}
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
                : `${filteredSubjects.length} subjects found`}
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
          ) : filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, index) => (
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
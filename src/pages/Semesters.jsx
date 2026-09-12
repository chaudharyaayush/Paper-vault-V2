import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import SectionLabel from "../components/common/SectionLabel";
import SemesterGrid from "../components/archive/SemesterGrid";
import EmptyState from "../components/common/EmptyState";
import { getCourses, getSemesters } from "../lib/paperVaultApi";

export default function Semesters() {
  const { departmentSlug, courseSlug } = useParams();

  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSemesters() {
      try {
        const [courseData, semesterData] = await Promise.all([
          getCourses(),
          getSemesters(),
        ]);

        setCourses(courseData);
        setSemesters(semesterData);
      } catch (error) {
        console.error("Error loading semesters:", error);
        setError("Unable to load semesters.");
      } finally {
        setLoading(false);
      }
    }

    loadSemesters();
  }, []);

  const course = courses.find((item) => item.slug === courseSlug);

  const courseSemesters = semesters.filter(
    (semester) => semester.course_id === course?.id
  );

  if (loading) {
    return (
      <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <p className="mono text-xs uppercase">
            Loading semesters...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <p className="mono text-xs uppercase text-red-600">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <div className="p-10">
        <EmptyState title="Course not found" />
      </div>
    );
  }

  return (
    <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <Breadcrumbs
          items={[
            { label: departmentSlug, to: `/${departmentSlug}` },
            { label: course.short_name || course.name },
          ]}
        />

        <div className="mt-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <SectionLabel number="03">
              COURSE · {course.code}
            </SectionLabel>

            <h1 className="display mt-5 text-[clamp(5rem,12vw,11rem)] leading-[.78]">
              PICK A
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "3px #090909" }}
              >
                SEMESTER.
              </span>
            </h1>
          </div>

          <div className="max-w-sm mono text-xs uppercase leading-5">
            Semester 06 is the initial PaperVault launch focus. Other semester
            routes are ready for expansion.
          </div>
        </div>

        <div className="mt-16">
          {courseSemesters.length ? (
            <SemesterGrid
              course={course}
              semesters={courseSemesters}
            />
          ) : (
            <EmptyState
              title="Coming soon"
              description="This course does not have a live semester archive yet."
            />
          )}
        </div>
      </div>
    </section>
  );
}
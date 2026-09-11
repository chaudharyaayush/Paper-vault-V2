import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import SectionLabel from "../components/common/SectionLabel";
import CourseRow from "../components/archive/CourseRow";
import EmptyState from "../components/common/EmptyState";
import { getDepartments, getCourses } from "../lib/paperVaultApi";

export default function Courses() {
  const { departmentSlug } = useParams();

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const [departmentData, courseData] = await Promise.all([
          getDepartments(),
          getCourses(),
        ]);

        setDepartments(departmentData);
        setCourses(courseData);
      } catch (error) {
        console.error("Error loading courses:", error);
        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const department = departments.find(
    (item) => item.slug === departmentSlug
  );

  const departmentCourses = courses.filter(
    (course) => course.department_id === department?.id
  );

  if (loading) {
    return (
      <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <p className="mono text-xs uppercase">Loading courses...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1500px]">
          <p className="mono text-xs uppercase text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!department) {
    return (
      <div className="p-10">
        <EmptyState title="Archive not found" />
      </div>
    );
  }

  return (
    <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <Breadcrumbs items={[{ label: department.name }]} />

        <div className="mt-16">
          <SectionLabel number="02">
            {department.code} · COURSES
          </SectionLabel>

          <h1 className="display mt-5 text-[clamp(5rem,12vw,11rem)] leading-[.78]">
            PICK A
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "3px #090909" }}
            >
              COURSE.
            </span>
          </h1>
        </div>

        <div className="mt-16">
          {departmentCourses.length ? (
            departmentCourses.map((course, index) => (
              <CourseRow
                key={course.id}
                course={course}
                index={index}
              />
            ))
          ) : (
            <EmptyState
              title="Coming soon"
              description="This department does not have a live course archive yet."
            />
          )}
        </div>
      </div>
    </section>
  );
}
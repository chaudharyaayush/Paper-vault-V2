import { Link, useParams } from "react-router-dom";

export default function SemesterGrid({ course, semesters }) {
  const { departmentSlug } = useParams();

  return (
    <div className="grid grid-cols-2 border-l-[3px] border-t-[3px] border-ink sm:grid-cols-4">
      {semesters.map((semester) => {
        const semesterNumber = semester.semester_number;
        const live = semesterNumber === 6;

        return (
          <Link
            key={semester.id}
            to={`/${departmentSlug}/${course.slug}/semester-${semesterNumber}`}
            className={`group relative aspect-square border-b-[3px] border-r-[3px] border-ink p-5 transition hover:-translate-y-1 hover:bg-green ${
              live ? "bg-acid" : "bg-paper"
            }`}
          >
            <div className="mono text-[10px] font-bold">
              SEMESTER
            </div>

            <div className="display mt-8 text-8xl leading-none sm:text-9xl">
              {String(semesterNumber).padStart(2, "0")}
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex justify-between mono text-[9px] uppercase">
              <span>{live ? "CURRENT FOCUS" : "ARCHIVE"}</span>
              <span>↗</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
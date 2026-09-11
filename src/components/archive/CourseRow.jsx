import { ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function CourseRow({ course, index }) {
  const { departmentSlug } = useParams();

  return (
    <Link
      to={`/${departmentSlug}/${course.slug}`}
      className="group focus-ring grid grid-cols-[55px_1fr_auto] items-center gap-4 border-t-[3px] border-ink py-7 transition hover:bg-acid sm:grid-cols-[80px_1fr_160px_50px]"
    >
      <span className="mono text-xs font-bold">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div>
        <div className="display text-3xl leading-none sm:text-5xl">
          {course.name}
        </div>

        <div className="mono mt-2 text-[10px] uppercase tracking-[0.15em]">
          {course.code}
        </div>
      </div>

      <div className="mono hidden text-right text-[10px] uppercase tracking-[0.12em] sm:block">
        COURSE ARCHIVE
      </div>

      <ArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
    </Link>
  );
}
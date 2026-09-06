import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import SectionLabel from "../components/common/SectionLabel";
import SemesterGrid from "../components/archive/SemesterGrid";
import EmptyState from "../components/common/EmptyState";
import { courses } from "../data/mockData";
export default function Semesters(){const {departmentSlug,courseSlug}=useParams();const course=courses.find(item=>item.slug===courseSlug);if(!course)return <div className="p-10"><EmptyState title="Course not found"/></div>;return <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20"><div className="mx-auto max-w-[1500px]"><Breadcrumbs items={[{label:departmentSlug,to:`/${departmentSlug}`},{label:course.shortName}]}/><div className="mt-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><SectionLabel number="03">COURSE · {course.code}</SectionLabel><h1 className="display mt-5 text-[clamp(5rem,12vw,11rem)] leading-[.78]">PICK A<br/><span className="text-transparent" style={{WebkitTextStroke:"3px #090909"}}>SEMESTER.</span></h1></div><div className="max-w-sm mono text-xs uppercase leading-5">Semester 06 is the initial PaperVault launch focus. Other semester routes are ready for expansion.</div></div><div className="mt-16"><SemesterGrid course={course}/></div></div></section>}

import { useEffect, useState } from "react";
import SectionLabel from "../components/common/SectionLabel";
import Breadcrumbs from "../components/navigation/Breadcrumbs";
import DepartmentCard from "../components/archive/DepartmentCard";
import { getDepartments } from "../lib/paperVaultApi";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Error loading departments:", error);
        setError("Unable to load departments.");
      } finally {
        setLoading(false);
      }
    }

    loadDepartments();
  }, []);

  return (
    <section className="grid-paper min-h-[75vh] px-5 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1500px]">
        <Breadcrumbs />

        <div className="mt-16">
          <SectionLabel number="01">ACADEMIC ARCHIVE</SectionLabel>

          <h1 className="display mt-5 max-w-5xl text-[clamp(5rem,12vw,11rem)] leading-[.78]">
            CHOOSE
            <br />
            YOUR{" "}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "3px #090909" }}
            >
              ARCHIVE.
            </span>
          </h1>

          <p className="mono mt-8 max-w-xl text-xs uppercase leading-6">
            Start with your department, then narrow down by course, semester,
            subject and year.
          </p>
        </div>

        {loading && (
          <p className="mono mt-16 text-xs uppercase">
            Loading departments...
          </p>
        )}

        {error && (
          <p className="mono mt-16 text-xs uppercase text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((department, index) => (
              <DepartmentCard
                key={department.id}
                department={department}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
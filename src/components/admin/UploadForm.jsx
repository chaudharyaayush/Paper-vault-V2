import { useEffect, useState } from "react";
import Button from "../common/Button";
import FileDropzone from "./FileDropzone";

import { supabase } from "../../lib/supabase";

export default function UploadForm() {
  const [departments, setDepartments] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [semesters, setSemesters] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [departmentId, setDepartmentId] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [semesterId, setSemesterId] =
    useState("");

  const [subjectId, setSubjectId] =
    useState("");

  const [year, setYear] =
    useState("2026");

  const [examType, setExamType] =
    useState("End Semester");

  const [file, setFile] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  // ------------------------------------------------
  // LOAD DEPARTMENTS
  // ------------------------------------------------

  useEffect(() => {
    async function loadDepartments() {
      try {
        setError("");

        const {
          data,
          error: departmentError,
        } = await supabase
          .from("departments")
          .select("*")
          .order("name", {
            ascending: true,
          });

        if (departmentError) {
          throw departmentError;
        }

        setDepartments(data || []);

        if (data?.length > 0) {
          setDepartmentId(data[0].id);
        }
      } catch (err) {
        console.error(
          "Error loading departments:",
          err
        );

        setError(
          "Unable to load departments."
        );
      }
    }

    loadDepartments();
  }, []);

  // ------------------------------------------------
  // LOAD COURSES WHEN DEPARTMENT CHANGES
  // ------------------------------------------------

  useEffect(() => {
    async function loadCourses() {
      if (!departmentId) {
        setCourses([]);
        setCourseId("");
        return;
      }

      try {
        const {
          data,
          error: courseError,
        } = await supabase
          .from("courses")
          .select("*")
          .eq(
            "department_id",
            departmentId
          )
          .order("name", {
            ascending: true,
          });

        if (courseError) {
          throw courseError;
        }

        setCourses(data || []);

        setCourseId(
          data?.length > 0
            ? data[0].id
            : ""
        );
      } catch (err) {
        console.error(
          "Error loading courses:",
          err
        );

        setCourses([]);
        setCourseId("");
        setError(
          "Unable to load courses."
        );
      }
    }

    loadCourses();
  }, [departmentId]);

  // ------------------------------------------------
  // LOAD SEMESTERS WHEN COURSE CHANGES
  // ------------------------------------------------

  useEffect(() => {
    async function loadSemesters() {
      if (!courseId) {
        setSemesters([]);
        setSemesterId("");
        return;
      }

      try {
        const {
          data,
          error: semesterError,
        } = await supabase
          .from("semesters")
          .select("*")
          .eq(
            "course_id",
            courseId
          )
          .order("semester_number", {
            ascending: true,
          });

        if (semesterError) {
          throw semesterError;
        }

        setSemesters(data || []);

        setSemesterId(
          data?.length > 0
            ? data[0].id
            : ""
        );
      } catch (err) {
        console.error(
          "Error loading semesters:",
          err
        );

        setSemesters([]);
        setSemesterId("");
        setError(
          "Unable to load semesters."
        );
      }
    }

    loadSemesters();
  }, [courseId]);

  // ------------------------------------------------
  // LOAD SUBJECTS WHEN SEMESTER CHANGES
  // ------------------------------------------------

  useEffect(() => {
    async function loadSubjects() {
      if (!semesterId) {
        setSubjects([]);
        setSubjectId("");
        return;
      }

      try {
        const {
          data,
          error: subjectError,
        } = await supabase
          .from("subjects")
          .select("*")
          .eq(
            "semester_id",
            semesterId
          )
          .order("name", {
            ascending: true,
          });

        if (subjectError) {
          throw subjectError;
        }

        setSubjects(data || []);

        setSubjectId(
          data?.length > 0
            ? data[0].id
            : ""
        );
      } catch (err) {
        console.error(
          "Error loading subjects:",
          err
        );

        setSubjects([]);
        setSubjectId("");
        setError(
          "Unable to load subjects."
        );
      }
    }

    loadSubjects();
  }, [semesterId]);

  // ------------------------------------------------
  // UPLOAD
  // ------------------------------------------------

  async function submit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!departmentId) {
      setError(
        "Please select a department."
      );
      return;
    }

    if (!courseId) {
      setError(
        "Please select a course."
      );
      return;
    }

    if (!semesterId) {
      setError(
        "Please select a semester."
      );
      return;
    }

    if (!subjectId) {
      setError(
        "Please select a subject."
      );
      return;
    }

    if (!file) {
      setError(
        "Choose a PDF before uploading."
      );
      return;
    }

    if (file.type !== "application/pdf") {
      setError(
        "Only PDF files are allowed."
      );
      return;
    }

    try {
      setUploading(true);

      // ------------------------------------------------
      // GET SELECTED SUBJECT
      // ------------------------------------------------

      const selectedSubject =
        subjects.find(
          (subject) =>
            String(subject.id) ===
            String(subjectId)
        );

      if (!selectedSubject) {
        throw new Error(
          "Selected subject not found."
        );
      }

      // ------------------------------------------------
      // CHECK ADMIN SESSION
      // ------------------------------------------------

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "No authenticated admin session found."
        );
      }

      // ------------------------------------------------
      // CHECK DUPLICATE PAPER
      // ------------------------------------------------

      const {
        data: existingPapers,
        error: existingPaperError,
      } = await supabase
        .from("papers")
        .select("id, file_name")
        .eq(
          "subject_id",
          selectedSubject.id
        )
        .eq(
          "year",
          Number(year)
        )
        .eq(
          "exam_type",
          examType
        )
        .limit(1);

      if (existingPaperError) {
        throw existingPaperError;
      }

      if (
        existingPapers &&
        existingPapers.length > 0
      ) {
        setError(
          `Paper already exists for ${selectedSubject.code} · ${year} · ${examType}.`
        );

        return;
      }

      // ------------------------------------------------
      // SAFE FILE NAME
      // ------------------------------------------------

      const safeFileName =
        file.name
          .replace(
            /\s+/g,
            "-"
          )
          .replace(
            /[^a-zA-Z0-9._-]/g,
            ""
          );

      // ------------------------------------------------
      // SAFE EXAM TYPE
      // ------------------------------------------------

      const safeExamType =
        examType
          .toLowerCase()
          .replace(
            /\s+/g,
            "-"
          )
          .replace(
            /[^a-z0-9-]/g,
            ""
          );

      // ------------------------------------------------
      // UNIQUE STORAGE PATH
      // ------------------------------------------------

      const storagePath =
        `legacy/${selectedSubject.code}/${year}/${safeExamType}/${safeFileName}`;

      console.log(
        "UPLOADING FILE:",
        storagePath
      );

      // ------------------------------------------------
      // UPLOAD PDF
      // ------------------------------------------------

      const {
        error: uploadError,
      } = await supabase.storage
        .from("papers")
        .upload(
          storagePath,
          file,
          {
            contentType:
              "application/pdf",
            upsert: false,
          }
        );

      if (uploadError) {
        throw uploadError;
      }

      console.log(
        "FILE UPLOAD SUCCESSFUL:",
        storagePath
      );

      // ------------------------------------------------
      // INSERT DATABASE RECORD
      // ------------------------------------------------

      const {
        data: paperData,
        error: databaseError,
      } = await supabase
        .from("papers")
        .insert({
          subject_id:
            selectedSubject.id,

          year:
            Number(year),

          exam_type:
            examType,

          file_name:
            file.name,

          storage_path:
            storagePath,

          file_size_bytes:
            file.size,

          mime_type:
            file.type,

          uploaded_by:
            user.id,
        })
        .select()
        .single();

      if (databaseError) {
        // Remove Storage file if DB insert fails
        await supabase.storage
          .from("papers")
          .remove([
            storagePath,
          ]);

        throw databaseError;
      }

      console.log(
        "PAPER DATABASE ROW CREATED:",
        paperData
      );

      setMessage(
        `${file.name} uploaded successfully.`
      );

      setFile(null);

    } catch (err) {
      console.error(
        "ERROR UPLOADING PAPER:",
        err
      );

      setError(
        err.message ||
          "Unable to upload paper."
      );

    } finally {
      setUploading(false);
    }
  }

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <form
      onSubmit={submit}
      className="brutal-border bg-paper p-6 sm:p-8"
    >
      <div className="grid gap-6 sm:grid-cols-2">

        {/* DEPARTMENT */}

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">
            DEPARTMENT
          </span>

          <select
            value={departmentId}
            onChange={(event) => {
              setDepartmentId(
                event.target.value
              );

              setMessage("");
              setError("");
            }}
            className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none"
            required
          >
            {departments.map(
              (department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              )
            )}
          </select>
        </label>

        {/* COURSE */}

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">
            COURSE
          </span>

          <select
            value={courseId}
            onChange={(event) => {
              setCourseId(
                event.target.value
              );

              setMessage("");
              setError("");
            }}
            className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none"
            disabled={!departmentId}
            required
          >
            {courses.map(
              (course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.short_name ||
                    course.name}
                </option>
              )
            )}
          </select>
        </label>

        {/* SEMESTER */}

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">
            SEMESTER
          </span>

          <select
            value={semesterId}
            onChange={(event) => {
              setSemesterId(
                event.target.value
              );

              setMessage("");
              setError("");
            }}
            className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none"
            disabled={!courseId}
            required
          >
            {semesters.map(
              (semester) => (
                <option
                  key={semester.id}
                  value={semester.id}
                >
                  Semester{" "}
                  {semester.semester_number}
                </option>
              )
            )}
          </select>
        </label>

        {/* SUBJECT */}

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">
            SUBJECT
          </span>

          <select
            value={subjectId}
            onChange={(event) => {
              setSubjectId(
                event.target.value
              );

              setMessage("");
              setError("");
            }}
            className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none"
            disabled={!semesterId}
            required
          >
            {subjects.map(
              (subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                >
                  {subject.code} ·{" "}
                  {subject.name}
                </option>
              )
            )}
          </select>
        </label>

        {/* YEAR */}

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">
            YEAR
          </span>

          <select
            value={year}
            onChange={(event) =>
              setYear(
                event.target.value
              )
            }
            className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none"
          >
            {[
              2026,
              2025,
              2024,
              2023,
              2022,
              2021,
              2020,
            ].map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </label>

        {/* EXAM TYPE */}

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.15em]">
            EXAM TYPE
          </span>

          <select
            value={examType}
            onChange={(event) =>
              setExamType(
                event.target.value
              )
            }
            className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold uppercase outline-none"
          >
            <option>
              End Semester
            </option>

            <option>
              Mid Semester
            </option>

            <option>
              Internal Assessment
            </option>

            <option>
              Supplementary
            </option>
          </select>
        </label>
      </div>

      {/* PDF */}

      <div className="mt-6">
        <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">
          PAPER PDF
        </span>

        <FileDropzone
          file={file}
          onFile={setFile}
        />
      </div>

      {/* SUCCESS */}

      {message && (
        <div className="mono mt-5 border-[3px] border-ink bg-green px-4 py-3 text-xs font-bold uppercase">
          {message}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="mono mt-5 border-[3px] border-ink bg-orange px-4 py-3 text-xs font-bold uppercase">
          {error}
        </div>
      )}

      {/* UPLOAD BUTTON */}

      <Button
        type="submit"
        variant="acid"
        disabled={uploading}
        className="mt-6 w-full sm:w-auto"
      >
        {uploading
          ? "Uploading..."
          : "Upload paper"}
      </Button>
    </form>
  );
}
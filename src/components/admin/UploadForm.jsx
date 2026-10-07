import { useEffect, useState } from "react";
import Button from "../common/Button";
import FileDropzone from "./FileDropzone";
import { supabase } from "../../lib/supabase";

export default function UploadForm() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [year, setYear] = useState("2026");
  const [examType, setExamType] = useState("End Semester");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadDepartments() {
      try {
        const { data, error } = await supabase.from("departments").select("*").order("name", { ascending: true });
        if (error) throw error;
        setDepartments(data || []);
        if (data?.length) setDepartmentId(data[0].id);
      } catch (err) {
        console.error("Error loading departments:", err);
        setError("Unable to load departments.");
      }
    }
    loadDepartments();
  }, []);

  useEffect(() => {
    async function loadCourses() {
      if (!departmentId) {
        setCourses([]);
        setCourseId("");
        return;
      }
      try {
        const { data, error } = await supabase.from("courses").select("*").eq("department_id", departmentId).order("name", { ascending: true });
        if (error) throw error;
        setCourses(data || []);
        setCourseId(data?.length ? data[0].id : "");
      } catch (err) {
        console.error("Error loading courses:", err);
        setCourses([]);
        setCourseId("");
        setError("Unable to load courses.");
      }
    }
    loadCourses();
  }, [departmentId]);

  useEffect(() => {
    async function loadSemesters() {
      if (!courseId) {
        setSemesters([]);
        setSemesterId("");
        return;
      }
      try {
        const { data, error } = await supabase.from("semesters").select("*").eq("course_id", courseId).order("semester_number", { ascending: true });
        if (error) throw error;
        setSemesters(data || []);
        setSemesterId(data?.length ? data[0].id : "");
      } catch (err) {
        console.error("Error loading semesters:", err);
        setSemesters([]);
        setSemesterId("");
        setError("Unable to load semesters.");
      }
    }
    loadSemesters();
  }, [courseId]);

  useEffect(() => {
    async function loadSubjects() {
      if (!semesterId) {
        setSubjects([]);
        setSubjectId("");
        return;
      }
      try {
        const { data, error } = await supabase.from("subjects").select("*").eq("semester_id", semesterId).order("name", { ascending: true });
        if (error) throw error;
        setSubjects(data || []);
        setSubjectId(data?.length ? data[0].id : "");
      } catch (err) {
        console.error("Error loading subjects:", err);
        setSubjects([]);
        setSubjectId("");
        setError("Unable to load subjects.");
      }
    }
    loadSubjects();
  }, [semesterId]);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!departmentId) return setError("Please select a department.");
    if (!courseId) return setError("Please select a course.");
    if (!semesterId) return setError("Please select a semester.");
    if (!subjectId) return setError("Please select a subject.");
    if (!file) return setError("Choose a PDF before uploading.");
    if (file.type !== "application/pdf") return setError("Only PDF files are allowed.");

    try {
      setUploading(true);

      const selectedSubject = subjects.find((subject) => String(subject.id) === String(subjectId));
      if (!selectedSubject) throw new Error("Selected subject not found.");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated admin session found.");

      const { data: existingPapers, error: existingPaperError } = await supabase
        .from("papers")
        .select("id, file_name")
        .eq("subject_id", selectedSubject.id)
        .eq("year", Number(year))
        .eq("exam_type", examType)
        .limit(1);

      if (existingPaperError) throw existingPaperError;

      if (existingPapers?.length) {
        setError("Paper already exists for " + selectedSubject.code + " · " + year + " · " + examType + ".");
        return;
      }

      const safeFileName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
      const safeExamType = examType.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const storagePath = "legacy/" + selectedSubject.code + "/" + year + "/" + safeExamType + "/" + safeFileName;

      console.log("UPLOADING FILE:", storagePath);

      const { error: uploadError } = await supabase.storage.from("papers").upload(storagePath, file, {
        contentType: "application/pdf",
        upsert: false,
      });

      if (uploadError) throw uploadError;

      const { data: paperData, error: databaseError } = await supabase
        .from("papers")
        .insert({
          subject_id: selectedSubject.id,
          year: Number(year),
          exam_type: examType,
          file_name: file.name,
          storage_path: storagePath,
          file_size_bytes: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (databaseError) {
        await supabase.storage.from("papers").remove([storagePath]);
        throw databaseError;
      }

      console.log("PAPER DATABASE ROW CREATED:", paperData);
      setMessage(file.name + " uploaded successfully.");
      setFile(null);
    } catch (err) {
      console.error("ERROR UPLOADING PAPER:", err);
      setError(err.message || "Unable to upload paper.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={submit} className="brutal-border bg-paper p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">DEPARTMENT</span>
          <select value={departmentId} onChange={(event) => { setDepartmentId(event.target.value); setMessage(""); setError(""); }} className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none" required>
            {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
          </select>
        </label>

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">COURSE</span>
          <select value={courseId} onChange={(event) => { setCourseId(event.target.value); setMessage(""); setError(""); }} className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none" disabled={!departmentId} required>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.short_name || course.name}</option>)}
          </select>
        </label>

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">SEMESTER</span>
          <select value={semesterId} onChange={(event) => { setSemesterId(event.target.value); setMessage(""); setError(""); }} className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none" disabled={!courseId} required>
            {semesters.map((semester) => <option key={semester.id} value={semester.id}>Semester {semester.semester_number}</option>)}
          </select>
        </label>

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">SUBJECT</span>
          <select value={subjectId} onChange={(event) => { setSubjectId(event.target.value); setMessage(""); setError(""); }} className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none" disabled={!semesterId} required>
            {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.code} · {subject.name}</option>)}
          </select>
        </label>

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">YEAR</span>
          <select value={year} onChange={(event) => setYear(event.target.value)} className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold outline-none">
            {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label>
          <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.15em]">EXAM TYPE</span>
          <select value={examType} onChange={(event) => setExamType(event.target.value)} className="focus-ring brutal-border w-full bg-white px-4 py-3 font-bold uppercase outline-none">
            <option>End Semester</option>
            <option>Mid Semester</option>
            <option>Internal Assessment</option>
            <option>Supplementary</option>
          </select>
        </label>
      </div>

      <div className="mt-6">
        <span className="mono mb-2 block text-[10px] font-bold uppercase tracking-[0.14em]">PAPER PDF</span>
        <FileDropzone file={file} onFile={setFile} />
      </div>

      {message && <div className="mono mt-5 border-[3px] border-ink bg-green px-4 py-3 text-xs font-bold uppercase">{message}</div>}
      {error && <div className="mono mt-5 border-[3px] border-ink bg-orange px-4 py-3 text-xs font-bold uppercase">{error}</div>}

      <Button type="submit" variant="acid" disabled={uploading} className="mt-6 w-full sm:w-auto">
        {uploading ? "Uploading..." : "Upload paper"}
      </Button>
    </form>
  );
}

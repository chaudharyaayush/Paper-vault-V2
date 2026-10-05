import { supabase } from "./supabase";

// Get all departments
export async function getDepartments() {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }

  return data || [];
}

// Get all courses
export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }

  return data || [];
}

// Get all semesters
export async function getSemesters() {
  const { data, error } = await supabase
    .from("semesters")
    .select("*")
    .order("semester_number", { ascending: true });

  if (error) {
    console.error("Error fetching semesters:", error);
    throw error;
  }

  return data || [];
}

// Get all subjects
export async function getSubjects() {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }

  return data || [];
}

// Get subjects connected to a particular semester
export async function getSubjectsBySemesterId(semesterId) {
  if (!semesterId) {
    throw new Error("Semester ID is missing");
  }

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("semester_id", semesterId)
    .order("name", { ascending: true });

  if (error) {
    console.error(
      "Error fetching subjects by semester ID:",
      error
    );
    throw error;
  }

  return data || [];
}

// Get all papers
export async function getPapers() {
  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching papers:", error);
    throw error;
  }

  return data || [];
}

// Get a temporary URL for a paper PDF
export async function getPaperFileUrl(storagePath) {
  if (!storagePath) {
    throw new Error("Paper storage path is missing");
  }

  const { data, error } = await supabase.storage
    .from("papers")
    .createSignedUrl(storagePath, 60 * 60);

  if (error) {
    console.error(
      "Error creating paper URL:",
      error
    );
    throw error;
  }

  return data?.signedUrl || null;
}
import { supabase } from "./supabase";

export async function getDepartments() {
  const { data, error } = await supabase
    .from("departments")
    .select("*");

  if (error) throw error;

  return data;
}

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*");

  if (error) throw error;

  return data;
}

export async function getSubjects() {
  const { data, error } = await supabase
    .from("subjects")
    .select("*");

  if (error) throw error;

  return data;
}

export async function getPapers() {
  const { data, error } = await supabase
    .from("papers")
    .select("*");

  if (error) throw error;

  return data;
} 
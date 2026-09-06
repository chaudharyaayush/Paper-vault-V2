import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Departments from "./pages/Departments";
import Courses from "./pages/Courses";
import Semesters from "./pages/Semesters";
import Subjects from "./pages/Subjects";
import Papers from "./pages/Papers";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/:departmentSlug" element={<Courses />} />
          <Route path="/:departmentSlug/:courseSlug" element={<Semesters />} />
          <Route path="/:departmentSlug/:courseSlug/semester-:semesterNumber" element={<Subjects />} />
          <Route path="/:departmentSlug/:courseSlug/semester-:semesterNumber/:subjectSlug" element={<Papers />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

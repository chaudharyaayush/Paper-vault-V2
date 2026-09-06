export const departments = [
  { id: "engineering", slug: "engineering", name: "Engineering", code: "ENG", status: "live", description: "B.Tech question papers and academic archives.", courses: ["btech-cse"], accent: "acid" },
  { id: "management", slug: "management", name: "Management", code: "MGT", status: "soon", description: "Business and management archives are coming soon.", courses: [], accent: "orange" },
  { id: "science", slug: "science", name: "Science", code: "SCI", status: "soon", description: "Science course archives are coming soon.", courses: [], accent: "lavender" },
];

export const courses = [
  { id: "btech-cse", slug: "btech-cse", departmentId: "engineering", name: "B.Tech Computer Science & Engineering", shortName: "B.Tech CSE", code: "CSE", description: "Computer science question paper archive.", semesters: [1,2,3,4,5,6,7,8] },
];

export const subjects = [
  { id: "cse601", slug: "design-analysis-of-algorithms", code: "CSE601", name: "Design & Analysis of Algorithms", semester: 6, courseId: "btech-cse", papers: 3 },
  { id: "cse602", slug: "compiler-design", code: "CSE602", name: "Compiler Design", semester: 6, courseId: "btech-cse", papers: 3 },
  { id: "cse603", slug: "computer-networks", code: "CSE603", name: "Computer Networks", semester: 6, courseId: "btech-cse", papers: 3 },
  { id: "cse604", slug: "software-engineering", code: "CSE604", name: "Software Engineering", semester: 6, courseId: "btech-cse", papers: 2 },
  { id: "cse605", slug: "web-technology", code: "CSE605", name: "Web Technology", semester: 6, courseId: "btech-cse", papers: 3 },
];

export const papers = [
  { id:"p1",subjectId:"cse601",year:2024,examType:"End Semester",size:"2.4 MB",uploadedAt:"2026-08-21",fileName:"DAA-2024.pdf",fileUrl:"#",downloads:124 },
  { id:"p2",subjectId:"cse601",year:2023,examType:"End Semester",size:"2.1 MB",uploadedAt:"2026-08-21",fileName:"DAA-2023.pdf",fileUrl:"#",downloads:97 },
  { id:"p3",subjectId:"cse601",year:2022,examType:"End Semester",size:"1.9 MB",uploadedAt:"2026-08-20",fileName:"DAA-2022.pdf",fileUrl:"#",downloads:81 },
  { id:"p4",subjectId:"cse602",year:2024,examType:"End Semester",size:"2.7 MB",uploadedAt:"2026-08-21",fileName:"Compiler-2024.pdf",fileUrl:"#",downloads:109 },
  { id:"p5",subjectId:"cse602",year:2023,examType:"End Semester",size:"2.3 MB",uploadedAt:"2026-08-20",fileName:"Compiler-2023.pdf",fileUrl:"#",downloads:76 },
  { id:"p6",subjectId:"cse602",year:2022,examType:"End Semester",size:"2.0 MB",uploadedAt:"2026-08-19",fileName:"Compiler-2022.pdf",fileUrl:"#",downloads:65 },
  { id:"p7",subjectId:"cse603",year:2024,examType:"End Semester",size:"2.4 MB",uploadedAt:"2026-08-21",fileName:"CN-2024.pdf",fileUrl:"#",downloads:142 },
  { id:"p8",subjectId:"cse603",year:2023,examType:"End Semester",size:"2.2 MB",uploadedAt:"2026-08-20",fileName:"CN-2023.pdf",fileUrl:"#",downloads:112 },
  { id:"p9",subjectId:"cse603",year:2022,examType:"End Semester",size:"1.8 MB",uploadedAt:"2026-08-19",fileName:"CN-2022.pdf",fileUrl:"#",downloads:91 },
  { id:"p10",subjectId:"cse604",year:2024,examType:"End Semester",size:"2.1 MB",uploadedAt:"2026-08-21",fileName:"SE-2024.pdf",fileUrl:"#",downloads:84 },
  { id:"p11",subjectId:"cse604",year:2023,examType:"End Semester",size:"1.9 MB",uploadedAt:"2026-08-19",fileName:"SE-2023.pdf",fileUrl:"#",downloads:63 },
  { id:"p12",subjectId:"cse605",year:2024,examType:"End Semester",size:"2.5 MB",uploadedAt:"2026-08-21",fileName:"WT-2024.pdf",fileUrl:"#",downloads:118 },
  { id:"p13",subjectId:"cse605",year:2023,examType:"End Semester",size:"2.0 MB",uploadedAt:"2026-08-20",fileName:"WT-2023.pdf",fileUrl:"#",downloads:88 },
  { id:"p14",subjectId:"cse605",year:2022,examType:"End Semester",size:"1.7 MB",uploadedAt:"2026-08-18",fileName:"WT-2022.pdf",fileUrl:"#",downloads:52 },
];

export const stats = [
  { value:"01",label:"DEPARTMENT LIVE" }, { value:"01",label:"COURSE LIVE" }, { value:"06",label:"SEMESTER FOCUS" }, { value:"14",label:"PAPERS IN ARCHIVE" },
];

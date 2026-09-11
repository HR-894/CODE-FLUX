export const MOCK_COURSES = [
  { id: "CAP900", title: "Operating Systems", code: "CAP900", attendance: 82, totalClasses: 45, attended: 37, type: "Lecture", faculty: "Dr. Arvind Sharma", credits: 4 },
  { id: "CAP902", title: "Data Structures", code: "CAP902", attendance: 95, totalClasses: 30, attended: 28, type: "Lab", faculty: "Prof. Neha Gupta", credits: 2 },
  { id: "MTH101", title: "Applied Mathematics", code: "MTH101", attendance: 65, totalClasses: 20, attended: 13, type: "Lecture", faculty: "Dr. R.K. Singh", credits: 3 },
  { id: "INT108", title: "Python Programming", code: "INT108", attendance: 78, totalClasses: 35, attended: 27, type: "Lecture", faculty: "Mr. Rajeev Kumar", credits: 3 },
];

export const MOCK_ASSIGNMENTS = [
  { id: 1, title: "OS Memory Management Report", course: "CAP900", dueDate: "Tomorrow, 11:59 PM", status: "pending", difficulty: "High" },
  { id: 2, title: "Graph Algorithms Implementation", course: "CAP902", dueDate: "In 3 Days", status: "pending", difficulty: "Medium" },
];

export const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: "Placement Drive: Microsoft", date: "Today, 10:00 AM", type: "Placement", content: "Pre-placement talk in Baldev Raj Mittal Auditorium. Ensure formal attire.", priority: "high" },
  { id: 2, title: "Hostel Fee Submission", date: "Yesterday", type: "Admin", content: "Last date to submit hostel fee for next semester is 25th Sept. Late fee applies after.", priority: "medium" },
  { id: 3, title: "Hackathon Registration Open", date: "2 days ago", type: "Event", content: "Register for the CampusOS Hackathon! Prizes up to ₹50,000.", priority: "low" },
];

export const MOCK_QUICK_LINKS = [
  { id: 1, title: "RMS", desc: "Relationship Mgmt", icon: "LifeBuoy", color: "bg-blue-500/10 text-blue-500" },
  { id: 2, title: "Edu Revolution", desc: "Learn Online", icon: "GraduationCap", color: "bg-purple-500/10 text-purple-500" },
  { id: 3, title: "Fee Statement", desc: "View Receipts", icon: "Receipt", color: "bg-green-500/10 text-green-500" },
  { id: 4, title: "Hostel Leave", desc: "Apply Leave", icon: "Tent", color: "bg-brand-500/10 text-brand-500" },
];

export const MOCK_TIMETABLE = [
  { id: 1, title: "Operating Systems", time: "09:00 AM", endTime: "10:00 AM", location: "Block 34, Room 302", type: "lecture", faculty: "Dr. Arvind Sharma", current: false },
  { id: 2, title: "Data Structures Lab", time: "11:30 AM", endTime: "01:30 PM", location: "Block 33, Mac Lab 2", type: "lab", faculty: "Prof. Neha Gupta", current: true },
  { id: 3, title: "Lunch Break", time: "01:30 PM", endTime: "02:30 PM", location: "BH-4 Mess", type: "break", faculty: "", current: false },
  { id: 4, title: "Applied Mathematics", time: "02:30 PM", endTime: "03:30 PM", location: "Block 34, Room 104", type: "lecture", faculty: "Dr. R.K. Singh", current: false },
];

export const MOCK_FEE_TRANSACTIONS = [
  { id: "TXN982374", date: "2023-08-15", amount: 125000, type: "Tuition Fee", status: "Paid", semester: "Autumn 2023", receiptUrl: "#" },
  { id: "TXN982375", date: "2023-08-15", amount: 45000, type: "Hostel Fee", status: "Paid", semester: "Autumn 2023", receiptUrl: "#" },
  { id: "TXN102938", date: "2024-01-10", amount: 125000, type: "Tuition Fee", status: "Pending", semester: "Spring 2024", receiptUrl: null },
  { id: "TXN102939", date: "2024-01-10", amount: 2500, type: "Examination Fee", status: "Pending", semester: "Spring 2024", receiptUrl: null },
];

export const MOCK_RMS_COMPLAINTS = [
  { id: "RMS-2023-8921", date: "2023-09-10", category: "Hostel Maintenance", subCategory: "Plumbing Issue", description: "Tap leaking in Room 402, BH-4.", status: "Resolved", resolution: "Plumber fixed the tap on 11th Sept.", lastUpdated: "2023-09-11" },
  { id: "RMS-2023-9102", date: "2023-10-05", category: "IT Infrastructure", subCategory: "Wi-Fi Issue", description: "LPU-Wireless keeps disconnecting in Block 34.", status: "In Progress", resolution: "Network team is investigating router B34-R2.", lastUpdated: "2023-10-06" },
  { id: "RMS-2024-1023", date: "2024-01-12", category: "Academics", subCategory: "Attendance Discrepancy", description: "Attendance not marked for CAP900 on 10th Jan despite being present.", status: "Pending", resolution: null, lastUpdated: "2024-01-12" },
];

export const MOCK_DETAILED_ATTENDANCE = {
  "CAP900": [
    { date: "2024-01-08", time: "09:00 AM", status: "Present", type: "Lecture" },
    { date: "2024-01-10", time: "09:00 AM", status: "Absent", type: "Lecture" },
    { date: "2024-01-12", time: "09:00 AM", status: "Present", type: "Lecture" },
  ],
  "CAP902": [
    { date: "2024-01-09", time: "11:30 AM", status: "Present", type: "Lab" },
    { date: "2024-01-11", time: "11:30 AM", status: "Present", type: "Lab" },
  ]
};

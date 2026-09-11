import { Router, type IRouter } from "express";
import { complaintRouterService } from "../domain/complaint-router";

const router: IRouter = Router();

router.get("/dashboard", (_req, res) => {
  res.json({
    greeting: "Good morning, Aanya",
    activeComplaints: complaintRouterService.count("open"),
    resolvedThisWeek: 42,
    averageResponseHours: 3.8,
    attendanceRate: 94,
    recentActivity: [
      {
        id: "activity-1",
        title: "Library hours extended",
        detail: "Central Library will stay open until 11:30 PM today.",
        time: "18 min ago",
        tone: "indigo",
      },
      {
        id: "activity-2",
        title: "Complaint routed",
        detail: "Your projector report is now with Campus IT.",
        time: "1 hr ago",
        tone: "cyan",
      },
      {
        id: "activity-3",
        title: "Shuttle update",
        detail: "North loop frequency increased after 6 PM.",
        time: "2 hrs ago",
        tone: "amber",
      },
    ],
    priorityBreakdown: complaintRouterService.priorityBreakdown(),
  });
});

export default router;
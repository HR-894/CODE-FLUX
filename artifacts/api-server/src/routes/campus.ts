import { Router, type IRouter } from "express";
import { GetSearchSuggestionsQueryParams } from "@workspace/api-zod";
import { campusTrie } from "../domain/campus-index";

const router: IRouter = Router();

router.get("/search/suggestions", (req, res) => {
  const { q } = GetSearchSuggestionsQueryParams.parse(req.query);
  res.json(campusTrie.suggest(q));
});

router.get("/campus/timetable", (_req, res) => {
  res.json([
    {
      id: "class-1",
      title: "Human Computer Interaction",
      room: "Design Studio 3",
      time: "09:00 – 10:30",
      instructor: "Dr. Mira Shah",
      color: "#5b8def",
    },
    {
      id: "class-2",
      title: "Distributed Systems",
      room: "Engineering 204",
      time: "11:00 – 12:30",
      instructor: "Prof. Arjun Mehta",
      color: "#56c4b2",
    },
    {
      id: "class-3",
      title: "Open Lab Hours",
      room: "Innovation Lab",
      time: "15:00 – 17:00",
      instructor: "Student mentors",
      color: "#f4b860",
    },
  ]);
});

router.get("/campus/menu", (_req, res) => {
  res.json([
    {
      id: "menu-lunch",
      meal: "Lunch",
      title: "Citrus grain bowl",
      description: "Roasted vegetables, herbed rice, greens, and tahini.",
      tags: ["Vegetarian", "High protein"],
    },
    {
      id: "menu-snack",
      meal: "Late bite",
      title: "Masala toastie",
      description: "Spiced potato, cheddar, and coriander chutney.",
      tags: ["Popular", "Under 400 cal"],
    },
  ]);
});

export default router;
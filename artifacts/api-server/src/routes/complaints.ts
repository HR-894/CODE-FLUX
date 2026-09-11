import { Router, type IRouter } from "express";
import {
  CreateComplaintBody,
  ListComplaintsQueryParams,
} from "@workspace/api-zod";
import { complaintRouterService } from "../domain/complaint-router";
import { createSlidingWindowRateLimit } from "../middleware/rate-limit";

const router: IRouter = Router();
const complaintSubmissionLimit = createSlidingWindowRateLimit({
  limit: 5,
  windowMs: 60_000,
});

router.get("/complaints", (req, res) => {
  const query = ListComplaintsQueryParams.parse(req.query);
  res.json(complaintRouterService.list(query.status));
});

router.post("/complaints", complaintSubmissionLimit, (req, res) => {
  const input = CreateComplaintBody.parse(req.body);
  res.status(201).json(complaintRouterService.enqueue(input));
});

router.post("/complaints/next", (_req, res) => {
  const complaint = complaintRouterService.extractNext();

  if (complaint === undefined) {
    res.status(204).send();
    return;
  }

  res.json(complaint);
});

export default router;
import type {
  Complaint,
  ComplaintCategory,
  ComplaintSeverity,
  ComplaintStatus,
  CreateComplaintInput,
} from "@workspace/api-zod";
import { MinHeap } from "./min-heap";

const HOUR_MS = 60 * 60 * 1000;

export const SEVERITY_WEIGHT: Record<ComplaintSeverity, number> = {
  low: 1,
  medium: 3,
  high: 7,
  critical: 12,
};

type ComplaintRecord = Omit<Complaint, "createdAt"> & {
  readonly createdAt: Date;
  readonly createdAtMs: number;
};

const priorityKey = (complaint: ComplaintRecord): number =>
  complaint.createdAtMs / HOUR_MS - SEVERITY_WEIGHT[complaint.severity];

const compareComplaints = (
  left: ComplaintRecord,
  right: ComplaintRecord,
): number => {
  const keyDifference = priorityKey(left) - priorityKey(right);
  return keyDifference || left.createdAtMs - right.createdAtMs || left.id.localeCompare(right.id);
};

export function calculatePriority(
  severity: ComplaintSeverity,
  createdAt: Date,
  now = new Date(),
): number {
  const elapsedHours = Math.max(0, now.getTime() - createdAt.getTime()) / HOUR_MS;
  return Number((SEVERITY_WEIGHT[severity] + elapsedHours).toFixed(2));
}

function priorityLabel(priority: number): string {
  if (priority >= 12) return "Critical attention";
  if (priority >= 7) return "High attention";
  if (priority >= 3) return "Needs attention";
  return "Queued";
}

function toResponse(record: ComplaintRecord, now = new Date()): Complaint {
  const createdAt = record.createdAt;
  const priority = calculatePriority(record.severity, createdAt, now);

  return {
    id: record.id,
    title: record.title,
    description: record.description,
    category: record.category,
    severity: record.severity,
    status: record.status,
    location: record.location,
      createdAt,
    priority,
    priorityLabel: priorityLabel(priority),
  };
}

export class ComplaintRouterService {
  private readonly complaints = new Map<string, ComplaintRecord>();
  private readonly queue = new MinHeap<ComplaintRecord>(compareComplaints);
  private sequence = 0;

  public constructor() {
    const seed: Array<
      CreateComplaintInput & { ageHours: number; status?: ComplaintStatus }
    > = [
      {
        title: "Water leak near the east stairwell",
        description:
          "There is a steady leak on the second floor and the tile is becoming slippery.",
        category: "facilities",
        severity: "high",
        location: "Morrison Hall · East stairwell",
        ageHours: 5.5,
      },
      {
        title: "Projector unavailable for CS 204",
        description:
          "The projector has shown a blank input screen since the morning lecture.",
        category: "it",
        severity: "medium",
        location: "Engineering Building · Room 204",
        ageHours: 9,
      },
      {
        title: "Late evening shuttle request",
        description:
          "Students need a safer way to get back from the library after 10 PM.",
        category: "safety",
        severity: "critical",
        location: "North campus loop",
        ageHours: 1.75,
      },
    ];

    seed.forEach((input) => this.enqueue(input, new Date(Date.now() - input.ageHours * HOUR_MS)));
  }

  private readonly maxStoredComplaints = 2_000;

  private evictOldestIfFull(): void {
    if (this.complaints.size < this.maxStoredComplaints) return;

    // Find oldest resolved complaint first, otherwise oldest overall
    let oldestId: string | null = null;
    let oldestTime = Infinity;

    for (const [id, record] of this.complaints.entries()) {
      if (record.status === "resolved" && record.createdAtMs < oldestTime) {
        oldestTime = record.createdAtMs;
        oldestId = id;
      }
    }

    if (!oldestId) {
      for (const [id, record] of this.complaints.entries()) {
        if (record.createdAtMs < oldestTime) {
          oldestTime = record.createdAtMs;
          oldestId = id;
        }
      }
    }

    if (oldestId) {
      this.complaints.delete(oldestId);
      
      // Rebuild queue to prevent memory leak of evicted items staying in the MinHeap indefinitely
      const openRecords = [...this.complaints.values()].filter(c => c.status === "open");
      while (!this.queue.isEmpty()) {
        this.queue.extractMin();
      }
      openRecords.forEach(record => this.queue.push(record));
    }
  }

  public enqueue(
    input: CreateComplaintInput,
    createdAt = new Date(),
  ): Complaint {
    this.evictOldestIfFull();

    const id = `cmp-${String(++this.sequence).padStart(4, "0")}`;
    const record: ComplaintRecord = {
      id,
      title: input.title,
      description: input.description,
      category: input.category as ComplaintCategory,
      severity: input.severity as ComplaintSeverity,
      status: "open",
      location: input.location,
      createdAt,
      createdAtMs: createdAt.getTime(),
      priority: 0,
      priorityLabel: "Queued",
    };

    this.complaints.set(id, record);
    this.queue.push(record);
    return toResponse(record);
  }

  public list(status?: ComplaintStatus): Complaint[] {
    return [...this.complaints.values()]
      .filter((complaint) => status === undefined || complaint.status === status)
      .sort(compareComplaints)
      .map((complaint) => toResponse(complaint));
  }

  public extractNext(): Complaint | undefined {
    while (!this.queue.isEmpty()) {
      const next = this.queue.extractMin();

      // Ensure the complaint wasn't evicted from the Map, and is still open
      if (next === undefined || next.status !== "open" || !this.complaints.has(next.id)) {
        continue;
      }

      next.status = "assigned";
      return toResponse(next);
    }

    return undefined;
  }

  public count(status: ComplaintStatus): number {
    return [...this.complaints.values()].filter(
      (complaint) => complaint.status === status,
    ).length;
  }

  public priorityBreakdown(): Array<{ label: string; value: number; color: string }> {
    const counts = new Map<string, number>([
      ["Critical", 0],
      ["High", 0],
      ["Standard", 0],
    ]);

    this.list("open").forEach((complaint) => {
      const bucket =
        complaint.severity === "critical"
          ? "Critical"
          : complaint.severity === "high"
            ? "High"
            : "Standard";
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    });

    return [
      { label: "Critical", value: counts.get("Critical") ?? 0, color: "#f9736a" },
      { label: "High", value: counts.get("High") ?? 0, color: "#f4b860" },
      { label: "Standard", value: counts.get("Standard") ?? 0, color: "#5b8def" },
    ];
  }
}

export const complaintRouterService = new ComplaintRouterService();
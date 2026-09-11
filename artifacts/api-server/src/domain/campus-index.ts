export type CampusIndexKind = "directory" | "event" | "location";

export interface CampusIndexItem {
  readonly id: string;
  readonly label: string;
  readonly kind: CampusIndexKind;
  readonly meta: string;
}

interface TrieNode {
  readonly children: Map<string, TrieNode>;
  readonly itemIds: Set<string>;
}

const createNode = (): TrieNode => ({
  children: new Map<string, TrieNode>(),
  itemIds: new Set<string>(),
});

/**
 * In-memory prefix index. In production, the same interface can be backed by
 * RedisJSON or a Redis module without changing the request handler.
 */
export class CampusTrie {
  private readonly root = createNode();
  private readonly items = new Map<string, CampusIndexItem>();

  public add(item: CampusIndexItem): void {
    this.items.set(item.id, item);
    
    // Index the full string and each individual word
    const lowerLabel = item.label.toLowerCase();
    const words = [lowerLabel, ...lowerLabel.split(/\s+/)];
    
    for (const word of words) {
      let node = this.root;
      for (const character of word) {
        const next = node.children.get(character) ?? createNode();
        node.children.set(character, next);
        node = next;
        node.itemIds.add(item.id);
      }
    }
  }

  public suggest(prefix: string, limit = 8): CampusIndexItem[] {
    let node = this.root;

    for (const character of prefix.trim().toLowerCase()) {
      const next = node.children.get(character);
      if (next === undefined) return [];
      node = next;
    }

    return [...node.itemIds]
      .slice(0, limit)
      .map((id) => this.items.get(id))
      .filter((item): item is CampusIndexItem => item !== undefined);
  }
}

export const campusTrie = new CampusTrie();
const initialCampusIndex: CampusIndexItem[] = [
  {
    id: "loc-library",
    label: "Central Library",
    kind: "location",
    meta: "Open until 11:30 PM",
  },
  {
    id: "loc-student-center",
    label: "Student Center",
    kind: "location",
    meta: "Food court and services",
  },
  {
    id: "dir-advising",
    label: "Academic Advising",
    kind: "directory",
    meta: "Student Success · 2nd floor",
  },
  {
    id: "event-hack-night",
    label: "Hack Night: Build for campus",
    kind: "event",
    meta: "Tonight · Innovation Lab",
  },
];

initialCampusIndex.forEach((item) => campusTrie.add(item));
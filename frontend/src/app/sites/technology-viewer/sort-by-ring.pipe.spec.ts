import { Category, Ring, Technology } from "@shared/types/technology";
import { SortByRingPipe } from "./sort-by-ring.pipe";

const technologies: Technology[] = [
  {
    name: "Tech in Adopt",
    ring: Ring.Adopt,
    category: Category.Platforms,
    description: "",
  },
  {
    name: "Tech in Trial",
    ring: Ring.Trial,
    category: Category.Platforms,
    description: "",
  },
  {
    name: "Tech in Hold",
    ring: Ring.Hold,
    category: Category.Platforms,
    description: "",
  },
  {
    name: "Tech without Ring",
    ring: undefined,
    category: Category.Platforms,
    description: "",
  },
  {
    name: "Tech in Assess",
    ring: Ring.Assess,
    category: Category.Platforms,
    description: "",
  },
];

describe("SortByRingPipe", () => {
  it("should sort Technologies by Ring: Adopt -> Trial -> Assess -> Hold -> Undefined", () => {
    const pipe = new SortByRingPipe();
    expect(pipe).toBeTruthy();

    const transformedTechnologies = pipe.transform(technologies);

    expect(transformedTechnologies[0].ring).toBe(Ring.Adopt);
    expect(transformedTechnologies[1].ring).toBe(Ring.Trial);
    expect(transformedTechnologies[2].ring).toBe(Ring.Assess);
    expect(transformedTechnologies[3].ring).toBe(Ring.Hold);
    expect(transformedTechnologies[4].ring).toBe(undefined);
  });
});

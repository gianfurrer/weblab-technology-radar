import { Pipe, PipeTransform } from "@angular/core";
import { Ring, Technology } from "@shared/types/technology";

@Pipe({
  name: "sortByRing",
  standalone: true,
})
export class SortByRingPipe implements PipeTransform {
  transform(value: Technology[]): Technology[] {
    value.sort((a: Technology, b: Technology) => this.getRingPriority(b.ring) - this.getRingPriority(a.ring));
    return value;
  }

  private getRingPriority(ring: Ring | undefined): number {
    switch (ring) {
      case Ring.Adopt:
        return 4;
      case Ring.Trial:
        return 3;
      case Ring.Assess:
        return 2;
      case Ring.Hold:
        return 1;
      default:
        return 0;
    }
  }
}

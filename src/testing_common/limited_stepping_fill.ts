import { FillNode } from "../fill_node";
import { NodeBasePos } from "../node_base_pos";
import { SteppingFillProcessor } from "../stepping_fill";

export class DebugSteppingFillProcessorWithoutPropagation extends SteppingFillProcessor {
  createFillNode(x: number, y: number, dx: number, dy: number, base: NodeBasePos, prev?: FillNode | null, next?: FillNode | null): FillNode {
    return DebugFillNodeWithoutPropagation.create(this, x, y, dx, dy, base, prev, next);
  }
}

export class DebugFillNodeWithoutPropagation extends FillNode {
  createXNextNodeOutOfRange(): void {}
}

export class DebugSteppingFillProcessorWithoutExceedingQuadrant extends SteppingFillProcessor {
}

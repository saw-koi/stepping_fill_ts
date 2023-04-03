import { FillNode } from './fill_node'
import { NodeBasePos } from './node_base_pos'

export class SteppingFillProcessor {
  canvasFill: CanvasFillInterface;
  fillNode: FillNode;

  constructor(
    canvasFill: CanvasFillInterface,
    x: number,
    y: number,
  ) {
    this.canvasFill = canvasFill;
    const base = new NodeBasePos(x, y, 0);
    this.fillNode = new FillNode(this, x, y, 1, 1, base);
  }

  proceed(): boolean {
    return this.fillNode.proceed();
  }

  fill(x:number, y:number) {
    this.canvasFill.fillPoint(x, y);
  }

  isWall(x:number, y:number) {
    return this.canvasFill.isWall(x, y);
  }
}

export interface CanvasFillInterface {
  fillPoint(x:number, y:number): void;
  isWall(x:number, y:number): boolean;
  getWidth(): number;
  getHeight(): number;
}
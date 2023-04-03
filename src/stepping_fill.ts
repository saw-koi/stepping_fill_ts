import { FillNode } from './fill_node'
import { NodeBasePos } from './node_base_pos'

export class SteppingFillProcessor {
  canvasFill: CanvasFillInterface;
  fillNodeQueue: Array<FillNode> = [];

  constructor(
    canvasFill: CanvasFillInterface,
    x: number,
    y: number,
  ) {
    this.canvasFill = canvasFill;
    const base = new NodeBasePos(x, y, 0);
    this.fillNodeQueue.push(new FillNode(this, x, y, 1, 1, base));
  }

  addNode(node: FillNode): void {
    this.fillNodeQueue.push(node);
  }

  proceed(): boolean {
    const fillNode = this.fillNodeQueue.shift();
    if(fillNode === undefined) throw new Error("No node left in queue");

    if(fillNode.proceed()) this.fillNodeQueue.push(fillNode);
    return this.fillNodeQueue.length > 0;
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
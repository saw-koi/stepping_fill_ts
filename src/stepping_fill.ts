import { FillNode } from './fill_node'
import { NodeBasePos, NodeBasePosFactory } from './node_base_pos'
import { NodePriorityQueue } from './node_priority_queue';

export class SteppingFillProcessor {
  canvasFill: CanvasFillInterface;
  fillNodeQueue: Array<FillNode> = [];
  fillNodePriorityQueue: NodePriorityQueue = new NodePriorityQueue();
  nodeBasePosFactory: NodeBasePosFactory = new NodeBasePosFactory();

  constructor(
    canvasFill: CanvasFillInterface,
    x: number,
    y: number,
  ) {
    this.canvasFill = canvasFill;
    const base = this.nodeBasePosFactory.createNodeBasePos(x, y, 0);
    this.fillNodePriorityQueue.addFillNode(new FillNode(this, x, y, 1, 1, base));
  }

  addNode(node: FillNode): void {
    this.fillNodePriorityQueue.addFillNode(node);
  }

  proceed(): boolean {
    const fillNode = this.fillNodePriorityQueue.popFillNode();
    if(fillNode === undefined) throw new Error("No node left in queue");

    if(fillNode.proceed()) this.fillNodePriorityQueue.addFillNode(fillNode);
    return this.fillNodePriorityQueue.getLength() > 0;
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
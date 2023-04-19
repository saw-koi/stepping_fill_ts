import { FillNode } from './fill_node'
import { NodeBasePos, NodeBasePosFactory } from './node_base_pos'
import { NodePriorityQueue } from './node_priority_queue';

class FilledPointMap {
  width: number;
  height: number;
  private points: Array<number|null>;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.points = new Array(width*height).fill(null);
  }
  isPointFilled(x:number, y:number): boolean {
    return this.points[y*this.width + x] !== null;
  }
  markPointFilled(x:number, y:number, baseId:number) {
    this.points[y*this.width + x] = baseId;
  }
  getBaseIdOfPoint(x:number, y:number): number|null {
    return this.points[y*this.width + x];
  }
}

export class SteppingFillProcessor {
  canvasFill: CanvasFillInterface;
  fillNodeQueue: Array<FillNode> = [];
  fillNodePriorityQueue: NodePriorityQueue = new NodePriorityQueue();
  private nodeBasePosFactory: NodeBasePosFactory = new NodeBasePosFactory();
  private filledPointMap: FilledPointMap;

  constructor(
    canvasFill: CanvasFillInterface,
    x: number,
    y: number,
  ) {
    this.canvasFill = canvasFill;
    this.filledPointMap = new FilledPointMap(canvasFill.getWidth(), canvasFill.getHeight());
    const base = this.nodeBasePosFactory.createNodeBasePos(x, y, 0);
    this.addInitialNodes(x, y);
  }

  addInitialNodes(x:number, y:number) {
    const base = this.nodeBasePosFactory.createNodeBasePos(x, y, 0);
    this.fillNodePriorityQueue.addFillNode(this.createFillNode(x, y, 1, 1, base));
    if( this.isWall(x, y-1) ) {
      if( this.isWall(x-1, y)) {
        return;
      } else {
        this.fillNodePriorityQueue.addFillNode(this.createFillNode(x-1, y,   -1,  1, base));
        return;
      }
    } else {
      if( this.isWall(x-1, y)) {
        this.fillNodePriorityQueue.addFillNode(this.createFillNode(x  , y-1,  1, -1, base));
        return;
      } else {
        this.fillNodePriorityQueue.addFillNode(this.createFillNode(x,   y-1,  1, -1, base));
        this.fillNodePriorityQueue.addFillNode(this.createFillNode(x-1, y,   -1,  1, base));
        this.fillNodePriorityQueue.addFillNode(this.createFillNode(x-1, y-1, -1, -1, base));
        return;
      }
    }
  }

  getBasePosIdWhichFilledPoint(x:number, y:number): number|null {
    return this.filledPointMap.getBaseIdOfPoint(x, y);
  }

  isFilled(x:number, y:number): boolean {
    return this.filledPointMap.isPointFilled(x, y);
  }

  createFillNode(x:number, y:number, dx:number, dy:number, base: NodeBasePos,
    prev: FillNode|null = null, next: FillNode|null = null) {
    return FillNode.create(this, x, y, dx, dy, base, prev, next);
  }

  createNodeBasePos(x:number, y:number, distance:number): NodeBasePos {
    return this.nodeBasePosFactory.createNodeBasePos(x, y, distance);
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

  proceedToDistance(distance: number) {
    while(
      0 < this.fillNodePriorityQueue.getLength()
      && this.fillNodePriorityQueue.getTopDistance() <= distance) {
      this.proceed();
    }
  }

  fill(x:number, y:number, baseId:number) {
    this.filledPointMap.markPointFilled(x, y, baseId);
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
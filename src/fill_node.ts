import { SteppingFillProcessor } from './stepping_fill'
import { NodeBasePos } from './node_base_pos'

export class FillNode {
  fillProcessor: SteppingFillProcessor;
  x: number;
  y: number;
  dx: number;
  dy: number;
  base: NodeBasePos;
  prev: FillNode|null;
  next: FillNode|null;
  active: boolean = true;

  constructor(
    fillProcessor: SteppingFillProcessor,
    x:number,
    y:number,
    dx:number,
    dy:number,
    base:NodeBasePos,
    prev: FillNode|null = null,
    next: FillNode|null = null,
    ) {
    this.fillProcessor = fillProcessor;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.base = base;
    this.prev = prev;
    this.next = next;
  }

  proceed(): boolean {
    if(this.fillProcessor.isWall(this.x, this.y)) {
      this.active = false;
      return false;
    } else {
      this.fillProcessor.fill(this.x, this.y);
      if(this.isHead()) {
        const newNode = this.createNext(this.x+this.dx, this.y);
        this.fillProcessor.addNode(newNode);
      }
      this.y += this.dy;
      return true;
    }
  }

  isHead(): boolean {
    return this.next === null || !this.next.active;
  }

  createPrev(x: number, y:number): FillNode {
    const tPrev = this.prev;
    this.prev = new FillNode(this.fillProcessor, x, y, this.dx, this.dy, this.base, tPrev, this);
    if(tPrev !== null)tPrev.next = this.prev;
    return this.prev;
  }

  createNext(x: number, y:number): FillNode {
    const tNext = this.next;
    this.next = new FillNode(this.fillProcessor, x, y, this.dx, this.dy, this.base, this, tNext);
    if(tNext !== null)tNext.prev = this.next;
    return this.next;
  }
}
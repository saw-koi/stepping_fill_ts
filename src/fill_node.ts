import { SteppingFillProcessor } from './stepping_fill'
import { NodeBasePos } from './node_base_pos'

function compareAbsPosFromSafePos(
  baseX:number, baseY:number, tgtX:number, tgtY:number, safeX:number, safeY:number): number {
  // If target point is out of range between base horizontal line and line from base to safe point, returns positive.
  // If target point is in that range, returns negative.
  // If target point is on line from base to safe pos, returns zero.

  const safeRelX = Math.abs( safeX - baseX );
  const safeRelY = Math.abs( safeY - baseY );
  const tgtRelX = Math.abs( tgtX - baseX );
  const tgtRelY = Math.abs( tgtY - baseY );

  return Math.abs(safeRelX * tgtRelY) - Math.abs(safeRelY * tgtRelX);
}

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

  protected constructor(
    fillProcessor: SteppingFillProcessor,
    x:number,
    y:number,
    dx:number,
    dy:number,
    base:NodeBasePos,
    prev: FillNode|null,
    next: FillNode|null,
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

  static create(
    fillProcessor: SteppingFillProcessor,
    x:number,
    y:number,
    dx:number,
    dy:number,
    base:NodeBasePos,
    prev: FillNode|null = null,
    next: FillNode|null = null) {
    return new this(fillProcessor, x, y, dx, dy, base, prev, next);
  }

  proceed(): boolean {
    if( this.prev !== null && !this.prev.active ) {
      if( 0 < compareAbsPosFromSafePos(
        this.base.x, this.base.y,
        this.x, this.y,
        this.prev.x+this.dx, this.prev.y-this.dy
        ) ) {
        const next = this.next;
        const prev = this.prev;
        if(next !== null) next.prev = prev;
        prev.next = next;
        return false;
      }
    }
    if(this.fillProcessor.isWall(this.x, this.y)) {
      this.active = false;
      return false;
    } else {
      this.fillProcessor.fill(this.x, this.y);
      this.propagateOnHead();

      this.y += this.dy;
      return true;
    }
  }

  propagateOnHead(): void {
    if(this.next === null) {
      const newNode = this.createNext(this.x+this.dx, this.y);
      this.fillProcessor.addNode(newNode);
    } else if(!this.next.active) {
      const safeRelX = Math.abs( this.next.x - this.dx - this.base.x );
      const safeRelY = Math.abs( this.next.y + this.dy - this.base.y );
      const tgtRelX = Math.abs( this.x + this.dx - this.base.x );
      const tgtRelY = Math.abs( this.y - this.base.y );

      if( 0 <= compareAbsPosFromSafePos(
        this.base.x, this.base.y,
        this.x+this.dx, this.y,
        this.next.x-this.dx, this.next.y+this.dy
        ) ) {
        const newNode = this.createNext(this.x+this.dx, this.y);
        this.fillProcessor.addNode(newNode);
      }
    }
  }

  createPrev(x: number, y:number): FillNode {
    const tPrev = this.prev;
    this.prev = this.fillProcessor.createFillNode(x, y, this.dx, this.dy, this.base, tPrev, this);
    if(tPrev !== null)tPrev.next = this.prev;
    return this.prev;
  }

  createNext(x: number, y:number): FillNode {
    const tNext = this.next;
    this.next = this.fillProcessor.createFillNode(x, y, this.dx, this.dy, this.base, this, tNext);
    if(tNext !== null)tNext.prev = this.next;
    return this.next;
  }
}
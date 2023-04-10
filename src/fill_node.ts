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
    if( this.fillProcessor.isFilled( this.x, this.y ) ) {
      const next = this.next;
      const prev = this.prev;
      if(next !== null) next.prev = prev;
      if(prev !== null) prev.next = next;
      return false;
    }
    if( this.prev === null && this.base.x !== this.x) {
      if( this.fillProcessor.isWall(this.base.x, this.y+this.dy) ) {
        const newPrev = this.createPrev(this.base.x, this.y+this.dy);
        newPrev.active = false;
      }
    }
    if( this.next == null && this.base.y !== this.y) {
      if( this.fillProcessor.isWall(this.base.x+this.dx, this.y-this.dy) ) {
        const newNext = this.createNext(this.base.x+this.dx, this.y-this.dy);
        newNext.active = false;
      }
    }
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

        this.createYNextNodeOnOutOfPrevWallLimit();
        return false;
      }
    }
    if(this.fillProcessor.isWall(this.x, this.y)) {
      this.compensateXNextNodeCreationOnGap();
      this.active = false;
      return false;
    } else {
      this.fillProcessor.fill(this.x, this.y, this.base.id);

      if(this.prev === null || !this.prev.active) {
        this.createXReverseNodeIfNotFilled();
      }
      if(this.next === null || !this.next.active) {
        this.createYReverseNodeIfNotFilled();
      }

      this.propagateOnHead();

      this.y += this.dy;
      return true;
    }
  }

  createXReverseNodeIfNotFilled() {
    if( !this.fillProcessor.isFilled(this.x-this.dx, this.y) ) {
      const recentDistance = this.base.getDistance(this.x, this.y);
      const newBasePos = this.fillProcessor.createNodeBasePos(this.x, this.y, this.base.distance + recentDistance);
      const newNode = this.fillProcessor.createFillNode(this.x-this.dx, this.y,
        -this.dx, this.dy, newBasePos, null, null);
      this.fillProcessor.addNode(newNode);
    }
  }

  createYReverseNodeIfNotFilled() {
    if( !this.fillProcessor.isFilled(this.x, this.y-this.dy) ) {
      const recentDistance = this.base.getDistance(this.x, this.y);
      const newBasePos = this.fillProcessor.createNodeBasePos(this.x, this.y, this.base.distance + recentDistance);
      const newNode = this.fillProcessor.createFillNode(this.x, this.y-this.dy,
        this.dx, -this.dy, newBasePos, null, null);
      this.fillProcessor.addNode(newNode);
    }
  }

  createYNextNodeOnOutOfPrevWallLimit() {
    const recentDistance = this.base.getDistance(this.x, this.y-this.dy);
    const newBasePos = this.fillProcessor.createNodeBasePos(this.x, this.y-this.dy, this.base.distance + recentDistance);
    const newNode = this.fillProcessor.createFillNode(this.x, this.y,
      this.dx, this.dy, newBasePos, null, null);
    this.fillProcessor.addNode(newNode);
  }

  compensateXNextNodeCreationOnGap() {
    const targetX = this.x;
    const dx = this.dx;
    const dy = this.dy;
    const base = this.base;
    const fillProcessor = this.fillProcessor;
    let node: FillNode = this;
    for( let y = this.y + dy;
      fillProcessor.getBasePosIdWhichFilledPoint(targetX - dx, y) == base.id;
      y += dy) {

      if(fillProcessor.isWall(targetX, y)) {
        node = node.createPrev(targetX, y);
        node.active = false;
      } else if(!fillProcessor.isFilled(targetX, y)) {
        if( !node.active && 0 <= compareAbsPosFromSafePos(base.x, base.y, targetX, y, node.x-dx, node.y+dy) ) {
          const newNode = node.createPrev(targetX, y);
          this.fillProcessor.addNode(newNode);
        } else {
          this.createSameXLaterNodeOutOfRangeOnCompensating(targetX, y);
        }
      }
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
      } else {
        this.createXNextNodeOutOfRange();
      }
    }
  }

  createXNextNodeOutOfRange() {
    const recentDistance = this.base.getDistance(this.x, this.y);
    const newBasePos = this.fillProcessor.createNodeBasePos(this.x, this.y, this.base.distance + recentDistance);
    const newNode = this.fillProcessor.createFillNode(this.x+this.dx, this.y,
      this.dx, this.dy, newBasePos, null, null);
    this.fillProcessor.addNode(newNode);
  }

  createSameXLaterNodeOutOfRangeOnCompensating(targetX:number, targetY:number) {
    /* TODO: Process similar to createXNextNodeOutOfRange() so make common function */
    const recentDistance = this.base.getDistance(targetX-this.dx, targetY);
    const newBasePos = this.fillProcessor.createNodeBasePos(targetX-this.dx, targetY, this.base.distance + recentDistance);
    const newNode = this.fillProcessor.createFillNode(targetX, targetY,
      this.dx, this.dy, newBasePos, null, null);
    this.fillProcessor.addNode(newNode);
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
import { IdGivenObject } from "./id_given_object";

export abstract class DescPriorityQueueBase<T> {
  heap: Array<[number, T]> = [];
  swapItem(aIndex: number, bIndex: number): void {
    [this.heap[aIndex], this.heap[bIndex]] = [this.heap[bIndex], this.heap[aIndex]];
  }
  pushToHeap(tgtTuple: [number, T]) {
    this.heap.push(tgtTuple);
  }
  popFromHeap():[number, T] {
    const poped = this.heap.pop();
    if(poped === undefined) throw Error("Not Implemented");
    return poped;
  }
  addItem(item: T): void {
    const value = this.getDescPriority(item);
    const newTuple:[number, T] = [value, item];

    let index:number = this.heap.length;
    this.pushToHeap(newTuple);
    this.adjustItemUpward(index);
  }
  adjustItemUpward(index: number): number {
    while(index > 0) {
      const parentIndex = ( (index + 1) >> 1 ) - 1 ;
      const currentValue:number = this.heap[index][0];
      const parentValue:number = this.heap[parentIndex][0];
      if(currentValue < parentValue) {
        this.swapItem(index, parentIndex);
      } else {
        break;
      }
      index = parentIndex;
    }
    return index;
  }
  popItem(): T {
    this.swapItem(0, this.heap.length-1);
    const poped = this.popFromHeap();

    this.adjustItemDownward(0);

    return poped[1];
  }
  adjustItemDownward(index: number): number {
    let leftIndex;
    while( ( leftIndex = ( index << 1 ) + 1 ) < this.heap.length ) {
      const rightIndex = leftIndex + 1;
      if( rightIndex == this.heap.length || this.heap[leftIndex][0] < this.heap[rightIndex][0] ) {
        if( this.heap[leftIndex][0] < this.heap[index][0] ) {
          this.swapItem(index, leftIndex);
          index = leftIndex;
          continue;
        } else {
          break;
        }
      } else {
        if( this.heap[rightIndex][0] < this.heap[index][0] ) {
          this.swapItem(index, rightIndex);
          index = rightIndex;
          continue;
        } else {
          break;
        }
      }
    }
    return index;
  }
  getTopItem(): T {
    return this.heap[0][1];
  }
  getLength(): number {
    return this.heap.length;
  }

  abstract getDescPriority(item: T): number;
}

export abstract class ChangeableDescPriorityQueueBase<T extends IdGivenObject> extends DescPriorityQueueBase<T> {
  idToIndexDict: {[key: number]: number} = {};
  updateDescPriority(item: T) {
    const tgtId = item.getId();
    let index = this.idToIndexDict[tgtId];
    this.heap[index][0] = this.getDescPriority(item);

    const upwardAdjustedIndex = this.adjustItemUpward(index);
    if(upwardAdjustedIndex === index) {
      this.adjustItemDownward(index);
    }
  }
  pushToHeap(tgtTuple: [number, T]) {
    const tgtId = tgtTuple[1].getId();
    const tgtIndex = this.heap.length;
    super.pushToHeap(tgtTuple);
    this.idToIndexDict[tgtId] = tgtIndex;
  }
  swapItem(aIndex:number, bIndex:number) {
    const aId:number = this.heap[aIndex][1].getId();
    const bId:number = this.heap[bIndex][1].getId();
    super.swapItem(aIndex, bIndex);
    this.idToIndexDict[aId] = bIndex;
    this.idToIndexDict[bId] = aIndex;
  }
  popFromHeap():[number, T] {
    const tgtTuple = super.popFromHeap();
    const tgtId = tgtTuple[1].getId();
    delete this.idToIndexDict[tgtId];
    return tgtTuple;
  }
}
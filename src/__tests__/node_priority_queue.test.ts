import { FillNode } from "../fill_node";
import { NodeBasePos } from "../node_base_pos";
import { NodePriorityQueue } from "../node_priority_queue"
import { SteppingFillProcessor } from "../stepping_fill";
import { MockCanvas } from "../testing_common/mock_canvas";

class WrongFullDistanceNodePriorityQueue extends NodePriorityQueue {
  getFullDistanceOfFillNode(fillNode: FillNode): number {
    const xRandInt = fillNode.x * 2221 % 6653;
    const yRandInt = fillNode.y * 2221 % 6653;
    return xRandInt*(10000) + yRandInt*(1) + fillNode.x*(10000**-1) + fillNode.y*(10000**-2);
  }
}

test("multi basepos node priority test (safe float calculation)", () => {
  const queue = new NodePriorityQueue();
  const proc = new SteppingFillProcessor(new MockCanvas([""],[""]),500,0);
  const base_distance_10 = new NodeBasePos(100, 200, 10, 1);
  const base_distance_12 = new NodeBasePos(300, 200, 12, 2);

  // Full distance 11
  queue.addFillNode(proc.createFillNode(101, 200, 1, 1, base_distance_10, null, null));

  // Full distance 13
  queue.addFillNode(proc.createFillNode(100, 203, 1, 1, base_distance_10, null, null));

  // Full distance 15
  queue.addFillNode(proc.createFillNode(103, 204, 1, 1, base_distance_10, null, null));

  // Full distance 12
  queue.addFillNode(proc.createFillNode(300, 200, 1, 1, base_distance_12, null, null));

  // Full distance 14
  queue.addFillNode(proc.createFillNode(302, 200, 1, 1, base_distance_12, null, null));

  const rst = [];
  while(queue.getLength() > 0) {
    rst.push(queue.popFillNode().x);
  }
  expect(rst).toEqual([101, 300, 100, 302, 103]);
});

test("multi basepos node priority test (wrong float calculation)", () => {
  const queue = new WrongFullDistanceNodePriorityQueue();
  const proc = new SteppingFillProcessor(new MockCanvas([""],[""]),500,0);
  const base_distance_10 = new NodeBasePos(100, 200, 10, 10);
  const base_distance_12 = new NodeBasePos(300, 200, 12, 12);

  // Full distance 11
  queue.addFillNode(proc.createFillNode(101, 200, 1, 1, base_distance_10, null, null));

  // Full distance 13
  queue.addFillNode(proc.createFillNode(100, 203, 1, 1, base_distance_10, null, null));

  // Full distance 15
  queue.addFillNode(proc.createFillNode(103, 204, 1, 1, base_distance_10, null, null));

  // Full distance 17
  queue.addFillNode(proc.createFillNode(107, 200, 1, 1, base_distance_10, null, null));

  // Full distance 12
  queue.addFillNode(proc.createFillNode(300, 200, 1, 1, base_distance_12, null, null));

  // Full distance 14
  queue.addFillNode(proc.createFillNode(302, 200, 1, 1, base_distance_12, null, null));

  // Full distance 16
  queue.addFillNode(proc.createFillNode(306, 200, 1, 1, base_distance_12, null, null));

  const rst_10 = [];
  const rst_12 = [];
  while(queue.getLength() > 0) {
    const node = queue.popFillNode();
    if(node.base.id == 10) {
      rst_10.push(node.x);
    } else if(node.base.id == 12) {
      rst_12.push(node.x);
    }
  }
  expect([rst_10, rst_12]).toEqual([[101, 100, 103, 107], [300, 302, 306]]);
});
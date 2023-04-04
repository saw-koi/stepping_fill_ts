import { DescPriorityQueueBase, ChangeableDescPriorityQueueBase } from '../desc_priority_queue_base';
import { IdGivenObject } from '../id_given_object';

class DescPriorityQueue extends DescPriorityQueueBase<string> {
  getDescPriority(item: string): number {
    return parseInt(item);
  }
}

class IdGivenString implements IdGivenObject {
  s: string;
  id: number;
  constructor(s: string, id: number) {
    this.s = s;
    this.id = id;
  }
  getId(): number {
    return this.id;
  }
}

class ChangeableDescPriorityQueue extends ChangeableDescPriorityQueueBase<IdGivenString> {
  getDescPriority(item: IdGivenString) {
    return parseInt(item.s);
  };
}

test('simple priority queue test', () => {
  const queue = new DescPriorityQueue();
  queue.addItem("100");
  queue.addItem("200");
  queue.addItem("10");
  queue.addItem("101");
  queue.addItem("201");
  queue.addItem("11");
  queue.addItem("102");
  queue.addItem("202");
  queue.addItem("12");
  const rst = [];
  while(queue.getLength() > 0) {
    rst.push(queue.popItem());
  }
  expect(rst).toEqual(
    ["10","11","12","100","101","102","200","201","202"]);
});

test('top peeking test', () => {
  const queue = new DescPriorityQueue();
  queue.addItem("111");
  queue.addItem("112");
  queue.addItem("100");
  queue.addItem("101");
  queue.addItem("102");
  expect(queue.getTopItem()).toBe("100");
});

test('simple changeable priority queue test', () => {
  const queue = new ChangeableDescPriorityQueue();
  let i = 0;
  queue.addItem(new IdGivenString("100", ++i));
  queue.addItem(new IdGivenString("200", ++i));
  queue.addItem(new IdGivenString("10", ++i));
  queue.addItem(new IdGivenString("101", ++i));
  queue.addItem(new IdGivenString("201", ++i));
  queue.addItem(new IdGivenString("11", ++i));
  queue.addItem(new IdGivenString("102", ++i));
  queue.addItem(new IdGivenString("202", ++i));
  queue.addItem(new IdGivenString("12", ++i));
  const rst = [];
  while(queue.getLength() > 0) {
    rst.push(queue.popItem().s);
  }
  expect(rst).toEqual(
    ["10","11","12","100","101","102","200","201","202"]);
});

test('changeable priority queue item bigger updating test', () => {
  const queue = new ChangeableDescPriorityQueue();
  let i = 0;
  let item3;
  let item8;
  queue.addItem(new IdGivenString("10", ++i));
  queue.addItem(new IdGivenString("20", ++i));
  queue.addItem(item3 = new IdGivenString("30", ++i));
  queue.addItem(new IdGivenString("40", ++i));
  queue.addItem(new IdGivenString("50", ++i));
  queue.addItem(new IdGivenString("60", ++i));
  queue.addItem(new IdGivenString("70", ++i));
  queue.addItem(new IdGivenString("80", ++i));
  queue.addItem(new IdGivenString("90", ++i));
  queue.addItem(new IdGivenString("100", ++i));
  queue.addItem(new IdGivenString("110", ++i));
  queue.addItem(new IdGivenString("120", ++i));
  queue.addItem(new IdGivenString("130", ++i));
  queue.addItem(new IdGivenString("140", ++i));
  queue.addItem(new IdGivenString("150", ++i));
  queue.addItem(new IdGivenString("160", ++i));
  queue.addItem(new IdGivenString("170", ++i));
  item3.s = "3000";
  queue.updateDescPriority(item3);
  const rst = [];
  while(queue.getLength() > 0) {
    rst.push(queue.popItem().s);
  }
  expect(rst).toEqual(
    ["10","20","40","50","60","70","80","90","100","110","120","130","140","150","160","170","3000"]);
});

test('changeable priority queue item smaller updating test', () => {
  const queue = new ChangeableDescPriorityQueue();
  let i = 0;
  let item8;
  queue.addItem(new IdGivenString("10", ++i));
  queue.addItem(new IdGivenString("20", ++i));
  queue.addItem(new IdGivenString("30", ++i));
  queue.addItem(new IdGivenString("40", ++i));
  queue.addItem(new IdGivenString("50", ++i));
  queue.addItem(new IdGivenString("60", ++i));
  queue.addItem(new IdGivenString("70", ++i));
  queue.addItem(item8 = new IdGivenString("80", ++i));
  queue.addItem(new IdGivenString("90", ++i));
  queue.addItem(new IdGivenString("100", ++i));
  queue.addItem(new IdGivenString("110", ++i));
  queue.addItem(new IdGivenString("120", ++i));
  queue.addItem(new IdGivenString("130", ++i));
  queue.addItem(new IdGivenString("140", ++i));
  queue.addItem(new IdGivenString("150", ++i));
  queue.addItem(new IdGivenString("160", ++i));
  queue.addItem(new IdGivenString("170", ++i));
  item8.s = "8";
  queue.updateDescPriority(item8);
  const rst = [];
  while(queue.getLength() > 0) {
    rst.push(queue.popItem().s);
  }
  expect(rst).toEqual(
    ["8","10","20","30","40","50","60","70","90","100","110","120","130","140","150","160","170"]);
});

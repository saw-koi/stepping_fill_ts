import { SteppingFillProcessor } from '../stepping_fill'
import { DebugSteppingFillProcessorWithoutExceedingQuadrant, DebugSteppingFillProcessorWithoutPropagation } from '../testing_common/limited_stepping_fill';
import { MockCanvas } from '../testing_common/mock_canvas'

test('1 width canvas fill', () => {
  const canvas = new MockCanvas([
    's ',
    '- ',
    '- ',
    '- ',
    '# ',
    '- ',
  ],[
    '1 ',
    '* ',
    '1 ',
    '3 ',
    '# ',
    '- ',
  ]);
  const proc = new SteppingFillProcessor(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('no turn right downward fill test', () => {
  const canvas = new MockCanvas([
    's - - - - - ',
    '- - - - - - ',
    '- - - - - # ',
    '- - - # # - ',
    '- - # - - - ',
    '- - # - - - ',
  ],[
    '* * * * * * ',
    '1 * * * * * ',
    '* 2 * * * # ',
    '* * 3 # # - ',
    '* * # - - - ',
    '* * # - - - ',
  ]);
  const proc = new SteppingFillProcessor(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('no turn right downward fill order test', () => {
  const canvas = new MockCanvas([
    's - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
  ],[
    '0 1 3 6 9 * ',
    '1 2 4 7 * * ',
    '3 4 5 8 * * ',
    '6 7 8 * * * ',
    '9 * * * * * ',
    '* * * * * * ',
  ]);
  const proc = new SteppingFillProcessor(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('no turn right downward fill right shadow test', () => {
  const canvas = new MockCanvas([
    's - - - - - ',
    '- - # # # # ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
  ],[
    '* * * * * * ',
    '* * # # # # ',
    '* * - - - - ',
    '* * - - - - ',
    '* * * - - - ',
    '* * * - - - ',
    '* * * * - - ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutPropagation(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('no turn right downward fill right shadow test2', () => {
  const canvas = new MockCanvas([
    's - # # # # ',
    '- - # # # # ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
  ],[
    '* * # # # # ',
    '* * # # # # ',
    '* * - - - - ',
    '* * - - - - ',
    '* * * - - - ',
    '* * * - - - ',
    '* * * * - - ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutPropagation(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('no turn right downward fill left shadow test', () => {
  const canvas = new MockCanvas([
    's - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '# - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
    '- - - - - - ',
  ],[
    '* * * * * * ',
    '* * * * * * ',
    '* * * * * * ',
    '# - * * * * ',
    '- - * * * * ',
    '- - - * * * ',
    '- - - * * * ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutPropagation(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('no turn right downward fill left shadow test2', () => {
  const canvas = new MockCanvas([
    's - - - - - ',
    '# - - - - - ',
  ],[
    '* * * * * * ',
    '# - - - - - ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutPropagation(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('no turn right downward fill left right both shadow test', () => {
  const canvas = new MockCanvas([
    's - - - - - ',
    '- - - - # - ',
    '- - - - - - ',
    '- - - - - - ',
    '- # - - - - ',
    '- - - - - - ',
    '- - - - - - ',
  ],[
    '* * * * * * ',
    '* * * * # - ',
    '* * * * - - ',
    '* * * * * - ',
    '* # - * * * ',
    '* - - - * * ',
    '* - - - * * ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutPropagation(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('head node turning test', () => {
  const canvas = new MockCanvas([
    's - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
    '- - - - # # # # # # # # ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
  ],[
    '* * * * 1 2 3 * * 4 5 6 ',
    '* * * * 1 3 * * * 4 6 * ',
    '* * * * 1 3 * * * 4 6 * ',
    '* * * 1 # # # # # # # # ',
    '1 1 1 2 3 * * 4 5 6 * * ',
    '2 3 3 3 * * * 4 6 * * * ',
    '3 * * * * * 4 5 6 * * * ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutExceedingQuadrant(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('head node turning on having 2 or bigger gap from prev node test', () => {
  const canvas = new MockCanvas([
    's - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
    '- - - - - # # # # # # # ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
  ],[
    '* * * * 1 2 3 * * 4 5 6 ',
    '* * * * 1 3 * * * 4 6 * ',
    '* * * * 1 # # # # # # # ',
    '* * * 1 2 3 * * 4 5 6 * ',
    '1 1 1 2 3 * * * 4 6 * * ',
    '2 3 3 3 * * * * 4 6 * * ',
    '3 * * * * * * 4 5 6 * * ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutExceedingQuadrant(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('head node turning by thick wall test', () => {
  const canvas = new MockCanvas([
    's - - - - - - - - - - - ',
    '- - - - - # # # # # # # ',
    '- - - - - # # # # # # # ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
    '- - - - - - - - - - - - ',
  ],[
    '* * * * 1 2 3 * * 4 5 6 ',
    '* * * * 1 # # # # # # # ',
    '* * * * 1 # # # # # # # ',
    '* * * 1 2 3 * * 4 5 6 * ',
    '1 1 1 2 3 * * * 4 6 * * ',
    '2 3 3 3 * * * * 4 6 * * ',
    '3 * * * * * * 4 5 6 * * ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutExceedingQuadrant(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('right down crank filling test', () => {
  const canvas = new MockCanvas([
    's - - - - - - - - - - - ',
    '- # # # # # # # # # # # ',
    '- - # - - - - - - - - - ',
    '# - - # - - - - - - - - ',
    '- # - - # - - - - - - - ',
    '- - # - - # - - - - - - ',
    '- - - # - - # - - - - - ',
  ],[
    '* * * 1 2 3 4 5 6 7 8 9 ',
    '* # # # # # # # # # # # ',
    '* 1 # - - - - - - - - - ',
    '# 2 3 # - - - - - - - - ',
    '- # 4 5 # - - - - - - - ',
    '- - # 6 7 # - - - - - - ',
    '- - - # 8 9 # - - - - - ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutExceedingQuadrant(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

test('node over quadrant exceeding test', () => {
  const canvas = new MockCanvas([
    '- - - - - - - - - - - - - ',
    '- - - - - - - - - - - - - ',
    '- - - - - - - - - - - - - ',
    '- - - # # - - - - - - - - ',
    '- - - # s - - - - - - - - ',
    '- - - - - - - - - - - - - ',
    '- - - - - - - - - - - - - ',
    '- - - - - - - - - - - - - ',
    '- - - - - - - - - - - - - ',
    '- - - - - - - - - - - - - ',
    '- - - - - - - - - - - - - ',
    '- - - - - - - - - - - - - ',
  ],[
    '* * 9 5 * * * 5 6 9 * * * ',
    '* * 9 5 * * * * 5 6 9 * * ',
    '9 9 6 5 * * * * * 5 9 * * ',
    '5 5 5 # # * * * * 5 9 * * ',
    '* * * # 0 * * * * 5 6 9 * ',
    '* * * * * * * * * 5 9 * * ',
    '* * * * * * * * * 5 9 * * ',
    '5 * * * * * * * 5 5 9 * * ',
    '6 5 * * * * * 5 5 9 * * * ',
    '9 6 5 5 5 5 5 5 9 * * * * ',
    '* 9 9 9 6 9 9 9 * * * * * ',
    '* * * * 9 * * * * * * * * ',
  ]);
  const proc = new DebugSteppingFillProcessorWithoutExceedingQuadrant(canvas, ...canvas.getStartingXY());
  while(proc.proceed()) {};
  expect(canvas.getCurrentDataAsString()).toBe(canvas.getExpectedAsString());
});

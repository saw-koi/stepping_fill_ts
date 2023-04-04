import { SteppingFillProcessor } from '../stepping_fill'
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
  expect(canvas.checkResult()).toBe(true);
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
  expect(canvas.checkResult()).toBe(true);
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
  expect(canvas.checkResult()).toBe(true);
});

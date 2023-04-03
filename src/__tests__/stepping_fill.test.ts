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

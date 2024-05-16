/* eslint-disable @typescript-eslint/ban-ts-comment */
import { forwardRef } from 'react';

// @ts-ignore
// eslint-disable-next-line react/display-name
const SvgrMock = forwardRef<HTMLSpanElement>((props, ref) => <span ref={ref} {...props} />);
export default SvgrMock;

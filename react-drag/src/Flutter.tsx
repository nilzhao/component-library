import classNames from 'classnames';
import { cloneElement, FC, HTMLAttributes } from 'react';
import { isValidElement } from 'react';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props extends HTMLAttributes<any> {
  children?: ReactNode;
}

const Flutter: FC<Props> = ({ children, style }) => {
  if (!isValidElement(children)) return null;

  return createPortal(
    cloneElement<any>(children, {
      className: classNames(children.props.className, 'flutter'),
      style: {
        ...children.props.style,
        ...style,
      },
    }),
    document.body,
  );
};

export default Flutter;

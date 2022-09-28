import { FC } from 'react';
import classNames from 'classnames';
import { useCallback } from 'react';
import { ReactNode } from 'react';
import { useRef } from 'react';
import { ItemInfo, Position } from './typings';

interface Props {
  activeId: string;
  id: string;
  children?: React.ReactNode;
  onMouseDown: (comp: ReactNode, mousePos: Position, itemPos: ItemInfo) => void;
  className?: string;
}

const DragItem: FC<Props> = ({
  id,
  activeId,
  children,
  onMouseDown,
  className,
}) => {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!itemRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      onMouseDown(
        children,
        {
          x: e.clientX,
          y: e.clientY,
          offsetX: e.nativeEvent.offsetX,
          offsetY: e.nativeEvent.offsetY,
        },
        rect,
      );
    },
    [],
  );

  return (
    <div
      ref={itemRef}
      className={classNames(className, {
        hide: activeId === id,
      })}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

export default DragItem;

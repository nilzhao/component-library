import { MouseEventHandler, useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import './App.less';
import DragItem from './Item';
import { ReactNode } from 'react';
import Flutter from './Flutter';
import { useEffect } from 'react';
import { CSSProperties } from 'react';
import { ItemInfo, Position } from './typings';
import React from 'react';

const images = [
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8dGVjaHxlbnwwfHx8fDE2NjIwMjM2MDQ&ixlib=rb-1.2.1&q=80&w=100',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8dGVjaHxlbnwwfHx8fDE2NjIwMjc1MzI&ixlib=rb-1.2.1&q=80&w=100',
  'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8NHx8Y2F0fGVufDB8fHx8MTY2MjAyNzg3Nw&ixlib=rb-1.2.1&q=80&w=100',
  'https://images.unsplash.com/photo-1561948955-570b270e7c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8Y2F0fGVufDB8fHx8MTY2MjAyNzg3Nw&ixlib=rb-1.2.1&q=80&w=100',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8NXx8dGVjaHxlbnwwfHx8fDE2NjIwMjc1MzI&ixlib=rb-1.2.1&q=80&w=100',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8Nnx8dGVjaHxlbnwwfHx8fDE2NjIwMjc1MzI&ixlib=rb-1.2.1&q=80&w=100',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8N3x8dGVjaHxlbnwwfHx8fDE2NjIwMjc1MzI&ixlib=rb-1.2.1&q=80&w=100',
  'https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8dGVjaHxlbnwwfHx8fDE2NjIwMjc1MzI&ixlib=rb-1.2.1&q=80&w=100',
  'https://images.unsplash.com/photo-1597733336794-12d05021d510?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8OXx8dGVjaHxlbnwwfHx8fDE2NjIwMjc1MzI&ixlib=rb-1.2.1&q=80&w=100',
];

// 计算两点之间距离
function distance(startPos: Position, endPos: Position) {
  const a = endPos.x - startPos.x;
  const b = endPos.y - startPos.y;
  return Math.sqrt(a ** 2 + b ** 2);
}

function App() {
  const [content, setContent] = useState<ReactNode[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [flutterStyle, setFlutterStyle] = useState<CSSProperties>({});
  const [draggingItem, setDraggingItem] = useState<ReactNode | null>(null);
  const itemInfoRef = useRef<ItemInfo>({
    width: 0,
    height: 0,
  });
  const startPosRef = useRef<Position>({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const handleItemMouseDown = useCallback(
    (id: string) =>
      (comp: ReactNode, mousePos: Position, itemInfo: ItemInfo) => {
        setActiveId(id);
        setFlutterStyle({
          left: mousePos.x - mousePos.offsetX,
          top: mousePos.y - mousePos.offsetY,
          width: itemInfo.width,
          height: itemInfo.height,
        });
        startPosRef.current = mousePos;
        itemInfoRef.current = itemInfo;
        setDraggingItem(comp);
      },
    [],
  );

  const handleContentMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!React.isValidElement(draggingItem)) return;
    e.stopPropagation();

    setContent((prev) => {
      return [
        ...prev,
        React.cloneElement<any>(draggingItem, {
          key: Date.now().toString() + Math.random().toString(),
          style: {
            ...draggingItem.props.style,
            position: 'absolute',
            left: e.nativeEvent.offsetX - startPosRef.current.offsetX,
            top: e.nativeEvent.offsetY - startPosRef.current.offsetY,
          },
        }),
      ];
    });
    setDraggingItem(null);
    setActiveId('');
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!itemInfoRef.current.width) return;
      setFlutterStyle({
        left: e.clientX - startPosRef.current.offsetX,
        top: e.clientY - startPosRef.current.offsetY,
        width: itemInfoRef.current.width,
        height: itemInfoRef.current.height,
      });
    };

    const end = () => {
      setFlutterStyle({
        transition: 'all 0.3s',
        left: startPosRef.current.x - startPosRef.current.offsetX,
        top: startPosRef.current.y - startPosRef.current.offsetY,
        width: itemInfoRef.current.width,
        height: itemInfoRef.current.height,
      });
      setTimeout(() => {
        setDraggingItem(null);
        setActiveId('');
      }, 300);
      itemInfoRef.current = {
        width: 0,
        height: 0,
      };
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', end);
    window.addEventListener('blur', end);
    document.addEventListener('mouseleave', end);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('blur', end);
      document.removeEventListener('mouseleave', end);
    };
  }, []);

  return (
    <div id="app">
      <div className="slide">
        <div id="list" className="grid">
          {images.map((src, index) => {
            return (
              <DragItem
                activeId={activeId}
                id={String(index)}
                key={src}
                onMouseDown={handleItemMouseDown(String(index))}
                className="item"
              >
                <img src={src} />
              </DragItem>
            );
          })}
        </div>
      </div>
      <div id="content" onMouseUp={handleContentMouseUp}>
        {content}
      </div>
      <Flutter style={flutterStyle}>{draggingItem}</Flutter>
    </div>
  );
}

export default App;

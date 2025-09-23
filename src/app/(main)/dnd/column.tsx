import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaListAlt, FaRegListAlt } from 'react-icons/fa';
import React, { useRef } from 'react';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';

export function Column({
  children,
  id,
  index,
  count,
  addItem,
}: {
  children: React.ReactNode;
  id: string;
  index: number;
  count: number;
  addItem: (columnId: string) => void;
}) {
  const { isDropTarget, ref } = useDroppable({
    id,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div className="Column min-w-80 w-80" ref={ref}>
      <div className="flex justify-between">
        <div className="flex items-center justify-end gap-4">
          <div className="Column-header-title rounded-md w-fit flex items-center gap-2">
            <FaRegListAlt />
            <h1>Column {id}</h1>
          </div>
          {count}
        </div>
        <div className="flex items-center justify-end">
          <div className="Column-action rounded-md w-fit h-full flex items-center">
            <BiDotsHorizontalRounded />
          </div>
          <div
            className="Column-action rounded-md w-fit h-full flex items-center"
            onClick={() => addItem(id)}
          >
            <AiOutlinePlus />
          </div>
        </div>
      </div>
      {children}
      <button
        className="Column-action rounded-md mt-2 text-left"
        onClick={() => addItem(id)}
      >
        + Add Task
      </button>
    </div>
  );
}

import React from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import CardContainer from '@/components/card-container';
import { TaskProps } from '@/types/project';

export function Item({
  id,
  index,
  title,
  task,
  column,
  isShadow = false,
  isOverlay = false,
  onTitleChange,
  onUpdateTask,
  onKeyDown,
  onDoubleClick,
  onDeleteTask,
  onSaveNewTask,
  role
}: TaskProps) {

  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
  });

  return (
    <button
      ref={role === 'VIEWER' ? undefined : ref}
      data-dragging={isDragging}
      className={`${isOverlay ? '-rotate-3' : ''}`}
    >
      <CardContainer
      role={role}
      data={task}
      onTitleChange={onTitleChange}
      onUpdateTask={onUpdateTask}
      onKeyDown={onKeyDown}
      isShadow={isShadow}
      onDoubleClick={onDoubleClick}
      onDeleteTask={onDeleteTask}
      onSaveNewTask={onSaveNewTask}
      />
    </button>
  );
}

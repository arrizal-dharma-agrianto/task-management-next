import React from 'react';
import { useSortable } from '@dnd-kit/react/sortable';
import CardContainer from '@/components/card-container';

export function Item({
  id,
  index,
  column,
  isShadow = false,
  isOverlay = false,
}: {
  id: string;
  index: number;
  column: string;
  isShadow?: boolean;
  isOverlay?: boolean;
}) {

  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
  });

  return (
    <button
      ref={ref}
      data-dragging={isDragging}
      className={`${isOverlay ? '-rotate-3' : ''}`}
    >
      <CardContainer onTitleChange={false} data={{ id }} isShadow={isShadow} />
    </button>
  );
}

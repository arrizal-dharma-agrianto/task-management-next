"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Column } from './column';
import { Item } from './item';
import { move } from '@dnd-kit/helpers';
import './styles.css';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { useSidebar } from '@/components/ui/sidebar';


export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState({
    A: ['A0', 'A1', 'A2'],
    B: ['B0', 'B1'],
    C: [],
    D: [],
  });

  const { state } = useSidebar();

  const previousItems = useRef(items);
  const [columnOrder, setColumnOrder] = useState(() => Object.keys(items));
  const addColumn = () => {
    const lastColumnId = columnOrder[columnOrder.length - 1];
    const newColumnId = String.fromCharCode(lastColumnId.charCodeAt(0) + 1);
    setItems((prevItems) => ({
      ...prevItems,
      [newColumnId]: [],
    }));
    setColumnOrder((prevOrder) => [...prevOrder, newColumnId]);
  };

  const addItem = (columnId: string) => {
    setItems((prevItems) => {
      const newItems: any = { ...prevItems };
      const newItemId = `${columnId}${newItems[columnId].length}`;
      newItems[columnId] = [...newItems[columnId], newItemId];
      return newItems;
    });

  };

  return (
    <DragDropProvider
      onDragStart={(event) => {
        previousItems.current = items;

        const id = event.operation?.source?.id;
        if (id) {
          setActiveId(id as string);
        }
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation;
        if (source?.type === 'column') return;
        if (target) {
          setItems((items) => move(items, event));
        }
      }}
      onDragEnd={(event) => {
        setActiveId(null);

        const { source, target }: { source: any, target: any } = event.operation;
        if (event.canceled) {
          if (source.type === 'item') {
            setItems(previousItems.current);
          }
          return;
        }

        if (source.type === 'column') {
          setColumnOrder((columns) => move(columns, event));
        }
      }}
    >
      <div className={`Root h-full p-2 ${state === 'expanded' ? 'md:w-[calc(98.5vw-16rem)]' : 'md:w-[calc(98.5vw-3rem)]'} w-[97vw]
    gap-2 flex flex-row overflow-x-scroll`}>
        {Object.entries(items).map(([column, items], columnIndex) => (
          <Column key={column} id={column} index={columnIndex} addItem={addItem} count={items.length}>
            {items.map((id, index) => (
              <Item key={id} id={id} index={index} column={column} isShadow={id === activeId} />
            ))}
            <DragOverlay>
              {activeId ? (
                <Item key={activeId} id={activeId} index={0} column={column} isOverlay />
              ) : null}
            </DragOverlay>
          </Column>
        ))}
        <div className="min-w-fit cursor-pointer p-1" onClick={addColumn}>
          <span className="text-lg font-bold hover:bg-slate-200 rounded h-min px-4 py-2 text-slate-500">+ Add Column</span>
        </div>
      </div>
    </DragDropProvider>
  );
}


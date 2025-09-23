import { FaRegListAlt } from 'react-icons/fa';
import React from 'react';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
import { ColumnProps } from '@/types/project';
import { Ellipsis, Palette, PenBox, Plus, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Loading } from '@/components/ui/loading';
import { tailwindColors } from '@/app/default/color';
export function Column({
  role,
  children,
  id,
  index,
  color,
  status,
  count,
  addItem,
  isEditName = false,
  handleSaveColumn,
  onEditColumnName,
  onDeleteColumn,
  isCreatingTask = false,
}: ColumnProps) {
  const { isDropTarget, ref } = useDroppable({
    id,
    type: 'item',
    accept: 'item',
    collisionPriority: CollisionPriority.Low,
  });

  const colorClass = `bg-${color}-300`;

  return (
    <div
      className={`Column min-w-64 w-64 ${colorClass}`}
      // style={{ backgroundColor: color }}
      ref={ref}>
      <div className="flex justify-between">
        <div className="flex items-center justify-end gap-4">
          <div className="Column-header-title rounded-md w-fit flex items-center gap-2 h-8">
            <FaRegListAlt />
            {isEditName ? (
              <input
                type="text"
                defaultValue={status}
                className="bg-transparent text-sm border-b border-gray-300 focus:outline-none px-1 py-0.5 max-w-24"
                autoFocus
                placeholder='Column Name'
                onBlur={(e) => { handleSaveColumn(id, e.target.value); }}
              />
            ) : (
              <h1 className='text-sm'>{status === '' ? 'Column Name' : status}</h1>
            )}
          </div>
          {count}
        </div>
        {(role === 'ADMIN' || role === 'OWNER') &&
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="Column-action rounded-md w-fit h-8 flex items-center cursor-pointer">
                  <Ellipsis className='w-4' />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="rounded-lg p-2"
                side="right"
                align="start"
              >
                {/* Add your dropdown menu items here */}
                <DropdownMenuItem onClick={onEditColumnName}>
                  <PenBox className="w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='focus:bg-red-300' onClick={onDeleteColumn}>
                  <Trash className="w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex flex-col focus:bg-white px-0' >
                  <div className="flex gap-2 cursor-pointer items-center justify-start w-full px-3" >
                    <Palette className="w-4" />
                    <span>Change Color</span>
                  </div>
                  <div className="flex flex-wrap max-w-40 gap-2 p-2 justify-center">
                    {tailwindColors.map((c: any) => (
                      <div
                        key={c}
                        className={`w-5 h-5 rounded-full cursor-pointer border-2 ${color === c ? 'border-black' : 'border-transparent'} bg-${c}-300`}
                        onClick={() => handleSaveColumn(id, status, c)}
                        title={c}
                      />
                    ))}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div
              className="Column-action rounded-md w-fit h-8 flex items-center"
              onClick={() => addItem(id)}
            >
              {
                isCreatingTask ? (
                  <Loading />
                ) : (
                  <Plus className='w-4 h-4' />
                )
              }
            </div>
          </div>
        }
      </div>
      {children}
      <div>
        {(role === 'ADMIN' || role === 'OWNER') &&
          <button
            className="Column-action rounded-md mt-2 gap-1 text-left text-sm flex items-center"
            onClick={() => addItem(id)}
          >
            {
              isCreatingTask ? (
                <Loading />
              ) : (
                <Plus className='w-4' />
              )
            }

            <span>Add Task</span>

          </button>
        }
      </div>
    </div>
  );
}

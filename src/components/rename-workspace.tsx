import { updateWorkspace } from '@/service/workspace';
import { setIsEditNameWorkspace, updateNameWorkspace } from '@/store/slices/navigationSlice';
import { RootState } from '@/store/store';
import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function RenameWorkspace({ item }: { item: any }) {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const [oldName, setOldName] = useState(item.title);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        const input = inputRef.current;
        input.focus();
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleEditName = async () => {
    const newName = inputRef.current?.value || '';
    if (newName === oldName) {
      dispatch(setIsEditNameWorkspace({ id: item.id, isEditName: false }));
      toast.error('Workspace name has not changed');
      return;
    }

    if (newName.trim() === '') {
      console.error('Workspace name cannot be empty');
      dispatch(setIsEditNameWorkspace({ id: item.id, isEditName: false }));
      toast.error('Workspace name cannot be empty');
      return;
    }

    try {
      const res = await updateWorkspace(item.id, newName, user.id);

      if (!res) {
        console.error('Failed to update workspace');
        return;
      }

      if (res.workspace) {
        dispatch(updateNameWorkspace({ id: item.id, name: newName }));
        dispatch(setIsEditNameWorkspace({ id: item.id, isEditName: false }));
        setOldName(newName);
        console.log('Workspace updated successfully');
      } else {
        console.error('Failed to update workspace');
      }
    } catch (error) {
      console.error('Error updating workspace:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditName();
    }
    if (e.key === 'Escape') {
      dispatch(setIsEditNameWorkspace({ id: item.id, isEditName: false }));
    }
  };

  return (
    <input
      key={item.id}
      ref={inputRef}
      type="text"
      defaultValue={item.title}
      className="bg-transparent border-b border-dashed border-muted outline-none focus:border-solid w-9/12"
      onBlur={handleEditName}
      onKeyDown={handleKeyDown}
    />
  );
}
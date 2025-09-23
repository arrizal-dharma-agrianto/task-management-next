export type Task = {
  id: string;
  title: string;
  order: number;
};

export type ColumnData = {
  id: string;
  status: string;
  color: string;
  order: number;
  tasks: Task[];
  isEditName?: boolean;
};


export type TaskProps = {
  id: string;
  index: number;
  title: string;
  column: string;
  isShadow?: boolean;
  isOverlay?: boolean;
  task: any;
  onTitleChange?: any;
  onUpdateTask?: any;
  onKeyDown?: any;
  onDoubleClick?: any;
  onDeleteTask?: any;
  onSaveNewTask?: any;
  role?: string;
};

export type ColumnProps = {
  children: React.ReactNode;
  id: string;
  index: number;
  color: string;
  status: string;
  count: number;
  addItem: (columnId: string) => void;
  isEditName?: boolean;
  handleSaveColumn?: any;
  onDeleteColumn?: any;
  onEditColumnName?: any;
  isCreatingTask?: boolean;
  role?: string;
}
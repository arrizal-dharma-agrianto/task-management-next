interface NavItem {
  role: string;
  isActive: boolean | undefined;
  id: string;
  title: string;
  icon: string;
  isEditName: boolean;
  url: string;
}

interface NavGroup {
  [x: string]: any;
  id: string;
  title: string;
  icon: string;
  role: string;
  isEditName: boolean;
  url: string;
  isActive: boolean;
  items: NavItem[];
  length?: number; 
}

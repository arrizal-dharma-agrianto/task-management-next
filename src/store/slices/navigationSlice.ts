import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  workspaces: [],
  invited: [],
  // The initial state can be extended with more properties as needed
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setNavigation(state, action: PayloadAction<any>) {
      const { workspaces, invited } = action.payload;

      const mapWorkspace = (workspace: any, i = 0) => ({
        id: workspace.id,
        title: workspace.name,
        icon: 'briefcase',
        isEditName: false,
        role: workspace.userRole || 'VIEWER',
        url: '#',
        isActive: i === 0,
        items: (workspace.projects || []).map((project: any) => ({
          id: project.id,
          title: project.name,
          icon: '',
          role: project.userRole || 'VIEWER',
          isEditName: false,
          url: '/dnd',
        })),
      });

      state.workspaces = [];
      state.invited = [];

      workspaces.forEach((ws: any, i: number) => {
        state.workspaces.push(mapWorkspace(ws, i));
      });

      invited.forEach((ws: any, i: number) => {
        state.invited.push(mapWorkspace(ws, i));
      });
    },
    addWorkspace(state, action: PayloadAction<any>) {
      const newWorkspace = {
        id: action.payload.id,
        title: action.payload.name,
        icon: 'briefcase',
        isEditName: false,
        url: '#',
        isActive: false,
        items: [],
      };
      state.workspaces.push(newWorkspace);
    },
    addProject(state, action: PayloadAction<any>) {
      const { workspaceId, id, name } = action.payload;
      const newProject = {
        id,
        title: name,
        icon: '',
        isEditName: false,
        url: '/dnd',
        isActive: false,
      };

      // Try to add to workspaces
      const workspaceIndex = state.workspaces.findIndex((workspace: any) => workspace.id === workspaceId);
      if (workspaceIndex !== -1) {
        state.workspaces[workspaceIndex].items.push(newProject);
        state.workspaces[workspaceIndex].isActive = true;
        return;
      }

      // Try to add to invited
      const invitedIndex = state.invited.findIndex((workspace: any) => workspace.id === workspaceId);
      if (invitedIndex !== -1) {
        state.invited[invitedIndex].items.push(newProject);
        state.invited[invitedIndex].isActive = true;
      }
    },
    changeStatusWorkspace(state, action: PayloadAction<string>) {
      state.workspaces = state.workspaces.map((workspace: any) => {
        if (workspace.id === action.payload) {
          return {
            ...workspace,
            isActive: !workspace.isActive,
          };
        }
        return workspace;
      });
      
      state.invited = state.invited.map((workspace: any) => {
        if (workspace.id === action.payload) {
          return {
            ...workspace,
            isActive: !workspace.isActive,
          };
        }
        return workspace;
      });
    },
    removeWorkspace(state, action: PayloadAction<string>) {
      const workspaceIndex = state.workspaces.findIndex((workspace: any) => workspace.id === action.payload);
      if (workspaceIndex !== -1) {
        state.workspaces.splice(workspaceIndex, 1);
      }
    },
    removeProject(state, action: PayloadAction<string>) {
      // Remove from workspaces
      for (const workspace of state.workspaces) {
        const projectIndex = workspace.items.findIndex((project: any) => project.id === action.payload);
        if (projectIndex !== -1) {
          workspace.items.splice(projectIndex, 1);
          break;
        }
      }
      // Remove from invited
      for (const workspace of state.invited) {
        const projectIndex = workspace.items.findIndex((project: any) => project.id === action.payload);
        if (projectIndex !== -1) {
          workspace.items.splice(projectIndex, 1);
          break;
        }
      }
    },
    setIsEditNameWorkspace(state, action: PayloadAction<{ id: string; isEditName: boolean }>) {
      if (action.payload.isEditName) {
        state.workspaces.forEach((workspace: any) => {
          if (workspace.id !== action.payload.id) {
            workspace.isEditName = false;
          }
        });
        state.invited.forEach((workspace: any) => {
          if (workspace.id !== action.payload.id) {
            workspace.isEditName = false;
          }
        });
      }
      const workspaceIndex = state.workspaces.findIndex((workspace: any) => workspace.id === action.payload.id);
      if (workspaceIndex !== -1) {
        state.workspaces[workspaceIndex].isEditName = action.payload.isEditName;
      }
      const invitedIndex = state.invited.findIndex((workspace: any) => workspace.id === action.payload.id);
      if (invitedIndex !== -1) {
        state.invited[invitedIndex].isEditName = action.payload.isEditName;
      }
    },
    updateNameWorkspace(state, action: PayloadAction<{ id: string; name: string }>) {
      const workspaceIndex = state.workspaces.findIndex((workspace: any) => workspace.id === action.payload.id);
      if (workspaceIndex !== -1) {
        state.workspaces[workspaceIndex].title = action.payload.name;
      }
      const invitedIndex = state.invited.findIndex((workspace: any) => workspace.id === action.payload.id);
      if (invitedIndex !== -1) {
        state.invited[invitedIndex].title = action.payload.name;
      }
    },
    setIsEditNameProject(state, action: PayloadAction<{ id: string; isEditName: boolean }>) {
      if (action.payload.isEditName) {
        state.workspaces.forEach((workspace: any) => {
          workspace.items.forEach((project: any) => {
            if (project.id !== action.payload.id) {
              project.isEditName = false;
            }
          });
        });
        state.invited.forEach((workspace: any) => {
          workspace.items.forEach((project: any) => {
            if (project.id !== action.payload.id) {
              project.isEditName = false;
            }
          });
        });
      }
      for (const workspace of state.workspaces) {
        const projectIndex = workspace.items.findIndex((project: any) => project.id === action.payload.id);
        if (projectIndex !== -1) {
          workspace.items[projectIndex].isEditName = action.payload.isEditName;
          break;
        }
      }
      for (const workspace of state.invited) {
        const projectIndex = workspace.items.findIndex((project: any) => project.id === action.payload.id);
        if (projectIndex !== -1) {
          workspace.items[projectIndex].isEditName = action.payload.isEditName;
          break;
        }
      }
    },
    updateNameProject(state, action: PayloadAction<{ id: string; name: string }>) {
      // Update project name in both workspaces and invited arrays
      const updateProjectName = (arr: any[]) => {
        for (const workspace of arr) {
          const projectIndex = workspace.items.findIndex((project: any) => project.id === action.payload.id);
          if (projectIndex !== -1) {
            workspace.items[projectIndex].title = action.payload.name;
            break;
          }
        }
      };
      updateProjectName(state.workspaces);
      updateProjectName(state.invited);
    },
    resetNavigation() {
      return [
        {
          workspaces: [],
          invited: [],
        }
      ];
    },
  },
});

export const { setNavigation, resetNavigation, addWorkspace, addProject, changeStatusWorkspace, removeWorkspace, removeProject, setIsEditNameWorkspace, updateNameWorkspace, setIsEditNameProject, updateNameProject } = navigationSlice.actions;
export default navigationSlice.reducer;
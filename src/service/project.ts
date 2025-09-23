export const getProjectsById = async (id: string) => {
  const response = await fetch(`/api/project/${id}`);
  const project = await response.json();
  return project;
}

export const getProjectMembers = async (id: string) => {
  const response = await fetch(`/api/project/${id}/users`);
  if (!response.ok) {
    throw new Error("Failed to fetch project members");
  }
  const data = await response.json();
  return data;
}

export const postProjectUserByEmail = async (id: string, email: string, role: string) => {
  const response = await fetch(`/api/project/${id}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, role }),
  });

  if (!response.ok) {
    console.error("Error adding user to project:", await response.text());
    return { error: "Failed to add user to project" };
  }

  return response.json();
}

export const updateProject = async (id: string, name: string, ownerId: string) => {
  const response = await fetch(`/api/project/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, ownerId }),
  });
  if (!response.ok) {
    throw new Error("Failed to update project");
  }
  return response.json();
};

export const updateProjectUserRole = async (id: string, userId: string, role: string) => {
  const response = await fetch(`/api/project/${id}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) {
    return { error: "Failed to update project user role" };
  }
  return response.json();
};

export const deleteProject = async (id: string, ownerId: string) => {
  const response = await fetch(`/api/project/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ownerId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  return response.json();
}

export const deleteProjectUser = async (id: string, userId: string) => {
  const response = await fetch(`/api/project/${id}/users/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove user from project");
  }

  return response.json();
}

export const postLogProject = async (data: { userId: string; taskId?: string; projectId?: string; action: string }) => {
  console.log("Posting log for project:", data);
  const response = await fetch('/api/project/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return { error: 'Failed to create activity log' };
  }

  return response.json();
};


export const getLogProject = async (projectId: string) => {
  const response = await fetch(`/api/project/log?projectId=${projectId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch activity logs");
  }

  return response.json();
};

export const getStaticWorkspaces = async (id: string) => {
  const response = await fetch(`/api/workspace/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch static workspaces");
  }
  // console.log("Static workspaces fetched:", await response.json());
  const data = await response.json();
  return data.workspace;
}


export const updateWorkspace = async (id: string, name: string, ownerId: string) => {
  const response = await fetch(`/api/workspace/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, ownerId }),
  });

  if (!response.ok) {
    throw new Error("Failed to update workspace");
  }

  return response.json();
};

export const getWorkspaceMembers = async (id: string) => {
  const response = await fetch(`/api/workspace/${id}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch workspace members");
  }
  const data = await response.json();
  return data;
}

export const postWorkspaceUserByEmail = async (id: string, email: string, role: string) => {
  const response = await fetch(`/api/workspace/${id}/users`, {
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

export const updateWorkspaceUserRole = async (id: string, userId: string, role: string) => {
  const response = await fetch(`/api/workspace/${id}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    return { error: "Failed to update workspace user role" };
  }

  return response.json();
}

export const deleteWorkspace = async (id: string, ownerId: string) => {
  const response = await fetch(`/api/workspace/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ownerId }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete workspace");
  }

  return response.json();
}

export const deleteWorkspaceUser = async (id: string, userId: string) => {
  console.log("Deleting user from workspace:", id, userId);
  const response = await fetch(`/api/workspace/${id}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Error deleting user from workspace:", await response.text());
    return { error: "Failed to delete user from workspace" };
  }

  return response.json();
}
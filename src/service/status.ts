export const getStatusesByProjectId = async (projectId: string) => {
  const response = await fetch(`/api/status?projectId=${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statuses");
  }
  
  return response.json();
}

export const updateStatus = async (id: string, data: any) => {
  console.log('Updating status with data:', data);
  const response = await fetch(`/api/status/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update status");
  }
  return response.json();
}

export const createStatus = async (data: any) => {
  const response = await fetch(`/api/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create status");
  }
  return response.json();
}

export const deleteStatus = async (id: string) => {
  const response = await fetch(`/api/status/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete status");
  }
  return response.json();
}
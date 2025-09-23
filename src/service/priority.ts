export const getPrioritiesByProjectId = async (projectId: string) => {
  const response = await fetch(`/api/priority?projectId=${projectId}`, {
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
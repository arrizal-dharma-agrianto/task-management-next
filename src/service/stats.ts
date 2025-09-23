export async function getStats(userId: string) {
  try {
    const response = await fetch(`/api/stats/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    return await response.json();
    
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    throw error;
  }
}
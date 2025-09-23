export const getYourTasks = async () => {
  const response = await fetch(`/api/task`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return data;
}

export const getTaskById = async (id: string) => {
  const response = await fetch(`/api/task/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return data.task;
}

export const createTask = async (data: any) => {
  const response = await fetch(`/api/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export const updateTask = async (id: string, data: any) => {
  const { isEditTitle, project, status, priority, attachments, role, ...reqData } = data;

  if (
    Array.isArray(reqData.assignees) &&
    reqData.assignees.length > 0 &&
    typeof reqData.assignees[0] === "object" &&
    !Array.isArray(reqData.assignees[0]) &&
    Object.keys(reqData.assignees[0]).length > 0
  ) {
    delete reqData.assignees;
  }

  if (reqData.description === "<p><br></p>") {
    reqData.description = null;
  }

  const response = await fetch(`/api/task/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: reqData }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
};

export const postAttachment = async (data: {
  url: string;
  taskId: string;
  fileName: string;
  size: string;
}) => {
  const response = await fetch(`/api/task/attachment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to post attachment");
  }

  return response.json();
}

export const deleteTask = async (id: string) => {
  const response = await fetch(`/api/task/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  return response.json();
}
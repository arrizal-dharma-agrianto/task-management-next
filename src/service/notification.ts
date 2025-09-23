export const postNotification = async (userId: string, message: string) => {
  const response = await fetch('/api/notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, message }),
  });
  if (!response.ok) {
    throw new Error('Failed to create notification');
  }
  return response.json();
}

export const getNotifications = async () => {
  const response = await fetch('/api/notification', {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
}

export const getNotificationsCount = async (notif: any) => {
  const response = await fetch('/api/notification/count', {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch notifications count');
  }
  const data = await response.json();
  return data;
}

export const readNotification = async (id: string) => {
  const response = await fetch(`/api/notification/${id}`, {
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error('Failed to update notification');
  }
  return response.json();
}
export type EdmsNotificationFeedItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  projectName?: string;
  createdLabel: string;
  actionUrl?: string;
};

export async function getEdmsNotificationFeed(
  _sessionUser: any,
  _limit: number,
) {
  return [] as EdmsNotificationFeedItem[];
}

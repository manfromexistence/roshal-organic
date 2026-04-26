"use client";

import { Archive, Bell, CheckCheck, Inbox, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  projectName?: string;
  createdLabel: string;
  actionUrl?: string;
}

export function NotificationBell({
  notifications,
  unreadCount,
}: {
  notifications: Notification[];
  unreadCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const archivedNotifications = notifications.filter((n) => n.isRead);

  const markNotificationRead = async (notificationId: string) => {
    // TODO: Implement mark notification read action
    console.log("Mark notification read:", notificationId);
    toast({
      title: "Marked as read",
      description: "Notification marked as read",
    });
    router.refresh();
  };

  const markAllNotificationsRead = async () => {
    // TODO: Implement mark all notifications read action
    console.log("Mark all notifications read");
    toast({
      title: "All marked as read",
      description: "All notifications marked as read",
    });
    router.refresh();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[480px] p-0">
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">
                Review requests, transmittals, and approval updates.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={notifications.every((item) => item.isRead) || isPending}
              onClick={() => startTransition(() => markAllNotificationsRead())}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <CheckCheck className="size-4" />
                  Mark all read
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="inbox"
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Inbox className="mr-2 size-4" />
              Inbox
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Archive className="mr-2 size-4" />
              Archive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="p-0">
            <ScrollArea className="max-h-[400px]">
              {unreadNotifications.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No unread notifications.
                </div>
              ) : (
                <div className="divide-y">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 px-4 py-4"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <Badge variant="outline">Unread</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {notification.projectName ? (
                            <span>{notification.projectName}</span>
                          ) : null}
                          <span>{notification.createdLabel}</span>
                        </div>
                        {notification.actionUrl ? (
                          <Link
                            href={notification.actionUrl}
                            className="text-sm text-primary hover:underline"
                          >
                            Open item
                          </Link>
                        ) : null}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(() =>
                            markNotificationRead(notification.id),
                          )
                        }
                      >
                        {isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <CheckCheck className="size-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="archive" className="p-0">
            <ScrollArea className="max-h-[400px]">
              {archivedNotifications.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No archived notifications.
                </div>
              ) : (
                <div className="divide-y">
                  {archivedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 px-4 py-4"
                    >
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {notification.projectName ? (
                            <span>{notification.projectName}</span>
                          ) : null}
                          <span>{notification.createdLabel}</span>
                        </div>
                        {notification.actionUrl ? (
                          <Link
                            href={notification.actionUrl}
                            className="text-sm text-primary hover:underline"
                          >
                            Open item
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="border-t px-4 py-3">
          <Button variant="ghost" asChild className="w-full justify-center">
            <Link href="/notifications">Open notification inbox</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

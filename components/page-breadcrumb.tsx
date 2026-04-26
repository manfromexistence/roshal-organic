"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageBreadcrumbProps {
  customTitle?: string;
}

interface BreadcrumbItemData {
  title: string;
  href: string;
  isLast: boolean;
  isDynamic?: boolean;
  parentRoute?: string;
  id?: string;
}

export function PageBreadcrumb({ customTitle }: PageBreadcrumbProps) {
  const pathname = usePathname();
  const [dynamicTitles, setDynamicTitles] = useState<Record<string, string>>(
    {},
  );

  // Remove locale and sidebar from path
  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .filter(
      (segment) =>
        segment !== "[locale]" &&
        segment !== "(app)" &&
        segment !== "(sidebar)",
    );

  // Build breadcrumb items
  const items: BreadcrumbItemData[] = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

    // Check if this is a dynamic segment (looks like an ID)
    const isDynamic = /^[a-f0-9-]{36}$/.test(segment) || segment.length > 20;
    const parentRoute = index > 0 ? pathSegments[index - 1] : undefined;

    // Format segment title (capitalize and replace hyphens with spaces)
    const title = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title,
      href,
      isLast,
      isDynamic,
      parentRoute,
      id: segment,
    };
  });

  // Fetch dynamic titles for ID segments
  useEffect(() => {
    const fetchDynamicTitles = async () => {
      const newTitles: Record<string, string> = {};

      for (const item of items) {
        if (item.isDynamic && item.parentRoute && item.id) {
          try {
            const response = await fetch(
              `/api/breadcrumb/${item.parentRoute}/${item.id}`,
            );
            if (response.ok) {
              const data = await response.json();
              if (data.title) {
                newTitles[item.id] = data.title;
              }
            }
          } catch (error) {
            console.error("Error fetching breadcrumb title:", error);
          }
        }
      }

      setDynamicTitles(newTitles);
    };

    fetchDynamicTitles();
  }, [items]);

  if (items.length === 0) return null;

  // Use custom title for the last item if provided, otherwise use dynamic titles
  const displayItems = items.map((item, _index) => {
    let title = item.title;

    // Use custom title for last item if provided
    if (item.isLast && customTitle) {
      title = customTitle;
    }
    // Use dynamic title for ID segments
    else if (item.isDynamic && item.id && dynamicTitles[item.id]) {
      title = dynamicTitles[item.id];
    }

    return { ...item, title };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {displayItems.map((item, _index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

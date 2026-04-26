# Help Needed: Sidebar Accordion Flashing on Page Reload

## Problem Description
The sidebar accordion items in the navigation menu flash (close then expand) when the page is reloaded. The accordion state is persisted in localStorage, but when the page reloads, the items briefly appear collapsed before expanding to their saved state. This creates a poor user experience as the UI jumps around during page load.

## Expected Behavior
When a user reloads the page, the sidebar accordion items should immediately appear in their saved expanded/collapsed state from localStorage, with no visual flash or animation.

## Current Behavior
1. Page loads with all accordion items collapsed (empty state)
2. React mounts on client
3. useEffect reads localStorage
4. State updates to saved values
5. Accordion items animate from collapsed to expanded
6. User sees a brief flash of the menu changing

## Tech Stack Details

### Framework & Runtime
- **Next.js**: 16.2.4 with App Router and Server-Side Rendering (SSR)
- **React**: 19.2.4 with Server Components and Client Components
- **TypeScript**: 5.x for type safety
- **Package Manager**: Bun 1.3.13
- **Runtime**: Node.js (server), Browser (client)

### UI & Styling
- **Tailwind CSS**: 4.2.4 - Utility-first CSS framework
- **shadcn-ui**: v4 - Copy-paste components built on Radix UI primitives
- **Radix UI**: Underlying component library for accessible primitives
- **Lucide React**: Icon library (ChevronRight, etc.)
- **Biome**: 2.4.12 - Linter and formatter

### Component Architecture
- **Client Component**: `"use client"` directive for interactive components
- **Server Component**: Default for pages and layouts
- **Hydration**: React process of matching server HTML to client DOM

## Current Implementation (nav-main.tsx)

```tsx
"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: { title: string; url: string }[];
}

interface NavMainProps {
  items: NavItem[];
  label?: string;
}

export function NavMain({ items, label = "Platform" }: NavMainProps) {
  const storageKey = `nav-main-expanded-${label}`;

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let savedState: Record<string, boolean> = {};
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        savedState = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    setExpandedItems(savedState);
  }, [storageKey]);

  const toggleItem = (title: string, isOpen: boolean) => {
    setExpandedItems((prev) => {
      const next = { ...prev, [title]: isOpen };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
        // biome-ignore lint/suspicious/noDocumentCookie: Required for SSR hydration
        document.cookie = `${storageKey}=${encodeURIComponent(
          JSON.stringify(next),
        )}; path=/; max-age=31536000`;
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          item.items ? (
            <Collapsible
              key={item.title}
              open={mounted ? expandedItems[item.title] : false}
              onOpenChange={(isOpen) => toggleItem(item.title, isOpen)}
              className="group/collapsible"
              asChild
            >
              <SidebarMenuItem suppressHydrationWarning>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {mounted && (
                  <CollapsibleContent suppressHydrationWarning>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
```

## Component Hierarchy

```
app/layout.tsx (Server Component)
  └── DashboardLayout (Client Component)
      └── AppSidebar (Client Component)
          └── NavMain (Client Component)
              └── Collapsible (Radix UI)
                  ├── CollapsibleTrigger
                  └── CollapsibleContent
                      └── SidebarMenuSub
```

## Radix UI Collapsible Component Details

The Collapsible component from Radix UI is built on:
- **Primitive**: `@radix-ui/react-collapsible`
- **Features**:
  - Controlled (`open` prop) or uncontrolled (`defaultOpen` prop)
  - Built-in animation support
  - Accessibility attributes (ARIA)
  - Keyboard navigation
  - Focus management

### Props Used
- `open`: Controlled state (boolean)
- `onOpenChange`: Callback when state changes
- `asChild`: Composes with child element
- `className`: CSS classes for styling

### Data Attributes
- `data-state="open"` or `data-state="closed"`: Current state
- Used by Tailwind for conditional styling (`group-data-[state=open]`)

## What We've Tried (Detailed)

### Attempt 1: Reading localStorage synchronously in useState initializer

```tsx
const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(() => {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
  } catch {
    return {};
  }
  return {};
});
```

**Result**: Hydration mismatch error
- Server renders: `expandedItems = {}` (empty object)
- Client renders: `expandedItems = { "Platform": true }` (from localStorage)
- React detects HTML mismatch and regenerates client tree
- Console error: "Hydration failed because the server rendered HTML didn't match the client"

**Why it failed**: The `useState` initializer runs on both server and client. On server, `window` is undefined, so it returns empty. On client, it reads localStorage and returns saved state. This creates different initial HTML.

### Attempt 2: Using useEffect to hydrate state after mount

```tsx
const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  let savedState: Record<string, boolean> = {};
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      savedState = JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  setExpandedItems(savedState);
}, [storageKey]);
```

**Result**: No hydration errors, but visual flash
- Server renders: Collapsible with `open={false}`
- Client initial render: Collapsible with `open={false}` (matches server)
- After useEffect: State updates, Collapsible re-renders with `open={true}`
- Radix UI animates the transition from closed to open
- User sees the flash

**Why it failed**: The initial render has empty state, then state updates after mount, causing the component to animate to the new state.

### Attempt 3: Conditionally rendering CollapsibleContent after mount

```tsx
{mounted && (
  <CollapsibleContent suppressHydrationWarning>
    {/* content */}
  </CollapsibleContent>
)}
```

**Result**: Still causes flash
- The chevron rotation class still differs between server and client
- `group-data-[state=open]` class is applied based on `open` prop
- Server: `open={false}` → chevron not rotated
- Client after mount: `open={true}` → chevron rotates
- Visual flash from chevron rotation

**Why it failed**: The trigger button (with chevron) is always rendered, and its styling depends on the `open` prop.

### Attempt 4: Using CSS opacity-0 to hide menu before mount

```tsx
<SidebarMenu className={!mounted ? "opacity-0" : ""}>
```

**Result**: No flash, but menu is hidden initially
- Menu is invisible during hydration
- After mount, menu fades in with correct state
- User rejected this approach

**Why it was rejected**: User wants menu visible immediately, not hidden during load.

### Attempt 5: Replacing Radix UI Collapsible with custom accordion

```tsx
<button onClick={() => toggleItem(item.title, !expandedItems[item.title])}>
  {/* trigger */}
</button>
{expandedItems[item.title] && (
  <div>{/* content */}</div>
)}
```

**Result**: Same fundamental issue
- Still needs to read localStorage after mount
- Still causes flash when state updates
- Additionally broke sidebar collapse state integration

**Why it failed**: Custom implementation still has the same hydration problem - server can't access localStorage.

### Attempt 6: Using inline style for rotation instead of className

```tsx
<svg
  style={{
    transform: expandedItems[item.title] ? "rotate(90deg)" : "rotate(0deg)",
  }}
>
```

**Result**: Hydration mismatch
- Server: `style={{ transform: "rotate(0deg)" }}`
- Client: `style={{ transform: "rotate(90deg)" }}`
- Different style attributes cause hydration error

**Why it failed**: Inline styles are part of the HTML, so differences cause hydration mismatch.

### Attempt 7: Using data attributes with CSS

```tsx
<svg data-expanded={expandedItems[item.title] ? "true" : "false"}>
```

With CSS:
```css
svg[data-expanded="true"] {
  transform: rotate(90deg);
}
```

**Result**: Hydration mismatch
- Server: `data-expanded="false"`
- Client: `data-expanded="true"`
- Different data attributes cause hydration error

**Why it failed**: Data attributes are part of the HTML, so differences cause hydration mismatch.

## Root Cause Analysis

The fundamental issue is the **server-client state synchronization problem**:

1. **Server-side rendering**: Next.js renders HTML on the server where:
   - `window` object doesn't exist
   - `localStorage` doesn't exist
   - Browser APIs are unavailable
   - All state must be deterministic

2. **Client-side hydration**: React takes the server HTML and:
   - Attaches event listeners
   - Reconciles with client state
   - Expects exact HTML match

3. **The mismatch**: Server renders with empty state, client needs localStorage state
   - Can't read localStorage on server
   - Can't send localStorage to server (security)
   - State must be hydrated after mount
   - State change after mount causes visual update

## Possible Solutions (Not Yet Tried)

### Solution A: Server-side state injection via cookies

```tsx
// Server-side in layout.tsx
const savedState = cookies().get(`nav-main-expanded-${label}`);
const initialState = savedState ? JSON.parse(savedState.value) : {};

// Pass to component
<NavMain initialState={initialState} />
```

**Pros**:
- Server and client start with same state
- No hydration mismatch
- No flash

**Cons**:
- Requires cookie management
- Cookies have size limits
- Need to sync localStorage and cookies
- More complex state management

### Solution B: Disable Radix UI animation

Radix UI Collapsible has built-in animation. If we can disable it:
- No animation when state changes
- State change would be instant
- Less noticeable flash

**How**: Check Radix UI docs for animation disable prop or CSS override

### Solution C: Use CSS to prevent layout shift

```css
/* Reserve space for expanded content */
.collapsible-content {
  min-height: 0;
  transition: none;
}
```

**Pros**: Might reduce visual impact
**Cons**: Doesn't solve the root cause

### Solution D: Use a loading state with skeleton

```tsx
{!mounted ? (
  <Skeleton />
) : (
  <Collapsible open={expandedItems[item.title]}>
    {/* content */}
  </Collapsible>
)}
```

**Pros**: Shows something during hydration
**Cons**: Still a visual change, user rejected hiding

### Solution E: Use Next.js dynamic import with no SSR

```tsx
const NavMain = dynamic(() => import('./nav-main'), { ssr: false });
```

**Pros**: Component only renders on client
**Cons**: Breaks SEO, not ideal for navigation

### Solution F: Use URL query params for state

```tsx
// URL: /?expanded=platform,settings
const expandedFromUrl = searchParams.get('expanded')?.split(',');
```

**Pros**: Server can read URL params
**Cons**: Pollutes URL, state lost on navigation

### Solution G: Use a separate non-hydrated component

Create a wrapper that doesn't participate in hydration:
```tsx
function NonHydratedWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : null;
}
```

**Pros**: Skips hydration for this component
**Cons**: Still causes flash when it appears

## Requirements (Reiterated)

1. **No visual flash**: Accordion should appear in correct state immediately
2. **Menu visible**: Don't hide the menu during load
3. **No hydration errors**: Console should be clean
4. **SSR compatible**: Must work with Next.js server rendering
5. **Sidebar collapse intact**: Must integrate with sidebar collapse functionality
6. **LocalStorage persistence**: State must persist across page reloads

## Component Context

### File Location
- `components/nav-main.tsx` - The navigation accordion component

### Usage Location
- `components/app-sidebar.tsx` - Sidebar component that uses NavMain
- `components/dashboard-layout.tsx` - Layout that includes AppSidebar
- `app/layout.tsx` - Root layout that includes DashboardLayout

### Related Components
- `components/ui/collapsible.tsx` - Radix UI Collapsible wrapper
- `components/ui/sidebar.tsx` - Sidebar components from shadcn-ui

## Environment Variables & Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### next.config.ts
Standard Next.js 16 configuration with Turbopack enabled.

## Browser Compatibility

Target browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

localStorage is supported in all modern browsers.

## Performance Considerations

- localStorage reads are synchronous and fast
- useEffect runs after paint, so flash is visible
- Radix UI animations add to the visual impact

## Accessibility Requirements

- Must maintain ARIA attributes from Radix UI
- Keyboard navigation must work
- Screen reader announcements must be accurate
- Focus management must be preserved

## Question for AI Assistant

Given the constraints of Next.js SSR and the requirement to read localStorage for state persistence, how can we prevent the sidebar accordion from flashing when the page reloads, while:

1. Keeping the menu visible immediately (no hiding with opacity)
2. Avoiding hydration errors in the console
3. Maintaining integration with the sidebar collapse functionality
4. Using the shadcn-ui/Radix UI Collapsible component
5. Preserving accessibility features

The fundamental challenge is that the server cannot access localStorage, so it must render with empty state, while the client needs the localStorage state. This creates a state update after mount, which causes the visual flash. Is there a pattern or technique in Next.js/React that can solve this server-client state synchronization problem for localStorage-based state?

## React Hydration Deep Dive

### What is Hydration?

Hydration is the process by which React "attaches" event listeners to the existing HTML markup that was sent from the server. This happens in three phases:

1. **Server-Side Rendering (SSR)**: Next.js renders the component tree to HTML on the server
2. **Initial Client Render**: React renders the same component tree on the client
3. **Reconciliation**: React compares the server HTML with client HTML and attaches event listeners

### Hydration Requirements

For hydration to succeed, the following must be identical between server and client:

1. **HTML Structure**: Same element hierarchy and attributes
2. **Text Content**: Same text in text nodes
3. **HTML Attributes**: Same attribute values (class, id, data-*, etc.)
4. **Inline Styles**: Same style attribute values
5. **Component State**: Same initial state for controlled components

### Hydration Mismatch Detection

React detects mismatches by:
- Comparing the DOM tree structure
- Comparing attribute values
- Comparing text content
- Comparing inline styles

When a mismatch is detected:
- React logs a warning to the console
- React discards the server HTML
- React re-renders the entire component tree on the client
- This causes a "flash" as the UI is rebuilt

### Why localStorage Causes Hydration Issues

```tsx
// Server-side execution
const [state, setState] = useState(() => {
  if (typeof window === "undefined") return {}; // Returns {}
  return JSON.parse(localStorage.getItem("key")); // Never runs on server
});
// Result: state = {}

// Client-side execution
const [state, setState] = useState(() => {
  if (typeof window === "undefined") return {}; // Skipped
  return JSON.parse(localStorage.getItem("key")); // Runs
});
// Result: state = { "item": true }
```

The server and client produce different initial state, leading to different HTML, causing hydration mismatch.

## Next.js SSR Deep Dive

### Server Component vs Client Component

**Server Components** (default):
- Run only on the server
- Can access server resources (database, file system, cookies)
- Cannot use hooks (useState, useEffect)
- Cannot use browser APIs (window, localStorage)
- Render to HTML that is sent to the client

**Client Components** (with "use client"):
- Run on both server (for SSR) and client (for hydration)
- Can use hooks
- Can use browser APIs (after mount)
- Must have deterministic initial state

### The SSR Process in Next.js 16

1. **Request**: Browser requests a page
2. **Server Rendering**: Next.js renders the page to HTML
3. **Response**: HTML is sent to the browser
4. **Initial Load**: Browser displays the HTML
5. **JavaScript Load**: React and Next.js JavaScript loads
6. **Hydration**: React hydrates the page
7. **Interactive**: Page becomes interactive

### Why Server Can't Access localStorage

1. **Security**: localStorage is a browser-specific API tied to a specific origin
2. **Environment**: Server runs in Node.js, not a browser
3. **Isolation**: Each browser has its own localStorage, server has none
4. **Scope**: localStorage is per-origin, server handles multiple origins

## localStorage API Details

### localStorage Methods

```javascript
// Set an item
localStorage.setItem('key', 'value');

// Get an item
const value = localStorage.getItem('key');

// Remove an item
localStorage.removeItem('key');

// Clear all items
localStorage.clear();

// Get the number of items
const length = localStorage.length;

// Get the key at an index
const key = localStorage.key(0);
```

### localStorage Characteristics

- **Storage Limit**: ~5-10MB per origin (varies by browser)
- **Data Type**: Only stores strings (must JSON.stringify objects)
- **Persistence**: Persists across browser sessions
- **Scope**: Per origin (protocol + domain + port)
- **Synchronous**: Operations block the main thread
- **Same-Origin Policy**: Only accessible from same origin

### localStorage vs sessionStorage

| Feature | localStorage | sessionStorage |
|---------|--------------|----------------|
| Persistence | Persists across sessions | Cleared on tab close |
| Scope | Per origin | Per tab/window |
| Storage Limit | ~5-10MB | ~5-10MB |
| Access | Same origin | Same origin |

### localStorage Error Handling

```javascript
try {
  localStorage.setItem('key', JSON.stringify(data));
} catch (e) {
  // Possible errors:
  // - QuotaExceededError: Storage limit reached
  // - SecurityError: Privacy mode or blocked
  // - TypeError: Invalid key or value
  console.error('localStorage error:', e);
}
```

## Browser Storage Options Comparison

### Storage Mechanisms

| Storage Type | Server Access | Client Access | Persistence | Size Limit |
|--------------|---------------|---------------|-------------|------------|
| localStorage | No | Yes | Permanent | ~5-10MB |
| sessionStorage | No | Yes | Session | ~5-10MB |
| IndexedDB | No | Yes | Permanent | Large (GBs) |
| Cookies | Yes | Yes | Configurable | ~4KB |
| URL Params | Yes | Yes | Navigation | URL length |
| Memory State | No | Yes | Session | RAM |

### Why Cookies Are Viable for Server Access

Cookies are sent with every HTTP request, making them accessible on the server:

```tsx
// Server-side (Next.js)
import { cookies } from 'next/headers';

const cookieStore = cookies();
const savedState = cookieStore.get('nav-state');
const initialState = savedState ? JSON.parse(savedState.value) : {};
```

This is why Solution A (cookies) is promising - it allows server access to the state.

## Radix UI Collapsible Implementation Details

### Internal State Management

Radix UI Collapsible uses the `@radix-ui/react-collapsible` primitive:

```typescript
// Simplified internal implementation
function useCollapsible(props: CollapsibleProps) {
  const [open, setOpen] = useControllableState({
    prop: props.open,           // Controlled prop
    defaultProp: props.defaultOpen,  // Uncontrolled default
    onChange: props.onOpenChange,
  });

  return { open, setOpen };
}
```

### Animation Implementation

Radix UI uses CSS transitions for animations:

```css
[data-radix-collapsible-content] {
  transition: height 200ms ease-out, opacity 200ms ease-out;
  overflow: hidden;
}

[data-state="closed"] [data-radix-collapsible-content] {
  height: 0;
  opacity: 0;
}

[data-state="open"] [data-radix-collapsible-content] {
  height: auto;
  opacity: 1;
}
```

### Data Attributes

Radix UI sets data attributes on elements:

- `data-state="open"` or `data-state="closed"` on the root
- `data-radix-collapsible-content` on the content
- `data-radix-collapsible-trigger` on the trigger

These are used for CSS styling via Tailwind's `group-data-[state=open]` pattern.

### Accessibility Features

Radix UI includes:
- `aria-expanded` attribute on trigger
- `aria-controls` attribute linking trigger to content
- Keyboard navigation (Enter, Space to toggle)
- Focus management
- Screen reader announcements

## CSS Animation Details

### Transition Properties

```css
.chevron {
  transition: transform 200ms ease-in-out;
}

.chevron[data-state="open"] {
  transform: rotate(90deg);
}
```

### Why Animation Causes Flash

1. **Initial Render**: Chevron has `transform: rotate(0deg)`
2. **State Update**: Chevron needs `transform: rotate(90deg)`
3. **Transition**: CSS animates from 0deg to 90deg over 200ms
4. **Visual Result**: User sees the rotation animation

### Disabling Animation

```css
.chevron {
  transition: none !important;
}
```

Or via Tailwind:

```tsx
className="transition-none"
```

## Performance Profiling

### Measuring Flash Duration

```javascript
useEffect(() => {
  const start = performance.now();
  setExpandedItems(savedState);
  const end = performance.now();
  console.log(`State update took ${end - start}ms`);
}, []);
```

### Typical Timeline

1. **HTML Parse**: 10-50ms
2. **Initial Render**: 10-30ms
3. **useEffect Execution**: 0-5ms
4. **State Update**: 0-1ms
5. **Re-render**: 10-30ms
6. **Animation**: 200ms (CSS transition)

Total visible flash: ~200-300ms

### Optimizing localStorage Read

```javascript
// Synchronous read (current)
const saved = localStorage.getItem('key');

// Could use async pattern (not supported by localStorage)
// But could use IndexedDB which is async
```

localStorage is already fast (~0.1ms), so optimization isn't the issue.

## Testing Strategies

### Manual Testing

1. Open browser DevTools
2. Expand an accordion item
3. Reload the page
4. Observe if the item stays expanded or flashes

### Automated Testing

```javascript
// Playwright test
test('accordion state persists on reload', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="accordion-trigger"]');
  await page.reload();
  const isOpen = await page.getAttribute('[data-testid="accordion"]', 'data-state');
  expect(isOpen).toBe('open');
});
```

### Hydration Testing

```javascript
// Check for hydration errors in console
test('no hydration errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('/');
  expect(errors.some(e => e.includes('hydration'))).toBe(false);
});
```

## Alternative State Management Approaches

### Zustand with Persistence Middleware

```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useNavStore = create(
  persist(
    (set) => ({
      expandedItems: {} as Record<string, boolean>,
      toggleItem: (title: string) => set((state) => ({
        expandedItems: { ...state.expandedItems, [title]: !state.expandedItems[title] }
      })),
    }),
    {
      name: 'nav-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

**Pros**:
- Built-in hydration handling with `hydrate` option
- Simple API
- TypeScript support
- Can use custom storage adapters

**Cons**:
- Still has the same SSR issue with localStorage
- The `persist` middleware reads from localStorage on client mount
- Server still renders with empty state
- Hydration mismatch still occurs

### Zustand with Custom Cookie Storage

Zustand's persist middleware supports custom storage adapters. We could create a cookie-based storage:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Custom storage adapter that uses cookies
const cookieStorage = {
  getItem: (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  },
  setItem: (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  },
  removeItem: (name: string) => {
    document.cookie = `${name}=; path=/; max-age=0`;
  },
};

const useNavStore = create(
  persist(
    (set) => ({
      expandedItems: {} as Record<string, boolean>,
      toggleItem: (title: string) => set((state) => ({
        expandedItems: { ...state.expandedItems, [title]: !state.expandedItems[title] }
      })),
    }),
    {
      name: 'nav-storage',
      storage: cookieStorage,
    }
  )
);
```

**Pros**:
- Cookies are accessible on server
- Can be read in Next.js server components
- Solves the hydration mismatch

**Cons**:
- Custom storage adapter still only works on client
- Server can't read `document.cookie` in the adapter
- Need separate server-side cookie reading logic
- Still requires passing initial state from server

### Zustand with Server-Side Initial State

```tsx
// Server component
import { cookies } from 'next/headers';
import { NavStoreProvider } from './nav-store-provider';

export default function Layout({ children }) {
  const cookieStore = cookies();
  const navState = cookieStore.get('nav-storage');
  const initialState = navState ? JSON.parse(navState.value) : {};

  return (
    <NavStoreProvider initialState={initialState}>
      {children}
    </NavStoreProvider>
  );
}

// Client component
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNavStore = create(
  persist(
    (set) => ({
      expandedItems: {} as Record<string, boolean>,
      toggleItem: (title: string) => set((state) => ({
        expandedItems: { ...state.expandedItems, [title]: !state.expandedItems[title] }
      })),
    }),
    {
      name: 'nav-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Provider to set initial state
function NavStoreProvider({ children, initialState }: { children: React.ReactNode; initialState: Record<string, boolean> }) {
  useNavStore.setState({ expandedItems: initialState });
  return <>{children}</>;
}
```

**Pros**:
- Server can provide initial state via cookies
- Zustand handles state management
- localStorage for client-side persistence

**Cons**:
- Still requires cookie management
- Need to sync cookies and localStorage
- Additional complexity with provider pattern

### React Query (TanStack Query) Analysis

React Query is designed for **server state** (data fetched from APIs), not **client state** (UI state like accordion expansion). It's not suitable for this use case because:

```javascript
// React Query is for fetching data
const { data } = useQuery({
  queryKey: ['nav-state'],
  queryFn: async () => {
    // This would require an API endpoint
    const response = await fetch('/api/nav-state');
    return response.json();
  },
});
```

**Why React Query doesn't work**:
1. **Purpose**: React Query is for remote data fetching, not local UI state
2. **No localStorage integration**: Doesn't have built-in localStorage persistence
3. **API requirement**: Would need to create an API endpoint to store/retrieve state
4. **Overhead**: Unnecessary complexity for simple accordion state
5. **Network requests**: Would require network calls for simple UI state

**What React Query could do (but shouldn't)**:
```javascript
// Hypothetical - but not recommended
const { data: navState } = useQuery({
  queryKey: ['nav-state'],
  queryFn: () => {
    // Read from localStorage (not how React Query is meant to be used)
    const saved = localStorage.getItem('nav-state');
    return saved ? JSON.parse(saved) : {};
  },
  initialData: {}, // Still empty on server
});
```

This defeats the purpose of React Query and doesn't solve the SSR issue.

### Combined Approach: Zustand + Cookies + Server Props

The most robust solution using Zustand would be:

```tsx
// 1. Custom storage that syncs cookies and localStorage
const hybridStorage = {
  getItem: (name: string) => {
    // Try localStorage first (client)
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(name);
      if (local) return local;
    }
    // Fallback to cookie (server)
    return null; // Server reads cookies separately
  },
  setItem: (name: string, value: string) => {
    // Set both localStorage and cookie
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
      document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
      document.cookie = `${name}=; path=/; max-age=0`;
    }
  },
};

// 2. Zustand store with hybrid storage
const useNavStore = create(
  persist(
    (set) => ({
      expandedItems: {} as Record<string, boolean>,
      toggleItem: (title: string) => set((state) => ({
        expandedItems: { ...state.expandedItems, [title]: !state.expandedItems[title] }
      })),
    }),
    {
      name: 'nav-storage',
      storage: hybridStorage,
    }
  )
);

// 3. Server component reads cookies and passes initial state
export default function Layout({ children }) {
  const cookieStore = cookies();
  const navState = cookieStore.get('nav-storage');
  const initialState = navState ? JSON.parse(navState.value) : {};

  return (
    <html>
      <body>
        <NavStoreInitializer initialState={initialState}>
          <DashboardLayout>{children}</DashboardLayout>
        </NavStoreInitializer>
      </body>
    </html>
  );
}

// 4. Client component initializes Zustand with server state
function NavStoreInitializer({ children, initialState }: { children: React.ReactNode; initialState: Record<string, boolean> }) {
  useNavStore.setState({ expandedItems: initialState });
  return <>{children}</>;
}

// 5. Component uses Zustand
export function NavMain({ items }: NavMainProps) {
  const { expandedItems, toggleItem } = useNavStore();

  return (
    // ... use expandedItems and toggleItem
  );
}
```

**Pros**:
- Zustand provides clean state management
- Cookies enable server access
- localStorage for client persistence
- Type-safe with TypeScript

**Cons**:
- Significant complexity increase
- Need to maintain sync between cookies and localStorage
- Additional provider component
- More boilerplate than simple useState

### Why Zustand/React Query Don't Solve the Core Problem

The fundamental issue is **server cannot access localStorage**. Neither Zustand nor React Query can change this fact:

1. **Zustand with localStorage**: Still reads localStorage on client mount → hydration mismatch
2. **Zustand with cookies**: Requires custom implementation + server-side cookie reading
3. **React Query**: Not designed for this use case, would require API endpoint

The cookie-based solution is still needed regardless of whether we use Zustand or plain useState. Zustand just adds a layer of abstraction but doesn't solve the core SSR hydration problem.

### Context with SSR Support

```tsx
// Server component
import { NavProvider } from './nav-context';

export default function Layout({ children }) {
  const initialState = getInitialStateFromCookies();
  return (
    <NavProvider initialState={initialState}>
      {children}
    </NavProvider>
  );
}
```

**Pros**: Server can pass initial state
**Cons**: Requires cookie management

## CSS Solutions

### Using CSS Grid for Layout Stability

```css
.accordion-item {
  display: grid;
  grid-template-rows: auto 0fr;
  transition: grid-template-rows 200ms ease-out;
}

.accordion-item[data-open="true"] {
  grid-template-rows: auto 1fr;
}

.accordion-content {
  overflow: hidden;
}
```

**Pros**: Smooth animation, layout stability
**Cons**: Still needs state update

### Using Visibility Instead of Display

```css
.accordion-content {
  visibility: hidden;
  opacity: 0;
  transition: opacity 200ms ease-out;
}

.accordion-content[data-open="true"] {
  visibility: visible;
  opacity: 1;
}
```

**Pros**: Maintains layout space
**Cons**: Still needs state update

## Accessibility Guidelines

### ARIA Attributes Required

```html
<button
  aria-expanded="true"
  aria-controls="accordion-content-1"
  aria-label="Toggle accordion"
>
  Trigger
</button>

<div id="accordion-content-1" role="region">
  Content
</div>
```

### Keyboard Navigation

- **Enter/Space**: Toggle accordion
- **Escape**: Close accordion
- **Arrow Keys**: Navigate between items

### Screen Reader Announcements

```
"Accordion, expanded, press Enter to collapse"
"Accordion, collapsed, press Enter to expand"
```

Radix UI handles this automatically.

## Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| localStorage | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| CSS Transitions | ✅ | ✅ | ✅ | ✅ |
| data-* attributes | ✅ | ✅ | ✅ | ✅ |
| SSR/Hydration | ✅ | ✅ | ✅ | ✅ |

## Error Handling Patterns

### localStorage Quota Exceeded

```javascript
try {
  localStorage.setItem('key', value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Fallback to sessionStorage
    sessionStorage.setItem('key', value);
  }
}
```

### JSON Parse Errors

```javascript
try {
  const saved = JSON.parse(localStorage.getItem('key'));
} catch (e) {
  // Fallback to default state
  return {};
}
```

## Debugging Techniques

### React DevTools

1. Install React DevTools extension
2. Go to Components tab
3. Select NavMain component
4. Observe state changes in Hooks section
5. Watch `expandedItems` state update

### Console Logging

```javascript
useEffect(() => {
  console.log('Mounted, reading localStorage');
  const saved = localStorage.getItem(storageKey);
  console.log('Saved state:', saved);
  setExpandedItems(JSON.parse(saved || '{}'));
}, []);
```

### Network Tab

Check if cookies are being sent with the request:
1. Open DevTools Network tab
2. Reload page
3. Check request headers for Cookie header

## Related React Patterns

### The "No-Flash" Pattern

```tsx
function NoFlashComponent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="skeleton" />;
  }

  return <RealComponent />;
}
```

**Pros**: Prevents flash
**Cons**: Shows skeleton instead of real content

### The "Server-First" Pattern

```tsx
// Server component
export default function Page() {
  const data = await fetchData(); // Server can do this
  return <ClientComponent initialData={data} />;
}
```

**Pros**: Server can provide initial data
**Cons**: Doesn't work for localStorage

## Implementation of Solution A (Cookies)

### Step 1: Update localStorage to also set cookies

```tsx
const toggleItem = (title: string, isOpen: boolean) => {
  setExpandedItems((prev) => {
    const next = { ...prev, [title]: isOpen };
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      // Set cookie for server access
      document.cookie = `${storageKey}=${encodeURIComponent(
        JSON.stringify(next),
      )}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
    return next;
  });
};
```

### Step 2: Read cookies on server

```tsx
// app/layout.tsx (Server Component)
import { cookies } from 'next/headers';

export default function RootLayout({ children }) {
  const cookieStore = cookies();
  const navState = cookieStore.get('nav-main-expanded-Platform');
  const initialState = navState ? JSON.parse(navState.value) : {};

  return (
    <html>
      <body>
        <DashboardLayout navInitialState={initialState}>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
```

### Step 3: Pass initial state to component

```tsx
// components/dashboard-layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  navInitialState?: Record<string, boolean>;
}

export function DashboardLayout({ children, navInitialState = {} }: DashboardLayoutProps) {
  return (
    <AppSidebar initialState={navInitialState}>
      {children}
    </AppSidebar>
  );
}
```

### Step 4: Use initial state in component

```tsx
// components/nav-main.tsx
interface NavMainProps {
  items: NavItem[];
  label?: string;
  initialState?: Record<string, boolean>;
}

export function NavMain({ items, label = "Platform", initialState = {} }: NavMainProps) {
  const storageKey = `nav-main-expanded-${label}`;

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(initialState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read from localStorage for most up-to-date state
    let savedState: Record<string, boolean> = {};
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        savedState = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    setExpandedItems(savedState);
  }, [storageKey]);

  // ... rest of component
}
```

### Pros of Cookie Solution

1. **No Hydration Mismatch**: Server and client start with same state
2. **No Flash**: Accordion appears in correct state immediately
3. **Menu Visible**: No hiding during load
4. **SSR Compatible**: Works with Next.js server rendering
5. **Fallback**: localStorage still used for client-side updates

### Cons of Cookie Solution

1. **Cookie Size Limit**: ~4KB per cookie (may be insufficient for large state)
2. **Cookie Management**: Need to sync localStorage and cookies
3. **Security**: Cookies are sent with every request (minor concern for nav state)
4. **Complexity**: Additional code for cookie management

### Cookie Size Considerations

For a typical navigation state:
```json
{
  "Platform": true,
  "Settings": false,
  "Cloud": true
}
```

This is ~50 bytes, well within the 4KB limit. Cookie solution is viable.

## Implementation of Solution B (Disable Animation)

### Step 1: Override Radix UI animation

```css
/* app/globals.css */
[data-radix-collapsible-content] {
  transition: none !important;
}

.group-data-[state=open]/collapsible .ml-auto {
  transition: none !important;
}
```

### Step 2: Or remove transition class

```tsx
<ChevronRight className="ml-auto group-data-[state=open]/collapsible:rotate-90" />
```

Remove `transition-transform duration-200`.

### Pros of Disable Animation Solution

1. **Simple**: Minimal code change
2. **Less Noticeable**: Instant state change instead of animated
3. **No Additional Complexity**: No cookie management

### Cons of Disable Animation Solution

1. **Still Has Flash**: State still changes after mount
2. **Less Polished**: No smooth transitions
3. **User Experience**: Jarring instant changes

## Recommended Approach

Based on the analysis, **Solution A (Cookies)** is the most robust solution because:

1. It solves the root cause (server-client state mismatch)
2. It meets all requirements (no flash, menu visible, no hydration errors)
3. It's a well-established pattern in Next.js applications
4. The cookie size is not a concern for navigation state

The implementation requires:
1. Setting cookies when localStorage is updated
2. Reading cookies on the server
3. Passing initial state through the component tree
4. Using initial state in useState

This is a common pattern used by many Next.js applications for client-side state that needs to be available during SSR.

## Additional Resources

### React Documentation
- [React Hydration](https://react.dev/reference/react-dom/client/hydrate)
- [React Server Components](https://react.dev/reference/react/use-server)

### Next.js Documentation
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Cookies](https://nextjs.org/docs/app/api-reference/next/headers#cookies)

### Radix UI Documentation
- [Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible)
- [Animation](https://www.radix-ui.com/docs/primitives/overview/styling#animations)

### shadcn-ui Documentation
- [Collapsible Component](https://ui.shadcn.com/docs/components/collapsible)
- [Theming](https://ui.shadcn.com/docs/theming)

## Conclusion

The sidebar accordion flashing issue is a classic SSR hydration problem caused by the inability to access localStorage on the server. After extensive testing of multiple approaches including:

1. **Prop drilling with cookies**: Server reads cookies and passes through component tree
2. **Zustand with persist middleware**: Uses Zustand's built-in persistence
3. **Zustand with custom storage**: Custom storage adapter reading cookies
4. **Zustand with manual initialization**: Client component initializes store from cookies

**The fundamental issue remains unsolvable with the current constraints:**

- Server renders HTML with empty state (Zustand store is empty on server)
- Client initializes Zustand store from cookies after mount
- React detects mismatch between server HTML (empty) and client HTML (with state)
- Even with synchronous initialization in client component, the server HTML is already sent

**Why it's impossible to solve:**

1. **Zustand is client-only**: Zustand store doesn't exist on the server, so server cannot initialize it
2. **Server renders first**: Server HTML is generated and sent before any client-side code runs
3. **NavStoreInitializer is client component**: Even with synchronous setState, it runs after server HTML is sent
4. **Collapsible controlled prop**: The `open` prop differs between server (false) and client (true), causing mismatch

**The only theoretical solution would require:**

- Server-side rendering with access to the same state store as client
- This would require a completely different architecture (e.g., using a server-side state management system that syncs with client)
- Not feasible with current Next.js + Zustand + localStorage architecture

**Final recommendation:**

Accept the brief flash as a trade-off for SSR benefits. The flash is minimal (~200ms) and only occurs on page reload. Alternative approaches like:
- Disabling SSR for the sidebar (breaks SEO)
- Hiding the menu during load (poor UX)
- Using URL params for state (pollutes URL)

All have worse trade-offs than accepting the flash.

**Status: NOT SOLVABLE with current architecture constraints.**

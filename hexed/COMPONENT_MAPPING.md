# @midday/ui to shadcn-ui Component Mapping

This document maps @midday/ui components to their shadcn-ui equivalents for the EDMS integration.

## Direct Replacements

| @midday/ui | shadcn-ui | Notes |
|------------|-----------|-------|
| Button | Button | Direct replacement, same API |
| Card | Card | Direct replacement, same API |
| CardContent | CardContent | Direct replacement |
| CardDescription | CardDescription | Direct replacement |
| CardHeader | CardHeader | Direct replacement |
| CardTitle | CardTitle | Direct replacement |
| Tabs | Tabs | Direct replacement, same API |
| TabsContent | TabsContent | Direct replacement |
| TabsList | TabsList | Direct replacement |
| TabsTrigger | TabsTrigger | Direct replacement |
| Badge | Badge | Direct replacement |
| Dialog | Dialog | Direct replacement |
| DialogContent | DialogContent | Direct replacement |
| DialogDescription | DialogDescription | Direct replacement |
| DialogFooter | DialogFooter | Direct replacement |
| DialogHeader | DialogHeader | Direct replacement |
| DialogTitle | DialogTitle | Direct replacement |
| Sheet | Sheet | Direct replacement |
| SheetContent | SheetContent | Direct replacement |
| SheetDescription | SheetDescription | Direct replacement |
| SheetFooter | SheetFooter | Direct replacement |
| SheetHeader | SheetHeader | Direct replacement |
| SheetTitle | SheetTitle | Direct replacement |
| Popover | Popover | Direct replacement |
| PopoverContent | PopoverContent | Direct replacement |
| PopoverTrigger | PopoverTrigger | Direct replacement |
| Input | Input | Direct replacement |
| Label | Label | Direct replacement |
| Select | Select | Direct replacement |
| SelectContent | SelectContent | Direct replacement |
| SelectItem | SelectItem | Direct replacement |
| SelectTrigger | SelectTrigger | Direct replacement |
| SelectValue | SelectValue | Direct replacement |
| Checkbox | Checkbox | Direct replacement |
| Switch | Switch | Direct replacement |
| Slider | Slider | Direct replacement |
| Textarea | Textarea | Direct replacement |
| Table | Table | Direct replacement |
| TableBody | TableBody | Direct replacement |
| TableCell | TableCell | Direct replacement |
| TableHead | TableHead | Direct replacement |
| TableHeader | TableHeader | Direct replacement |
| TableRow | TableRow | Direct replacement |
| Avatar | Avatar | Direct replacement |
| AvatarFallback | AvatarFallback | Direct replacement |
| AvatarImage | AvatarImage | Direct replacement |
| DropdownMenu | DropdownMenu | Direct replacement |
| DropdownMenuContent | DropdownMenuContent | Direct replacement |
| DropdownMenuItem | DropdownMenuItem | Direct replacement |
| DropdownMenuTrigger | DropdownMenuTrigger | Direct replacement |
| Tooltip | Tooltip | Direct replacement |
| TooltipContent | TooltipContent | Direct replacement |
| TooltipProvider | TooltipProvider | Direct replacement |
| TooltipTrigger | TooltipTrigger | Direct replacement |
| Progress | Progress | Direct replacement |
| Skeleton | Skeleton | Direct replacement |
| Separator | Separator | Direct replacement |
| ScrollArea | ScrollArea | Direct replacement |
| Command | Command | Direct replacement |

## Custom Components (Need Recreation)

These @midday/ui components don't have direct shadcn-ui equivalents and may need custom implementation:

| @midday/ui | Notes |
|------------|-------|
| MetricCard | Custom component, needs recreation with shadcn-ui Card |
| StatusBadge | Custom component, needs recreation with shadcn-ui Badge |
| DataState | Custom component, needs recreation |
| CollapsibleSummary | Custom component, needs recreation with shadcn-ui Collapsible |
| ScrollableContent | Custom component, needs recreation with shadcn-ui ScrollArea |

## Import Path Changes

**From:**
```tsx
import { Button } from "@midday/ui/button";
import { Card } from "@midday/ui/card";
```

**To:**
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## API Differences

Most components have identical APIs. Key differences to watch for:

1. **Dialog vs Sheet**: @midday/ui may use Dialog where shadcn-ui uses Sheet for side panels
2. **Form components**: @midday/ui may have form-specific components that need to be replaced with shadcn-ui Form components
3. **Data Table**: @midday/ui may have a custom data table, use the project's existing data-table component from `@/components/data-table/data-table`

## Migration Steps

For each file:
1. Replace all `@midday/ui` imports with `@/components/ui` imports
2. Update component names if they differ (usually they don't)
3. Check for custom components and recreate them using shadcn-ui primitives
4. Test the component to ensure it works correctly

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function ThemePreviewPanel() {
  return (
    <div className="flex h-full min-h-[70vh] flex-col overflow-hidden border border-border bg-background">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Preview</h2>
        <p className="text-sm text-muted-foreground">
          See how your theme looks in different components
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Various button styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Form input elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preview-input">Text Input</Label>
                <Input id="preview-input" placeholder="Enter text..." />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="preview-switch" />
                <Label htmlFor="preview-switch">Toggle switch</Label>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Card Component</CardTitle>
              <CardDescription>
                This is a card with header and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Card content goes here. This demonstrates the card background,
                foreground, and border colors.
              </p>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Text styles and hierarchy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <h3 className="text-2xl font-medium">Heading 3</h3>
              <p className="text-base">Regular paragraph text</p>
              <p className="text-sm text-muted-foreground">
                Muted text for secondary information
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Color Swatches */}
          <Card>
            <CardHeader>
              <CardTitle>Color Swatches</CardTitle>
              <CardDescription>Current theme colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-primary" />
                  <p className="text-xs font-medium">Primary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-secondary" />
                  <p className="text-xs font-medium">Secondary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-accent" />
                  <p className="text-xs font-medium">Accent</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-muted" />
                  <p className="text-xs font-medium">Muted</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-destructive" />
                  <p className="text-xs font-medium">Destructive</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-background border border-border" />
                  <p className="text-xs font-medium">Background</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

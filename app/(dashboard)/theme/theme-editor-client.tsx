"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ScrollableContent } from "@/components/scrollable-content";
import { ColorsTabContent } from "@/components/theme-editor/colors-tab-content";
import { FontPicker } from "@/components/theme-editor/font-picker";
import { SliderWithInput } from "@/components/theme-editor/slider-with-input";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultPresets } from "@/lib/theme-presets";
import { useThemeStore } from "@/store/theme-store";
import type { ThemeStyleProps } from "@/types/theme";

const THEME_PRESETS = Object.entries(defaultPresets).map(([id, preset]) => ({
  id,
  name: preset.label,
  description: preset.createdAt || "Custom theme",
  colors: preset.styles,
}));

export function ThemeEditorClient() {
  const { resolvedTheme, setTheme } = useTheme();
  const themeState = useThemeStore((state) => state.themeState);
  const setColor = useThemeStore((state) => state.setColor);
  const _resetToDefault = useThemeStore((state) => state.resetToDefault);
  const [selectedPreset, setSelectedPreset] = useState("zinc");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentMode = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const currentColors = themeState[currentMode];

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      Object.entries(preset.colors[currentMode]).forEach(([key, value]) => {
        setColor(key as any, value as string);
      });
      setSelectedPreset(presetId);
    }
  };

  if (!mounted) {
    return (
      <ScrollableContent>
        <div className="flex flex-col gap-6 px-8 pt-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Theme Editor
            </h1>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              Choose from beautiful themes or customize your workspace with
              colors, fonts, and layout.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading theme editor...</p>
          </div>
        </div>
      </ScrollableContent>
    );
  }

  return (
    <ScrollableContent>
      <div className="flex flex-col gap-6 px-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Theme Editor
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Choose from beautiful themes or customize your workspace with
            colors, fonts, and layout.
          </p>
        </div>

        <div className="flex gap-6 min-h-0">
          {/* Left Sidebar - Configuration */}
          <div className="w-80 flex-shrink-0 space-y-4">
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="presets" className="flex flex-col">
                  <div className="border-b border-border px-4">
                    <TabsList className="grid w-full grid-cols-2 h-9 mb-6">
                      <TabsTrigger value="presets" className="text-xs">
                        Presets
                      </TabsTrigger>
                      <TabsTrigger value="custom" className="text-xs">
                        Custom
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="presets" className="mt-0 p-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-4 pr-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-medium">
                            Themes ({THEME_PRESETS.length})
                          </h3>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant={
                                currentMode === "light" ? "default" : "outline"
                              }
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => setTheme("light")}
                            >
                              Light
                            </Button>
                            <Button
                              type="button"
                              variant={
                                currentMode === "dark" ? "default" : "outline"
                              }
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => setTheme("dark")}
                            >
                              Dark
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {THEME_PRESETS.map((preset) => (
                            <Button
                              key={preset.id}
                              variant={
                                selectedPreset === preset.id
                                  ? "default"
                                  : "outline"
                              }
                              className="w-full justify-start text-sm h-9"
                              onClick={() => applyPreset(preset.id)}
                            >
                              {preset.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="custom" className="mt-0 p-4">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-4 pr-2">
                        <div className="space-y-3">
                          <h3 className="text-xs font-medium">Colors</h3>
                          <ColorsTabContent
                            currentStyles={currentColors as ThemeStyleProps}
                            updateStyle={(key, value) =>
                              setColor(key as any, value as string, currentMode)
                            }
                            updateStyles={(updates) => {
                              Object.entries(updates).forEach(
                                ([key, value]) => {
                                  setColor(
                                    key as any,
                                    value as string,
                                    currentMode,
                                  );
                                },
                              );
                            }}
                          />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h3 className="text-xs font-medium">Typography</h3>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="theme-font-sans"
                                className="text-xs"
                              >
                                Sans
                              </Label>
                              <FontPicker
                                value={themeState[currentMode]["font-sans"]}
                                category="sans-serif"
                                onSelect={(font) =>
                                  setColor(
                                    "font-sans",
                                    `${font.family}, ${font.category}`,
                                    currentMode,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="theme-font-serif"
                                className="text-xs"
                              >
                                Serif
                              </Label>
                              <FontPicker
                                value={themeState[currentMode]["font-serif"]}
                                category="serif"
                                onSelect={(font) =>
                                  setColor(
                                    "font-serif",
                                    `${font.family}, ${font.category}`,
                                    currentMode,
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="theme-font-mono"
                                className="text-xs"
                              >
                                Mono
                              </Label>
                              <FontPicker
                                value={themeState[currentMode]["font-mono"]}
                                category="monospace"
                                onSelect={(font) =>
                                  setColor(
                                    "font-mono",
                                    `${font.family}, ${font.category}`,
                                    currentMode,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <SliderWithInput
                                value={Number.parseFloat(
                                  themeState[currentMode][
                                    "letter-spacing"
                                  ].replace("em", "") || "0",
                                )}
                                onChange={(value) =>
                                  setColor(
                                    "letter-spacing",
                                    `${value}em`,
                                    currentMode,
                                  )
                                }
                                min={-0.5}
                                max={0.5}
                                step={0.025}
                                unit="em"
                                label="Letter Spacing"
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h3 className="text-xs font-medium">Layout</h3>
                          <div className="space-y-3">
                            <div>
                              <SliderWithInput
                                value={Number.parseFloat(
                                  themeState[currentMode].radius.replace(
                                    "rem",
                                    "",
                                  ) || "0.5",
                                )}
                                onChange={(value) =>
                                  setColor("radius", `${value}rem`, currentMode)
                                }
                                min={0}
                                max={4}
                                step={0.025}
                                unit="rem"
                                label="Border Radius"
                              />
                            </div>

                            <div>
                              <SliderWithInput
                                value={Number.parseFloat(
                                  themeState[currentMode].spacing?.replace(
                                    "rem",
                                    "",
                                  ) || "0.25",
                                )}
                                onChange={(value) =>
                                  setColor(
                                    "spacing",
                                    `${value}rem`,
                                    currentMode,
                                  )
                                }
                                min={0.15}
                                max={0.5}
                                step={0.01}
                                unit="rem"
                                label="Spacing"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Component Preview */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardHeader>
                <CardTitle>Component Preview</CardTitle>
                <CardDescription>
                  See how your theme looks with shadcn-ui components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Sign In</CardTitle>
                      <CardDescription className="text-xs">
                        Enter your credentials to access your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="remember"
                            className="rounded"
                          />
                          <Label htmlFor="remember" className="text-sm">
                            Remember me
                          </Label>
                        </div>
                        <Button variant="link" className="h-auto p-0 text-xs">
                          Forgot password?
                        </Button>
                      </div>
                      <Button className="w-full">Sign In</Button>
                      <div className="text-center text-xs text-muted-foreground">
                        Don't have an account?{" "}
                        <Button variant="link" className="h-auto p-0 text-xs">
                          Sign up
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">User Profile</CardTitle>
                      <CardDescription className="text-xs">
                        Manage your account settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">
                            john@example.com
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email notifications</span>
                        <Switch />
                      </div>
                      <Button className="w-full">Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Team Members</CardTitle>
                      <CardDescription className="text-xs">
                        Manage your team and permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary" />
                            <div>
                              <p className="text-sm font-medium">
                                Alice Johnson
                              </p>
                              <p className="text-xs text-muted-foreground">
                                alice@example.com
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">Admin</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-secondary" />
                            <div>
                              <p className="text-sm font-medium">Bob Smith</p>
                              <p className="text-xs text-muted-foreground">
                                bob@example.com
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">Member</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-accent" />
                            <div>
                              <p className="text-sm font-medium">Carol White</p>
                              <p className="text-xs text-muted-foreground">
                                carol@example.com
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">Member</Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        + Add Member
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Pricing Plans</CardTitle>
                      <CardDescription className="text-xs">
                        Choose the plan that fits your needs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Free</p>
                            <p className="text-xs text-muted-foreground">
                              $0/month
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg ring-2 ring-primary">
                          <div>
                            <p className="text-sm font-medium">Pro</p>
                            <p className="text-xs text-muted-foreground">
                              $29/month
                            </p>
                          </div>
                          <Button size="sm">Select</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Enterprise</p>
                            <p className="text-xs text-muted-foreground">
                              $99/month
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Task List</CardTitle>
                      <CardDescription className="text-xs">
                        Track your daily tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="task1" className="rounded" />
                        <Label htmlFor="task1" className="text-sm">
                          Review project proposal
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="task2" className="rounded" />
                        <Label htmlFor="task2" className="text-sm">
                          Update documentation
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="task3"
                          className="rounded"
                          defaultChecked
                        />
                        <Label
                          htmlFor="task3"
                          className="text-sm line-through text-muted-foreground"
                        >
                          Design mockups
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="task4" className="rounded" />
                        <Label htmlFor="task4" className="text-sm">
                          Team meeting
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new task..."
                          className="flex-1"
                        />
                        <Button size="sm">Add</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Notification Settings
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Configure how you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Email notifications
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Receive email updates
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Push notifications
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Receive push alerts
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            SMS notifications
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Receive text messages
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>Notification frequency</Label>
                        <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <option>Instant</option>
                          <option>Daily digest</option>
                          <option>Weekly summary</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollableContent>
  );
}

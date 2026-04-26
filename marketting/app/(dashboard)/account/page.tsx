"use client";

import {
  Bell,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShoppingCart,
  User,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile" className="text-xs md:text-sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" className="text-xs md:text-sm">
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payment" className="text-xs md:text-sm">
              Payment
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs md:text-sm">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <Avatar className="h-16 w-16 md:h-24 md:w-24">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className="text-lg md:text-2xl">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">
                      John Doe
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      john.doe@example.com
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Regular Customer
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue="John"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue="Doe"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@example.com"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      defaultValue="+880 1XXX-XXXXXX"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button>Save Changes</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">৳15,450</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">
                    Wishlist Items
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">My Addresses</h2>
              <Button size="sm" className="w-full sm:w-auto">
                Add New Address
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Home</CardTitle>
                    <Badge variant="default">Default</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-muted-foreground">
                    +880 1XXX-XXXXXX
                  </p>
                  <p className="text-sm text-muted-foreground">
                    House 12, Road 5, Dhanmondi
                  </p>
                  <p className="text-sm text-muted-foreground">Dhaka, 1205</p>
                  <p className="text-sm text-muted-foreground">Bangladesh</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-muted-foreground">
                    +880 1XXX-XXXXXX
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Floor 8, Gulshan Avenue
                  </p>
                  <p className="text-sm text-muted-foreground">Dhaka, 1212</p>
                  <p className="text-sm text-muted-foreground">Bangladesh</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                  <Button variant="outline" size="sm">
                    Set Default
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment Methods</h2>
              <Button>Add Payment Method</Button>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">bKash</p>
                        <p className="text-sm text-muted-foreground">
                          +880 1XXX-XXXXXX
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">Default</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      <div>
                        <p className="font-semibold text-sm md:text-base">
                          Nagad
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          +880 1XXX-XXXXXX
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Set Default
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5" />
                    <div>
                      <p className="font-semibold">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive order updates and promotions
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    <div>
                      <p className="font-semibold">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive delivery updates via SMS
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disabled
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    <div>
                      <p className="font-semibold">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add extra security to your account
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

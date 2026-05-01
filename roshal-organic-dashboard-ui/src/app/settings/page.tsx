
"use client"

import * as React from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Truck, MapPin, Save, RefreshCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  
  // Local state for delivery charges
  const [deliverySettings, setDeliverySettings] = React.useState({
    insideDhaka: 60,
    outsideDhaka: 120,
    freeDeliveryThreshold: 2000,
    enableFreeDelivery: false
  })

  const handleSave = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Settings Saved",
        description: "Delivery charges have been updated successfully.",
      })
    }, 800)
  }

  const handleReset = () => {
    setDeliverySettings({
      insideDhaka: 60,
      outsideDhaka: 120,
      freeDeliveryThreshold: 2000,
      enableFreeDelivery: false
    })
    toast({
      title: "Settings Reset",
      description: "Values have been restored to defaults.",
    })
  }

  return (
    <>
      <DashboardHeader title="System Settings" />
      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold font-headline">Store Configuration</h2>
          <p className="text-muted-foreground">Manage your store's global parameters and delivery logistics.</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <CardTitle className="font-headline text-xl">Delivery Charge System</CardTitle>
              </div>
              <CardDescription>
                Configure shipping costs based on customer location. These rates are applied during checkout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="insideDhaka" className="font-semibold">Inside Dhaka Charge (BDT)</Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">৳</span>
                    <Input 
                      id="insideDhaka" 
                      type="number" 
                      className="pl-8" 
                      value={deliverySettings.insideDhaka}
                      onChange={(e) => setDeliverySettings({...deliverySettings, insideDhaka: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Applied when 'Dhaka' is selected as the shipping district.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="outsideDhaka" className="font-semibold">Outside Dhaka Charge (BDT)</Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">৳</span>
                    <Input 
                      id="outsideDhaka" 
                      type="number" 
                      className="pl-8" 
                      value={deliverySettings.outsideDhaka}
                      onChange={(e) => setDeliverySettings({...deliverySettings, outsideDhaka: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Applied for all other districts outside of Dhaka.</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Free Delivery Threshold</Label>
                    <p className="text-sm text-muted-foreground">Enable free shipping for orders above a certain amount.</p>
                  </div>
                  <Switch 
                    checked={deliverySettings.enableFreeDelivery}
                    onCheckedChange={(checked) => setDeliverySettings({...deliverySettings, enableFreeDelivery: checked})}
                  />
                </div>

                {deliverySettings.enableFreeDelivery && (
                  <div className="space-y-2 max-w-[200px]">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">৳</span>
                      <Input 
                        type="number" 
                        className="pl-8" 
                        value={deliverySettings.freeDeliveryThreshold}
                        onChange={(e) => setDeliverySettings({...deliverySettings, freeDeliveryThreshold: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
              <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reset Defaults
              </Button>
              <Button onClick={handleSave} disabled={loading} className="bg-primary text-white shadow-md px-8">
                {loading ? "Saving..." : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Delivery Rules
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-950/10">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300">How it works</h4>
                  <p className="text-sm text-blue-800/70 dark:text-blue-400/70 leading-relaxed">
                    When a customer places an order, the system checks their provided "District". 
                    If the district is <strong>Dhaka</strong>, the charge will be ৳{deliverySettings.insideDhaka}. 
                    For any other selection, the system applies the outside charge of ৳{deliverySettings.outsideDhaka}.
                    {deliverySettings.enableFreeDelivery && ` Orders exceeding ৳${deliverySettings.freeDeliveryThreshold} will automatically have delivery charges waived.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

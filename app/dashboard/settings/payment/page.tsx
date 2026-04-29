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

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6 lg:p-6 p-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Payment Integrations
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage bKash, Nagad, and Rocket methods.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>bKash Manual Instructions</CardTitle>
            <CardDescription>
              Upload screenshot and instructions for bKash.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Wallet Number</Label>
              <Input defaultValue="+8801XXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>QR Code / Screenshot Guide</Label>
              <Input type="file" accept="image/*" />
            </div>
            <Button>Save bKash settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nagad Manual Instructions</CardTitle>
            <CardDescription>
              Upload screenshot and instructions for Nagad.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Wallet Number</Label>
              <Input defaultValue="+8801XXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>QR Code / Screenshot Guide</Label>
              <Input type="file" accept="image/*" />
            </div>
            <Button>Save Nagad settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rocket Manual Instructions</CardTitle>
            <CardDescription>
              Upload screenshot and instructions for Rocket.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Wallet Number</Label>
              <Input defaultValue="+8801XXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>QR Code / Screenshot Guide</Label>
              <Input type="file" accept="image/*" />
            </div>
            <Button>Save Rocket settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

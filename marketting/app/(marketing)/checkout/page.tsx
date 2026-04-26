"use client";

import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  Phone,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const cartItems = [
    {
      id: 1,
      name: "খাঁটি মধু",
      nameEn: "Pure Honey",
      price: "৳৪৫০",
      quantity: 2,
      image: "/honey-2.jpg",
    },
    {
      id: 2,
      name: "অর্গানিক ঘি",
      nameEn: "Organic Ghee",
      price: "৳৮০০",
      quantity: 1,
      image: "/ghee-2.jpg",
    },
  ];

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + parseFloat(item.price.replace(/[৳]/g, "")) * item.quantity,
    0,
  );
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="+880 1XXX-XXXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" placeholder="House no, Road no, Area" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhaka">Dhaka</SelectItem>
                      <SelectItem value="chittagong">Chittagong</SelectItem>
                      <SelectItem value="sylhet">Sylhet</SelectItem>
                      <SelectItem value="rajshahi">Rajshahi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" placeholder="1000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderNotes" className="text-sm md:text-base">
                  Order Notes (Optional)
                </Label>
                <Input
                  id="orderNotes"
                  placeholder="Any special instructions for delivery"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>Cash on Delivery</span>
                      </div>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay when you receive your order
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="bkash" id="bkash" />
                  <Label htmlFor="bkash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>bKash</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay instantly with bKash
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="nagad" id="nagad" />
                  <Label htmlFor="nagad" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Nagad</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay instantly with Nagad
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit/Debit Card</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Visa, Mastercard, American Express
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.nameEn}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-semibold">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-৳0</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">৳{total}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <Label htmlFor="promoCode" className="text-sm md:text-base">
                  Promo Code
                </Label>
                <div className="flex gap-2">
                  <Input id="promoCode" placeholder="Enter code" />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Your payment information is secure</span>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) =>
                    setAgreeTerms(checked as boolean)
                  }
                />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-tight cursor-pointer"
                >
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={!agreeTerms}
                onClick={() => console.log("Place order")}
              >
                Place Order - ৳{total}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

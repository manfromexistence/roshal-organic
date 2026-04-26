import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          যোগাযোগ করুন
        </h1>
        <p className="text-xl text-muted-foreground text-center mb-12">
          আমাদের সাথে যোগাযোগ করতে নিচের ফর্মটি পূরণ করুন অথবা সরাসরি কল করুন
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>বার্তা পাঠান</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">নাম</Label>
                  <Input id="name" placeholder="আপনার নাম" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">ফোন নম্বর</Label>
                  <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">বিষয়</Label>
                  <Input id="subject" placeholder="আপনার বার্তার বিষয়" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">বার্তা</Label>
                  <Textarea
                    id="message"
                    placeholder="আপনার বার্তা লিখুন..."
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  বার্তা পাঠান
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>যোগাযোগের তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">ঠিকানা</h3>
                    <p className="text-muted-foreground">ঢাকা, বাংলাদেশ</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">ফোন</h3>
                    <p className="text-muted-foreground">+880 1719-403627</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">ইমেইল</h3>
                    <p className="text-muted-foreground">
                      info@roshalorganic.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">ব্যবসায়িক সময়</h3>
                    <p className="text-muted-foreground">
                      সকাল ৯টা - সন্ধ্যা ৬টা
                      <br />
                      শুক্রবার: সকাল ৯টা - দুপুর ২টা
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>দ্রুত অর্ডার?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 opacity-90">
                  দ্রুত অর্ডারের জন্য সরাসরি আমাদের কল করুন
                </p>
                <Button variant="secondary" className="w-full" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  এখনই কল করুন
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

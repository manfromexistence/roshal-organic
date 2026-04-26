import { Heart, Leaf, Shield, Sprout, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center flex items-center justify-center gap-3">
          <Leaf className="h-10 w-10 text-primary" />
          Roshal Organic – পরিচিতি
        </h1>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-muted-foreground leading-relaxed">
            Roshal Organic একটি প্রাকৃতিক ও স্বাস্থ্যসম্মত খাদ্য ব্র্যান্ড, যেখানে আমরা চেষ্টা করি
            মানুষের কাছে পৌঁছে দিতে সম্পূর্ণ খাঁটি ও অর্গানিক খাবার। আমাদের লক্ষ্য হলো
            রাসায়নিকমুক্ত, ভেজালহীন এবং স্বাস্থ্যকর খাবার সরবরাহ করা, যা মানুষের দৈনন্দিন জীবনে
            সুস্থতা ও শক্তি যোগায়।
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            আমরা বিশ্বাস করি—প্রকৃতির কাছ থেকে পাওয়া খাবারই সবচেয়ে নিরাপদ ও পুষ্টিকর। তাই
            Roshal Organic এ আমরা দেশি কৃষক ও প্রাকৃতিক উৎস থেকে সংগ্রহ করা পণ্য নিয়ে কাজ
            করি, যেমন অর্গানিক ফল, মধু, ঘি, গুড়, তেল ও অন্যান্য প্রাকৃতিক খাদ্য।
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            আমাদের লক্ষ্য
          </h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground text-center">
                মানুষকে স্বাস্থ্যকর জীবনযাপনে উৎসাহিত করা এবং অর্গানিক খাদ্যের প্রতি আস্থা তৈরি
                করা।
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            আমাদের প্রতিশ্রুতি
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      ১০০% খাঁটি ও প্রাকৃতিক পণ্য
                    </h3>
                    <p className="text-muted-foreground">
                      আমরা নিশ্চিত করি যে আমাদের প্রতিটি পণ্য ১০০% খাঁটি এবং প্রাকৃতিক।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      কোনো প্রিজারভেটিভ বা কেমিক্যাল নেই
                    </h3>
                    <p className="text-muted-foreground">
                      আমাদের পণ্যে কোনো ক্ষতিকর রাসায়নিক বা প্রিজারভেটিভ থাকে না।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      সরাসরি কৃষক ও প্রাকৃতিক উৎস থেকে সংগ্রহ
                    </h3>
                    <p className="text-muted-foreground">
                      আমরা সরাসরি দেশি কৃষক এবং প্রাকৃতিক উৎস থেকে পণ্য সংগ্রহ করি।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      গ্রাহকের সন্তুষ্টি আমাদের অগ্রাধিকার
                    </h3>
                    <p className="text-muted-foreground">
                      আমরা সর্বদা গ্রাহকের সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">আমাদের সম্পর্কে</h2>
          <p className="text-muted-foreground text-center leading-relaxed">
            Roshal Organic শুরু হয়েছিল একটি স্বপ্ন নিয়ে—মানুষের কাছে খাঁটি ও স্বাস্থ্যকর খাবার
            পৌঁছে দেওয়া। আজকাল বাজারে ভেজালের ভিড়ে আসল জিনিস খুঁজে পাওয়া কঠিন। তাই আমরা
            নিজেরাই এগিয়ে এসেছি সত্যিকারের খাঁটি পণ্য মানুষের কাছে পৌঁছে দিতে। আমরা বিশ্বাস
            করি স্বাস্থ্যই সব সম্পদ, আর স্বাস্থ্যের জন্য খাঁটি খাবার অপরিহার্য।
          </p>
        </div>
      </div>
    </div>
  );
}

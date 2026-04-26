"use client";

import { useEffect, useState } from "react";

type Language = "bn" | "en";

export function MarketingFooter() {
  const [language, setLanguage] = useState<Language>("bn");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail);
    };

    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener,
      );
    };
  }, []);

  return (
    <>
      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logo.png"
                  alt="Roshal Organic"
                  className="h-8 w-auto rounded-md"
                />
                <span className="font-bold text-foreground">
                  Roshal Organic
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "bn"
                  ? "১০০% খাঁটি ও প্রাকৃতিক খাদ্য ব্র্যান্ড"
                  : "100% Pure & Natural Food Brand"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "bn"
                  ? "আমরা প্রতিশ্রুতি দিচ্ছি সেরা মানের পণ্য সরবরাহ করার।"
                  : "We are committed to delivering the highest quality products."}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                {language === "bn" ? "দ্রুত লিংক" : "Quick Links"}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    {language === "bn" ? "হোম" : "Home"}
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    {language === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
                    className="hover:text-primary transition-colors"
                  >
                    {language === "bn" ? "পণ্যসমূহ" : "Products"}
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    {language === "bn" ? "যোগাযোগ" : "Contact"}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                {language === "bn" ? "যোগাযোগ তথ্য" : "Contact Info"}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  {language === "bn" ? "ঢাকা, বাংলাদেশ" : "Dhaka, Bangladesh"}
                </li>
                <li>+880 1719-403627</li>
                <li>info@roshalorganic.com</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                {language === "bn" ? "অনুসরণ করুন" : "Follow Us"}
              </h3>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Facebook
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Instagram
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Twitter
                </button>
              </div>
            </div>
          </div>

          {/* Payment Partners Section */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold mb-4 text-center text-foreground">
              {language === "bn"
                ? "পেমেন্ট পার্টনার ও বিশ্বস্ত কোম্পানি"
                : "Payment Partners & Trusted Companies"}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <img
                src="/logos/bkash-com.png"
                alt="bKash"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/nagad-com-bd.png"
                alt="Nagad"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/bracbank-com.png"
                alt="BRAC Bank"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/sonali-bank-com.png"
                alt="Sonali Bank"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/janatabank-bd-com.png"
                alt="Janata Bank"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/bdpost-gov-bd.png"
                alt="BD Post"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/btrc-gov-bd.png"
                alt="BTRC"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/grameen-com.png"
                alt="Grameen"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/beximco-com.png"
                alt="Beximco"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/pran-rfl-com.png"
                alt="PRAN-RFL"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/partexstar-com.png"
                alt="Partex Star"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/mohammadi-group-com.png"
                alt="Mohammadi Group"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/bashundharagroup-com.png"
                alt="Bashundhara Group"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/navana-com.png"
                alt="Navana"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/ab-group-com.png"
                alt="AB Group"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/confidencegroup-com-bd.png"
                alt="Confidence Group"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/beximco-pharma-com.png"
                alt="Beximco Pharma"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/squarepharma-com-bd.png"
                alt="Square Pharma"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/lifeline-com-bd.png"
                alt="Lifeline"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/desco-org-bd.png"
                alt="DESCO"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
              <img
                src="/logos/bpdb-gov-bd.png"
                alt="BPDB"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity rounded-md"
              />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              {language === "bn"
                ? "© 2026 Roshal Organic. সর্বস্বত্ব সংরকিত।"
                : "© 2026 Roshal Organic. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

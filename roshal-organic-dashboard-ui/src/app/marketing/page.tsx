"use client"

import * as React from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Loader2, Copy, Check } from "lucide-react"
import { generateMarketingContent } from "@/ai/flows/generate-marketing-content-flow"
import { useToast } from "@/hooks/use-toast"

export default function MarketingPage() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)
  const { toast } = useToast()

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const features = formData.get("features") as string
    
    try {
      const output = await generateMarketingContent({
        contentType: formData.get("contentType") as any,
        productName: formData.get("productName") as string,
        keyFeatures: features.split(",").map(f => f.trim()).filter(Boolean),
        targetAudience: formData.get("audience") as string,
        tone: formData.get("tone") as string,
      })
      setResult(output.content)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Something went wrong while generating your marketing copy.",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied to clipboard",
        description: "Content is ready to be pasted.",
      })
    }
  }

  return (
    <>
      <DashboardHeader title="AI Marketing Content" />
      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generator Details
              </CardTitle>
              <CardDescription>
                Provide details about your product to generate compelling marketing copy.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleGenerate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input id="productName" name="productName" placeholder="e.g., Organic Honey Crisp Apples" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type</Label>
                    <Select name="contentType" defaultValue="product_description">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product_description">Product Description</SelectItem>
                        <SelectItem value="social_media_post">Social Media Post</SelectItem>
                        <SelectItem value="email_newsletter_snippet">Newsletter Snippet</SelectItem>
                        <SelectItem value="website_banner_copy">Website Banner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select name="tone" defaultValue="persuasive">
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="informative">Informative</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                        <SelectItem value="sophisticated">Sophisticated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Key Features (comma separated)</Label>
                  <Input id="features" name="features" placeholder="Organic, Farm-fresh, GMO-free" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience (optional)</Label>
                  <Input id="audience" name="audience" placeholder="Health-conscious parents" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="border-none shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Result</CardTitle>
                <CardDescription>Your generated marketing material will appear here.</CardDescription>
              </div>
              {result && (
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] flex items-center justify-center bg-muted/20 rounded-b-lg p-6">
              {result ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground w-full h-full">
                  {result}
                </div>
              ) : (
                <div className="text-center text-muted-foreground italic">
                  Fill in the details and click generate to see AI magic.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Lineup</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Lineup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Compare items side-by-side across shared attributes.
            </p>
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default App;

import { useState } from "react";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";

export default function Index() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProxySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    // Simulate a brief loading state for UX
    setTimeout(() => {
      setLoading(false);
      // Navigate to the proxy page with the URL
      window.location.href = `/proxy?url=${encodeURIComponent(url)}`;
    }, 800);
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
      return true;
    } catch {
      return false;
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Private Testing",
      description: "Test websites securely through our proxy without exposing your IP",
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Load any website instantly with optimized proxy routing",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access content from anywhere with our worldwide proxy network",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ProxyTest</span>
          </div>
          <div className="text-sm text-muted-foreground">Web Proxy for Testing</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Background gradient orbs */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-40 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-60 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          </div>

          {/* Main heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
              Test Websites
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Anonymously
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access any website through our secure proxy. Perfect for testing,
              research, and exploring content with privacy and security.
            </p>
          </div>

          {/* Proxy Input Form */}
          <form onSubmit={handleProxySubmit} className="relative">
            <div className="relative group">
              {/* Animated border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />

              <div className="relative bg-card rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Enter website URL (e.g., example.com or https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-6 py-4 bg-background rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder-muted-foreground text-foreground"
                />
                <button
                  type="submit"
                  disabled={!url.trim() || !isValidUrl(url) || loading}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <span>Access</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {!isValidUrl(url) && url.trim() && (
              <p className="text-sm text-red-500 mt-2">Please enter a valid URL</p>
            )}
          </form>

          {/* Quick tips */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <div className="text-muted-foreground">
              💡 Tip: Works with domains like{" "}
              <span className="font-mono bg-secondary px-2 py-1 rounded text-foreground">
                example.com
              </span>
            </div>
            <div className="text-muted-foreground">
              or full URLs like{" "}
              <span className="font-mono bg-secondary px-2 py-1 rounded text-foreground">
                https://example.com
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            Why Choose ProxyTest?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get fast, secure, and reliable proxy access for all your testing needs
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>
            ProxyTest — Secure web proxy for testing and research.{" "}
            <span className="text-primary font-semibold">Use responsibly.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

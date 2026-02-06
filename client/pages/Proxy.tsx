import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Globe } from "lucide-react";
import { ProxyResponse } from "@shared/api";

export default function Proxy() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proxyContent, setProxyContent] = useState("");

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (!urlParam) {
      navigate("/");
      return;
    }

    try {
      // Ensure URL has protocol
      const fullUrl = urlParam.startsWith("http")
        ? urlParam
        : `https://${urlParam}`;

      new URL(fullUrl); // Validate URL
      setUrl(fullUrl);
      fetchProxyContent(fullUrl);
    } catch (err) {
      setError("Invalid URL provided");
      setLoading(false);
    }
  }, [searchParams, navigate]);

  const fetchProxyContent = async (targetUrl: string) => {
    try {
      const response = await fetch(
        `/api/proxy?url=${encodeURIComponent(targetUrl)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch content");
      }

      const data: ProxyResponse = await response.json();
      setProxyContent(data.content);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load the website through proxy"
      );
    }
  };

  const getDomain = (urlString: string) => {
    try {
      return new URL(urlString).hostname;
    } catch {
      return urlString;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Control Bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-md bg-card/80">
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition text-foreground font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {url && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground hidden sm:inline">
                  Accessing:
                </span>
                <span className="font-mono text-foreground truncate">
                  {getDomain(url)}
                </span>
              </div>
            </div>
          )}

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/25 transition font-medium text-sm"
            >
              <span className="hidden sm:inline">Open</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center flex-1 bg-secondary/30">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading website...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Unable to Load
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition font-medium"
            >
              Try Another URL
            </button>
          </div>
        </div>
      )}

      {/* Iframe Container - renders proxied HTML */}
      {proxyContent && !error && (
        <div className="flex-1 relative bg-white dark:bg-slate-950">
          <iframe
            srcDoc={proxyContent}
            className="w-full h-full border-0"
            title="Proxied website"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-presentation allow-modals"
          />
        </div>
      )}
    </div>
  );
}

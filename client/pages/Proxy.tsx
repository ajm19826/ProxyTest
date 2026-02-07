import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Globe, Plus, X } from "lucide-react";

interface ProxyTab {
  id: string;
  url: string;
  domain: string;
  content: string;
  loading: boolean;
  error: string;
}

export default function Proxy() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<ProxyTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [newUrlInput, setNewUrlInput] = useState("");
  const [showNewTabInput, setShowNewTabInput] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (!urlParam && tabs.length === 0) {
      navigate("/");
      return;
    }

    if (urlParam && tabs.length === 0) {
      try {
        const fullUrl = urlParam.startsWith("http")
          ? urlParam
          : `https://${urlParam}`;
        const parsed = new URL(fullUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          navigate("/");
          return;
        }

        const tabId = generateTabId();
        const newTab: ProxyTab = {
          id: tabId,
          url: parsed.toString(),
          domain: getDomain(parsed.toString()),
          content: "",
          loading: true,
          error: "",
        };

        setTabs([newTab]);
        setActiveTabId(tabId);
        fetchProxyContent(newTab);
      } catch (err) {
        navigate("/");
      }
    }
  }, [searchParams, navigate]);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const minWidth = 200;
      const maxWidth = rect.width - 200;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const generateTabId = () => `tab-${Date.now()}-${Math.random()}`;

  const getDomain = (urlString: string) => {
    try {
      return new URL(urlString).hostname || urlString;
    } catch {
      return urlString;
    }
  };

  const fetchProxyContent = async (tab: ProxyTab) => {
    try {
      // Using allorigins.win - a free CORS proxy service
      const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        tab.url,
      )}`;

      const response = await fetch(corsProxyUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      let content = data.contents;

      if (!content) {
        throw new Error("No content received from proxy service");
      }

      // Inject a base tag to fix relative URLs
      const baseUrl = new URL(tab.url);
      const baseTag = `<base href="${baseUrl.origin}/" />`;

      // Insert base tag in the head
      if (content.includes("<head>")) {
        content = content.replace("<head>", `<head>${baseTag}`);
      } else if (content.includes("<HEAD>")) {
        content = content.replace("<HEAD>", `<HEAD>${baseTag}`);
      } else if (content.includes("<html>")) {
        content = content.replace("<html>", `<html><head>${baseTag}</head>`);
      } else if (content.includes("<HTML>")) {
        content = content.replace("<HTML>", `<HTML><head>${baseTag}</head>`);
      }

      setTabs((prevTabs) =>
        prevTabs.map((t) =>
          t.id === tab.id
            ? { ...t, content: content, loading: false, error: "" }
            : t,
        ),
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load the website";

      setTabs((prevTabs) =>
        prevTabs.map((t) =>
          t.id === tab.id ? { ...t, loading: false, error: errorMessage } : t,
        ),
      );
    }
  };

  const addNewTab = (urlInput: string) => {
    if (!urlInput.trim()) return;

    try {
      const fullUrl = urlInput.startsWith("http")
        ? urlInput
        : `https://${urlInput}`;
      const parsed = new URL(fullUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        // Disallow potentially dangerous schemes like javascript:, data:, etc.
        return;
      }

      const tabId = generateTabId();
      const newTab: ProxyTab = {
        id: tabId,
        url: parsed.toString(),
        domain: getDomain(parsed.toString()),
        content: "",
        loading: true,
        error: "",
      };

      setTabs([...tabs, newTab]);
      setActiveTabId(tabId);
      setNewUrlInput("");
      setShowNewTabInput(false);
      fetchProxyContent(newTab);
    } catch {
      // Invalid URL, do nothing
    }
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter((t) => t.id !== tabId);
    if (newTabs.length === 0) {
      navigate("/");
      return;
    }

    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
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

          {activeTab && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground hidden sm:inline">
                  Accessing:
                </span>
                <span className="font-mono text-foreground truncate">
                  {activeTab.domain}
                </span>
              </div>
            </div>
          )}

          {activeTab && (
            <a
              href={activeTab.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/25 transition font-medium text-sm"
            >
              <span className="hidden sm:inline">Open</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="h-12 border-t border-border px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto bg-secondary/30">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer whitespace-nowrap transition ${
                activeTabId === tab.id
                  ? "bg-card border border-primary text-foreground"
                  : "bg-transparent border border-transparent text-muted-foreground hover:bg-card hover:border-border"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span className="text-sm font-medium max-w-[120px] truncate">
                {tab.domain}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="ml-1 p-1 hover:bg-destructive/20 rounded transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add Tab Button */}
          {!showNewTabInput && (
            <button
              onClick={() => setShowNewTabInput(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-transparent border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">New</span>
            </button>
          )}

          {/* New Tab Input */}
          {showNewTabInput && (
            <div className="flex items-center gap-2 bg-card rounded-lg border border-primary px-3 py-2">
              <input
                autoFocus
                type="text"
                placeholder="Enter URL..."
                value={newUrlInput}
                onChange={(e) => setNewUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addNewTab(newUrlInput);
                  } else if (e.key === "Escape") {
                    setShowNewTabInput(false);
                    setNewUrlInput("");
                  }
                }}
                className="bg-transparent border-0 focus:outline-none text-sm text-foreground placeholder-muted-foreground w-48"
              />
              <button
                onClick={() => addNewTab(newUrlInput)}
                className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:shadow-lg transition"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowNewTabInput(false);
                  setNewUrlInput("");
                }}
                className="p-1 hover:bg-secondary rounded transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area with Resizable Sidebar */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Main Iframe Container */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeTab ? (
            <>
              {/* Loading State */}
              {activeTab.loading && (
                <div className="flex items-center justify-center flex-1 bg-secondary/30">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading website...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {activeTab.error && (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Unable to Load
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {activeTab.error}
                    </p>
                    <button
                      onClick={() => {
                        const updatedTab = {
                          ...activeTab,
                          loading: true,
                          error: "",
                        };
                        fetchProxyContent(updatedTab);
                      }}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition font-medium"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Iframe Container */}
              {activeTab.content && !activeTab.error && (
                <iframe
                  key={activeTab.id}
                  srcDoc={activeTab.content}
                  className="w-full h-full border-0 bg-white dark:bg-slate-950"
                  title={`Proxied ${activeTab.domain}`}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-presentation allow-modals"
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-secondary/30">
              <div className="text-center">
                <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No active tab</p>
              </div>
            </div>
          )}
        </div>

        {/* Resizable Handle and Right Sidebar (hidden by default, can be toggled) */}
        {sidebarWidth > 0 && (
          <>
            <div
              onMouseDown={() => setIsDragging(true)}
              className={`w-1 hover:w-1.5 bg-border hover:bg-primary transition-all cursor-col-resize ${
                isDragging ? "bg-primary w-1.5" : ""
              }`}
            />
            <div
              style={{ width: `${sidebarWidth}px` }}
              className="bg-secondary/30 border-l border-border flex flex-col overflow-hidden"
            >
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-4">
                <button
                  onClick={() => setSidebarWidth(0)}
                  className="text-xs px-3 py-1 bg-card rounded border border-border hover:border-primary transition"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}

        {/* Toggle Sidebar Button (when sidebar is hidden) */}
        {sidebarWidth === 0 && (
          <button
            onClick={() => setSidebarWidth(300)}
            className="w-1 hover:w-2 bg-border hover:bg-primary transition-all cursor-col-resize"
            title="Drag to resize or click to open sidebar"
          />
        )}
      </div>
    </div>
  );
}

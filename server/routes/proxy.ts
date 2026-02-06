import { RequestHandler } from "express";
import { ProxyResponse } from "@shared/api";

export const handleProxy: RequestHandler = async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing or invalid URL parameter" });
    return;
  }

  try {
    // Ensure the URL has a protocol
    const targetUrl = url.startsWith("http") ? url : `https://${url}`;

    // Validate the URL
    new URL(targetUrl);

    // Fetch the content from the target URL
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `Failed to fetch URL: ${response.statusText}`,
      });
      return;
    }

    const contentType = response.headers.get("content-type") || "text/html";
    let content = await response.text();

    // If it's HTML, inject a base tag to fix relative URLs
    if (contentType.includes("text/html")) {
      const baseUrl = new URL(targetUrl);
      const baseTag = `<base href="${baseUrl.origin}/" />`;

      // Insert base tag in the head, or create one if it doesn't exist
      if (content.includes("<head>")) {
        content = content.replace("<head>", `<head>${baseTag}`);
      } else if (content.includes("<HEAD>")) {
        content = content.replace("<HEAD>", `<HEAD>${baseTag}`);
      } else {
        // If no head tag, add it at the beginning
        content = `<!DOCTYPE html><html><head>${baseTag}</head><body>${content}</body></html>`;
      }
    }

    const proxyResponse: ProxyResponse = {
      content,
      contentType,
      url: targetUrl,
    };

    res.json(proxyResponse);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({ error: `Failed to proxy request: ${message}` });
  }
};

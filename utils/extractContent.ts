import { JSDOM } from "npm:jsdom@26.0.0";
import { Readability } from "npm:@mozilla/readability";
import html2md from "npm:html-to-md";

/**
 * Extracts main content from HTML and converts it to Markdown
 * 
 * @param htmlContent The HTML content to extract from
 * @returns Markdown formatted content
 */
export function extractContent(htmlContent: string): string {
  const doc = new JSDOM(htmlContent);
  const article = new Readability(doc.window.document).parse();
  if (!article) {
    throw new Error("Article not found");
  }
  //@ts-ignore unsafe
  return html2md(article.content || "");
}
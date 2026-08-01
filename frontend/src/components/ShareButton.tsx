import { Check, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const target = url ?? window.location.href;

  async function handleShare(): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: target });
        return;
      } catch {
        /* user dismissed the share sheet */
      }
    }
    await navigator.clipboard.writeText(target);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={() => void handleShare()} className="btn-secondary">
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}

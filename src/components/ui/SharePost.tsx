"use client"; // This makes it a Client Component

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

interface SharePostProps {
  url: string;
  title: string;
}

export default function SharePost({ url, title }: SharePostProps) {
  return (
    <div className="text-center md:text-left">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0 mb-3">Share this post</h4>
      <div className="flex gap-3">
        {/* Facebook Share */}
        <FacebookShareButton url={url} aria-label="Share on Facebook">
          <FacebookIcon className="w-6 h-6" />
        </FacebookShareButton>

        {/* LinkedIn Share */}
        <LinkedinShareButton url={url} aria-label="Share on LinkedIn">
          <LinkedinIcon className="w-6 h-6" />
        </LinkedinShareButton>

        {/* X (Twitter) Share */}
        <TwitterShareButton url={url} title={title} aria-label="Share on X">
          <TwitterIcon className="w-6 h-6" />
        </TwitterShareButton>

        {/* Email Share */}
        <EmailShareButton url={url} subject={title} aria-label="Share via Email">
          <EmailIcon className="w-6 h-6" />
        </EmailShareButton>
      </div>
    </div>
  );
}

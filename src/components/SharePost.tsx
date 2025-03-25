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
    <div className="sm:mt-4 text-center md:text-left">
      <p className="font-semibold mb-2">Share this post:</p>
      <div className="flex gap-3">
        {/* Facebook Share */}
        <FacebookShareButton url={url}>
          <FacebookIcon className="w-6 h-6" />
        </FacebookShareButton>

        {/* LinkedIn Share */}
        <LinkedinShareButton url={url}>
          <LinkedinIcon className="w-6 h-6" />
        </LinkedinShareButton>

        {/* X (Twitter) Share */}
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon className="w-6 h-6" />
        </TwitterShareButton>

        {/* Email Share */}
        <EmailShareButton url={url} subject={title}>
          <EmailIcon className="w-6 h-6" />
        </EmailShareButton>
      </div>
    </div>
  );
}

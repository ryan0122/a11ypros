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
    <div className="mt-4">
      <p className="font-semibold mb-2">Share this post:</p>
      <div className="flex gap-3">
        {/* Facebook Share */}
        <FacebookShareButton url={url}>
          <FacebookIcon className="w-6 h-6 text-blue-600 hover:text-blue-800" />
        </FacebookShareButton>

        {/* LinkedIn Share */}
        <LinkedinShareButton url={url}>
          <LinkedinIcon className="w-6 h-6 text-blue-500 hover:text-blue-700" />
        </LinkedinShareButton>

        {/* X (Twitter) Share */}
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon className="w-6 h-6 text-black hover:text-gray-600" />
        </TwitterShareButton>

        {/* Email Share */}
        <EmailShareButton url={url} subject={title}>
          <EmailIcon className="w-6 h-6 text-gray-700 hover:text-gray-900" />
        </EmailShareButton>
      </div>
    </div>
  );
}

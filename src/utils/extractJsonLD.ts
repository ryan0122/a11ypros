/**
 * ✅ Extract JSON-LD structured data from RankMath meta tags
 * ✅ Replace incorrect "cms.a11ypros.com" URLs with "a11ypros.com"
 */
export default function extractJsonLD (htmlString: string): string {
	const regex = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gs;
	const matches = regex.exec(htmlString);
  
	if (matches && matches[1]) {
	  try {
		const jsonLD = JSON.parse(matches[1]);
  
		// ✅ Convert entire JSON object to a string for replacement
		let jsonString = JSON.stringify(jsonLD);
  
		// ✅ Replace backend URL with frontend URL
		jsonString = jsonString.replace(/https:\/\/cms\.a11ypros\.com/g, "https://a11ypros.com");
  
		// ✅ Convert back to JSON and return
		return jsonString;
	  } catch (error) {
		console.error("Error parsing JSON-LD:", error);
	  }
	}
	return "";
  }
/**
 * ✅ Extract JSON-LD structured data from RankMath meta tags
 * ✅ Replace incorrect "cms.a11ypros.com" URLs with "a11ypros.com"
 */
export default function extractJsonLD(htmlString: string): string {
	const regex = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gs;
	const matches = [...htmlString.matchAll(regex)]; // Extract all JSON-LD script tags
  
	if (matches.length === 0) return ""; // Return empty if no matches found
  
	const extractedJsonLDs: string[] = [];
  
	matches.forEach((match) => {
	  try {
		// Parse JSON-LD block safely
		const jsonLD = JSON.parse(match[1]);
  
		// Convert entire JSON object to a string for URL replacement
		let jsonString = JSON.stringify(jsonLD);
  
		// ✅ Replace backend URL with frontend URL
		jsonString = jsonString.replace(/https:\/\/cms\.a11ypros\.com/g, "https://a11ypros.com");
  
		extractedJsonLDs.push(jsonString);
	  } catch (error) {
		console.error("❌ Error parsing JSON-LD:", error);
	  }
	});
  
	// ✅ Return extracted JSON-LD as a single string (handling multiple blocks)
	return extractedJsonLDs.join("\n");
  }
  
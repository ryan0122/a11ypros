// netlify/functions/scan.js   (Groq version – 100% free)
const pa11y = require('pa11y');

// Generate dynamic prompt based on number of issues found
const generateResultsPrompt = (issueCount) => {
  const issueNumber = Math.min(issueCount, 5); // Cap at 5 issues
  const issueWord = issueNumber === 1 ? 'issue' : 'issues';
  
  return `You are a senior accessibility auditor writing a polished, client-ready report for a non-technical business owner.

CRITICAL FORMATTING RULES — OBEY OR FAIL:
- Use NO markdown whatsoever. No **bold**, no *italics*, no __underline__, no ~~strikethrough~~.
- No asterisks (*) anywhere except in normal sentences.
- No backticks, no code blocks, no HTML tags, no pipes |, no brackets [] around issue numbers.
- Issue numbers must be written exactly like this: 1. 2. 3. (with a period and space)
- Do NOT start any line with ** or * or # or - 
- Write in complete, friendly sentences and paragraphs only.

REPORT STRUCTURE — follow word-for-word:
Start with one clear opening sentence about the biggest problem.

Then: "We discovered ${issueCount} accessibility ${issueCount === 1 ? 'issue' : 'issues'} in total."

${issueCount > 1 ? `Then: "Here are the ${issueNumber} most important ones to fix first:"` : 'Then: "Here is the issue to fix:"'}

Then list exactly ${issueNumber} ${issueWord} in this exact plain-text format (example — you must imitate this style perfectly):

1. Empty link buttons (like the hamburger menu) have no text for screen readers.
Who it affects: Blind users and anyone using voice control.
WCAG rule: 4.1.2 Name, Role, Value (Level A)
Simple fix: Add aria-label="Open menu" or put visible text inside the button.

${issueNumber > 1 ? `2. Many text elements have extremely low color contrast (some as bad as 1.4:1).
Who it affects: People with low vision, older adults, and users outdoors.
WCAG rule: 1.4.3 Contrast Minimum (Level AA)
Simple fix: Use darker text colors or lighter backgrounds so contrast is at least 4.5:1.

(continue exactly like this for all ${issueNumber})` : ''}

End with a positive, encouraging paragraph and remind them that automated tools only find about 40% of real issues — a full manual audit is the gold standard.

Now write the report for this specific page. Keep it warm, professional, and easy to read.`;
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

  const { url } = event.queryStringParameters || {};
  if (!url || !/^https?:\/\//i.test(url)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Valid URL required' }) };
  }

  // Convert plain text report to HTML
  const convertReportToHTML = (text) => {
    // Split into paragraphs (double newlines)
    const paragraphs = text.split(/\n\n+/);

    let html = '';
    let inList = false;

    paragraphs.forEach(para => {
      const trimmed = para.trim();
      if (!trimmed) return;

      // Check if it's a numbered list item (starts with "1. ", "2. ", etc.)
      const listMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (listMatch) {
        if (!inList) {
          html += '<ol>';
          inList = true;
        }
        html += `<li><strong>${listMatch[2]}</strong></li>`;
      } else {
        if (inList) {
          html += '</ol>';
          inList = false;
        }

        // Check for special patterns
        if (trimmed.startsWith('Who it affects:')) {
          html += `<p><em>${trimmed}</em></p>`;
        } else if (trimmed.startsWith('WCAG rule:')) {
          html += `<p><code>${trimmed}</code></p>`;
        } else if (trimmed.startsWith('Simple fix:')) {
          html += `<p><strong>${trimmed}</strong></p>`;
        } else {
          html += `<p>${trimmed}</p>`;
        }
      }
    });

    if (inList) html += '</ol>';

    return html;
  }

  try {
    const results = await pa11y(url, {
      standard: 'WCAG2AA',
      includeNotices: false,
      includeWarnings: false,
      timeout: 40000,
      chromeLaunchConfig: { args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] }
    });

    let aiReport = '';
    if (results.issues.length === 0) {
      aiReport = `🎉 No automated issues found! Great start — but remember automated tools only catch ~30–50% of real problems.`;
    } else {
      const issuesJson = JSON.stringify(results.issues.slice(0, 40), null, 2);
      const dynamicPrompt = generateResultsPrompt(results.issues.length);
      console.log('GROQ_API_KEY', process.env.GROQ_API_KEY);

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Free Groq models: llama-3.1-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768
          model: 'openai/gpt-oss-120b',   // Free tier - good quality
          temperature: 0.3,
          max_tokens: 1400,
          messages: [
            { role: 'system', content: dynamicPrompt },
            { role: 'user', content: `URL: ${url}\n\nIssues:\n${issuesJson}` }
          ]
        })
      });

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error('Groq API error:', groqResponse.status, errorText);
        aiReport = `Unable to generate AI report (API error: ${groqResponse.status}). Please review the issues below.`;
      } else {
        const data = await groqResponse.json();
        console.log('Groq response:', data);
        aiReport = data.choices?.[0]?.message?.content?.trim() || 'Report generation failed.';
        aiReport = convertReportToHTML(aiReport);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        total: results.issues.length,
        issues: results.issues.slice(0, 15),
        aiReport,
        disclaimer: 'Automated scan powered by Pa11y + Groq AI (free tier).',
        cta: '/contact?ref=free-scan'
      })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
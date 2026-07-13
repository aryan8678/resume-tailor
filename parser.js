export default function parseJob(html) {
    // ----------------------------
    // Remove obvious noise
    // ----------------------------
    html = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<svg[\s\S]*?<\/svg>/gi, "")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
        .replace(/<!--[\s\S]*?-->/g, "");

    // ----------------------------
    // Extract JobPosting schema if available
    // ----------------------------
    const schemaMatch = html.match(
        /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i
    );

    let schemaData = {};

    if (schemaMatch) {
        try {
            const json = JSON.parse(schemaMatch[1]);

            if (json["@type"] === "JobPosting") {
                schemaData = {
                    title: json.title,
                    company: json.hiringOrganization?.name,
                    location:
                        json.jobLocation?.address?.addressLocality,
                    description: json.description,
                    employmentType: json.employmentType
                };
            }
        } catch {}
    }

    // ----------------------------
    // Convert html -> plain text
    // ----------------------------
    const text = html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<\/li>/gi, "\n")
        .replace(/<li[^>]*>/gi, "• ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();

    // ----------------------------
    // Important keywords
    // ----------------------------
    const importantKeywords = [
        "responsibilities",
        "requirements",
        "qualification",
        "skills",
        "experience",
        "internship",
        "salary",
        "remote",
        "hybrid",
        "location",
        "benefits",
        "about the job",
        "job description",
        "about us",
        "the role",
        "what you'll do",
        "what you will do",
        "must have",
        "preferred qualifications"
    ];

    // ----------------------------
    // Split into meaningful chunks
    // ----------------------------
    const chunks = text
        .split(/\n|\. (?=[A-Z])/)
        .map(x => x.trim())
        .filter(Boolean);

    const importantContent = [];

    for (const chunk of chunks) {
        const lower = chunk.toLowerCase();

        if (
            importantKeywords.some(keyword =>
                lower.includes(keyword)
            )
        ) {
            importantContent.push(chunk);
            continue;
        }

        // Skill detection
        if (
            /\b(python|java|react|node|docker|aws|mysql|postgresql|mongodb|fastapi|spring|django|git|linux|kubernetes)\b/i.test(
                chunk
            )
        ) {
            importantContent.push(chunk);
            continue;
        }

        // Salary detection
        if (
            /(?:₹|\$|€|£)\s?[\d,.]+/i.test(chunk)
        ) {
            importantContent.push(chunk);
            continue;
        }

        // Experience detection
        if (
            /\d+\+?\s*(?:-|to)?\s*\d*\s*years?/i.test(
                chunk
            )
        ) {
            importantContent.push(chunk);
            continue;
        }

        // Internship/full time detection
        if (
            /\b(internship|full[- ]time|part[- ]time|contract|freelance)\b/i.test(
                chunk
            )
        ) {
            importantContent.push(chunk);
        }
    }

    // ----------------------------
    // Extract skills
    // ----------------------------
    const skillMatches =
        text.match(
            /\b(JavaScript|TypeScript|Python|Java|C\+\+|React|Node\.js|Express|FastAPI|Django|Spring|Docker|Kubernetes|AWS|Azure|GCP|MySQL|PostgreSQL|MongoDB|Redis|Git|Linux)\b/gi
        ) || [];

    const skills = [...new Set(skillMatches)];

    // ----------------------------
    // Extract salary
    // ----------------------------
    const salary =
        (
            text.match(
                /(?:₹|\$|€|£)\s?[\d,.]+(?:\s?[-–]\s?(?:₹|\$|€|£)?[\d,.]+)?/i
            ) || []
        )[0] || null;

    // ----------------------------
    // Extract remote policy
    // ----------------------------
    let remotePolicy = null;

    if (/remote only/i.test(text))
        remotePolicy = "Remote Only";
    else if (/hybrid/i.test(text))
        remotePolicy = "Hybrid";
    else if (/onsite/i.test(text))
        remotePolicy = "Onsite";

    // ----------------------------
    // Final result
    // ----------------------------
    const output = {
        
        title:
            schemaData.title ||
            (text.match(/^[^\n]{5,100}/) || [])[0] ||
            null,

        company: schemaData.company || null,

        location:
            schemaData.location ||
            (
                text.match(
                    /(remote|hybrid|onsite|india|delhi|bangalore|pune|mumbai|chennai)/i
                ) || []
            )[0] ||
            null,

        employmentType:
            schemaData.employmentType ||
            (
                text.match(
                    /(internship|full-time|part-time|contract)/i
                ) || []
            )[0] ||
            null,

        salary,
        remotePolicy,
        skills,

        importantText: [...new Set(importantContent)],

        description:
            schemaData.description ||
            importantContent.join("\n")
    };
    return output;
}


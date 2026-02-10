/**
 * AI Project Updater
 * Fetches all public GitHub repos, analyzes new ones using Claude AI,
 * and generates professional project entries for the portfolio website.
 *
 * Usage: ANTHROPIC_API_KEY=sk-... GITHUB_TOKEN=ghp_... node scripts/update-projects.js
 */

const GITHUB_USERNAME = "aimemoria";
const DATA_FILE = "main/data/projects.json";

// Repos to always skip (profile READMEs, forks, configs)
const HIDDEN_REPOS = ["aimemoria"];

// Guidelines for the AI to follow when describing projects
const AI_GUIDELINES = `You are writing project descriptions for a professional portfolio website belonging to Aime Serge Tuyishime, a Computer Science student specializing in Data Analytics.

RULES:
1. Be accurate and factual. Only describe features that actually exist in the code/README.
2. Keep descriptions concise and professional. No emotional language, no hype.
3. If the project is clearly a practice/learning project (course assignment, tutorial follow-along, simple demo), mark status as "Practice". If it's a polished, complete application, mark as "Complete".
4. The "description" field should be 1-2 sentences summarizing what the project does.
5. The "details" field should be 2-4 sentences covering: what it does, key features, and tech architecture.
6. Do NOT use em dashes. Use commas or periods instead.
7. Do NOT use flowery adjectives like "elegant", "robust", "cutting-edge", "powerful".
8. Category must be one of: "Full-Stack App", "Practice", "Website", "Data Science", "Mobile App", "Tool", "Game".
9. The tech array should list specific technologies found in the code, not generic terms.
10. If there's a homepage URL, include it as liveUrl.

Respond with ONLY valid JSON, no markdown formatting.`;

async function fetchGitHubRepos(token) {
    const headers = { "Accept": "application/vnd.github.v3+json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
        { headers }
    );
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    return response.json();
}

async function fetchRepoReadme(repoName, token) {
    const headers = { "Accept": "application/vnd.github.v3+json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
            { headers }
        );
        if (!response.ok) return null;
        const data = await response.json();
        // Decode base64 content
        return Buffer.from(data.content, "base64").toString("utf-8");
    } catch {
        return null;
    }
}

async function fetchRepoLanguages(repoName, token) {
    const headers = { "Accept": "application/vnd.github.v3+json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/languages`,
            { headers }
        );
        if (!response.ok) return {};
        return response.json();
    } catch {
        return {};
    }
}

async function fetchRepoTree(repoName, token) {
    const headers = { "Accept": "application/vnd.github.v3+json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/git/trees/main?recursive=1`,
            { headers }
        );
        if (!response.ok) {
            // Try 'master' branch
            const resp2 = await fetch(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/git/trees/master?recursive=1`,
                { headers }
            );
            if (!resp2.ok) return [];
            const data = await resp2.json();
            return (data.tree || []).map(f => f.path).slice(0, 50);
        }
        const data = await response.json();
        return (data.tree || []).map(f => f.path).slice(0, 50);
    } catch {
        return [];
    }
}

async function analyzeWithClaude(apiKey, repo, readme, languages, fileTree) {
    const prompt = `Analyze this GitHub repository and generate a professional project entry.

Repository: ${repo.name}
GitHub Description: ${repo.description || "None"}
Primary Language: ${repo.language || "Unknown"}
Languages used: ${Object.keys(languages).join(", ") || "Unknown"}
Homepage: ${repo.homepage || "None"}
Stars: ${repo.stargazers_count}
Topics: ${(repo.topics || []).join(", ") || "None"}
Created: ${repo.created_at}
Last updated: ${repo.updated_at}

File structure (first 50 files):
${fileTree.join("\n")}

README content:
${readme ? readme.substring(0, 3000) : "No README available."}

Generate a JSON object with these exact fields:
{
  "name": "Human-readable project name",
  "category": "One of: Full-Stack App, Practice, Website, Data Science, Mobile App, Tool, Game",
  "status": "Complete or Practice",
  "description": "1-2 sentence summary",
  "details": "2-4 sentence detailed description",
  "tech": ["Array", "of", "specific", "technologies"],
  "liveUrl": "URL or null"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            system: AI_GUIDELINES,
            messages: [{ role: "user", content: prompt }]
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const text = data.content[0].text.trim();

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response as JSON");
    return JSON.parse(jsonMatch[0]);
}

async function loadExistingData() {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.default.resolve(DATA_FILE);

    try {
        const content = fs.default.readFileSync(filePath, "utf-8");
        return JSON.parse(content);
    } catch {
        return { projects: [], lastUpdated: null };
    }
}

async function saveData(data) {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.default.resolve(DATA_FILE);
    const dir = path.default.dirname(filePath);

    if (!fs.default.existsSync(dir)) {
        fs.default.mkdirSync(dir, { recursive: true });
    }

    fs.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved ${data.projects.length} projects to ${DATA_FILE}`);
}

async function main() {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN || null;

    if (!anthropicKey) {
        console.error("Error: ANTHROPIC_API_KEY environment variable is required.");
        console.error("Get your API key at: https://console.anthropic.com/");
        process.exit(1);
    }

    console.log("Fetching GitHub repos...");
    const repos = await fetchGitHubRepos(githubToken);
    const publicRepos = repos.filter(r => !r.private && !r.fork && !HIDDEN_REPOS.includes(r.name));
    console.log(`Found ${publicRepos.length} public repos.`);

    // Load existing data
    const existingData = await loadExistingData();
    const existingNames = new Set(existingData.projects.map(p => p.repoName));

    // Find new repos
    const newRepos = publicRepos.filter(r => !existingNames.has(r.name));
    // Find deleted repos (no longer on GitHub)
    const currentRepoNames = new Set(publicRepos.map(r => r.name));
    const activeProjects = existingData.projects.filter(p => currentRepoNames.has(p.repoName));

    if (newRepos.length === 0) {
        console.log("No new repos found. Checking for removed repos...");
        if (activeProjects.length < existingData.projects.length) {
            const removed = existingData.projects.length - activeProjects.length;
            console.log(`Removed ${removed} projects (repos deleted/made private).`);
            existingData.projects = activeProjects;
            existingData.lastUpdated = new Date().toISOString();
            await saveData(existingData);
        } else {
            console.log("Everything is up to date.");
        }
        return;
    }

    console.log(`Found ${newRepos.length} new repos to analyze:`);
    newRepos.forEach(r => console.log(`  - ${r.name}`));

    // Analyze each new repo with AI
    const newProjects = [];
    for (const repo of newRepos) {
        console.log(`\nAnalyzing ${repo.name}...`);

        const [readme, languages, fileTree] = await Promise.all([
            fetchRepoReadme(repo.name, githubToken),
            fetchRepoLanguages(repo.name, githubToken),
            fetchRepoTree(repo.name, githubToken)
        ]);

        try {
            const aiResult = await analyzeWithClaude(anthropicKey, repo, readme, languages, fileTree);

            newProjects.push({
                repoName: repo.name,
                name: aiResult.name,
                category: aiResult.category,
                status: aiResult.status,
                description: aiResult.description,
                details: aiResult.details,
                tech: aiResult.tech,
                github: repo.html_url,
                liveUrl: aiResult.liveUrl || repo.homepage || null,
                autoGenerated: true,
                analyzedAt: new Date().toISOString()
            });

            console.log(`  OK: "${aiResult.name}" [${aiResult.category}] (${aiResult.status})`);
        } catch (error) {
            console.error(`  FAILED: ${error.message}`);
            // Add basic entry as fallback
            newProjects.push({
                repoName: repo.name,
                name: repo.name.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                category: "Practice",
                status: "Practice",
                description: repo.description || "A project by Aime Moria.",
                details: repo.description || "Check the GitHub repository for more information.",
                tech: Object.keys(languages).length > 0 ? Object.keys(languages) : (repo.language ? [repo.language] : []),
                github: repo.html_url,
                liveUrl: repo.homepage || null,
                autoGenerated: true,
                analyzedAt: new Date().toISOString()
            });
        }

        // Small delay to respect API rate limits
        await new Promise(r => setTimeout(r, 500));
    }

    // Merge: existing projects + new ones
    const allProjects = [...activeProjects, ...newProjects];

    // Sort: manual (non-auto) first, then auto by date
    allProjects.sort((a, b) => {
        if (!a.autoGenerated && b.autoGenerated) return -1;
        if (a.autoGenerated && !b.autoGenerated) return 1;
        return 0;
    });

    const output = {
        projects: allProjects,
        lastUpdated: new Date().toISOString()
    };

    await saveData(output);
    console.log(`\nDone! ${newProjects.length} new projects added, ${allProjects.length} total.`);
}

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});

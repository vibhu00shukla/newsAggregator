require("dotenv").config();
const cron = require("node-cron");
const axios = require("axios").default;
const axiosRetry = require("axios-retry").default;
const articleModel = require("../models/article.model");

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 1000 });

const VALID_CATEGORIES = [
  "Technology",
  "Business",
  "Entertainment",
  "Environment",
  "Finance",
  "Political",
];

async function getSummary(articles) {
  try {
    if (!process.env.GROK_API_KEY) {
      throw new Error("GROK_API_KEY is not set in environment variables");
    }

    const prompt = `You are an expert summarizer. Using only the provided URLs, summarize each news article in 100 words or fewer. Return a JSON array of summaries in the same order.\n\n` +
      articles
        .map((a, i) => `${i + 1}. Title: ${a.title}\nURL: ${a.url || "N/A"}`)
        .join("\n\n");

    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-3",
        messages: [{ role: "user", content: prompt }],
        max_tokens: Math.max(articles.length * 100, 100),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Empty response from Grok API");
    }

    try {
      const summaries = JSON.parse(content);
      if (!Array.isArray(summaries)) {
        throw new Error("Grok API response is not a valid JSON array");
      }
      return summaries;
    } catch (parseError) {
      console.error("Error parsing Grok API response:", parseError.message);
      return articles.map(() => null);
    }
  } catch (error) {
    console.error("Error in Grok API call:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return articles.map(() => null);
  }
}

async function runArticleJob() {
  if (!process.env.NEWS_API_KEY) {
    throw new Error("NEWS_API_KEY is not set in environment variables");
  }

  const day = new Date();
  day.setDate(day.getDate() - 7);
  const fromDate = day.toISOString().split("T")[0];

  try {
    await articleModel.deleteMany({});
    console.log("Cleared all articles from DB.");

    for (const category of VALID_CATEGORIES) {
      try {
        const res = await axios.get("https://gnews.io/api/v4/search", {
          params: {
            q: category,
            country: "in",
            from: fromDate,
            lang: "en",
            max: 10,
            in: "description",
            sortby: "publishedAt",
            apikey: process.env.NEWS_API_KEY,
          },
        });

        const articles = Array.isArray(res.data.articles) ? res.data.articles : [];
        if (!articles.length) {
          console.log(`No articles fetched for category: ${category}`);
          continue;
        }

        const enrichedArticles = articles
          .filter((a) => a.url && a.title)
          .map((a) => ({ ...a, category }));

        if (!enrichedArticles.length) {
          console.log(`No valid articles for category: ${category}`);
          continue;
        }

        const summaries = await getSummary(enrichedArticles);

        const articlesToSave = enrichedArticles.map((a, i) => ({
          heading: a.title || "Untitled",
          picture: a.image || null,
          author: a.source?.name || "Unknown",
          website_url: a.url,
          description: summaries[i] || a.description || "Summary unavailable",
          categories: a.category,
        }));

        try {
          await articleModel.insertMany(articlesToSave, { ordered: false });
          console.log(`Saved ${articlesToSave.length} articles for ${category}`);
        } catch (e) {
          if (e.code === 11000) {
            console.warn(`Duplicate articles skipped for ${category}`);
          } else {
            console.error(`Error saving articles for ${category}:`, e.message);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Error fetching for ${category}:`, err.message);
      }
    }
  } catch (e) {
    console.error("Job execution error:", e.message);
  }
}

function startJobs() {
  cron.schedule("30 18 * * *", runArticleJob, { timezone: "Asia/Kolkata" });
}

module.exports = { startJobs, runArticleJob };



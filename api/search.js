import fetch from "node-fetch";

export const config = {
  runtime: "edge", // optional, faster serverless runtime
};

export default async function handler(req) {
  // Enable CORS for all origins
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "tamil story";

    const url = `https://kukufm.com/api/v1/search/?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch from KukuFM" }), {
        status: response.status,
        headers,
      });
    }

    const data = await response.json();
    const result = data.channels?.items || [];

    return new Response(JSON.stringify(result), { headers });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500, headers });
  }
}

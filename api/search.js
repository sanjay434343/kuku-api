export const config = { runtime: "edge" };

export default async function handler(req) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Preflight
  if (req.method === "OPTIONS") return new Response(null, { headers });

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "tamil story";

    const response = await fetch(
      `https://kukufm.com/api/v1/search/?q=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch from KukuFM" }), {
        status: response.status,
        headers,
      });
    }

    const data = await response.json();

    // Return full channels.items array (all results)
    const result = data.channels?.items || [];

    return new Response(JSON.stringify(result), { headers });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500, headers });
  }
}

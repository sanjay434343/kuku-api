export const config = { runtime: "edge" };

export default async function handler(req) {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (req.method === "OPTIONS") return new Response(null, { headers });

  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("id");

    if (!channelId) {
      return new Response(JSON.stringify({ error: "Channel ID is required" }), {
        status: 400,
        headers,
      });
    }

    const response = await fetch(
      `https://kukufm.com/api/v1/channels/${channelId}/episodes/`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch episodes from KukuFM" }), {
        status: response.status,
        headers,
      });
    }

    const data = await response.json();
    const episodes = data.episodes || [];

    return new Response(JSON.stringify(episodes), { headers });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500, headers });
  }
}

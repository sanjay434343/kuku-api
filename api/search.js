export const config = { runtime: "edge" };

export default async function handler(req) {
  // CORS headers for all origins
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight request
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
    const items = data.channels?.items || [];

    // Map only essential fields
    const result = items.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      language: item.language,
      status: item.status,
      n_listens: item.n_listens,
      author: {
        id: item.author?.id || null,
        name: item.author?.name || null,
        avatar: item.author?.avatar_cdn || null,
      },
      dynamic_link: item.dynamic_link,
      web_uri: item.web_uri,
    }));

    return new Response(JSON.stringify(result), { headers });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500, headers });
  }
}

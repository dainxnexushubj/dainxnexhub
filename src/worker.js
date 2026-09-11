const RANGER_OWNER = "Daniel Williamston";
const RANGER_ACTOR = "RANGER";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function response(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (
      url.pathname === "/api/ranger/status" &&
      request.method === "GET"
    ) {
      return response({
        system: "D.A.I.N.X NEXUS",
        branch: "RANGER",
        status: "ONLINE",
        engine: "READY",
        owner: RANGER_OWNER,
        actor: RANGER_ACTOR
      });
    }

    if (
      url.pathname === "/api/ranger" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();

        if (
          !body ||
          typeof body.objective !== "string" ||
          !body.objective.trim()
        ) {
          return response(
            {
              success: false,
              owner: RANGER_OWNER,
              actor: RANGER_ACTOR,
              error: "Mission objective is required."
            },
            400
          );
        }

        return response({
          success: true,
          owner: RANGER_OWNER,
          actor: RANGER_ACTOR,
          mission: {
            objective: body.objective.trim(),
            status: "RECEIVED"
          }
        });
      } catch (error) {
        return response(
          {
            success: false,
            owner: RANGER_OWNER,
            actor: RANGER_ACTOR,
            error: `Ranger execution error: ${error.message}`
          },
          500
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};

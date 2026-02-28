import Mux from "@mux/mux-node";

// We export a singleton Mux client configured from environment variables.
// You'll need to provide MUX_TOKEN_ID and MUX_TOKEN_SECRET in your
// .env file (and also add them to the deployment environment).

const tokenId = process.env.MUX_TOKEN_ID;
const tokenSecret = process.env.MUX_TOKEN_SECRET;

if (!tokenId || !tokenSecret) {
  // don't crash in development if not configured, but warn so devs know
  console.warn(
    "MUX credentials not configured (MUX_TOKEN_ID / MUX_TOKEN_SECRET)",
  );
}

export const mux = new Mux(tokenId || "", tokenSecret || "");

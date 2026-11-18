// Studio406 — Worker in front of the static site.
//
// The site is fully public and static, so for now this just serves the assets.
// The old /api/request-access endpoint (invite-only gate) was retired when the
// site went public; it's in git history if ever needed.
//
// Kept on purpose for the upcoming "Request Quote" form: the RESEND_API_KEY
// secret (dashboard), the send.studio406.co sending domain in Resend, and the
// ACCESS_RL rate-limit binding in wrangler.jsonc. A new POST route goes here.

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};

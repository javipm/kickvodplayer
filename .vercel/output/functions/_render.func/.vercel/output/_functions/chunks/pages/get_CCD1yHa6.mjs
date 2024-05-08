import { d as db, V as VideoProgress } from './_videoId__9oOcbiV2.mjs';
import { g as getSession } from './__7CrRWlke.mjs';
import { createHash } from 'node:crypto';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';

const generateUserId = (str) => {
  return createHash("sha256").update(str).digest("hex");
};
const GET = async ({ request }) => {
  const session = await getSession(request);
  if (!session || session?.user?.email == null) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = generateUserId(session.user.email);
  try {
    const result = await db.select().from(VideoProgress).where(eq(VideoProgress.userId, userId));
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export { GET };

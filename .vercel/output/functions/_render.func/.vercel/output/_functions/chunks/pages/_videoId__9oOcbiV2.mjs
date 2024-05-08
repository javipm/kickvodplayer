import { createRemoteDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import '@astrojs/db/dist/runtime/virtual.js';
import { object, number, safeParse } from 'valibot';
import { g as getSession } from './__7CrRWlke.mjs';
import { createHash } from 'node:crypto';

const db = await createRemoteDatabaseClient(process.env.ASTRO_STUDIO_APP_TOKEN, {"BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true, "SITE": undefined, "ASSETS_PREFIX": undefined}.ASTRO_STUDIO_REMOTE_DB_URL ?? "https://db.services.astro.build");
const VideoProgress = asDrizzleTable("VideoProgress", { "columns": { "id": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "VideoProgress", "primaryKey": true } }, "videoId": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "videoId", "collection": "VideoProgress", "primaryKey": false, "optional": false } }, "userId": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "userId", "collection": "VideoProgress", "primaryKey": false, "optional": false } }, "progress": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "progress", "collection": "VideoProgress", "primaryKey": false, "optional": false } } }, "deprecated": false, "indexes": {} }, false);

const VideoProgressSchema = object({
  progress: number()
});
const generateUserId = (str) => {
  return createHash("sha256").update(str).digest("hex");
};
const POST = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session || session?.user?.email == null) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userId = generateUserId(session.user.email);
  const { videoId } = params;
  if (!videoId) {
    return new Response("Missing videoId", { status: 400 });
  }
  const { success, output } = safeParse(
    VideoProgressSchema,
    await request.json()
  );
  if (!success) {
    return new Response("Bad request", { status: 400 });
  }
  const { progress } = output;
  const newId = `${userId}-${videoId}`;
  const data = {
    id: newId,
    userId,
    videoId,
    progress
  };
  console.log(data);
  try {
    await db.insert(VideoProgress).values(data).onConflictDoUpdate({
      target: VideoProgress.id,
      set: {
        progress: data.progress
      }
    });
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

const _videoId_ = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST
}, Symbol.toStringTag, { value: 'Module' }));

export { VideoProgress as V, _videoId_ as _, db as d };

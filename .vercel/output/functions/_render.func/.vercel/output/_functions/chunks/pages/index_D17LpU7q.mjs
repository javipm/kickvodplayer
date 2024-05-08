/* empty css                          */
import { e as createComponent, r as renderTemplate, m as maybeRenderHead, h as createAstro, g as addAttribute, i as renderHead, j as renderComponent, k as renderSlot } from '../astro_CcxglX3-.mjs';
import { g as getSession } from './__7CrRWlke.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'jb-videojs-hls-quality-selector';
import 'videojs-mobile-ui';
import 'videojs-hotkeys';
import 'videojs-seek-buttons';

const $$Astro$2 = createAstro();
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Navbar;
  const session = await getSession(Astro2.request);
  return renderTemplate`${maybeRenderHead()}<nav class="bg-zinc-800 p-2"> <div class="max-w-screen-lg mx-auto flex justify-between items-center"> <h1 class="text-xl text-white">Kick VOD Player</h1> ${session && session.user ? renderTemplate`<div class="flex items-center"> <p class="text-white text-sm mr-4">${session.user.name}</p> <button id="logout" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm">
Logout
</button> </div>` : renderTemplate`<div> <button id="login" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm">
Login with Twitch
</button> </div>`} </div> </nav> `;
}, "/Users/javipm/Documents/www/kickvodplayer/src/components/Navbar.astro", void 0);

const $$Astro$1 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body class="bg-black"> ${renderComponent($$result, "Navbar", $$Navbar, {})} ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/javipm/Documents/www/kickvodplayer/src/layouts/Layout.astro", void 0);

function Search({
  setStreamer
}) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type: "text",
      placeholder: "Type Kick streamer name",
      className: "w-full text-sm lg:w-1/2 p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500  text-black",
      onChange: (event) => setStreamer(event.target.value)
    }
  );
}

const PROGRESS_INTERVAL_SECONDS = 60;
function VideoJS(props) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady, videoUuid, userIsLogged, progress } = props;
  const saveProgress = () => {
    if (!userIsLogged)
      return;
    console.log("Saving progress...");
    const player = playerRef.current;
    const progress2 = (player?.currentTime() ?? 0) * 1e3;
    fetch(`/api/progress/${videoUuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        progress: progress2
      })
    });
  };
  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }
      const player = playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      });
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);
  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.hlsQualitySelector({ displayCurrentQuality: true });
      player.mobileUi({
        touchControls: {
          tapTimeout: 100
        }
      });
      player.seekButtons({
        forward: 30,
        back: 10
      });
      if (progress) {
        player.currentTime(progress / 1e3);
      }
    }
  }, [playerRef]);
  useEffect(() => {
    let intervalId = null;
    const player = playerRef.current;
    if (player) {
      player.on("play", () => {
        saveProgress();
        intervalId = setInterval(() => {
          saveProgress();
        }, PROGRESS_INTERVAL_SECONDS * 1e3);
      });
      player.on("pause", () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      });
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);
  return /* @__PURE__ */ jsx("div", { "data-vjs-player": true, className: "h-auto w-full lg:w-2/3", children: /* @__PURE__ */ jsx("div", { ref: videoRef }) });
}

function Videos({
  streamer,
  userIsLogged
}) {
  const [videos, setVideos] = useState([]);
  const [uri, setUri] = useState("");
  const [videoUuid, setVideoUuid] = useState("");
  const [poster, setPoster] = useState("");
  const [loading, setLoading] = useState(true);
  const [allProgress, setAllProgress] = useState([]);
  const [progress, setProgress] = useState(0);
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    poster,
    sources: [
      {
        src: uri
      }
    ],
    plugins: {
      hotkeys: {
        volumeStep: 0.1,
        seekStep: 30
      }
    }
  };
  useEffect(() => {
    setVideos([]);
    setUri("");
    setLoading(true);
    const getVideos = setTimeout(() => {
      fetch(`https://kick.com/api/v1/channels/${streamer}`).then((response) => {
        if (!response.ok) {
          setLoading(false);
        }
        return response.json();
      }).then((data) => {
        setVideos(data.previous_livestreams);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
      });
      if (userIsLogged) {
        fetch(`/api/progress/get`).then((response) => response.json()).then((data) => {
          setAllProgress(data);
        });
      }
    }, 1e3);
    return () => clearTimeout(getVideos);
  }, [streamer]);
  const getVideo = (id) => {
    const video = videos.find(
      (video2) => video2.id === id
    );
    if (!video) {
      return;
    }
    fetch(`https://kick.com/api/v1/video/${video.video.uuid}`).then((response) => response.json()).then((data) => {
      const source = data.source;
      setUri(source);
      setPoster(video.thumbnail.src);
      setVideoUuid(video.video.uuid);
      const progress2 = allProgress.find(
        (item) => item.videoId === video.video.uuid
      )?.progress;
      setProgress(progress2 || 0);
    });
  };
  const secondsToHms = (d) => {
    d = Number(d) / 1e3;
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    var hDisplay = h > 0 ? (h < 10 ? "0" + h : h) + ":" : "00:";
    var mDisplay = m > 0 ? (m < 10 ? "0" + m : m) + ":" : "00:";
    var sDisplay = s > 0 ? s < 10 ? "0" + s : s : "00";
    return hDisplay + mDisplay + sDisplay;
  };
  return videos && videos.length > 0 ? /* @__PURE__ */ jsxs("section", { children: [
    uri ? /* @__PURE__ */ jsx("div", { className: "grid pt-10 lg:pt-10 place-items-center", children: /* @__PURE__ */ jsx(
      VideoJS,
      {
        source: uri,
        options: videoJsOptions,
        videoUuid,
        userIsLogged,
        progress
      }
    ) }) : null,
    /* @__PURE__ */ jsxs("h2", { className: "text-green-500 text-center text-3xl font-bold my-10", children: [
      "List of VODs from ",
      streamer
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 ", children: videos.map((video) => {
      const progressVideo = allProgress.find(
        (item) => item.videoId === video.video.uuid
      )?.progress;
      const duration = video.duration;
      let progressPercentage = 0;
      if (progressVideo)
        progressPercentage = progressVideo / duration * 100;
      return /* @__PURE__ */ jsxs("article", { className: "cursor-pointer", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", onClick: () => getVideo(video.id), children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: video.thumbnail.src,
              alt: video.session_title,
              className: "aspect-video object-cover"
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute bottom-0 left-0 h-1 w-full bg-green-500",
              style: { width: `${progressPercentage}%` }
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "absolute text-white bg-green-500 top-0 p-1 text-sm", children: secondsToHms(video.duration) })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-white text-center font-bold mt-2", children: video.session_title })
      ] }, video.id);
    }) })
  ] }) : loading ? /* @__PURE__ */ jsx("div", { className: "text-white pt-10 text-xl font-bold", children: "Loading..." }) : /* @__PURE__ */ jsx("div", { className: "text-white pt-10 text-xl font-bold", children: "No videos found" });
}

function Home({ userIsLogged }) {
  const [streamer, setStreamer] = useState("");
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col place-items-center", children: [
    /* @__PURE__ */ jsx(Search, { setStreamer }),
    streamer && /* @__PURE__ */ jsx(Videos, { streamer, userIsLogged })
  ] });
}

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const session = await getSession(Astro2.request);
  const userIsLogged = session !== null;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Kick VOD Player" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="p-5 lg:p-10"> ${renderComponent($$result2, "Home", Home, { "client:load": true, "userIsLogged": userIsLogged, "client:component-hydration": "load", "client:component-path": "src/components/Home", "client:component-export": "default" })} </main> ` })}`;
}, "/Users/javipm/Documents/www/kickvodplayer/src/pages/index.astro", void 0);

const $$file = "/Users/javipm/Documents/www/kickvodplayer/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };

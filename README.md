<div align="center">
<h1>📽️ Kick VODs Player</h1>
<h2>This project is created for educational purposes only. Kick is the owner of all videos and content. This project is non-profit and is not responsible for the use that may be made of it.</h2>
</div>

![Mockup Web](screenshot.png)

## 🚀 Project Description

I'm a big Twitch user, and recently, a lot of my favorite streamers have
switched to Kick.

I mostly watch VODs a few days after they're broadcast, and Kick has
been disappointing in this area. There are playback issues, it doesn't
save your progress in the video, and you can't use gestures on mobile to
skip forward or backward, among other things.

So, I made this app to make watching VODs on Kick more comfortable. It
lets you watch Kick VODs easily. If you log in to the app (via Twitch,
using the button in the top right), you can save your progress in videos
and pick up where you left off later, even on a different device.

Kick might block access to its content at some point, so I can't
guarantee this app will work forever.

## 💾 Technologies Used

The data is obtained using Kick's "public" API.

The website is developed with the [Astro](https://astro.build/) framework and we use the [Tailwind CSS](https://tailwindcss.com/) framework to style the user interface. As the video player, we use [VideoJS](https://videojs.com/) and some plugins like [videojs-contrib-quality-levels](https://github.com/videojs/videojs-contrib-quality-levels), [videojs-hotkeys](https://github.com/ctd1500/videojs-hotkeys) and [videojs-mobile-ui](https://github.com/mister-ben/videojs-mobile-ui/tree/master). Additionally, we have used [AstroDB](https://astro.build/db/) to store the progress data of the videos and [Auth-astro](https://github.com/nowaythatworked/auth-astro) for login with Twitch.

The website is deployed using [Vercel](https://vercel.com/)'s service.

All contributions are welcome.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
            |


# YouTube Playlist Copy
A simple UserScript to copy YouTube playlist metadata to clipboard.

## Instructions
### Step 1. Script Manager
Install TamperMonkey: https://www.tampermonkey.net/
### Step 2. UserScript:
Install the UserScript from here: https://github.com/WhistlingZephyr/yt-playlist-copy/raw/main/yt-playlist-copy.user.js
### Step 3. Usage:
1. Open up any YouTube playlist.
2. Open your TamperMonkey's popout by clicking its icon.
3. Press "c" or click on the copy option of YouTube Playlist Copy.
Optionally, you can activate it from the context menu through right-clicking on the page.
### Step 4. Config
After running the script once, you can open its storage up in TamperMonkey's dashboard and change its config. The format uses https://handlebarsjs.com and gets passed data from https://docs.invidious.io/api/#get-apiv1channelsplaylistsucid-apiv1channelsucidplaylists.
// ==UserScript==
// @name         YouTube Playlist Copy
// @namespace    https://github.com/WhistlingZephyr/yt-playlist-copy
// @homepage     https://github.com/WhistlingZephyr/yt-playlist-copy
// @supportURL   https://github.com/WhistlingZephyr/yt-playlist-copy/issues
// @updateURL    https://github.com/WhistlingZephyr/yt-playlist-copy/raw/main/yt-playlist-copy.user.js
// @downloadURL  https://github.com/WhistlingZephyr/yt-playlist-copy/raw/main/yt-playlist-copy.user.js
// @version      0.1.2
// @description  A simple UserScript to copy YouTube playlist metadata to clipboard
// @author       WhistlingZephyr
// @match        https://www.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://cdn.jsdelivr.net/npm/handlebars@4.7.7/dist/handlebars.min.js#sha256=ZSnrWNaPzGe8v25yP0S6YaMaDLMTDHC+4mHTw0xydEk=
// @connect      inv.riverside.rocks
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    const formatSeconds = seconds => {
        if (seconds < 60) {
            return `${seconds}`;
        }
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes}:${seconds % 60}`;
        }
        return `${Math.floor(minutes / 60)}:${minutes % 60}:${seconds % 60}`;
    };
    const init = async () => {
        const values = await GM.listValues();
        const defaults = {
            thumbnailQuality: 'default',
            format:
                '[{{title}}]({{url}})\n' +
                '{{description}}\n\n' +
                '{{#each videos}}{{{index}}}. [{{{length}}}] [{{{title}}}]({{{url}}})\n' +
                '{{/each}}',
        };
        for (const [key, value] of Object.entries(defaults)) {
            if (
                !values.includes(key) ||
                (await GM.getValue(key)) == undefined
            ) {
                await GM.setValue(key, value);
            }
        }
    };
    const copyToClipboard = async () => {
        await init();
        const playlistID = new URL(window.location).searchParams.get('list');
        if (playlistID) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://inv.riverside.rocks/api/v1/playlists/${playlistID}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'json',
                async onload({ response }) {
                    const template = Handlebars.compile(
                        await GM.getValue('format')
                    );
                    await GM.setClipboard(
                        template({
                            ...response,
                            url: `https://www.youtube.com/playlist?list=${response.playlistId}`,
                            videos: response.videos.map((video, index) => ({
                                ...video,
                                url: `https://www.youtube.com/watch?v=${
                                    video.videoId
                                }&list=${response.playlistId}&index=${
                                    index + 1
                                }`,
                                length: formatSeconds(video.lengthSeconds),
                                index: index + 1,
                            })),
                        })
                    );
                },
            });
        }
    };

    GM.registerMenuCommand(
        'Copy playlist metadata to clipboard',
        copyToClipboard,
        'c'
    );
})();

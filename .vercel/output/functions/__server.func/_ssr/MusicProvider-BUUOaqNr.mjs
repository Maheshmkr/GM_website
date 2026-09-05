import { o as __toESM } from "../_runtime.mjs";
import { t as readJsonResponse } from "./api-BUT7_u4b.mjs";
import { a as require_react, n as useQuery, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as songs } from "./site-_zOoiwhn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MusicProvider-BUUOaqNr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MusicContext = (0, import_react.createContext)(null);
function parseDuration(value) {
	const [m, s] = value.split(":").map(Number);
	return (m || 0) * 60 + (s || 0);
}
function MusicProvider({ children }) {
	const audioRef = (0, import_react.useRef)(null);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [shuffle, setShuffle] = (0, import_react.useState)(false);
	const [repeat, setRepeat] = (0, import_react.useState)(false);
	const [hasStarted, setHasStarted] = (0, import_react.useState)(false);
	const [favorites, setFavorites] = (0, import_react.useState)({ Perfect: true });
	const { data: serverSongs = [] } = useQuery({
		queryKey: ["songs"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/media?type=song");
				const payload = await readJsonResponse(res);
				if (!payload.ok) return [];
				return Array.isArray(payload.data) ? payload.data : [];
			} catch (err) {
				console.error("Error fetching songs:", err);
				return [];
			}
		}
	});
	const playlist = (0, import_react.useMemo)(() => {
		if (serverSongs.length > 0) return serverSongs.map((s) => {
			const displayDate = s.memoryDate || s.createdAt || (/* @__PURE__ */ new Date()).toISOString();
			let audioUrl = s.url || "";
			if (s.source === "upload" && s.fileId) audioUrl = `/api/media/file/${s.fileId}`;
			else if (s.source === "google-drive" && s.url) {
				const match = s.url.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/i);
				if (match) audioUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
			}
			return {
				_id: s._id,
				title: s.title,
				artist: s.artist,
				audio: audioUrl,
				cover: s.coverFileId ? `/api/media/file/${s.coverFileId}` : songs[0].cover,
				duration: s.duration || "3:00",
				note: s.description || "",
				source: s.source || (s.fileId ? "upload" : "url"),
				url: s.url,
				startTime: s.startTime,
				startSeconds: s.startSeconds,
				endTime: s.endTime,
				endSeconds: s.endSeconds,
				rawDate: displayDate.split("T")[0],
				date: displayDate ? new Date(displayDate).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric"
				}) : ""
			};
		});
		return songs;
	}, [serverSongs]);
	const current = (0, import_react.useMemo)(() => {
		return playlist[index] || playlist[0] || {
			title: "No Song",
			artist: "Unknown",
			audio: "",
			cover: "",
			duration: "0:00"
		};
	}, [playlist, index]);
	const fallbackDuration = parseDuration(current.duration);
	const [duration, setDuration] = (0, import_react.useState)(fallbackDuration);
	(0, import_react.useEffect)(() => {
		setDuration(parseDuration(current.duration));
		setProgress(0);
	}, [current]);
	const next = (0, import_react.useCallback)(() => {
		setIndex((i) => shuffle ? Math.floor(Math.random() * playlist.length) : (i + 1) % playlist.length);
		setProgress(0);
	}, [shuffle, playlist]);
	const prev = (0, import_react.useCallback)(() => {
		setIndex((i) => (i - 1 + playlist.length) % playlist.length);
		setProgress(0);
	}, [playlist]);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const id = window.setInterval(() => {
			const el = audioRef.current;
			if (el && !el.error && el.readyState > 0 && el.duration) {
				setProgress(el.currentTime);
				setDuration(el.duration);
				return;
			}
			setProgress((p) => {
				if (p + .5 >= duration) {
					if (repeat) return 0;
					next();
					return 0;
				}
				return p + .5;
			});
		}, 500);
		return () => window.clearInterval(id);
	}, [
		playing,
		duration,
		repeat,
		next
	]);
	(0, import_react.useEffect)(() => {
		const el = audioRef.current;
		if (!el) return;
		if (playing) el.play().catch(() => void 0);
		else el.pause();
	}, [playing, index]);
	const play = (0, import_react.useCallback)((i) => {
		if (typeof i === "number") {
			setIndex(i);
			setProgress(0);
		}
		setHasStarted(true);
		setPlaying(true);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		songs: playlist,
		index,
		current,
		playing,
		progress,
		duration,
		shuffle,
		repeat,
		favorites,
		hasStarted,
		play,
		toggle: () => {
			setHasStarted(true);
			setPlaying((p) => !p);
		},
		next,
		prev,
		seek: (seconds) => {
			setProgress(seconds);
			const el = audioRef.current;
			if (el && !el.error && el.readyState > 0) el.currentTime = seconds;
		},
		toggleShuffle: () => setShuffle((s) => !s),
		toggleRepeat: () => setRepeat((r) => !r),
		toggleFavorite: (title) => setFavorites((f) => ({
			...f,
			[title]: !f[title]
		}))
	}), [
		playlist,
		index,
		current,
		playing,
		progress,
		duration,
		shuffle,
		repeat,
		favorites,
		hasStarted,
		play,
		next,
		prev
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MusicContext.Provider, {
		value,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			ref: audioRef,
			src: current.audio,
			preload: "none",
			onEnded: () => repeat ? play(index) : next()
		})]
	});
}
function useMusic() {
	const ctx = (0, import_react.useContext)(MusicContext);
	if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
	return ctx;
}
function formatTime(seconds) {
	const s = Math.max(0, Math.floor(seconds));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
//#endregion
export { formatTime as n, useMusic as r, MusicProvider as t };

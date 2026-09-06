import { o as __toESM } from "../_runtime.mjs";
import { r as readJsonResponse } from "./api-D5R3uvKX.mjs";
import { s as songs } from "./site-_zOoiwhn.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MusicProvider-XuC0OULW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MusicContext = (0, import_react.createContext)(null);
function parseDuration(value) {
	if (value === void 0 || value === null) return 0;
	if (typeof value === "number") return value;
	const clean = value.trim();
	const parts = clean.split(":").map(Number);
	if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
	if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
	return Number(clean) || 0;
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
				startSeconds: typeof s.startSeconds === "number" ? s.startSeconds : s.startTime ? parseDuration(s.startTime) : 0,
				endTime: s.endTime,
				endSeconds: typeof s.endSeconds === "number" ? s.endSeconds : s.endTime ? parseDuration(s.endTime) : void 0,
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
		const startSec = typeof current.startSeconds === "number" && current.startSeconds > 0 ? current.startSeconds : current.startTime ? parseDuration(current.startTime) : 0;
		setProgress(startSec);
	}, [current]);
	const next = (0, import_react.useCallback)(() => {
		setIndex((i) => {
			const nextIdx = shuffle ? Math.floor(Math.random() * playlist.length) : (i + 1) % playlist.length;
			const targetSong = playlist[nextIdx];
			const startSec = targetSong?.startSeconds !== void 0 && targetSong?.startSeconds > 0 ? targetSong.startSeconds : targetSong?.startTime ? parseDuration(targetSong.startTime) : 0;
			setProgress(startSec);
			return nextIdx;
		});
	}, [shuffle, playlist]);
	const prev = (0, import_react.useCallback)(() => {
		setIndex((i) => {
			const prevIdx = (i - 1 + playlist.length) % playlist.length;
			const targetSong = playlist[prevIdx];
			const startSec = targetSong?.startSeconds !== void 0 && targetSong?.startSeconds > 0 ? targetSong.startSeconds : targetSong?.startTime ? parseDuration(targetSong.startTime) : 0;
			setProgress(startSec);
			return prevIdx;
		});
	}, [playlist]);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const id = window.setInterval(() => {
			const el = audioRef.current;
			const startSec = typeof current.startSeconds === "number" && current.startSeconds > 0 ? current.startSeconds : current.startTime ? parseDuration(current.startTime) : 0;
			const endSec = typeof current.endSeconds === "number" && current.endSeconds > 0 ? current.endSeconds : current.endTime ? parseDuration(current.endTime) : void 0;
			if (el && !el.error && el.readyState > 0 && el.duration) {
				setProgress(el.currentTime);
				setDuration(el.duration);
				if (endSec && el.currentTime >= endSec) if (repeat) {
					el.currentTime = startSec;
					setProgress(startSec);
				} else next();
				return;
			}
			setProgress((p) => {
				const targetLimit = endSec || duration;
				if (p + .5 >= targetLimit) {
					if (repeat) return startSec;
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
		next,
		current
	]);
	(0, import_react.useEffect)(() => {
		const el = audioRef.current;
		if (!el) return;
		const startSec = typeof current.startSeconds === "number" && current.startSeconds > 0 ? current.startSeconds : current.startTime ? parseDuration(current.startTime) : 0;
		if (playing) {
			if (startSec > 0 && el.currentTime < startSec) try {
				el.currentTime = startSec;
			} catch (_) {}
			el.play().catch(() => void 0);
		} else el.pause();
	}, [
		playing,
		index,
		current
	]);
	const play = (0, import_react.useCallback)((i) => {
		if (typeof i === "number") {
			setIndex(i);
			const targetSong = playlist[i];
			const startSec = targetSong?.startSeconds !== void 0 && targetSong?.startSeconds > 0 ? targetSong.startSeconds : targetSong?.startTime ? parseDuration(targetSong.startTime) : 0;
			setProgress(startSec);
			const el = audioRef.current;
			if (el && !el.error) try {
				el.currentTime = startSec;
			} catch (_) {}
		}
		setHasStarted(true);
		setPlaying(true);
	}, [playlist]);
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
			setPlaying((p) => {
				const nextPlaying = !p;
				if (nextPlaying) {
					const el = audioRef.current;
					const startSec = typeof current.startSeconds === "number" && current.startSeconds > 0 ? current.startSeconds : current.startTime ? parseDuration(current.startTime) : 0;
					if (el && el.ended) try {
						el.currentTime = startSec;
						setProgress(startSec);
					} catch (_) {}
				}
				return nextPlaying;
			});
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
			src: current.audio && current.audio !== "/songs/perfect.mp3" ? current.audio : playing && current.audio ? current.audio : void 0,
			preload: "none",
			onError: () => {},
			onLoadedMetadata: () => {
				const el = audioRef.current;
				if (!el) return;
				const startSec = typeof current.startSeconds === "number" && current.startSeconds > 0 ? current.startSeconds : current.startTime ? parseDuration(current.startTime) : 0;
				if (startSec > 0 && el.currentTime < startSec) try {
					el.currentTime = startSec;
				} catch (_) {}
			},
			onTimeUpdate: () => {
				const el = audioRef.current;
				if (el && !el.error) {
					setProgress(el.currentTime);
					const endSec = typeof current.endSeconds === "number" && current.endSeconds > 0 ? current.endSeconds : current.endTime ? parseDuration(current.endTime) : void 0;
					if (endSec && el.currentTime >= endSec) if (repeat) {
						const startSec = typeof current.startSeconds === "number" && current.startSeconds > 0 ? current.startSeconds : current.startTime ? parseDuration(current.startTime) : 0;
						try {
							el.currentTime = startSec;
						} catch (_) {}
						setProgress(startSec);
					} else next();
				}
			},
			onEnded: () => {
				if (repeat) {
					const startSec = typeof current.startSeconds === "number" && current.startSeconds > 0 ? current.startSeconds : current.startTime ? parseDuration(current.startTime) : 0;
					if (audioRef.current) try {
						audioRef.current.currentTime = startSec;
					} catch (_) {}
					setProgress(startSec);
					play(index);
				} else next();
			}
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
export { useMusic as i, formatTime as n, parseDuration as r, MusicProvider as t };

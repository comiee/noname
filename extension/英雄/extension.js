import {lib, game, ui, get, ai, _status} from "../../noname.js";
import {skills} from "./skill.js";

export const type = "extension";
export default function () {
	return {
		name: "英雄",
		content: function (config, pack) {

		},
		precontent: function () {

		},
		help: {},
		config: {},
		package: {
			character: {
				character: {
					"巴泽特": ["female", "qun", 4, ["逆光", "格斗", "longdan"], ["ext:英雄/image/巴泽特.jpg", "die:ext:英雄/audio/die/巴泽特.mp3"]],
					"一方通行": ["male", "qun", 4, ["矢量"], ["ext:英雄/image/一方通行.jpg", "die:ext:英雄/audio/die/一方通行.mp3"]],
				},
				translate: {
					"巴泽特": "巴泽特",
					"一方通行": "一方通行",
					"英雄": "英雄",
				},
			},
			card: {
				card: {},
				translate: {},
				list: [],
			},
			skill: skills,
			intro: "",
			author: "comiee",
			diskURL: "",
			forumURL: "",
			version: "1.0",
		},
		files: {"character": ["image/巴泽特.jpg", "image/一方通行.jpg"], "card": [], "skill": [], "audio": []},
		connect: false
	}
};

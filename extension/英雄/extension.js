import {lib, game, ui, get, ai, _status} from "../../noname.js";

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
                    "巴泽特": ["female", "qun", 4, ["逆光", "格斗", "longdan"], ["ext:英雄/巴泽特.jpg", "die:ext:英雄/audio/die/巴泽特.mp3"]],
                    "一方通行": {
                        sex: "male",
                        group: "qun",
                        hp: 3,
                        maxHp: 3,
                        hujia: 0,
                        skills: ["矢量偏转", "一方通行"],
                        img: "extension/英雄/一方通行.jpg",
                        dieAudios: ["ext:英雄/audio/die/一方通行.mp3"],
                    },
                    "宇智波鼬": {
                        sex: "male",
                        group: "qun",
                        hp: 3,
                        maxHp: 3,
                        hujia: 0,
                        skills: ["天照", "火遁", "月读"],
                        img: "extension/英雄/宇智波鼬.jpg",
                        dieAudios: ["ext:英雄/宇智波鼬die.mp3"],
                    },
                    "宇智波佐助": {
                        sex: "male",
                        group: "qun",
                        hp: 3,
                        maxHp: 3,
                        hujia: 0,
                        skills: ["天照", "加具土命", "千鸟"],
                        img: "extension/英雄/宇智波佐助.jpg",
                    },
                },
                translate: {
                    "巴泽特": "巴泽特",
                    "一方通行": "一方通行",
                    "英雄": "英雄",
                    "宇智波鼬": "宇智波鼬",
                    "宇智波佐助": "宇智波佐助",
                },
            },
            card: {
                card: {},
                translate: {},
                list: [],
            },
            skill: {
                skill: {
                    "逆光": {
                        forced: true,
                        trigger: {
                            target: "shaBegin",
                        },
                        content: function () {
                            'step 0'
                            player.chooseToUse({name: trigger.card.name}, `逆光：是否对${get.translation(trigger.player)}使用一张${get.translation(trigger.card.name)}？`, trigger.player, -1).set('logSkill', '逆光');
                            player.addTempSkill('逆光_used', 'shaEnd');
                            player.temp = 0
                            'step 1'
                            if (player.temp) {
                                trigger.cancel()
                            }
                        },
                        subSkill: {
                            used: {
                                trigger: {
                                    player: "shaMiss",
                                },
                                forced: true,
                                content: function () {
                                    player.temp = 1
                                },
                                sub: true,
                                "_priority": 0,
                                sourceSkill: "逆光",
                            },
                        },
                        "_priority": 0,
                    },
                    "格斗": {
                        trigger: {
                            player: "damageEnd",
                            source: "damageEnd",
                        },
                        frequent: true,
                        content: function () {
                            player.draw(trigger.num)
                        },
                        "_priority": 0,
                    },
                    "天照": {
                        audio: 2,
                        audioname2: {
                            "宇智波鼬": "ext:英雄/天照_鼬",
                            "宇智波佐助": "ext:英雄/天照_佐助",
                        },
                        enable: ["chooseToUse", "chooseToRespond"],
                        filterCard: {
                            name: "sha",
                            color: "black",
                        },
                        position: "hes",
                        viewAs: {
                            name: "sha",
                            nature: "fire",
                        },
                        filter(event, player) {
                            return player.countCards("hes", {name: 'sha', color: 'black'});
                        },
                        viewAsFilter(player) {
                            return player.countCards("hes", {name: 'sha', color: 'black'});
                        },
                        prompt: "将一张黑【杀】当【火杀】使用或打出",
                        async onuse(result, player) {
                            player.addTempSkill('天照_used');
                        },
                        subSkill: {
                            used: {
                                trigger: {
                                    player: "shaDamage",
                                },
                                forced: true,
                                async content(event, trigger, player) {
                                    if (trigger.skill === "天照") {
                                        trigger.target.addMark("天照_mark", 1);
                                        trigger.target.addSkill("天照_mark");
                                    }
                                },
                                sub: true,
                                "_priority": 0,
                                sourceSkill: "天照",
                            },
                            mark: {
                                mark: true,
                                marktext: "照",
                                charlotte: true,
                                forced: true,
                                intro: {
                                    content: "回合开始时进行#次判定，若为黑色，受到1点火伤",
                                },
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                async content(event, trigger, player) {
                                    for (let i = 0; i < player.countMark('天照_mark'); i++) {
                                        const result = await player.judge(card => {
                                            if (get.color(card) === 'black') {
                                                return 1;
                                            }
                                            return 0;
                                        }).forResult();
                                        if (result.bool) {
                                            player.damage('fire', 'nosource', 'nocard');
                                        }
                                    }
                                },
                                sub: true,
                                sourceSkill: "天照",
                                "_priority": 0,
                            },
                        },
                        "_priority": 0,
                    },
                    "火遁": {
                        audio: "ext:英雄/豪火球之术",
                        enable: ["chooseToUse", "chooseToRespond"],
                        filterCard: {
                            color: "red",
                        },
                        position: "hes",
                        viewAs: {
                            name: "sha",
                            nature: "fire",
                        },
                        filter(event, player) {
                            return player.countCards("hes", {color: 'red'});
                        },
                        viewAsFilter(player) {
                            return player.countCards("hes", {color: 'red'});
                        },
                        prompt: "将一张红色牌当【火杀】使用或打出",
                        "_priority": 0,
                    },
                    "月读": {
                        audio: "ext:英雄/月读",
                        enable: "phaseUse",
                        usable: 1,
                        filter(event, player) {
                            return player.countCards("h") > 0;
                        },
                        filterTarget(card, player, target) { // 此效果意为需要选择目标，返回值为数组，传参为event.targets。
                            return target !== player && target.countCards('h') > 0; // 不能选择自己
                        },
                        async content(event, trigger, player) {
                            const target = event.targets[0];
                            const next = player
                                .chooseCardOL([player, target], "月读：请选择要展示的牌", true, 1)
                                .set("source", player);
                            next.aiCard = function (target) {
                                return {bool: true, cards: target.getCards('h').randomGet()};
                            };
                            const result = await next.forResult();
                            let cards1 = result[0].cards,
                                cards2 = result[1].cards;
                            await player.showCards(cards1);
                            await target.showCards(cards2);
                            let card1 = cards1[0],
                                card2 = cards2[0];
                            if (get.color(card1) === get.color(card2)) {
                                target.addTempSkill("月读_mark");
                            }
                        },
                        subSkill: {
                            mark: {
                                charlotte: true,
                                forced: true,
                                mark: true,
                                marktext: "读",
                                intro: {
                                    content: "非锁定技失效且不能使用或打出牌",
                                },
                                mod: {
                                    cardEnabled2(card) {
                                        if (get.position(card) === "h") {
                                            return false;
                                        }
                                    },
                                },
                                init: function (player, skill) {
                                    player.addSkillBlocker(skill);
                                    player.addTip(skill, "非锁定技失效");
                                },
                                onremove: function (player, skill) {
                                    player.removeSkillBlocker(skill);
                                    player.removeTip(skill);
                                },
                                skillBlocker: function (skill, player) {
                                    return !lib.skill[skill].persevereSkill && !lib.skill[skill].charlotte && !get.is.locked(skill, player);
                                },
                                sub: true,
                                sourceSkill: "月读",
                                "_priority": 0,
                            },
                        },
                        "_priority": 0,
                    },
                    "加具土命": {
                        audio: "ext:英雄/加具土命",
                        mod: {
                            targetInRange(card, player, target) {
                                if (card.name === 'sha' && card.nature === "fire") {
                                    return true;
                                }
                            }
                        },
                        group: ['加具土命_use', '加具土命_die'],
                        subSkill: {
                            use: {
                                audio: "ext:英雄/加具土命",
                                enable: "phaseUse",
                                usable: 1,
                                filterCard: true,
                                position: "hes",
                                filter(event, player) {
                                    return game.players.some(p => p.hasMark("天照_mark"));
                                },
                                filterTarget(card, player, target) {
                                    if (ui.selected.targets.length === 0) {
                                        return target.hasMark("天照_mark");  // 第一个角色：有天照标记
                                    }
                                    if (ui.selected.targets.length === 1) {
                                        return target !== ui.selected.targets[0];  // 第二个角色：不与第一个角色相同
                                    }
                                    return true;
                                },
                                targetprompt: ["被移走", "移动目标"],
                                selectTarget: 2,
                                multitarget: true,
                                async content(event, trigger, player) {
                                    event.targets[0].removeMark("天照_mark");
                                    event.targets[1].addMark("天照_mark");
                                    event.targets[1].addSkill("天照_mark");
                                }
                            },
                            die: {
                                audio: "ext:英雄/加具土命",
                                trigger: {
                                    global: "die",
                                },
                                filter(event, player) {
                                    return event.player.hasMark("天照_mark") && player.countCards("hes") > 0;
                                },
                                async cost(event, trigger, player) {
                                    event.result = await player
                                        .chooseCardTarget({
                                            position: "hes",
                                            prompt: get.prompt2(event.skill),
                                        })
                                        .forResult();
                                },
                                async content(event, trigger, player) {
                                    event.targets[0].addMark("天照_mark");
                                    event.targets[0].addSkill("天照_mark");
                                    await player.discard(event.cards);
                                }
                            }
                        },
                        "_priority": 0,
                    },
                    "千鸟": {
                        audio: "ext:英雄/千鸟",
                        enable: "phaseUse",
                        usable: 1,
                        filter(event, player) {
                            return player.countCards("h") > 0;
                        },
                        filterTarget(card, player, target) {
                            return player !== target && target.countCards('h') > 0;
                        },
                        async cost(event, trigger, player) {
                            event.result = await player
                                .chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                                    if (target === player) {
                                        return false;
                                    }
                                    if (player.isUnseen()) {
                                        return target.isUnseen();
                                    }
                                    return !target.isFriendOf(player);
                                })
                                .forResult();
                        },
                        async content(event, trigger, player) {
                            const target = event.targets[0];
                            const next = target
                                .chooseCard("千鸟：请选择要展示的牌", true, 1)
                                .set("source", player);
                            next.aiCard = function (target) {
                                return {bool: true, cards: target.getCards('h').randomGet()};
                            };
                            let result = await next.forResult();
                            let cards = result.cards;
                            await target.showCards(cards);
                            result = await player
                                .chooseToGive(target, 1, function (card) {
                                    return get.color(card) !== get.color(cards[0]);
                                })
                                .forResult();
                            if (result.bool) {
                                await target.damage("thunder");
                                await target.discard(target.getEquips(2));
                            }
                        },
                        "_priority": 0,
                    },
                    "矢量偏转": {
                        audio: "ext:矢量:true",
                        trigger: {
                            player: "damageBegin3",
                        },
                        usable: 1,
                        filter(event, player) {
                            return player.countCards('hes') > 0;
                        },
                        async cost(event, trigger, player) {
                            event.result = await player
                                .chooseCardTarget({
                                    position: "hes",
                                    filterTarget: function (card, player, target) {
                                        return player !== target;
                                    },
                                    prompt: get.prompt2(event.skill),
                                })
                                .forResult();
                        },
                        async content(event, trigger, player) {
                            trigger.player = event.targets[0];
                            await player.discard(event.cards);
                        },
                        "_priority": 0,
                    },
                    "一方通行": {
                        skillAnimation: true,
                        animationColor: "water",
                        trigger: {
                            player: ["changeHp", "loseAfter"],
                        },
                        juexingji: true,
                        unique: true,
                        forced: true,
                        filter(event, player) {
                            return player.hp <= 0 || player.countCards('h') <= 0;
                        },
                        async content(event, trigger, player) {
                            await player.loseMaxHp();
                            await player.recover(Infinity);
                            player.awakenSkill(event.name);
                            player.removeSkill('矢量偏转');
                            player.addSkill('御坂网络');
                            player.addSkill('矢量操作');
                        },
                        "_priority": 0,
                    },
                    "御坂网络": {
                        mark: true,
                        marktext: "电池",
                        forced: true,
                        intro: {
                            content: "当前持有#个电池",
                        },
                        trigger: {
                            player: "loseAfter",
                        },
                        filter(event, player) {
                            if (event.type !== 'discard' && event.type !== 'gain') {
                                return false;
                            }
                            const evt = event.getl(player);
                            if (!evt || evt.player !== player) {
                                return false;
                            }
                            for (let k of ['hs', 'es', 'ss']) {
                                if (evt[k] && evt[k].length > 0) {
                                    return true;
                                }
                            }
                            return false;
                        },
                        async content(event, trigger, player) {
                            if (!trigger.cards) {
                                return;
                            }
                            let num = player.countMark('御坂网络') + trigger.cards.length;
                            player.setMark('御坂网络', Math.min(num, 3));
                            player.markSkill('御坂网络');
                        },
                        init(player) {
                            player.addMark('御坂网络', 2);
                        },
                        "_priority": 0,
                    },
                    "矢量操作": {
                        audio: "ext:矢量:true",
                        trigger: {
                            global: "damageBegin3",
                        },
                        usable: 1,
                        filter(event, player) {
                            return player.hasMark('御坂网络');
                        },
                        async cost(event, trigger, player) {
                            let text = `${get.translation(trigger.player)}即将受到${trigger.num}点伤害，是否消耗一个电池将此伤害转移给其他人？`
                            event.result = await player
                                .chooseTarget(function (card, player, target) {
                                    return target !== trigger.player;
                                }, text)
                                .forResult();
                        },
                        async content(event, trigger, player) {
                            trigger.player = event.targets[0];
                            player.removeMark('御坂网络');
                        },
                        "_priority": 0,
                    },
                },
                translate: {
                    "逆光": "逆光",
                    "逆光_info": "锁定技，当你成为杀的目标时，你可以对杀的使用者使用一张更早结算的杀。然后若你以此法使用的杀被闪抵消，则其使用的杀无效。",
                    "格斗": "格斗",
                    "格斗_info": "当你受到或造成伤害后，你摸等同于此伤害值的牌。",
                    "天照": "天照",
                    "天照_info": "你可以把黑杀当火杀使用或打出，你以此法使用或打出的杀造成伤害时，使对方获得一枚【照】标记（回合开始时进行X次判定，若为黑色，受到1点火伤，X为【照】标记的层数）",
                    "火遁": "火遁",
                    "火遁_info": "你可以将红色牌当火杀使用或打出",
                    "月读": "月读",
                    "月读_info": "每回合限一次，你可以指定一名其他角色，与其同时展示一张牌，若你和他展示的牌颜色一致，你使其获得【读】状态（非锁定技失效且不能使用或打出牌），直到回合结束",
                    "加具土命": "加具土命",
                    "加具土命_info": "你使用的火杀无距离限制；出牌阶段，你可以弃一张牌，移动场上一枚【照】标记的位置：其他角色死亡时，若其拥有【照】标记，你可选择弃一张牌，移动其中一枚【照】标记的位置",
                    "千鸟": "千鸟",
                    "千鸟_info": "每回合限一次，你可令一名其他角色展示一张手牌，若你交给其一张颜色不同的手牌，你对其造成一点雷伤，并弃置其防具",
                    "矢量偏转": "矢量偏转",
                    "矢量偏转_info": "每回合限一次，当你受到伤害时，你可以弃一张牌并选择一名其他角色，将此伤害转移给对方",
                    "一方通行": "一方通行",
                    "一方通行_info": "【觉醒技】当你体力小于等于0或失去最后一张手牌时，你减一点体力上限并回满体力，失去【矢量偏转】，获得【御坂网络】（获得此技能时，你获得2个“电池”；当你因被弃置或被获取而失去牌时，你获得等量的“电池”；你至多拥有3个“电池”）、【矢量操作】（每回合限一次，当任意角色受到伤害时，你可以消耗一个“电池”，将此伤害转移给一名其他角色）",
                    "御坂网络": "御坂网络",
                    "御坂网络_info": "获得此技能时，你获得2个“电池”；当你因被弃置或被获取而失去牌时，你获得等量的“电池”；你至多拥有3个“电池”",
                    "矢量操作": "矢量操作",
                    "矢量操作_info": "每回合限一次，当任意角色受到伤害时，你可以消耗一个“电池”，将此伤害转移给一名其他角色",
                },
            },
            intro: "",
            author: "comiee",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        },
        files: {
            "character": ["巴泽特.jpg", "宇智波鼬.jpg", "一方通行.jpg", "宇智波佐助.jpg"],
            "card": [],
            "skill": [],
            "audio": []
        },
        connect: false
    }
};
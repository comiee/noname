import { lib, game, ui, get, ai, _status } from "../../noname.js";
export const type = "extension";
export default function(){
	return {name:"英雄",content:function (config, pack) {

        },precontent:function () {

        },help:{},config:{},package:{
    character: {
        character: {
            "巴泽特": ["female","qun",4,["逆光","格斗","longdan"],["ext:英雄/巴泽特.jpg","die:ext:英雄/audio/die/巴泽特.mp3"]],
            "一方通行": {
                sex: "male",
                group: "qun",
                hp: 4,
                maxHp: 4,
                hujia: 0,
                skills: ["矢量偏转","一方通行"],
                img: "extension/英雄/一方通行.jpg",
                dieAudios: ["ext:英雄/audio/die/一方通行.mp3"],
            },
            "宇智波鼬": {
                sex: "male",
                group: "qun",
                hp: 3,
                maxHp: 3,
                hujia: 0,
                skills: ["天照","火遁","月读"],
                img: "extension/英雄/宇智波鼬.jpg",
                dieAudios: ["ext:英雄/audio/die/宇智波鼬die.mp3"],
            },
        },
        translate: {
            "巴泽特": "巴泽特",
            "一方通行": "一方通行",
            "英雄": "英雄",
            "宇智波鼬": "宇智波鼬",
        },
    },
    card: {
        card: {
        },
        translate: {
        },
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
                audio: "ext:英雄/天照",
                enable: ["chooseToUse","chooseToRespond"],
                filterCard: {
                    name: "sha",
                    color: "black",
                },
                position: "hes",
                viewAs: {
                    name: "sha",
                    nature: "fire",
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
                            for (let i = 0; i < player.storage['天照_mark']; i++) {
                                event.result = await player.judge(card => {
                                    if (get.color(card) === 'black') {
                                        player.damage('fire');
                                    }
                                });
                            }
                        },
                        sub: true,
                        sourceSkill: "天照",
                        "_priority": 0,
                    },
                },
                "_priority": 0,
                ai: {
                    respondSha: true,
                    skillTagFilter(player) {
                        return player.countCards('h', {name: 'sha', color: 'black'}) > 0;
                    },
                    yingbian(card, player, targets, viewer) {
                        if (get.attitude(viewer, player) <= 0) {
                            return 0;
                        }
                        var base = 0,
                            hit = false;
                        if (get.cardtag(card, "yingbian_hit")) {
                            hit = true;
                            if (
                                targets.some(target => {
                                    return target.mayHaveShan(viewer, "use") && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.natureList(card)) > 0;
                                })
                            ) {
                                base += 5;
                            }
                        }
                        if (get.cardtag(card, "yingbian_add")) {
                            if (
                                game.hasPlayer(function (current) {
                                    return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                                })
                            ) {
                                base += 5;
                            }
                        }
                        if (get.cardtag(card, "yingbian_damage")) {
                            if (
                                targets.some(target => {
                                    return (
                                        get.attitude(player, target) < 0 &&
                                        (hit ||
                                            !target.mayHaveShan(viewer, "use") ||
                                            player.hasSkillTag(
                                                "directHit_ai",
                                                true,
                                                {
                                                    target: target,
                                                    card: card,
                                                },
                                                true
                                            )) &&
                                        !target.hasSkillTag("filterDamage", null, {
                                            player: player,
                                            card: card,
                                            jiu: true,
                                        })
                                    );
                                })
                            ) {
                                base += 5;
                            }
                        }
                        return base;
                    },
                    canLink(player, target, card) {
                        if (!target.isLinked() && !player.hasSkill("wutiesuolian_skill")) {
                            return false;
                        }
                        if (player.hasSkill("jueqing") || player.hasSkill("gangzhi") || target.hasSkill("gangzhi")) {
                            return false;
                        }
                        let obj = {};
                        if (get.attitude(player, target) > 0 && get.attitude(target, player) > 0) {
                            if (
                                (player.hasSkill("jiu") ||
                                    player.hasSkillTag("damageBonus", true, {
                                        target: target,
                                        card: card,
                                    })) &&
                                !target.hasSkillTag("filterDamage", null, {
                                    player: player,
                                    card: card,
                                    jiu: player.hasSkill("jiu"),
                                })
                            ) {
                                obj.num = 2;
                            }
                            if (target.hp > obj.num) {
                                obj.odds = 1;
                            }
                        }
                        if (!obj.odds) {
                            obj.odds = 1 - target.mayHaveShan(player, "use", true, "odds");
                        }
                        return obj;
                    },
                    basic: {
                        useful: [5,3,1],
                        value: [5,3,1],
                    },
                    order(item, player) {
                        let res = 3.2;
                        if (player.hasSkillTag("presha", true, null, true)) {
                            res = 10;
                        }
                        if (typeof item !== "object" || !game.hasNature(item, "linked") || game.countPlayer(cur => cur.isLinked()) < 2) {
                            return res;
                        }
                        //let used = player.getCardUsable('sha') - 1.5, natures = ['thunder', 'fire', 'ice', 'kami'];
                        let uv = player.getUseValue(item, true);
                        if (uv <= 0) {
                            return res;
                        }
                        let temp = player.getUseValue("sha", true) - uv;
                        if (temp < 0) {
                            return res + 0.15;
                        }
                        if (temp > 0) {
                            return res - 0.15;
                        }
                        return res;
                    },
                    result: {
                        target(player, target, card, isLink) {
                            let eff = -1.5,
                                odds = 1.35,
                                num = 1;
                            if (isLink) {
                                eff = isLink.eff || -2;
                                odds = isLink.odds || 0.65;
                                num = isLink.num || 1;
                                if (
                                    num > 1 &&
                                    target.hasSkillTag("filterDamage", null, {
                                        player: player,
                                        card: card,
                                        jiu: player.hasSkill("jiu"),
                                    })
                                ) {
                                    num = 1;
                                }
                                return odds * eff * num;
                            }
                            if (
                                player.hasSkill("jiu") ||
                                player.hasSkillTag("damageBonus", true, {
                                    target: target,
                                    card: card,
                                })
                            ) {
                                if (
                                    target.hasSkillTag("filterDamage", null, {
                                        player: player,
                                        card: card,
                                        jiu: player.hasSkill("jiu"),
                                    })
                                ) {
                                    eff = -0.5;
                                } else {
                                    num = 2;
                                    if (get.attitude(player, target) > 0) {
                                        eff = -7;
                                    } else {
                                        eff = -4;
                                    }
                                }
                            }
                            if (
                                !player.hasSkillTag(
                                    "directHit_ai",
                                    true,
                                    {
                                        target: target,
                                        card: card,
                                    },
                                    true
                                )
                            ) {
                                odds -= 0.7 * target.mayHaveShan(player, "use", true, "odds");
                            }
                            _status.event.putTempCache("sha_result", "eff", {
                                bool: target.hp > num && get.attitude(player, target) > 0,
                                card: ai.getCacheKey(card, true),
                                eff: eff,
                                odds: odds,
                            });
                            return odds * eff;
                        },
                    },
                    tag: {
                        respond: 1,
                        respondShan: 1,
                        damage(card) {
                            if (game.hasNature(card, "poison")) {
                                return;
                            }
                            return 1;
                        },
                        natureDamage(card) {
                            if (game.hasNature(card, "linked")) {
                                return 1;
                            }
                        },
                        fireDamage(card, nature) {
                            if (game.hasNature(card, "fire")) {
                                return 1;
                            }
                        },
                        thunderDamage(card, nature) {
                            if (game.hasNature(card, "thunder")) {
                                return 1;
                            }
                        },
                        poisonDamage(card, nature) {
                            if (game.hasNature(card, "poison")) {
                                return 1;
                            }
                        },
                    },
                },
            },
            "火遁": {
                audio: "ext:英雄/豪火球之术",
                enable: ["chooseToUse","chooseToRespond"],
                filterCard: {
                    color: "red",
                },
                position: "hes",
                viewAs: {
                    name: "sha",
                    nature: "fire",
                },
                viewAsFilter(player) {
                    return player.countCards("hes", {color: 'red'});
                },
                prompt: "将一张红色牌当【火杀】使用或打出",
                "_priority": 0,
                ai: {
                    respondSha: true,
                    skillTagFilter(player) {
                        return player.countCards('h', {color: 'red'}) > 0;
                    },
                    yingbian(card, player, targets, viewer) {
                        if (get.attitude(viewer, player) <= 0) {
                            return 0;
                        }
                        var base = 0,
                            hit = false;
                        if (get.cardtag(card, "yingbian_hit")) {
                            hit = true;
                            if (
                                targets.some(target => {
                                    return target.mayHaveShan(viewer, "use") && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.natureList(card)) > 0;
                                })
                            ) {
                                base += 5;
                            }
                        }
                        if (get.cardtag(card, "yingbian_add")) {
                            if (
                                game.hasPlayer(function (current) {
                                    return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                                })
                            ) {
                                base += 5;
                            }
                        }
                        if (get.cardtag(card, "yingbian_damage")) {
                            if (
                                targets.some(target => {
                                    return (
                                        get.attitude(player, target) < 0 &&
                                        (hit ||
                                            !target.mayHaveShan(viewer, "use") ||
                                            player.hasSkillTag(
                                                "directHit_ai",
                                                true,
                                                {
                                                    target: target,
                                                    card: card,
                                                },
                                                true
                                            )) &&
                                        !target.hasSkillTag("filterDamage", null, {
                                            player: player,
                                            card: card,
                                            jiu: true,
                                        })
                                    );
                                })
                            ) {
                                base += 5;
                            }
                        }
                        return base;
                    },
                    canLink(player, target, card) {
                        if (!target.isLinked() && !player.hasSkill("wutiesuolian_skill")) {
                            return false;
                        }
                        if (player.hasSkill("jueqing") || player.hasSkill("gangzhi") || target.hasSkill("gangzhi")) {
                            return false;
                        }
                        let obj = {};
                        if (get.attitude(player, target) > 0 && get.attitude(target, player) > 0) {
                            if (
                                (player.hasSkill("jiu") ||
                                    player.hasSkillTag("damageBonus", true, {
                                        target: target,
                                        card: card,
                                    })) &&
                                !target.hasSkillTag("filterDamage", null, {
                                    player: player,
                                    card: card,
                                    jiu: player.hasSkill("jiu"),
                                })
                            ) {
                                obj.num = 2;
                            }
                            if (target.hp > obj.num) {
                                obj.odds = 1;
                            }
                        }
                        if (!obj.odds) {
                            obj.odds = 1 - target.mayHaveShan(player, "use", true, "odds");
                        }
                        return obj;
                    },
                    basic: {
                        useful: [5,3,1],
                        value: [5,3,1],
                    },
                    order(item, player) {
                        let res = 3.2;
                        if (player.hasSkillTag("presha", true, null, true)) {
                            res = 10;
                        }
                        if (typeof item !== "object" || !game.hasNature(item, "linked") || game.countPlayer(cur => cur.isLinked()) < 2) {
                            return res;
                        }
                        //let used = player.getCardUsable('sha') - 1.5, natures = ['thunder', 'fire', 'ice', 'kami'];
                        let uv = player.getUseValue(item, true);
                        if (uv <= 0) {
                            return res;
                        }
                        let temp = player.getUseValue("sha", true) - uv;
                        if (temp < 0) {
                            return res + 0.15;
                        }
                        if (temp > 0) {
                            return res - 0.15;
                        }
                        return res;
                    },
                    result: {
                        target(player, target, card, isLink) {
                            let eff = -1.5,
                                odds = 1.35,
                                num = 1;
                            if (isLink) {
                                eff = isLink.eff || -2;
                                odds = isLink.odds || 0.65;
                                num = isLink.num || 1;
                                if (
                                    num > 1 &&
                                    target.hasSkillTag("filterDamage", null, {
                                        player: player,
                                        card: card,
                                        jiu: player.hasSkill("jiu"),
                                    })
                                ) {
                                    num = 1;
                                }
                                return odds * eff * num;
                            }
                            if (
                                player.hasSkill("jiu") ||
                                player.hasSkillTag("damageBonus", true, {
                                    target: target,
                                    card: card,
                                })
                            ) {
                                if (
                                    target.hasSkillTag("filterDamage", null, {
                                        player: player,
                                        card: card,
                                        jiu: player.hasSkill("jiu"),
                                    })
                                ) {
                                    eff = -0.5;
                                } else {
                                    num = 2;
                                    if (get.attitude(player, target) > 0) {
                                        eff = -7;
                                    } else {
                                        eff = -4;
                                    }
                                }
                            }
                            if (
                                !player.hasSkillTag(
                                    "directHit_ai",
                                    true,
                                    {
                                        target: target,
                                        card: card,
                                    },
                                    true
                                )
                            ) {
                                odds -= 0.7 * target.mayHaveShan(player, "use", true, "odds");
                            }
                            _status.event.putTempCache("sha_result", "eff", {
                                bool: target.hp > num && get.attitude(player, target) > 0,
                                card: ai.getCacheKey(card, true),
                                eff: eff,
                                odds: odds,
                            });
                            return odds * eff;
                        },
                    },
                    tag: {
                        respond: 1,
                        respondShan: 1,
                        damage(card) {
                            if (game.hasNature(card, "poison")) {
                                return;
                            }
                            return 1;
                        },
                        natureDamage(card) {
                            if (game.hasNature(card, "linked")) {
                                return 1;
                            }
                        },
                        fireDamage(card, nature) {
                            if (game.hasNature(card, "fire")) {
                                return 1;
                            }
                        },
                        thunderDamage(card, nature) {
                            if (game.hasNature(card, "thunder")) {
                                return 1;
                            }
                        },
                        poisonDamage(card, nature) {
                            if (game.hasNature(card, "poison")) {
                                return 1;
                            }
                        },
                    },
                },
            },
            "月读": {
                audio: "ext:英雄/月读",
                enable: "phaseUse",
                usable: 1,
                filterTarget(card, player, target) { // 此效果意为需要选择目标，返回值为数组，传参为event.targets。
                    return target !== player && target.countCards('h') > 0; // 不能选择自己
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
                        .setHiddenSkill(event.skill)
                        .forResult();
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
            "矢量偏转": {
                audio: "ext:矢量:true",
                trigger: {
                    player: "damageBegin4",
                },
                direct: true,
                usable: 1,
                filter: function (event, player) {
                    return player.countCards('hes') > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseCardTarget({
                        position: "hes",
                        filterTarget: function (card, player, target) {
                            return player != target;
                        },
                        prompt: "弃置一张牌，将此伤害转移给其他角色",
                    }).setHiddenSkill(event.name);
                    "step 1"
                    if (result.bool) {
                        player.discard(result.cards);
                        var target = result.targets[0];
                        player.logSkill(event.name, target);
                        trigger.cancel();
                        event.target = target;
                        event.card = result.cards[0];
                        event.related = event.target.damage(trigger.source || 'nosource', 'nocard');
                    } else {
                        event.finish();
                    }
                },
                "_priority": 0,
            },
            "一方通行": {
                "_priority": 0,
            },
            "御坂网络": {
            },
            "矢量操作": {
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
            "矢量偏转": "矢量偏转",
            "矢量偏转_info": "每回合限一次，当你受到伤害时，你可以弃一张牌并选择一名其他角色，将此伤害转移给对方",
            "一方通行": "一方通行",
            "一方通行_info": "【觉醒技】当你濒死或失去最后一张手牌时，你减一点体力上限并回满体力，失去【矢量偏转】，获得【御坂网络】（获得此技能时，你获得2个“电池”；当你于弃牌阶段或回合外失去牌时，获得等量的“电池”：你至多拥有3个“电池”）、【矢量操作】（当任意角色收到伤害时，你可以消耗一个“电池”，将此伤害转移给一名其他角色）",
            "御坂网络": "御坂网络",
            "御坂网络_info": "获得此技能时，你获得2个“电池”；当你于弃牌阶段或回合外失去牌时，获得等量的“电池”：你至多拥有3个“电池”",
            "矢量操作": "矢量操作",
            "矢量操作_info": "当任意角色收到伤害时，你可以消耗一个“电池”，将此伤害转移给一名其他角色",
        },
    },
    intro: "",
    author: "comiee",
    diskURL: "",
    forumURL: "",
    version: "1.0",
},files:{"character":["巴泽特.jpg","宇智波鼬.jpg","一方通行.jpg"],"card":[],"skill":[],"audio":[]},connect:false} 
};
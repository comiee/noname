export const skills = {
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
		"矢量": {
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
	},
	translate: {
		"逆光": "逆光",
		"逆光_info": "锁定技，当你成为杀的目标时，你可以对杀的使用者使用一张更早结算的杀。然后若你以此法使用的杀被闪抵消，则其使用的杀无效。",
		"格斗": "格斗",
		"格斗_info": "当你受到或造成伤害后，你摸等同于此伤害值的牌。",
		"矢量": "矢量",
		"矢量_info": "每回合限一次，当你受到伤害时，你可以弃一张牌并选择一名其他角色，将此伤害转移给对方",
	},
};

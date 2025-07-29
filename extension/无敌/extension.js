import { lib, game, ui, get, ai, _status } from "../../noname.js";

game.import("extension",function(){
	return {name:"无敌",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "一人之下":["female","shen",4,["后发先至","羽化成仙","连锁反应"],["boss","forbidai","bossallowed"]],
            "万人之上":["female","shen",16,["连锁反应","上帝视角","施舍给你","完全支配","侵蚀本源","模仿学习","我不能死"],["boss","forbidai","bossallowed"]],
            "幻化无穷":["female","shen",8,["千变万化","我不能死"],["boss","forbidai","bossallowed"]],
            "天下无敌":["female","shen",1,["wusheng","万寿无疆","以牙还牙"],["boss","forbidai","bossallowed"]],
            "以和为贵":["female","shen",2,["人畜无害","崩坏世界","不死之身"],["boss","forbidai","bossallowed"]],
            "绝处逢生":["female","shen",32,["放弃治疗","以牙还牙"],["boss","forbidai","bossallowed"]],
        },
        translate:{
            "一人之下":"一人之下",
            "万人之上":"万人之上",
            "幻化无穷":"幻化无穷",
            "天下无敌":"天下无敌",
            "以和为贵":"以和为贵",
            "绝处逢生":"绝处逢生",
        },
    },
    card:{
        card:{
        },
        translate:{
        },
        list:[],
    },
    skill:{
        skill:{
            "无伤定律":{
                audio:"ext:无敌:2",
                frequent:true,
                trigger:{
                    player:["damageBefore","loseHpBefore"],
                },
                content:function (){
        trigger.cancel();
    },
                mod:{
                    maxHandcard:function (player,num){
            return game.roundNumber;
        },
                },
                "_priority":0,
            },
            "连锁反应":{
                audio:"ext:无敌:2",
                frequent:true,
                trigger:{
                    player:"loseEnd",
                },
                filter:function (event,player){
        return player.countCards('h')<player.maxHp;
    },
                mod:{
                    cardUsable:function (card,player,num){
            return Infinity;
        },
                    selectTarget:function (card,player,range){
            if(range[1]==-1) return;
            range[1]=Infinity;
        },
                },
                content:function (){
        player.draw();
    },
                "_priority":0,
            },
            "上帝视角":{
                trigger:{
                    player:"turnOverBefore",
                },
                forced:true,
                content:function (){
        trigger.cancel();
    },
                mod:{
                    globalFrom:function (from,to){
            return -Infinity;
        },
                    targetEnabled:function (card,player,target){
            if(target.hp<=player.hp&&player!=target){
                return false;
            }
        },
                },
                "_priority":0,
            },
            "施舍给你":{
                enable:"phaseUse",
                position:"hej",
                filterCard:true,
                selectCard:[1,Infinity],
                discard:false,
                prepare:"give",
                filterTarget:1,
                content:function (){
        target.gain(cards,player);
          target.recover(cards.length);
    },
                "_priority":0,
            },
            "侵蚀本源":{
                trigger:{
                    source:"damageBefore",
                },
                logTarget:"player",
                content:function (){
        trigger.cancel();
        trigger.player.loseMaxHp();
    },
                "_priority":0,
            },
            "模仿学习":{
                trigger:{
                    global:"drawAfter",
                },
                forced:true,
                unique:true,
                filter:function (event,player){
        return event.player!=player;
    },
                content:function (){
        player.viewHandcards(trigger.player);
    },
                init:function (player){
        let skill_list=["天道",'lianpo','aocai','guose','duanliang','lianhuan','kanpo','huoji','wusheng','qingguo','jiuchi','jijiu','guhuo','gongxin','zhijian','manjuan','zongxuan','tianbian','jyzongshi','wansha'];
        for(let skill of skill_list){
            player.addSkill(skill);
        }
    },
                "_priority":0,
            },
            "天道":{
                audio:"ext:无敌:true",
                trigger:{
                    global:"judge",
                },
                direct:true,
                filter:function (event,player){
        return player.countCards('he')>0;
    },
                content:function (){
        "step 0"
        player.chooseCard(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
        get.translation(trigger.player.judging[0])+'，'+get.prompt('天道'),'he').ai=function(card){
            var trigger=_status.event.parent._trigger;
            var player=_status.event.player;
            var result=trigger.judge(card)-trigger.judge(trigger.player.judging[0]);
            var attitude=get.attitude(player,trigger.player);
            if(attitude==0||result==0) return 0;
            if(attitude>0){
                return result;
            }
            else{
                return -result;
            }
        };
        "step 1"
        if(result.bool){
            player.respond(result.cards,'highlight');
        }
        else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            player.logSkill('天道');
            player.$gain2(trigger.player.judging[0]);
            player.gain(trigger.player.judging[0]);
            trigger.player.judging[0]=result.cards[0];
            trigger.position.appendChild(result.cards[0]);
            game.log(trigger.player,'的判定牌改为',result.cards[0]);
        }
        "step 3"
        game.delay(2);
    },
                "_priority":0,
            },
            "改命":{
                trigger:{
                    global:"judgeBefore",
                },
                priority:1,
                unique:true,
                content:function (){
        "step 0"
        event.cards=get.cards(7);
        player.chooseCardButton(true,event.cards,'改命：选择一张牌作为你的'+trigger.judgestr+'判定结果').ai=function(button){
            if(get.attitude(player,trigger.player)>0){
                return 1+trigger.judge(button.link);
            }
            if(get.attitude(player,trigger.player)<0){
                return 1-trigger.judge(button.link);
            }
            return 0;
        };
        "step 1"
        if(!result.bool){
            event.finish();
            return;
        }
        player.logSkill('gaiming',trigger.player);
        var card=result.links[0];
        event.cards.remove(card);
        var judgestr=get.translation(trigger.player)+'的'+trigger.judgestr+'判定';
        event.videoId=lib.status.videoId++;
        event.dialog=ui.create.dialog(judgestr);
        event.dialog.classList.add('center');
        event.dialog.videoId=event.videoId;

        game.addVideo('judge1',player,[get.cardInfo(card),judgestr,event.videoId]);
        for(var i=0;i<event.cards.length;i++) event.cards[i].discard();
        // var node=card.copy('thrown','center',ui.arena).animate('start');
        var node;
        if(game.chess){
            node=card.copy('thrown','center',ui.arena).animate('start');
        }
        else{
            node=player.$throwordered(card.copy(),true);
        }
        node.classList.add('thrownhighlight');
        ui.arena.classList.add('thrownhighlight');
        if(card){
            trigger.cancel();
            trigger.result={
                card:card,
                judge:trigger.judge(card),
                node:node,
                number:get.number(card),
                suit:get.suit(card),
                color:get.color(card),
            };
            if(trigger.result.judge>0){
                trigger.result.bool=true;
                trigger.player.popup('洗具');
            }
            if(trigger.result.judge<0){
                trigger.result.bool=false;
                trigger.player.popup('杯具');
            }
            game.log(trigger.player,'的判定结果为',card);
            trigger.direct=true;
            trigger.position.appendChild(card);
            game.delay(2);
        }
        else{
            event.finish();
        }
        "step 2"
        ui.arena.classList.remove('thrownhighlight');
        event.dialog.close();
        game.addVideo('judge2',null,event.videoId);
        ui.clear();
        var card=trigger.result.card;
        trigger.position.appendChild(card);
        trigger.result.node.delete();
        game.delay();
    },
                "_priority":100,
            },
            "完全支配":{
                enable:"phaseUse",
                filterTarget:1,
                usable:1,
                content:function (){
        'step 0'
        player.chooseControlList([
            '获得该角色任意区域的一些牌',
            '让该角色翻面',
            '让该角色失去非锁定技并无法使用或打出手牌，直到回合结束',
            '让该角色进入混乱状态，直到其下回合结束'
        ]);
        'step 1'
        switch(result.index){
        case 0:
                player.gainPlayerCard([1,Infinity],target,'hej');
                break;
        case 1:
                target.turnOver();
                break;
        case 2:
                target.addTempSkill('fengyin');
                target.addTempSkill('yijue2');
                break;
        case 3:
                target.goMad({player:'phaseAfter'});
                break;
        }
    },
                "_priority":0,
            },
            "我不能死":{
                skillAnimation:true,
                trigger:{
                    player:"changeHp",
                },
                unique:true,
                filter:function (event,player){
        return player.hp<=1;
    },
                forced:true,
                priority:3,
                content:function (){
        if(player.maxHp>3)player.loseMaxHp(player.maxHp-3);
        else player.gainMaxHp(3-player.maxHp);
        player.hp=3;
        player.addSkill('无伤定律');
        player.addSkill('改命');
        player.awakenSkill('我不能死');
    },
                "_priority":300,
            },
            "千变万化":{
                unique:true,
                trigger:{
                    global:"roundStart",
                },
                direct:true,
                init:function (player){
        player.storage.千变万化=[];
    },
                intro:{
                    content:"characters",
                },
                content:function (){
        'step 0'
        player.logSkill('千变万化');
        var list=[];
        for(var i in lib.character){
            //if(lib.character[i][4].contains('boss')) continue;
            if(player.storage.千变万化.contains(i)) continue;
            list.push(i);
        }
        var name=list.randomGet();
        player.storage.千变万化.push(name);
        player.markSkill('千变万化');
        var skills=lib.character[name][3];
        for(var i of skills){
            lib.skill[i].forced=false;
            lib.skill[i].frequent=true;
            player.addSkill(i);
        }
        event.dialog=ui.create.dialog('<div class="text center">'+get.translation(player)+'发动了【千变万化】',[[name],'character']);
        game.delay(3);
        'step 1'
        event.dialog.close();
        player.recover(game.players.length-player.storage.千变万化.length);
    },
                "_priority":0,
            },
            "不死之身":{
                skillAnimation:true,
                trigger:{
                    player:"dieBegin",
                },
                unique:true,
                priority:3,
                content:function (){
        trigger.cancel();
        player.gainMaxHp();
        player.recover(Infinity);
    },
                "_priority":300,
            },
            "崩坏世界":{
                audio:"ext:无敌:2",
                trigger:{
                    global:"gameDrawAfter",
                },
                forced:true,
                unique:true,
                content:function (){
        for(var i=0;i<game.players.length;i++){
            if(game.players[i]==player) continue;
            game.players[i].addSkill('benghuai');
            game.players[i].addSkill('ranshang');
        }
    },
                "_priority":0,
            },
            "人畜无害":{
                audio:"ext:无敌:2",
                forced:true,
                trigger:{
                    player:["judgeBefore","phaseDiscardBefore"],
                },
                content:function (){
        trigger.cancel();
    },
                mod:{
                    targetEnabled:function (card,player,target){
            if(player!=target){
                return false;
            }
        },
                },
                "_priority":0,
            },
            "放弃治疗":{
                trigger:{
                    player:"changeHp",
                },
                unique:true,
                forced:true,
                filter:function (event,player){
        if(player.hp<=0) player.init('天下无敌');
        return true;
    },
                content:function (){
        player.maxHp=player.hp;
        player.draw(Math.abs(trigger.num));
    },
                "_priority":0,
            },
            "后发先至":{
                forced:true,
                trigger:{
                    target:"useCardToBefore",
                },
                filter:function (event,player){
        return event.player!=player;
    },
                content:function (){
        player.draw();
        player.chooseToUse({name:trigger.card.name},`后发先至：是否对${get.translation(trigger.player)}使用一张${get.translation(trigger.card.name)}？`,trigger.player,-1).set('logSkill','后发先至');
    },
                "_priority":0,
            },
            "羽化成仙":{
                skillAnimation:true,
                trigger:{
                    player:"dieBegin",
                },
                content:function (){
        trigger.cancel();
        player.init("万人之上");
    },
                "_priority":0,
            },
            "以牙还牙":{
                audio:"ext:无敌:2",
                frequent:true,
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
        return event.source!=player&&event.source!=undefined;
    },
                content:function (){
        trigger.source.damage(trigger.num)
    },
                "_priority":0,
            },
            "万寿无疆":{
                audio:"ext:无敌:2",
                forced:true,
                init:function (player){
        player.gainMaxHp(Infinity)
        player.recover(Infinity)
    },
                "_priority":0,
            },
        },
        translate:{
            "无伤定律":"无伤定律",
            "无伤定律_info":"当你受到伤害或失去体力时，你可以免疫此伤害。你的手牌上限为游戏轮数",
            "连锁反应":"连锁反应",
            "连锁反应_info":"你指定目标无个数限制，你使用牌无次数限制。当你失去牌时，若你的手牌数小于体力上限，你可以摸一张牌",
            "上帝视角":"上帝视角",
            "上帝视角_info":"锁定技，你计算与其他角色的距离始终为1，你始终正面朝上，体力值不小于你的其他角色无法对你使用卡牌",
            "施舍给你":"施舍给你",
            "施舍给你_info":"出牌阶段，你可以将任意张牌交给一名角色，然后该角色回复X点体力（X为你给出的牌的数量）",
            "侵蚀本源":"侵蚀本源",
            "侵蚀本源_info":"当你造成伤害时，你可以改为让其体力上限减一",
            "模仿学习":"模仿学习",
            "模仿学习_info":"锁定技，其他角色摸牌后，你观看其手牌。你视为拥有“天道”“连破”“傲才”“国色”“断粮”“连环”“看破”“火计”“武圣”“倾国”“酒池”“急救”“蛊惑”“攻心”“直谏”“漫卷”“天辩”“纵适”“纵玄”",
            "天道":"天道",
            "天道_info":"任意一名角色的判定生效前，你可以打出一张牌替换之",
            "改命":"改命",
            "改命_info":"在任意一名角色的判定牌生效前，你观看牌堆顶的7张牌并选择一张作为判定结果，此结果不可更改",
            "完全支配":"完全支配",
            "完全支配_info":"出牌阶段限一次，你可以指定任意一名角色，然后选择一项发动：1.获得该角色任意区域的一些牌；2.让该角色翻面；3.让该角色失去非锁定技并无法使用或打出手牌，直到回合结束；4.让该角色进入混乱状态，直到其下回合结束。",
            "我不能死":"我不能死",
            "我不能死_info":"锁定技，觉醒技，当你体力值不大于1时，你立即将体力上限改为3，并回满体力，然后获得技能“无伤定律”“改命”。",
            "千变万化":"千变万化",
            "千变万化_info":"每轮游戏开始时，你随机获得一个非boss角色的所有技能，并将其中的锁定技改为非锁定技。然后你回复X点体力（X为场上存活角色数减去你获得技能的角色数，且不小于0）。",
            "不死之身":"不死之身",
            "不死之身_info":"当你濒死时，你可以加一点体力上限，然后回满体力。",
            "崩坏世界":"崩坏世界",
            "崩坏世界_info":"锁定技，游戏开始时，你令所有其他角色获得“崩坏”、“燃殇”。",
            "人畜无害":"人畜无害",
            "人畜无害_info":"锁定技，你跳过判定和弃牌阶段，你不能成为别人使用卡牌的目标",
            "放弃治疗":"放弃治疗",
            "放弃治疗_info":"锁定技，你的体力上限始终等于你的体力值；当你的体力值变化时，你摸x张牌（x为此次变化的体力值大小）；当你的体力值小于等于0时，你将武将牌替换为“天下无敌”。",
            "后发先至":"后发先至",
            "后发先至_info":"锁定技，当你成为其他角色使用卡牌的目标时，你摸一张牌，然后你可以对该牌的使用者使用一张更优先结算的同名牌。",
            "羽化成仙":"羽化成仙",
            "羽化成仙_info":"当你濒死时，你可以将武将牌替换为“万人之上”。",
            "以牙还牙":"以牙还牙",
            "以牙还牙_info":"当你受到其他角色的伤害后，你可以令伤害来源受到等量的伤害。",
            "万寿无疆":"万寿无疆",
            "万寿无疆_info":"锁定技，你的体力为无穷。",
        },
    },
    intro:"",
    author:"comiee",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["万人之上.jpg","一人之下.jpg","幻化无穷.jpg","以和为贵.jpg","绝处逢生.jpg","天下无敌.jpg"],"card":[],"skill":[],"audio":[]}}
});

/*
 * ==============================================================================
 * ** Victor Engine MV - Dual Wield
 * ------------------------------------------------------------------------------
 * VE_DualWield.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Dual Wield'] = '1.04';

var VictorEngine = VictorEngine || {};
VictorEngine.DualWield = VictorEngine.DualWield || {};

(function() {

    VictorEngine.DualWield.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        VictorEngine.DualWield.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Dual Wield', 'VE - Basic Module', '1.21');
    };

    VictorEngine.DualWield.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function(name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.DualWield.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * ==============================================================================
 * @plugindesc v1.04 - New options for dual wield and two handed wepaons.
 * @author Victor Sant
 *
 * @param == Equip Display ==
 * @default ==============================
 *
 * @param Separated Attack
 * @desc Display separated attack values when dual wielding.
 * true - ON     false - OFF
 * @default true
 *
 * @param Keep Two Handed
 * @desc Don't list off hand equips if they will remove an equiped
 * two handed weapon.    true - ON     false - OFF
 * @default false
 *
 * @param Off Hand Name
 * @desc Name displayed for the off hand slot when dual wielding.
 * Default: Off Hand.    Leave empty for no change.
 * @default Off Hand
 *
 * @param Right Hand Prefix
 * @desc Prefix for the 'Right Hand' weapon attak parameter name.
 * Default: Right.    Leave empty for no change.
 * @default Right
 *
 * @param Left Hand Prefix
 * @desc Prefix for the 'Left Hand' weapon attak parameter name.
 * Default: Left.    Leave empty for no change.
 * @default Left
 *
 * @param = Damage Modifiers =
 * @default ==============================
 *
 * @param Dual Wield Damage
 * @desc Multiplier rate for the damage when dual wielding (for both attacks).
 * Default: 75    100 or empty - no modifier.
 * @default 75
 *
 * @param Double Grip Attack
 * @desc Multiplier rate for the attack power when double griping. 
 * Default: 150    100 or empty - no modifier.
 * @default 150
 *
 * @param Bare Handed Attack
 * @desc Multiplier rate for the attack power when bare handed. 
 * Default: 100    100 or empty - no modifier.
 * @default 100
 *
 * @param Off Hand Attack
 * @desc Multiplier rate for the attack power of off hand weapons.
 * Default: 100   100 or empty - no modifier.
 * @default 100
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 * 
 * ==============================================================================
 *  Double Grip (notetag for Actors, Classes, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <double grip>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Enables the actor with this notetag to 'double grip', that increase the
 *  attack of double grip weapons while the actor has no weapon or shield on 
 *  the off hand.
 * ==============================================================================
 * 
 * ==============================================================================
 *  Monkey Grip (notetag for Actors, Classes, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <monkey grip>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Enables the actor with this notetag to 'monkey grip', that allows to use 
 *  shields on the off hand even when using two handed weapons.
 * ==============================================================================
 * 
 * ==============================================================================
 *  Bare Handed (notetag for Actors, Classes, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <bare handed>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Enables 'bare handed' attacks for the actor with this notetag, an actor with
 *  the 'Dual Wield' trait he will be considered to be dual wielding when it has 
 *  no weapons or shields in both hands or using bare handed weapons.
 * ==============================================================================
 * 
 * ==============================================================================
 *  Left Handed (notetag for Actors, Classes, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <left handed>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Makes the actor 'left handed', changing the display for the main hand and 
 *  off hand on equipment and status windows.
 * ==============================================================================
 * 
 * ==============================================================================
 *  Dual Wield Damage (notetag for Actors, Classes, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <dual wield damage: +X%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  An actor with this tag have the damage caused while dual wielding changed.
 *    X : change value. Numetic. Can be negative.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: <dual wield damage: +10%>
 *       <dual wield damage: -25%>
 * ==============================================================================
 * 
 * ==============================================================================
 *  Double Grip Attack (notetag for Actors, Classes, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <double grip attack: +X%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  An actor with this tag have the attack power of weapons with doubple grip
 *  changed.
 *    X : change value. Numetic. Can be negative.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: <double grip attack: +10%>
 *       <double grip attack: -25%>
 * ==============================================================================
 * 
 * ==============================================================================
 *  Bare Handed Attack (notetag for Actors, Classes, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <bare handed attack: +X%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  An actor with this tag have the attack power of the bare handed attacks 
 *  changed.
 *    X : change value. Numetic. Can be negative.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: <bare handed attack: +10%>
 *       <bare handed attack: -25%>
 * ==============================================================================
 * 
 * ==============================================================================
 *  Off Hand Attack (notetag for Actors, Classes, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <off hand attack: +X%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  An actor with this tag have the attack power of the off hand weapon changed.
 *    X : change value. Numetic. Can be negative.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Ex.: <off hand attack: +10%>
 *       <off hand attack: -25%>
 * ==============================================================================
 * 
 * ==============================================================================
 *  Two Handed Weapon (notetag for Weapons)
 * ------------------------------------------------------------------------------
 *  <two handed weapon>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The weapon with this notetag requires both hands to be equiped.
 * ==============================================================================
 *
 * ==============================================================================
 *  Main Handed Weapon (notetag for Weapons)
 * ------------------------------------------------------------------------------
 *  <main hand weapon>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The weapon with this notetag can be equiped only on the main hand. Relevant
 *  only on one handed weapons.
 * ==============================================================================
 *
 * ==============================================================================
 *  Off Handed Weapon (notetag for Weapons)
 * ------------------------------------------------------------------------------
 *  <off hand weapon>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   The weapon with this notetag can be equiped only on the off hand. Relevant
 *   only on one handed weapons.
 * ==============================================================================
 *
 * ==============================================================================
 *  Double Grip Weapon (notetag for Weapons)
 * ------------------------------------------------------------------------------
 *  <double grip weapon>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The weapon with this notetag can be used with 'double grip'.
 * ==============================================================================
 *
 * ==============================================================================
 *  Monkey Grip Weapon (notetag for Weapons)
 * ------------------------------------------------------------------------------
 *  <monkey grip weapon>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The weapon with this notetag can be used with 'monkey grip'. Relevant only
 *  on two handed weapons.
 * ==============================================================================
 *
 * ==============================================================================
 *  Bare Handed Weapon (notetag for Weapons)
 * ------------------------------------------------------------------------------
 *  <bare handed weapon>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The weapon with this notetag can be used with 'bare handed'. Relevant only
 *  on one handed weapons.
 * ==============================================================================
 *
 * ==============================================================================
 *  Bare Handed Weapon (notetag for Items and Skills)
 * ------------------------------------------------------------------------------
 *  <dual wield action>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Skills and items with this notetag will be used twice when dual wielding.
 * ==============================================================================
 *
 * ==============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 *
 *  - The changes on dual wield.
 *  This plugin makes several changes on the dual wield system.
 *  
 *  The equipment slot is changed, an actor with Dual Wield will not lose it's
 *  ability to use shields, instead, both off hand weapons and shields will be
 *  listed together and the actor can equip either of them on the off hand.
 *
 *  The battle motion is also changed, Instead of a single attack with double
 *  animation. Each weapon has it's own attack motion, displaying the proper
 *  weapon for each hand and their respective animation. The damage is also
 *  calculated separated, not considering the other weapon parameters, elements,
 *  attack states, hit and critical rates. Other traits are still considered.
 *
 *  You can also set a modifier for the damage while dual wielding. This modifier
 *  is set by the plugin paramater 'Dual Wield Damage' and can be adjusted with 
 *  the notetag <dual wield damage: +X%>. This value changes the final damage of
 *  each attack made with two weapons.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Two Handed Weapons and Monkey Grip
 *  You can create weapons that requires 2 hands to be used using the notetag
 *  <two handed weapon> Those weapons, when equiped, will automatically remove
 *  the weapon or shield on the off hand. It don't blocks the shield slot, but if
 *  you equip something on the off hand it will remove the two handed weapon.
 *  
 *  You can enable the use of shields and one handed weapons on the off hand
 *  while equiping two handed weapons adding the notetag <monkey grip weapon> on
 *  the weapon if the actor have the notetag <monkey grip>.
 *
 *  Two handed weapons can be equiped only on the main hand.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Main hand and off hand weapons
 *  You can make so some weapons can be equiped only on the main hand or off 
 *  hand, with the tags <main hand weapon> or <off hand weapon>. By default any
 *  one handed weapon can be equiped on either hand unless they have this tag.
 *
 *  Off hand hand weapons have an attack modifier. This modifier is set by
 *  the plugin paramater 'Off Hand Attack' and can be adjusted with the notetag
 *  <off hand attack: +X%>. This value changes the weapon attack, not the
 *  overall attack value.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Double Grip
 *  You can create weapons that have increased attack power when used on the
 *  main hand while the off hand have no weapon or shield using the notetag
 *  <double grip weapon>.
 *  To enable the attack bonus the actor must have the tag <double grip>.
 *  
 *  You can actually make two handed weapons to have double grip. This can be
 *  used to make them have lower attack when used with monkey grip and a shield.
 *
 *  The double grip attack bonus modifier is set by the plugin paramater 
 *  'Double Grip Attack' and can be adjusted with the notetag
 *  <double grip attack: +X%>. This value changes the weapon attack, not the
 *  overall attack value.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Bare Handed
 *  When the actor have no weapons, it will make only a single attack even when
 *  he have dual wield. To make the actor to be able to attack twice while
 *  unnarmed, you need the notetag <bare handed>. 
 *
 *  You can also use the notetag <bare handed weapon> to make some weapons to
 *  be considered bare handed attacks. This way you can have an empty hand
 *  plus the weapon and still be considered bare handed. If you use a non
 *  bare handed weapon (or a shield) and no weapon on the other hand, the
 *  character will not be considered to be bare handed.
 *
 *  Also, when bare handed, the actor gains an attack bonus modifier set by the
 *  plugin paramater 'Bare Handed Attack' and can be adjusted with the notetag
 *  <bare handed attack: +X%>. 
 *
 *  This value changes the actor base attack if no weapon is being used.
 *  If two bare handed weapons are equiped, the base attack bonus is removed
 *  but both weapons will gain a bonus based on their own attack.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Separated Attack
 *  The plugin parameter 'Separated Attack' allows you to display the attack
 *  for each hand separatedely. This have no mechanical effect, it just change
 *  the display. For obvious reasons, plugins that changes heavily how the
 *  parameters are drawn on windows might not be compatibile with that feature.
 *  Nothing can be done about that, other than  you editing the code by yourself.
 *  (Do it at your own risk)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Left Handed
 *  The notetag <left handed> allows you to change the display of equipment
 *  on the equipment window and status window, this will make the off hand
 *  equip to be displayed on the place of the main hand weapon and vice versa.
 *  This have no mechanical effect, it just change the display. For obvious 
 *  reasons, plugins that changes heavily how the equipment are drawn on windows
 *  might not be compatibile with that feature. Nothing can be done about that,
 *  other than you editing the code by yourself (Do it at your own risk).
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  
 *  The plugin uses the Weapon slot and Armor Type 1 slot (Shields by default).
 *  If you are using plugins that change the equipment slots, keep this in mind.
 *  Even if you change the slot setup with other plugin, this plugin will still
 *  check only the equip slots 1 and 2.
 * ==============================================================================
 *
 * ==============================================================================
 *  Dual Wield and Battle Motions:
 * ------------------------------------------------------------------------------
 *  When the battler makes a dual wield attack, be it a basic attack or a skill
 *  with the notetag <dual wield action>, the action motion will be played twice
 *  The first for the main hand weapon and the second for the off hand weapon.
 *  The action sequence will not change in any way for both attacks, unless you
 *  setup the action sequence to do so.
 *  One thing that you can do to make the attacks different, is to use a
 *  conditional branch and use BattleManager.isSecondAttack() as the condition.
 *  Something like this:
 *  <action: execute>
 *   if: BattleManager.isSecondAttack()
 *     # action sequence for the second attack
 *   else
 *     # action sequence for the first attack
 *   end
 *  </action>
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.03.18 > First release.
 *  v 1.01 - 2016.03.24 > Fixed issue with damage modifiers notetags.
 *  v 1.02 - 2016.05.09 > Fixed issue with weapon sprite when main hand is empty.
 *  v 1.03 - 2016.05.31 > Compatibilty with Battle Motions.
 *  v 1.04 - 2016.06.11 > Fixed issue with TP gain when dual wielding.
 *                      > Fixed issue with paying costs twice when dual wielding.
 * ==============================================================================
 */

(function() {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.DualWield = {};
        VictorEngine.Parameters.DualWield.SeparatedAttack = eval(parameters["Separated Attack"]);
        VictorEngine.Parameters.DualWield.KeepTwoHanded = eval(parameters["Keep Two Handed"]);
        VictorEngine.Parameters.DualWield.OffHandName = String(parameters["Off Hand Name"]) || '';
        VictorEngine.Parameters.DualWield.RightHandPrefix = String(parameters["Right Hand Prefix"]) || '';
        VictorEngine.Parameters.DualWield.LeftHandPrefix = String(parameters["Left Hand Prefix"]) || '';
        VictorEngine.Parameters.DualWield.DualWieldDamage = Number(parameters["Dual Wield Damage"]) || 100;
        VictorEngine.Parameters.DualWield.DoubleGripAttack = Number(parameters["Double Grip Attack"]) || 100;
        VictorEngine.Parameters.DualWield.BareHandedAttack = Number(parameters["Bare Handed Attack"]) || 100;
        VictorEngine.Parameters.DualWield.OffHandAttack = Number(parameters["Off Hand Attack"]) || 100;
    }

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.DualWield.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function(data, index) {
        VictorEngine.DualWield.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['actor', 'class', 'weapon', 'armor', 'state'])) {
            VictorEngine.DualWield.loadNotes1(data);
        }
        if (this.objectSelection(index, ['skill', 'item'])) {
            VictorEngine.DualWield.loadNotes2(data);
        }
        if (this.objectSelection(index, ['weapon'])) {
            VictorEngine.DualWield.loadNotes3(data);
        }
    };

    VictorEngine.DualWield.loadNotes1 = function(data) {
        data.dualWield = data.dualWield || {};
        this.processNotes1(data);
    };

    VictorEngine.DualWield.loadNotes3 = function(data) {
        data.dualWield = data.dualWield || {};
        this.processNotes2(data);
    };

    VictorEngine.DualWield.loadNotes2 = function(data) {
        data.dualWield = data.dualWield || {};
        this.processNotes3(data);
    };

    VictorEngine.DualWield.processNotes1 = function(data) {
        var match;
        var part1 = 'dual wield|double grip|bare handed|off hand'
        var regex = new RegExp('<(' + part1 + ') (?:attack|damage)[ ]*:[ ]*([+-]?\\d+)\\%?[ ]*>', 'gi');
        while (match = regex.exec(data.note)) {
            this.processValues(data, match);
        };
        data.dualWield.doubleGrip = !!data.note.match(/<double grip>/gi);
        data.dualWield.monkeyGrip = !!data.note.match(/<monkey grip>/gi);
        data.dualWield.bareHanded = !!data.note.match(/<bare handed>/gi);
        data.dualWield.leftHanded = !!data.note.match(/<left handed>/gi);
    };

    VictorEngine.DualWield.processNotes2 = function(data) {
        data.dualWield.isTwoHanded = !!data.note.match(/<two handed weapon>/gi);
        data.dualWield.isMainHand = !!data.note.match(/<main hand weapon>/gi);
        data.dualWield.isOffHand = !!data.note.match(/<off hand weapon>/gi);
        data.dualWield.isDoubleGrip = !!data.note.match(/<double grip weapon>/gi);
        data.dualWield.isMonkeyGrip = !!data.note.match(/<monkey grip weapon>/gi);
        data.dualWield.isBareHanded = !!data.note.match(/<bare handed weapon>/gi);
    };

    VictorEngine.DualWield.processNotes3 = function(data) {
        data.dualWield.isDualWield = !!data.note.match(/<dual wield action>/gi);
    };

    VictorEngine.DualWield.processValues = function(data, match) {
        var type = match[1].toLowerCase();
        data.dualWield[type] = Number(match[2]) || 0;
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    VictorEngine.DualWield.initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        VictorEngine.DualWield.initMembers.call(this);
        this._dualWieldTargets = [];
    };

    VictorEngine.DualWield.startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        this.setDualWieldAction();
        VictorEngine.DualWield.startAction.call(this);
        this.setSecondAttack();
    };

    VictorEngine.DualWield.endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        if (this._canFollowUp) {
            this.startFollowUpAction();
        } else if (this._canSecondAttack) {
            this.startDualWieldAction();
        } else {
            this._isSecondAttack = false;
            this._dualWieldAction = null;
            VictorEngine.DualWield.endAction.call(this);
        }
    };

    BattleManager.setDualWieldAction = function() {
        var action = this._subject.currentAction();
        this._originalActionId = action.item().id;
        action.prepareDualWieldAction(this._isSecondAttack ? 2 : 1);
    };

    BattleManager.setSecondAttack = function() {
        if (!this._canSecondAttack) {
            this._dualWieldTargets = this._targets.clone();
            this._canSecondAttack = this.canSecondAttack();
            this._dualWieldAction = this._originalActionId;
        }
    };

    BattleManager.startDualWieldAction = function() {
        var action = new Game_Action(this._subject);
        action.setSkill(this._dualWieldAction);
        action.setDualWieldTargets(this._dualWieldTargets)
        this._subject.addNewAction(action);
        this._dualWieldTargets = [];
        this._isFollowUp = false;
        this._canFollowUp = false;
        this._isSecondAttack = true;
        this._canSecondAttack = false;
        this._phase = 'turn';
    };

    BattleManager.canSecondAttack = function() {
        var targets = this._dualWieldTargets.filter(function(target) {
            return target.isAlive();
        });
        return !this._isSecondAttack && this._action.isDualWield() && targets.length > 0;
    };

    BattleManager.isSecondAttack = function() {
        return this._isSecondAttack;
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.DualWield.makeTargets = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function() {
        if (this._dualWieldTargets) {
            return this._dualWieldTargets;
        } else {
            return VictorEngine.DualWield.makeTargets.call(this)
        }
    };

    VictorEngine.DualWield.makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var result = VictorEngine.DualWield.makeDamageValue.call(this, target, critical)
        if (this.isDualWield()) {
            result = Math.floor(result * this.subject().dualWieldDamage() / 100);
        }
        return result;
    };

    VictorEngine.DualWield.clear = Game_Action.prototype.clear;
    Game_Action.prototype.clear = function() {
        VictorEngine.DualWield.clear.call(this);
        this._subjectCopy = null;
        this.subject().dualWieldSpriteIndex(0);
    };

    VictorEngine.DualWield.subject = Game_Action.prototype.subject;
    Game_Action.prototype.subject = function() {
        if (this._subjectCopy) {
            return this._subjectCopy;
        } else {
            return VictorEngine.DualWield.subject.call(this);
        }
    };

    VictorEngine.DualWield.applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        if (this._subjectCopy && this._dualWieldAction === 1) {
			var subject = VictorEngine.DualWield.subject.call(this);
            var value = Math.floor(this.item().tpGain * this.subject().tcr);
            subject.gainSilentTp(value);
        }
        VictorEngine.DualWield.applyItemUserEffect.call(this, target);
    };

    Game_Action.prototype.setDualWieldTargets = function(targets) {
        this._dualWieldTargets = targets.clone();
    };

    Game_Action.prototype.prepareDualWieldAction = function(action) {
        if (this.isDualWieldAction() && this.subject().isDualWielding()) {
            action = this.subject().isLeftHanded() ? action === 1 ? 2 : 1 : action;
            this._subjectCopy = null;
            this._dualWieldAction = action;
            this.subject().dualWieldSpriteIndex(this._dualWieldAction);
            this._subjectCopy = JsonEx.makeDeepCopy(this.subject());
            this._subjectCopy.ignoreEquipment(this._dualWieldAction);
        }
    };

    Game_Action.prototype.isDualWield = function() {
        return !!this._dualWieldAction;
    };

    Game_Action.prototype.isDualWieldAction = function() {
        return this.isAttack() || this.item().dualWield.isDualWield;
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    VictorEngine.DualWield.useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(item) {
		if (!BattleManager.isSecondAttack()) {
			VictorEngine.DualWield.useItem.call(this, item);
		}
	}
	
    Game_Battler.prototype.isDualWielding = function() {
        return false;
    };

    Game_Battler.prototype.dualWieldSpriteIndex = function() {
	};

    //=============================================================================
    // Game_Actor
    //=============================================================================

    /* Overwritten function */
    Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
        for (;;) {
            var slots = this.equipSlots();
            var equips = this.equips();
            var changed = false;
            for (var i = 0; i < equips.length; i++) {
                var item = equips[i];
                if (item && (!this.canEquip(item) || this.cantEquipItem(item, i))) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
    };

    VictorEngine.DualWield.optimizeEquipments = Game_Actor.prototype.optimizeEquipments;
    Game_Actor.prototype.optimizeEquipments = function() {
        this._isEquipmentOptimization = true;
        VictorEngine.DualWield.optimizeEquipments.call(this);
        this._isEquipmentOptimization = false;
    };

    VictorEngine.DualWield.bestEquipItem = Game_Actor.prototype.bestEquipItem;
    Game_Actor.prototype.bestEquipItem = function(slotId) {
        if (slotId < 2 && this.isLeftHanded()) {
            slotId = slotId === 1 ? 0 : 1;
        }
        return VictorEngine.DualWield.bestEquipItem.call(this, slotId)
    };

    VictorEngine.DualWield.attackAnimationId1 = Game_Actor.prototype.attackAnimationId1;
    Game_Actor.prototype.attackAnimationId1 = function() {
        var equips = this.equips();
        if (!equips[0] && this.isDualBareHanded()) {
            return this.bareHandsAnimationId();
        } else {
            return VictorEngine.DualWield.attackAnimationId1.call(this);
        }
    };

    VictorEngine.DualWield.attackAnimationId2 = Game_Actor.prototype.attackAnimationId2;
    Game_Actor.prototype.attackAnimationId2 = function() {
        var equips = this.equips();
        if (!equips[1] && this.isDualBareHanded()) {
            return this.bareHandsAnimationId();
        } else {
            return VictorEngine.DualWield.attackAnimationId2.call(this);
        }
    };

    VictorEngine.DualWield.equips = Game_Actor.prototype.equips;
    Game_Actor.prototype.equips = function() {
        var result = VictorEngine.DualWield.equips.call(this);
        if (this._equipmentIgnored) {
            result[this._equipmentIgnored - 1] = null;
        }
        return result;
    };

    VictorEngine.DualWield.paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        if (this._ignoreEquipIndex) {
            this._equipmentIgnored = 3 - this._ignoreEquipIndex;
        }
        var result = VictorEngine.DualWield.paramPlus.call(this, paramId);
        result += this.doubleGripParamPlus(paramId);
        result += this.bareHandedParamPlus(paramId);
        result += this.offHandParamPlus(paramId);
        this._equipmentIgnored = null;
        return result;
    };

    VictorEngine.DualWield.xparam = Game_Actor.prototype.xparam;
    Game_Actor.prototype.xparam = function(xparamId) {
        if (this._ignoreEquipIndex && (xparamId == 0 || xparamId == 2)) {
            this._equipmentIgnored = 3 - this._ignoreEquipIndex;
        }
        var result = VictorEngine.DualWield.xparam.call(this, xparamId);
        this._equipmentIgnored = null;
        return result;
    };

    VictorEngine.DualWield.attackElements = Game_Actor.prototype.attackElements;
    Game_Actor.prototype.attackElements = function() {
        if (this._ignoreEquipIndex) {
            this._equipmentIgnored = 3 - this._ignoreEquipIndex;
        }
        var result = VictorEngine.DualWield.attackElements.call(this);
        this._equipmentIgnored = null;
        return result;
    };

    VictorEngine.DualWield.attackStates = Game_Actor.prototype.attackStates;
    Game_Actor.prototype.attackStates = function() {
        if (this._ignoreEquipIndex) {
            this._equipmentIgnored = 3 - this._ignoreEquipIndex;
        }
        var result = VictorEngine.DualWield.attackStates.call(this);
        this._equipmentIgnored = null;
        return result;
    };

    VictorEngine.DualWield.attackTimesAdd = Game_Actor.prototype.attackTimesAdd;
    Game_Actor.prototype.attackTimesAdd = function() {
        if (this._ignoreEquipIndex) {
            this._equipmentIgnored = 3 - this._ignoreEquipIndex;
        }
        var result = VictorEngine.DualWield.attackTimesAdd.call(this);
        this._equipmentIgnored = null;
        return result;
    };

    VictorEngine.DualWield.replaceAction = Game_Actor.prototype.replaceAction;
    Game_Actor.prototype.replaceAction = function(action) {
        if (this._ignoreEquipIndex) {
            this._equipmentIgnored = 3 - this._ignoreEquipIndex;
        }
        var result = VictorEngine.DualWield.replaceAction.call(this, action);
        this._equipmentIgnored = null;
        return result;
    };

    VictorEngine.DualWield.followUpSkill = Game_Actor.prototype.followUpSkill;
    Game_Actor.prototype.followUpSkill = function(action) {
        if (this._ignoreEquipIndex) {
            this._equipmentIgnored = 3 - this._ignoreEquipIndex;
        }
        var result = VictorEngine.DualWield.followUpSkill.call(this, action);
        this._equipmentIgnored = null;
        return result;
    };

    VictorEngine.DualWield.changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        if (this._isEquipmentOptimization && !this.isEquiSlotValid(slotId)) return;
        var changeEquip = VictorEngine.DualWield.changeEquip;
        if (slotId < 2 && this.isLeftHanded()) slotId = slotId === 1 ? 0 : 1;
        if (item && slotId === 0 && this.hasOffHandWeapon(item)) {
            changeEquip.call(this, 1, null);
        }
        if (item && slotId === 1 && this.hasTwoHandWeapon(item)) {
            changeEquip.call(this, 0, null);
        }
        if (item && slotId === 1 && this.isDualWield() && item.etypeId === 2) {
            if (this.tradeItemWithParty(item, this.equips()[slotId])) {
                this._equips[slotId].setObject(item);
                this.refresh();
            }
        }
        changeEquip.call(this, slotId, item);
    };

    VictorEngine.DualWield.forceChangeEquip = Game_Actor.prototype.forceChangeEquip;
    Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
        var changeEquip = VictorEngine.DualWield.forceChangeEquip;
        this._isEquipClone = true;
        if (item && slotId === 0 && this.hasOffHandWeapon(item)) changeEquip.call(this, 1, null);
        if (item && slotId === 1 && this.hasTwoHandWeapon(item)) changeEquip.call(this, 0, null);
        changeEquip.call(this, slotId, item);
    };

    VictorEngine.DualWield.performAttack = Game_Actor.prototype.performAttack;
    Game_Actor.prototype.performAttack = function() {
        var weapons = this.equips();
        if (this._dualWieldSpriteIndex === 2 || (!weapons[0] && DataManager.isWeapon(weapons[1]))) {
            var index = this._dualWieldSpriteIndex - 1;
            this.performDualWieldAttack(index);
        } else {
            VictorEngine.DualWield.performAttack.call(this)
        }
    };

    Game_Actor.prototype.performDualWieldAttack = function(index) {
        var weapons = this.equips();
        var wtypeId = weapons[index] ? weapons[index].wtypeId : 0;
        var attackMotion = $dataSystem.attackMotions[wtypeId];
        if (attackMotion) {
            if (attackMotion.type === 0) {
                this.requestMotion('thrust');
            } else if (attackMotion.type === 1) {
                this.requestMotion('swing');
            } else if (attackMotion.type === 2) {
                this.requestMotion('missile');
            }
            this.startWeaponAnimation(attackMotion.weaponImageId);
        }
    };

    Game_Actor.prototype.isEquiSlotValid = function(slotId) {
        var item = this.bestEquipItem(slotId);
        if (slotId < 2 && this.isLeftHanded()) slotId = slotId === 1 ? 0 : 1;
        if (item && slotId === 0 && item.dualWield.isOffHand) return false;
        if (item && slotId === 1 && item.dualWield.isMainHand) return false;
        if (item && slotId === 1 && item.dualWield.isTwoHanded) return false;
        return true;
    };

    Game_Actor.prototype.cantEquipItem = function(item, i) {
        var slots = this.equipSlots();
        return item.etypeId !== slots[i] && !(this.isDualWield() && i === 1 && item.etypeId === 2)
    };

    Game_Actor.prototype.hasTwoHandWeapon = function(item) {
        var equips = this.equips();
        return equips[0] && equips[0].dualWield.isTwoHanded && !this.isMonkeyGriping(equips[0]);
    };

    Game_Actor.prototype.hasOffHandWeapon = function(item) {
        var equips = this.equips();
        return item.dualWield.isTwoHanded && equips[1] && !this.isMonkeyGriping(item);
    };

    Game_Actor.prototype.isDualWielding = function() {
        var equips = VictorEngine.DualWield.equips.call(this);
        if (this.isDualBareHanded()) {
            return this.isDualWield();
        } else {
            return this.isDualWield() && DataManager.isWeapon(equips[0]) && DataManager.isWeapon(equips[1]);
        }
    };

    Game_Actor.prototype.isDoubleGriping = function() {
        var equips = VictorEngine.DualWield.equips.call(this);
        return this.isDoubleGrip() && equips[0] && !equips[1] && equips[0].dualWield.isDoubleGrip;
    };

    Game_Actor.prototype.isMonkeyGriping = function(item) {
        return item && item.dualWield.isMonkeyGrip && this.isMonkeyGrip();
    };

    Game_Actor.prototype.isDualBareHanded = function() {
        var equips = VictorEngine.DualWield.equips.call(this);
        var bareHand1 = !equips[0] || equips[0].dualWield.isBareHanded;
        var bareHand2 = !equips[1] || equips[1].dualWield.isBareHanded;
        return this.isBareHanded() && bareHand1 && bareHand2;
    };

    Game_Actor.prototype.isDoubleGrip = function() {
        return this.traitObjects().some(function(data) {
            return data.dualWield.doubleGrip
        });
    };

    Game_Actor.prototype.isMonkeyGrip = function() {
        return this.traitObjects().some(function(data) {
            return data.dualWield.monkeyGrip
        });
    };

    Game_Actor.prototype.isBareHanded = function() {
        return this.traitObjects().some(function(data) {
            return data.dualWield.bareHanded
        });
    };

    Game_Actor.prototype.isLeftHanded = function() {
        return this.traitObjects().some(function(data) {
            return data.dualWield.leftHanded
        });
    };

    Game_Actor.prototype.dualWieldDamage = function() {
        return this.dualWieldModifier('dual wield', VictorEngine.Parameters.DualWield.DualWieldDamage);
    };

    Game_Actor.prototype.doubleGripAttack = function() {
        return this.dualWieldModifier('double grip', VictorEngine.Parameters.DualWield.DoubleGripAttack - 100);
    };

    Game_Actor.prototype.bareHandedAttack = function() {
        return this.dualWieldModifier('bare handed', VictorEngine.Parameters.DualWield.BareHandedAttack - 100);
    };

    Game_Actor.prototype.offHandAttack = function() {
        return this.dualWieldModifier('off hand', VictorEngine.Parameters.DualWield.OffHandAttack - 100);
    };

    Game_Actor.prototype.dualWieldModifier = function(type, base) {
        return this.traitObjects().reduce(function(r, data) {
            return r + (data.dualWield[type] || 0)
        }, base);
    };

    Game_Actor.prototype.ignoreEquipment = function(slotIndex) {
        this._ignoreEquipIndex = slotIndex;
    };

    Game_Actor.prototype.dualWieldSpriteIndex = function(slotIndex) {
        this._dualWieldSpriteIndex = slotIndex;
    };

    Game_Actor.prototype.isDualWieldAction = function() {
        return this._dualWieldSpriteIndex;
    };

    Game_Actor.prototype.doubleGripParamPlus = function(paramId) {
        var equips = this.equips();
        if (paramId === 2 && this.isDoubleGriping() && equips[0]) {
            return Math.floor(equips[0].params[paramId] * this.doubleGripAttack() / 100);
        } else {
            return 0;
        }
    };

    Game_Actor.prototype.bareHandedParamPlus = function(paramId) {
        var equips = this.equips();
        if (paramId === 2 && this.isDualBareHanded()) {
            var param = this.paramBase(paramId)
            var value = this.bareHandedAttack() / 100;
            var result = 0;
            if (this._equipmentIgnored) {
                if (this._equipmentIgnored === 1) {
                    result = (equips[1] ? equips[1].params[paramId] : param) * value;
                }
                if (this._equipmentIgnored === 2) {
                    result = (equips[0] ? equips[0].params[paramId] : param) * value;
                }
            } else {
                result += equips[0] ? equips[0].params[paramId] * value : param * value / 2;
                result += equips[1] ? equips[1].params[paramId] * value : param * value / 2;
            }
            return Math.floor(result);
        } else {
            return 0;
        }
    };

    Game_Actor.prototype.offHandParamPlus = function(paramId) {
        var equips = this.equips();
        if (paramId === 2 && DataManager.isWeapon(equips[1])) {
            return Math.floor(equips[1].params[paramId] * this.offHandAttack() / 100);
        } else {
            return 0;
        }
    };

    //=============================================================================
    // Window_EquipItem
    //=============================================================================

    VictorEngine.DualWield.includes = Window_EquipItem.prototype.includes;
    Window_EquipItem.prototype.includes = function(item) {
        var actor = this._actor;
        var keep = VictorEngine.Parameters.DualWield.KeepTwoHanded;
        if (item && this._slotId === 0 && item.etypeId === actor.equipSlots()[0]) {
            if (item.dualWield.isOffHand) {
                return false;
            } else {
                return actor.canEquip(item);
            }
        } else if (item && this._slotId === 1 && actor.equipSlots()[1] === 1 && item.etypeId < 3) {
            if ((item.dualWield.isTwoHanded) || (item.dualWield.isMainHand) ||
                (keep && actor.hasTwoHandWeapon(item))) {
                return false;
            } else {
                return actor.canEquip(item);
            }
        } else {
            return VictorEngine.DualWield.includes.call(this, item);
        }
    };

    VictorEngine.DualWield.setSlotId = Window_EquipItem.prototype.setSlotId;
    Window_EquipItem.prototype.setSlotId = function(slotId) {
        if (slotId > -1 && slotId < 2 && this._actor && this._actor.isLeftHanded()) {
            slotId = slotId === 1 ? 0 : 1;
        }
        VictorEngine.DualWield.setSlotId.call(this, slotId);
    };

    //=============================================================================
    // Window_EquipStatus
    //=============================================================================

    VictorEngine.DualWield.refresh = Window_EquipStatus.prototype.refresh;
    Window_EquipStatus.prototype.refresh = function() {
        if (VictorEngine.Parameters.DualWield.SeparatedAttack) {
            this.contents.clear();
            if (this._actor) {
                this.drawActorName(this._actor, this.textPadding(), 0);
                this.prepareStatusCopy();
                var dualwield = this._actor.isDualWield();
                for (var i = 0; i < 7; i++) {
                    this.drawDualWieldParameters(i);
                }
                this.clearStatusCopy();
            }
        } else {
            VictorEngine.DualWield.refresh.call(this)
        }
    };

    VictorEngine.DualWield.drawParamName = Window_EquipStatus.prototype.drawParamName;
    Window_EquipStatus.prototype.drawParamName = function(x, y, i) {
        if (VictorEngine.Parameters.DualWield.SeparatedAttack) {
            var right = VictorEngine.Parameters.DualWield.RightHandPrefix + ' ';
            var left = VictorEngine.Parameters.DualWield.LeftHandPrefix + ' ';
            var name = i === 0 ? right : i === 1 ? left : ''
            this.changeTextColor(this.systemColor());
            this.drawText(name + TextManager.param(i === 0 ? 2 : i + 1), x, y, 120);
        } else {
            VictorEngine.DualWield.drawParamName.call(this, x, y, i);
        }
    };

    VictorEngine.DualWield.drawCurrentParam = Window_EquipStatus.prototype.drawCurrentParam;
    Window_EquipStatus.prototype.drawCurrentParam = function(x, y, i) {
        var paramId = VictorEngine.Parameters.DualWield.SeparatedAttack ? i === 0 ? 2 : i + 1 : i;
        var index = this._actor.isLeftHanded() && i < 2 ? i === 0 ? 1 : 0 : i;
        var equip = this._actor.equips()[index];
        var weapons = this._actor.weapons();
        var result = index < 2 && !DataManager.isWeapon(equip) && (weapons.length > 0 || index === 1);
        if (result && !this._actor.isDualWielding() && !this._actor.isDualBareHanded()) {
            this.resetTextColor();
            this.drawText('---', x, y, 48, 'right');
        } else {
            VictorEngine.DualWield.drawCurrentParam.call(this, x, y, paramId);
        }
    };

    VictorEngine.DualWield.drawNewParam = Window_EquipStatus.prototype.drawNewParam;
    Window_EquipStatus.prototype.drawNewParam = function(x, y, i) {
        var paramId = VictorEngine.Parameters.DualWield.SeparatedAttack ? i === 0 ? 2 : i + 1 : i;
        var index = this._tempActor.isLeftHanded() && i < 2 ? i === 0 ? 1 : 0 : i;
        var equip = this._tempActor.equips()[index];
        var weapons = this._tempActor.weapons();
        var result = index < 2 && !DataManager.isWeapon(equip) && (weapons.length > 0 || index === 1);
        if (result && !this._tempActor.isDualWielding() && !this._tempActor.isDualBareHanded()) {
            this.resetTextColor();
            this.drawText('---', x, y, 48, 'right');
        } else {
            VictorEngine.DualWield.drawNewParam.call(this, x, y, paramId);
        }
    };

    Window_EquipStatus.prototype.drawDualWieldParameters = function(i) {
        if (i < 2 && this._actor.isDualWield()) {
            var index = this._actor.isLeftHanded() ? i === 0 ? 2 : 1 : i + 1;
            this._actor = this._copy;
            this._tempActor = this._temp;
            this._actor.ignoreEquipment(index);
            if (this._tempActor) {
                this._tempActor.ignoreEquipment(index);
            }
        } else {
            this._actor = this._originalActor;
            this._tempActor = this._originalTemp;
        }
        this.drawItem(0, (this.lineHeight() - 4) * (1 + i) - 2, i);
    }

    Window_EquipStatus.prototype.prepareStatusCopy = function() {
        this.contents.fontSize -= 2;
        this._originalActor = this._actor;
        this._originalTemp = this._tempActor
        this._copy = JsonEx.makeDeepCopy(this._actor);
        this._temp = JsonEx.makeDeepCopy(this._tempActor);
    }

    Window_EquipStatus.prototype.clearStatusCopy = function() {
        this._actor = this._originalActor;
        this._tempActor = this._originalTemp;
        this._copy = null;
        this._temp = null;
        this.resetFontSettings();
    }

    //=============================================================================
    // Window_EquipSlot
    //=============================================================================

    VictorEngine.DualWield.slotName = Window_EquipSlot.prototype.slotName;
    Window_EquipSlot.prototype.slotName = function(index) {
        if (index === 1 && this._actor.isDualWield() && VictorEngine.Parameters.DualWield.OffHandName) {
            return VictorEngine.Parameters.DualWield.OffHandName;
        } else if (index === 1) {
            return $dataSystem.equipTypes[2];
        } else {
            return VictorEngine.DualWield.slotName.call(this, index);
        }
    };

    VictorEngine.DualWield.drawItem = Window_EquipSlot.prototype.drawItem;
    Window_EquipSlot.prototype.drawItem = function(index) {
        if (index < 2 && this._actor && this._actor.isLeftHanded()) {
            var rect = this.itemRectForText(index);
            this.changeTextColor(this.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            this.drawEquipItemName(index, rect);
            this.changePaintOpacity(true);
        } else {
            VictorEngine.DualWield.drawItem.call(this, index)
        }
    };

    Window_EquipSlot.prototype.drawEquipItemName = function(index, rect) {
        this.drawText(this.slotName(index), rect.x, rect.y, 138, this.lineHeight());
        this.drawItemName(this._actor.equips()[index === 1 ? 0 : 1], rect.x + 138, rect.y);
    };

    //=============================================================================
    // Window_Status
    //=============================================================================

    VictorEngine.DualWield.drawParameters = Window_Status.prototype.drawParameters;
    Window_Status.prototype.drawParameters = function(x, y) {
        if (VictorEngine.Parameters.DualWield.SeparatedAttack) {
            this.contents.fontSize -= 2;
            this._copy = JsonEx.makeDeepCopy(this._actor);
            for (var i = 0; i < 7; i++) {
                this.dualWieldParameters(x, y, i);
            }
            this._copy = null;
            this.resetFontSettings();
        } else {
            VictorEngine.DualWield.drawParameters.call(this, x, y)
        }
    };

    VictorEngine.DualWield.drawEquipments = Window_Status.prototype.drawEquipments;
    Window_Status.prototype.drawEquipments = function(x, y) {
        if (this._actor && this._actor.isLeftHanded()) {
            var equips = this._actor.equips();
            var count = Math.min(equips.length, this.maxEquipmentLines());
            for (var i = 0; i < count; i++) {
                var index = i === 0 ? 1 : i === 1 ? 0 : i;
                this.drawItemName(equips[index], x, y + this.lineHeight() * index);
            }
        } else {
            VictorEngine.DualWield.drawEquipments.call(this);
        }
    };

    Window_Status.prototype.dualWieldParameters = function(x, y, i) {
        var dualwield = this._actor.isDualWield();
        var y2 = y + (this.lineHeight() - 4) * i;
        if (i < 2 && dualwield) {
            var index = this._actor.isLeftHanded() ? i === 0 ? 2 : 1 : i + 1;
            this._copy.ignoreEquipment(index);
            var actor = this._copy;
        } else {
            var actor = this._actor;
        }
        this.drawDualWieldParameters(x, y2, i, actor);
    }

    Window_Status.prototype.drawDualWieldParameters = function(x, y, i, actor) {
        var dualwield = this._actor.isDualWielding();
        var paramId = i === 0 ? 2 : i + 1;
        var right = VictorEngine.Parameters.DualWield.RightHandPrefix + ' ';
        var left = VictorEngine.Parameters.DualWield.LeftHandPrefix + ' ';
        var name = i === 0 ? right : i === 1 ? left : ''
        this.changeTextColor(this.systemColor());
        this.drawText(name + TextManager.param(paramId), x, y, 160);
        this.resetTextColor();
        if (dualwield || i !== 1) {
            this.drawText(actor.param(paramId), x + 160, y, 60, 'right');
        } else {
            this.drawText('---', x + 160, y, 60, 'right');
        }
    }

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    /* Overwritten function */
    Window_BattleLog.prototype.showActorAttackAnimation = function(subject, targets) {
        this._animationSubject = subject;
        if (subject._dualWieldSpriteIndex === 2) {
            this.showNormalAnimation(targets, subject.attackAnimationId2(), false);
        } else {
            this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
        }
    };

    VictorEngine.DualWield.displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function(subject, item) {
        VictorEngine.DualWield.displayAction.call(this, subject, item)
        if (this._dualWieldAction) {
            this._methods.pop();
            this.push('wait');
        }
    };

    Window_BattleLog.prototype.startDualWieldAction = function(subject, action, targets) {
        this._dualWieldAction = true;
        this.startAction(subject, action, targets);
        this._dualWieldAction = false;
    };

})();

/* Compatibility with YEP_EquipCore */
if (Imported.YEP_EquipCore) {

    //=============================================================================
    // Window_EquipSlot
    //=============================================================================

    Window_EquipSlot.prototype.drawEquipItemName = function(index, rect) {
        var ww1 = this._nameWidth;
        var ww2 = rect.width - this._nameWidth;
        this.drawText(this.slotName(index), rect.x, rect.y, ww1);
        var item = this._actor.equips()[index === 1 ? 0 : 1];
        if (item) {
            this.drawItemName(item, rect.x + ww1, rect.y, ww2);
        } else {
            this.drawEmptySlot(rect.x + ww1, rect.y, ww2);
        }
    };

    //=============================================================================
    // Scene_Equip
    //=============================================================================

    VictorEngine.DualWield.onSlotOk = Scene_Equip.prototype.onSlotOk;
    Scene_Equip.prototype.onSlotOk = function() {
        var actor = this.actor();
        var slotId = this._slotWindow.index();
        if (actor && actor.isLeftHanded() && slotId > -1 && slotId < 2) {
            slotId = slotId === 1 ? 0 : 1;
            VictorEngine.DualWield.onSlotOk.call(this);
            Yanfly.Equip.Window_EquipItem_setSlotId.call(this._itemWindow, slotId);
        } else {
            VictorEngine.DualWield.onSlotOk.call(this);
        }
        this._itemWindow.select(0)
        this._compareWindow.refresh();
    };

    //=============================================================================
    // Window_StatCompare
    //=============================================================================

    VictorEngine.DualWield.refreshWindowStatCompare = Window_StatCompare.prototype.refresh;
    Window_StatCompare.prototype.refresh = function() {
        if (VictorEngine.Parameters.DualWield.SeparatedAttack) {
            this.contents.clear();
            if (this._actor) {
                this.prepareStatusCopy();
                var dualwield = this._actor.isDualWield();
                for (var i = 0; i < 9; i++) {
                    this.drawDualWieldParameters(i);
                }
                this.clearStatusCopy();
            }
        } else {
            VictorEngine.DualWield.refreshWindowStatCompare.call(this);
        }
    };

    VictorEngine.DualWield.lineHeight = Window_StatCompare.prototype.lineHeight;
    Window_StatCompare.prototype.lineHeight = function() {
        return VictorEngine.DualWield.lineHeight.call(this) - 3;
    };

    VictorEngine.DualWield.drawParamNameWindowStatCompare = Window_StatCompare.prototype.drawParamName;
    Window_StatCompare.prototype.drawParamName = function(y, i) {
        if (VictorEngine.Parameters.DualWield.SeparatedAttack) {
            var x = this.textPadding();
            var right = VictorEngine.Parameters.DualWield.RightHandPrefix + ' ';
            var left = VictorEngine.Parameters.DualWield.LeftHandPrefix + ' ';
            var name = i === 2 ? right : i === 3 ? left : '';
            var index = i < 3 ? i : i - 1;
            this.changeTextColor(this.systemColor());
            this.drawText(name + TextManager.param(index), x, y, this._paramNameWidth);
        } else {
            VictorEngine.DualWield.drawParamNameWindowStatCompare.call(this, y, i);
        }
    };

    VictorEngine.DualWield.drawCurrentParamWindowStatCompare = Window_StatCompare.prototype.drawCurrentParam;
    Window_StatCompare.prototype.drawCurrentParam = function(y, i) {
        var x = this.contents.width - this.textPadding();
        x -= this._paramValueWidth * 2 + this._arrowWidth + this._bonusValueWidth;
        var paramId = VictorEngine.Parameters.DualWield.SeparatedAttack && i < 3 ? i : i - 1;
        var index = this._actor.isLeftHanded() && i > 1 && i < 4 ? i === 2 ? 1 : 0 : i - 2;
        var equip = this._actor.equips()[index];
        var weapons = this._actor.weapons();
        var result = i > 1 && i < 4 && !DataManager.isWeapon(equip) && (weapons.length > 0 || i === 3);
        if (result && !this._actor.isDualWielding() && !this._actor.isDualBareHanded()) {
            this.resetTextColor();
            this.drawText('---', x, y, this._paramValueWidth, 'right');
        } else {
            VictorEngine.DualWield.drawCurrentParamWindowStatCompare.call(this, y, paramId);
        }
    };

    VictorEngine.DualWield.drawNewParamWindowStatCompare = Window_StatCompare.prototype.drawNewParam;
    Window_StatCompare.prototype.drawNewParam = function(y, i) {
        var x = this.contents.width - this.textPadding();
        x -= this._paramValueWidth + this._bonusValueWidth;
        var paramId = VictorEngine.Parameters.DualWield.SeparatedAttack && i < 3 ? i : i - 1;
        var index = this._tempActor.isLeftHanded() && i > 1 && i < 4 ? i === 2 ? 1 : 0 : i - 2;
        var equip = this._tempActor.equips()[index];
        var weapons = this._tempActor.weapons();
        var result = i > 1 && i < 4 && !DataManager.isWeapon(equip) && (weapons.length > 0 || i === 3);
        if (result && !this._tempActor.isDualWielding() && !this._tempActor.isDualBareHanded()) {
            this.resetTextColor();
            this.drawText('---', x, y, this._paramValueWidth, 'right');
        } else {
            VictorEngine.DualWield.drawNewParamWindowStatCompare.call(this, y, paramId);
        }
    };

    VictorEngine.DualWield.drawParamDifference = Window_StatCompare.prototype.drawParamDifference;
    Window_StatCompare.prototype.drawParamDifference = function(y, i) {
        var x = this.contents.width - this.textPadding();
        x -= this._bonusValueWidth;
        var paramId = VictorEngine.Parameters.DualWield.SeparatedAttack && i < 3 ? i : i - 1;
        var index = this._tempActor.isLeftHanded() && i > 1 && i < 4 ? i === 2 ? 1 : 0 : i - 2;
        var equip = this._tempActor.equips()[index];
        var weapons = this._tempActor.weapons();
        var weapon = DataManager.isWeapon(equip) || this._tempActor.isDualBareHanded();
        var result1 = i > 1 && i < 4 && !weapon && (weapons.length > 0 || i === 3);
        var index = this._actor.isLeftHanded() && i > 1 && i < 4 ? i === 2 ? 1 : 0 : i - 2;
        var equip = this._actor.equips()[index];
        var weapons = this._actor.weapons();
        var weapon = DataManager.isWeapon(equip) || this._actor.isDualBareHanded();
        var result2 = i > 1 && i < 4 && !weapon && (weapons.length > 0 || i === 3);
        if (result1 && !result2) {
            var value = this._actor.param(paramId)
            var text = ' (-' + Yanfly.Util.toGroup(value) + ')';
            this.changeTextColor(this.paramchangeTextColor(-1));
            this.drawText(text, x, y, this._bonusValueWidth, 'left');
        } else if (result2 && !result1) {
            var value = this._tempActor.param(paramId)
            var text = ' (+' + Yanfly.Util.toGroup(value) + ')';
            this.changeTextColor(this.paramchangeTextColor(1));
            this.drawText(text, x, y, this._bonusValueWidth, 'left');
        } else if (!result1 && !result2) {
            VictorEngine.DualWield.drawParamDifference.call(this, y, paramId);
        }
    };

    Window_StatCompare.prototype.drawDualWieldParameters = function(i) {
        if (i > 1 && i < 4 && this._actor.isDualWield()) {
            var index = this._actor.isLeftHanded() ? i === 2 ? 2 : 1 : i - 1;
            this._actor = this._copy;
            this._tempActor = this._temp;
            this._actor.ignoreEquipment(index);
            if (this._tempActor) {
                this._tempActor.ignoreEquipment(index);
            }
        } else {
            this._actor = this._originalActor;
            this._tempActor = this._originalTemp;
        }
        this.drawItem(0, this.lineHeight() * i, i);
    }

    Window_StatCompare.prototype.prepareStatusCopy = function() {
        this.contents.fontSize -= 3;
        this._originalActor = this._actor;
        this._originalTemp = this._tempActor
        this._copy = JsonEx.makeDeepCopy(this._actor);
        this._temp = JsonEx.makeDeepCopy(this._tempActor);
    }

    Window_StatCompare.prototype.clearStatusCopy = function() {
        this._actor = this._originalActor;
        this._tempActor = this._originalTemp;
        this._copy = null;
        this._temp = null;
        this.resetFontSettings();
    }

};
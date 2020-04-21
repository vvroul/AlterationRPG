/*
 * ==============================================================================
 * ** Victor Engine MV - Active Time Battle
 * ------------------------------------------------------------------------------
 *  VE_ActiveTimeBattle.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Active Time Battle'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.ActiveTimeBattle = VictorEngine.ActiveTimeBattle || {};

(function() {

    VictorEngine.ActiveTimeBattle.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        VictorEngine.ActiveTimeBattle.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Active Time Battle', 'VE - Basic Module', '1.22');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Active Time Battle', 'VE - Cooperation Skills');
    };

    VictorEngine.ActiveTimeBattle.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function(name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else if (Imported.YEP_BattleEngineCore) {
            var msg = 'The plugin ' + name + " does not work together with the";
            msg += ' plugin YEP Battle Engine Core.';
            throw new Error(msg);
        } else if (Imported['VE - Conditional Turn Battle']) {
            var msg = 'The plugin ' + name + " does not work together with the";
            msg += ' plugin VE - Conditional Turn Battle.';
            throw new Error(msg);
        } else {
            VictorEngine.ActiveTimeBattle.requiredPlugin.call(this, name, required, version);
        };
    };

})();

/*:
 * ==============================================================================
 * @plugindesc v1.03 - Changes the turn system to one based on time bars.
 * @author Victor Sant
 *
 * @param = ATB Setup = 
 * @default ======================================
 *
 * @param ATB Update Mode
 * @desc Set the type of the ATB update mode
 * (full wait, semi wait, semi active or full active)
 * @default full wait
 *
 * @param ATB Update Speed
 * @desc Set the speed of the ATB Update.
 * Default: 5 (1 to 10, higher value is faster)
 * @default 5
 *
 * @param ATB Base Wait
 * @desc Base wait time for the ATB, based on the ATB speed.
 * Default: 200 (higher value is slower)
 * @default 200
 *
 * @param ATB Param Weight
 * @desc How much the parameters will impect the ATB speed.
 * Default: 100 (higher value = lower impact)
 * @default 100
 *
 * @param Initial ATB Rate
 * @desc How much filled ATB the battlers will start with.
 * Default: 20 (0 to start always empty)
 * @default 20
 *
 * @param ATB Ready Sound
 * @desc Sound played when the command window opens.
 * filename, volume, pitch, pan (blank for no sound)
 * @default Chime2, 90, 100, 0
 *
 * @param Show Party Command
 * @desc Show the party command window when cancel the command selection.
 * Default: true
 * @default true
 *
 * @param Turn Update Mode
 * @desc How the battle turns will be decided.
 * Default: time (time or actions)
 * @default time
 *
 * @param Turn Update Count
 * @desc If the 'Turn Update Mode' is set to actions, how many actions
 * will count a turn (allows script code)
 * @default this.allBattleMembers().length
 *
 * @param Turn Update Time
 * @desc If the 'Turn Update Mode' is set to actions, how much time will
 * pass to count a turn (influenced on the battlers average speed)
 * @default 100
 *
 * @param Regen Update Mode
 * @desc When the regeneration/poison effects will happen.
 * Default: action (action or turn)
 * @default action
 *
 * @param Buffs Update Mode
 * @desc When the buffs turns will be updated.
 * Default: action (action or turn)
 * @default action
 *
 * @param ATB Fast Forward
 * @desc Make the ATB faster when no battler is active.
 * @default false
 *
 * @param = ATB Gauges = 
 * @default ======================================
 *
 * @param ATB Param Name
 * @desc Name for the ATB param displayed above the gauge.
 * (leave blank for no name)
 * @default 
 *
 * @param Cast Action Name
 * @desc Show the name of the action on the ATB gauge while casting.
 * Default: false
 * @default false
 *
 * @param Status Gauges
 * @desc Show ATB Gauges for each actor on Battle Status Window.
 * Default: true
 * @default true
 *
 * @param Status Gauges Postion
 * @desc Adjust the position for the ATB gauges on Battle Status Window.
 * offset X, offset Y, width
 * @default 0, 0, 144
 *
 * @param Actor Gauges
 * @desc Show ATB Gauges for each actor bellow it's sprite.
 * Default: false
 * @default false
 *
 * @param Actor Gauges Postion
 * @desc Adjust the position for the ATB gauges on actors.
 * offset X, offset Y, width
 * @default 0, 0, 144
 *
 * @param Enemy Gauges
 * @desc Show ATB Gauges for each enemy bellow it's sprite.
 * Default: false
 * @default false
 *
 * @param Enemy Gauges Postion
 * @desc Adjust the position for the ATB gauges on enemies.
 * offset X, offset Y, width
 * @default 0, 0, 144
 *
 * @param ATB Fill Color
 * @desc Color for the ATB gauge while filling.
 * wait 1, wait 2, full 1, full 2 (hexadecimal value)
 * @default #004400, #00AA00, #008800, #00FF00
 *
 * @param ATB Cast Color
 * @desc Color for the ATB gauge while casting.
 * wait 1, wait 2, full 1, full 2 (hexadecimal value)
 * @default #6600AA, #AA00FF, #BB00DD, #DD00FF
 *
 * @param = ATB Bar = 
 * @default ======================================
 *
 * @param Show ATB Bar
 * @desc Show ATB Bar during battles.
 * Default: false
 * @default false
 *
 * @param Vertical ATB Bar
 * @desc Makes the ATB Bar vertical.
 * Default: false
 * @default false
 *
 * @param Invert ATB Bar
 * @desc Invert the direction of the icons movement.
 * Default: false
 * @default false
 *
 * @param ATB Bar Filename
 * @desc Show ATB Bar during battles.
 * Default: ATBBar
 * @default ATBBar
 *
 * @param ATB Bar Width
 * @desc Split the bar to have a section for cast time.
 * Default: 300, 100 (normal width, casting width)
 * @default 300, 100
 *
 * @param ATB Bar Position
 * @desc Adjust the position for the ATB bar.
 * offset X, offset Y
 * @default 200, 100
 *
 * @param Actor Icon Face
 * @desc Use minature Face graphic as the actor ATB icon.
 * Default: true
 * @default true
 *
 * @param Actor Icon Offset
 * @desc Adjust the position for Actors Icons on the ATB Bar.
 * offset X, offset Y
 * @default 0, 0
 *
 * @param Actor Icon Backgroud
 * @desc Icons that are drawn behing the battler icon.
 * (wait fill, wait full, cast fill, cast full)
 * @default 200, 201, 202, 203
 *
 * @param Default Actor Icon
 * @desc Default icon displayed for actors that don't have icons.
 * Default: 0
 * @default 0
 *
 * @param Enemy Icon Battler
 * @desc Use minature Battler graphic as the enemy ATB icon.
 * Default: true
 * @default true
 *
 * @param Enemy Icon Offset
 * @desc Adjust the position for Enemies Icons on the ATB Bar.
 * offset X, offset Y
 * @default 0, 0
 *
 * @param Enemy Icon Backgroud
 * @desc Icons that are drawn behing the battler icon.
 * (wait fill, wait full, cast fill, cast full)
 * @default 200, 201, 202, 203
 *
 * @param Default Enemy Icon
 * @desc Default icon displayed for enemies that don't have icons.
 * Default: 0
 * @default 0
 *
 * @param = Options = 
 * @default ======================================
 *
 * @param ATB Speed Name
 * @desc ATB Speed option name on Option Window.
 * Default: ATB Speed (leave blank to disable)
 * @default ATB Speed
 *
 * @param ATB Speed Option
 * @desc Max ATB Speed value on Option Window.
 * Default: 10 (1 to 10, leave blank to disable)
 * @default 10
 *
 * @param ATB Mode Name
 * @desc ATB Mode option name on Option Window.
 * Default: ATB Mode (leave blank to disable)
 * @default ATB Mode
 *
 * @param ATB Mode Option
 * @desc ATB modes available on Option Window.
 * (full wait, semi wait, semi active, full active)
 * @default full wait, semi active, full active
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 *
 * ==============================================================================
 *  Cast Speed (notetag for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <cast speed: value, param>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Adds a casting time for the action before being used.
 *   value : cast time value (default 100, higher value is faster)
 *   param : param with the cast time will be based (hp, mp, atk, def, mat, mdf, 
 *           agi or luk)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <cast speed: 100, agi>
 *       <cast speed: 150, int>
 *       <cast speed: 80, luk>
 * ==============================================================================
 *
 * ==============================================================================
 *  Cast Color (notetag for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <cast color: fill1, fill1, full1, full2>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Color of the ATB gauge while casting the action. The gauge color is composed
 *  by two color represented by a hexadecimal value.
 *   fill1 : first color for the gauge while filling.
 *   fill2 : second color for the gauge while filling.
 *   full1 : first color for the gauge while full.
 *   full2 : second color for the gauge while full.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <cast color: #6600AA, #AA00FF, #BB00DD, #DD00FF>
 *       <cast color: #007A7A, #00ADAD, #00B9B9, #00FFFF>
 * ==============================================================================
 *
 * ==============================================================================
 *  Cast Cancel (notetag for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <cast cancel: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Chance of canceling the casting of the targets hit by the action.
 *   rate : change of canceling the cast.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <cast cancel: 25%>
 *       <cast cancel: 100%>
 * ==============================================================================
 *
 * ==============================================================================
 *  ATB Delay (notetag for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <atb delay: x%, y%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Chance of delaying the ATB of the targets hit by the action.
 *   x : change of success for the delay.
 *   y : rate of the ATB lost.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <atb delay: 25%, 30%>
 *       <atb delay: 100%, 15%>
 * ==============================================================================
 *
 * ==============================================================================
 *  No Cast Cancel (notetag for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <no cast cancei>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The action can't have it's cast cancelled by the cast cancel effect.
 *  Relevant only on actions with cast time.
 * ==============================================================================
 *
 * ==============================================================================
 *  ATB Color (notetag for States)
 * ------------------------------------------------------------------------------
 *  <atb color: fill1, fill1, full1, full2>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Color of the ATB gauge while under the state. The gauge color is composed
 *  by two color represented by a hexadecimal value.
 *   fill1 : first color for the gauge while filling.
 *   fill2 : second color for the gauge while filling.
 *   full1 : first color for the gauge while full.
 *   full2 : second color for the gauge while full.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <atb color: #6600AA, #AA00FF, #BB00DD, #DD00FF>
 *       <atb color: #007A7A, #00ADAD, #00B9B9, #00FFFF>
 * ==============================================================================
 *
 * ==============================================================================
 *  Timed Duration (notetag for States)
 * ------------------------------------------------------------------------------
 *  <timed duration: x>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change the state duration to be based on a specific time, rather than being
 *  based on actions or turn. This time is also based on the battle speed.
 *   x : duration of the state (higher value last longer)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <timed duration: 100>
 *       <timed duration: 200>
 * ==============================================================================
 *
 * ==============================================================================
 *  ATB Speed (notetag for Actors, Classes, Weapons, Armora, Enemies, States)
 * ------------------------------------------------------------------------------
 *  <atb speed: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Changes the speed of the atb while waiting and casting.
 *   x : atb speed change rate. (can be negative)
 *  Increasing the atb speed makes it faster.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <atb speed: +50%>
 *       <atb speed: -25%>
 * ==============================================================================
 *
 * ==============================================================================
 *  Cast Speed (notetag for Actors, Classes, Weapons, Armora, Enemies, States)
 * ------------------------------------------------------------------------------
 *  <cast speed: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Changes the speed of the atb only while casting.
 *   x : cast speed change rate. (can be negative)
 *  Increasing the cast speed makes it faster.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <cast speed: +50%>
 *       <cast speed: -25%>
 * ==============================================================================
 *
 * ==============================================================================
 *  Action Speed (notetag for Actors, Classes, Weapons, Armora, Enemies, States)
 * ------------------------------------------------------------------------------
 *  <action speed: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Changes the speed of the atb only while wating.
 *   x : action speed change rate. (can be negative)
 *  Increasing the action speed makes it faster.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <action speed: +50%>
 *       <action speed: -25%>
 * ==============================================================================
 *
 * ==============================================================================
 *  Cast Cancel (notetag for Actors, Classes, Weapons, Armora, Enemies, States)
 * ------------------------------------------------------------------------------
 *  <cast cancel: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Adds a chance of canceling the casting of the targets hit for all actions
 *  made by the battler.
 *   rate : change of canceling the cast.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <cast cancel: 25%>
 *       <cast cancel: 100%>
 * ==============================================================================
 *
 * ==============================================================================
 *  ATB Delay (notetag for Actors, Classes, Weapons, Armora, Enemies, States)
 * ------------------------------------------------------------------------------
 *  <atb delay: x%, y%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Adds a chance of delaying the ATB of the targets hit for all actions made by
 *  the battler.
 *   x : change of success for the delay.
 *   y : rate of the ATB lost.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <atb delay: 25%, 30%>
 *       <atb delay: 100%, 15%>
 * ==============================================================================
 *
 * ==============================================================================
 *  Cancel Resit (notetag for Actors, Classes, Weapons, Armora, Enemies, States)
 * ------------------------------------------------------------------------------
 *  <cancel resist: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Changes the resistance against cast cancel effects.
 *   x : rate of resistance. (can be negative)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <cancel resist: +25%>
 *       <cancel resist: -50%>
 * ==============================================================================
 *
 * ==============================================================================
 *  Delay Resit (notetag for Actors, Classes, Weapons, Armora, Enemies, States)
 * ------------------------------------------------------------------------------
 *  <deiay resist: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Changes the resistance against atb delay effects, this affects only the
 *  sucess rate, but not the ammount of delay.
 *   x : rate of resistance. (can be negative)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <deiay resist: +25%>
 *       <deiay resist: -50%>
 * ==============================================================================
 *
 * ==============================================================================
 *  ATB Icon (notetag for Actors and Enemies)
 * ------------------------------------------------------------------------------
 *  <atb icon: x>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Set a custom icon for the battler when using the ATB Bar.
 *   x : icon Id
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <atb icon: 15>
 *       <atb icon: 145>
 * ==============================================================================
 *
 * ==============================================================================
 *  Hide ATB Gauge (notetag for Enemies)
 * ------------------------------------------------------------------------------
 *  <hide atb gauge>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Only if you turned ON the plugin parameter 'Enemy Gauges'. Enemies with this
 *  gauge will not have their ATB gauges displayed.
 * ==============================================================================
 *
 * ==============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - ATB Update Mode
 *  There ate 4 modes to define when the ATB bar will be updated:
 *    full wait   : atb time stop to select commands and execute actions
 *    semi wait   : atb time stop to select commands 
 *    semi active : atb time stop to execute actions 
 *    full active : atb time don't stop
 *
 *  The atb time always stops during events.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Show Party Command
 *  The 'Show Party Command' plugin parameter allows you to call the party
 *  command window (the one witht he 'fight' and 'escape' commands) by canceling
 *  the actor command selection. If disabled, the cancel will not open the party
 *  window, but rather will open the command selection of another actor that
 *  has the atb full.
 *  Notice that the 'Escape' command will not be available if you do it, and you
 *  will need another way to enable the escape command (for example with the
 *  plugin 'VE - Battle Command Window', that allows you to setup the escape
 *  command for each actor command windows.)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Turn Update Mode
 *  The plugin parameter 'Turn Update Mode' will decide how battle turns will
 *  be counted. 
 *  If set to 'actions' a turn will be counted after a set number of battlers
 *  have take their actions, that number of battlers is decided on the plugin
 *  parameter 'Turn Update Count' (this parameter allows script codes)
 *  If set to 'time' a turn will be counted after a set time has passed. This
 *  time is based on the average battlers atb speed and the value on the plugin
 *  parameter 'Turn Update Time'
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Regen Update Mode and Buffs Update Mode
 *  Those plugin parameters decides when regeneration effects and buffs will be
 *  updated. 
 *  If set as 'action', they will be updated after a battler finish an action,
 *  only for that battler.
 *  If set as 'turn', they will be updated at the turn end (based on the plugin
 *  parameter 'Turn Update Mode') for all battlers.
 *  States updates are decided on the state itself (see bellow for details)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - ATB Gauges
 *  The 'ATB Gauges' plugin parameters controls the display of the ATB Gauges
 *  on the battle status window and/or battlers. 
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Gauge Positions
 *  On the plugin parameters 'Status Gauges Postion'm 'Actor Gauges Postion' and
 *  'Enemy Gauges Postion' you can set the  X and Y offsets for the gauges and 
 *  the Gauge Width. For actors and enemies (but not for the status window), you
 *  can set the width to 0 (or simply not set it) to make the gauge to have the
 *  same width as the battler sprite frame.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Gauge Colors
 *  The gauge have gradient colors, wich means that they start at a color and
 *  gradatively change to another. To set the gauge color you need two color.
 *  The atb gauges also have to states: filling and full, so in the end you will
 *  need four colors for the gauge: two for the filling, and two for the full.
 *  The color are defined by hexadecimal color string.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - ATB Bar
 *  The ATB Bar is a different display for the turn order. Instead of each
 *  battler having their own gauge. The display is made on a single bar, that has
 *  icons to represent each battler and how close they are to be ready to act.
 *  The ATB Bar image must beplaced on the folder '/img/system/'
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - ATB Bar Width
 *  Even though you will need an image for the Bar display, the plugin does not
 *  use the image size to define the size of the ATB are. Instead you have to set
 *  the width value on the plugin parameter 'ATB Bar Width'. There are two values
 *  that can be set: the normal width and the cast width. Adding those two will
 *  give the total width of the bar. The normal width is used while the battler
 *  is waiting the ATB to will while it's not casting a skill. The cast width
 *  section is used when the battler is casting a skill. If the action used don't
 *  have cast time. it will skip the casting width and go to the end of the bar.
 *  You can set the casting width to 0, this way the casting area will not be
 *  used and even skills with cast will use the normal width area.
 * 
 *  Notice that when the bar is set to veritical, the Width parameter will decide
 *  the height of the bar.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - ATB Bar Icons
 *  The battlers display on the ATB Bar is made with icons. The plugin parameters
 *  offers some options to change thow those icons are displayed. You can also
 *  use the notetag <atb icon: x> on actors and enemies to assign a specific icon
 *  for that actor or enemy.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - ATB Options
 *  You can add options to control the ATB on the Options Window on the main
 *  menu. For that just add the name of the options on the plugin parameters
 *  'ATB Speed Name' and 'ATB Mode Name'. Leavhing the plugin parameters blank
 *  will disable that the option for that parameter.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - ATB Mode Option
 *  The ATB Mode option allows you to set the ATB Mode for the battle. The values
 *  that can be added are the same you can set on the parameter 'ATB Update Mode'
 *  full wait, semi wait, semi active and full active. You must add the modes 
 *  that you want to be selectable on the plugin parameter 'ATB Mode Option',
 *  separated by commas. The modes that you don't add to the parameter will not
 *  be selectable. For example, if you set the plugin parameter with the value
 *  'full wait, full active', the modes 'semi wait' and 'semi active' will not
 *  be available to be choosen.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Action Speed
 *  The skill and items parameter 'Speed' (on the 'Invocation' section of the
 *  action database entry) allows you to change the speed that the ATB fills
 *  after you execute an action that has a Speed value different from zero.
 *  If the speed is higher than 0, each point of speed adds +1% to the action
 *  speed (to a max of +2000%)
 *  If the speed is lower than 0, each point of speed reduce +0.05% from the
 *  action speed (to a max of -95%)
 *  Notice that this has nothing to do with the cast speed, this will affect
 *  the ATB Speed *AFTER* the action is used and only for that action.
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - State Turn Update
 *  The states turn update, differently from the Regeneration and buffs updates,
 *  is decided on the state entry on the database, on the 'Auto-removal Timing'.
 *  The removal timing 'Action End' will make the state be updated after the
 *  battler finish an action, only for that battler.
 *  The removal timing 'Turn End' will make the state be updated at the turn end
 *  (based on the plugin parameter 'Turn Update Mode') for all battlers.
 *  
 *  Beside those two timings, you can also set a third update timing with the
 *  notetag <timed duration: x>. This will make so each of the states turns last
 *  for a set time, based on the notetag value and average battler speeds. Notice
 *  that the number of turns the state will last is still valid, so if you set
 *  a time of 100 for a state a 3 turns duration, the state will last for 300
 *  (again, this value is also based on the battle speed).
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - The Guard State
 *  Because of how the plugin changes the turn count, the guard state (and any
 *  other state that should last until the next battler action) should have it
 *  Auto-removal Timing changed to 'Action End' to end at the the right time.
 *
 * ===============================================================================
 *
 * ===============================================================================
 *  Active Time Battle and Battle Status Window:
 * -------------------------------------------------------------------------------
 *  If using the plugin 'VE - Battle Status Window', you can use a script code
 *  to display the ATB Gauges on the battle status window. Use the following code 
 *  on one of the fields for 'Custom Codes':
 *    this.drawActorAtb(actor, rect.x, rect.y, index);
 * ===============================================================================
 *
 * ===============================================================================
 *  Active Time Battle and Battle Motions:
 * -------------------------------------------------------------------------------
 *  If using the plugin 'VE - Battle Motions', you can set a motion for the cast
 *  start. This motion will be played when the battler start chanting for the
 *  
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    <action sequence: cast>
 *     # action sequence 
 *    </action sequence>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: 
 *    <action sequence: cast>
 *     animation: user, 52
 *     wait: user, animation
 *    </action sequence>
 * ==============================================================================
 *
 * ==============================================================================
 * Compatibility:
 * ------------------------------------------------------------------------------
 * To be used together with this plugin, the following plugins must be placed
 * bellow this plugin:
 *    VE - Cooperation Skills
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.06.26 > First release.
 *  v 1.01 - 2016.06.03 > Fixed issue with Action Times+ trait.
 *                      > Added option do show skill name during cast.
 *  v 1.02 - 2016.08.29 > Fixed issue with Atb Delay and Cast Cancel.
 *                      > Added cast start motion for the Battle Motions plugin.
 *  v 1.03 - 2017.05.28 > Fixed issue with commands when the inputing actor dies.
 * ============================================================================== 
 */

(function() {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.ActiveTimeBattle = {};
        VictorEngine.Parameters.ActiveTimeBattle.ATBBarWidth = String(parameters["ATB Bar Width"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBModeName = String(parameters["ATB Mode Name"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBModeName = String(parameters["ATB Mode Name"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBSpeedName = String(parameters["ATB Speed Name"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBSpeedName = String(parameters["ATB Speed Name"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBFillColor = String(parameters["ATB Fill Color"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBCastColor = String(parameters["ATB Cast Color"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBParamName = String(parameters["ATB Param Name"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ActorPostion = String(parameters["Actor Gauges Postion"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.EnemyPostion = String(parameters["Enemy Gauges Postion"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBModeOption = String(parameters["ATB Mode Option"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBModeOption = String(parameters["ATB Mode Option"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBUpdateMode = String(parameters["ATB Update Mode"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBReadySound = String(parameters["ATB Ready Sound"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ActorIconBack = String(parameters["Actor Icon Backgroud"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.EnemyIconBack = String(parameters["Enemy Icon Backgroud"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.StatusPostion = String(parameters["Status Gauges Postion"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBBarFilename = String(parameters["ATB Bar Filename"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.TurnUpdateMode = String(parameters["Turn Update Mode"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBBarPosition = String(parameters["ATB Bar Position"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ActorIconOffset = String(parameters["Actor Icon Offset"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.EnemyIconOffset = String(parameters["Enemy Icon Offset"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.RegenUpdateMode = String(parameters["Regen Update Mode"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.BuffsUpdateMode = String(parameters["Buffs Update Mode"]).trim();
        VictorEngine.Parameters.ActiveTimeBattle.ATBBaseWait = Number(parameters["ATB Base Wait"]) || 200;
        VictorEngine.Parameters.ActiveTimeBattle.ATBSpeedOption = Number(parameters["ATB Speed Option"]) || 1;
        VictorEngine.Parameters.ActiveTimeBattle.InitialATBRate = Number(parameters["Initial ATB Rate"]) || 0;
        VictorEngine.Parameters.ActiveTimeBattle.ATBUpdateSpeed = Number(parameters["ATB Update Speed"]) || 1;
        VictorEngine.Parameters.ActiveTimeBattle.ATBParamWeight = Number(parameters["ATB Param Weight"]) || 1;
        VictorEngine.Parameters.ActiveTimeBattle.ATBSpeedOption = Number(parameters["ATB Speed Option"]) || 1;
        VictorEngine.Parameters.ActiveTimeBattle.TurnUpdateTime = Number(parameters["Turn Update Time"]) || 100;
        VictorEngine.Parameters.ActiveTimeBattle.TurnUpdateCount = Number(parameters["Turn Update Count"]) || 10;
        VictorEngine.Parameters.ActiveTimeBattle.DefaultActorIcon = Number(parameters["Default Actor Icon"]) || 0;
        VictorEngine.Parameters.ActiveTimeBattle.DefaultEnemyIcon = Number(parameters["Default Enemy Icon"]) || 0;
        VictorEngine.Parameters.ActiveTimeBattle.ShowATBBar = eval(parameters["Show ATB Bar"]);
        VictorEngine.Parameters.ActiveTimeBattle.ActorGauges = eval(parameters["Actor Gauges"]);
        VictorEngine.Parameters.ActiveTimeBattle.EnemyGauges = eval(parameters["Enemy Gauges"]);
        VictorEngine.Parameters.ActiveTimeBattle.InvertATBBar = eval(parameters["Invert ATB Bar"]);
        VictorEngine.Parameters.ActiveTimeBattle.StatusGauges = eval(parameters["Status Gauges"]);
        VictorEngine.Parameters.ActiveTimeBattle.ActorIconFace = eval(parameters["Actor Icon Face"]);
        VictorEngine.Parameters.ActiveTimeBattle.CastActionName = eval(parameters["Cast Action Name"]);
        VictorEngine.Parameters.ActiveTimeBattle.VerticalATBBar = eval(parameters["Vertical ATB Bar"]);
        VictorEngine.Parameters.ActiveTimeBattle.ATBFastForward = eval(parameters["ATB Fast Forward"]);
        VictorEngine.Parameters.ActiveTimeBattle.ShowPartyCommand = eval(parameters["Show Party Command"]);
        VictorEngine.Parameters.ActiveTimeBattle.EnemyIconBattler = eval(parameters["Enemy Icon Battler"]);
    }

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.ActiveTimeBattle.loadParameters = VictorEngine.loadParameters;
    VictorEngine.loadParameters = function() {
        VictorEngine.ActiveTimeBattle.loadParameters.call(this);
        VictorEngine.ActiveTimeBattle.processParameters();
    };

    VictorEngine.ActiveTimeBattle.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function(data, index) {
        VictorEngine.ActiveTimeBattle.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['skill', 'item'])) {
            VictorEngine.ActiveTimeBattle.loadNotes1(data);
        }
        if (this.objectSelection(index, ['state'])) {
            VictorEngine.ActiveTimeBattle.loadNotes2(data);
        }
        if (this.objectSelection(index, ['actor', 'class', 'weapon', 'armor', 'enemy', 'state'])) {
            VictorEngine.ActiveTimeBattle.loadNotes3(data);
        }
    };

    VictorEngine.ActiveTimeBattle.processParameters = function() {
        if (!this.loaded) {
            this.loaded = true;
            this.setupGauge();
            this.setupSound();
            this.setupAtbBar();
            this.setupAtbOptions();
        }
    };

    VictorEngine.ActiveTimeBattle.loadNotes1 = function(data) {
        data.atbCast = data.atbCast || {};
        data.atbDelay = data.atbDelay || {};
        this.processNotes1(data);
    };

    VictorEngine.ActiveTimeBattle.loadNotes2 = function(data) {
        data.atbColor = data.atbColor || {};
        this.processNotes2(data);
    };

    VictorEngine.ActiveTimeBattle.loadNotes3 = function(data) {
        data.atbDelay = data.atbDelay || {};
        this.processNotes3(data);
    };

    VictorEngine.ActiveTimeBattle.processNotes1 = function(data) {
        var match;
        var part1 = '[ ]*(\\#\\w{6})[ ]*,[ ]*(\\#\\w{6})[ ]*'
        var regex1 = new RegExp('<cast speed:[ ]*(\\d+)[ ]*,[ ]*(\\w+)[ ]*>', 'gi');
        var regex2 = new RegExp('<cast color:' + part1 + ',' + part1 + '>', 'gi');
        var regex3 = new RegExp('<cast cancel:[ ]*(\\d+)%?>', 'gi');
        var regex4 = new RegExp('<atb delay:[ ]*(\\d+)%?[ ]*,[ ]*(\\d+)%?[ ]*>', 'gi');
        while (match = regex1.exec(data.note)) {
            data.atbCast.speed = Math.max(Number(match[1]), 1) / 100;
            data.atbCast.param = VictorEngine.paramId(match[2].trim()) + 1;
        };
        while (match = regex2.exec(data.note)) {
            data.atbCast.color = {
                fill: [match[1], match[2]],
                full: [match[3], match[4]]
            };
        };
        while (match = regex3.exec(data.note)) {
            data.castCancel = Number(match[1]) / 100;
        };
        while (match = regex4.exec(data.note)) {
            data.atbDelay.rate = Number(match[1]) / 100;
            data.atbDelay.effect = Number(match[2]) / 100;
        };
        data.noCastCancel = !!data.note.match(/<no cast cancei>/gi);
    };

    VictorEngine.ActiveTimeBattle.processNotes2 = function(data) {
        var match;
        var part1 = '[ ]*(\\#[abcdef\\d]{6})[ ]*,[ ]*(\\#[abcdef\\d]{6})[ ]*'
        var regex1 = new RegExp('<atb color:' + part1 + ',' + part1 + '>', 'gi');
        var regex2 = new RegExp('<timed duration: (\\d+)>', 'gi');
        while (match = regex1.exec(data.note)) {
            data.atbColor = {
                fill: [match[1], match[2]],
                full: [match[3], match[4]]
            };
        };
        while (match = regex2.exec(data.note)) {
            data.atbTiming = Number(match[1]) / 100;
        };
    };

    VictorEngine.ActiveTimeBattle.processNotes3 = function(data) {
        var match;
        var regex1 = new RegExp('<(atb|cast|action) speed: ([+-]?\\d+)%?>', 'gi');
        var regex2 = new RegExp('<cast cancel:[ ]*(\\d+)%?>', 'gi');
        var regex3 = new RegExp('<atb delay:[ ]*(\\d+)%?[ ]*,[ ]*(\\d+)%?[ ]*>', 'gi');
        var regex4 = new RegExp('<cancel resist:[ ]*([+-]\\d+)%?>', 'gi');
        var regex5 = new RegExp('<delay resist:[ ]*([+-]\\d+)%?>', 'gi');
        var regex6 = new RegExp('<atb icon:[ ]*(\\d+)>', 'gi');
        var regex7 = new RegExp('<hide atb gauge>', 'gi');
        while (match = regex1.exec(data.note)) {
            var type = match[1].toLowerCase();
            data[type + 'Speed'] = Number(match[2]) / 100;
        };
        while (match = regex2.exec(data.note)) {
            data.castCancel = Number(match[1]) / 100;
        };
        while (match = regex3.exec(data.note)) {
            data.atbDelay.rate = Number(match[1]) / 100;
            data.atbDelay.effect = Number(match[2]) / 100;
        };
        while (match = regex4.exec(data.note)) {
            data.cancelResist = Number(match[1]) / 100;
        };
        while (match = regex5.exec(data.note)) {
            data.delayResist = Number(match[1]) / 100;
        };
        while (match = regex6.exec(data.note)) {
            data.atbIcon = Number(match[1]);
        };
        data.hideAtbGauge = !!data.note.match(/<hide atb gauge>/gi);
    };

    VictorEngine.ActiveTimeBattle.setupGauge = function() {
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        var wait = parameters.ATBFillColor.split(/[ ]*,[ ]*/gi);
        var cast = parameters.ATBCastColor.split(/[ ]*,[ ]*/gi);
        this.gauge = {}
        this.gauge.name = parameters.ATBParamName;
        this.gauge.castName = parameters.CastActionName;
        this.gauge.wait = {
            fill: [wait[0], wait[1]],
            full: [wait[2], wait[3]]
        };
        this.gauge.cast = {
            fill: [cast[0], cast[1]],
            full: [cast[2], cast[3]]
        };
        this.gauge.status = parameters.StatusGauges;
        this.gauge.statusPosition = parameters.StatusPostion.split(/[ ]*,[ ]*/gi);
        this.gauge.actor = parameters.ActorGauges;
        this.gauge.actorPosition = parameters.ActorPostion.split(/[ ]*,[ ]*/gi);
        this.gauge.enemy = parameters.EnemyGauges;
        this.gauge.enemyPosition = parameters.EnemyPostion.split(/[ ]*,[ ]*/gi);
    };

    VictorEngine.ActiveTimeBattle.setupSound = function() {
        var sound = VictorEngine.Parameters.ActiveTimeBattle.ATBReadySound.split(/[ ]*,[ ]*/gi);
        VictorEngine.ActiveTimeBattle.ATBReadySound = {
            name: sound[0].trim(),
            volume: Number(sound[1]) || 90,
            pitch: Number(sound[2]) || 100,
            pan: Number(sound[3]) || 0
        }
    };

    VictorEngine.ActiveTimeBattle.setupAtbBar = function() {
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        var width = parameters.ATBBarWidth.split(/[ ]*,[ ]*/gi);
        var actor = parameters.ActorIconOffset.split(/[ ]*,[ ]*/gi);
        var enemy = parameters.EnemyIconOffset.split(/[ ]*,[ ]*/gi);
        var position = parameters.ATBBarPosition.split(/[ ]*,[ ]*/gi);
        var actorBack = parameters.ActorIconBack.split(/[ ]*,[ ]*/gi);
        var enemyBack = parameters.EnemyIconBack.split(/[ ]*,[ ]*/gi);
        this.bar = {}
        this.bar.show = parameters.ShowATBBar;
        this.bar.name = parameters.ATBBarFilename;
        this.bar.faces = parameters.ActorIconFace;
        this.bar.invert = parameters.InvertATBBar;
        this.bar.battlers = parameters.EnemyIconBattler;
        this.bar.vertical = parameters.VerticalATBBar;
        this.bar.actorBack = actorBack.map(function(value) {
            return Number(value) || 0;
        });
        this.bar.enemyBack = enemyBack.map(function(value) {
            return Number(value) || 0;
        });
        this.bar.width = {
            normal: Number(width[0]) || 0,
            cast: Number(width[1]) || 0
        };
        this.bar.actor = {
            x: Number(actor[0]) || 0,
            y: Number(actor[1]) || 0
        };
        this.bar.enemy = {
            x: Number(enemy[0]) || 0,
            y: Number(enemy[1]) || 0
        };
        this.bar.position = {
            x: Number(position[0]) || 0,
            y: Number(position[1]) || 0
        };
    };

    VictorEngine.ActiveTimeBattle.setupAtbOptions = function() {
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        var modes = parameters.ATBModeOption.split(/[ ]*,[ ]*/gi);
        this.options = {}
        this.options.speedName = parameters.ATBSpeedName;
        this.options.speedValue = parameters.ATBSpeedOption;
        this.options.modeName = parameters.ATBModeName;
        this.options.modeValue = modes.map(function(text) {
            return text.toLowerCase();
        });
    }

    //=============================================================================
    // BattleManager
    //=============================================================================

    /* Overwritten function */
    BattleManager.startTurn = function() {};

    /* Overwritten function */
    BattleManager.isInputting = function() {
        return this.actor() && this.actor().canInput() || this.partyCommandIsOpen();
    };

    /* Overwritten function */
    BattleManager.startInput = function() {
        this.startAtbInput();
    };

    /* Overwritten function */
    BattleManager.updateTurn = function() {
        this.updateAtbTurn();
    };

    /* Overwritten function */
    BattleManager.selectNextCommand = function() {
        this.selectNextAtbCommand();
    };

    /* Overwritten function */
    BattleManager.selectPreviousCommand = function() {
        this.selectPreviousAtbCommand();
    };

    VictorEngine.ActiveTimeBattle.setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        VictorEngine.ActiveTimeBattle.setup.call(this, troopId, canEscape, canLose);
        this._allAtbMembers = $gameParty.members().clone();
        this.setupAtbUpdateRate();
        this._turnCount = 0;
    };

    VictorEngine.ActiveTimeBattle.updateBattleManager = BattleManager.update;
    BattleManager.update = function() {
        VictorEngine.ActiveTimeBattle.updateBattleManager.call(this);
        this.updateAtb();
    };

    VictorEngine.ActiveTimeBattle.updateEvent = BattleManager.updateEvent;
    BattleManager.updateEvent = function() {
        this._isUpdateEvent = VictorEngine.ActiveTimeBattle.updateEvent.call(this);
        return this._isUpdateEvent;
    };

    VictorEngine.ActiveTimeBattle.actor = BattleManager.actor;
    BattleManager.actor = function() {
        var actor = VictorEngine.ActiveTimeBattle.actor.call(this);
        return (this.partyCommandIsOpen() || (actor && !actor.canMove())) ? null : actor;
    };

    VictorEngine.ActiveTimeBattle.getNextSubject = BattleManager.getNextSubject;
    BattleManager.getNextSubject = function() {
        if (this._turnCount <= 0) {
            return null
        } else {
            return VictorEngine.ActiveTimeBattle.getNextSubject.call(this);
        }
    };

    VictorEngine.ActiveTimeBattle.startActionBattleManager = BattleManager.startAction;
    BattleManager.startAction = function() {
        var subject = this._subject;
        var action = subject.currentAction();
        if (action.isEscape()) {
            this._phase = 'action';
            this._action = action;
            this._targets = [];
            this.refreshStatus();
            this._logWindow.startEscape(subject, action);
        } else {
            VictorEngine.ActiveTimeBattle.startActionBattleManager.call(this);
        }
    };

    VictorEngine.ActiveTimeBattle.displayEscapeFailureMessage = BattleManager.displayEscapeFailureMessage;
    BattleManager.displayEscapeFailureMessage = function() {
        VictorEngine.ActiveTimeBattle.displayEscapeFailureMessage.call(this);
        this.clearAtbActions();
    };

    VictorEngine.ActiveTimeBattle.processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        $gameParty.members().forEach(function(member) {
            member.setActionState('undecided');
        });
        VictorEngine.ActiveTimeBattle.processVictory.call(this)
    };

    BattleManager.startAtbInput = function() {
        if (this._inputSubject) {
            this.startActionInput();
            this._inputSubject = null;
        } else {
            this._phase = 'turn';
        }
    };

    BattleManager.startActionInput = function() {
        var subject = this._inputSubject;
        if (subject.isActor() && subject.canInput()) {
            if (!this.actor() && !this.partyCommandIsOpen()) {
                subject.clearExpiredStates();
                subject.makeActions();
                this.refreshStatus();
                this.displayAtbStateMessages(subject);
                var index = $gameParty.members().indexOf(subject);
                if (index >= 0) {
                    AudioManager.playSe(VictorEngine.ActiveTimeBattle.ATBReadySound);
                    this.changeActor(index, 'inputting');
                }
            }
        } else {
            subject.clearExpiredStates();
            subject.makeActions();
            this.setupAction(subject);
            this.refreshStatus();
            this.displayAtbStateMessages(subject);
        }
    };

    BattleManager.updateAtbTurn = function() {
        if (!this._subject) {
            this._subject = this.getNextSubject();
        }
        if (this._subject) {
            this.processTurn();
        }
    };

    BattleManager.selectNextAtbCommand = function() {
        if (this.actor() && !this.actor().selectNextCommand()) {
            this.setupAction(this.actor());
            this.clearActor();
        }
    };

    BattleManager.selectPreviousAtbCommand = function() {
        if (!this.actor().selectPreviousCommand()) {
            if (this.atbShowPartyCommand()) {
                this._partyCommandIsOpen = true;
            } else if (this.actor() && this.atbReadyActors().length > 1) {
                this.clearActor();
                this.updateAtbInput();
                for (var i = 0; i < this._allAtbMembers.length; i++) {
                    if (this._allAtbMembers[i] === this.actor()) {
                        this._allAtbMembers.splice(i, 1);
                        i--;
                    }
                }
                this._allAtbMembers.push(this.actor());
            }
        }
    };

    BattleManager.updateAtb = function() {
        this.updateTurnCount();
        this.updateAtbCount();
    };

    BattleManager.updateAtbInput = function() {
        var members = this.allAtbMembers();
        for (var i = 0; i < members.length; i++) {
            var member = members[i];
            if (this.isInputReady(member)) {
                this._inputSubject = member;
                this.startInput();
            } else if (this.isAtbFrozen(member)) {
                member.clearExpiredStates();
                member.onAllActionsEnd();
                this.refreshStatus();
                this.displayAtbStateMessages(member);
            }
        }
    };

    BattleManager.allAtbMembers = function() {
        return $gameTroop.members().concat(this._allAtbMembers);
    };

    BattleManager.displayAtbStateMessages = function(battler) {
        this._logWindow.displayAutoAffectedStatus(battler);
        this._logWindow.displayCurrentState(battler);
        this._logWindow.displayRegeneration(battler);
    };

    BattleManager.isActiveSubject = function() {
        return !!this._subject;
    };

    BattleManager.activeSubject = function(battler) {
        return this._subject === battler;
    };

    BattleManager.notActiveSubject = function(battler) {
        return this._subject && !this.activeSubject(battler);
    };

    BattleManager.isInputReady = function(member) {
        return member !== this._subject && member !== this.actor() && this.isAtbReady(member);
    };

    BattleManager.isAtbReady = function(member) {
        return member.isAlive() && member.isAtbReady() && !this._actionBattlers.contains(member);
    };

    BattleManager.isAtbFrozen = function(member) {
        return member.isAlive() && member.isAtbFrozen() && member.ftb === 0;
    };

    BattleManager.canUpdateAtb = function() {
        return !this._isUpdateEvent && !$gameMessage.isBusy() && ($gameSystem.isAtbActionActive() ||
            (!this._subject && this._actionBattlers.length === 0));
    };

    BattleManager.setupAtbUpdateRate = function() {
        var base = VictorEngine.Parameters.ActiveTimeBattle.ATBBaseWait;
        var speed = $gameSystem.atbSpeed() - 1;
        var maxSpeed = this.averageMaxAtb();
        var atbSpeed = Math.max(base - base * speed / 10, 1);
        this._atbUpdateRate = Math.max(maxSpeed / atbSpeed, 0);
    }

    BattleManager.averageMaxAtb = function() {
        var members = this.allBattleMembers();
        var speed = 0
        for (var i = 0; i < members.length; i++) {
            speed += members[i].actionAtb();
        }
        return (speed / members.length) || 200;
    }

    BattleManager.clearAtbActions = function() {
        var members = $gameParty.members();
        for (var i = 0; i < members.length; i++) {
            var member = members[i];
            member.clearAtb();
            member.clearActions();
            member.clearCasting();
            var index = this._actionBattlers.indexOf(member);
            if (index >= 0) {
                this._actionBattlers.splice(index, 1);
            }
        }
    };

    BattleManager.setupAction = function(battler) {
        battler.setupCastingAction();
        this._actionBattlers.push(battler);
    };

    BattleManager.closeCommandWindows = function() {
        return !this._phase || !this.isInputting() || this.isHideAtb() || this._isUpdateEvent && $gameMessage.isBusy();
    };

    BattleManager.atbUpdateRate = function() {
        return (this._atbUpdateRate || 1) * this.atbFastForward();
    }

    BattleManager.atbFastForward = function() {
        var fast = VictorEngine.Parameters.ActiveTimeBattle.ATBFastForward;
        return (fast && !this._subject && !this.actor()) ? 2 : 1;
    }

    BattleManager.partyCommandIsOpen = function() {
        return this._partyCommandIsOpen;
    }

    BattleManager.closePartyCommand = function() {
        this._partyCommandIsOpen = false;
    }

    BattleManager.atbShowPartyCommand = function() {
        return VictorEngine.Parameters.ActiveTimeBattle.ShowPartyCommand;
    };

    BattleManager.isHideAtb = function() {
        return !this._phase || this._phase === 'init' || this._phase === 'start' ||
            this.isAborting() || this.isBattleEnd();
    };

    BattleManager.atbReadyActors = function() {
        return $gameParty.aliveMembers().filter(function(member) {
            return member.isAtbReady() && member.canInput();
        })
    };

    BattleManager.updateTurnCount = function() {
        if (this.canUpdateAtb() || this._turnCount <= 0) {
            if (this.isTimeTurnCount()) {
                this.turnCountUpdateValue();
            }
            if (this._turnCount <= 0 && !this._subject) {
                this._turnCount = this.turnCountValue();
                $gameTroop.increaseTurn();
                this.endTurn();
                this._phase = 'turn';
            }
        }
    };

    BattleManager.updateAtbCount = function() {
        if (this.canUpdateAtb()) {
            this.updateAtbInput();
            var members = this.allBattleMembers();
            for (var i = 0; i < members.length; i++) {
                members[i].updateAtb();
            }
        }
    }

    BattleManager.turnCountUpdateValue = function() {
        this._turnCount -= this.isTimeTurnCount() ? this.atbUpdateRate() : 1;
    };

    BattleManager.turnCountMode = function() {
        return VictorEngine.Parameters.ActiveTimeBattle.TurnUpdateMode.toLowerCase()
    };

    BattleManager.isTimeTurnCount = function() {
        return this.turnCountMode() === 'time';
    };

    BattleManager.turnCountValue = function() {
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        if (this.isTimeTurnCount()) {
            return this.averageMaxAtb() * 100 / parameters.TurnUpdateTime;
        } else {
            return Number(eval(parameters.TurnUpdateCount)) || 8;
        }
    };

    BattleManager.regenerationUpdate = function() {
        return this.regenerationAction() || this.regenerationTurn();
    };

    BattleManager.regenerationAction = function() {
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        return !this.isTurnEnd() && parameters.RegenUpdateMode.toLowerCase() === 'action';
    };

    BattleManager.regenerationTurn = function() {
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        return this.isTurnEnd() && parameters.RegenUpdateMode.toLowerCase() === 'turn';
    };

    BattleManager.buffsUpdate = function() {
        return this.buffsAction() || this.buffsTurn();
    };

    BattleManager.buffsAction = function() {
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        return !this.isTurnEnd() && parameters.BuffsUpdateMode.toLowerCase() === 'action';
    };

    BattleManager.buffsTurn = function() {
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        return this.isTurnEnd() && parameters.BuffsUpdateMode.toLowerCase() === 'turn';
    };

    BattleManager.removeStatesAtb = function(timing) {
        return (timing === 1 && !this.isTurnEnd()) || (timing === 2 && this.isTurnEnd());
    };

    //=============================================================================
    // ConfigManager
    //=============================================================================

    VictorEngine.ActiveTimeBattle.makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = VictorEngine.ActiveTimeBattle.makeData.call(this);
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        config.atbSpeed = parameters.ATBUpdateSpeed.clamp(1, 10);
        config.atbMode = parameters.ATBUpdateMode.toLowerCase();
        return config;
    };

    VictorEngine.ActiveTimeBattle.applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        VictorEngine.ActiveTimeBattle.applyData.call(this, config);
        this.atbSpeed = this.readAtbSpeed(config, 'atbSpeed');
        this.atbMode = this.readAtbMode(config, 'atbMode');
    };

    ConfigManager.readAtbSpeed = function(config, name) {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(1, 10);
        } else {
            return VictorEngine.Parameters.ActiveTimeBattle.ATBUpdateSpeed.clamp(1, 10);
        }
    };

    ConfigManager.readAtbMode = function(config, name) {
        var value = config[name];
        if (value !== undefined) {
            return value.toLowerCase();
        } else {
            return VictorEngine.Parameters.ActiveTimeBattle.ATBUpdateMode.toLowerCase();
        }
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.ActiveTimeBattle.isValid = Game_Action.prototype.isValid;
    Game_Action.prototype.isValid = function() {
        return this.isEscape() || VictorEngine.ActiveTimeBattle.isValid.call(this);
    };

    VictorEngine.ActiveTimeBattle.item = Game_Action.prototype.item;
    Game_Action.prototype.item = function() {
        if (this.isEscape()) {
            return this._escapeAction;
        } else {
            return VictorEngine.ActiveTimeBattle.item.call(this);
        }
    };

    VictorEngine.ActiveTimeBattle.applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function(target) {
        VictorEngine.ActiveTimeBattle.applyItemUserEffect.call(this);
        this.applyCastCancel(target);
        this.applyAtbDelay(target);
    };

    Game_Action.prototype.atbCast = function() {
        return (this.item() && this.item().atbCast) ? this.item().atbCast : {};
    };

    Game_Action.prototype.castingSpeed = function() {
        return this.atbCast().speed || 0;
    };

    Game_Action.prototype.castingParam = function() {
        return this.atbCast().param || 0;
    };

    Game_Action.prototype.castingColor = function() {
        return this.atbCast().color;
    };

    Game_Action.prototype.applyCastCancel = function(target) {
        var subject = this.subject();
        var objects = [this.item()].concat(subject.traitObjects());
        objects.forEach(function(object) {
            var cancel = object.castCancel;
            if (cancel && !object.noCastCancel && cancel * target.cancelResist() < Math.random()) {
                target.clearCasting();
                target.clearAtb();
            }
        });
    };

    Game_Action.prototype.applyAtbDelay = function(target) {
        var subject = this.subject();
        var objects = [this.item()].concat(subject.traitObjects());
        objects.forEach(function(object) {
            var delay = object.atbDelay;
            if (delay && delay.rate && delay.rate * target.delayResist() < Math.random()) {
                target.atb += target.maxAtb * delay.effect;
            }
        });
    };

    //=============================================================================
    // Game_System
    //=============================================================================

    VictorEngine.ActiveTimeBattle.initializeGameSystem = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        VictorEngine.ActiveTimeBattle.initializeGameSystem.call(this);
        var parameters = VictorEngine.Parameters.ActiveTimeBattle;
        this.setAtbMode(parameters.ATBUpdateMode);
        this.setAtbSpeed(parameters.ATBUpdateSpeed);
    };

    Game_System.prototype.setAtbMode = function(value) {
        this._atbMode = value.toLowerCase();
    };

    Game_System.prototype.setAtbSpeed = function(value) {
        this._atbSpeed = value.clamp(1, 10);
    };

    Game_System.prototype.atbSpeed = function() {
        return this._atbSpeed || 5;
    };

    Game_System.prototype.atbMode = function() {
        return this._atbMode || 'full wait';
    };

    Game_System.prototype.isAtbFullWait = function() {
        return this.atbMode() === 'full wait';
    };

    Game_System.prototype.isAtbSemiWait = function() {
        return this.atbMode() === 'semi wait';
    };

    Game_System.prototype.isAtbSemiActive = function() {
        return this.atbMode() === 'semi active';
    };

    Game_System.prototype.isAtbFullActive = function() {
        return this.atbMode() === 'full active';
    };

    Game_System.prototype.isAtbCommandActive = function() {
        return this.isAtbFullActive() || this.isAtbSemiActive();
    };

    Game_System.prototype.isAtbActionActive = function() {
        return this.isAtbFullActive() || this.isAtbSemiWait();
    };

    //=============================================================================
    // Game_BattlerBase
    //=============================================================================

    /* Overwritten function */
    Game_BattlerBase.prototype.updateStateTurns = function() {
        this.updateAtbStateTurns();
    };

    VictorEngine.ActiveTimeBattle.clearStates = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function() {
        VictorEngine.ActiveTimeBattle.clearStates.call(this);
        this._stateDurations = {};
    };

    VictorEngine.ActiveTimeBattle.canInput = Game_BattlerBase.prototype.canInput;
    Game_BattlerBase.prototype.canInput = function() {
        return !this.isCasting() && VictorEngine.ActiveTimeBattle.canInput.call(this);
    };

    VictorEngine.ActiveTimeBattle.die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        VictorEngine.ActiveTimeBattle.die.call(this);
        this.setActionState('undecided');
        this._atbActionSpeed = 0;
        this.clearCasting();
        this.clearAtb();
    };

    VictorEngine.ActiveTimeBattle.updateBuffTurns = Game_BattlerBase.prototype.updateBuffTurns;
    Game_BattlerBase.prototype.updateBuffTurns = function() {
        if (BattleManager.buffsUpdate()) {
            VictorEngine.ActiveTimeBattle.updateBuffTurns.call(this);
        }
    };

    VictorEngine.ActiveTimeBattle.resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
    Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
        VictorEngine.ActiveTimeBattle.resetStateCounts.call(this, stateId);
        var state = $dataStates[stateId];
        if (state.atbTiming) {
            this._stateDurations[stateId] = BattleManager.averageMaxAtb() * state.atbTiming;
        } else if (BattleManager.notActiveSubject(this)) {
            this._stateTurns[stateId]--;
        }
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    Object.defineProperties(Game_Battler.prototype, {
        atb: {
            get: function() {
                return this._atb || 0;
            },
            set: function(value) {
                this._atb = value.clamp(0, this.maxAtb);
            },
            configurable: true
        },
        ftb: {
            get: function() {
                return this._ftb || 0;
            },
            set: function(value) {
                this._ftb = value.clamp(0, this.maxAtb);
            },
            configurable: true
        },
        maxAtb: {
            get: function() {
                return this._maxAtb || Math.max(this.actionAtb(), 10) || 10;
            },
            set: function(value) {
                this._maxAtb = Math.max(value, 10) || 10;
            },
            configurable: true
        }
    });

    /* Overwritten function */
    Game_Battler.prototype.removeStatesAuto = function(timing) {};

    VictorEngine.ActiveTimeBattle.onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function() {
        VictorEngine.ActiveTimeBattle.onBattleStart.call(this);
        this._isAtbFrozen = false;
        this.clearCasting();
        this.clearAtb();
        this.startingAtb();
    };

    VictorEngine.ActiveTimeBattle.onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        VictorEngine.ActiveTimeBattle.onAllActionsEnd.call(this);
        this.onAtbAllActionsEnd();
    };

    VictorEngine.ActiveTimeBattle.isChanting = Game_Battler.prototype.isChanting;
    Game_Battler.prototype.isChanting = function() {
        return VictorEngine.ActiveTimeBattle.isChanting.call(this) || this.isCasting() || this.isAtbCast();
    };

    VictorEngine.ActiveTimeBattle.makeActions = Game_Battler.prototype.makeActions;
    Game_Battler.prototype.makeActions = function() {
        this._atbActionSpeed = 0;
        VictorEngine.ActiveTimeBattle.makeActions.call(this);
    };

    VictorEngine.ActiveTimeBattle.regenerateAll = Game_Battler.prototype.regenerateAll;
    Game_Battler.prototype.regenerateAll = function() {
        if (BattleManager.regenerationUpdate()) {
            VictorEngine.ActiveTimeBattle.regenerateAll.call(this);
        }
    };

    VictorEngine.ActiveTimeBattle.clearResult = Game_Battler.prototype.clearResult;
    Game_Battler.prototype.clearResult = function() {
        if (!BattleManager.isTurnEnd()) {
            VictorEngine.ActiveTimeBattle.clearResult.call(this);
        }
    };

    VictorEngine.ActiveTimeBattle.onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function() {
        VictorEngine.ActiveTimeBattle.onTurnEnd.call(this);
        this.clearExpiredStates();
    };

    Game_Battler.prototype.isAtbReady = function() {
        return this.isAppeared() && this.canMove() && this.atb === 0;
    };

    Game_Battler.prototype.atbRate = function() {
        if (Imported['VE - Charge Actions'] && this.isChargingAction()) {
            return 1;
        } else {
            return (this.maxAtb - this.atb) / this.maxAtb;
        }
    };

    Game_Battler.prototype.atbFull = function() {
        return this.atbRate() === 1;
    };

    Game_Battler.prototype.isCasting = function() {
        return !!this._castSpeed;
    };

    Game_Battler.prototype.castColor = function() {
        return this._castColor;
    };

    Game_Battler.prototype.castName = function() {
        return this._castName;
    };

    Game_Battler.prototype.isAtbCast = function() {
        return this._atbCast;
    };

    Game_Battler.prototype.isAtbFrozen = function() {
        return this._isAtbFrozen;
    };

    Game_Battler.prototype.startingAtb = function() {
        this._castName = '';
        this._castColor = null;
        this._atbActionSpeed = 0;
        var battleAdvantage = Imported['VE - Battle Advantage'];
        if (battleAdvantage && this.isBackAttack()) {
            this.atb = this.maxAtb;
        } else if (battleAdvantage && this.isSurrounded()) {
            this.atb = this.maxAtb;
        } else if (battleAdvantage && this.isSneakAttack()) {
            this.atb = 0;
        } else if (battleAdvantage && this.isPincerAttack()) {
            this.atb = 0;
        } else if (!battleAdvantage && BattleManager.isSurprise()) {
            this.atb = this.isActor() ? this.maxAtb : 0;
        } else if (!battleAdvantage && BattleManager.isPreemptive()) {
            this.atb = this.isActor() ? 0 : this.maxAtb;
        } else {
            var rate = VictorEngine.Parameters.ActiveTimeBattle.InitialATBRate * Math.random();
            this.atb -= this.maxAtb * rate / 100;
        }
    };

    Game_Battler.prototype.baseAtb = function() {
        var speed = Math.max(VictorEngine.Parameters.ActiveTimeBattle.ATBParamWeight, 1);
        return this.atbValue(speed, 6);
    };

    Game_Battler.prototype.castAtb = function() {
        var speed = Math.max(VictorEngine.Parameters.ActiveTimeBattle.ATBParamWeight, 1);
        return this.atbValue(speed, this._castParam - 1) / this._castSpeed;
    };

    Game_Battler.prototype.atbValue = function(speed, param) {
        return 100 * this.paramMax(param) / this.atbActionSpeed(speed, this.param(param));
    };

    Game_Battler.prototype.actionAtb = function() {
        var speed = this.isCasting() ? this.castAtb() : this.baseAtb();
        return speed * this.atbSpeed() * this.castSpeed();
    };

    Game_Battler.prototype.atbActionSpeed = function(speed, param) {
        return (speed + param) * this.atbActionSpeedAdjust();
    };

    Game_Battler.prototype.atbActionSpeedAdjust = function() {
        if (this._atbActionSpeed < 0) {
            return Math.max(1 + (this._atbActionSpeed / 2000), 0.05) || 1;
        } else {
            return Math.min(1 + (this._atbActionSpeed / 100), 20) || 1;
        }
    };

    Game_Battler.prototype.setAtbActionSpeed = function(action) {
        var speed = this._atbActionSpeed || 10000;
        if (action.item()) {
            speed = Math.min(speed, action.item().speed);
        }
        if (action.isAttack()) {
            speed = Math.min(speed, this.attackSpeed());
        }
        this._atbActionSpeed = speed === 10000 ? 0 : speed;
    };

    Game_BattlerBase.prototype.atbSpeed = function() {
        var result = this.traitObjects().reduce(function(r, obj) {
            return r * (Math.max(1 - obj.atbSpeed, 0.1) || 1);
        }, 1);
        return Math.max(result, 0.1);
    };

    Game_BattlerBase.prototype.castSpeed = function() {
        var result = this.traitObjects().reduce(function(r, obj) {
            return r * (Math.max(1 - obj.castSpeed, 0.1) || 1);
        }, 1);
        return this.isCasting() ? Math.max(result, 0.1) : 1;
    };

    Game_BattlerBase.prototype.actionSpeed = function() {
        var result = this.traitObjects().reduce(function(r, obj) {
            return r * (Math.max(1 - obj.castSpeed, 0.1) || 1);
        }, 1);
        return this.isCasting() ? 1 : Math.max(result, 0.1);
    };

    Game_Battler.prototype.clearAtb = function() {
        this._isAtbRefresh = false;
        if (this.isCasting() && !this._atbCast) {
            this._atbCast = true;
        } else if (!this.isCasting() && this._atbCast) {
            this._atbCast = false;
            this._castName = '';
            this._castColor = null;
        }
        this.maxAtb = this.actionAtb();
        if (this.isAtbFrozen()) {
            this.ftb = this.maxAtb;
        } else {
            this.atb = this.maxAtb;
        }
    };

    Game_Battler.prototype.updateAtb = function() {
        this.refreshAtb();
        this.updateTimedStates();
        if (this.canMove()) {
            this.atb = this.atb - BattleManager.atbUpdateRate();
            this._isAtbFrozen = false;
        } else if (this.isRestricted() && this.isCasting()) {
            this.clearCasting();
            this.clearAtb();
        } else {
            if (!this.isAtbFrozen()) {
                this.ftb = this.atb
                this._isAtbFrozen = true
            }
            this.ftb = this.ftb - BattleManager.atbUpdateRate();
        }
        if (!this.isAtbReady()) {
            this._isAtbRefresh = false
        }
    };

    Game_Battler.prototype.refreshAtb = function() {
        if (this.maxAtb !== this.actionAtb()) {
            this.atb = this.atb * this.maxAtb / this.actionAtb();
            this.maxAtb = this.actionAtb();
        }
    };

    Game_Battler.prototype.setupCastingAction = function() {
        if (this.isCasting()) {
            this.executeCastAction();
        } else {
            this.prepareCastAction();
        }
    };

    Game_Battler.prototype.clearCasting = function() {
        this._castSpeed = 0;
        this._castParam = 0;
        this._castingActions = [];
    };

    Game_Battler.prototype.executeCastAction = function() {
        this._actions = this._castingActions.clone();
        this.clearCasting();
    };

    Game_Battler.prototype.prepareCastAction = function() {
        this.clearCasting();
        this._castName = '';
        this._castColor = null;
        for (var i = 0; i < this._actions.length; i++) {
            var action = this._actions[i];
            var speed = action.castingSpeed();
            var param = action.castingParam();
            if (this._castSpeed < speed || this.higherCastParam(speed, param)) {
                this._castSpeed = speed;
                this._castParam = param;
                this._castColor = action.castingColor();
                this._castName = action.item().name;
            }
        }
        if (this.isCasting()) {
            this._castingActions = this._actions.clone();
            this.clearActions();
            if (Imported['VE - Battle Motions']) {
                this.requestActionMontion({
                    name: 'cast'
                });
                BattleManager._logWindow.processActionMotion(this);
            }
        }
    };

    Game_Battler.prototype.onAtbAllActionsEnd = function() {
        this.setActionState('undecided');
        this.updateAtbTurnCount();
        this.updateStateTurns();
        this.regenerateAll();
        this.clearAtb();
    };

    Game_Battler.prototype.updateTimedStates = function() {
        var expired = false;
        this.states().forEach(function(state) {
            if (this._stateDurations[state.id] && this._stateDurations[state.id] > 0 && state.atbTiming) {
                this._stateDurations[state.id] -= BattleManager.atbUpdateRate();
            }
            if (this._stateDurations[state.id] && this._stateDurations[state.id] < 0 && state.atbTiming) {
                this._stateDurations[state.id] = BattleManager.averageMaxAtb() * state.atbTiming;
                if (this._stateTurns[state.id] > 0) {
                    this._stateTurns[state.id]--;
                }
            }
            if (!BattleManager.isActiveSubject() && this.isStateExpired(state.id) && state.atbTiming) {
                this.removeState(state.id);
                expired = true;
            }
        }, this);
        if (expired) {
            BattleManager.displayAtbStateMessages(this);
        }
    };

    Game_Battler.prototype.updateAtbStateTurns = function() {
        this.states().forEach(function(state) {
            if (this._stateTurns[state.id] > 0 && this.removeStatesAtb(state.id)) {
                this._stateTurns[state.id]--;
            }
        }, this);
    };

    Game_Battler.prototype.clearExpiredStates = function() {
        this.states().forEach(function(state) {
            if (this.isStateExpired(state.id) && this.removeStatesAtb(state.id)) {
                this.removeState(state.id);
            }
        }, this);
    };

    Game_Battler.prototype.removeStatesAtb = function(stateId) {
        var state = $dataStates[stateId];
        var timing = state.autoRemovalTiming;
        return BattleManager.removeStatesAtb(timing) && !state.atbTiming;
    };

    Game_Battler.prototype.higherCastParam = function(speed, param) {
        return this._castSpeed === speed && this._castParam && this.param(this._castParam - 1) > this.param(param - 1);
    };

    Game_Battler.prototype.stateAtbColor = function() {
        return this.states().filter(function(state) {
            return state.atbColor && state.atbColor.fill && state.atbColor.full;
        })[0];
    };

    Game_Battler.prototype.updateAtbTurnCount = function() {
        if (!BattleManager.isTimeTurnCount()) {
            BattleManager.turnCountUpdateValue();
        }
    };

    Game_Battler.prototype.cancelResist = function() {
        return this.traitObjects().reduce(function(r, object) {
            return r * Math.max(1 - (object.cancelResist || 0), 0);
        }, 1);
    };

    Game_Battler.prototype.delayResist = function() {
        return this.traitObjects().reduce(function(r, object) {
            return r * Math.max(1 - (object.delayResist || 0), 0);
        }, 1);
    };

    Game_Battler.prototype.isAtbRefresh = function() {
        return this._isAtbRefresh;
    };

    Game_Battler.prototype.refreshAtbWindow = function() {
        this._isAtbRefresh = true;
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================

    Game_Actor.prototype.atbIcon = function() {
        return this.actor().atbIcon || VictorEngine.Parameters.ActiveTimeBattle.DefaultActorIcon;
    };

    //=============================================================================
    // Game_Enemy
    //=============================================================================

    /* Overwritten function */
    Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
        return this.enemyTurnCondition(param1, param2);
    };

    VictorEngine.ActiveTimeBattle.initMembers = Game_Enemy.prototype.initMembers;
    Game_Enemy.prototype.initMembers = function() {
        VictorEngine.ActiveTimeBattle.initMembers.call(this);
        this._turnCount = 0;
    };

    Game_Enemy.prototype.atbIcon = function() {
        return this.enemy().atbIcon || VictorEngine.Parameters.ActiveTimeBattle.DefaultEnemyIcon;
    };

    Game_Enemy.prototype.onAllActionsEnd = function() {
        Game_Battler.prototype.onAllActionsEnd.call(this);
        this._turnCount++;
    };

    Game_Enemy.prototype.enemyTurnCondition = function(param1, param2) {
        var n = this._turnCount;
        if (param2 === 0) {
            return n === param1;
        } else {
            return n > 0 && n >= param1 && n % param2 === param1 % param2;
        }
    };

    //=============================================================================
    // Game_Unit
    //=============================================================================

    VictorEngine.ActiveTimeBattle.clearActions = Game_Unit.prototype.clearActions;
    Game_Unit.prototype.clearActions = function() {
        if (!this._skipClear) {
            VictorEngine.ActiveTimeBattle.clearActions.call(this);
        }
    };

    //=============================================================================
    // Sprite_Battler
    //=============================================================================

    VictorEngine.ActiveTimeBattle.updateMain = Sprite_Battler.prototype.updateMain;
    Sprite_Battler.prototype.updateMain = function() {
        VictorEngine.ActiveTimeBattle.updateMain.call(this);
        this.redrawAtbGauge();
    };

    Sprite_Battler.prototype.drawSpriteAtb = function(battler, position, width, show) {
        if (show) {
            if (!this._atbGauge || this._atbBattler !== battler) {
                this._atbBattler = battler;
                this.removeChild(this._atbGauge);
                this.createAtbGauge(battler, position, width);
            }
            this.redrawAtbGauge();
        }
    };

    Sprite_Battler.prototype.createAtbGauge = function(battler, position, width) {
        width = Number(position[2]) || width;
        var gauge = new Window_AtbGauge(0, 0, width, battler);
        var x = Number(position[0]) || 0;
        var y = Number(position[1]) || 0;
        gauge.x = this._homeX - gauge.width / 2 + (battler.isFacingRight() ? -x : x);
        gauge.y = this._homeY - gauge.height / 2 + y;
        this._atbGauge = gauge;
        this.parent.addChild(gauge);
    };

    Sprite_Battler.prototype.redrawAtbGauge = function() {
        if (this._atbGauge) {
            this._atbGauge.redrawAtbGauge();
            this._atbGauge.visible = this.isAtbVisible();
        }
    }

    Sprite_Battler.prototype.isAtbVisible = function() {
        return (this.opacity || this._effectType === 'blink') && !BattleManager.isHideAtb() &&
            this._effectType !== 'collapse' && this._effectType !== 'bossCollapse';
    }

    //=============================================================================
    // Sprite_Actor
    //=============================================================================

    VictorEngine.ActiveTimeBattle.updateSpriteActor = Sprite_Actor.prototype.update;
    Sprite_Actor.prototype.update = function() {
        VictorEngine.ActiveTimeBattle.updateSpriteActor.call(this)
        var width = this._mainSprite ? this._mainSprite._frame.width : this.width;
        if (width && $gameParty.inBattle() && this._actor.isSpriteVisible() &&
            this._atbSpriteName !== this._battlerName) {
            this._atbSpriteName = this._battlerName;
            var show = VictorEngine.ActiveTimeBattle.gauge.actor;
            var position = VictorEngine.ActiveTimeBattle.gauge.actorPosition;
            this.drawSpriteAtb(this._actor, position, width, show);
        }
    };

    //=============================================================================
    // Sprite_Enemy
    //=============================================================================

    VictorEngine.ActiveTimeBattle.updateSpriteEnemy = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        VictorEngine.ActiveTimeBattle.updateSpriteEnemy.call(this)
        var width = this._mainSprite ? this._mainSprite._frame.width : this.width;
        if (width && $gameParty.inBattle() && this._enemy.isSpriteVisible() &&
            this._atbSpriteName !== this._battlerName && !this._battler.enemy().hideAtbGauge) {
            this._atbSpriteName = this._battlerName;
            var show = VictorEngine.ActiveTimeBattle.gauge.enemy;
            var position = VictorEngine.ActiveTimeBattle.gauge.enemyPosition;
            this.drawSpriteAtb(this._enemy, position, width, show);
        }
    };

    //=============================================================================
    // Spriteset_Battle
    //=============================================================================

    VictorEngine.ActiveTimeBattle.createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        VictorEngine.ActiveTimeBattle.createLowerLayer.call(this);
        this.createAtbBar();
    };

    Spriteset_Battle.prototype.createAtbBar = function() {
        if (VictorEngine.ActiveTimeBattle.bar.show) {
            this._spriteAtbBar = new Sprite_AtbBar();
            this._battleField.addChild(this._spriteAtbBar);
        }
    };

    //=============================================================================
    // Window_BattleStatus
    //=============================================================================

    VictorEngine.ActiveTimeBattle.drawItem = Window_BattleStatus.prototype.drawItem;
    Window_BattleStatus.prototype.drawItem = function(index) {
        VictorEngine.ActiveTimeBattle.drawItem.call(this, index);
        var actor = $gameParty.battleMembers()[index];
        var rect = this.itemRectForText(index);
        this.drawActorAtb(actor, rect.x, rect.y, index);
    };

    VictorEngine.ActiveTimeBattle.updateWindowBattleStatus = Window_BattleStatus.prototype.update;
    Window_BattleStatus.prototype.update = function() {
        VictorEngine.ActiveTimeBattle.updateWindowBattleStatus.call(this);
        this.updateAtbGauges();
    }

    Window_BattleStatus.prototype.drawActorAtb = function(actor, x, y, index) {
        if (VictorEngine.ActiveTimeBattle.gauge.status) {
            this._atbGauges = this._atbGauges || [];
            if (!this._atbGauges[index]) {
                this.createAtbGauge(actor, x, y, index);
            }
            this.redrawAtbGauge(index);
        }
    };

    Window_BattleStatus.prototype.createAtbGauge = function(actor, x, y, index) {
        var position = VictorEngine.ActiveTimeBattle.gauge.statusPosition;
        x += Number(position[0]) || 0;
        y += Number(position[1]) || 0;
        var width = Number(position[2]) || 184;
        var gauge = new Window_AtbGauge(x, y, width, actor);
        this._atbGauges[index] = gauge;
        this._windowSpriteContainer.addChild(gauge);
    };

    Window_BattleStatus.prototype.redrawAtbGauge = function(index) {
        var gauge = this._atbGauges[index];
        if (gauge) {
            gauge.redrawAtbGauge();
        }
    }

    Window_BattleStatus.prototype.updateAtbGauges = function() {
        var gauges = this._atbGauges || [];
        for (var i = 0; i < gauges.length; i++) {
            var gauge = gauges[i];
            if (gauge) {
                if ($gameParty.members().contains(gauge.battler)) {
                    this.redrawAtbGauge(i);
                } else {
                    this._windowSpriteContainer.removeChild(gauge);
                    this._atbGauges.splice(i, 1);
                    i--;
                }
            }
        }
    }

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    VictorEngine.ActiveTimeBattle.startActionWindowBattleLog = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        subject.setAtbActionSpeed(action);
        VictorEngine.ActiveTimeBattle.startActionWindowBattleLog.call(this, subject, action, targets);
    }

    VictorEngine.ActiveTimeBattle.endAction = Window_BattleLog.prototype.endAction;
    Window_BattleLog.prototype.endAction = function(subject) {
        VictorEngine.ActiveTimeBattle.endAction.call(this, subject);
        if (subject.isEscapeCommand()) {
            this.push('performEscape', subject);
            subject.endEscapeCommand();
        }
    }

    Window_BattleLog.prototype.defaultMotionCast = function(subject, action) {
        return '';
    };

    //=============================================================================
    // Window_Options
    //=============================================================================

    VictorEngine.ActiveTimeBattle.makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        VictorEngine.ActiveTimeBattle.makeCommandList.call(this)
        this.addAtbOptions();
    };

    VictorEngine.ActiveTimeBattle.statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isAtbSpeed(symbol)) {
            return String($gameSystem.atbSpeed());
        } else if (this.isAtbMode(symbol)) {
            return VictorEngine.captalizeText($gameSystem.atbMode());
        } else {
            return VictorEngine.ActiveTimeBattle.statusText.call(this, index);
        }
    };

    VictorEngine.ActiveTimeBattle.processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isAtbSpeed(symbol)) {
            value += 1;
            if (value > this.maxAtbSpeed()) {
                value = 1;
            }
            value = value.clamp(1, this.maxAtbSpeed());
            $gameSystem.setAtbSpeed(value);
            this.changeValue(symbol, value);
        } else if (this.isAtbMode(symbol)) {
            var modes = this.atbModes();
            var index = (modes.indexOf($gameSystem.atbMode()) + 1) % modes.length;
            var value = modes[index];
            $gameSystem.setAtbMode(value);
            this.changeValue(symbol, value);

        } else {
            VictorEngine.ActiveTimeBattle.processOk.call(this);
        }
    };

    VictorEngine.ActiveTimeBattle.cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        var symbol = this.commandSymbol(this.index());
        var value = this.getConfigValue(symbol);
        if (this.isAtbSpeed(symbol)) {
            value += 1;
            value = value.clamp(1, this.maxAtbSpeed());
            $gameSystem.setAtbSpeed(value);
            this.changeValue(symbol, value);
        } else if (this.isAtbMode(symbol)) {
            var modes = this.atbModes();
            var index = Math.min(modes.indexOf($gameSystem.atbMode()) + 1, modes.length - 1);
            var value = modes[index];
            $gameSystem.setAtbMode(value);
            this.changeValue(symbol, value);
        } else {
            VictorEngine.ActiveTimeBattle.cursorRight.call(this, wrap);
        }
    };

    VictorEngine.ActiveTimeBattle.cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        var symbol = this.commandSymbol(this.index());
        var value = this.getConfigValue(symbol);
        if (this.isAtbSpeed(symbol)) {
            value -= 1;
            value = value.clamp(1, this.maxAtbSpeed());
            $gameSystem.setAtbSpeed(value);
            this.changeValue(symbol, value);
        } else if (this.isAtbMode(symbol)) {
            var modes = this.atbModes();
            var index = Math.max(modes.indexOf($gameSystem.atbMode()) - 1, 0);
            var value = modes[index];
            $gameSystem.setAtbMode(value)
            this.changeValue(symbol, value);
        } else {
            VictorEngine.ActiveTimeBattle.cursorLeft.call(this, wrap);
        }
    };

    Window_Options.prototype.addAtbOptions = function() {
        var options = VictorEngine.ActiveTimeBattle.options;
        if (options.speedName) {
            this.addCommand(options.speedName, 'atbSpeed');
        }
        if (options.modeName) {
            this.addCommand(options.modeName, 'atbMode');
        }
    };

    Window_Options.prototype.maxAtbSpeed = function() {
        return VictorEngine.ActiveTimeBattle.options.speedValue;
    };

    Window_Options.prototype.atbModes = function() {
        return VictorEngine.ActiveTimeBattle.options.modeValue;
    };

    Window_Options.prototype.isAtbSpeed = function(symbol) {
        return symbol === 'atbSpeed';
    };

    Window_Options.prototype.isAtbMode = function(symbol) {
        return symbol === 'atbMode';
    };

    //=============================================================================
    // Scene_Battle
    //=============================================================================

    /* Overwritten function */
    Scene_Battle.prototype.commandFight = function() {
        BattleManager.closePartyCommand();
        this.changeInputWindow();
    };

    /* Overwritten function */
    Scene_Battle.prototype.commandEscape = function() {
        BattleManager.closePartyCommand();
        BattleManager.inputtingAction().setEscape();
        this.selectNextCommand();
    };

    VictorEngine.ActiveTimeBattle.updateBattleProcess = Scene_Battle.prototype.updateBattleProcess;
    Scene_Battle.prototype.updateBattleProcess = function() {
        VictorEngine.ActiveTimeBattle.updateBattleProcess.call(this);
        this.refreshSkillWindow();
        var input = VictorEngine.ActiveTimeBattle.isAnyInputWindowActive.call(this);
        if (input && BattleManager.closeCommandWindows()) {
            this.closeInputWindows();
        }
    };

    VictorEngine.ActiveTimeBattle.isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return !$gameSystem.isAtbCommandActive() && VictorEngine.ActiveTimeBattle.isAnyInputWindowActive.call(this);
    };

    VictorEngine.ActiveTimeBattle.changeInputWindow = Scene_Battle.prototype.changeInputWindow;
    Scene_Battle.prototype.changeInputWindow = function() {
        if (!VictorEngine.ActiveTimeBattle.isAnyInputWindowActive.call(this)) {
            VictorEngine.ActiveTimeBattle.changeInputWindow.call(this);
        }
    };

    Scene_Battle.prototype.closeInputWindows = function() {
        BattleManager.closePartyCommand();
        this._partyCommandWindow.deactivate();
        this._actorCommandWindow.deactivate();
        this._skillWindow.deactivate();
        this._itemWindow.deactivate();
        this._actorWindow.deactivate();
        this._enemyWindow.deactivate();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
        this._skillWindow.hide();
        this._itemWindow.hide();
        this._actorWindow.hide();
        this._enemyWindow.hide();
    };

    Scene_Battle.prototype.refreshSkillWindow = function() {
        if (this._skillWindow.active && Graphics.frameCount % 2 === 0) {
            var needRefresh = false;
            $gameParty.members().forEach(function(member) {
                if (member.isAtbReady() && !member.isAtbRefresh()) {
                    member.refreshAtbWindow();
                    needRefresh = true;
                }
            })
            if (needRefresh) {
                this._skillWindow.refresh();
            }
        }
    };

})();

//=============================================================================
// Window_AtbGauge
//=============================================================================

function Window_AtbGauge() {
    this.initialize.apply(this, arguments);
}

Window_AtbGauge.prototype = Object.create(Window_Base.prototype);
Window_AtbGauge.prototype.constructor = Window_AtbGauge;

(function() {

    Window_AtbGauge.prototype.initialize = function(x, y, width, battler) {
        var width = width + this.standardPadding() * 2;
        var height = this.lineHeight() + this.standardPadding() * 2;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.battler = battler;
        this.opacity = 0;
    };

    Window_AtbGauge.prototype.redrawAtbGauge = function() {
        var rate = this.battler.atbRate();
        var width = this.contents.width;
        var color = this.atbGaugeColor();
        var gauge = VictorEngine.ActiveTimeBattle.gauge
        this.contents.clear();
        this.drawGauge(0, 0, width, rate, color[0] || '#009900', color[1] || '#00FF00');
        this.changeTextColor(this.systemColor());
        if (gauge.castName && this.battler.isAtbCast() && this.battler.castName()) {
            this.drawText(this.battler.castName(), 0, 0, width);
        } else {
            this.drawText(gauge.name, 0, 0, width);
        }
    }

    Window_AtbGauge.prototype.atbGaugeColor = function() {
        var gauge = VictorEngine.ActiveTimeBattle.gauge;
        var state = this.battler.stateAtbColor();
        if (state) {
            var color = state.atbColor;
        } else if (this.battler.isAtbCast()) {
            var color = this.battler.castColor() || gauge.cast;
        } else {
            var color = gauge.wait;
        }
        return this.battler.atbFull() ? color.full : color.fill;
    }

})();

//=============================================================================
// Sprite_AtbBar
//=============================================================================

function Sprite_AtbBar() {
    this.initialize.apply(this, arguments);
}

Sprite_AtbBar.prototype = Object.create(Sprite_Base.prototype);
Sprite_AtbBar.prototype.constructor = Sprite_AtbBar;

(function() {

    Sprite_AtbBar.prototype.initialize = function() {
        Sprite_Base.prototype.initialize.call(this);
        this._battlersIcons = [];
        this.anchor.x = 0;
        this.anchor.y = 0.5;
        this.z = 10;
    };

    Sprite_AtbBar.prototype.update = function() {
        Sprite_Base.prototype.update.call(this);
        this.updateBarBitmap();
        this.updateBattlerSicons();
        this.sortIconSprites();
        this.visible = !BattleManager.isHideAtb();
    };

    Sprite_AtbBar.prototype.display = function() {
        return VictorEngine.ActiveTimeBattle.bar;
    };

    Sprite_AtbBar.prototype.updateBarBitmap = function() {
        if (!this.bitmap) {
            this.bitmap = ImageManager.loadSystem(this.display().name);
            this.bitmap.addLoadListener(this.updateBarFrame.bind(this));
        }
    };

    Sprite_AtbBar.prototype.updateBarFrame = function() {
        var x = this.display().position.x
        var y = this.display().position.y
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.setFrame(0, 0, width, height);
        this.x = x;
        this.y = y;
    };

    Sprite_AtbBar.prototype.updateBattlerSicons = function() {
        var allMembers = BattleManager.allBattleMembers().reverse();
        var iconBattlers = this.iconBattlers();
        for (var i = 0; i < allMembers.length; i++) {
            var member = allMembers[i];
            if (!iconBattlers.contains(member)) {
                this.addIconBattler(member);
            }
        }
        for (var i = 0; i < iconBattlers.length; i++) {
            var member = iconBattlers[i];
            if (!allMembers.contains(member)) {
                this.removeIconBattler(member);
            }
        }
    };

    Sprite_AtbBar.prototype.addIconBattler = function(battler) {
        var sprite = new Sprite_AtbIcon(battler);
        this._battlersIcons.push(sprite);
        this.addChild(sprite);
    };

    Sprite_AtbBar.prototype.removeIconBattler = function(battler) {
        var index = -1;
        for (var i = 0; i < this._battlersIcons.length; i++) {
            var icon = this._battlersIcons[i];
            if (icon.battler() === battler) {
                index = i;
            }
        }
        if (index >= 0) {
            this.removeChild(this._battlersIcons[index]);
            this._battlersIcons.splice(index, 1);
        }
    };

    Sprite_AtbBar.prototype.iconBattlers = function() {
        return this._battlersIcons.map(function(icon) {
            return icon.battler();
        });
    };

    Sprite_AtbBar.prototype.sortIconSprites = function() {
        if (this._sortChildrenFrame !== Graphics.frameCount) {
            this.children.sort(this.compareIconSprites.bind(this));
            this._sortChildrenFrame = Graphics.frameCount;
        }
    };

    Sprite_AtbBar.prototype.compareIconSprites = function(a, b) {
        if ((a.z || 0) !== (b.z || 0)) {
            return (a.z || 0) - (b.z || 0);
        } else {
            return a.spriteId - b.spriteId;
        }
    };

})();

//=============================================================================
// Sprite_AtbIcon
//=============================================================================

function Sprite_AtbIcon() {
    this.initialize.apply(this, arguments);
}

Sprite_AtbIcon.prototype = Object.create(Sprite_Base.prototype);
Sprite_AtbIcon.prototype.constructor = Sprite_AtbIcon;

(function() {

    Sprite_AtbIcon.prototype.initialize = function(battler) {
        Sprite_Base.prototype.initialize.call(this);
        this._battler = battler;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this._selectionEffectCount = 0;
    };

    Sprite_AtbIcon.prototype.update = function() {
        Sprite_Base.prototype.update.call(this);
        this.updateIcon();
        this.updatePosition();
        this.updateEffect();
        this.updateSelectionEffect();
    };

    Sprite_AtbIcon.prototype.battler = function() {
        return this._battler;
    };

    Sprite_AtbIcon.prototype.isActor = function() {
        return this._battler.isActor();
    };

    Sprite_AtbIcon.prototype.display = function() {
        return VictorEngine.ActiveTimeBattle.bar;
    };

    Sprite_AtbIcon.prototype.updateIcon = function() {
        if (this._atbMode !== this.atbFillMode()) {
            this._atbMode = this.atbFillMode();
            this.refresh();
        }
    };

    Sprite_AtbIcon.prototype.updatePosition = function() {
        if (this._battler.isAlive()) {
            var width = this.display().width;
            var position = this.isActor() ? this.display().actor : this.display().enemy;
            if (this.display().vertical) {
                this.x = position.x;
                if (this.display().invert) {
                    this.y = width.normal + width.cast - this.atbPosition(position.y);
                } else {
                    this.y = this.atbPosition(position.y);
                }
            } else {
                if (this.display().invert) {
                    this.x = width.normal + width.cast - this.atbPosition(position.x);
                } else {
                    this.x = this.atbPosition(position.x);
                }
                this.y = position.y;
            }
        }
    };

    Sprite_AtbIcon.prototype.refresh = function() {
        var icon = this.iconBackground() || 0;
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var sx = icon % 16 * pw;
        var sy = Math.floor(icon / 16) * ph;
        this.bitmap = new Bitmap(pw, ph);
        var bitmap = ImageManager.loadSystem('IconSet');
        this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
        this.drawBattlerIcon();
    };

    Sprite_AtbIcon.prototype.iconBackground = function() {
        var icon = this.isActor() ? this.display().actorBack : this.display().enemyBack;
        if (this._battler.isAtbCast()) {
            return this._battler.atbFull() ? icon[3] : icon[2];
        } else {
            return this._battler.atbFull() ? icon[1] : icon[0];
        }
    };

    Sprite_AtbIcon.prototype.drawBattlerIcon = function() {
        var icon = this._battler.atbIcon() || 0;
        if (!icon && this.isActor() && this.display().faces) {
            this.drawFace();
        } else if (!icon && !this.isActor() && this.display().battlers) {
            this.drawBattler();
        } else {
            this.drawIcon();
        }
        if (!this.isActor()) {
            this.drawNumber();
        }
    };

    Sprite_AtbIcon.prototype.drawFace = function() {
        var pw = Window_Base._iconWidth - 4;
        var ph = Window_Base._iconHeight - 4;
        var faceName = this._battler.faceName();
        var faceIndex = this._battler.faceIndex();
        var bitmap = ImageManager.loadFace(faceName);
        var fw = Window_Base._faceWidth;
        var fh = Window_Base._faceHeight;
        var sx = faceIndex % 4 * fw;
        var sy = Math.floor(faceIndex / 4) * fh;
        this.bitmap.blt(bitmap, sx, sy, fw, fh, 2, 2, pw, ph);
        if (!bitmap.isReady()) {
            bitmap.addLoadListener(this.refresh.bind(this));
        }
    };

    Sprite_AtbIcon.prototype.drawBattler = function() {
        if (this._battler.battlerOriginalName) {
            var name = this._battler.battlerOriginalName();
        } else {
            var name = this._battler.battlerName();
        }
        var hue = this._battler.battlerHue();
        if ($gameSystem.isSideView()) {
            var bitmap = ImageManager.loadSvEnemy(name, hue);
        } else {
            var bitmap = ImageManager.loadEnemy(name, hue);
        }
        var pw = Window_Base._iconWidth - 4;
        var ph = Window_Base._iconHeight - 4;
        this.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 2, 2, pw, ph);
        if (!bitmap.isReady()) {
            bitmap.addLoadListener(this.refresh.bind(this));
        }
    };

    Sprite_AtbIcon.prototype.drawIcon = function() {
        var icon = this._battler.atbIcon() || 0;
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var bitmap = ImageManager.loadSystem('IconSet');
        var sx = icon % 16 * pw;
        var sy = Math.floor(icon / 16) * ph;
        this.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
    };

    Sprite_AtbIcon.prototype.drawNumber = function() {
        var enemies = this.sameEnemies();
        if (enemies.length > 1) {
            var pw = Window_Base._iconWidth;
            var ph = Window_Base._iconHeight;
            var index = String(enemies.indexOf(this._battler) + 1);
            this.bitmap.fontSize = 16;
            this.bitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';
            this.bitmap.outlineWidth = 6;
            this.bitmap.drawText(index, -2, 8, pw, ph, 'right');
        }
    };

    Sprite_AtbIcon.prototype.sameEnemies = function() {
        return $gameTroop.members().filter(function(enemy) {
            return this._battler.enemyId() === enemy.enemyId();
        }, this);
    };

    Sprite_AtbIcon.prototype.atbFillMode = function() {
        if (this._battler.isAtbCast()) {
            return this._battler.atbFull() ? 'cast full' : 'cast fill';
        } else {
            return this._battler.atbFull() ? 'wait full' : 'wait fill';
        }
    };

    Sprite_AtbIcon.prototype.atbPosition = function(adjust) {
        var width = this.display().width;
        if (this._battler.isAtbCast() && width.cast) {
            return adjust + width.normal + width.cast * this._battler.atbRate();
        } else {
            if (BattleManager.activeSubject(this._battler)) {
                return adjust + width.cast + width.normal * this._battler.atbRate();
            } else {
                return adjust + width.normal * this._battler.atbRate();
            }
        }
    };

    Sprite_AtbIcon.prototype.updateBarFrame = function() {
        var x = this.display().position.x
        var y = this.display().position.y
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this._background.setFrame(0, 0, width, height);
    };

    Sprite_AtbIcon.prototype.setupEffect = function() {
        var effectType = this._battler.battleSprite()._effectType;
        if (effectType && this._effectType != effectType) {
            this.startEffect(effectType);
        }
    };

    Sprite_AtbIcon.prototype.startEffect = function(effectType) {
        this._effectType = effectType;
        switch (this._effectType) {
            case 'appear':
                this.startAppear();
                break;
            case 'disappear':
                this.startDisappear();
                break;
            case 'whiten':
                this.startWhiten();
                break;
            case 'collapse':
                this.startCollapse();
                break;
            case 'bossCollapse':
                this.startBossCollapse();
                break;
            case 'instantCollapse':
                this.startInstantCollapse();
                break;
        }
        this.revertToNormal();
    };

    Sprite_AtbIcon.prototype.startAppear = function() {
        this._effectDuration = 16;
        this._appeared = true;
    };

    Sprite_AtbIcon.prototype.startDisappear = function() {
        this._effectDuration = 32;
        this._appeared = false;
    };

    Sprite_AtbIcon.prototype.startWhiten = function() {
        this._effectDuration = 16;
    };

    Sprite_AtbIcon.prototype.startCollapse = function() {
        this._effectDuration = 32;
        this._appeared = false;
    };

    Sprite_AtbIcon.prototype.startBossCollapse = function() {
        this._effectDuration = this.bitmap.height;
        this._appeared = false;
    };

    Sprite_AtbIcon.prototype.startInstantCollapse = function() {
        this._effectDuration = 16;
        this._appeared = false;
    };

    Sprite_AtbIcon.prototype.updateEffect = function() {
        this.setupEffect();
        if (this._effectDuration > 0) {
            this._effectDuration--;
            switch (this._effectType) {
                case 'whiten':
                    this.updateWhiten();
                    break;
                case 'appear':
                    this.updateAppear();
                    break;
                case 'disappear':
                    this.updateDisappear();
                    break;
                case 'collapse':
                    this.updateCollapse();
                    break;
                case 'bossCollapse':
                    this.updateBossCollapse();
                    break;
                case 'instantCollapse':
                    this.updateInstantCollapse();
                    break;
            }
            if (this._effectDuration === 0) {
                this._effectType = null;
            }
        }
    };

    Sprite_AtbIcon.prototype.isEffecting = function() {
        return this._effectType !== null;
    };

    Sprite_AtbIcon.prototype.revertToNormal = function() {
        this._shake = 0;
        this.blendMode = 0;
        this.opacity = 255;
        this.setBlendColor([0, 0, 0, 0]);
        this.z = 0;
    };

    Sprite_AtbIcon.prototype.updateWhiten = function() {
        var alpha = 128 - (16 - this._effectDuration) * 10;
        this.setBlendColor([255, 255, 255, alpha]);
    };

    Sprite_AtbIcon.prototype.updateAppear = function() {
        this.opacity = (16 - this._effectDuration) * 16;
    };

    Sprite_AtbIcon.prototype.updateDisappear = function() {
        this.opacity = 256 - (32 - this._effectDuration) * 10;
    };

    Sprite_AtbIcon.prototype.updateCollapse = function() {
        this.blendMode = Graphics.BLEND_ADD;
        this.setBlendColor([255, 128, 128, 128]);
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        this.z = 2;
    };

    Sprite_AtbIcon.prototype.updateBossCollapse = function() {
        this.blendMode = Graphics.BLEND_ADD;
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        this.z = 2;
    };

    Sprite_AtbIcon.prototype.updateInstantCollapse = function() {
        this.opacity = 0;
    };

    Sprite_AtbIcon.prototype.updateSelectionEffect = function() {
        if (this._battler.isSelected()) {
            this._selectionEffectCount++;
            if (this._selectionEffectCount % 30 < 15) {
                this.setBlendColor([255, 255, 255, 64]);
            } else {
                this.setBlendColor([0, 0, 0, 0]);
            }
            this.z = 1;
        } else if (this._selectionEffectCount > 0) {
            this._selectionEffectCount = 0;
            this.setBlendColor([0, 0, 0, 0]);
            this.z = 0;
        }
    };

})();
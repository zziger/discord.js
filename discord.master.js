window["Discord"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 57);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

exports.Package = __webpack_require__(35);
const { Error, RangeError } = __webpack_require__(4);
exports.browser = typeof window !== 'undefined';

/**
 * Options for a client.
 * @typedef {Object} ClientOptions
 * @property {string} [apiRequestMethod='sequential'] One of `sequential` or `burst`. The sequential handler executes
 * all requests in the order they are triggered, whereas the burst handler runs multiple in parallel, and doesn't
 * provide the guarantee of any particular order. Burst mode is more likely to hit a 429 ratelimit error by its nature,
 * and is therefore slightly riskier to use.
 * @property {number} [shardId=0] ID of the shard to run
 * @property {number} [shardCount=0] Total number of shards
 * @property {number} [messageCacheMaxSize=200] Maximum number of messages to cache per channel
 * (-1 or Infinity for unlimited - don't do this without message sweeping, otherwise memory usage will climb
 * indefinitely)
 * @property {number} [messageCacheLifetime=0] How long a message should stay in the cache until it is considered
 * sweepable (in seconds, 0 for forever)
 * @property {number} [messageSweepInterval=0] How frequently to remove messages from the cache that are older than
 * the message cache lifetime (in seconds, 0 for never)
 * @property {boolean} [fetchAllMembers=false] Whether to cache all guild members and users upon startup, as well as
 * upon joining a guild (should be avoided whenever possible)
 * @property {boolean} [disableEveryone=false] Default value for {@link MessageOptions#disableEveryone}
 * @property {boolean} [sync=false] Whether to periodically sync guilds (for user accounts)
 * @property {number} [restWsBridgeTimeout=5000] Maximum time permitted between REST responses and their
 * corresponding websocket events
 * @property {number} [restTimeOffset=500] Extra time in millseconds to wait before continuing to make REST
 * requests (higher values will reduce rate-limiting errors on bad connections)
 * @property {WSEventType[]} [disabledEvents] An array of disabled websocket events. Events in this array will not be
 * processed, potentially resulting in performance improvements for larger bots. Only disable events you are
 * 100% certain you don't need, as many are important, but not obviously so. The safest one to disable with the
 * most impact is typically `TYPING_START`.
 * @property {WebsocketOptions} [ws] Options for the WebSocket
 * @property {HTTPOptions} [http] HTTP options
 */
exports.DefaultOptions = {
  apiRequestMethod: 'sequential',
  shardId: 0,
  shardCount: 0,
  internalSharding: false,
  messageCacheMaxSize: 200,
  messageCacheLifetime: 0,
  messageSweepInterval: 0,
  fetchAllMembers: false,
  disableEveryone: false,
  sync: false,
  restWsBridgeTimeout: 5000,
  disabledEvents: [],
  restTimeOffset: 500,

  /**
   * WebSocket options (these are left as snake_case to match the API)
   * @typedef {Object} WebsocketOptions
   * @property {number} [large_threshold=250] Number of members in a guild to be considered large
   * @property {boolean} [compress=true] Whether to compress data sent on the connection
   * (defaults to `false` for browsers)
   */
  ws: {
    large_threshold: 250,
    compress: !exports.browser,
    properties: {
      $os: exports.browser ? 'browser' : process.platform,
      $browser: 'discord.js',
      $device: 'discord.js',
    },
    version: 6,
  },

  /**
   * HTTP options
   * @typedef {Object} HTTPOptions
   * @property {number} [version=7] API version to use
   * @property {string} [api='https://discordapp.com/api'] Base url of the API
   * @property {string} [cdn='https://cdn.discordapp.com'] Base url of the CDN
   * @property {string} [invite='https://discord.gg'] Base url of invites
   */
  http: {
    version: 7,
    api: 'https://discordapp.com/api',
    cdn: 'https://cdn.discordapp.com',
    invite: 'https://discord.gg',
  },
};

exports.WSCodes = {
  1000: 'Connection gracefully closed',
  4004: 'Tried to identify with an invalid token',
  4010: 'Sharding data provided was invalid',
  4011: 'Shard would be on too many guilds if connected',
};

const AllowedImageFormats = [
  'webp',
  'png',
  'jpg',
  'gif',
];

const AllowedImageSizes = Array.from({ length: 8 }, (e, i) => 2 ** (i + 4));

function makeImageUrl(root, { format = 'webp', size } = {}) {
  if (format && !AllowedImageFormats.includes(format)) throw new Error('IMAGE_FORMAT', format);
  if (size && !AllowedImageSizes.includes(size)) throw new RangeError('IMAGE_SIZE', size);
  return `${root}.${format}${size ? `?size=${size}` : ''}`;
}

exports.Endpoints = {
  CDN(root) {
    return {
      Emoji: emojiID => `${root}/emojis/${emojiID}.png`,
      Asset: name => `${root}/assets/${name}`,
      DefaultAvatar: number => `${root}/embed/avatars/${number}.png`,
      Avatar: (userID, hash, format = 'default', size) => {
        if (format === 'default') format = hash.startsWith('a_') ? 'gif' : 'webp';
        return makeImageUrl(`${root}/avatars/${userID}/${hash}`, { format, size });
      },
      Icon: (guildID, hash, format = 'webp', size) =>
        makeImageUrl(`${root}/icons/${guildID}/${hash}`, { format, size }),
      AppIcon: (clientID, hash, { format = 'webp', size } = {}) =>
        makeImageUrl(`${root}/app-icons/${clientID}/${hash}`, { size, format }),
      AppAsset: (clientID, hash, { format = 'webp', size } = {}) =>
        makeImageUrl(`${root}/app-assets/${clientID}/${hash}`, { size, format }),
      GDMIcon: (channelID, hash, format = 'webp', size) =>
        makeImageUrl(`${root}/channel-icons/${channelID}/${hash}`, { size, format }),
      Splash: (guildID, hash, format = 'webp', size) =>
        makeImageUrl(`${root}/splashes/${guildID}/${hash}`, { size, format }),
    };
  },
  invite: (root, code) => `${root}/${code}`,
  botGateway: '/gateway/bot',
};

/**
 * The current status of the client. Here are the available statuses:
 * * READY: 0
 * * CONNECTING: 1
 * * RECONNECTING: 2
 * * IDLE: 3
 * * NEARLY: 4
 * * DISCONNECTED: 5
 * @typedef {number} Status
 */
exports.Status = {
  READY: 0,
  CONNECTING: 1,
  RECONNECTING: 2,
  IDLE: 3,
  NEARLY: 4,
  DISCONNECTED: 5,
};

/**
 * The current status of a voice connection. Here are the available statuses:
 * * CONNECTED: 0
 * * CONNECTING: 1
 * * AUTHENTICATING: 2
 * * RECONNECTING: 3
 * * DISCONNECTED: 4
 * @typedef {number} VoiceStatus
 */
exports.VoiceStatus = {
  CONNECTED: 0,
  CONNECTING: 1,
  AUTHENTICATING: 2,
  RECONNECTING: 3,
  DISCONNECTED: 4,
};

exports.OPCodes = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
  STATUS_UPDATE: 3,
  VOICE_STATE_UPDATE: 4,
  VOICE_GUILD_PING: 5,
  RESUME: 6,
  RECONNECT: 7,
  REQUEST_GUILD_MEMBERS: 8,
  INVALID_SESSION: 9,
  HELLO: 10,
  HEARTBEAT_ACK: 11,
};

exports.VoiceOPCodes = {
  IDENTIFY: 0,
  SELECT_PROTOCOL: 1,
  READY: 2,
  HEARTBEAT: 3,
  SESSION_DESCRIPTION: 4,
  SPEAKING: 5,
};

exports.Events = {
  READY: 'ready',
  RESUMED: 'resumed',
  GUILD_CREATE: 'guildCreate',
  GUILD_DELETE: 'guildDelete',
  GUILD_UPDATE: 'guildUpdate',
  GUILD_UNAVAILABLE: 'guildUnavailable',
  GUILD_AVAILABLE: 'guildAvailable',
  GUILD_MEMBER_ADD: 'guildMemberAdd',
  GUILD_MEMBER_REMOVE: 'guildMemberRemove',
  GUILD_MEMBER_UPDATE: 'guildMemberUpdate',
  GUILD_MEMBER_AVAILABLE: 'guildMemberAvailable',
  GUILD_MEMBER_SPEAKING: 'guildMemberSpeaking',
  GUILD_MEMBERS_CHUNK: 'guildMembersChunk',
  GUILD_ROLE_CREATE: 'roleCreate',
  GUILD_ROLE_DELETE: 'roleDelete',
  GUILD_ROLE_UPDATE: 'roleUpdate',
  GUILD_EMOJI_CREATE: 'emojiCreate',
  GUILD_EMOJI_DELETE: 'emojiDelete',
  GUILD_EMOJI_UPDATE: 'emojiUpdate',
  GUILD_BAN_ADD: 'guildBanAdd',
  GUILD_BAN_REMOVE: 'guildBanRemove',
  CHANNEL_CREATE: 'channelCreate',
  CHANNEL_DELETE: 'channelDelete',
  CHANNEL_UPDATE: 'channelUpdate',
  CHANNEL_PINS_UPDATE: 'channelPinsUpdate',
  MESSAGE_CREATE: 'message',
  MESSAGE_DELETE: 'messageDelete',
  MESSAGE_UPDATE: 'messageUpdate',
  MESSAGE_BULK_DELETE: 'messageDeleteBulk',
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
  MESSAGE_REACTION_REMOVE_ALL: 'messageReactionRemoveAll',
  USER_UPDATE: 'userUpdate',
  USER_NOTE_UPDATE: 'userNoteUpdate',
  USER_SETTINGS_UPDATE: 'clientUserSettingsUpdate',
  USER_GUILD_SETTINGS_UPDATE: 'clientUserGuildSettingsUpdate',
  PRESENCE_UPDATE: 'presenceUpdate',
  VOICE_STATE_UPDATE: 'voiceStateUpdate',
  TYPING_START: 'typingStart',
  TYPING_STOP: 'typingStop',
  DISCONNECT: 'disconnect',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
};

/**
 * The type of a websocket message event, e.g. `MESSAGE_CREATE`. Here are the available events:
 * * READY
 * * RESUMED
 * * GUILD_SYNC
 * * GUILD_CREATE
 * * GUILD_DELETE
 * * GUILD_UPDATE
 * * GUILD_MEMBER_ADD
 * * GUILD_MEMBER_REMOVE
 * * GUILD_MEMBER_UPDATE
 * * GUILD_MEMBERS_CHUNK
 * * GUILD_ROLE_CREATE
 * * GUILD_ROLE_DELETE
 * * GUILD_ROLE_UPDATE
 * * GUILD_BAN_ADD
 * * GUILD_BAN_REMOVE
 * * CHANNEL_CREATE
 * * CHANNEL_DELETE
 * * CHANNEL_UPDATE
 * * CHANNEL_PINS_UPDATE
 * * MESSAGE_CREATE
 * * MESSAGE_DELETE
 * * MESSAGE_UPDATE
 * * MESSAGE_DELETE_BULK
 * * MESSAGE_REACTION_ADD
 * * MESSAGE_REACTION_REMOVE
 * * MESSAGE_REACTION_REMOVE_ALL
 * * USER_UPDATE
 * * USER_NOTE_UPDATE
 * * USER_SETTINGS_UPDATE
 * * PRESENCE_UPDATE
 * * VOICE_STATE_UPDATE
 * * TYPING_START
 * * VOICE_SERVER_UPDATE
 * * RELATIONSHIP_ADD
 * * RELATIONSHIP_REMOVE
 * @typedef {string} WSEventType
 */
exports.WSEvents = keyMirror([
  'READY',
  'RESUMED',
  'GUILD_SYNC',
  'GUILD_CREATE',
  'GUILD_DELETE',
  'GUILD_UPDATE',
  'GUILD_MEMBER_ADD',
  'GUILD_MEMBER_REMOVE',
  'GUILD_MEMBER_UPDATE',
  'GUILD_MEMBERS_CHUNK',
  'GUILD_ROLE_CREATE',
  'GUILD_ROLE_DELETE',
  'GUILD_ROLE_UPDATE',
  'GUILD_BAN_ADD',
  'GUILD_BAN_REMOVE',
  'GUILD_EMOJIS_UPDATE',
  'CHANNEL_CREATE',
  'CHANNEL_DELETE',
  'CHANNEL_UPDATE',
  'CHANNEL_PINS_UPDATE',
  'MESSAGE_CREATE',
  'MESSAGE_DELETE',
  'MESSAGE_UPDATE',
  'MESSAGE_DELETE_BULK',
  'MESSAGE_REACTION_ADD',
  'MESSAGE_REACTION_REMOVE',
  'MESSAGE_REACTION_REMOVE_ALL',
  'USER_UPDATE',
  'USER_NOTE_UPDATE',
  'USER_SETTINGS_UPDATE',
  'USER_GUILD_SETTINGS_UPDATE',
  'PRESENCE_UPDATE',
  'VOICE_STATE_UPDATE',
  'TYPING_START',
  'VOICE_SERVER_UPDATE',
  'RELATIONSHIP_ADD',
  'RELATIONSHIP_REMOVE',
]);

/**
 * The type of a message, e.g. `DEFAULT`. Here are the available types:
 * * DEFAULT
 * * RECIPIENT_ADD
 * * RECIPIENT_REMOVE
 * * CALL
 * * CHANNEL_NAME_CHANGE
 * * CHANNEL_ICON_CHANGE
 * * PINS_ADD
 * * GUILD_MEMBER_JOIN
 * @typedef {string} MessageType
 */
exports.MessageTypes = [
  'DEFAULT',
  'RECIPIENT_ADD',
  'RECIPIENT_REMOVE',
  'CALL',
  'CHANNEL_NAME_CHANGE',
  'CHANNEL_ICON_CHANGE',
  'PINS_ADD',
  'GUILD_MEMBER_JOIN',
];

/**
 * The type of an activity of a users presence, e.g. `PLAYING`. Here are the available types:
 * * PLAYING
 * * STREAMING
 * * LISTENING
 * * WATCHING
 * @typedef {string} ActivityType
 */
exports.ActivityTypes = [
  'PLAYING',
  'STREAMING',
  'LISTENING',
  'WATCHING',
];

exports.ExplicitContentFilterTypes = [
  'DISABLED',
  'NON_FRIENDS',
  'FRIENDS_AND_NON_FRIENDS',
];

exports.MessageNotificationTypes = [
  'EVERYTHING',
  'MENTIONS',
  'NOTHING',
  'INHERIT',
];

exports.UserSettingsMap = {
  /**
   * Automatically convert emoticons in your messages to emoji
   * For example, when you type `:-)` Discord will convert it to 😃
   * @name ClientUserSettings#convertEmoticons
   * @type {boolean}
   */
  convert_emoticons: 'convertEmoticons',

  /**
   * If new guilds should automatically disable DMs between you and its members
   * @name ClientUserSettings#defaultGuildsRestricted
   * @type {boolean}
   */
  default_guilds_restricted: 'defaultGuildsRestricted',

  /**
   * Automatically detect accounts from services like Steam and Blizzard when you open the Discord client
   * @name ClientUserSettings#detectPlatformAccounts
   * @type {boolean}
   */
  detect_platform_accounts: 'detectPlatformAccounts',

  /**
   * Developer Mode exposes context menu items helpful for people writing bots using the Discord API
   * @name ClientUserSettings#developerMode
   * @type {boolean}
   */
  developer_mode: 'developerMode',

  /**
   * Allow playback and usage of the `/tts` command
   * @name ClientUserSettings#enableTTSCommand
   * @type {boolean}
   */
  enable_tts_command: 'enableTTSCommand',

  /**
   * The theme of the client. Either `light` or `dark`
   * @name ClientUserSettings#theme
   * @type {string}
   */
  theme: 'theme',

  /**
   * Last status set in the client
   * @name ClientUserSettings#status
   * @type {PresenceStatus}
   */
  status: 'status',

  /**
   * Display currently running game as status message
   * @name ClientUserSettings#showCurrentGame
   * @type {boolean}
   */
  show_current_game: 'showCurrentGame',

  /**
   * Display images, videos, and lolcats when uploaded directly to Discord
   * @name ClientUserSettings#inlineAttachmentMedia
   * @type {boolean}
   */
  inline_attachment_media: 'inlineAttachmentMedia',

  /**
   * Display images, videos, and lolcats when uploaded posted as links in chat
   * @name ClientUserSettings#inlineEmbedMedia
   * @type {boolean}
   */
  inline_embed_media: 'inlineEmbedMedia',

  /**
   * Language the Discord client will use, as an RFC 3066 language identifier
   * @name ClientUserSettings#locale
   * @type {string}
   */
  locale: 'locale',

  /**
   * Display messages in compact mode
   * @name ClientUserSettings#messageDisplayCompact
   * @type {boolean}
   */
  message_display_compact: 'messageDisplayCompact',

  /**
   * Show emoji reactions on messages
   * @name ClientUserSettings#renderReactions
   * @type {boolean}
   */
  render_reactions: 'renderReactions',

  /**
   * Array of snowflake IDs for guilds, in the order they appear in the Discord client
   * @name ClientUserSettings#guildPositions
   * @type {Snowflake[]}
   */
  guild_positions: 'guildPositions',

  /**
   * Array of snowflake IDs for guilds which you will not recieve DMs from
   * @name ClientUserSettings#restrictedGuilds
   * @type {Snowflake[]}
   */
  restricted_guilds: 'restrictedGuilds',

  explicit_content_filter: function explicitContentFilter(type) { // eslint-disable-line func-name-matching
    /**
     * Safe direct messaging; force people's messages with images to be scanned before they are sent to you.
     * One of `DISABLED`, `NON_FRIENDS`, `FRIENDS_AND_NON_FRIENDS`
     * @name ClientUserSettings#explicitContentFilter
     * @type {string}
     */
    return exports.ExplicitContentFilterTypes[type];
  },
  friend_source_flags: function friendSources(flags) { // eslint-disable-line func-name-matching
    /**
     * Who can add you as a friend
     * @name ClientUserSettings#friendSources
     * @type {Object}
     * @property {boolean} all Mutual friends and mutual guilds
     * @property {boolean} mutualGuilds Only mutual guilds
     * @property {boolean} mutualFriends Only mutual friends
     */
    return {
      all: flags.all || false,
      mutualGuilds: flags.all ? true : flags.mutual_guilds || false,
      mutualFriends: flags.all ? true : flags.mutualFriends || false,
    };
  },
};

exports.UserGuildSettingsMap = {
  message_notifications: function messageNotifications(type) { // eslint-disable-line func-name-matching
    /**
     * The type of message that should notify you.
     * One of `EVERYTHING`, `MENTIONS`, `NOTHING`
     * @name ClientUserGuildSettings#messageNotifications
     * @type {string}
     */
    return exports.MessageNotificationTypes[type];
  },
  /**
   * Whether to receive mobile push notifications
   * @name ClientUserGuildSettings#mobilePush
   * @type {boolean}
   */
  mobile_push: 'mobilePush',
  /**
   * Whether the guild is muted or not
   * @name ClientUserGuildSettings#muted
   * @type {boolean}
   */
  muted: 'muted',
  /**
   * Whether to suppress everyone messages
   * @name ClientUserGuildSettings#suppressEveryone
   * @type {boolean}
   */
  suppress_everyone: 'suppressEveryone',
  /**
   * A collection containing all the channel overrides
   * @name ClientUserGuildSettings#channelOverrides
   * @type {Collection<ClientUserChannelOverride>}
   */
  channel_overrides: 'channelOverrides',
};

exports.UserChannelOverrideMap = {
  message_notifications: function messageNotifications(type) { // eslint-disable-line func-name-matching
    /**
     * The type of message that should notify you.
     * One of `EVERYTHING`, `MENTIONS`, `NOTHING`, `INHERIT`
     * @name ClientUserChannelOverride#messageNotifications
     * @type {string}
     */
    return exports.MessageNotificationTypes[type];
  },
  /**
   * Whether the channel is muted or not
   * @name ClientUserChannelOverride#muted
   * @type {boolean}
   */
  muted: 'muted',
};

/**
 * All flags users can have:
 * * STAFF
 * * PARTNER
 * * HYPESQUAD
 * @typedef {string} UserFlags
 */
exports.UserFlags = {
  STAFF: 1 << 0,
  PARTNER: 1 << 1,
  HYPESQUAD: 1 << 2,
};

exports.ChannelTypes = {
  TEXT: 0,
  DM: 1,
  VOICE: 2,
  GROUP: 3,
  CATEGORY: 4,
};

exports.ClientApplicationAssetTypes = {
  SMALL: 1,
  BIG: 2,
};

exports.Colors = {
  DEFAULT: 0x000000,
  AQUA: 0x1ABC9C,
  GREEN: 0x2ECC71,
  BLUE: 0x3498DB,
  PURPLE: 0x9B59B6,
  GOLD: 0xF1C40F,
  ORANGE: 0xE67E22,
  RED: 0xE74C3C,
  GREY: 0x95A5A6,
  NAVY: 0x34495E,
  DARK_AQUA: 0x11806A,
  DARK_GREEN: 0x1F8B4C,
  DARK_BLUE: 0x206694,
  DARK_PURPLE: 0x71368A,
  DARK_GOLD: 0xC27C0E,
  DARK_ORANGE: 0xA84300,
  DARK_RED: 0x992D22,
  DARK_GREY: 0x979C9F,
  DARKER_GREY: 0x7F8C8D,
  LIGHT_GREY: 0xBCC0C0,
  DARK_NAVY: 0x2C3E50,
  BLURPLE: 0x7289DA,
  GREYPLE: 0x99AAB5,
  DARK_BUT_NOT_BLACK: 0x2C2F33,
  NOT_QUITE_BLACK: 0x23272A,
};

/**
 * An error encountered while performing an API request. Here are the potential errors:
 * * UNKNOWN_ACCOUNT
 * * UNKNOWN_APPLICATION
 * * UNKNOWN_CHANNEL
 * * UNKNOWN_GUILD
 * * UNKNOWN_INTEGRATION
 * * UNKNOWN_INVITE
 * * UNKNOWN_MEMBER
 * * UNKNOWN_MESSAGE
 * * UNKNOWN_OVERWRITE
 * * UNKNOWN_PROVIDER
 * * UNKNOWN_ROLE
 * * UNKNOWN_TOKEN
 * * UNKNOWN_USER
 * * UNKNOWN_EMOJI
 * * BOT_PROHIBITED_ENDPOINT
 * * BOT_ONLY_ENDPOINT
 * * MAXIMUM_GUILDS
 * * MAXIMUM_FRIENDS
 * * MAXIMUM_PINS
 * * MAXIMUM_ROLES
 * * MAXIMUM_REACTIONS
 * * UNAUTHORIZED
 * * MISSING_ACCESS
 * * INVALID_ACCOUNT_TYPE
 * * CANNOT_EXECUTE_ON_DM
 * * EMBED_DISABLED
 * * CANNOT_EDIT_MESSAGE_BY_OTHER
 * * CANNOT_SEND_EMPTY_MESSAGE
 * * CANNOT_MESSAGE_USER
 * * CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL
 * * CHANNEL_VERIFICATION_LEVEL_TOO_HIGH
 * * OAUTH2_APPLICATION_BOT_ABSENT
 * * MAXIMUM_OAUTH2_APPLICATIONS
 * * INVALID_OAUTH_STATE
 * * MISSING_PERMISSIONS
 * * INVALID_AUTHENTICATION_TOKEN
 * * NOTE_TOO_LONG
 * * INVALID_BULK_DELETE_QUANTITY
 * * CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL
 * * CANNOT_EXECUTE_ON_SYSTEM_MESSAGE
 * * BULK_DELETE_MESSAGE_TOO_OLD
 * * INVITE_ACCEPTED_TO_GUILD_NOT_CONTANING_BOT
 * * REACTION_BLOCKED
 * @typedef {string} APIError
 */
exports.APIErrors = {
  UNKNOWN_ACCOUNT: 10001,
  UNKNOWN_APPLICATION: 10002,
  UNKNOWN_CHANNEL: 10003,
  UNKNOWN_GUILD: 10004,
  UNKNOWN_INTEGRATION: 10005,
  UNKNOWN_INVITE: 10006,
  UNKNOWN_MEMBER: 10007,
  UNKNOWN_MESSAGE: 10008,
  UNKNOWN_OVERWRITE: 10009,
  UNKNOWN_PROVIDER: 10010,
  UNKNOWN_ROLE: 10011,
  UNKNOWN_TOKEN: 10012,
  UNKNOWN_USER: 10013,
  UNKNOWN_EMOJI: 10014,
  BOT_PROHIBITED_ENDPOINT: 20001,
  BOT_ONLY_ENDPOINT: 20002,
  MAXIMUM_GUILDS: 30001,
  MAXIMUM_FRIENDS: 30002,
  MAXIMUM_PINS: 30003,
  MAXIMUM_ROLES: 30005,
  MAXIMUM_REACTIONS: 30010,
  UNAUTHORIZED: 40001,
  MISSING_ACCESS: 50001,
  INVALID_ACCOUNT_TYPE: 50002,
  CANNOT_EXECUTE_ON_DM: 50003,
  EMBED_DISABLED: 50004,
  CANNOT_EDIT_MESSAGE_BY_OTHER: 50005,
  CANNOT_SEND_EMPTY_MESSAGE: 50006,
  CANNOT_MESSAGE_USER: 50007,
  CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL: 50008,
  CHANNEL_VERIFICATION_LEVEL_TOO_HIGH: 50009,
  OAUTH2_APPLICATION_BOT_ABSENT: 50010,
  MAXIMUM_OAUTH2_APPLICATIONS: 50011,
  INVALID_OAUTH_STATE: 50012,
  MISSING_PERMISSIONS: 50013,
  INVALID_AUTHENTICATION_TOKEN: 50014,
  NOTE_TOO_LONG: 50015,
  INVALID_BULK_DELETE_QUANTITY: 50016,
  CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL: 50019,
  CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: 50021,
  BULK_DELETE_MESSAGE_TOO_OLD: 50034,
  INVITE_ACCEPTED_TO_GUILD_NOT_CONTANING_BOT: 50036,
  REACTION_BLOCKED: 90001,
};

function keyMirror(arr) {
  let tmp = Object.create(null);
  for (const value of arr) tmp[value] = value;
  return tmp;
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class AbstractHandler {
  constructor(packetManager) {
    this.packetManager = packetManager;
  }

  handle(packet) {
    return packet;
  }
}

module.exports = AbstractHandler;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*

ABOUT ACTIONS

Actions are similar to WebSocket Packet Handlers, but since introducing
the REST API methods, in order to prevent rewriting code to handle data,
"actions" have been introduced. They're basically what Packet Handlers
used to be but they're strictly for manipulating data and making sure
that WebSocket events don't clash with REST methods.

*/

class GenericAction {
  constructor(client) {
    this.client = client;
  }

  handle(data) {
    return data;
  }
}

module.exports = GenericAction;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 * @extends {Map}
 */
class Collection extends Map {
  constructor(iterable) {
    super(iterable);

    /**
     * Cached array for the `array()` method - will be reset to `null` whenever `set()` or `delete()` are called
     * @name Collection#_array
     * @type {?Array}
     * @private
     */
    Object.defineProperty(this, '_array', { value: null, writable: true, configurable: true });

    /**
     * Cached array for the `keyArray()` method - will be reset to `null` whenever `set()` or `delete()` are called
     * @name Collection#_keyArray
     * @type {?Array}
     * @private
     */
    Object.defineProperty(this, '_keyArray', { value: null, writable: true, configurable: true });
  }

  set(key, val) {
    this._array = null;
    this._keyArray = null;
    return super.set(key, val);
  }

  delete(key) {
    this._array = null;
    this._keyArray = null;
    return super.delete(key);
  }

  /**
   * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
   * itself. If you don't want this caching behaviour, use `Array.from(collection.values())` instead.
   * @returns {Array}
   */
  array() {
    if (!this._array || this._array.length !== this.size) this._array = Array.from(this.values());
    return this._array;
  }

  /**
   * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
   * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
   * itself. If you don't want this caching behaviour, use `Array.from(collection.keys())` instead.
   * @returns {Array}
   */
  keyArray() {
    if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = Array.from(this.keys());
    return this._keyArray;
  }

  /**
   * Obtains the first value(s) in this collection.
   * @param {number} [amount] Amount of values to obtain from the beginning
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the end if
   * amount is negative
   */
  first(amount) {
    if (typeof amount === 'undefined') return this.values().next().value;
    if (amount < 0) return this.last(amount * -1);
    amount = Math.min(this.size, amount);
    const arr = new Array(amount);
    const iter = this.values();
    for (let i = 0; i < amount; i++) arr[i] = iter.next().value;
    return arr;
  }

  /**
   * Obtains the first key(s) in this collection.
   * @param {number} [amount] Amount of keys to obtain from the beginning
   * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the end if
   * amount is negative
   */
  firstKey(amount) {
    if (typeof amount === 'undefined') return this.keys().next().value;
    if (amount < 0) return this.lastKey(amount * -1);
    amount = Math.min(this.size, amount);
    const arr = new Array(amount);
    const iter = this.keys();
    for (let i = 0; i < amount; i++) arr[i] = iter.next().value;
    return arr;
  }

  /**
   * Obtains the last value(s) in this collection. This relies on {@link Collection#array}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of values to obtain from the end
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values, starting from the end if
   * amount is negative
   */
  last(amount) {
    const arr = this.array();
    if (typeof amount === 'undefined') return arr[arr.length - 1];
    if (amount < 0) return this.first(amount * -1);
    if (!amount) return [];
    return arr.slice(-amount);
  }

  /**
   * Obtains the last key(s) in this collection. This relies on {@link Collection#keyArray}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of keys to obtain from the end
   * @returns {*|Array<*>} A single key if no amount is provided or an array of keys, starting from the end if
   * amount is negative
   */
  lastKey(amount) {
    const arr = this.keyArray();
    if (typeof amount === 'undefined') return arr[arr.length - 1];
    if (amount < 0) return this.firstKey(amount * -1);
    if (!amount) return [];
    return arr.slice(-amount);
  }

  /**
   * Obtains random value(s) from this collection. This relies on {@link Collection#array}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of values to obtain randomly
   * @returns {*|Array<*>} A single value if no amount is provided or an array of values
   */
  random(amount) {
    let arr = this.array();
    if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
    if (arr.length === 0 || !amount) return [];
    const rand = new Array(amount);
    arr = arr.slice();
    for (let i = 0; i < amount; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    return rand;
  }

  /**
   * Obtains random key(s) from this collection. This relies on {@link Collection#keyArray}, and thus the caching
   * mechanism applies here as well.
   * @param {number} [amount] Amount of keys to obtain randomly
   * @returns {*|Array<*>} A single key if no amount is provided or an array
   */
  randomKey(amount) {
    let arr = this.keyArray();
    if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
    if (arr.length === 0 || !amount) return [];
    const rand = new Array(amount);
    arr = arr.slice();
    for (let i = 0; i < amount; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    return rand;
  }

  /**
   * Searches for all items where their specified property's value is identical to the given value
   * (`item[prop] === value`).
   * @param {string} prop The property to test against
   * @param {*} value The expected value
   * @returns {Array}
   * @example
   * collection.findAll('username', 'Bob');
   */
  findAll(prop, value) {
    if (typeof prop !== 'string') throw new TypeError('Key must be a string.');
    if (typeof value === 'undefined') throw new Error('Value must be specified.');
    const results = [];
    for (const item of this.values()) {
      if (item[prop] === value) results.push(item);
    }
    return results;
  }

  /**
   * Searches for a single item where its specified property's value is identical to the given value
   * (`item[prop] === value`), or the given function returns a truthy value. In the latter case, this is identical to
   * [Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).
   * <warn>All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
   * should use the `get` method. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get) for details.</warn>
   * @param {string|Function} propOrFn The property to test against, or the function to test with
   * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
   * @returns {*}
   * @example
   * collection.find('username', 'Bob');
   * @example
   * collection.find(val => val.username === 'Bob');
   */
  find(propOrFn, value) {
    if (typeof propOrFn === 'string') {
      if (typeof value === 'undefined') throw new Error('Value must be specified.');
      for (const item of this.values()) {
        if (item[propOrFn] === value) return item;
      }
      return null;
    } else if (typeof propOrFn === 'function') {
      for (const [key, val] of this) {
        if (propOrFn(val, key, this)) return val;
      }
      return null;
    } else {
      throw new Error('First argument must be a property string or a function.');
    }
  }

  /* eslint-disable max-len */
  /**
   * Searches for the key of a single item where its specified property's value is identical to the given value
   * (`item[prop] === value`), or the given function returns a truthy value. In the latter case, this is identical to
   * [Array.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex).
   * @param {string|Function} propOrFn The property to test against, or the function to test with
   * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
   * @returns {*}
   * @example
   * collection.findKey('username', 'Bob');
   * @example
   * collection.findKey(val => val.username === 'Bob');
   */
  /* eslint-enable max-len */
  findKey(propOrFn, value) {
    if (typeof propOrFn === 'string') {
      if (typeof value === 'undefined') throw new Error('Value must be specified.');
      for (const [key, val] of this) {
        if (val[propOrFn] === value) return key;
      }
      return null;
    } else if (typeof propOrFn === 'function') {
      for (const [key, val] of this) {
        if (propOrFn(val, key, this)) return key;
      }
      return null;
    } else {
      throw new Error('First argument must be a property string or a function.');
    }
  }

  /**
   * Searches for the existence of a single item where its specified property's value is identical to the given value
   * (`item[prop] === value`), or the given function returns a truthy value.
   * <warn>Do not use this to check for an item by its ID. Instead, use `collection.has(id)`. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has) for details.</warn>
   * @param {string|Function} propOrFn The property to test against, or the function to test with
   * @param {*} [value] The expected value - only applicable and required if using a property for the first argument
   * @returns {boolean}
   * @example
   * if (collection.exists('username', 'Bob')) {
   *  console.log('user here!');
   * }
   * @example
   * if (collection.exists(user => user.username === 'Bob')) {
   *  console.log('user here!');
   * }
   */
  exists(propOrFn, value) {
    return Boolean(this.find(propOrFn, value));
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
   * but returns a Collection instead of an Array.
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {Collection}
   */
  filter(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const results = new Collection();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  /**
   * Identical to
   * [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {Array}
   */
  filterArray(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const results = [];
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.push(val);
    }
    return results;
  }

  /**
   * Identical to
   * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
   * @param {Function} fn Function that produces an element of the new array, taking three arguments
   * @param {*} [thisArg] Value to use as `this` when executing function
   * @returns {Array}
   */
  map(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = new Array(this.size);
    let i = 0;
    for (const [key, val] of this) arr[i++] = fn(val, key, this);
    return arr;
  }

  /**
   * Identical to
   * [Array.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   */
  some(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  /**
   * Identical to
   * [Array.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every).
   * @param {Function} fn Function used to test (should return a boolean)
   * @param {Object} [thisArg] Value to use as `this` when executing function
   * @returns {boolean}
   */
  every(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  /**
   * Identical to
   * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
   * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
   * and `collection`
   * @param {*} [initialValue] Starting value for the accumulator
   * @returns {*}
   */
  reduce(fn, initialValue) {
    let accumulator;
    if (typeof initialValue !== 'undefined') {
      accumulator = initialValue;
      for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
    } else {
      let first = true;
      for (const [key, val] of this) {
        if (first) {
          accumulator = val;
          first = false;
          continue;
        }
        accumulator = fn(accumulator, val, key, this);
      }
    }
    return accumulator;
  }

  /**
   * Creates an identical shallow copy of this collection.
   * @returns {Collection}
   * @example const newColl = someColl.clone();
   */
  clone() {
    return new this.constructor(this);
  }

  /**
   * Combines this collection with others into a new collection. None of the source collections are modified.
   * @param {...Collection} collections Collections to merge
   * @returns {Collection}
   * @example const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
   */
  concat(...collections) {
    const newColl = this.clone();
    for (const coll of collections) {
      for (const [key, val] of coll) newColl.set(key, val);
    }
    return newColl;
  }

  /**
   * Calls the `delete()` method on all items that have it.
   * @returns {Promise[]}
   */
  deleteAll() {
    const returns = [];
    for (const item of this.values()) {
      if (item.delete) returns.push(item.delete());
    }
    return returns;
  }

  /**
   * Checks if this collection shares identical key-value pairings with another.
   * This is different to checking for equality using equal-signs, because
   * the collections may be different objects, but contain the same data.
   * @param {Collection} collection Collection to compare with
   * @returns {boolean} Whether the collections have identical contents
   */
  equals(collection) {
    if (!collection) return false;
    if (this === collection) return true;
    if (this.size !== collection.size) return false;
    return !this.find((value, key) => {
      const testVal = collection.get(key);
      return testVal !== value || (testVal === undefined && !collection.has(key));
    });
  }

  /**
   * The sort() method sorts the elements of a collection and returns it.
   * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
   * @param {Function} [compareFunction] Specifies a function that defines the sort order.
   * If omitted, the collection is sorted according to each character's Unicode code point value,
   * according to the string conversion of each element.
   * @returns {Collection}
   */
  sort(compareFunction = (x, y) => +(x > y) || +(x === y) - 1) {
    return new Collection(Array.from(this.entries()).sort((a, b) => compareFunction(a[1], b[1], a[0], b[0])));
  }
}

module.exports = Collection;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(36);
module.exports.Messages = __webpack_require__(64);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Long = __webpack_require__(25);
const snekfetch = __webpack_require__(26);
const { Colors, DefaultOptions, Endpoints } = __webpack_require__(0);
const { Error: DiscordError, RangeError, TypeError } = __webpack_require__(4);
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/;

/**
 * Contains various general-purpose utility methods. These functions are also available on the base `Discord` object.
 */
class Util {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Splits a string into multiple chunks at a designated character that do not exceed a specific length.
   * @param {string} text Content to split
   * @param {SplitOptions} [options] Options controlling the behaviour of the split
   * @returns {string|string[]}
   */
  static splitMessage(text, { maxLength = 1950, char = '\n', prepend = '', append = '' } = {}) {
    if (text.length <= maxLength) return text;
    const splitText = text.split(char);
    if (splitText.length === 1) {
      throw new RangeError('SPLIT_MAX_LEN');
    }
    const messages = [''];
    let msg = 0;
    for (let i = 0; i < splitText.length; i++) {
      if (messages[msg].length + splitText[i].length + 1 > maxLength) {
        messages[msg] += append;
        messages.push(prepend);
        msg++;
      }
      messages[msg] += (messages[msg].length > 0 && messages[msg] !== prepend ? char : '') + splitText[i];
    }
    return messages.filter(m => m);
  }

  /**
   * Escapes any Discord-flavour markdown in a string.
   * @param {string} text Content to escape
   * @param {boolean} [onlyCodeBlock=false] Whether to only escape codeblocks (takes priority)
   * @param {boolean} [onlyInlineCode=false] Whether to only escape inline code
   * @returns {string}
   */
  static escapeMarkdown(text, onlyCodeBlock = false, onlyInlineCode = false) {
    if (onlyCodeBlock) return text.replace(/```/g, '`\u200b``');
    if (onlyInlineCode) return text.replace(/\\(`|\\)/g, '$1').replace(/(`|\\)/g, '\\$1');
    return text.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');
  }

  /**
   * Gets the recommended shard count from Discord.
   * @param {string} token Discord auth token
   * @param {number} [guildsPerShard=1000] Number of guilds per shard
   * @returns {Promise<number>} The recommended number of shards
   */
  static fetchRecommendedShards(token, guildsPerShard = 1000) {
    return new Promise((resolve, reject) => {
      if (!token) throw new DiscordError('TOKEN_MISSING');
      snekfetch.get(`${DefaultOptions.http.api}/v${DefaultOptions.http.version}${Endpoints.botGateway}`)
        .set('Authorization', `Bot ${token.replace(/^Bot\s*/i, '')}`)
        .end((err, res) => {
          if (err) reject(err);
          resolve(res.body.shards * (1000 / guildsPerShard));
        });
    });
  }

  /**
   * Parses emoji info out of a string. The string must be one of:
   * * A UTF-8 emoji (no ID)
   * * A URL-encoded UTF-8 emoji (no ID)
   * * A Discord custom emoji (`<:name:id>`)
   * @param {string} text Emoji string to parse
   * @returns {Object} Object with `name` and `id` properties
   * @private
   */
  static parseEmoji(text) {
    if (text.includes('%')) text = decodeURIComponent(text);
    if (text.includes(':')) {
      const [name, id] = text.split(':');
      return { name, id };
    } else {
      return {
        name: text,
        id: null,
      };
    }
  }

  /**
   * Checks whether the arrays are equal, also removes duplicated entries from b.
   * @param {Array<*>} a Array which will not be modified.
   * @param {Array<*>} b Array to remove duplicated entries from.
   * @returns {boolean} Whether the arrays are equal.
   * @private
   */
  static arraysEqual(a, b) {
    if (a === b) return true;
    if (a.length !== b.length) return false;

    for (const item of a) {
      const ind = b.indexOf(item);
      if (ind !== -1) b.splice(ind, 1);
    }

    return b.length === 0;
  }

  /**
   * Shallow-copies an object with its class/prototype intact.
   * @param {Object} obj Object to clone
   * @returns {Object}
   * @private
   */
  static cloneObject(obj) {
    return Object.assign(Object.create(obj), obj);
  }

  /**
   * Sets default properties on an object that aren't already specified.
   * @param {Object} def Default properties
   * @param {Object} given Object to assign defaults to
   * @returns {Object}
   * @private
   */
  static mergeDefault(def, given) {
    if (!given) return def;
    for (const key in def) {
      if (!has(given, key) || given[key] === undefined) {
        given[key] = def[key];
      } else if (given[key] === Object(given[key])) {
        given[key] = this.mergeDefault(def[key], given[key]);
      }
    }

    return given;
  }

  /**
   * Converts an ArrayBuffer or string to a Buffer.
   * @param {ArrayBuffer|string} ab ArrayBuffer to convert
   * @returns {Buffer}
   * @private
   */
  static convertToBuffer(ab) {
    if (typeof ab === 'string') ab = this.str2ab(ab);
    return Buffer.from(ab);
  }

  /**
   * Converts a string to an ArrayBuffer.
   * @param {string} str String to convert
   * @returns {ArrayBuffer}
   * @private
   */
  static str2ab(str) {
    const buffer = new ArrayBuffer(str.length * 2);
    const view = new Uint16Array(buffer);
    for (var i = 0, strLen = str.length; i < strLen; i++) view[i] = str.charCodeAt(i);
    return buffer;
  }

  /**
   * Makes an Error from a plain info object.
   * @param {Object} obj Error info
   * @param {string} obj.name Error type
   * @param {string} obj.message Message for the error
   * @param {string} obj.stack Stack for the error
   * @returns {Error}
   * @private
   */
  static makeError(obj) {
    const err = new Error(obj.message);
    err.name = obj.name;
    err.stack = obj.stack;
    return err;
  }

  /**
   * Makes a plain error info object from an Error.
   * @param {Error} err Error to get info from
   * @returns {Object}
   * @private
   */
  static makePlainError(err) {
    const obj = {};
    obj.name = err.name;
    obj.message = err.message;
    obj.stack = err.stack;
    return obj;
  }

  /**
   * Moves an element in an array *in place*.
   * @param {Array<*>} array Array to modify
   * @param {*} element Element to move
   * @param {number} newIndex Index or offset to move the element to
   * @param {boolean} [offset=false] Move the element by an offset amount rather than to a set index
   * @returns {number}
   * @private
   */
  static moveElementInArray(array, element, newIndex, offset = false) {
    const index = array.indexOf(element);
    newIndex = (offset ? index : 0) + newIndex;
    if (newIndex > -1 && newIndex < array.length) {
      const removedElement = array.splice(index, 1)[0];
      array.splice(newIndex, 0, removedElement);
    }
    return array.indexOf(element);
  }

  /**
   * Data that can be resolved to give a string. This can be:
   * * A string
   * * An array (joined with a new line delimiter to give a string)
   * * Any value
   * @typedef {string|Array|*} StringResolvable
   */

  /**
   * Resolves a StringResolvable to a string.
   * @param {StringResolvable} data The string resolvable to resolve
   * @returns {string}
   */

  static resolveString(data) {
    if (typeof data === 'string') return data;
    if (data instanceof Array) return data.join('\n');
    return String(data);
  }

  /**
   * Can be a Hex Literal, Hex String, Number, RGB Array, or one of the following
   * ```
   * [
   *   'DEFAULT',
   *   'AQUA',
   *   'GREEN',
   *   'BLUE',
   *   'PURPLE',
   *   'GOLD',
   *   'ORANGE',
   *   'RED',
   *   'GREY',
   *   'DARKER_GREY',
   *   'NAVY',
   *   'DARK_AQUA',
   *   'DARK_GREEN',
   *   'DARK_BLUE',
   *   'DARK_PURPLE',
   *   'DARK_GOLD',
   *   'DARK_ORANGE',
   *   'DARK_RED',
   *   'DARK_GREY',
   *   'LIGHT_GREY',
   *   'DARK_NAVY',
   *   'RANDOM',
   * ]
   * ```
   * or something like
   * ```
   * [255, 0, 255]
   * ```
   * for purple
   * @typedef {string|number|Array} ColorResolvable
   */

  /**
   * Resolves a ColorResolvable into a color number.
   * @param {ColorResolvable} color Color to resolve
   * @returns {number} A color
   */

  static resolveColor(color) {
    if (typeof color === 'string') {
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
      color = Colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (color instanceof Array) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xFFFFFF) {
      throw new RangeError('COLOR_RANGE');
    } else if (color && isNaN(color)) {
      throw new TypeError('COLOR_CONVERT');
    }

    return color;
  }

  /**
   * Sort by discord's position then ID thing
   * @param  {Collection} collection Collection of objects to sort
   * @returns {Collection}
   */
  static discordSort(collection) {
    return collection
      .sort((a, b) => a.rawPosition - b.rawPosition || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber());
  }

  static setPosition(item, position, relative, sorted, route, reason) {
    let updatedItems = sorted.array();
    Util.moveElementInArray(updatedItems, item, position, relative);
    updatedItems = updatedItems.map((r, i) => ({ id: r.id, position: i }));
    return route.patch({ data: updatedItems, reason });
  }

  static basename(path, ext) {
    let f = splitPathRe.exec(path).slice(1)[2];
    if (ext && f.substr(-1 * ext.length) === ext) {
      f = f.substr(0, f.length - ext.length);
    }
    return f;
  }
}

module.exports = Util;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);

/**
 * Manages the creation, retrieval and deletion of a specific data model.
 * @extends {Collection}
 */
class DataStore extends Collection {
  constructor(client, iterable, holds) {
    super();
    Object.defineProperty(this, 'client', { value: client });
    Object.defineProperty(this, 'holds', { value: holds });
    if (iterable) for (const item of iterable) this.create(item);
  }

  create(data, cache = true, { id, extras = [] } = {}) {
    const existing = this.get(id || data.id);
    if (existing) return existing;

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.set(id || entry.id, entry);
    return entry;
  }

  remove(key) { return this.delete(key); }

  /**
   * Resolves a data entry to a data Object.
   * @param {string|Object} idOrInstance The id or instance of something in this datastore
   * @returns {?Object} An instance from this datastore
   */
  resolve(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance;
    if (typeof idOrInstance === 'string') return this.get(idOrInstance) || null;
    return null;
  }

  /**
   * Resolves a data entry to a instance ID.
   * @param {string|Instance} idOrInstance The id or instance of something in this datastore
   * @returns {?string}
   */
  resolveID(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance.id;
    if (typeof idOrInstance === 'string') return idOrInstance;
    return null;
  }
}

module.exports = DataStore;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Long = __webpack_require__(25);

// Discord epoch (2015-01-01T00:00:00.000Z)
const EPOCH = 1420070400000;
let INCREMENT = 0;

/**
 * A container for useful snowflake-related methods.
 */
class SnowflakeUtil {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z
   * ```
   * If we have a snowflake '266241948824764416' we can represent it as binary:
   *
   * 64                                          22     17     12          0
   *  000000111011000111100001101001000101000000  00001  00000  000000000000
   *       number of ms since Discord epoch       worker  pid    increment
   * ```
   * @typedef {string} Snowflake
   */

  /**
   * Generates a Discord snowflake.
   * <info>This hardcodes the worker ID as 1 and the process ID as 0.</info>
   * @returns {Snowflake} The generated snowflake
   */
  static generate() {
    if (INCREMENT >= 4095) INCREMENT = 0;
    const BINARY = `${pad((Date.now() - EPOCH).toString(2), 42)}0000100000${pad((INCREMENT++).toString(2), 12)}`;
    return Long.fromString(BINARY, 2).toString();
  }

  /**
   * A deconstructed snowflake.
   * @typedef {Object} DeconstructedSnowflake
   * @property {number} timestamp Timestamp the snowflake was created
   * @property {Date} date Date the snowflake was created
   * @property {number} workerID Worker ID in the snowflake
   * @property {number} processID Process ID in the snowflake
   * @property {number} increment Increment in the snowflake
   * @property {string} binary Binary representation of the snowflake
   */

  /**
   * Deconstructs a Discord snowflake.
   * @param {Snowflake} snowflake Snowflake to deconstruct
   * @returns {DeconstructedSnowflake} Deconstructed snowflake
   */
  static deconstruct(snowflake) {
    const BINARY = pad(Long.fromString(snowflake).toString(2), 64);
    const res = {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY,
    };
    Object.defineProperty(res, 'date', {
      get: function get() { return new Date(this.timestamp); },
      enumerable: true,
    });
    return res;
  }
}

function pad(v, n, c = '0') {
  return String(v).length >= n ? String(v) : (String(c).repeat(n) + v).slice(-n);
}

module.exports = SnowflakeUtil;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models).
 */
class Base {
  constructor(client) {
    /**
     * The client that instantiated this
     * @name Base#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data) { return data; }

  _update(data) {
    const clone = this._clone();
    this._patch(data);
    return clone;
  }
}

module.exports = Base;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const { RangeError } = __webpack_require__(4);

/**
 * Data structure that makes it easy to interact with a permission bitfield. All {@link GuildMember}s have a set of
 * permissions in their guild, and each channel in the guild may also have {@link PermissionOverwrites} for the member
 * that override their default permissions.
 */
class Permissions {
  /**
   * @param {number|PermissionResolvable[]} permissions Permissions or bitfield to read from
   */
  constructor(permissions) {
    /**
     * Bitfield of the packed permissions
     * @type {number}
     */
    this.bitfield = typeof permissions === 'number' ? permissions : this.constructor.resolve(permissions);
  }

  /**
   * Checks whether the bitfield has a permission, or multiple permissions.
   * @param {PermissionResolvable|PermissionResolvable[]} permission Permission(s) to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {boolean}
   */
  has(permission, checkAdmin = true) {
    if (permission instanceof Array) return permission.every(p => this.has(p, checkAdmin));
    permission = this.constructor.resolve(permission);
    if (checkAdmin && (this.bitfield & this.constructor.FLAGS.ADMINISTRATOR) > 0) return true;
    return (this.bitfield & permission) === permission;
  }

  /**
   * Gets all given permissions that are missing from the bitfield.
   * @param {PermissionResolvable[]} permissions Permissions to check for
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {PermissionResolvable[]}
   */
  missing(permissions, checkAdmin = true) {
    return permissions.filter(p => !this.has(p, checkAdmin));
  }

  /**
   * Freezes the permission making it immutable.
   * @returns {Permissions} This permissions
   */
  freeze() {
    return Object.freeze(this);
  }

  /**
   * Adds permissions to this one.
   * @param {...PermissionResolvable} permissions Permissions to add
   * @returns {Permissions} This permissions or new permissions if the instance is frozen.
   */
  add(...permissions) {
    let total = 0;
    for (let p = permissions.length - 1; p >= 0; p--) {
      const perm = this.constructor.resolve(permissions[p]);
      total |= perm;
    }
    if (Object.isFrozen(this)) return new this.constructor(this.bitfield | total);
    this.bitfield |= total;
    return this;
  }

  /**
   * Removes permissions from this one.
   * @param {...PermissionResolvable} permissions Permissions to remove
   * @returns {Permissions} This permissions or new permissions if the instance is frozen.
   */
  remove(...permissions) {
    let total = 0;
    for (let p = permissions.length - 1; p >= 0; p--) {
      const perm = this.constructor.resolve(permissions[p]);
      total |= perm;
    }
    if (Object.isFrozen(this)) return new this.constructor(this.bitfield & ~total);
    this.bitfield &= ~total;
    return this;
  }

  /**
   * Gets an object mapping permission name (like `VIEW_CHANNEL`) to a {@link boolean} indicating whether the
   * permission is available.
   * @param {boolean} [checkAdmin=true] Whether to allow the administrator permission to override
   * @returns {Object}
   */
  serialize(checkAdmin = true) {
    const serialized = {};
    for (const perm in this.constructor.FLAGS) serialized[perm] = this.has(perm, checkAdmin);
    return serialized;
  }

  /**
   * Data that can be resolved to give a permission number. This can be:
   * * A string (see {@link Permissions.FLAGS})
   * * A permission number
   * * An instance of Permissions
   * @typedef {string|number|Permissions} PermissionResolvable
   */

  /**
   * Resolves permissions to their numeric form.
   * @param {PermissionResolvable|PermissionResolvable[]} permission - Permission(s) to resolve
   * @returns {number}
   */
  static resolve(permission) {
    if (typeof permission === 'number' && permission >= 0) return permission;
    if (permission instanceof Permissions) return permission.bitfield;
    if (permission instanceof Array) return permission.map(p => this.resolve(p)).reduce((prev, p) => prev | p, 0);
    if (typeof permission === 'string') return this.FLAGS[permission];
    throw new RangeError('PERMISSIONS_INVALID');
  }
}

/**
 * Numeric permission flags. All available properties:
 * * `ADMINISTRATOR` (implicitly has *all* permissions, and bypasses all channel overwrites)
 * * `CREATE_INSTANT_INVITE` (create invitations to the guild)
 * * `KICK_MEMBERS`
 * * `BAN_MEMBERS`
 * * `MANAGE_CHANNELS` (edit and reorder channels)
 * * `MANAGE_GUILD` (edit the guild information, region, etc.)
 * * `ADD_REACTIONS` (add new reactions to messages)
 * * `VIEW_AUDIT_LOG`
 * * `VIEW_CHANNEL`
 * * `SEND_MESSAGES`
 * * `SEND_TTS_MESSAGES`
 * * `MANAGE_MESSAGES` (delete messages and reactions)
 * * `EMBED_LINKS` (links posted will have a preview embedded)
 * * `ATTACH_FILES`
 * * `READ_MESSAGE_HISTORY` (view messages that were posted prior to opening Discord)
 * * `MENTION_EVERYONE`
 * * `USE_EXTERNAL_EMOJIS` (use emojis from different guilds)
 * * `CONNECT` (connect to a voice channel)
 * * `SPEAK` (speak in a voice channel)
 * * `MUTE_MEMBERS` (mute members across all voice channels)
 * * `DEAFEN_MEMBERS` (deafen members across all voice channels)
 * * `MOVE_MEMBERS` (move members between voice channels)
 * * `USE_VAD` (use voice activity detection)
 * * `CHANGE_NICKNAME`
 * * `MANAGE_NICKNAMES` (change other members' nicknames)
 * * `MANAGE_ROLES`
 * * `MANAGE_WEBHOOKS`
 * * `MANAGE_EMOJIS`
 * @type {Object}
 * @see {@link https://discordapp.com/developers/docs/topics/permissions}
 */
Permissions.FLAGS = {
  CREATE_INSTANT_INVITE: 1 << 0,
  KICK_MEMBERS: 1 << 1,
  BAN_MEMBERS: 1 << 2,
  ADMINISTRATOR: 1 << 3,
  MANAGE_CHANNELS: 1 << 4,
  MANAGE_GUILD: 1 << 5,
  ADD_REACTIONS: 1 << 6,
  VIEW_AUDIT_LOG: 1 << 7,

  VIEW_CHANNEL: 1 << 10,
  SEND_MESSAGES: 1 << 11,
  SEND_TTS_MESSAGES: 1 << 12,
  MANAGE_MESSAGES: 1 << 13,
  EMBED_LINKS: 1 << 14,
  ATTACH_FILES: 1 << 15,
  READ_MESSAGE_HISTORY: 1 << 16,
  MENTION_EVERYONE: 1 << 17,
  USE_EXTERNAL_EMOJIS: 1 << 18,

  CONNECT: 1 << 20,
  SPEAK: 1 << 21,
  MUTE_MEMBERS: 1 << 22,
  DEAFEN_MEMBERS: 1 << 23,
  MOVE_MEMBERS: 1 << 24,
  USE_VAD: 1 << 25,

  CHANGE_NICKNAME: 1 << 26,
  MANAGE_NICKNAMES: 1 << 27,
  MANAGE_ROLES: 1 << 28,
  MANAGE_WEBHOOKS: 1 << 29,
  MANAGE_EMOJIS: 1 << 30,
};

/**
 * Bitfield representing every permission combined
 * @type {number}
 */
Permissions.ALL = Object.values(Permissions.FLAGS).reduce((all, p) => all | p, 0);

/**
 * Bitfield representing the default permissions for users
 * @type {number}
 */
Permissions.DEFAULT = 104324097;

module.exports = Permissions;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(32);
const fs = __webpack_require__(32);
const snekfetch = __webpack_require__(26);
const Util = __webpack_require__(5);
const { Error, TypeError } = __webpack_require__(4);
const { browser } = __webpack_require__(0);

/**
 * The DataResolver identifies different objects and tries to resolve a specific piece of information from them.
 * @private
 */
class DataResolver {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Data that can be resolved to give an invite code. This can be:
   * * An invite code
   * * An invite URL
   * @typedef {string} InviteResolvable
   */

  /**
   * Resolves InviteResolvable to an invite code.
   * @param {InviteResolvable} data The invite resolvable to resolve
   * @returns {string}
   */
  static resolveInviteCode(data) {
    const inviteRegex = /discord(?:app\.com\/invite|\.gg)\/([\w-]{2,255})/i;
    const match = inviteRegex.exec(data);
    if (match && match[1]) return match[1];
    return data;
  }

  /**
   * Resolves a Base64Resolvable, a string, or a BufferResolvable to a Base 64 image.
   * @param {BufferResolvable|Base64Resolvable} image The image to be resolved
   * @returns {Promise<?string>}
   */
  static async resolveImage(image) {
    if (!image) return null;
    if (typeof image === 'string' && image.startsWith('data:')) {
      return image;
    }
    const file = await this.resolveFile(image);
    return DataResolver.resolveBase64(file);
  }

  /**
   * Data that resolves to give a Base64 string, typically for image uploading. This can be:
   * * A Buffer
   * * A base64 string
   * @typedef {Buffer|string} Base64Resolvable
   */

  /**
   * Resolves a Base64Resolvable to a Base 64 image.
   * @param {Base64Resolvable} data The base 64 resolvable you want to resolve
   * @returns {?string}
   */
  static resolveBase64(data) {
    if (data instanceof Buffer) return `data:image/jpg;base64,${data.toString('base64')}`;
    return data;
  }

  /**
   * Data that can be resolved to give a Buffer. This can be:
   * * A Buffer
   * * The path to a local file
   * * A URL
   * @typedef {string|Buffer} BufferResolvable
   */

  /**
   * @external Stream
   * @see {@link https://nodejs.org/api/stream.html}
   */

  /**
   * Resolves a BufferResolvable to a Buffer.
   * @param {BufferResolvable|Stream} resource The buffer or stream resolvable to resolve
   * @returns {Promise<Buffer>}
   */
  static resolveFile(resource) {
    if (resource instanceof Buffer) return Promise.resolve(resource);
    if (browser && resource instanceof ArrayBuffer) return Promise.resolve(Util.convertToBuffer(resource));

    if (typeof resource === 'string') {
      return new Promise((resolve, reject) => {
        if (/^https?:\/\//.test(resource)) {
          snekfetch.get(resource)
            .end((err, res) => {
              if (err) return reject(err);
              if (!(res.body instanceof Buffer)) return reject(new TypeError('REQ_BODY_TYPE'));
              return resolve(res.body);
            });
        } else {
          const file = browser ? resource : path.resolve(resource);
          fs.stat(file, (err, stats) => {
            if (err) return reject(err);
            if (!stats || !stats.isFile()) return reject(new Error('FILE_NOT_FOUND', file));
            fs.readFile(file, (err2, data) => {
              if (err2) reject(err2); else resolve(data);
            });
            return null;
          });
        }
      });
    } else if (resource.pipe && typeof resource.pipe === 'function') {
      return new Promise((resolve, reject) => {
        const buffers = [];
        resource.once('error', reject);
        resource.on('data', data => buffers.push(data));
        resource.once('end', () => resolve(Buffer.concat(buffers)));
      });
    }

    return Promise.reject(new TypeError('REQ_RESOURCE_TYPE'));
  }
}

module.exports = DataResolver;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(7);
const Base = __webpack_require__(8);
const { ChannelTypes } = __webpack_require__(0);

/**
 * Represents any channel on Discord.
 * @extends {Base}
 */
class Channel extends Base {
  constructor(client, data) {
    super(client);

    const type = Object.keys(ChannelTypes)[data.type];
    /**
     * The type of the channel, either:
     * * `dm` - a DM channel
     * * `group` - a Group DM channel
     * * `text` - a guild text channel
     * * `voice` - a guild voice channel
     * * `category` - a guild category channel
     * * `unknown` - a generic channel of unknown type, could be Channel or GuildChannel
     * @type {string}
     */
    this.type = type ? type.toLowerCase() : 'unknown';

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The unique ID of the channel
     * @type {Snowflake}
     */
    this.id = data.id;
  }

  /**
   * The timestamp the channel was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the channel was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Deletes this channel.
   * @returns {Promise<Channel>}
   * @example
   * // Delete the channel
   * channel.delete()
   *   .then() // Success
   *   .catch(console.error); // Log error
   */
  delete() {
    return this.client.api.channels(this.id).delete().then(() => this);
  }

  static create(client, data, guild) {
    const DMChannel = __webpack_require__(42);
    const GroupDMChannel = __webpack_require__(46);
    const TextChannel = __webpack_require__(47);
    const VoiceChannel = __webpack_require__(49);
    const CategoryChannel = __webpack_require__(82);
    const GuildChannel = __webpack_require__(15);
    let channel;
    if (data.type === ChannelTypes.DM) {
      channel = new DMChannel(client, data);
    } else if (data.type === ChannelTypes.GROUP) {
      channel = new GroupDMChannel(client, data);
    } else {
      guild = guild || client.guilds.get(data.guild_id);
      if (guild) {
        switch (data.type) {
          case ChannelTypes.TEXT:
            channel = new TextChannel(guild, data);
            break;
          case ChannelTypes.VOICE:
            channel = new VoiceChannel(guild, data);
            break;
          case ChannelTypes.CATEGORY:
            channel = new CategoryChannel(guild, data);
            break;
          default:
            channel = new GuildChannel(guild, data);
        }
        guild.channels.set(channel.id, channel);
      }
    }
    return channel;
  }
}

module.exports = Channel;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const TextBasedChannel = __webpack_require__(17);
const Role = __webpack_require__(22);
const Permissions = __webpack_require__(9);
const Collection = __webpack_require__(3);
const Base = __webpack_require__(8);
const { Presence } = __webpack_require__(13);
const { Error, TypeError } = __webpack_require__(4);

/**
 * Represents a member of a guild on Discord.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class GuildMember extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild that this member is part of
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The user that this guild member instance Represents
     * @type {User}
     */
    this.user = {};

    this._roles = [];

    if (data) this._patch(data);

    /**
     * The ID of the last message sent by the member in their guild, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message sent by the member in their guild, if one was sent
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  _patch(data) {
    /**
     * Whether this member is speaking
     * @type {boolean}
     * @name GuildMember#speaking
     */
    if (typeof this.speaking === 'undefined') this.speaking = false;

    /**
     * The nickname of this guild member, if they have one
     * @type {?string}
     * @name GuildMember#nickname
     */
    if (typeof data.nick !== 'undefined') this.nickname = data.nick;

    /**
     * The timestamp the member joined the guild at
     * @type {number}
     * @name GuildMember#joinedTimestamp
     */
    if (typeof data.joined_at !== 'undefined') this.joinedTimestamp = new Date(data.joined_at).getTime();

    this.user = this.guild.client.users.create(data.user);
    if (data.roles) this._roles = data.roles;
  }

  get voiceState() {
    return this._frozenVoiceState || this.guild.voiceStates.get(this.id) || {};
  }

  /**
   * Whether this member is deafened server-wide
   * @type {boolean}
   */
  get serverDeaf() { return this.voiceState.deaf; }

  /**
   * Whether this member is muted server-wide
   * @type {boolean}
   */
  get serverMute() { return this.voiceState.mute; }

  /**
   * Whether this member is self-muted
   * @type {boolean}
   */
  get selfMute() { return this.voiceState.self_mute; }

  /**
   * Whether this member is self-deafened
   * @type {boolean}
   */
  get selfDeaf() { return this.voiceState.self_deaf; }

  /**
   * The voice session ID of this member (if any)
   * @type {?Snowflake}
   */
  get voiceSessionID() { return this.voiceState.session_id; }

  /**
   * The voice channel ID of this member, (if any)
   * @type {?Snowflake}
   */
  get voiceChannelID() { return this.voiceState.channel_id; }

  /**
   * The time the member joined the guild
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * The presence of this guild member
   * @type {Presence}
   * @readonly
   */
  get presence() {
    return this.frozenPresence || this.guild.presences.get(this.id) || new Presence();
  }

  /**
   * A list of roles that are applied to this GuildMember, mapped by the role ID
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get roles() {
    const list = new Collection();
    const everyoneRole = this.guild.roles.get(this.guild.id);

    if (everyoneRole) list.set(everyoneRole.id, everyoneRole);

    for (const roleID of this._roles) {
      const role = this.guild.roles.get(roleID);
      if (role) list.set(role.id, role);
    }

    return list;
  }

  /**
   * The role of the member with the highest position
   * @type {Role}
   * @readonly
   */
  get highestRole() {
    return this.roles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member used to set their color
   * @type {?Role}
   * @readonly
   */
  get colorRole() {
    const coloredRoles = this.roles.filter(role => role.color);
    if (!coloredRoles.size) return null;
    return coloredRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The displayed color of the member in base 10
   * @type {number}
   * @readonly
   */
  get displayColor() {
    const role = this.colorRole;
    return (role && role.color) || 0;
  }

  /**
   * The displayed color of the member in hexadecimal
   * @type {string}
   * @readonly
   */
  get displayHexColor() {
    const role = this.colorRole;
    return (role && role.hexColor) || '#000000';
  }

  /**
   * The role of the member used to hoist them in a separate category in the users list
   * @type {?Role}
   * @readonly
   */
  get hoistRole() {
    const hoistedRoles = this.roles.filter(role => role.hoist);
    if (!hoistedRoles.size) return null;
    return hoistedRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * Whether this member is muted in any way
   * @type {boolean}
   * @readonly
   */
  get mute() {
    return this.selfMute || this.serverMute;
  }

  /**
   * Whether this member is deafened in any way
   * @type {boolean}
   * @readonly
   */
  get deaf() {
    return this.selfDeaf || this.serverDeaf;
  }

  /**
   * The voice channel this member is in, if any
   * @type {?VoiceChannel}
   * @readonly
   */
  get voiceChannel() {
    return this.guild.channels.get(this.voiceChannelID);
  }

  /**
   * The ID of this user
   * @type {Snowflake}
   * @readonly
   */
  get id() {
    return this.user.id;
  }

  /**
   * The nickname of the member, or their username if they don't have one
   * @type {string}
   * @readonly
   */
  get displayName() {
    return this.nickname || this.user.username;
  }

  /**
   * The overall set of permissions for the guild member, taking only roles into account
   * @type {Permissions}
   * @readonly
   */
  get permissions() {
    if (this.user.id === this.guild.ownerID) return new Permissions(Permissions.ALL).freeze();
    return new Permissions(this.roles.map(role => role.permissions)).freeze();
  }

  /**
   * Whether the member is kickable by the client user
   * @type {boolean}
   * @readonly
   */
  get kickable() {
    if (this.user.id === this.guild.ownerID) return false;
    if (this.user.id === this.client.user.id) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return false;
    return clientMember.highestRole.comparePositionTo(this.highestRole) > 0;
  }

  /**
   * Whether the member is bannable by the client user
   * @type {boolean}
   * @readonly
   */
  get bannable() {
    if (this.user.id === this.guild.ownerID) return false;
    if (this.user.id === this.client.user.id) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return false;
    return clientMember.highestRole.comparePositionTo(this.highestRole) > 0;
  }

  /**
   * Returns `channel.permissionsFor(guildMember)`. Returns permissions for a member in a guild channel,
   * taking into account roles and permission overwrites.
   * @param {ChannelResolvable} channel The guild channel to use as context
   * @returns {?Permissions}
   */
  permissionsIn(channel) {
    channel = this.client.channels.resolve(channel);
    if (!channel || !channel.guild) throw new Error('GUILD_CHANNEL_RESOLVE');
    return channel.permissionsFor(this);
  }

  /**
   * Checks if any of the member's roles have a permission.
   * @param {PermissionResolvable|PermissionResolvable[]} permission Permission(s) to check for
   * @param {boolean} [explicit=false] Whether to require the role to explicitly have the exact permission
   * **(deprecated)**
   * @param {boolean} [checkAdmin] Whether to allow the administrator permission to override
   * (takes priority over `explicit`)
   * @param {boolean} [checkOwner] Whether to allow being the guild's owner to override
   * (takes priority over `explicit`)
   * @returns {boolean}
   */
  hasPermission(permission, explicit = false, checkAdmin, checkOwner) {
    if (typeof checkAdmin === 'undefined') checkAdmin = !explicit;
    if (typeof checkOwner === 'undefined') checkOwner = !explicit;
    if (checkOwner && this.user.id === this.guild.ownerID) return true;
    return this.roles.some(r => r.permissions.has(permission, undefined, checkAdmin));
  }

  /**
   * Checks whether the roles of the member allows them to perform specific actions, and lists any missing permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the member to explicitly have the exact permissions
   * @returns {PermissionResolvable[]}
   */
  missingPermissions(permissions, explicit = false) {
    return this.permissions.missing(permissions, explicit);
  }

  /**
   * The data for editing a guild member.
   * @typedef {Object} GuildMemberEditData
   * @property {string} [nick] The nickname to set for the member
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles or role IDs to apply
   * @property {boolean} [mute] Whether or not the member should be muted
   * @property {boolean} [deaf] Whether or not the member should be deafened
   * @property {ChannelResolvable} [channel] Channel to move member to (if they are connected to voice)
   */

  /**
   * Edit a guild member.
   * @param {GuildMemberEditData} data The data to edit the member with
   * @param {string} [reason] Reason for editing this user
   * @returns {Promise<GuildMember>}
   */
  edit(data, reason) {
    if (data.channel) {
      data.channel_id = this.client.channels.resolve(data.channel).id;
      data.channel = null;
    }
    if (data.roles) data.roles = data.roles.map(role => role instanceof Role ? role.id : role);
    let endpoint = this.client.api.guilds(this.guild.id);
    if (this.user.id === this.client.user.id) {
      const keys = Object.keys(data);
      if (keys.length === 1 && keys[0] === 'nick') endpoint = endpoint.members('@me').nick;
      else endpoint = endpoint.members(this.id);
    } else {
      endpoint = endpoint.members(this.id);
    }
    return endpoint.patch({ data, reason }).then(() => {
      const clone = this._clone();
      data.user = this.user;
      clone._patch(data);
      clone._frozenVoiceState = this.voiceState;
      if (typeof data.mute !== 'undefined') clone._frozenVoiceState.mute = data.mute;
      if (typeof data.deaf !== 'undefined') clone._frozenVoiceState.mute = data.deaf;
      if (typeof data.channel_id !== 'undefined') clone._frozenVoiceState.channel_id = data.channel_id;
      return clone;
    });
  }

  /**
   * Mute/unmute a user.
   * @param {boolean} mute Whether or not the member should be muted
   * @param {string} [reason] Reason for muting or unmuting
   * @returns {Promise<GuildMember>}
   */
  setMute(mute, reason) {
    return this.edit({ mute }, reason);
  }

  /**
   * Deafen/undeafen a user.
   * @param {boolean} deaf Whether or not the member should be deafened
   * @param {string} [reason] Reason for deafening or undeafening
   * @returns {Promise<GuildMember>}
   */
  setDeaf(deaf, reason) {
    return this.edit({ deaf }, reason);
  }

  /**
   * Moves the guild member to the given channel.
   * @param {ChannelResolvable} channel The channel to move the member to
   * @returns {Promise<GuildMember>}
   */
  setVoiceChannel(channel) {
    return this.edit({ channel });
  }

  /**
   * Sets the roles applied to the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to apply
   * @param {string} [reason] Reason for applying the roles
   * @returns {Promise<GuildMember>}
   */
  setRoles(roles, reason) {
    return this.edit({ roles }, reason);
  }

  /**
   * Adds a single role to the member.
   * @param {RoleResolvable} role The role or ID of the role to add
   * @param {string} [reason] Reason for adding the role
   * @returns {Promise<GuildMember>}
   */
  addRole(role, reason) {
    role = this.guild.roles.resolve(role);
    if (!role) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
    if (this._roles.includes(role.id)) return Promise.resolve(this);
    return this.client.api.guilds(this.guild.id).members(this.user.id).roles(role.id)
      .put({ reason })
      .then(() => {
        const clone = this._clone();
        if (!clone._roles.includes(role.id)) clone._roles.push(role.id);
        return clone;
      });
  }

  /**
   * Adds multiple roles to the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to add
   * @param {string} [reason] Reason for adding the roles
   * @returns {Promise<GuildMember>}
   */
  addRoles(roles, reason) {
    let allRoles = this._roles.slice();
    for (let role of roles instanceof Collection ? roles.values() : roles) {
      role = this.guild.roles.resolve(role);
      if (!role) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      allRoles.push(role.id);
    }
    return this.edit({ roles: allRoles }, reason);
  }

  /**
   * Removes a single role from the member.
   * @param {RoleResolvable} role The role or ID of the role to remove
   * @param {string} [reason] Reason for removing the role
   * @returns {Promise<GuildMember>}
   */
  removeRole(role, reason) {
    role = this.guild.roles.resolve(role);
    if (!role) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
    if (!this._roles.includes(role.id)) return Promise.resolve(this);
    return this.client.api.guilds(this.guild.id).members(this.user.id).roles(role.id)
      .delete({ reason })
      .then(() => {
        const clone = this._clone();
        const index = clone._roles.indexOf(role.id);
        if (~index) clone._roles.splice(index, 1);
        return clone;
      });
  }

  /**
   * Removes multiple roles from the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to remove
   * @param {string} [reason] Reason for removing the roles
   * @returns {Promise<GuildMember>}
   */
  removeRoles(roles, reason) {
    const allRoles = this._roles.slice();
    for (let role of roles instanceof Collection ? roles.values() : roles) {
      role = this.guild.roles.resolve(role);
      if (!role) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      const index = allRoles.indexOf(role.id);
      if (index >= 0) allRoles.splice(index, 1);
    }
    return this.edit({ roles: allRoles }, reason);
  }

  /**
   * Set the nickname for the guild member.
   * @param {string} nick The nickname for the guild member
   * @param {string} [reason] Reason for setting the nickname
   * @returns {Promise<GuildMember>}
   */
  setNickname(nick, reason) {
    return this.edit({ nick }, reason);
  }

  /**
   * Creates a DM channel between the client and the member.
   * @returns {Promise<DMChannel>}
   */
  createDM() {
    return this.user.createDM();
  }

  /**
   * Deletes any DMs with this guild member.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.user.deleteDM();
  }

  /**
   * Kick this member from the guild.
   * @param {string} [reason] Reason for kicking user
   * @returns {Promise<GuildMember>}
   */
  kick(reason) {
    return this.client.api.guilds(this.guild.id).members(this.user.id).delete({ reason })
      .then(() =>
        this.client.actions.GuildMemberRemove.handle({
          guild_id: this.guild.id,
          user: this.user,
        }).member
      );
  }

  /**
   * Ban this guild member.
   * @param {Object|number|string} [options] Ban options. If a number, the number of days to delete messages for, if a
   * string, the ban reason. Supplying an object allows you to do both.
   * @param {number} [options.days=0] Number of days of messages to delete
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<GuildMember>}
   * @example
   * // ban a guild member
   * guildMember.ban(7);
   */
  ban(options) {
    return this.guild.ban(this, options);
  }

  /**
   * When concatenated with a string, this automatically concatenates the user's mention instead of the Member object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789>!
   * console.log(`Hello from ${member}!`);
   */
  toString() {
    return `<@${this.nickname ? '!' : ''}${this.user.id}>`;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
}

TextBasedChannel.applyToClass(GuildMember);

module.exports = GuildMember;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const { ActivityTypes } = __webpack_require__(0);

/**
 * Represents a user's presence.
 */
class Presence {
  constructor(client, data = {}) {
    Object.defineProperty(this, 'client', { value: client });
    this.patch(data);
  }

  patch(data) {
    /**
     * The status of the presence:
     *
     * * **`online`** - user is online
     * * **`offline`** - user is offline or invisible
     * * **`idle`** - user is AFK
     * * **`dnd`** - user is in Do Not Disturb
     * @type {string}
     */
    this.status = data.status || this.status;

    const activity = data.game || data.activity;
    /**
     * The activity of the presence
     * @type {?Activity}
     */
    this.activity = activity ? new Activity(this, activity) : null;

    return this;
  }

  _clone() {
    const clone = Object.assign(Object.create(this), this);
    if (this.activity) clone.activity = this.activity._clone();
    return clone;
  }

  /**
   * Whether this presence is equal to another
   * @param {Presence} presence The presence to compare with
   * @returns {boolean}
   */
  equals(presence) {
    return this === presence || (
      presence &&
      this.status === presence.status &&
      this.activity ? this.activity.equals(presence.activity) : !presence.activity
    );
  }
}

/**
 * Represents an activity that is part of a user's presence.
 */
class Activity {
  constructor(presence, data) {
    Object.defineProperty(this, 'presence', { value: presence });

    /**
     * The name of the activity being played
     * @type {string}
     */
    this.name = data.name;

    /**
     * The type of the activity status
     * @type {ActivityType}
     */
    this.type = ActivityTypes[data.type];

    /**
     * If the activity is being streamed, a link to the stream
     * @type {?string}
     */
    this.url = data.url || null;

    /**
     * Details about the activity
     * @type {?string}
     */
    this.details = data.details || null;

    /**
     * State of the activity
     * @type {?string}
     */
    this.state = data.state || null;

    /**
     * Application ID associated with this activity
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id || null;

    /**
     * Timestamps for the activity
     * @type {?Object}
     * @prop {?Date} start When the activity started
     * @prop {?Date} end When the activity will end
     */
    this.timestamps = data.timestamps ? {
      start: data.timestamps.start ? new Date(data.timestamps.start) : null,
      end: data.timestamps.end ? new Date(data.timestamps.end) : null,
    } : null;

    /**
     * Party of the activity
     * @type {?Object}
     * @prop {?string} id ID of the party
     * @prop {number[]} size Size of the party as `[current, max]`
     */
    this.party = data.party || null;

    /**
     * Assets for rich presence
     * @type {?RichPresenceAssets}
     */
    this.assets = data.assets ? new RichPresenceAssets(this, data.assets) : null;
  }

  /**
   * Whether this activity is equal to another activity.
   * @param {Activity} activity The activity to compare with
   * @returns {boolean}
   */
  equals(activity) {
    return this === activity || (
      activity &&
      this.name === activity.name &&
      this.type === activity.type &&
      this.url === activity.url
    );
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }
}

/**
 * Assets for a rich presence
 */
class RichPresenceAssets {
  constructor(activity, assets) {
    Object.defineProperty(this, 'activity', { value: activity });

    /**
     * Hover text for large image
     * @type {?string}
     */
    this.largeText = assets.large_text || null;

    /**
     * Hover text for small image
     * @type {?string}
     */
    this.smallText = assets.small_text || null;

    /**
     * ID of large image asset
     * @type {?string}
     */
    this.largeImage = assets.large_image || null;

    /**
     * ID of small image asset
     * @type {?string}
     */
    this.smallImage = assets.small_image || null;
  }

  /**
   * @param  {string} format Format of the image
   * @param  {number} size Size of the iamge
   * @returns {?string} small image url
   */
  smallImageURL({ format, size } = {}) {
    if (!this.smallImage) return null;
    return this.activity.presence.client.rest.cdn
      .AppAsset(this.activity.applicationID, this.smallImage, { format, size });
  }

  /**
   * @param  {string} format Format of the image
   * @param  {number} size Size of the iamge
   * @returns {?string} large image url
   */
  largeImageURL({ format, size } = {}) {
    if (!this.largeImage) return null;
    return this.activity.presence.client.rest.cdn
      .AppAsset(this.activity.applicationID, this.largeImage, { format, size });
  }
}

exports.Presence = Presence;
exports.Activity = Activity;
exports.RichPresenceAssets = RichPresenceAssets;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const MessageAttachment = __webpack_require__(18);
const Util = __webpack_require__(5);
const { RangeError } = __webpack_require__(4);

/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 */
class MessageEmbed {
  constructor(data = {}) {
    this.setup(data);
  }

  setup(data) { // eslint-disable-line complexity
    /**
     * The type of this embed
     * @type {string}
     */
    this.type = data.type;

    /**
     * The title of this embed
     * @type {?string}
     */
    this.title = data.title;

    /**
     * The description of this embed
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The URL of this embed
     * @type {?string}
     */
    this.url = data.url;

    /**
     * The color of the embed
     * @type {?number}
     */
    this.color = data.color;

    /**
     * The timestamp of this embed
     * @type {?number}
     */
    this.timestamp = data.timestamp ? new Date(data.timestamp).getTime() : null;

    /**
     * The fields of this embed
     * @type {Object[]}
     * @property {string} name The name of this field
     * @property {string} value The value of this field
     * @property {boolean} inline If this field will be displayed inline
     */
    this.fields = data.fields ? data.fields.map(Util.cloneObject) : [];

    /**
     * The thumbnail of this embed (if there is one)
     * @type {?Object}
     * @property {string} url URL for this thumbnail
     * @property {string} proxyURL ProxyURL for this thumbnail
     * @property {number} height Height of this thumbnail
     * @property {number} width Width of this thumbnail
     */
    this.thumbnail = data.thumbnail ? {
      url: data.thumbnail.url,
      proxyURL: data.thumbnail.proxy_url,
      height: data.height,
      width: data.width,
    } : null;

    /**
     * The image of this embed, if there is one
     * @type {?Object}
     * @property {string} url URL for this image
     * @property {string} proxyURL ProxyURL for this image
     * @property {number} height Height of this image
     * @property {number} width Width of this image
     */
    this.image = data.image ? {
      url: data.image.url,
      proxyURL: data.image.proxy_url,
      height: data.height,
      width: data.width,
    } : null;

    /**
     * The video of this embed (if there is one)
     * @type {?Object}
     * @property {string} url URL of this video
     * @property {number} height Height of this video
     * @property {number} width Width of this video
     * @readonly
     */
    this.video = data.video;

    /**
     * The author of this embed (if there is one)
     * @type {?Object}
     * @property {string} name The name of this author
     * @property {string} url URL of this author
     * @property {string} iconURL URL of the icon for this author
     * @property {string} proxyIconURL Proxied URL of the icon for this author
     */
    this.author = data.author ? {
      name: data.author.name,
      url: data.author.url,
      iconURL: data.author.iconURL || data.author.icon_url,
      proxyIconURL: data.author.proxyIconUrl || data.author.proxy_icon_url,
    } : null;

    /**
     * The provider of this embed (if there is one)
     * @type {?Object}
     * @property {string} name The name of this provider
     * @property {string} url URL of this provider
     */
    this.provider = data.provider;

    /**
     * The footer of this embed
     * @type {?Object}
     * @property {string} text The text of this footer
     * @property {string} iconURL URL of the icon for this footer
     * @property {string} proxyIconURL Proxied URL of the icon for this footer
     */
    this.footer = data.footer ? {
      text: data.footer.text,
      iconURL: data.footer.iconURL || data.footer.icon_url,
      proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
    } : null;

    /**
     * The files of this embed
     * @type {?Object}
     * @property {Array<FileOptions|string|MessageAttachment>} files Files to attach
     */
    if (data.files) {
      this.files = data.files.map(file => {
        if (file instanceof MessageAttachment) {
          return typeof file.file === 'string' ? file.file : Util.cloneObject(file.file);
        }
        return file;
      });
    }
  }

  /**
   * The date this embed was created
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.timestamp ? new Date(this.timestamp) : null;
  }

  /**
   * The hexadecimal version of the embed color, with a leading hash
   * @type {string}
   * @readonly
   */
  get hexColor() {
    return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
  }

  /**
   * Adds a field to the embed (max 25).
   * @param {StringResolvable} name The name of the field
   * @param {StringResolvable} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {MessageEmbed}
   */
  addField(name, value, inline = false) {
    if (this.fields.length >= 25) throw new RangeError('EMBED_FIELD_COUNT');
    name = Util.resolveString(name);
    if (!String(name) || name.length > 256) throw new RangeError('EMBED_FIELD_NAME');
    value = Util.resolveString(value);
    if (!String(value) || value.length > 1024) throw new RangeError('EMBED_FIELD_VALUE');
    this.fields.push({ name, value, inline });
    return this;
  }

  /**
   * Convenience function for `<MessageEmbed>.addField('\u200B', '\u200B', inline)`.
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {MessageEmbed}
   */
  addBlankField(inline = false) {
    return this.addField('\u200B', '\u200B', inline);
  }

  /**
   * Sets the file to upload alongside the embed. This file can be accessed via `attachment://fileName.extension` when
   * setting an embed image or author/footer icons. Only one file may be attached.
   * @param {Array<FileOptions|string|MessageAttachment>} files Files to attach
   * @returns {MessageEmbed}
   */
  attachFiles(files) {
    if (this.files) this.files = this.files.concat(files);
    else this.files = files;
    for (let file of files) {
      if (file instanceof MessageAttachment) file = file.file;
    }
    return this;
  }

  /**
   * Sets the author of this embed.
   * @param {StringResolvable} name The name of the author
   * @param {string} [iconURL] The icon URL of the author
   * @param {string} [url] The URL of the author
   * @returns {MessageEmbed}
   */
  setAuthor(name, iconURL, url) {
    this.author = { name: Util.resolveString(name), iconURL, url };
    return this;
  }

  /**
   * Sets the color of this embed.
   * @param {ColorResolvable} color The color of the embed
   * @returns {MessageEmbed}
   */
  setColor(color) {
    this.color = Util.resolveColor(color);
    return this;
  }

  /**
   * Sets the description of this embed.
   * @param {StringResolvable} description The description
   * @returns {MessageEmbed}
   */
  setDescription(description) {
    description = Util.resolveString(description);
    if (description.length > 2048) throw new RangeError('EMBED_DESCRIPTION');
    this.description = description;
    return this;
  }

  /**
   * Sets the footer of this embed.
   * @param {StringResolvable} text The text of the footer
   * @param {string} [iconURL] The icon URL of the footer
   * @returns {MessageEmbed}
   */
  setFooter(text, iconURL) {
    text = Util.resolveString(text);
    if (text.length > 2048) throw new RangeError('EMBED_FOOTER_TEXT');
    this.footer = { text, iconURL };
    return this;
  }

  /**
   * Set the image of this embed.
   * @param {string} url The URL of the image
   * @returns {MessageEmbed}
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Set the thumbnail of this embed.
   * @param {string} url The URL of the thumbnail
   * @returns {MessageEmbed}
   */
  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  /**
   * Sets the timestamp of this embed.
   * @param {Date} [timestamp=current date] The timestamp
   * @returns {MessageEmbed}
   */
  setTimestamp(timestamp = new Date()) {
    this.timestamp = timestamp.getTime();
    return this;
  }

  /**
   * Sets the title of this embed.
   * @param {StringResolvable} title The title
   * @returns {MessageEmbed}
   */
  setTitle(title) {
    title = Util.resolveString(title);
    if (title.length > 256) throw new RangeError('EMBED_TITLE');
    this.title = title;
    return this;
  }

  /**
   * Sets the URL of this embed.
   * @param {string} url The URL
   * @returns {MessageEmbed}
   */
  setURL(url) {
    this.url = url;
    return this;
  }

  /**
   * Transforms the embed object to be processed.
   * @returns {Object} The raw data of this embed
   * @private
   */
  _apiTransform() {
    return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp ? new Date(this.timestamp) : null,
      color: this.color,
      fields: this.fields,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author ? {
        name: this.author.name,
        url: this.author.url,
        icon_url: this.author.iconURL,
      } : null,
      footer: this.footer ? {
        text: this.footer.text,
        icon_url: this.footer.iconURL,
      } : null,
    };
  }
}

module.exports = MessageEmbed;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(11);
const Role = __webpack_require__(22);
const Invite = __webpack_require__(23);
const PermissionOverwrites = __webpack_require__(48);
const Util = __webpack_require__(5);
const Permissions = __webpack_require__(9);
const Collection = __webpack_require__(3);
const { MessageNotificationTypes } = __webpack_require__(0);
const { Error, TypeError } = __webpack_require__(4);

/**
 * Represents a guild channel (e.g. text channels and voice channels).
 * @extends {Channel}
 */
class GuildChannel extends Channel {
  constructor(guild, data) {
    super(guild.client, data);

    /**
     * The guild the channel is in
     * @type {Guild}
     */
    this.guild = guild;
  }

  _patch(data) {
    super._patch(data);

    /**
     * The name of the guild channel
     * @type {string}
     */
    this.name = data.name;

    /**
     * The raw position of the channel from discord
     * @type {number}
     */
    this.rawPosition = data.position;

    /**
     * The ID of the category parent of this channel
     * @type {?Snowflake}
     */
    this.parentID = data.parent_id;

    /**
     * A map of permission overwrites in this channel for roles and users
     * @type {Collection<Snowflake, PermissionOverwrites>}
     */
    this.permissionOverwrites = new Collection();
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) {
        this.permissionOverwrites.set(overwrite.id, new PermissionOverwrites(this, overwrite));
      }
    }
  }

  /**
   * The category parent of this channel
   * @type {?CategoryChannel}
   * @readonly
   */
  get parent() {
    return this.guild.channels.get(this.parentID);
  }

  /**
   * If the permissionOverwrites match the parent channel, null if no parent
   * @type {?boolean}
   * @readonly
   */
  get permissionsLocked() {
    if (!this.parent) return null;
    if (this.permissionOverwrites.size !== this.parent.permissionOverwrites.size) return false;
    return !this.permissionOverwrites.find((value, key) => {
      const testVal = this.parent.permissionOverwrites.get(key);
      return testVal === undefined ||
        testVal.denied.bitfield !== value.denied.bitfield ||
        testVal.allowed.bitfield !== value.allowed.bitfield;
    });
  }

  /**
   * The position of the channel
   * @type {number}
   * @readonly
   */
  get position() {
    const sorted = this.guild._sortedChannels(this);
    return sorted.array().indexOf(sorted.get(this.id));
  }

  /**
   * Gets the overall set of permissions for a user in this channel, taking into account roles and permission
   * overwrites.
   * @param {GuildMemberResolvable} member The user that you want to obtain the overall permissions for
   * @returns {?Permissions}
   */
  permissionsFor(member) {
    member = this.guild.members.resolve(member);
    if (!member) return null;
    if (member.id === this.guild.ownerID) return new Permissions(Permissions.ALL).freeze();

    const roles = member.roles;
    const permissions = new Permissions(roles.map(role => role.permissions));

    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return new Permissions(Permissions.ALL).freeze();

    const overwrites = this.overwritesFor(member, true, roles);

    return permissions
      .remove(overwrites.everyone ? overwrites.everyone.denied : 0)
      .add(overwrites.everyone ? overwrites.everyone.allowed : 0)
      .remove(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.denied) : 0)
      .add(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.allowed) : 0)
      .remove(overwrites.member ? overwrites.member.denied : 0)
      .add(overwrites.member ? overwrites.member.allowed : 0)
      .freeze();
  }

  overwritesFor(member, verified = false, roles = null) {
    if (!verified) member = this.guild.members.resolve(member);
    if (!member) return [];

    roles = roles || member.roles;
    const roleOverwrites = [];
    let memberOverwrites;
    let everyoneOverwrites;

    for (const overwrite of this.permissionOverwrites.values()) {
      if (overwrite.id === this.guild.id) {
        everyoneOverwrites = overwrite;
      } else if (roles.has(overwrite.id)) {
        roleOverwrites.push(overwrite);
      } else if (overwrite.id === member.id) {
        memberOverwrites = overwrite;
      }
    }

    return {
      everyone: everyoneOverwrites,
      roles: roleOverwrites,
      member: memberOverwrites,
    };
  }

  /**
   * An object mapping permission flags to `true` (enabled), `null` (default) or `false` (disabled).
   * ```js
   * {
   *  'SEND_MESSAGES': true,
   *  'EMBED_LINKS': null,
   *  'ATTACH_FILES': false,
   * }
   * ```
   * @typedef {Object} PermissionOverwriteOptions
   */

  /**
   * Overwrites the permissions for a user or role in this channel.
   * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
   * @param {PermissionOverwriteOptions} options The configuration for the update
   * @param {string} [reason] Reason for creating/editing this overwrite
   * @returns {Promise<GuildChannel>}
   * @example
   * // Overwrite permissions for a message author
   * message.channel.overwritePermissions(message.author, {
   *   SEND_MESSAGES: false
   * })
   *   .then(() => console.log('Done!'))
   *   .catch(console.error);
   */
  overwritePermissions(userOrRole, options, reason) {
    const allow = new Permissions(0);
    const deny = new Permissions(0);
    let type;

    const role = this.guild.roles.get(userOrRole);

    if (role || userOrRole instanceof Role) {
      userOrRole = role || userOrRole;
      type = 'role';
    } else {
      userOrRole = this.client.users.resolve(userOrRole);
      type = 'member';
      if (!userOrRole) return Promise.reject(new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role', true));
    }

    const prevOverwrite = this.permissionOverwrites.get(userOrRole.id);

    if (prevOverwrite) {
      allow.add(prevOverwrite.allowed);
      deny.add(prevOverwrite.denied);
    }

    for (const perm in options) {
      if (options[perm] === true) {
        allow.add(Permissions.FLAGS[perm] || 0);
        deny.remove(Permissions.FLAGS[perm] || 0);
      } else if (options[perm] === false) {
        allow.remove(Permissions.FLAGS[perm] || 0);
        deny.add(Permissions.FLAGS[perm] || 0);
      } else if (options[perm] === null) {
        allow.remove(Permissions.FLAGS[perm] || 0);
        deny.remove(Permissions.FLAGS[perm] || 0);
      }
    }

    return this.client.api.channels(this.id).permissions[userOrRole.id]
      .put({ data: { id: userOrRole.id, type, allow: allow.bitfield, deny: deny.bitfield }, reason })
      .then(() => this);
  }

  /**
   * Locks in the permission overwrites from the parent channel.
   * @returns {Promise<GuildChannel>}
   */
  lockPermissions() {
    if (!this.parent) return Promise.reject(new Error('GUILD_CHANNEL_ORPHAN'));
    const permissionOverwrites = this.parent.permissionOverwrites.map(overwrite => ({
      deny: overwrite.denied.bitfield,
      allow: overwrite.allowed.bitfield,
      id: overwrite.id,
      type: overwrite.type,
    }));
    return this.edit({ permissionOverwrites });
  }

  /**
   * A collection of members that can see this channel, mapped by their ID
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    const members = new Collection();
    for (const member of this.guild.members.values()) {
      if (this.permissionsFor(member).has('VIEW_CHANNEL')) {
        members.set(member.id, member);
      }
    }
    return members;
  }

  /**
   * The data for a guild channel.
   * @typedef {Object} ChannelData
   * @property {string} [name] The name of the channel
   * @property {number} [position] The position of the channel
   * @property {string} [topic] The topic of the text channel
   * @property {number} [bitrate] The bitrate of the voice channel
   * @property {number} [userLimit] The user limit of the voice channel
   * @property {Snowflake} [parentID] The parent ID of the channel
   * @property {boolean} [lockPermissions] Lock the permissions of the channel to what the parent's permissions are
   * @property {OverwriteData[]} [permissionOverwrites] An array of overwrites to set for the channel
   */

  /**
   * The data for a permission overwrite
   * @typedef {Object} OverwriteData
   * @property {string} id The id of the overwrite
   * @property {string} type The type of the overwrite, either role or member
   * @property {number} allow The bitfield for the allowed permissions
   * @property {number} deny The bitfield for the denied permissions
   */

  /**
   * Edits the channel.
   * @param {ChannelData} data The new data for the channel
   * @param {string} [reason] Reason for editing this channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Edit a channel
   * channel.edit({name: 'new-channel'})
   *   .then(c => console.log(`Edited channel ${c}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    return this.client.api.channels(this.id).patch({
      data: {
        name: (data.name || this.name).trim(),
        topic: data.topic,
        position: data.position || this.rawPosition,
        bitrate: data.bitrate || (this.bitrate ? this.bitrate * 1000 : undefined),
        user_limit: data.userLimit != null ? data.userLimit : this.userLimit, // eslint-disable-line eqeqeq
        parent_id: data.parentID,
        lock_permissions: data.lockPermissions,
        permission_overwrites: data.permissionOverwrites,
      },
      reason,
    }).then(newData => {
      const clone = this._clone();
      clone._patch(newData);
      return clone;
    });
  }

  /**
   * Set a new name for the guild channel.
   * @param {string} name The new name for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's name
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel name
   * channel.setName('not_general')
   *   .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
   *   .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Set the category parent of this channel.
   * @param {GuildChannel|Snowflake} channel Parent channel
   * @param {boolean} [options.lockPermissions] Lock the permissions to what the parent's permissions are
   * @param {string} [options.reason] Reason for modifying the parent of this channel
   * @returns {Promise<GuildChannel>}
   */
  setParent(channel, { lockPermissions = true, reason } = {}) {
    return this.edit({
      parentID: channel.id ? channel.id : channel,
      lockPermissions,
    }, reason);
  }

  /**
   * Set a new topic for the guild channel.
   * @param {string} topic The new topic for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's topic
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel topic
   * channel.setTopic('needs more rate limiting')
   *   .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
   *   .catch(console.error);
   */
  setTopic(topic, reason) {
    return this.edit({ topic }, reason);
  }

  /**
   * Set a new position for the guild channel.
   * @param {number} position The new position for the guild channel
   * @param {Object} [options] Options for setting position
   * @param {boolean} [options.relative=false] Change the position relative to its current value
   * @param {boolean} [options.reason] Reasion for changing the position
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel position
   * channel.setPosition(2)
   *   .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
   *   .catch(console.error);
   */
  setPosition(position, { relative, reason } = {}) {
    return Util.setPosition(this, position, relative,
      this.guild._sortedChannels(this), this.client.api.guilds(this.guild.id).channels, reason)
      .then(updatedChannels => {
        this.client.actions.GuildChannelsPositionUpdate.handle({
          guild_id: this.id,
          channels: updatedChannels,
        });
        return this;
      });
  }

  /**
   * Create an invite to this guild channel.
   * @param {Object} [options={}] Options for the invite
   * @param {boolean} [options.temporary=false] Whether members that joined via the invite should be automatically
   * kicked after 24 hours if they have not yet received a role
   * @param {number} [options.maxAge=86400] How long the invite should last (in seconds, 0 for forever)
   * @param {number} [options.maxUses=0] Maximum number of uses
   * @param {boolean} [options.unique=false] Create a unique invite, or use an existing one with similar settings
   * @param {string} [options.reason] Reason for creating this
   * @returns {Promise<Invite>}
   */
  createInvite({ temporary = false, maxAge = 86400, maxUses = 0, unique, reason } = {}) {
    return this.client.api.channels(this.id).invites.post({ data: {
      temporary, max_age: maxAge, max_uses: maxUses, unique,
    }, reason })
      .then(invite => new Invite(this.client, invite));
  }

  /**
   * Clone this channel.
   * @param {Object} [options] The options
   * @param {string} [options.name=this.name] Optional name for the new channel, otherwise it has the name
   * of this channel
   * @param {boolean} [options.withPermissions=true] Whether to clone the channel with this channel's
   * permission overwrites
   * @param {boolean} [options.withTopic=true] Whether to clone the channel with this channel's topic
   * @param {string} [options.reason] Reason for cloning this channel
   * @returns {Promise<GuildChannel>}
   */
  clone({ name = this.name, withPermissions = true, withTopic = true, reason } = {}) {
    const options = { overwrites: withPermissions ? this.permissionOverwrites : [], reason };
    return this.guild.createChannel(name, this.type, options)
      .then(channel => withTopic ? channel.setTopic(this.topic) : channel);
  }

  /**
   * Checks if this channel has the same type, topic, position, name, overwrites and ID as another channel.
   * In most cases, a simple `channel.id === channel2.id` will do, and is much faster too.
   * @param {GuildChannel} channel Channel to compare with
   * @returns {boolean}
   */
  equals(channel) {
    let equal = channel &&
      this.id === channel.id &&
      this.type === channel.type &&
      this.topic === channel.topic &&
      this.position === channel.position &&
      this.name === channel.name;

    if (equal) {
      if (this.permissionOverwrites && channel.permissionOverwrites) {
        equal = this.permissionOverwrites.equals(channel.permissionOverwrites);
      } else {
        equal = !this.permissionOverwrites && !channel.permissionOverwrites;
      }
    }

    return equal;
  }

  /**
   * Whether the channel is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return this.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_CHANNELS);
  }

  /**
   * Deletes this channel.
   * @param {string} [reason] Reason for deleting this channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Delete the channel
   * channel.delete('making room for new channels')
   *   .then() // Success
   *   .catch(console.error); // Log error
   */
  delete(reason) {
    return this.client.api.channels(this.id).delete({ reason }).then(() => this);
  }

  /**
   * Whether the channel is muted
   * <warn>This is only available when using a user account.</warn>
   * @type {?boolean}
   * @readonly
   */
  get muted() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.guild.id).channelOverrides.get(this.id).muted;
    } catch (err) {
      return false;
    }
  }

  /**
   * The type of message that should notify you
   * one of `EVERYTHING`, `MENTIONS`, `NOTHING`, `INHERIT`
   * <warn>This is only available when using a user account.</warn>
   * @type {?string}
   * @readonly
   */
  get messageNotifications() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.guild.id).channelOverrides.get(this.id).messageNotifications;
    } catch (err) {
      return MessageNotificationTypes[3];
    }
  }

  /**
   * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object.
   * @returns {string}
   * @example
   * // Outputs: Hello from #general
   * console.log(`Hello from ${channel}`);
   * @example
   * // Outputs: Hello from #general
   * console.log('Hello from ' + channel);
   */
  toString() {
    return `<#${this.id}>`;
  }
}

module.exports = GuildChannel;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(5);
const DataResolver = __webpack_require__(10);
const Embed = __webpack_require__(14);
const MessageAttachment = __webpack_require__(18);
const MessageEmbed = __webpack_require__(14);
const { browser } = __webpack_require__(0);

/**
 * Represents a webhook.
 */
class Webhook {
  constructor(client, data) {
    /**
     * The client that instantiated the webhook
     * @name Webhook#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The name of the webhook
     * @type {string}
     */
    this.name = data.name;

    /**
     * The token for the webhook
     * @type {string}
     */
    this.token = data.token;

    /**
     * The avatar for the webhook
     * @type {?string}
     */
    this.avatar = data.avatar;

    /**
     * The ID of the webhook
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The guild the webhook belongs to
     * @type {Snowflake}
     */
    this.guildID = data.guild_id;

    /**
     * The channel the webhook belongs to
     * @type {Snowflake}
     */
    this.channelID = data.channel_id;

    if (data.user) {
      /**
       * The owner of the webhook
       * @type {?User|Object}
       */
      this.owner = this.client.users ? this.client.users.get(data.user.id) : data.user;
    } else {
      this.owner = null;
    }
  }

  /**
   * Options that can be passed into send.
   * @typedef {Object} WebhookMessageOptions
   * @property {string} [username=this.name] Username override for the message
   * @property {string} [avatarURL] Avatar URL override for the message
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {Object[]} [embeds] An array of embeds for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions|BufferResolvable} [file] A file to send with the message
   * @property {FileOptions[]|string[]} [files] Files to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message.
   */

  /* eslint-disable max-len */
  /**
   * Send a message with this webhook.
   * @param {StringResolvable} [content] The content to send
   * @param {WebhookMessageOptions|MessageEmbed|MessageAttachment|MessageAttachment[]} [options={}] The options to provide
   * @returns {Promise<Message|Object>}
   * @example
   * // Send a message
   * webhook.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   */
  /* eslint-enable max-len */
  send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }

    if (options instanceof MessageAttachment) options = { files: [options.file] };
    if (options instanceof MessageEmbed) options = { embeds: [options] };
    if (options.embed) options = { embeds: [options.embed] };

    if (content instanceof Array || options instanceof Array) {
      const which = content instanceof Array ? content : options;
      const attachments = which.filter(item => item instanceof MessageAttachment);
      const embeds = which.filter(item => item instanceof MessageEmbed);
      if (attachments.length) options = { files: attachments };
      if (embeds.length) options = { embeds };
      if ((embeds.length || attachments.length) && content instanceof Array) content = '';
    }

    if (!options.username) options.username = this.name;
    if (options.avatarURL) {
      options.avatar_url = options.avatarURL;
      options.avatarURL = null;
    }

    if (content) {
      content = Util.resolveString(content);
      let { split, code, disableEveryone } = options;
      if (split && typeof split !== 'object') split = {};
      if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
        content = Util.escapeMarkdown(content, true);
        content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
        if (split) {
          split.prepend = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n`;
          split.append = '\n```';
        }
      }
      if (disableEveryone || (typeof disableEveryone === 'undefined' && this.client.options.disableEveryone)) {
        content = content.replace(/@(everyone|here)/g, '@\u200b$1');
      }

      if (split) content = Util.splitMessage(content, split);
    }
    options.content = content;

    if (options.embeds) options.embeds = options.embeds.map(embed => new Embed(embed)._apiTransform());

    if (options.files) {
      for (let i = 0; i < options.files.length; i++) {
        let file = options.files[i];
        if (typeof file === 'string' || (!browser && Buffer.isBuffer(file))) file = { attachment: file };
        if (!file.name) {
          if (typeof file.attachment === 'string') {
            file.name = Util.basename(file.attachment);
          } else if (file.attachment && file.attachment.path) {
            file.name = Util.basename(file.attachment.path);
          } else if (file instanceof MessageAttachment) {
            file = { attachment: file.file, name: Util.basename(file.file) || 'file.jpg' };
          } else {
            file.name = 'file.jpg';
          }
        } else if (file instanceof MessageAttachment) {
          file = file.file;
        }
        options.files[i] = file;
      }

      return Promise.all(options.files.map(file =>
        DataResolver.resolveFile(file.attachment).then(resource => {
          file.file = resource;
          return file;
        })
      )).then(files => this.client.api.webhooks(this.id, this.token).post({
        data: options,
        query: { wait: true },
        files,
        auth: false,
      }));
    }

    if (content instanceof Array) {
      return new Promise((resolve, reject) => {
        const messages = [];
        (function sendChunk() {
          const opt = content.length ? null : { embeds: options.embeds, files: options.files };
          this.client.api.webhooks(this.id, this.token).post({
            data: { content: content.shift(), opt },
            query: { wait: true },
            auth: false,
          })
            .then(message => {
              messages.push(message);
              if (content.length === 0) return resolve(messages);
              return sendChunk.call(this);
            })
            .catch(reject);
        }.call(this));
      });
    }

    return this.client.api.webhooks(this.id, this.token).post({
      data: options,
      query: { wait: true },
      auth: false,
    }).then(data => {
      if (!this.client.channels) return data;
      return this.client.channels.get(data.channel_id).messages.create(data, false);
    });
  }

  /**
   * Send a raw slack message with this webhook.
   * @param {Object} body The raw body to send
   * @returns {Promise<Message|Object>}
   * @example
   * // Send a slack message
   * webhook.sendSlackMessage({
   *   'username': 'Wumpus',
   *   'attachments': [{
   *     'pretext': 'this looks pretty cool',
   *     'color': '#F0F',
   *     'footer_icon': 'http://snek.s3.amazonaws.com/topSnek.png',
   *     'footer': 'Powered by sneks',
   *     'ts': Date.now() / 1000
   *   }]
   * }).catch(console.error);
   */
  sendSlackMessage(body) {
    return this.client.api.webhooks(this.id, this.token).slack.post({
      query: { wait: true },
      auth: false,
      data: body,
    }).then(data => {
      if (!this.client.channels) return data;
      return this.client.channels.get(data.channel_id).messages.create(data, false);
    });
  }

  /**
   * Edit the webhook.
   * @param {Object} options Options
   * @param {string} [options.name=this.name] New name for this webhook
   * @param {BufferResolvable} [options.avatar] New avatar for this webhook
   * @param {string} [reason] Reason for editing this webhook
   * @returns {Promise<Webhook>}
   */
  edit({ name = this.name, avatar }, reason) {
    if (avatar && (typeof avatar === 'string' && !avatar.startsWith('data:'))) {
      return DataResolver.resolveImage(avatar).then(image => this.edit({ name, avatar: image }, reason));
    }
    return this.client.api.webhooks(this.id, this.token).patch({
      data: { name, avatar },
      reason,
    }).then(data => {
      this.name = data.name;
      this.avatar = data.avatar;
      return this;
    });
  }

  /**
   * Delete the webhook.
   * @param {string} [reason] Reason for deleting this webhook
   * @returns {Promise}
   */
  delete(reason) {
    return this.client.api.webhooks(this.id, this.token).delete({ reason });
  }

  static applyToClass(structure) {
    for (const prop of [
      'send',
      'sendSlackMessage',
      'edit',
      'delete',
    ]) {
      Object.defineProperty(structure.prototype, prop,
        Object.getOwnPropertyDescriptor(Webhook.prototype, prop));
    }
  }
}

module.exports = Webhook;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const MessageCollector = __webpack_require__(40);
const Shared = __webpack_require__(41);
const Util = __webpack_require__(5);
const { browser } = __webpack_require__(0);
const Snowflake = __webpack_require__(7);
const Collection = __webpack_require__(3);
const DataResolver = __webpack_require__(10);
const MessageAttachment = __webpack_require__(18);
const MessageEmbed = __webpack_require__(14);
const { RangeError, TypeError } = __webpack_require__(4);

/**
 * Interface for classes that have text-channel-like features.
 * @interface
 */
class TextBasedChannel {
  constructor() {
    /**
     * A collection containing the messages sent to this channel
     * @type {MessageStore<Snowflake, Message>}
     */
    this.messages = new MessageStore(this);

    /**
     * The ID of the last message in the channel, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message in the channel, if one was sent
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  /**
   * Options provided when sending or editing a message.
   * @typedef {Object} MessageOptions
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {string} [content=''] The content for the message
   * @property {MessageEmbed|Object} [embed] An embed for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions[]|BufferResolvable[]} [files] Files to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message
   * @property {UserResolvable} [reply] User to reply to (prefixes the message with a mention, except in DMs)
   */

  /**
   * @typedef {Object} FileOptions
   * @property {BufferResolvable} attachment File to attach
   * @property {string} [name='file.jpg'] Filename of the attachment
   */

  /**
   * Options for splitting a message.
   * @typedef {Object} SplitOptions
   * @property {number} [maxLength=1950] Maximum character length per message piece
   * @property {string} [char='\n'] Character to split the message with
   * @property {string} [prepend=''] Text to prepend to every piece except the first
   * @property {string} [append=''] Text to append to every piece except the last
   */

  /**
   * Send a message to this channel.
   * @param {StringResolvable} [content] Text for the message
   * @param {MessageOptions|MessageEmbed|MessageAttachment|MessageAttachment[]} [options={}] Options for the message
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Send a message
   * channel.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   */
  send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }

    if (options instanceof MessageEmbed) options = { embed: options };
    if (options instanceof MessageAttachment) options = { files: [options.file] };

    if (content instanceof Array || options instanceof Array) {
      const which = content instanceof Array ? content : options;
      const attachments = which.filter(item => item instanceof MessageAttachment);
      if (attachments.length) {
        options = { files: attachments };
        if (content instanceof Array) content = '';
      }
    }

    if (!options.content) options.content = content;

    if (options.embed && options.embed.files) {
      if (options.files) options.files = options.files.concat(options.embed.files);
      else options.files = options.embed.files;
    }

    if (options.files) {
      for (let i = 0; i < options.files.length; i++) {
        let file = options.files[i];
        if (typeof file === 'string' || (!browser && Buffer.isBuffer(file))) file = { attachment: file };
        if (!file.name) {
          if (typeof file.attachment === 'string') {
            file.name = Util.basename(file.attachment);
          } else if (file.attachment && file.attachment.path) {
            file.name = Util.basename(file.attachment.path);
          } else if (file instanceof MessageAttachment) {
            file = { attachment: file.file, name: Util.basename(file.file) || 'file.jpg' };
          } else {
            file.name = 'file.jpg';
          }
        } else if (file instanceof MessageAttachment) {
          file = file.file;
        }
        options.files[i] = file;
      }

      return Promise.all(options.files.map(file =>
        DataResolver.resolveFile(file.attachment).then(resource => {
          file.file = resource;
          return file;
        })
      )).then(files => {
        options.files = files;
        return Shared.sendMessage(this, options);
      });
    }

    return Shared.sendMessage(this, options);
  }

  /**
   * Performs a search within the channel.
   * <warn>This is only available when using a user account.</warn>
   * @param {MessageSearchOptions} [options={}] Options to pass to the search
   * @returns {Promise<MessageSearchResult>}
   * @example
   * channel.search({
   *   content: 'discord.js',
   *   before: '2016-11-17'
   * }).then(res => {
   *   const hit = res.results[0].find(m => m.hit).content;
   *   console.log(`I found: **${hit}**, total results: ${res.total}`);
   * }).catch(console.error);
   */
  search(options = {}) {
    return Shared.search(this, options);
  }

  /**
   * Starts a typing indicator in the channel.
   * @param {number} [count] The number of times startTyping should be considered to have been called
   * @example
   * // Start typing in a channel
   * channel.startTyping();
   */
  startTyping(count) {
    if (typeof count !== 'undefined' && count < 1) throw new RangeError('TYPING_COUNT');
    if (!this.client.user._typing.has(this.id)) {
      const endpoint = this.client.api.channels[this.id].typing;
      this.client.user._typing.set(this.id, {
        count: count || 1,
        interval: this.client.setInterval(() => {
          endpoint.post();
        }, 9000),
      });
      endpoint.post();
    } else {
      const entry = this.client.user._typing.get(this.id);
      entry.count = count || entry.count + 1;
    }
  }

  /**
   * Stops the typing indicator in the channel.
   * The indicator will only stop if this is called as many times as startTyping().
   * <info>It can take a few seconds for the client user to stop typing.</info>
   * @param {boolean} [force=false] Whether or not to reset the call count and force the indicator to stop
   * @example
   * // Stop typing in a channel
   * channel.stopTyping();
   * @example
   * // Force typing to fully stop in a channel
   * channel.stopTyping(true);
   */
  stopTyping(force = false) {
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count--;
      if (entry.count <= 0 || force) {
        this.client.clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
      }
    }
  }

  /**
   * Whether or not the typing indicator is being shown in the channel
   * @type {boolean}
   * @readonly
   */
  get typing() {
    return this.client.user._typing.has(this.id);
  }

  /**
   * Number of times `startTyping` has been called
   * @type {number}
   * @readonly
   */
  get typingCount() {
    if (this.client.user._typing.has(this.id)) return this.client.user._typing.get(this.id).count;
    return 0;
  }

  /**
   * Creates a Message Collector.
   * @param {CollectorFilter} filter The filter to create the collector with
   * @param {MessageCollectorOptions} [options={}] The options to pass to the collector
   * @returns {MessageCollector}
   * @example
   * // Create a message collector
   * const collector = channel.createMessageCollector(
   *   m => m.content.includes('discord'),
   *   { time: 15000 }
   * );
   * collector.on('collect', m => console.log(`Collected ${m.content}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageCollector(filter, options = {}) {
    return new MessageCollector(this, filter, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {MessageCollectorOptions} AwaitMessagesOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createMessageCollector but in promise form.
   * Resolves with a collection of messages that pass the specified filter.
   * @param {CollectorFilter} filter The filter function to use
   * @param {AwaitMessagesOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // Await !vote messages
   * const filter = m => m.content.startsWith('!vote');
   * // Errors: ['time'] treats ending because of the time limit as an error
   * channel.awaitMessages(filter, { max: 4, time: 60000, errors: ['time'] })
   *   .then(collected => console.log(collected.size))
   *   .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
   */
  awaitMessages(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createMessageCollector(filter, options);
      collector.once('end', (collection, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }

  /**
   * Bulk delete given messages that are newer than two weeks.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Collection<Snowflake, Message>|Message[]|Snowflake[]|number} messages
   * Messages or number of messages to delete
   * @param {boolean} [filterOld=false] Filter messages to remove those which are older than two weeks automatically
   * @returns {Promise<Collection<Snowflake, Message>>} Deleted messages
   */
  async bulkDelete(messages, filterOld = false) {
    if (messages instanceof Array || messages instanceof Collection) {
      let messageIDs = messages instanceof Collection ? messages.keyArray() : messages.map(m => m.id || m);
      if (filterOld) {
        messageIDs = messageIDs.filter(id =>
          Date.now() - Snowflake.deconstruct(id).date.getTime() < 1209600000
        );
      }
      if (messageIDs.length === 0) return new Collection();
      if (messageIDs.length === 1) {
        await this.client.api.channels(this.id).messages(messageIDs[0]).delete();
        const message = this.client.actions.MessageDelete.handle({
          channel_id: this.id,
          id: messageIDs[0],
        }).message;
        if (message) return new Collection([[message.id, message]]);
        return new Collection();
      }
      await this.client.api.channels[this.id].messages['bulk-delete']
        .post({ data: { messages: messageIDs } });
      return this.client.actions.MessageDeleteBulk.handle({
        channel_id: this.id,
        ids: messageIDs,
      }).messages;
    }
    if (!isNaN(messages)) {
      const msgs = await this.messages.fetch({ limit: messages });
      return this.bulkDelete(msgs, filterOld);
    }
    throw new TypeError('MESSAGE_BULK_DELETE_TYPE');
  }

  /**
   * Marks all messages in this channel as read.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<TextChannel|GroupDMChannel|DMChannel>}
   */
  acknowledge() {
    if (!this.lastMessageID) return Promise.resolve(this);
    return this.client.api.channels[this.id].messages[this.lastMessageID].ack
      .post({ data: { token: this.client.rest._ackToken } })
      .then(res => {
        if (res.token) this.client.rest._ackToken = res.token;
        return this;
      });
  }

  static applyToClass(structure, full = false, ignore = []) {
    const props = ['send'];
    if (full) {
      props.push(
        'acknowledge',
        'search',
        'bulkDelete',
        'startTyping',
        'stopTyping',
        'typing',
        'typingCount',
        'createMessageCollector',
        'awaitMessages'
      );
    }
    for (const prop of props) {
      if (ignore.includes(prop)) continue;
      Object.defineProperty(structure.prototype, prop,
        Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop));
    }
  }
}

module.exports = TextBasedChannel;

// Fixes Circular
const MessageStore = __webpack_require__(21);


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * Represents an attachment in a message.
 * @param {BufferResolvable|Stream} file The file
 * @param {string} [name] The name of the file, if any
 */
class MessageAttachment {
  constructor(file, name, data) {
    this.file = null;
    if (data) this._patch(data);
    if (name) this.setAttachment(file, name);
    else this._attach(file);
  }

  /**
    * The name of the file
    * @type {?string}
    * @readonly
    */
  get name() {
    return this.file.name;
  }

  /**
    * The file
    * @type {?BufferResolvable|Stream}
    * @readonly
    */
  get attachment() {
    return this.file.attachment;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
    * @param {string} name The name of the file
    * @returns {MessageAttachment} This attachment
    */
  setAttachment(file, name) {
    this.file = { attachment: file, name };
    return this;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} attachment The file
    * @returns {MessageAttachment} This attachment
    */
  setFile(attachment) {
    this.file = { attachment };
    return this;
  }

  /**
    * Set the name of this attachment.
    * @param {string} name The name of the image
    * @returns {MessageAttachment} This attachment
    */
  setName(name) {
    this.file.name = name;
    return this;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
    * @param {string} name The name of the file
    * @private
    */
  _attach(file, name) {
    if (typeof file === 'string') this.file = file;
    else this.setAttachment(file, name);
  }

  _patch(data) {
    /**
     * The ID of this attachment
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The size of this attachment in bytes
     * @type {number}
     */
    this.size = data.size;

    /**
     * The URL to this attachment
     * @type {string}
     */
    this.url = data.url;

    /**
     * The Proxy URL to this attachment
     * @type {string}
     */
    this.proxyURL = data.proxy_url;

    /**
     * The height of this attachment (if an image)
     * @type {?number}
     */
    this.height = data.height;

    /**
     * The width of this attachment (if an image)
     * @type {?number}
     */
    this.width = data.width;
  }
}

module.exports = MessageAttachment;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const TextBasedChannel = __webpack_require__(17);
const { Presence } = __webpack_require__(13);
const UserProfile = __webpack_require__(87);
const Snowflake = __webpack_require__(7);
const Base = __webpack_require__(8);
const { Error } = __webpack_require__(4);

/**
 * Represents a user on Discord.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class User extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The ID of the user
     * @type {Snowflake}
     */
    this.id = data.id;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The username of the user
     * @type {string}
     * @name User#username
     */
    if (data.username) this.username = data.username;

    /**
     * A discriminator based on username for the user
     * @type {string}
     * @name User#discriminator
     */
    if (data.discriminator) this.discriminator = data.discriminator;

    /**
     * The ID of the user's avatar
     * @type {string}
     * @name User#avatar
     */
    if (typeof data.avatar !== 'undefined') this.avatar = data.avatar;

    /**
     * Whether or not the user is a bot
     * @type {boolean}
     * @name User#bot
     */
    if (typeof this.bot === 'undefined' && typeof data.bot !== 'undefined') this.bot = Boolean(data.bot);

    /**
     * The ID of the last message sent by the user, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message sent by the user, if one was sent
     * @type {?Message}
     */
    this.lastMessage = null;

    if (data.token) this.client.token = data.token;
  }

  /**
   * The timestamp the user was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the user was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The presence of this user
   * @type {Presence}
   * @readonly
   */
  get presence() {
    if (this.client.presences.has(this.id)) return this.client.presences.get(this.id);
    for (const guild of this.client.guilds.values()) {
      if (guild.presences.has(this.id)) return guild.presences.get(this.id);
    }
    return new Presence();
  }

  /**
   * A link to the user's avatar.
   * @param {Object} [options={}] Options for the avatar url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`, `gif`. If no format is provided,
   * it will be `gif` for animated avatars or otherwise `webp`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {?string}
   */
  avatarURL({ format, size } = {}) {
    if (!this.avatar) return null;
    return this.client.rest.cdn.Avatar(this.id, this.avatar, format, size);
  }

  /**
   * A link to the user's default avatar
   * @type {string}
   * @readonly
   */
  get defaultAvatarURL() {
    return this.client.rest.cdn.DefaultAvatar(this.discriminator % 5);
  }

  /**
   * A link to the user's avatar if they have one.
   * Otherwise a link to their default avatar will be returned.
   * @param {Object} [options={}] Options for the avatar url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`, `gif`. If no format is provided,
   * it will be `gif` for animated avatars or otherwise `webp`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {string}
   */
  displayAvatarURL(options) {
    return this.avatarURL(options) || this.defaultAvatarURL;
  }

  /**
   * The Discord "tag" for this user
   * @type {string}
   * @readonly
   */
  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  /**
   * The note that is set for the user
   * <warn>This is only available when using a user account.</warn>
   * @type {?string}
   * @readonly
   */
  get note() {
    return this.client.user.notes.get(this.id) || null;
  }

  /**
   * Check whether the user is typing in a channel.
   * @param {ChannelResolvable} channel The channel to check in
   * @returns {boolean}
   */
  typingIn(channel) {
    channel = this.client.channels.resolve(channel);
    return channel._typing.has(this.id);
  }

  /**
   * Get the time that the user started typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {?Date}
   */
  typingSinceIn(channel) {
    channel = this.client.channels.resolve(channel);
    return channel._typing.has(this.id) ? new Date(channel._typing.get(this.id).since) : null;
  }

  /**
   * Get the amount of time the user has been typing in a channel for (in milliseconds), or -1 if they're not typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {number}
   */
  typingDurationIn(channel) {
    channel = this.client.channels.resolve(channel);
    return channel._typing.has(this.id) ? channel._typing.get(this.id).elapsedTime : -1;
  }

  /**
   * The DM between the client's user and this user
   * @type {?DMChannel}
   * @readonly
   */
  get dmChannel() {
    return this.client.channels.filter(c => c.type === 'dm').find(c => c.recipient.id === this.id);
  }

  /**
   * Creates a DM channel between the client and the user.
   * @returns {Promise<DMChannel>}
   */
  createDM() {
    if (this.dmChannel) return Promise.resolve(this.dmChannel);
    return this.client.api.users(this.client.user.id).channels.post({ data: {
      recipient_id: this.id,
    } })
      .then(data => this.client.actions.ChannelCreate.handle(data).channel);
  }

  /**
   * Deletes a DM channel (if one exists) between the client and the user. Resolves with the channel if successful.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    if (!this.dmChannel) return Promise.reject(new Error('USER_NO_DMCHANNEL'));
    return this.client.api.channels(this.dmChannel.id).delete()
      .then(data => this.client.actions.ChannelDelete.handle(data).channel);
  }

  /**
   * Get the profile of the user.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<UserProfile>}
   */
  fetchProfile() {
    return this.client.api.users(this.id).profile.get().then(data => new UserProfile(this, data));
  }

  /**
   * Sets a note for the user.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} note The note to set for the user
   * @returns {Promise<User>}
   */
  setNote(note) {
    return this.client.api.users('@me').notes(this.id).put({ data: { note } })
      .then(() => this);
  }

  /**
   * Checks if the user is equal to another. It compares ID, username, discriminator, avatar, and bot flags.
   * It is recommended to compare equality by using `user.id === user2.id` unless you want to compare all properties.
   * @param {User} user User to compare with
   * @returns {boolean}
   */
  equals(user) {
    let equal = user &&
      this.id === user.id &&
      this.username === user.username &&
      this.discriminator === user.discriminator &&
      this.avatar === user.avatar;

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the user's mention instead of the User object.
   * @returns {string}
   * @example
   * // logs: Hello from <@123456789>!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return `<@${this.id}>`;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
}

TextBasedChannel.applyToClass(User);

module.exports = User;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Collection = __webpack_require__(3);
const Message = __webpack_require__(30);
const { Error } = __webpack_require__(4);

/**
 * Stores messages for text-based channels.
 * @extends {DataStore}
 */
class MessageStore extends DataStore {
  constructor(channel, iterable) {
    super(channel.client, iterable, Message);
    this.channel = channel;
  }

  create(data, cache) {
    return super.create(data, cache, { extras: [this.channel] });
  }

  set(key, value) {
    const maxSize = this.client.options.messageCacheMaxSize;
    if (maxSize === 0) return;
    if (this.size >= maxSize && maxSize > 0) this.delete(this.firstKey());
    super.set(key, value);
  }

  /**
   * The parameters to pass in when requesting previous messages from a channel. `around`, `before` and
   * `after` are mutually exclusive. All the parameters are optional.
   * @typedef {Object} ChannelLogsQueryOptions
   * @property {number} [limit=50] Number of messages to acquire
   * @property {Snowflake} [before] ID of a message to get the messages that were posted before it
   * @property {Snowflake} [after] ID of a message to get the messages that were posted after it
   * @property {Snowflake} [around] ID of a message to get the messages that were posted around it
   */

  /**
   * Gets a message, or messages, from this channel.
   * @param {Snowflake|ChannelLogsQueryOptions} [message] The ID of the message to fetch, or query parameters.
   * @returns {Promise<Message>|Promise<Collection<Snowflake, Message>>}
   * @example
   * // Get message
   * channel.messages.fetch('99539446449315840')
   *   .then(message => console.log(message.content))
   *   .catch(console.error);
   * @example
   * // Get messages
   * channel.messages.fetch({limit: 10})
   *   .then(messages => console.log(`Received ${messages.size} messages`))
   *   .catch(console.error);
   */
  fetch(message) {
    return typeof message === 'string' ? this._fetchId(message) : this._fetchMany(message);
  }

  /**
   * Fetches the pinned messages of this channel and returns a collection of them.
   * <info>The returned Collection does not contain the reactions of the messages.
   * Those need to be fetched seperately.</info>
   * @returns {Promise<Collection<Snowflake, Message>>}
   */
  fetchPinned() {
    return this.client.api.channels[this.channel.id].pins.get().then(data => {
      const messages = new Collection();
      for (const message of data) messages.set(message.id, this.create(message));
      return messages;
    });
  }

  _fetchId(messageID) {
    if (!this.client.user.bot) {
      return this._fetchMany({ limit: 1, around: messageID })
        .then(messages => {
          const msg = messages.get(messageID);
          if (!msg) throw new Error('MESSAGE_MISSING');
          return msg;
        });
    }
    return this.client.api.channels[this.channel.id].messages[messageID].get()
      .then(data => this.create(data));
  }

  _fetchMany(options = {}) {
    return this.client.api.channels[this.channel.id].messages.get({ query: options })
      .then(data => {
        const messages = new Collection();
        for (const message of data) messages.set(message.id, this.create(message));
        return messages;
      });
  }


  /**
   * Data that can be resolved to a Message object. This can be:
   * * A Message
   * * A Snowflake
   * @typedef {Message|Snowflake} MessageResolvable
   */

  /**
    * Resolves a MessageResolvable to a Message object.
    * @method resolve
    * @memberof MessageStore
    * @instance
    * @param {MessageResolvable} message The message resolvable to resolve
    * @returns {?Message}
    */

  /**
    * Resolves a MessageResolvable to a Message ID string.
    * @method resolveID
    * @memberof MessageStore
    * @instance
    * @param {MessageResolvable} message The message resolvable to resolve
    * @returns {?string}
    */
}

module.exports = MessageStore;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(7);
const Permissions = __webpack_require__(9);
const Util = __webpack_require__(5);
const Base = __webpack_require__(8);
const { TypeError } = __webpack_require__(4);

/**
 * Represents a role on Discord.
 * @extends {Base}
 */
class Role extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild that the role belongs to
     * @type {Guild}
     */
    this.guild = guild;

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of the role (unique to the guild it is part of)
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the role
     * @type {string}
     */
    this.name = data.name;

    /**
     * The base 10 color of the role
     * @type {number}
     */
    this.color = data.color;

    /**
     * If true, users that are part of this role will appear in a separate category in the users list
     * @type {boolean}
     */
    this.hoist = data.hoist;

    /**
     * The raw position of the role from the API
     * @type {number}
     */
    this.rawPosition = data.position;

    /**
     * The permissions of the role
     * @type {Permissions}
     */
    this.permissions = new Permissions(data.permissions).freeze();

    /**
     * Whether or not the role is managed by an external service
     * @type {boolean}
     */
    this.managed = data.managed;

    /**
     * Whether or not the role can be mentioned by anyone
     * @type {boolean}
     */
    this.mentionable = data.mentionable;
  }

  /**
   * The timestamp the role was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the role was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The hexadecimal version of the role color, with a leading hashtag
   * @type {string}
   * @readonly
   */
  get hexColor() {
    let col = this.color.toString(16);
    while (col.length < 6) col = `0${col}`;
    return `#${col}`;
  }

  /**
   * The cached guild members that have this role
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    return this.guild.members.filter(m => m.roles.has(this.id));
  }

  /**
   * Whether the role is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    if (this.managed) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return false;
    return clientMember.highestRole.comparePositionTo(this) > 0;
  }

  /**
   * The position of the role in the role manager
   * @type {number}
   * @readonly
   */
  get position() {
    const sorted = this.guild._sortedRoles();
    return sorted.array().indexOf(sorted.get(this.id));
  }

  /**
   * Compares this role's position to another role's.
   * @param {RoleResolvable} role Role to compare to this one
   * @returns {number} Negative number if the this role's position is lower (other role's is higher),
   * positive number if the this one is higher (other's is lower), 0 if equal
   */
  comparePositionTo(role) {
    role = this.guild.roles.resolve(role);
    if (!role) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
    return this.constructor.comparePositions(this, role);
  }

  /**
   * The data for a role.
   * @typedef {Object} RoleData
   * @property {string} [name] The name of the role
   * @property {ColorResolvable} [color] The color of the role, either a hex string or a base 10 number
   * @property {boolean} [hoist] Whether or not the role should be hoisted
   * @property {number} [position] The position of the role
   * @property {PermissionResolvable|PermissionResolvable[]} [permissions] The permissions of the role
   * @property {boolean} [mentionable] Whether or not the role should be mentionable
   */

  /**
   * Edits the role.
   * @param {RoleData} data The new data for the role
   * @param {string} [reason] Reason for editing this role
   * @returns {Promise<Role>}
   * @example
   * // Edit a role
   * role.edit({name: 'new role'})
   *   .then(r => console.log(`Edited role ${r}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    if (data.permissions) data.permissions = Permissions.resolve(data.permissions);
    else data.permissions = this.permissions.bitfield;
    return this.client.api.guilds[this.guild.id].roles[this.id].patch({
      data: {
        name: data.name || this.name,
        color: Util.resolveColor(data.color || this.color),
        hoist: typeof data.hoist !== 'undefined' ? data.hoist : this.hoist,
        position: typeof data.position !== 'undefined' ? data.position : this.position,
        permissions: data.permissions,
        mentionable: typeof data.mentionable !== 'undefined' ? data.mentionable : this.mentionable,
      },
      reason,
    })
      .then(role => {
        const clone = this._clone();
        clone._patch(role);
        return clone;
      });
  }

  /**
   * Set a new name for the role.
   * @param {string} name The new name of the role
   * @param {string} [reason] Reason for changing the role's name
   * @returns {Promise<Role>}
   * @example
   * // Set the name of the role
   * role.setName('new role')
   *   .then(r => console.log(`Edited name of role ${r}`))
   *   .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Set a new color for the role.
   * @param {ColorResolvable} color The color of the role
   * @param {string} [reason] Reason for changing the role's color
   * @returns {Promise<Role>}
   * @example
   * // Set the color of a role
   * role.setColor('#FF0000')
   *   .then(r => console.log(`Set color of role ${r}`))
   *   .catch(console.error);
   */
  setColor(color, reason) {
    return this.edit({ color }, reason);
  }

  /**
   * Set whether or not the role should be hoisted.
   * @param {boolean} hoist Whether or not to hoist the role
   * @param {string} [reason] Reason for setting whether or not the role should be hoisted
   * @returns {Promise<Role>}
   * @example
   * // Set the hoist of the role
   * role.setHoist(true)
   *   .then(r => console.log(`Role hoisted: ${r.hoist}`))
   *   .catch(console.error);
   */
  setHoist(hoist, reason) {
    return this.edit({ hoist }, reason);
  }

  /**
   * Set the permissions of the role.
   * @param {PermissionResolvable[]} permissions The permissions of the role
   * @param {string} [reason] Reason for changing the role's permissions
   * @returns {Promise<Role>}
   * @example
   * // Set the permissions of the role
   * role.setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS'])
   *   .then(r => console.log(`Role updated ${r}`))
   *   .catch(console.error);
   */
  setPermissions(permissions, reason) {
    return this.edit({ permissions }, reason);
  }

  /**
   * Set whether this role is mentionable.
   * @param {boolean} mentionable Whether this role should be mentionable
   * @param {string} [reason] Reason for setting whether or not this role should be mentionable
   * @returns {Promise<Role>}
   * @example
   * // Make the role mentionable
   * role.setMentionable(true)
   *   .then(r => console.log(`Role updated ${r}`))
   *   .catch(console.error);
   */
  setMentionable(mentionable, reason) {
    return this.edit({ mentionable }, reason);
  }

  /**
   * Set the position of the role.
   * @param {number} position The position of the role
   * @param {Object} [options] Options for setting position
   * @param {boolean} [options.relative=false] Change the position relative to its current value
   * @param {boolean} [options.reason] Reasion for changing the position
   * @returns {Promise<Role>}
   * @example
   * // Set the position of the role
   * role.setPosition(1)
   *   .then(r => console.log(`Role position: ${r.position}`))
   *   .catch(console.error);
   */
  setPosition(position, { relative, reason } = {}) {
    return Util.setPosition(this, position, relative,
      this.guild._sortedRoles(), this.client.api.guilds(this.guild.id).roles, reason)
      .then(updatedRoles => {
        this.client.actions.GuildRolesPositionUpdate.handle({
          guild_id: this.id,
          channels: updatedRoles,
        });
        return this;
      });
  }

  /**
   * Deletes the role.
   * @param {string} [reason] Reason for deleting this role
   * @returns {Promise<Role>}
   * @example
   * // Delete a role
   * role.delete()
   *   .then(r => console.log(`Deleted role ${r}`))
   *   .catch(console.error);
   */
  delete(reason) {
    return this.client.api.guilds[this.guild.id].roles[this.id].delete({ reason })
      .then(() => {
        this.client.actions.GuildRoleDelete.handle({ guild_id: this.guild.id, role_id: this.id });
        return this;
      });
  }

  /**
   * Whether this role equals another role. It compares all properties, so for most operations
   * it is advisable to just compare `role.id === role2.id` as it is much faster and is often
   * what most users need.
   * @param {Role} role Role to compare with
   * @returns {boolean}
   */
  equals(role) {
    return role &&
      this.id === role.id &&
      this.name === role.name &&
      this.color === role.color &&
      this.hoist === role.hoist &&
      this.position === role.position &&
      this.permissions.bitfield === role.permissions.bitfield &&
      this.managed === role.managed;
  }

  /**
   * When concatenated with a string, this automatically concatenates the role mention rather than the Role object.
   * @returns {string}
   */
  toString() {
    if (this.id === this.guild.id) return '@everyone';
    return `<@&${this.id}>`;
  }

  /**
   * Compares the positions of two roles.
   * @param {Role} role1 First role to compare
   * @param {Role} role2 Second role to compare
   * @returns {number} Negative number if the first role's position is lower (second role's is higher),
   * positive number if the first's is higher (second's is lower), 0 if equal
   */
  static comparePositions(role1, role2) {
    if (role1.position === role2.position) return role2.id - role1.id;
    return role1.position - role2.position;
  }
}

module.exports = Role;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const { Endpoints } = __webpack_require__(0);
const Base = __webpack_require__(8);

/**
 * Represents an invitation to a guild channel.
 * <warn>The only guaranteed properties are `code`, `guild` and `channel`. Other properties can be missing.</warn>
 * @extends {Base}
 */
class Invite extends Base {
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    /**
     * The guild the invite is for
     * @type {Guild}
     */
    this.guild = this.client.guilds.create(data.guild, false);

    /**
     * The code for this invite
     * @type {string}
     */
    this.code = data.code;

    /**
     * The approximate number of online members of the guild this invite is for
     * @type {number}
     */
    this.presenceCount = data.approximate_presence_count;

    /**
     * The approximate total number of members of the guild this invite is for
     * @type {number}
     */
    this.memberCount = data.approximate_member_count;

    /**
     * The number of text channels the guild this invite goes to has
     * @type {number}
     */
    this.textChannelCount = data.guild.text_channel_count;

    /**
     * The number of voice channels the guild this invite goes to has
     * @type {number}
     */
    this.voiceChannelCount = data.guild.voice_channel_count;

    /**
     * Whether or not this invite is temporary
     * @type {boolean}
     */
    this.temporary = data.temporary;

    /**
     * The maximum age of the invite, in seconds
     * @type {?number}
     */
    this.maxAge = data.max_age;

    /**
     * How many times this invite has been used
     * @type {number}
     */
    this.uses = data.uses;

    /**
     * The maximum uses of this invite
     * @type {number}
     */
    this.maxUses = data.max_uses;

    if (data.inviter) {
      /**
       * The user who created this invite
       * @type {User}
       */
      this.inviter = this.client.users.create(data.inviter);
    }

    /**
     * The channel the invite is for
     * @type {GuildChannel}
     */
    this.channel = this.client.channels.create(data.channel, this.guild, false);

    /**
     * The timestamp the invite was created at
     * @type {number}
     */
    this.createdTimestamp = new Date(data.created_at).getTime();
  }

  /**
   * The time the invite was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The timestamp the invite will expire at
   * @type {number}
   * @readonly
   */
  get expiresTimestamp() {
    return this.createdTimestamp + (this.maxAge * 1000);
  }

  /**
   * The time the invite will expire
   * @type {Date}
   * @readonly
   */
  get expiresAt() {
    return new Date(this.expiresTimestamp);
  }

  /**
   * The URL to the invite
   * @type {string}
   * @readonly
   */
  get url() {
    return Endpoints.invite(this.client.options.http.invite, this.code);
  }

  /**
   * Deletes this invite.
   * @param {string} [reason] Reason for deleting this invite
   * @returns {Promise<Invite>}
   */
  delete(reason) {
    return this.client.api.invites[this.code].delete({ reason }).then(() => this);
  }

  /**
   * When concatenated with a string, this automatically concatenates the invite's URL instead of the object.
   * @returns {string}
   * @example
   * // Logs: Invite: https://discord.gg/A1b2C3
   * console.log(`Invite: ${invite}`);
   */
  toString() {
    return this.url;
  }
}

module.exports = Invite;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const Invite = __webpack_require__(23);
const GuildAuditLogs = __webpack_require__(50);
const Webhook = __webpack_require__(16);
const GuildMember = __webpack_require__(12);
const VoiceRegion = __webpack_require__(51);
const { ChannelTypes, Events, browser } = __webpack_require__(0);
const Collection = __webpack_require__(3);
const Util = __webpack_require__(5);
const DataResolver = __webpack_require__(10);
const Snowflake = __webpack_require__(7);
const Permissions = __webpack_require__(9);
const Shared = __webpack_require__(41);
const GuildMemberStore = __webpack_require__(83);
const RoleStore = __webpack_require__(84);
const EmojiStore = __webpack_require__(52);
const GuildChannelStore = __webpack_require__(85);
const PresenceStore = __webpack_require__(53);
const Base = __webpack_require__(8);
const { Error, TypeError } = __webpack_require__(4);

/**
 * Represents a guild (or a server) on Discord.
 * <info>It's recommended to see if a guild is available before performing operations or reading data from it. You can
 * check this with `guild.available`.</info>
 * @extends {Base}
 */
class Guild extends Base {
  constructor(client, data) {
    super(client);

    /**
     * A collection of members that are in this guild. The key is the member's ID, the value is the member
     * @type {GuildMemberStore<Snowflake, GuildMember>}
     */
    this.members = new GuildMemberStore(this);

    /**
     * A collection of channels that are in this guild. The key is the channel's ID, the value is the channel
     * @type {GuildChannelStore<Snowflake, GuildChannel>}
     */
    this.channels = new GuildChannelStore(this);

    /**
     * A collection of roles that are in this guild. The key is the role's ID, the value is the role
     * @type {Collection<Snowflake, Role>}
     */
    this.roles = new RoleStore(this);

    /**
     * A collection of presences in this guild
     * @type {PresenceStore<Snowflake, Presence>}
     */
    this.presences = new PresenceStore(this.client);

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the guild is available to access. If it is not available, it indicates a server outage
       * @type {boolean}
       */
      this.available = false;

      /**
       * The Unique ID of the guild, useful for comparisons
       * @type {Snowflake}
       */
      this.id = data.id;
    } else {
      this._patch(data);
      if (!data.channels) this.available = false;
    }
  }

  /**
   * Sets up the guild.
   * @param {*} data The raw data of the guild
   * @private
   */
  _patch(data) {
    /**
     * The name of the guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of the guild icon
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the guild splash image (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;

    /**
     * The region the guild is located in
     * @type {string}
     */
    this.region = data.region;

    /**
     * The full amount of members in this guild as of `READY`
     * @type {number}
     */
    this.memberCount = data.member_count || this.memberCount;

    /**
     * Whether the guild is "large" (has more than 250 members)
     * @type {boolean}
     */
    this.large = Boolean('large' in data ? data.large : this.large);

    /**
     * An array of guild features
     * @type {Object[]}
     */
    this.features = data.features;

    /**
     * The ID of the application that created this guild (if applicable)
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id;

    /**
     * The time in seconds before a user is counted as "away from keyboard"
     * @type {?number}
     */
    this.afkTimeout = data.afk_timeout;

    /**
     * The ID of the voice channel where AFK members are moved
     * @type {?Snowflake}
     */
    this.afkChannelID = data.afk_channel_id;

    /**
     * The ID of the system channel
     * @type {?Snowflake}
     */
    this.systemChannelID = data.system_channel_id;

    /**
     * Whether embedded images are enabled on this guild
     * @type {boolean}
     */
    this.embedEnabled = data.embed_enabled;

    /**
     * The verification level of the guild
     * @type {number}
     */
    this.verificationLevel = data.verification_level;

    /**
     * The explicit content filter level of the guild
     * @type {number}
     */
    this.explicitContentFilter = data.explicit_content_filter;

    /**
     * The timestamp the client user joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

    this.id = data.id;
    this.available = !data.unavailable;
    this.features = data.features || this.features || [];

    if (data.members) {
      this.members.clear();
      for (const guildUser of data.members) this.members.create(guildUser);
    }

    if (data.owner_id) {
      /**
       * The user ID of this guild's owner
       * @type {Snowflake}
       */
      this.ownerID = data.owner_id;
    }

    if (data.channels) {
      this.channels.clear();
      for (const rawChannel of data.channels) {
        this.client.channels.create(rawChannel, this);
      }
    }

    if (data.roles) {
      this.roles.clear();
      for (const role of data.roles) this.roles.create(role);
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this.presences.create(presence);
      }
    }

    this.voiceStates = new VoiceStateCollection(this);
    if (data.voice_states) {
      for (const voiceState of data.voice_states) this.voiceStates.set(voiceState.user_id, voiceState);
    }

    if (!this.emojis) {
      /**
       * A collection of emojis that are in this guild. The key is the emoji's ID, the value is the emoji.
       * @type {EmojiStore<Snowflake, Emoji>}
       */
      this.emojis = new EmojiStore(this);
      if (data.emojis) for (const emoji of data.emojis) this.emojis.create(emoji);
    } else {
      this.client.actions.GuildEmojisUpdate.handle({
        guild_id: this.id,
        emojis: data.emojis,
      });
    }
  }

  /**
   * The timestamp the guild was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the guild was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the client user joined the guild
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * The URL to this guild's icon.
   * @param {Object} [options={}] Options for the icon url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {?string}
   */
  iconURL({ format, size } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.Icon(this.id, this.icon, format, size);
  }

  /**
   * The acronym that shows up in place of a guild icon.
   * @type {string}
   * @readonly
   */
  get nameAcronym() {
    return this.name.replace(/\w+/g, name => name[0]).replace(/\s/g, '');
  }

  /**
   * The URL to this guild's splash.
   * @param {Object} [options={}] Options for the splash url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {?string}
   */
  splashURL({ format, size } = {}) {
    if (!this.splash) return null;
    return this.client.rest.cdn.Splash(this.id, this.splash, format, size);
  }

  /**
   * The owner of the guild
   * @type {GuildMember}
   * @readonly
   */
  get owner() {
    return this.members.get(this.ownerID);
  }

  /**
   * AFK voice channel for this guild
   * @type {?VoiceChannel}
   * @readonly
   */
  get afkChannel() {
    return this.client.channels.get(this.afkChannelID) || null;
  }

  /**
   * System channel for this guild
   * @type {?GuildChannel}
   * @readonly
   */
  get systemChannel() {
    return this.client.channels.get(this.systemChannelID) || null;
  }

  /**
   * If the client is connected to any voice channel in this guild, this will be the relevant VoiceConnection
   * @type {?VoiceConnection}
   * @readonly
   */
  get voiceConnection() {
    if (browser) return null;
    return this.client.voice.connections.get(this.id) || null;
  }

  /**
   * The position of this guild
   * <warn>This is only available when using a user account.</warn>
   * @type {?number}
   * @readonly
   */
  get position() {
    if (this.client.user.bot) return null;
    if (!this.client.user.settings.guildPositions) return null;
    return this.client.user.settings.guildPositions.indexOf(this.id);
  }

  /**
   * Whether the guild is muted
   * <warn>This is only available when using a user account.</warn>
   * @type {?boolean}
   * @readonly
   */
  get muted() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.id).muted;
    } catch (err) {
      return false;
    }
  }

  /**
   * The type of message that should notify you
   * one of `EVERYTHING`, `MENTIONS`, `NOTHING`
   * <warn>This is only available when using a user account.</warn>
   * @type {?string}
   * @readonly
   */
  get messageNotifications() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.id).messageNotifications;
    } catch (err) {
      return null;
    }
  }

  /**
   * Whether to receive mobile push notifications
   * <warn>This is only available when using a user account.</warn>
   * @type {?boolean}
   * @readonly
   */
  get mobilePush() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.id).mobilePush;
    } catch (err) {
      return false;
    }
  }

  /**
   * Whether to suppress everyone messages
   * <warn>This is only available when using a user account.</warn>
   * @type {?boolean}
   * @readonly
   */
  get suppressEveryone() {
    if (this.client.user.bot) return null;
    try {
      return this.client.user.guildSettings.get(this.id).suppressEveryone;
    } catch (err) {
      return null;
    }
  }

  /*
   * The `@everyone` role of the guild
   * @type {Role}
   * @readonly
   */
  get defaultRole() {
    return this.roles.get(this.id);
  }

  /**
   * The client user as a GuildMember of this guild
   * @type {?GuildMember}
   * @readonly
   */
  get me() {
    return this.members.get(this.client.user.id);
  }

  /**
   * Returns the GuildMember form of a User object, if the user is present in the guild.
   * @param {UserResolvable} user The user that you want to obtain the GuildMember of
   * @returns {?GuildMember}
   * @example
   * // Get the guild member of a user
   * const member = guild.member(message.author);
   */
  member(user) {
    return this.members.resolve(user);
  }

  /**
   * Fetch a collection of banned users in this guild.
   * The returned collection contains user objects keyed under `user` and reasons keyed under `reason`.
   * @returns {Promise<Collection<Snowflake, Object>>}
   */
  fetchBans() {
    return this.client.api.guilds(this.id).bans.get().then(bans =>
      bans.reduce((collection, ban) => {
        collection.set(ban.user.id, {
          reason: ban.reason,
          user: this.client.users.create(ban.user),
        });
        return collection;
      }, new Collection())
    );
  }

  /**
   * Fetch a collection of invites to this guild.
   * Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites() {
    return this.client.api.guilds(this.id).invites.get()
      .then(inviteItems => {
        const invites = new Collection();
        for (const inviteItem of inviteItems) {
          const invite = new Invite(this.client, inviteItem);
          invites.set(invite.code, invite);
        }
        return invites;
      });
  }

  /**
   * Fetch all webhooks for the guild.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   */
  fetchWebhooks() {
    return this.client.api.guilds(this.id).webhooks.get().then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  /**
   * Fetch available voice regions.
   * @returns {Promise<Collection<string, VoiceRegion>>}
   */
  fetchVoiceRegions() {
    return this.client.api.guilds(this.id).regions.get().then(res => {
      const regions = new Collection();
      for (const region of res) regions.set(region.id, new VoiceRegion(region));
      return regions;
    });
  }

  /**
   * Fetch audit logs for this guild.
   * @param {Object} [options={}] Options for fetching audit logs
   * @param {Snowflake|GuildAuditLogsEntry} [options.before] Limit to entries from before specified entry
   * @param {Snowflake|GuildAuditLogsEntry} [options.after] Limit to entries from after specified entry
   * @param {number} [options.limit] Limit number of entries
   * @param {UserResolvable} [options.user] Only show entries involving this user
   * @param {ActionType|number} [options.type] Only show entries involving this action type
   * @returns {Promise<GuildAuditLogs>}
   */
  fetchAuditLogs(options = {}) {
    if (options.before && options.before instanceof GuildAuditLogs.Entry) options.before = options.before.id;
    if (options.after && options.after instanceof GuildAuditLogs.Entry) options.after = options.after.id;
    if (typeof options.type === 'string') options.type = GuildAuditLogs.Actions[options.type];

    return this.client.api.guilds(this.id)['audit-logs'].get({ query: {
      before: options.before,
      after: options.after,
      limit: options.limit,
      user_id: this.client.users.resolveID(options.user),
      action_type: options.type,
    } })
      .then(data => GuildAuditLogs.build(this, data));
  }

  /**
   * Adds a user to the guild using OAuth2. Requires the `CREATE_INSTANT_INVITE` permission.
   * @param {UserResolvable} user User to add to the guild
   * @param {Object} options Options for the addition
   * @param {string} options.accessToken An OAuth2 access token for the user with the `guilds.join` scope granted to the
   * bot's application
   * @param {string} [options.nick] Nickname to give the member (requires `MANAGE_NICKNAMES`)
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} [options.roles] Roles to add to the member
   * (requires `MANAGE_ROLES`)
   * @param {boolean} [options.mute] Whether the member should be muted (requires `MUTE_MEMBERS`)
   * @param {boolean} [options.deaf] Whether the member should be deafened (requires `DEAFEN_MEMBERS`)
   * @returns {Promise<GuildMember>}
   */
  addMember(user, options) {
    if (this.members.has(user.id)) return Promise.resolve(this.members.get(user.id));
    options.access_token = options.accessToken;
    if (options.roles) {
      const roles = [];
      for (let role of options.roles instanceof Collection ? options.roles.values() : options.roles) {
        role = this.roles.resolve(role);
        if (!role) {
          return Promise.reject(new TypeError('INVALID_TYPE', 'options.roles',
            'Array or Collection of Roles or Snowflakes', true));
        }
        roles.push(role.id);
      }
    }
    return this.client.api.guilds(this.id).members(user.id).put({ data: options })
      .then(data => this.client.actions.GuildMemberGet.handle(this, data).member);
  }

  /**
   * Performs a search within the entire guild.
   * <warn>This is only available when using a user account.</warn>
   * @param {MessageSearchOptions} [options={}] Options to pass to the search
   * @returns {Promise<MessageSearchResult>}
   * @example
   * guild.search({
   *   content: 'discord.js',
   *   before: '2016-11-17'
   * }).then(res => {
   *   const hit = res.results[0].find(m => m.hit).content;
   *   console.log(`I found: **${hit}**, total results: ${res.total}`);
   * }).catch(console.error);
   */
  search(options = {}) {
    return Shared.search(this, options);
  }

  /**
   * The data for editing a guild.
   * @typedef {Object} GuildEditData
   * @property {string} [name] The name of the guild
   * @property {string} [region] The region of the guild
   * @property {number} [verificationLevel] The verification level of the guild
   * @property {number} [explicitContentFilter] The level of the explicit content filter
   * @property {ChannelResolvable} [afkChannel] The AFK channel of the guild
   * @property {ChannelResolvable} [systemChannel] The system channel of the guild
   * @property {number} [afkTimeout] The AFK timeout of the guild
   * @property {Base64Resolvable} [icon] The icon of the guild
   * @property {GuildMemberResolvable} [owner] The owner of the guild
   * @property {Base64Resolvable} [splash] The splash screen of the guild
   */

  /**
   * Updates the guild with new information - e.g. a new name.
   * @param {GuildEditData} data The data to update the guild with
   * @param {string} [reason] Reason for editing this guild
   * @returns {Promise<Guild>}
   * @example
   * // Set the guild name and region
   * guild.edit({
   *   name: 'Discord Guild',
   *   region: 'london',
   * })
   *   .then(updated => console.log(`New guild name ${updated.name} in region ${updated.region}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    const _data = {};
    if (data.name) _data.name = data.name;
    if (data.region) _data.region = data.region;
    if (typeof data.verificationLevel !== 'undefined') _data.verification_level = Number(data.verificationLevel);
    if (typeof data.afkChannel !== 'undefined') {
      _data.afk_channel_id = this.client.channels.resolveID(data.afkChannel);
    }
    if (typeof data.systemChannel !== 'undefined') {
      _data.system_channel_id = this.client.channels.resolveID(data.systemChannel);
    }
    if (data.afkTimeout) _data.afk_timeout = Number(data.afkTimeout);
    if (typeof data.icon !== 'undefined') _data.icon = data.icon;
    if (data.owner) _data.owner_id = this.client.users.resolve(data.owner).id;
    if (data.splash) _data.splash = data.splash;
    if (typeof data.explicitContentFilter !== 'undefined') {
      _data.explicit_content_filter = Number(data.explicitContentFilter);
    }
    return this.client.api.guilds(this.id).patch({ data: _data, reason })
      .then(newData => this.client.actions.GuildUpdate.handle(newData).updated);
  }

  /**
   * Edit the level of the explicit content filter.
   * @param {number} explicitContentFilter The new level of the explicit content filter
   * @param {string} [reason] Reason for changing the level of the guild's explicit content filter
   * @returns {Promise<Guild>}
   */
  setExplicitContentFilter(explicitContentFilter, reason) {
    return this.edit({ explicitContentFilter }, reason);
  }

  /**
   * Edit the name of the guild.
   * @param {string} name The new name of the guild
   * @param {string} [reason] Reason for changing the guild's name
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild name
   * guild.setName('Discord Guild')
   *  .then(updated => console.log(`Updated guild name to ${guild.name}`))
   *  .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Edit the region of the guild.
   * @param {string} region The new region of the guild
   * @param {string} [reason] Reason for changing the guild's region
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild region
   * guild.setRegion('london')
   *  .then(updated => console.log(`Updated guild region to ${guild.region}`))
   *  .catch(console.error);
   */
  setRegion(region, reason) {
    return this.edit({ region }, reason);
  }

  /**
   * Edit the verification level of the guild.
   * @param {number} verificationLevel The new verification level of the guild
   * @param {string} [reason] Reason for changing the guild's verification level
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild verification level
   * guild.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated guild verification level to ${guild.verificationLevel}`))
   *  .catch(console.error);
   */
  setVerificationLevel(verificationLevel, reason) {
    return this.edit({ verificationLevel }, reason);
  }

  /**
   * Edit the AFK channel of the guild.
   * @param {ChannelResolvable} afkChannel The new AFK channel
   * @param {string} [reason] Reason for changing the guild's AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel}`))
   *  .catch(console.error);
   */
  setAFKChannel(afkChannel, reason) {
    return this.edit({ afkChannel }, reason);
  }

  /**
   * Edit the system channel of the guild.
   * @param {ChannelResolvable} systemChannel The new system channel
   * @param {string} [reason] Reason for changing the guild's system channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild system channel
   * guild.setSystemChannel(channel)
   *  .then(updated => console.log(`Updated guild system channel to ${guild.systemChannel}`))
   *  .catch(console.error);
   */
  setSystemChannel(systemChannel, reason) {
    return this.edit({ systemChannel }, reason);
  }

  /**
   * Edit the AFK timeout of the guild.
   * @param {number} afkTimeout The time in seconds that a user must be idle to be considered AFK
   * @param {string} [reason] Reason for changing the guild's AFK timeout
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKTimeout(60)
   *  .then(updated => console.log(`Updated guild AFK timeout to ${guild.afkTimeout}`))
   *  .catch(console.error);
   */
  setAFKTimeout(afkTimeout, reason) {
    return this.edit({ afkTimeout }, reason);
  }

  /**
   * Set a new guild icon.
   * @param {Base64Resolvable|BufferResolvable} icon The new icon of the guild
   * @param {string} [reason] Reason for changing the guild's icon
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild icon
   * guild.setIcon('./icon.png')
   *  .then(updated => console.log('Updated the guild icon'))
   *  .catch(console.error);
   */
  async setIcon(icon, reason) {
    return this.edit({ icon: await DataResolver.resolveImage(icon), reason });
  }

  /**
   * Sets a new owner of the guild.
   * @param {GuildMemberResolvable} owner The new owner of the guild
   * @param {string} [reason] Reason for setting the new owner
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild owner
   * guild.setOwner(guild.members.first())
   *  .then(updated => console.log(`Updated the guild owner to ${updated.owner.username}`))
   *  .catch(console.error);
   */
  setOwner(owner, reason) {
    return this.edit({ owner }, reason);
  }

  /**
   * Set a new guild splash screen.
   * @param {Base64Resolvable|BufferResolvable} splash The new splash screen of the guild
   * @param {string} [reason] Reason for changing the guild's splash screen
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild splash
   * guild.setSplash('./splash.png')
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.error);
   */
  async setSplash(splash, reason) {
    return this.edit({ splash: await DataResolver.resolveImage(splash), reason });
  }

  /**
   * Sets the position of the guild in the guild listing.
   * <warn>This is only available when using a user account.</warn>
   * @param {number} position Absolute or relative position
   * @param {boolean} [relative=false] Whether to position relatively or absolutely
   * @returns {Promise<Guild>}
   */
  setPosition(position, relative) {
    if (this.client.user.bot) {
      return Promise.reject(new Error('FEATURE_USER_ONLY'));
    }
    return this.client.user.settings.setGuildPosition(this, position, relative);
  }

  /**
   * Marks all messages in this guild as read.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<Guild>}
   */
  acknowledge() {
    return this.client.api.guilds(this.id).ack
      .post({ data: { token: this.client.rest._ackToken } })
      .then(res => {
        if (res.token) this.client.rest._ackToken = res.token;
        return this;
      });
  }

  /**
   * Allow direct messages from guild members.
   * <warn>This is only available when using a user account.</warn>
   * @param {boolean} allow Whether to allow direct messages
   * @returns {Promise<Guild>}
   */
  allowDMs(allow) {
    const settings = this.client.user.settings;
    if (allow) return settings.removeRestrictedGuild(this);
    else return settings.addRestrictedGuild(this);
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {Object|number|string} [options] Ban options. If a number, the number of days to delete messages for, if a
   * string, the ban reason. Supplying an object allows you to do both.
   * @param {number} [options.days=0] Number of days of messages to delete
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<GuildMember|User|string>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user ID will be the result.
   * @example
   * // Ban a user by ID (or with a user/guild member object)
   * guild.ban('some user ID')
   *   .then(user => console.log(`Banned ${user.username || user.id || user} from ${guild.name}`))
   *   .catch(console.error);
   */
  ban(user, options = { days: 0 }) {
    if (options.days) options['delete-message-days'] = options.days;
    const id = this.client.users.resolveID(user);
    if (!id) return Promise.reject(new Error('BAN_RESOLVE_ID', true));
    return this.client.api.guilds(this.id).bans[id].put({ query: options })
      .then(() => {
        if (user instanceof GuildMember) return user;
        const _user = this.client.users.resolve(id);
        if (_user) {
          const member = this.members.resolve(_user);
          return member || _user;
        }
        return id;
      });
  }

  /**
   * Unbans a user from the guild.
   * @param {UserResolvable} user The user to unban
   * @param {string} [reason] Reason for unbanning user
   * @returns {Promise<User>}
   * @example
   * // Unban a user by ID (or with a user/guild member object)
   * guild.unban('some user ID')
   *   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *   .catch(console.error);
   */
  unban(user, reason) {
    const id = this.client.users.resolveID(user);
    if (!id) throw new Error('BAN_RESOLVE_ID');
    return this.client.api.guilds(this.id).bans[id].delete({ reason })
      .then(() => user);
  }

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * @param {Object} [options] Prune options
   * @param {number} [options.days=7] Number of days of inactivity required to kick
   * @param {boolean} [options.dry=false] Get number of users that will be kicked, without actually kicking them
   * @param {string} [options.reason] Reason for this prune
   * @returns {Promise<number>} The number of members that were/will be kicked
   * @example
   * // See how many members will be pruned
   * guild.pruneMembers({ dry: true })
   *   .then(pruned => console.log(`This will prune ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // Actually prune the members
   * guild.pruneMembers({ days: 1, reason: 'too many people!' })
   *   .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *   .catch(console.error);
   */
  pruneMembers({ days = 7, dry = false, reason } = {}) {
    if (typeof days !== 'number') throw new TypeError('PRUNE_DAYS_TYPE');
    return this.client.api.guilds(this.id).prune[dry ? 'get' : 'post']({ query: { days }, reason })
      .then(data => data.pruned);
  }

  /**
   * Syncs this guild (already done automatically every 30 seconds).
   * <warn>This is only available when using a user account.</warn>
   */
  sync() {
    if (!this.client.user.bot) this.client.syncGuilds([this]);
  }

  /**
   * Can be used to overwrite permissions when creating a channel.
   * @typedef {Object} ChannelCreationOverwrites
   * @property {PermissionResolvable[]|number} [allow] The permissions to allow
   * @property {PermissionResolvable[]|number} [deny] The permissions to deny
   * @property {RoleResolvable|UserResolvable} id ID of the role or member this overwrite is for
   */

  /**
   * Creates a new channel in the guild.
   * @param {string} name The name of the new channel
   * @param {string} type The type of the new channel, either `text`, `voice`, or `category`
   * @param {Object} [options] Options
   * @param {boolean} [options.nsfw] Whether the new channel is nsfw
   * @param {number} [options.bitrate] Bitrate of the new channel in bits (only voice)
   * @param {number} [options.userLimit] Maximum amount of users allowed in the new channel (only voice)
   * @param {ChannelResolvable} [options.parent] Parent of the new channel
   * @param {Array<PermissionOverwrites|ChannelCreationOverwrites>} [options.overwrites] Permission overwrites
   * @param {string} [options.reason] Reason for creating the channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create a new text channel
   * guild.createChannel('new-general', 'text')
   *   .then(channel => console.log(`Created new channel ${channel}`))
   *   .catch(console.error);
   */
  createChannel(name, type, { nsfw, bitrate, userLimit, parent, overwrites, reason } = {}) {
    if (overwrites instanceof Collection || overwrites instanceof Array) {
      overwrites = overwrites.map(overwrite => {
        let allow = overwrite.allow || (overwrite.allowed ? overwrite.allowed.bitfield : 0);
        let deny = overwrite.deny || (overwrite.denied ? overwrite.denied.bitfield : 0);
        if (allow instanceof Array) allow = Permissions.resolve(allow);
        if (deny instanceof Array) deny = Permissions.resolve(deny);

        const role = this.roles.resolve(overwrite.id);
        if (role) {
          overwrite.id = role.id;
          overwrite.type = 'role';
        } else {
          overwrite.id = this.client.users.resolveID(overwrite.id);
          overwrite.type = 'member';
        }

        return {
          allow,
          deny,
          type: overwrite.type,
          id: overwrite.id,
        };
      });
    }

    if (parent) parent = this.client.channels.resolveID(parent);
    return this.client.api.guilds(this.id).channels.post({
      data: {
        name,
        type: ChannelTypes[type.toUpperCase()],
        nsfw,
        bitrate,
        user_limit: userLimit,
        parent_id: parent,
        permission_overwrites: overwrites,
      },
      reason,
    }).then(data => this.client.actions.ChannelCreate.handle(data).channel);
  }

  /**
   * The data needed for updating a channel's position.
   * @typedef {Object} ChannelPosition
   * @property {ChannelResolvable} channel Channel to update
   * @property {number} position New position for the channel
   */

  /**
   * Batch-updates the guild's channels' positions.
   * @param {ChannelPosition[]} channelPositions Channel positions to update
   * @returns {Promise<Guild>}
   * @example
   * guild.setChannelPositions([{ channel: channelID, position: newChannelIndex }])
   *   .then(guild => console.log(`Updated channel positions for ${guild.id}`))
   *   .catch(console.error);
   */
  setChannelPositions(channelPositions) {
    const updatedChannels = channelPositions.map(r => ({
      id: this.client.channels.resolveID(r.channel),
      position: r.position,
    }));

    return this.client.api.guilds(this.id).channels.patch({ data: updatedChannels }).then(() =>
      this.client.actions.GuildChannelsPositionUpdate.handle({
        guild_id: this.id,
        channels: updatedChannels,
      }).guild
    );
  }

  /**
   * Creates a new role in the guild with given information
   * <warn>The position will silently reset to 1 if an invalid one is provided, or none.</warn>
   * @param {Object} [options] Options
   * @param {RoleData} [options.data] The data to update the role with
   * @param {string} [options.reason] Reason for creating this role
   * @returns {Promise<Role>}
   * @example
   * // Create a new role
   * guild.createRole()
   *   .then(role => console.log(`Created role ${role}`))
   *   .catch(console.error);
   * @example
   * // Create a new role with data and a reason
   * guild.createRole({
   *   data: {
   *     name: 'Super Cool People',
   *     color: 'BLUE',
   *   },
   *   reason: 'we needed a role for Super Cool People',
   * })
   *   .then(role => console.log(`Created role ${role}`))
   *   .catch(console.error)
   */
  createRole({ data = {}, reason } = {}) {
    if (data.color) data.color = Util.resolveColor(data.color);
    if (data.permissions) data.permissions = Permissions.resolve(data.permissions);

    return this.client.api.guilds(this.id).roles.post({ data, reason }).then(r => {
      const { role } = this.client.actions.GuildRoleCreate.handle({
        guild_id: this.id,
        role: r,
      });
      if (data.position) return role.setPosition(data.position, reason);
      return role;
    });
  }

  /**
   * Creates a new custom emoji in the guild.
   * @param {BufferResolvable|Base64Resolvable} attachment The image for the emoji
   * @param {string} name The name for the emoji
   * @param {Object} [options] Options
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} [options.roles] Roles to limit the emoji to
   * @param {string} [options.reason] Reason for creating the emoji
   * @returns {Promise<Emoji>} The created emoji
   * @example
   * // Create a new emoji from a url
   * guild.createEmoji('https://i.imgur.com/w3duR07.png', 'rip')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new emoji from a file on your computer
   * guild.createEmoji('./memes/banana.png', 'banana')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   */
  createEmoji(attachment, name, { roles, reason } = {}) {
    if (typeof attachment === 'string' && attachment.startsWith('data:')) {
      const data = { image: attachment, name };
      if (roles) {
        data.roles = [];
        for (let role of roles instanceof Collection ? roles.values() : roles) {
          role = this.roles.resolve(role);
          if (!role) {
            return Promise.reject(new TypeError('INVALID_TYPE', 'options.roles',
              'Array or Collection of Roles or Snowflakes', true));
          }
          data.roles.push(role.id);
        }
      }

      return this.client.api.guilds(this.id).emojis.post({ data, reason })
        .then(emoji => this.client.actions.GuildEmojiCreate.handle(this, emoji).emoji);
    }

    return DataResolver.resolveImage(attachment)
      .then(image => this.createEmoji(image, name, { roles, reason }));
  }

  /**
   * Causes the client to leave the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Leave a guild
   * guild.leave()
   *   .then(g => console.log(`Left the guild ${g}`))
   *   .catch(console.error);
   */
  leave() {
    if (this.ownerID === this.client.user.id) return Promise.reject(new Error('GUILD_OWNED'));
    return this.client.api.users('@me').guilds(this.id).delete()
      .then(() => this.client.actions.GuildDelete.handle({ id: this.id }).guild);
  }

  /**
   * Causes the client to delete the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Delete a guild
   * guild.delete()
   *   .then(g => console.log(`Deleted the guild ${g}`))
   *   .catch(console.error);
   */
  delete() {
    return this.client.api.guilds(this.id).delete()
      .then(() => this.client.actions.GuildDelete.handle({ id: this.id }).guild);
  }

  /**
   * Whether this guild equals another guild. It compares all properties, so for most operations
   * it is advisable to just compare `guild.id === guild2.id` as it is much faster and is often
   * what most users need.
   * @param {Guild} guild The guild to compare with
   * @returns {boolean}
   */
  equals(guild) {
    let equal =
      guild &&
      guild instanceof this.constructor &&
      this.id === guild.id &&
      this.available === guild.available &&
      this.splash === guild.splash &&
      this.region === guild.region &&
      this.name === guild.name &&
      this.memberCount === guild.memberCount &&
      this.large === guild.large &&
      this.icon === guild.icon &&
      Util.arraysEqual(this.features, guild.features) &&
      this.ownerID === guild.ownerID &&
      this.verificationLevel === guild.verificationLevel &&
      this.embedEnabled === guild.embedEnabled;

    if (equal) {
      if (this.embedChannel) {
        if (!guild.embedChannel || this.embedChannel.id !== guild.embedChannel.id) equal = false;
      } else if (guild.embedChannel) {
        equal = false;
      }
    }

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the guild's name instead of the guild object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Guild!
   * console.log(`Hello from ${guild}!`);
   * @example
   * // Logs: Hello from My Guild!
   * console.log('Hello from ' + guild + '!');
   */
  toString() {
    return this.name;
  }

  _memberSpeakUpdate(user, speaking) {
    const member = this.members.get(user);
    if (member && member.speaking !== speaking) {
      member.speaking = speaking;
      /**
       * Emitted once a guild member starts/stops speaking.
       * @event Client#guildMemberSpeaking
       * @param {GuildMember} member The member that started/stopped speaking
       * @param {boolean} speaking Whether or not the member is speaking
       */
      this.client.emit(Events.GUILD_MEMBER_SPEAKING, member, speaking);
    }
  }

  _sortedRoles() {
    return Util.discordSort(this.roles);
  }

  _sortedChannels(channel) {
    const category = channel.type === ChannelTypes.CATEGORY;
    return Util.discordSort(this.channels.filter(c =>
      c.type === channel.type && (category || c.parent === channel.parent)));
  }
}

class VoiceStateCollection extends Collection {
  constructor(guild) {
    super();
    this.guild = guild;
  }
  set(id, voiceState) {
    const member = this.guild.members.get(id);
    if (member) {
      if (member.voiceChannel && member.voiceChannel.id !== voiceState.channel_id) {
        member.voiceChannel.members.delete(member.id);
      }
      if (!voiceState.channel_id) member.speaking = null;
      const newChannel = this.guild.channels.get(voiceState.channel_id);
      if (newChannel) newChannel.members.set(member.user.id, member);
    }
    super.set(id, voiceState);
  }
}

module.exports = Guild;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>
 Copyright 2009 The Closure Library Authors. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS-IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/long.js for details
 */
(function(global, factory) {

    /* AMD */ if (true)
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    /* CommonJS */ else if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
        module["exports"] = factory();
    /* Global */ else
        (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();

})(this, function() {
    "use strict";

    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @constructor
     */
    function Long(low, high, unsigned) {

        /**
         * The low 32 bits as a signed value.
         * @type {number}
         */
        this.low = low | 0;

        /**
         * The high 32 bits as a signed value.
         * @type {number}
         */
        this.high = high | 0;

        /**
         * Whether unsigned or not.
         * @type {boolean}
         */
        this.unsigned = !!unsigned;
    }

    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.

    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @private
     */
    Long.prototype.__isLong__;

    Object.defineProperty(Long.prototype, "__isLong__", {
        value: true,
        enumerable: false,
        configurable: false
    });

    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */
    function isLong(obj) {
        return (obj && obj["__isLong__"]) === true;
    }

    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     */
    Long.isLong = isLong;

    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */
    var INT_CACHE = {};

    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */
    var UINT_CACHE = {};

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = (0 <= value && value < 256)) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache)
                UINT_CACHE[value] = obj;
            return obj;
        } else {
            value |= 0;
            if (cache = (-128 <= value && value < 128)) {
                cachedObj = INT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache)
                INT_CACHE[value] = obj;
            return obj;
        }
    }

    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromInt = fromInt;

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromNumber(value, unsigned) {
        if (isNaN(value) || !isFinite(value))
            return unsigned ? UZERO : ZERO;
        if (unsigned) {
            if (value < 0)
                return UZERO;
            if (value >= TWO_PWR_64_DBL)
                return MAX_UNSIGNED_VALUE;
        } else {
            if (value <= -TWO_PWR_63_DBL)
                return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL)
                return MAX_VALUE;
        }
        if (value < 0)
            return fromNumber(-value, unsigned).neg();
        return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromNumber = fromNumber;

    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }

    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromBits = fromBits;

    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */
    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */
    function fromString(str, unsigned, radix) {
        if (str.length === 0)
            throw Error('empty string');
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
            return ZERO;
        if (typeof unsigned === 'number') {
            // For goog.math.long compatibility
            radix = unsigned,
            unsigned = false;
        } else {
            unsigned = !! unsigned;
        }
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');

        var p;
        if ((p = str.indexOf('-')) > 0)
            throw Error('interior hyphen');
        else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8));

        var result = ZERO;
        for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i),
                value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }

    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     */
    Long.fromString = fromString;

    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @returns {!Long}
     * @inner
     */
    function fromValue(val) {
        if (val /* is compatible */ instanceof Long)
            return val;
        if (typeof val === 'number')
            return fromNumber(val);
        if (typeof val === 'string')
            return fromString(val);
        // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, val.unsigned);
    }

    /**
     * Converts the specified value to a Long.
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @returns {!Long}
     */
    Long.fromValue = fromValue;

    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_16_DBL = 1 << 16;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_24_DBL = 1 << 24;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

    /**
     * @type {!Long}
     * @const
     * @inner
     */
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

    /**
     * @type {!Long}
     * @inner
     */
    var ZERO = fromInt(0);

    /**
     * Signed zero.
     * @type {!Long}
     */
    Long.ZERO = ZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var UZERO = fromInt(0, true);

    /**
     * Unsigned zero.
     * @type {!Long}
     */
    Long.UZERO = UZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var ONE = fromInt(1);

    /**
     * Signed one.
     * @type {!Long}
     */
    Long.ONE = ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var UONE = fromInt(1, true);

    /**
     * Unsigned one.
     * @type {!Long}
     */
    Long.UONE = UONE;

    /**
     * @type {!Long}
     * @inner
     */
    var NEG_ONE = fromInt(-1);

    /**
     * Signed negative one.
     * @type {!Long}
     */
    Long.NEG_ONE = NEG_ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

    /**
     * Maximum signed value.
     * @type {!Long}
     */
    Long.MAX_VALUE = MAX_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

    /**
     * Maximum unsigned value.
     * @type {!Long}
     */
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MIN_VALUE = fromBits(0, 0x80000000|0, false);

    /**
     * Minimum signed value.
     * @type {!Long}
     */
    Long.MIN_VALUE = MIN_VALUE;

    /**
     * @alias Long.prototype
     * @inner
     */
    var LongPrototype = Long.prototype;

    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @returns {number}
     */
    LongPrototype.toInt = function toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    };

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @returns {number}
     */
    LongPrototype.toNumber = function toNumber() {
        if (this.unsigned)
            return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };

    /**
     * Converts the Long to a string written in the specified radix.
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     */
    LongPrototype.toString = function toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');
        if (this.isZero())
            return '0';
        if (this.isNegative()) { // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix),
                    div = this.div(radixLong),
                    rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else
                return '-' + this.neg().toString(radix);
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
            rem = this;
        var result = '';
        while (true) {
            var remDiv = rem.div(radixToPower),
                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero())
                return digits + result;
            else {
                while (digits.length < 6)
                    digits = '0' + digits;
                result = '' + digits + result;
            }
        }
    };

    /**
     * Gets the high 32 bits as a signed integer.
     * @returns {number} Signed high bits
     */
    LongPrototype.getHighBits = function getHighBits() {
        return this.high;
    };

    /**
     * Gets the high 32 bits as an unsigned integer.
     * @returns {number} Unsigned high bits
     */
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
        return this.high >>> 0;
    };

    /**
     * Gets the low 32 bits as a signed integer.
     * @returns {number} Signed low bits
     */
    LongPrototype.getLowBits = function getLowBits() {
        return this.low;
    };

    /**
     * Gets the low 32 bits as an unsigned integer.
     * @returns {number} Unsigned low bits
     */
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
        return this.low >>> 0;
    };

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @returns {number}
     */
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
        if (this.isNegative()) // Unsigned Longs are never negative
            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for (var bit = 31; bit > 0; bit--)
            if ((val & (1 << bit)) != 0)
                break;
        return this.high != 0 ? bit + 33 : bit + 1;
    };

    /**
     * Tests if this Long's value equals zero.
     * @returns {boolean}
     */
    LongPrototype.isZero = function isZero() {
        return this.high === 0 && this.low === 0;
    };

    /**
     * Tests if this Long's value is negative.
     * @returns {boolean}
     */
    LongPrototype.isNegative = function isNegative() {
        return !this.unsigned && this.high < 0;
    };

    /**
     * Tests if this Long's value is positive.
     * @returns {boolean}
     */
    LongPrototype.isPositive = function isPositive() {
        return this.unsigned || this.high >= 0;
    };

    /**
     * Tests if this Long's value is odd.
     * @returns {boolean}
     */
    LongPrototype.isOdd = function isOdd() {
        return (this.low & 1) === 1;
    };

    /**
     * Tests if this Long's value is even.
     * @returns {boolean}
     */
    LongPrototype.isEven = function isEven() {
        return (this.low & 1) === 0;
    };

    /**
     * Tests if this Long's value equals the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.equals = function equals(other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
            return false;
        return this.high === other.high && this.low === other.low;
    };

    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.eq = LongPrototype.equals;

    /**
     * Tests if this Long's value differs from the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.notEquals = function notEquals(other) {
        return !this.eq(/* validates */ other);
    };

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.neq = LongPrototype.notEquals;

    /**
     * Tests if this Long's value is less than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThan = function lessThan(other) {
        return this.comp(/* validates */ other) < 0;
    };

    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lt = LongPrototype.lessThan;

    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
        return this.comp(/* validates */ other) <= 0;
    };

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lte = LongPrototype.lessThanOrEqual;

    /**
     * Tests if this Long's value is greater than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThan = function greaterThan(other) {
        return this.comp(/* validates */ other) > 0;
    };

    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gt = LongPrototype.greaterThan;

    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
        return this.comp(/* validates */ other) >= 0;
    };

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

    /**
     * Compares this Long's value with the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.compare = function compare(other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.eq(other))
            return 0;
        var thisNeg = this.isNegative(),
            otherNeg = other.isNegative();
        if (thisNeg && !otherNeg)
            return -1;
        if (!thisNeg && otherNeg)
            return 1;
        // At this point the sign bits are the same
        if (!this.unsigned)
            return this.sub(other).isNegative() ? -1 : 1;
        // Both are positive if at least one is unsigned
        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
    };

    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.comp = LongPrototype.compare;

    /**
     * Negates this Long's value.
     * @returns {!Long} Negated Long
     */
    LongPrototype.negate = function negate() {
        if (!this.unsigned && this.eq(MIN_VALUE))
            return MIN_VALUE;
        return this.not().add(ONE);
    };

    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     */
    LongPrototype.neg = LongPrototype.negate;

    /**
     * Returns the sum of this and the specified Long.
     * @param {!Long|number|string} addend Addend
     * @returns {!Long} Sum
     */
    LongPrototype.add = function add(addend) {
        if (!isLong(addend))
            addend = fromValue(addend);

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;

        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the difference of this and the specified Long.
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.subtract = function subtract(subtrahend) {
        if (!isLong(subtrahend))
            subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };

    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.sub = LongPrototype.subtract;

    /**
     * Returns the product of this and the specified Long.
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.multiply = function multiply(multiplier) {
        if (this.isZero())
            return ZERO;
        if (!isLong(multiplier))
            multiplier = fromValue(multiplier);
        if (multiplier.isZero())
            return ZERO;
        if (this.eq(MIN_VALUE))
            return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE))
            return this.isOdd() ? MIN_VALUE : ZERO;

        if (this.isNegative()) {
            if (multiplier.isNegative())
                return this.neg().mul(multiplier.neg());
            else
                return this.neg().mul(multiplier).neg();
        } else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();

        // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
            return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;

        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.mul = LongPrototype.multiply;

    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.divide = function divide(divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        if (divisor.isZero())
            throw Error('division by zero');
        if (this.isZero())
            return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                    return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE))
                    return ONE;
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE;
                    } else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            } else if (divisor.eq(MIN_VALUE))
                return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative())
                    return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative())
                return this.div(divisor.neg()).neg();
            res = ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned)
                divisor = divisor.toUnsigned();
            if (divisor.gt(this))
                return UZERO;
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
                return UONE;
            res = UZERO;
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
                delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
                approxRes = fromNumber(approx),
                approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero())
                approxRes = ONE;

            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };

    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.div = LongPrototype.divide;

    /**
     * Returns this Long modulo the specified.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.modulo = function modulo(divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        return this.sub(this.div(divisor).mul(divisor));
    };

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.mod = LongPrototype.modulo;

    /**
     * Returns the bitwise NOT of this Long.
     * @returns {!Long}
     */
    LongPrototype.not = function not() {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };

    /**
     * Returns the bitwise AND of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.and = function and(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };

    /**
     * Returns the bitwise OR of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.or = function or(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };

    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.xor = function xor(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
        else
            return fromBits(0, this.low << (numBits - 32), this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shl = LongPrototype.shiftLeft;

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRight = function shiftRight(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
        else
            return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
    };

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shr = LongPrototype.shiftRight;

    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        numBits &= 63;
        if (numBits === 0)
            return this;
        else {
            var high = this.high;
            if (numBits < 32) {
                var low = this.low;
                return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
            } else if (numBits === 32)
                return fromBits(high, 0, this.unsigned);
            else
                return fromBits(high >>> (numBits - 32), 0, this.unsigned);
        }
    };

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

    /**
     * Converts this Long to signed.
     * @returns {!Long} Signed long
     */
    LongPrototype.toSigned = function toSigned() {
        if (!this.unsigned)
            return this;
        return fromBits(this.low, this.high, false);
    };

    /**
     * Converts this Long to unsigned.
     * @returns {!Long} Unsigned long
     */
    LongPrototype.toUnsigned = function toUnsigned() {
        if (this.unsigned)
            return this;
        return fromBits(this.low, this.high, true);
    };

    /**
     * Converts this Long to its byte representation.
     * @param {boolean=} le Whether little or big endian, defaults to big endian
     * @returns {!Array.<number>} Byte representation
     */
    LongPrototype.toBytes = function(le) {
        return le ? this.toBytesLE() : this.toBytesBE();
    }

    /**
     * Converts this Long to its little endian byte representation.
     * @returns {!Array.<number>} Little endian byte representation
     */
    LongPrototype.toBytesLE = function() {
        var hi = this.high,
            lo = this.low;
        return [
             lo         & 0xff,
            (lo >>>  8) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>> 24) & 0xff,
             hi         & 0xff,
            (hi >>>  8) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>> 24) & 0xff
        ];
    }

    /**
     * Converts this Long to its big endian byte representation.
     * @returns {!Array.<number>} Big endian byte representation
     */
    LongPrototype.toBytesBE = function() {
        var hi = this.high,
            lo = this.low;
        return [
            (hi >>> 24) & 0xff,
            (hi >>> 16) & 0xff,
            (hi >>>  8) & 0xff,
             hi         & 0xff,
            (lo >>> 24) & 0xff,
            (lo >>> 16) & 0xff,
            (lo >>>  8) & 0xff,
             lo         & 0xff
        ];
    }

    return Long;
});


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(58);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(59);
exports.encode = exports.stringify = __webpack_require__(60);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(19);
const RESTManager = __webpack_require__(37);
const Util = __webpack_require__(5);
const { DefaultOptions } = __webpack_require__(0);

/**
 * The base class for all clients.
 * @extends {EventEmitter}
 */
class BaseClient extends EventEmitter {
  constructor(options = {}) {
    super();

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = Util.mergeDefault(DefaultOptions, options);

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this, options._tokenType);

    /**
     * Timeouts set by {@link BaseClient#setTimeout} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._timeouts = new Set();

    /**
     * Intervals set by {@link BaseClient#setInterval} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._intervals = new Set();
  }

  /**
   * API shortcut
   * @type {Object}
   * @private
   */
  get api() {
    return this.rest.api;
  }

  /**
   * Destroys all assets used by the base client.
   */
  destroy() {
    for (const t of this._timeouts) clearTimeout(t);
    for (const i of this._intervals) clearInterval(i);
    this._timeouts.clear();
    this._intervals.clear();
  }

  /**
   * Sets a timeout that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setTimeout(fn, delay, ...args) {
    const timeout = setTimeout(() => {
      fn(...args);
      this._timeouts.delete(timeout);
    }, delay);
    this._timeouts.add(timeout);
    return timeout;
  }

  /**
   * Clears a timeout.
   * @param {Timeout} timeout Timeout to cancel
   */
  clearTimeout(timeout) {
    clearTimeout(timeout);
    this._timeouts.delete(timeout);
  }

  /**
   * Sets an interval that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait between executions (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setInterval(fn, delay, ...args) {
    const interval = setInterval(fn, delay, ...args);
    this._intervals.add(interval);
    return interval;
  }

  /**
   * Clears an interval.
   * @param {Timeout} interval Interval to cancel
   */
  clearInterval(interval) {
    clearInterval(interval);
    this._intervals.delete(interval);
  }
}

module.exports = BaseClient;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);
const EventEmitter = __webpack_require__(19);

/**
 * Filter to be applied to the collector.
 * @typedef {Function} CollectorFilter
 * @param {...*} args Any arguments received by the listener
 * @param {Collection} collection The items collected by this collector
 * @returns {boolean}
 */

/**
 * Options to be applied to the collector.
 * @typedef {Object} CollectorOptions
 * @property {number} [time] How long to run the collector for
 * @property {boolean} [dispose=false] Whether to dispose data when it's deleted
 */

/**
 * Abstract class for defining a new Collector.
 * @abstract
 */
class Collector extends EventEmitter {
  constructor(client, filter, options = {}) {
    super();

    /**
     * The client
     * @name Collector#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The filter applied to this collector
     * @type {CollectorFilter}
     */
    this.filter = filter;

    /**
     * The options of this collector
     * @type {CollectorOptions}
     */
    this.options = options;

    /**
     * The items collected by this collector
     * @type {Collection}
     */
    this.collected = new Collection();

    /**
     * Whether this collector has finished collecting
     * @type {boolean}
     */
    this.ended = false;

    /**
     * Timeout for cleanup
     * @type {?Timeout}
     * @private
     */
    this._timeout = null;

    this.handleCollect = this.handleCollect.bind(this);
    this.handleDispose = this.handleDispose.bind(this);

    if (options.time) this._timeout = this.client.setTimeout(() => this.stop('time'), options.time);
  }

  /**
   * Call this to handle an event as a collectable element. Accepts any event data as parameters.
   * @param {...*} args The arguments emitted by the listener
   * @emits Collector#collect
   */
  handleCollect(...args) {
    const collect = this.collect(...args);
    if (!collect || !this.filter(...args, this.collected)) return;

    this.collected.set(collect.key, collect.value);

    /**
     * Emitted whenever an element is collected.
     * @event Collector#collect
     * @param {*} element The element that got collected
     * @param {...*} args The arguments emitted by the listener
     */
    this.emit('collect', collect.value, ...args);
    this.checkEnd();
  }

  /**
   * Call this to remove an element from the collection. Accepts any event data as parameters.
   * @param {...*} args The arguments emitted by the listener
   * @emits Collector#dispose
   */
  handleDispose(...args) {
    if (!this.options.dispose) return;

    const dispose = this.dispose(...args);
    if (!dispose || !this.filter(...args) || !this.collected.has(dispose)) return;

    const value = this.collected.get(dispose);
    this.collected.delete(dispose);

    /**
     * Emitted whenever an element has been disposed.
     * @event Collector#dispose
     * @param {*} element The element that was disposed
     * @param {...*} args The arguments emitted by the listener
     */
    this.emit('dispose', value, ...args);
    this.checkEnd();
  }

  /**
   * Return a promise that resolves with the next collected element;
   * rejects with collected elements if the collector finishes without receving a next element
   * @type {Promise}
   * @readonly
   */
  get next() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('collect', onCollect);
        this.removeListener('end', onEnd);
      };

      const onCollect = item => {
        cleanup();
        resolve(item);
      };

      const onEnd = () => {
        cleanup();
        reject(this.collected); // eslint-disable-line prefer-promise-reject-errors
      };

      this.on('collect', onCollect);
      this.on('end', onEnd);
    });
  }

  /**
   * Stop this collector and emit the `end` event.
   * @param {string} [reason='user'] The reason this collector is ending
   * @emits Collector#end
   */
  stop(reason = 'user') {
    if (this.ended) return;

    if (this._timeout) this.client.clearTimeout(this._timeout);
    this.ended = true;

    /**
     * Emitted when the collector is finished collecting.
     * @event Collector#end
     * @param {Collection} collected The elements collected by the collector
     * @param {string} reason The reason the collector ended
     */
    this.emit('end', this.collected, reason);
  }

  /**
   * Check whether the collector should end, and if so, end it.
   */
  checkEnd() {
    const reason = this.endReason();
    if (reason) this.stop(reason);
  }

  /* eslint-disable no-empty-function, valid-jsdoc */
  /**
   * Handles incoming events from the `handleCollect` function. Returns null if the event should not
   * be collected, or returns an object describing the data that should be stored.
   * @see Collector#handleCollect
   * @param {...*} args Any args the event listener emits
   * @returns {?{key, value}} Data to insert into collection, if any
   * @abstract
   */
  collect() {}

  /**
   * Handles incoming events from the `handleDispose`. Returns null if the event should not
   * be disposed, or returns the key that should be removed.
   * @see Collector#handleDispose
   * @param {...*} args Any args the event listener emits
   * @returns {?*} Key to remove from the collection, if any
   * @abstract
   */
  dispose() {}

  /**
   * The reason this collector has ended or will end with.
   * @returns {?string} Reason to end the collector, if any
   * @abstract
   */
  endReason() {}
  /* eslint-enable no-empty-function, valid-jsdoc */
}

module.exports = Collector;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const Mentions = __webpack_require__(43);
const MessageAttachment = __webpack_require__(18);
const Embed = __webpack_require__(14);
const ReactionCollector = __webpack_require__(44);
const ClientApplication = __webpack_require__(31);
const Util = __webpack_require__(5);
const Collection = __webpack_require__(3);
const ReactionStore = __webpack_require__(81);
const { MessageTypes } = __webpack_require__(0);
const Permissions = __webpack_require__(9);
const GuildMember = __webpack_require__(12);
const Base = __webpack_require__(8);
const { Error, TypeError } = __webpack_require__(4);

/**
 * Represents a message on Discord.
 * @extends {Base}
 */
class Message extends Base {
  constructor(client, data, channel) {
    super(client);

    /**
     * The channel that the message was sent in
     * @type {TextChannel|DMChannel|GroupDMChannel}
     */
    this.channel = channel;

    if (data) this._patch(data);
  }

  _patch(data) { // eslint-disable-line complexity
    /**
     * The ID of the message
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of the message
     * @type {MessageType}
     */
    this.type = MessageTypes[data.type];

    /**
     * The content of the message
     * @type {string}
     */
    this.content = data.content;

    /**
     * The author of the message
     * @type {User}
     */
    this.author = this.client.users.create(data.author, !data.webhook_id);

    /**
     * Represents the author of the message as a guild member
     * Only available if the message comes from a guild where the author is still a member
     * @type {?GuildMember}
     */
    this.member = this.guild ? this.guild.member(this.author) || null : null;

    /**
     * Whether or not this message is pinned
     * @type {boolean}
     */
    this.pinned = data.pinned;

    /**
     * Whether or not the message was Text-To-Speech
     * @type {boolean}
     */
    this.tts = data.tts;

    /**
     * A random number or string used for checking message delivery
     * @type {string}
     */
    this.nonce = data.nonce;

    /**
     * Whether or not this message was sent by Discord, not actually a user (e.g. pin notifications)
     * @type {boolean}
     */
    this.system = data.type === 6;

    /**
     * A list of embeds in the message - e.g. YouTube Player
     * @type {MessageEmbed[]}
     */
    this.embeds = data.embeds.map(e => new Embed(e));

    /**
     * A collection of attachments in the message - e.g. Pictures - mapped by their ID
     * @type {Collection<Snowflake, MessageAttachment>}
     */
    this.attachments = new Collection();
    for (const attachment of data.attachments) {
      this.attachments.set(attachment.id, new MessageAttachment(
        attachment.url, attachment.filename, attachment
      ));
    }

    /**
     * The timestamp the message was sent at
     * @type {number}
     */
    this.createdTimestamp = new Date(data.timestamp).getTime();

    /**
     * The timestamp the message was last edited at (if applicable)
     * @type {?number}
     */
    this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp).getTime() : null;

    /**
     * A collection of reactions to this message, mapped by the reaction ID
     * @type {ReactionStore<Snowflake, MessageReaction>}
     */
    this.reactions = new ReactionStore(this);
    if (data.reactions && data.reactions.length > 0) {
      for (const reaction of data.reactions) {
        this.reactions.create(reaction);
      }
    }

    /**
     * All valid mentions that the message contains
     * @type {MessageMentions}
     */
    this.mentions = new Mentions(this, data.mentions, data.mention_roles, data.mention_everyone);

    /**
     * ID of the webhook that sent the message, if applicable
     * @type {?Snowflake}
     */
    this.webhookID = data.webhook_id || null;

    /**
     * Supplimental application information for group activities
     * @type {?ClientApplication}
     */
    this.application = data.application ? new ClientApplication(this.client, data.application) : null;

    /**
     * Group activity
     * @type {?Object}
     */
    this.activity = data.activity ? {
      partyID: data.activity.party_id,
      type: data.activity.type,
    } : null;

    /**
     * Whether this message is a hit in a search
     * @type {?boolean}
     */
    this.hit = typeof data.hit === 'boolean' ? data.hit : null;

    /**
     * The previous versions of the message, sorted with the most recent first
     * @type {Message[]}
     * @private
     */
    this._edits = [];
  }

  /**
   * Updates the message.
   * @param {Object} data Raw Discord message update data
   * @private
   */
  patch(data) {
    const clone = this._clone();
    this._edits.unshift(clone);

    this.editedTimestamp = new Date(data.edited_timestamp).getTime();
    if ('content' in data) this.content = data.content;
    if ('pinned' in data) this.pinned = data.pinned;
    if ('tts' in data) this.tts = data.tts;
    if ('embeds' in data) this.embeds = data.embeds.map(e => new Embed(e));
    else this.embeds = this.embeds.slice();

    if ('attachments' in data) {
      this.attachments = new Collection();
      for (const attachment of data.attachments) {
        this.attachments.set(attachment.id, new MessageAttachment(
          attachment.url, attachment.filename, attachment
        ));
      }
    } else {
      this.attachments = new Collection(this.attachments);
    }

    this.mentions = new Mentions(
      this,
      'mentions' in data ? data.mentions : this.mentions.users,
      'mentions_roles' in data ? data.mentions_roles : this.mentions.roles,
      'mention_everyone' in data ? data.mention_everyone : this.mentions.everyone
    );
  }

  /**
   * The time the message was sent
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The time the message was last edited at (if applicable)
   * @type {?Date}
   * @readonly
   */
  get editedAt() {
    return this.editedTimestamp ? new Date(this.editedTimestamp) : null;
  }

  /**
   * The guild the message was sent in (if in a guild channel)
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.channel.guild || null;
  }

  /**
   * The message contents with all mentions replaced by the equivalent text.
   * If mentions cannot be resolved to a name, the relevant mention in the message content will not be converted.
   * @type {string}
   * @readonly
   */
  get cleanContent() {
    return this.content
      .replace(/@(everyone|here)/g, '@\u200b$1')
      .replace(/<@!?[0-9]+>/g, input => {
        const id = input.replace(/<|!|>|@/g, '');
        if (this.channel.type === 'dm' || this.channel.type === 'group') {
          return this.client.users.has(id) ? `@${this.client.users.get(id).username}` : input;
        }

        const member = this.channel.guild.members.get(id);
        if (member) {
          if (member.nickname) return `@${member.nickname}`;
          return `@${member.user.username}`;
        } else {
          const user = this.client.users.get(id);
          if (user) return `@${user.username}`;
          return input;
        }
      })
      .replace(/<#[0-9]+>/g, input => {
        const channel = this.client.channels.get(input.replace(/<|#|>/g, ''));
        if (channel) return `#${channel.name}`;
        return input;
      })
      .replace(/<@&[0-9]+>/g, input => {
        if (this.channel.type === 'dm' || this.channel.type === 'group') return input;
        const role = this.guild.roles.get(input.replace(/<|@|>|&/g, ''));
        if (role) return `@${role.name}`;
        return input;
      });
  }

  /**
   * Creates a reaction collector.
   * @param {CollectorFilter} filter The filter to apply
   * @param {ReactionCollectorOptions} [options={}] Options to send to the collector
   * @returns {ReactionCollector}
   * @example
   * // Create a reaction collector
   * const collector = message.createReactionCollector(
   *   (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someID',
   *   { time: 15000 }
   * );
   * collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createReactionCollector(filter, options = {}) {
    return new ReactionCollector(this, filter, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   * @typedef {ReactionCollectorOptions} AwaitReactionsOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createMessageCollector but in promise form.
   * Resolves with a collection of reactions that pass the specified filter.
   * @param {CollectorFilter} filter The filter function to use
   * @param {AwaitReactionsOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<string, MessageReaction>>}
   */
  awaitReactions(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createReactionCollector(filter, options);
      collector.once('end', (reactions, reason) => {
        if (options.errors && options.errors.includes(reason)) reject(reactions);
        else resolve(reactions);
      });
    });
  }

  /**
   * An array of cached versions of the message, including the current version
   * Sorted from latest (first) to oldest (last)
   * @type {Message[]}
   * @readonly
   */
  get edits() {
    const copy = this._edits.slice();
    copy.unshift(this);
    return copy;
  }

  /**
   * Whether the message is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return this.author.id === this.client.user.id;
  }

  /**
   * Whether the message is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return this.author.id === this.client.user.id || (this.guild &&
      this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES)
    );
  }

  /**
   * Whether the message is pinnable by the client user
   * @type {boolean}
   * @readonly
   */
  get pinnable() {
    return !this.guild ||
      this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_MESSAGES);
  }

  /**
   * Options that can be passed into editMessage.
   * @typedef {Object} MessageEditOptions
   * @property {string} [content] Content to be edited
   * @property {Object} [embed] An embed to be added/edited
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   */

  /**
   * Edit the content of the message.
   * @param {StringResolvable} [content] The new content for the message
   * @param {MessageEditOptions|MessageEmbed} [options] The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Update the content of a message
   * message.edit('This is my new content!')
   *   .then(msg => console.log(`Updated the content of a message from ${msg.author}`))
   *   .catch(console.error);
   */
  edit(content, options) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }
    if (options instanceof Embed) options = { embed: options };

    if (typeof options.content !== 'undefined') content = options.content;

    if (typeof content !== 'undefined') content = Util.resolveString(content);

    let { embed, code, reply } = options;

    if (embed) embed = new Embed(embed)._apiTransform();

    // Wrap everything in a code block
    if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
      content = Util.escapeMarkdown(Util.resolveString(content), true);
      content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
    }

    // Add the reply prefix
    if (reply && this.channel.type !== 'dm') {
      const id = this.client.users.resolveID(reply);
      const mention = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
      content = `${mention}${content ? `, ${content}` : ''}`;
    }

    return this.client.api.channels[this.channel.id].messages[this.id]
      .patch({ data: { content, embed } })
      .then(data => {
        const clone = this._clone();
        clone._patch(data);
        return clone;
      });
  }

  /**
   * Pins this message to the channel's pinned messages.
   * @returns {Promise<Message>}
   */
  pin() {
    return this.client.api.channels(this.channel.id).pins(this.id).put()
      .then(() => this);
  }

  /**
   * Unpins this message from the channel's pinned messages.
   * @returns {Promise<Message>}
   */
  unpin() {
    return this.client.api.channels(this.channel.id).pins(this.id).delete()
      .then(() => this);
  }

  /**
   * Add a reaction to the message.
   * @param {EmojiIdentifierResolvable} emoji The emoji to react with
   * @returns {Promise<MessageReaction>}
   */
  react(emoji) {
    emoji = this.client.emojis.resolveIdentifier(emoji);
    if (!emoji) throw new TypeError('EMOJI_TYPE');

    return this.client.api.channels(this.channel.id).messages(this.id).reactions(emoji, '@me')
      .put()
      .then(() => this.client.actions.MessageReactionAdd.handle({
        user: this.client.user,
        channel: this.channel,
        message: this,
        emoji: Util.parseEmoji(emoji),
      }).reaction);
  }

  /**
   * Remove all reactions from a message.
   * @returns {Promise<Message>}
   */
  clearReactions() {
    return this.client.api.channels(this.channel.id).messages(this.id).reactions.delete()
      .then(() => this);
  }

  /**
   * Deletes the message.
   * @param {Object} [options] Options
   * @param {number} [options.timeout=0] How long to wait to delete the message in milliseconds
   * @param {string} [options.reason] Reason for deleting this message, if it does not belong to the client user
   * @returns {Promise<Message>}
   * @example
   * // Delete a message
   * message.delete()
   *   .then(msg => console.log(`Deleted message from ${msg.author}`))
   *   .catch(console.error);
   */
  delete({ timeout = 0, reason } = {}) {
    if (timeout <= 0) {
      return this.client.api.channels(this.channel.id).messages(this.id)
        .delete({ reason })
        .then(() =>
          this.client.actions.MessageDelete.handle({
            id: this.id,
            channel_id: this.channel.id,
          }).message);
    } else {
      return new Promise(resolve => {
        this.client.setTimeout(() => {
          resolve(this.delete({ reason }));
        }, timeout);
      });
    }
  }

  /**
   * Reply to the message.
   * @param {StringResolvable} [content] The content for the message
   * @param {MessageOptions} [options] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Reply to a message
   * message.reply('Hey, I\'m a reply!')
   *   .then(msg => console.log(`Sent a reply to ${msg.author}`))
   *   .catch(console.error);
   */
  reply(content, options) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }
    return this.channel.send(content, Object.assign(options, { reply: this.member || this.author }));
  }

  /**
   * Marks the message as read.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<Message>}
   */
  acknowledge() {
    return this.client.api.channels(this.channel.id).messages(this.id).ack
      .post({ data: { token: this.client.rest._ackToken } })
      .then(res => {
        if (res.token) this.client.rest._ackToken = res.token;
        return this;
      });
  }

  /**
   * Fetches the webhook used to create this message.
   * @returns {Promise<?Webhook>}
   */
  fetchWebhook() {
    if (!this.webhookID) return Promise.reject(new Error('WEBHOOK_MESSAGE'));
    return this.client.fetchWebhook(this.webhookID);
  }

  /**
   * Used mainly internally. Whether two messages are identical in properties. If you want to compare messages
   * without checking all the properties, use `message.id === message2.id`, which is much more efficient. This
   * method allows you to see if there are differences in content, embeds, attachments, nonce and tts properties.
   * @param {Message} message The message to compare it to
   * @param {Object} rawData Raw data passed through the WebSocket about this message
   * @returns {boolean}
   */
  equals(message, rawData) {
    if (!message) return false;
    const embedUpdate = !message.author && !message.attachments;
    if (embedUpdate) return this.id === message.id && this.embeds.length === message.embeds.length;

    let equal = this.id === message.id &&
        this.author.id === message.author.id &&
        this.content === message.content &&
        this.tts === message.tts &&
        this.nonce === message.nonce &&
        this.embeds.length === message.embeds.length &&
        this.attachments.length === message.attachments.length;

    if (equal && rawData) {
      equal = this.mentions.everyone === message.mentions.everyone &&
        this.createdTimestamp === new Date(rawData.timestamp).getTime() &&
        this.editedTimestamp === new Date(rawData.edited_timestamp).getTime();
    }

    return equal;
  }

  /**
   * When concatenated with a string, this automatically concatenates the message's content instead of the object.
   * @returns {string}
   * @example
   * // Logs: Message: This is a message!
   * console.log(`Message: ${message}`);
   */
  toString() {
    return this.content;
  }
}

module.exports = Message;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(7);
const { ClientApplicationAssetTypes, Endpoints } = __webpack_require__(0);
const DataResolver = __webpack_require__(10);
const Base = __webpack_require__(8);

/**
 * Represents a Client OAuth2 Application.
 * @extends {Base}
 */
class ClientApplication extends Base {
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of the app
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the app
     * @type {string}
     */
    this.name = data.name;

    /**
     * The app's description
     * @type {string}
     */
    this.description = data.description;

    /**
     * The app's icon hash
     * @type {string}
     */
    this.icon = data.icon;

    /**
     * The app's cover image hash
     * @type {?string}
     */
    this.cover = data.cover_image;

    /**
     * The app's RPC origins
     * @type {?string[]}
     */
    this.rpcOrigins = data.rpc_origins;

    /**
     * The app's redirect URIs
     * @type {string[]}
     */
    this.redirectURIs = data.redirect_uris;

    /**
     * If this app's bot requires a code grant when using the OAuth2 flow
     * @type {boolean}
     */
    this.botRequireCodeGrant = data.bot_require_code_grant;

    /**
     * If this app's bot is public
     * @type {boolean}
     */
    this.botPublic = data.bot_public;

    /**
     * If this app can use rpc
     * @type {boolean}
     */
    this.rpcApplicationState = data.rpc_application_state;

    /**
     * Object containing basic info about this app's bot
     * @type {Object}
     */
    this.bot = data.bot;

    /**
     * The flags for the app
     * @type {number}
     */
    this.flags = data.flags;

    /**
     * OAuth2 secret for the application
     * @type {string}
     */
    this.secret = data.secret;

    if (data.owner) {
      /**
       * The owner of this OAuth application
       * @type {?User}
       */
      this.owner = this.client.users.create(data.owner);
    }
  }

  /**
   * The timestamp the app was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the app was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the application's icon.
   * @param {Object} [options={}] Options for the icon url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {?string} URL to the icon
   */
  iconURL({ format, size } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.AppIcon(this.id, this.icon, { format, size });
  }

  /**
   * A link to this application's cover image.
   * @param {Object} [options={}] Options for the cover image url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {?string} URL to the cover image
   */
  coverImage({ format, size } = {}) {
    if (!this.cover) return null;
    return Endpoints
      .CDN(this.client.options.http.cdn)
      .AppIcon(this.id, this.cover, { format, size });
  }

  /**
   * Get rich presence assets.
   * @returns {Promise<Object>}
   */
  fetchAssets() {
    return this.client.api.applications(this.id).assets.get()
      .then(assets => assets.map(a => ({
        id: a.id,
        name: a.name,
        type: Object.keys(ClientApplicationAssetTypes)[a.type - 1],
      })));
  }

  /**
   * Create a rich presence asset.
   * @param {string} name Name of the asset
   * @param {Base64Resolvable} data Data of the asset
   * @param {string} type Type of the asset. `big`, or `small`
   * @returns {Promise}
   */
  createAsset(name, data, type) {
    return DataResolver.resolveBase64(data).then(b64 =>
      this.client.api.applications(this.id).assets.post({ data: {
        name,
        data: b64,
        type: ClientApplicationAssetTypes[type.toUpperCase()],
      } }));
  }

  /**
   * Reset the app's secret.
   * <warn>This is only available when using a user account.</warn>
   * @returns {ClientApplication}
   */
  resetSecret() {
    return this.client.api.oauth2.applications[this.id].reset.post()
      .then(app => new ClientApplication(this.client, app));
  }

  /**
   * Reset the app's bot token.
   * <warn>This is only available when using a user account.</warn>
   * @returns {ClientApplication}
   */
  resetToken() {
    return this.client.api.oauth2.applications[this.id].bot.reset.post()
      .then(app => new ClientApplication(this.client, Object.assign({}, this, { bot: app })));
  }

  /**
   * When concatenated with a string, this automatically concatenates the app name rather than the app object.
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}

module.exports = ClientApplication;


/***/ }),
/* 32 */
/***/ (function(module, exports) {



/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);
const Snowflake = __webpack_require__(7);
const Base = __webpack_require__(8);
const { TypeError } = __webpack_require__(4);

/**
 * Represents a custom emoji.
 * @extends {Base}
 */
class Emoji extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild this emoji is part of
     * @type {Guild}
     */
    this.guild = guild;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of the emoji
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The name of the emoji
     * @type {string}
     */
    this.name = data.name;

    /**
     * Whether or not this emoji requires colons surrounding it
     * @type {boolean}
     */
    this.requiresColons = data.require_colons;

    /**
     * Whether this emoji is managed by an external service
     * @type {boolean}
     */
    this.managed = data.managed;

    this._roles = data.roles;
  }

  /**
   * The timestamp the emoji was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the emoji was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A collection of roles this emoji is active for (empty if all), mapped by role ID
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get roles() {
    const roles = new Collection();
    for (const role of this._roles) {
      if (this.guild.roles.has(role)) roles.set(role, this.guild.roles.get(role));
    }
    return roles;
  }

  /**
   * The URL to the emoji file
   * @type {string}
   * @readonly
   */
  get url() {
    return this.client.rest.cdn.Emoji(this.id);
  }

  /**
   * The identifier of this emoji, used for message reactions
   * @type {string}
   * @readonly
   */
  get identifier() {
    if (this.id) return `${this.name}:${this.id}`;
    return encodeURIComponent(this.name);
  }

  /**
   * Data for editing an emoji.
   * @typedef {Object} EmojiEditData
   * @property {string} [name] The name of the emoji
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] Roles to restrict emoji to
   */

  /**
   * Edits the emoji.
   * @param {EmojiEditData} data The new data for the emoji
   * @param {string} [reason] Reason for editing this emoji
   * @returns {Promise<Emoji>}
   * @example
   * // Edit an emoji
   * emoji.edit({name: 'newemoji'})
   *   .then(e => console.log(`Edited emoji ${e}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    return this.client.api.guilds(this.guild.id).emojis(this.id)
      .patch({ data: {
        name: data.name,
        roles: data.roles ? data.roles.map(r => r.id ? r.id : r) : undefined,
      }, reason })
      .then(() => this);
  }

  /**
   * Set the name of the emoji.
   * @param {string} name The new name for the emoji
   * @param {string} [reason] Reason for changing the emoji's name
   * @returns {Promise<Emoji>}
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Add a role to the list of roles that can use this emoji.
   * @param {Role} role The role to add
   * @returns {Promise<Emoji>}
   */
  addRestrictedRole(role) {
    return this.addRestrictedRoles([role]);
  }

  /**
   * Add multiple roles to the list of roles that can use this emoji.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles Roles to add
   * @returns {Promise<Emoji>}
   */
  addRestrictedRoles(roles) {
    const newRoles = new Collection(this.roles);
    for (let role of roles instanceof Collection ? roles.values() : roles) {
      role = this.guild.roles.resolve(role);
      if (!role) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      newRoles.set(role.id, role);
    }
    return this.edit({ roles: newRoles });
  }

  /**
   * Remove a role from the list of roles that can use this emoji.
   * @param {Role} role The role to remove
   * @returns {Promise<Emoji>}
   */
  removeRestrictedRole(role) {
    return this.removeRestrictedRoles([role]);
  }

  /**
   * Remove multiple roles from the list of roles that can use this emoji.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles Roles to remove
   * @returns {Promise<Emoji>}
   */
  removeRestrictedRoles(roles) {
    const newRoles = new Collection(this.roles);
    for (let role of roles instanceof Collection ? roles.values() : roles) {
      role = this.guild.roles.resolve(role);
      if (!role) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      if (newRoles.has(role.id)) newRoles.delete(role.id);
    }
    return this.edit({ roles: newRoles });
  }

  /**
   * When concatenated with a string, this automatically returns the emoji mention rather than the object.
   * @returns {string}
   * @example
   * // Send an emoji:
   * const emoji = guild.emojis.first();
   * msg.reply(`Hello! ${emoji}`);
   */
  toString() {
    return this.requiresColons ? `<:${this.name}:${this.id}>` : this.name;
  }

  /**
   * Delete the emoji.
   * @param {string} [reason] Reason for deleting the emoji
   * @returns {Promise<Emoji>}
   */
  delete(reason) {
    return this.client.api.guilds(this.guild.id).emojis(this.id).delete({ reason })
      .then(() => this);
  }

  /**
   * Whether this emoji is the same as another one.
   * @param {Emoji|Object} other The emoji to compare it to
   * @returns {boolean} Whether the emoji is equal to the given emoji or not
   */
  equals(other) {
    if (other instanceof Emoji) {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other.managed === this.managed &&
        other.requiresColons === this.requiresColons &&
        other._roles === this._roles
      );
    } else {
      return (
        other.id === this.id &&
        other.name === this.name &&
        other._roles === this._roles
      );
    }
  }
}

module.exports = Emoji;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * Represents a limited emoji set used for both custom and unicode emojis. Custom emojis
 * will use this class opposed to the Emoji class when the client doesn't know enough
 * information about them.
 */
class ReactionEmoji {
  constructor(reaction, name, id) {
    /**
     * The message reaction this emoji refers to
     * @type {MessageReaction}
     */
    this.reaction = reaction;

    /**
     * The name of this reaction emoji
     * @type {string}
     */
    this.name = name;

    /**
     * The ID of this reaction emoji
     * @type {?Snowflake}
     */
    this.id = id;
  }

  /**
   * The identifier of this emoji, used for message reactions
   * @type {string}
   * @readonly
   */
  get identifier() {
    if (this.id) return `${this.name}:${this.id}`;
    return encodeURIComponent(this.name);
  }

  /**
   * Creates the text required to form a graphical emoji on Discord.
   * @example
   * // Send the emoji used in a reaction to the channel the reaction is part of
   * reaction.message.channel.send(`The emoji used is ${reaction.emoji}`);
   * @returns {string}
   */
  toString() {
    return this.id ? `<:${this.name}:${this.id}>` : this.name;
  }
}

module.exports = ReactionEmoji;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = {"name":"discord.js","version":"12.0.0-dev","description":"A powerful library for interacting with the Discord API","main":"./src/index","types":"./typings/index.d.ts","scripts":{"test":"npm run lint && npm run docs:test","docs":"docgen --source src --custom docs/index.yml --output docs/docs.json --jsdoc jsdoc.json","docs:test":"docgen --source src --custom docs/index.yml --jsdoc jsdoc.json","lint":"eslint src *.js","lint:fix":"eslint --fix src","webpack":"parallel-webpack"},"repository":{"type":"git","url":"git+https://github.com/hydrabolt/discord.js.git"},"keywords":["discord","api","bot","client","node","discordapp"],"author":"Amish Shah <amishshah.2k@gmail.com>","license":"Apache-2.0","bugs":{"url":"https://github.com/hydrabolt/discord.js/issues"},"homepage":"https://github.com/hydrabolt/discord.js#readme","runkitExampleFilename":"./docs/examples/ping.js","dependencies":{"long":"^3.0.0","prism-media":"^0.0.1","snekfetch":"^3.0.0","tweetnacl":"^1.0.0","ws":"^3.0.0"},"peerDependencies":{"bufferutil":"^3.0.0","erlpack":"discordapp/erlpack","node-opus":"^0.2.0","opusscript":"^0.0.3","sodium":"^2.0.0","libsodium-wrappers":"^0.5.0","uws":"^8.14.0"},"devDependencies":{"@types/node":"^8.0.0","discord.js-docgen":"hydrabolt/discord.js-docgen","eslint":"^4.0.0","jsdoc-strip-async-await":"^0.1.0","parallel-webpack":"^2.0.0","uglifyjs-webpack-plugin":"^1.0.0-beta.2","webpack":"^3.0.0"},"engines":{"node":">=8.0.0"},"browser":{"https":false,"ws":false,"uws":false,"erlpack":false,"prism-media":false,"opusscript":false,"node-opus":false,"tweetnacl":false,"sodium":false,"src/rest/UserAgentManager.js":false,"src/sharding/Shard.js":false,"src/sharding/ShardClientUtil.js":false,"src/sharding/ShardingManager.js":false,"src/client/voice/ClientVoiceManager.js":false,"src/client/voice/VoiceConnection.js":false,"src/client/voice/VoiceUDPClient.js":false,"src/client/voice/VoiceWebSocket.js":false,"src/client/voice/dispatcher/StreamDispatcher.js":false,"src/client/voice/opus/BaseOpusEngine.js":false,"src/client/voice/opus/NodeOpusEngine.js":false,"src/client/voice/opus/OpusEngineList.js":false,"src/client/voice/opus/OpusScriptEngine.js":false,"src/client/voice/pcm/ConverterEngine.js":false,"src/client/voice/pcm/ConverterEngineList.js":false,"src/client/voice/pcm/FfmpegConverterEngine.js":false,"src/client/voice/player/AudioPlayer.js":false,"src/client/voice/receiver/VoiceReadable.js":false,"src/client/voice/receiver/VoiceReceiver.js":false,"src/client/voice/util/Secretbox.js":false,"src/client/voice/util/SecretKey.js":false,"src/client/voice/util/VolumeInterface.js":false,"src/client/voice/VoiceBroadcast.js":false}}

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// Heavily inspired by node's `internal/errors` module

const kCode = Symbol('code');
const messages = new Map();

/**
 * Extend an error of some sort into a DiscordjsError.
 * @param {Error} Base Base error to extend
 * @returns {DiscordjsError}
 */
function makeDiscordjsError(Base) {
  return class DiscordjsError extends Base {
    constructor(key, ...args) {
      super(message(key, args));
      this[kCode] = key;
      if (Error.captureStackTrace) Error.captureStackTrace(this, DiscordjsError);
    }

    get name() {
      return `${super.name} [${this[kCode]}]`;
    }

    get code() {
      return this[kCode];
    }
  };
}

/**
 * Format the message for an error.
 * @param {string} key Error key
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 */
function message(key, args) {
  if (typeof key !== 'string') throw new Error('Error message key must be a string');
  const msg = messages.get(key);
  if (!msg) throw new Error(`An invalid error message key was used: ${key}.`);
  if (typeof msg === 'function') return msg(...args);
  if (args === undefined || args.length === 0) return msg;
  args.unshift(msg);
  return String(...args);
}

/**
 * Register an error code and message.
 * @param {string} sym Unique name for the error
 * @param {*} val Value of the error
 */
function register(sym, val) {
  messages.set(sym, typeof val === 'function' ? val : String(val));
}

module.exports = {
  register,
  Error: makeDiscordjsError(Error),
  TypeError: makeDiscordjsError(TypeError),
  RangeError: makeDiscordjsError(RangeError),
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const UserAgentManager = __webpack_require__(65);
const handlers = __webpack_require__(66);
const APIRequest = __webpack_require__(70);
const routeBuilder = __webpack_require__(72);
const { Error } = __webpack_require__(4);
const { Endpoints, browser } = __webpack_require__(0);

class RESTManager {
  constructor(client, tokenPrefix = 'Bot') {
    this.client = client;
    this.handlers = {};
    if (!browser) this.userAgentManager = new UserAgentManager(this);
    this.rateLimitedEndpoints = {};
    this.globallyRateLimited = false;
    this.tokenPrefix = tokenPrefix;
    this.versioned = true;
  }

  get api() {
    return routeBuilder(this);
  }

  getAuth() {
    const token = this.client.token || this.client.accessToken;
    const prefixed = !!this.client.application || (this.client.user && this.client.user.bot);
    if (token && prefixed) return `${this.tokenPrefix} ${token}`;
    else if (token) return token;
    throw new Error('TOKEN_MISSING');
  }

  get cdn() {
    return Endpoints.CDN(this.client.options.http.cdn);
  }

  destroy() {
    for (const handler of Object.values(this.handlers)) {
      if (handler.destroy) handler.destroy();
    }
  }

  push(handler, apiRequest) {
    return new Promise((resolve, reject) => {
      handler.push({
        request: apiRequest,
        resolve,
        reject,
      });
    });
  }

  getRequestHandler() {
    const method = this.client.options.apiRequestMethod;
    if (typeof method === 'function') return method;
    const handler = handlers[method];
    if (!handler) throw new Error('RATELIMIT_INVALID_METHOD');
    return handler;
  }

  request(method, url, options = {}) {
    const apiRequest = new APIRequest(this, method, url, options);
    if (!this.handlers[apiRequest.route]) {
      this.handlers[apiRequest.route] = new handlers.RequestHandler(this, this.getRequestHandler());
    }

    return this.push(this.handlers[apiRequest.route], apiRequest);
  }

  set endpoint(endpoint) {
    this.client.options.http.api = endpoint;
  }
}

module.exports = RESTManager;


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * Represents an error from the Discord API.
 * @extends Error
 */
class DiscordAPIError extends Error {
  constructor(path, error) {
    super();
    const flattened = this.constructor.flattenErrors(error.errors || error).join('\n');
    this.name = 'DiscordAPIError';
    this.message = error.message && flattened ? `${error.message}\n${flattened}` : error.message || flattened;

    /**
     * The path of the request relative to the HTTP endpoint
     * @type {string}
     */
    this.path = path;

    /**
     * HTTP error code returned by Discord
     * @type {number}
     */
    this.code = error.code;
  }

  /**
   * Flattens an errors object returned from the API into an array.
   * @param {Object} obj Discord errors object
   * @param {string} [key] Used internally to determine key names of nested fields
   * @returns {string[]}
   * @private
   */
  static flattenErrors(obj, key = '') {
    let messages = [];

    for (const [k, v] of Object.entries(obj)) {
      if (k === 'message') continue;
      const newKey = key ? isNaN(k) ? `${key}.${k}` : `${key}[${k}]` : k;

      if (v._errors) {
        messages.push(`${newKey}: ${v._errors.map(e => e.message).join(' ')}`);
      } else if (v.code || v.message) {
        messages.push(`${v.code ? `${v.code}: ` : ''}${v.message}`.trim());
      } else if (typeof v === 'string') {
        messages.push(v);
      } else {
        messages = messages.concat(this.flattenErrors(v, newKey));
      }
    }

    return messages;
  }
}

module.exports = DiscordAPIError;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const User = __webpack_require__(20);
const Collection = __webpack_require__(3);
const ClientUserSettings = __webpack_require__(54);
const ClientUserGuildSettings = __webpack_require__(55);
const { Events } = __webpack_require__(0);
const Util = __webpack_require__(5);
const DataResolver = __webpack_require__(10);
const Guild = __webpack_require__(24);

/**
 * Represents the logged in client's Discord user.
 * @extends {User}
 */
class ClientUser extends User {
  _patch(data) {
    super._patch(data);

    /**
     * Whether or not this account has been verified
     * @type {boolean}
     */
    this.verified = data.verified;

    /**
     * The email of this account
     * @type {string}
     */
    this.email = data.email;
    this._typing = new Map();

    /**
     * A Collection of friends for the logged in user
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, User>}
     */
    this.friends = new Collection();

    /**
     * A Collection of blocked users for the logged in user
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, User>}
     */
    this.blocked = new Collection();

    /**
     * A Collection of notes for the logged in user
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, string>}
     */
    this.notes = new Collection();

    /**
     * If the user has Discord premium (nitro)
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.premium = typeof data.premium === 'boolean' ? data.premium : null;

    /**
     * If the user has MFA enabled on their account
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.mfaEnabled = typeof data.mfa_enabled === 'boolean' ? data.mfa_enabled : null;

    /**
     * If the user has ever used a mobile device on Discord
     * <warn>This is only filled when using a user account.</warn>
     * @type {?boolean}
     */
    this.mobile = typeof data.mobile === 'boolean' ? data.mobile : null;

    /**
     * Various settings for this user
     * <warn>This is only filled when using a user account.</warn>
     * @type {?ClientUserSettings}
     */
    this.settings = data.user_settings ? new ClientUserSettings(this, data.user_settings) : null;

    /**
     * All of the user's guild settings
     * <warn>This is only filled when using a user account.</warn>
     * @type {Collection<Snowflake, ClientUserGuildSettings>}
     */
    this.guildSettings = new Collection();
    if (data.user_guild_settings) {
      for (const settings of data.user_guild_settings) {
        this.guildSettings.set(settings.guild_id, new ClientUserGuildSettings(this.client, settings));
      }
    }
  }

  /**
   * ClientUser's presence
   * @readonly
   * @type {Presence}
   */
  get presence() {
    return this.client.presences.clientPresence;
  }

  edit(data, passcode) {
    if (!this.bot) {
      if (typeof passcode !== 'object') {
        data.password = passcode;
      } else {
        data.code = passcode.mfaCode;
        data.password = passcode.password;
      }
    }
    return this.client.api.users('@me').patch({ data })
      .then(newData => {
        this.client.token = newData.token;
        return this.client.actions.UserUpdate.handle(newData).updated;
      });
  }

  /**
   * Set the username of the logged in client.
   * <info>Changing usernames in Discord is heavily rate limited, with only 2 requests
   * every hour. Use this sparingly!</info>
   * @param {string} username The new username
   * @param {string} [password] Current password (only for user accounts)
   * @returns {Promise<ClientUser>}
   * @example
   * // Set username
   * client.user.setUsername('discordjs')
   *   .then(user => console.log(`My new username is ${user.username}`))
   *   .catch(console.error);
   */
  setUsername(username, password) {
    return this.edit({ username }, password);
  }

  /**
   * Changes the email for the client user's account.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} email New email to change to
   * @param {string} password Current password
   * @returns {Promise<ClientUser>}
   * @example
   * // Set email
   * client.user.setEmail('bob@gmail.com', 'some amazing password 123')
   *   .then(user => console.log(`My new email is ${user.email}`))
   *   .catch(console.error);
   */
  setEmail(email, password) {
    return this.edit({ email }, password);
  }

  /**
   * Changes the password for the client user's account.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} newPassword New password to change to
   * @param {Object|string} options Object containing an MFA code, password or both.
   * Can be just a string for the password.
   * @param {string} [options.oldPassword] Current password
   * @param {string} [options.mfaCode] Timed MFA Code
   * @returns {Promise<ClientUser>}
   * @example
   * // Set password
   * client.user.setPassword('some new amazing password 456', 'some amazing password 123')
   *   .then(user => console.log('New password set!'))
   *   .catch(console.error);
   */
  setPassword(newPassword, options) {
    return this.edit({ new_password: newPassword }, { password: options.oldPassword, mfaCode: options.mfaCode });
  }

  /**
   * Set the avatar of the logged in client.
   * @param {BufferResolvable|Base64Resolvable} avatar The new avatar
   * @returns {Promise<ClientUser>}
   * @example
   * // Set avatar
   * client.user.setAvatar('./avatar.png')
   *   .then(user => console.log(`New avatar set!`))
   *   .catch(console.error);
   */
  async setAvatar(avatar) {
    return this.edit({ avatar: await DataResolver.resolveImage(avatar) });
  }

  /**
   * Data resembling a raw Discord presence.
   * @typedef {Object} PresenceData
   * @property {PresenceStatus} [status] Status of the user
   * @property {boolean} [afk] Whether the user is AFK
   * @property {Object} [activity] activity the user is playing
   * @property {string} [activity.name] Name of the activity
   * @property {ActivityType|number} [activity.type] Type of the activity
   * @property {string} [activity.url] Stream url
   */

  /**
   * Sets the full presence of the client user.
   * @param {PresenceData} data Data for the presence
   * @returns {Promise<Presence>}
   */
  setPresence(data) {
    return this.client.presences.setClientPresence(data);
  }

  /**
   * A user's status. Must be one of:
   * * `online`
   * * `idle`
   * * `invisible`
   * * `dnd` (do not disturb)
   * @typedef {string} PresenceStatus
   */

  /**
   * Sets the status of the client user.
   * @param {PresenceStatus} status Status to change to
   * @returns {Promise<Presence>}
   */
  setStatus(status) {
    return this.setPresence({ status });
  }

  /**
   * Sets the activity the client user is playing.
   * @param {?string} name Activity being played
   * @param {Object} [options] Options for setting the activity
   * @param {string} [options.url] Twitch stream URL
   * @param {ActivityType|number} [options.type] Type of the activity
   * @returns {Promise<Presence>}
   */
  setActivity(name, { url, type } = {}) {
    if (!name) return this.setPresence({ activity: null });
    return this.setPresence({
      activity: { name, type, url },
    });
  }

  /**
   * Sets/removes the AFK flag for the client user.
   * @param {boolean} afk Whether or not the user is AFK
   * @returns {Promise<Presence>}
   */
  setAFK(afk) {
    return this.setPresence({ afk });
  }

  /**
   * Fetches messages that mentioned the client's user.
   * <warn>This is only available when using a user account.</warn>
   * @param {Object} [options] Options for the fetch
   * @param {number} [options.limit=25] Maximum number of mentions to retrieve
   * @param {boolean} [options.roles=true] Whether to include role mentions
   * @param {boolean} [options.everyone=true] Whether to include everyone/here mentions
   * @param {Guild|Snowflake} [options.guild] Limit the search to a specific guild
   * @returns {Promise<Message[]>}
   */
  fetchMentions(options = {}) {
    if (options.guild instanceof Guild) options.guild = options.guild.id;
    Util.mergeDefault({ limit: 25, roles: true, everyone: true, guild: null }, options);

    return this.client.api.users('@me').mentions.get({ query: options })
      .then(data => data.map(m => this.client.channels.get(m.channel_id).messages.create(m, false)));
  }

  /**
   * Creates a guild.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} name The name of the guild
   * @param {Object} [options] Options for the creating
   * @param {string} [options.region] The region for the server, defaults to the closest one available
   * @param {BufferResolvable|Base64Resolvable} [options.icon=null] The icon for the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  createGuild(name, { region, icon = null } = {}) {
    if (!icon || (typeof icon === 'string' && icon.startsWith('data:'))) {
      return new Promise((resolve, reject) =>
        this.client.api.guilds.post({ data: { name, region, icon } })
          .then(data => {
            if (this.client.guilds.has(data.id)) return resolve(this.client.guilds.get(data.id));

            const handleGuild = guild => {
              if (guild.id === data.id) {
                this.client.removeListener(Events.GUILD_CREATE, handleGuild);
                this.client.clearTimeout(timeout);
                resolve(guild);
              }
            };
            this.client.on(Events.GUILD_CREATE, handleGuild);

            const timeout = this.client.setTimeout(() => {
              this.client.removeListener(Events.GUILD_CREATE, handleGuild);
              resolve(this.client.guilds.create(data));
            }, 10000);
            return undefined;
          }, reject)
      );
    }

    return DataResolver.resolveImage(icon)
      .then(data => this.createGuild(name, { region, icon: data || null }));
  }

  /**
   * An object containing either a user or access token, and an optional nickname.
   * @typedef {Object} GroupDMRecipientOptions
   * @property {UserResolvable} [user] User to add to the Group DM
   * @property {string} [accessToken] Access token to use to add a user to the Group DM
   * (only available if a bot is creating the DM)
   * @property {string} [nick] Permanent nickname (only available if a bot is creating the DM)
   * @property {string} [id] If no user resolvable is provided and you want to assign nicknames
   * you must provide user ids instead
   */

  /**
   * Creates a Group DM.
   * @param {GroupDMRecipientOptions[]} recipients The recipients
   * @returns {Promise<GroupDMChannel>}
   */
  createGroupDM(recipients) {
    const data = this.bot ? {
      access_tokens: recipients.map(u => u.accessToken),
      nicks: recipients.reduce((o, r) => {
        if (r.nick) o[r.user ? r.user.id : r.id] = r.nick;
        return o;
      }, {}),
    } : { recipients: recipients.map(u => this.client.users.resolveID(u.user || u.id)) };
    return this.client.api.users('@me').channels.post({ data })
      .then(res => this.client.channels.create(res));
  }
}

module.exports = ClientUser;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const Collector = __webpack_require__(29);
const { Events } = __webpack_require__(0);

/**
 * @typedef {CollectorOptions} MessageCollectorOptions
 * @property {number} max The maximum amount of messages to collect
 * @property {number} maxProcessed The maximum amount of messages to process
 */

/**
 * Collects messages on a channel.
 * @extends {Collector}
 */
class MessageCollector extends Collector {
  /**
   * @param {TextChannel|DMChannel|GroupDMChannel} channel The channel
   * @param {CollectorFilter} filter The filter to be applied to this collector
   * @param {MessageCollectorOptions} options The options to be applied to this collector
   * @emits MessageCollector#message
   */
  constructor(channel, filter, options = {}) {
    super(channel.client, filter, options);

    /**
     * The channel
     * @type {TextBasedChannel}
     */
    this.channel = channel;

    /**
     * Total number of messages that were received in the channel during message collection
     * @type {number}
     */
    this.received = 0;

    const bulkDeleteListener = (messages => {
      for (const message of messages.values()) this.handleDispose(message);
    }).bind(this);

    this.client.on(Events.MESSAGE_CREATE, this.handleCollect);
    this.client.on(Events.MESSAGE_DELETE, this.handleDispose);
    this.client.on(Events.MESSAGE_BULK_DELETE, bulkDeleteListener);

    this.once('end', () => {
      this.client.removeListener(Events.MESSAGE_CREATE, this.handleCollect);
      this.client.removeListener(Events.MESSAGE_DELETE, this.handleDispose);
      this.client.removeListener(Events.MESSAGE_BULK_DELETE, bulkDeleteListener);
    });
  }

  /**
   * Handle a message for possible collection.
   * @param {Message} message The message that could be collected
   * @returns {?{key: Snowflake, value: Message}}
   * @private
   */
  collect(message) {
    if (message.channel.id !== this.channel.id) return null;
    this.received++;
    return {
      key: message.id,
      value: message,
    };
  }

  /**
   * Handle a message for possible disposal.
   * @param {Message} message The message that could be disposed
   * @returns {?string}
   */
  dispose(message) {
    return message.channel.id === this.channel.id ? message.id : null;
  }

  /**
   * Check after un/collection to see if the collector is done.
   * @returns {?string}
   * @private
   */
  endReason() {
    if (this.options.max && this.collected.size >= this.options.max) return 'limit';
    if (this.options.maxProcessed && this.received === this.options.maxProcessed) return 'processedLimit';
    return null;
  }
}

module.exports = MessageCollector;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  search: __webpack_require__(80),
  sendMessage: __webpack_require__(86),
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(11);
const TextBasedChannel = __webpack_require__(17);
const MessageStore = __webpack_require__(21);

/**
 * Represents a direct message channel between two users.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class DMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    this.messages = new MessageStore(this);
    this._typing = new Map();
  }

  _patch(data) {
    super._patch(data);

    /**
     * The recipient on the other end of the DM
     * @type {User}
     */
    this.recipient = this.client.users.create(data.recipients[0]);

    this.lastMessageID = data.last_message_id;
  }

  /**
   * When concatenated with a string, this automatically concatenates the recipient's mention instead of the
   * DM channel object.
   * @returns {string}
   */
  toString() {
    return this.recipient.toString();
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  search() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createMessageCollector() {}
  awaitMessages() {}
  // Doesn't work on DM channels; bulkDelete() {}
  acknowledge() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(DMChannel, true, ['bulkDelete']);

module.exports = DMChannel;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);
const GuildMember = __webpack_require__(12);

/**
 * Keeps track of mentions in a {@link Message}.
 */
class MessageMentions {
  constructor(message, users, roles, everyone) {
    /**
     * Whether `@everyone` or `@here` were mentioned
     * @type {boolean}
     */
    this.everyone = Boolean(everyone);

    if (users) {
      if (users instanceof Collection) {
        /**
         * Any users that were mentioned
         * @type {Collection<Snowflake, User>}
         */
        this.users = new Collection(users);
      } else {
        this.users = new Collection();
        for (const mention of users) {
          let user = message.client.users.create(mention);
          this.users.set(user.id, user);
        }
      }
    } else {
      this.users = new Collection();
    }

    if (roles) {
      if (roles instanceof Collection) {
        /**
         * Any roles that were mentioned
         * @type {Collection<Snowflake, Role>}
         */
        this.roles = new Collection(roles);
      } else {
        this.roles = new Collection();
        for (const mention of roles) {
          const role = message.channel.guild.roles.get(mention);
          if (role) this.roles.set(role.id, role);
        }
      }
    } else {
      this.roles = new Collection();
    }

    /**
     * Content of the message
     * @type {Message}
     * @private
     */
    this._content = message.content;

    /**
     * The client the message is from
     * @type {Client}
     * @private
     */
    this._client = message.client;

    /**
     * The guild the message is in
     * @type {?Guild}
     * @private
     */
    this._guild = message.channel.guild;

    /**
     * Cached members for {@MessageMention#members}
     * @type {?Collection<Snowflake, GuildMember>}
     * @private
     */
    this._members = null;

    /**
     * Cached channels for {@MessageMention#channels}
     * @type {?Collection<Snowflake, GuildChannel>}
     * @private
     */
    this._channels = null;
  }

  /**
   * Any members that were mentioned (only in {@link TextChannel}s)
   * @type {?Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    if (this._members) return this._members;
    if (!this._guild) return null;
    this._members = new Collection();
    this.users.forEach(user => {
      const member = this._guild.member(user);
      if (member) this._members.set(member.user.id, member);
    });
    return this._members;
  }

  /**
   * Any channels that were mentioned
   * @type {Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get channels() {
    if (this._channels) return this._channels;
    this._channels = new Collection();
    let matches;
    while ((matches = this.constructor.CHANNELS_PATTERN.exec(this._content)) !== null) {
      const chan = this._client.channels.get(matches[1]);
      if (chan) this._channels.set(chan.id, chan);
    }
    return this._channels;
  }

  /**
   * Check if a user is mentioned.
   * Takes into account user mentions, role mentions, and @everyone/@here mentions.
   * @param {UserResolvable|GuildMember|Role|GuildChannel} data User/GuildMember/Role/Channel to check
   * @param {boolean} [strict=true] If role mentions and everyone/here mentions should be included
   * @returns {boolean}
   */
  has(data, strict = true) {
    if (strict && this.everyone) return true;
    if (strict && data instanceof GuildMember) {
      for (const role of this.roles.values()) if (data.roles.has(role.id)) return true;
    }
    const id = data.id || data;
    return this.users.has(id) || this.channels.has(id) || this.roles.has(id);
  }
}

/**
 * Regular expression that globally matches `@everyone` and `@here`
 * @type {RegExp}
 */
MessageMentions.EVERYONE_PATTERN = /@(everyone|here)/g;

/**
 * Regular expression that globally matches user mentions like `<@81440962496172032>`
 * @type {RegExp}
 */
MessageMentions.USERS_PATTERN = /<@!?(1|\d{17,19})>/g;

/**
 * Regular expression that globally matches role mentions like `<@&297577916114403338>`
 * @type {RegExp}
 */
MessageMentions.ROLES_PATTERN = /<@&(\d{17,19})>/g;

/**
 * Regular expression that globally matches channel mentions like `<#222079895583457280>`
 * @type {RegExp}
 */
MessageMentions.CHANNELS_PATTERN = /<#(\d{17,19})>/g;

module.exports = MessageMentions;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

const Collector = __webpack_require__(29);
const Collection = __webpack_require__(3);
const { Events } = __webpack_require__(0);

/**
 * @typedef {CollectorOptions} ReactionCollectorOptions
 * @property {number} max The maximum total amount of reactions to collect
 * @property {number} maxEmojis The maximum number of emojis to collect
 * @property {number} maxUsers The maximum number of users to react
 */

/**
 * Collects reactions on messages.
 * @extends {Collector}
 */
class ReactionCollector extends Collector {
  /**
   * @param {Message} message The message upon which to collect reactions
   * @param {CollectorFilter} filter The filter to apply to this collector
   * @param {ReactionCollectorOptions} [options={}] The options to apply to this collector
   */
  constructor(message, filter, options = {}) {
    super(message.client, filter, options);

    /**
     * The message
     * @type {Message}
     */
    this.message = message;

    /**
     * The users which have reacted
     * @type {Collection}
     */
    this.users = new Collection();

    /**
     * The total number of reactions collected
     * @type {number}
     */
    this.total = 0;

    this.empty = this.empty.bind(this);

    this.client.on(Events.MESSAGE_REACTION_ADD, this.handleCollect);
    this.client.on(Events.MESSAGE_REACTION_REMOVE, this.handleDispose);
    this.client.on(Events.MESSAGE_REACTION_REMOVE_ALL, this.empty);

    this.once('end', () => {
      this.client.removeListener(Events.MESSAGE_REACTION_ADD, this.handleCollect);
      this.client.removeListener(Events.MESSAGE_REACTION_REMOVE, this.handleDispose);
      this.client.removeListener(Events.MESSAGE_REACTION_REMOVE_ALL, this.empty);
    });

    this.on('collect', (collected, reaction, user) => {
      this.total++;
      this.users.set(user.id, user);
    });

    this.on('dispose', (disposed, reaction, user) => {
      this.total--;
      if (!this.collected.some(r => r.users.has(user.id))) this.users.delete(user.id);
    });
  }

  /**
   * Handle an incoming reaction for possible collection.
   * @param {MessageReaction} reaction The reaction to possibly collect
   * @returns {?{key: Snowflake, value: MessageReaction}}
   * @private
   */
  collect(reaction) {
    if (reaction.message.id !== this.message.id) return null;
    return {
      key: ReactionCollector.key(reaction),
      value: reaction,
    };
  }

  /**
   * Handle a reaction deletion for possible disposal.
   * @param {MessageReaction} reaction The reaction to possibly dispose
   * @returns {?Snowflake|string}
   */
  dispose(reaction) {
    return reaction.message.id === this.message.id && !reaction.count ? ReactionCollector.key(reaction) : null;
  }

  /**
   * Empty this reaction collector.
   */
  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) return 'emojiLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  /**
   * Get the collector key for a reaction.
   * @param {MessageReaction} reaction The message reaction to get the key for
   * @returns {Snowflake|string}
   */
  static key(reaction) {
    return reaction.emoji.id || reaction.emoji.name;
  }
}

module.exports = ReactionCollector;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);
const Emoji = __webpack_require__(33);
const ReactionEmoji = __webpack_require__(34);
const { Error } = __webpack_require__(4);

/**
 * Represents a reaction to a message.
 */
class MessageReaction {
  constructor(client, data, message) {
    /**
     * The message that this reaction refers to
     * @type {Message}
     */
    this.message = message;

    /**
     * Whether the client has given this reaction
     * @type {boolean}
     */
    this.me = data.me;

    /**
     * The number of people that have given the same reaction
     * @type {number}
     */
    this.count = data.count || 0;

    /**
     * The users that have given this reaction, mapped by their ID
     * @type {Collection<Snowflake, User>}
     */
    this.users = new Collection();

    this._emoji = new ReactionEmoji(this, data.emoji.name, data.emoji.id);
  }

  /**
   * The emoji of this reaction, either an Emoji object for known custom emojis, or a ReactionEmoji
   * object which has fewer properties. Whatever the prototype of the emoji, it will still have
   * `name`, `id`, `identifier` and `toString()`
   * @type {Emoji|ReactionEmoji}
   * @readonly
   */
  get emoji() {
    if (this._emoji instanceof Emoji) return this._emoji;
    // Check to see if the emoji has become known to the client
    if (this._emoji.id) {
      const emojis = this.message.client.emojis;
      if (emojis.has(this._emoji.id)) {
        const emoji = emojis.get(this._emoji.id);
        this._emoji = emoji;
        return emoji;
      }
    }
    return this._emoji;
  }

  /**
   * Removes a user from this reaction.
   * @param {UserResolvable} [user=this.message.client.user] The user to remove the reaction of
   * @returns {Promise<MessageReaction>}
   */
  remove(user = this.message.client.user) {
    const userID = this.message.client.users.resolveID(user);
    if (!userID) return Promise.reject(new Error('REACTION_RESOLVE_USER'));
    return this.message.client.api.channels[this.message.channel.id].messages[this.message.id]
      .reactions[this.emoji.identifier][userID === this.message.client.user.id ? '@me' : userID]
      .delete()
      .then(() =>
        this.message.client.actions.MessageReactionRemove.handle({
          user_id: userID,
          message_id: this.message.id,
          emoji: this.emoji,
          channel_id: this.message.channel.id,
        }).reaction
      );
  }

  /**
   * Fetch all the users that gave this reaction. Resolves with a collection of users, mapped by their IDs.
   * @param {Object} [options] Options for fetching the users
   * @param {number} [options.limit=100] The maximum amount of users to fetch, defaults to 100
   * @param {Snowflake} [options.after] Limit fetching users to those with an id greater than the supplied id
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  async fetchUsers({ limit = 100, after } = {}) {
    const message = this.message;
    const users = await message.client.api.channels[message.channel.id].messages[message.id]
      .reactions[this.emoji.identifier]
      .get({ query: { limit, after } });
    for (const rawUser of users) {
      const user = message.client.users.create(rawUser);
      this.users.set(user.id, user);
    }
    this.count = this.users.size;
    return this.users;
  }

  _add(user) {
    if (!this.users.has(user.id)) {
      this.users.set(user.id, user);
      this.count++;
    }
    if (!this.me) this.me = user.id === this.message.client.user.id;
  }

  _remove(user) {
    if (this.users.has(user.id)) {
      this.users.delete(user.id);
      this.count--;
      if (user.id === this.message.client.user.id) this.me = false;
      if (this.count <= 0) {
        this.message.reactions.remove(this.emoji.id || this.emoji.name);
      }
    }
  }
}

module.exports = MessageReaction;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(11);
const TextBasedChannel = __webpack_require__(17);
const Collection = __webpack_require__(3);
const DataResolver = __webpack_require__(10);
const MessageStore = __webpack_require__(21);

/*
{ type: 3,
  recipients:
   [ { username: 'Charlie',
       id: '123',
       discriminator: '6631',
       avatar: '123' },
     { username: 'Ben',
       id: '123',
       discriminator: '2055',
       avatar: '123' },
     { username: 'Adam',
       id: '123',
       discriminator: '2406',
       avatar: '123' } ],
  owner_id: '123',
  name: null,
  last_message_id: '123',
  id: '123',
  icon: null }
*/

/**
 * Represents a Group DM on Discord.
 * @extends {Channel}
 * @implements {TextBasedChannel}
 */
class GroupDMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    this.messages = new MessageStore(this);
    this._typing = new Map();
  }

  _patch(data) {
    super._patch(data);

    /**
     * The name of this Group DM, can be null if one isn't set
     * @type {string}
     */
    this.name = data.name;

    /**
     * A hash of this Group DM icon
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The user ID of this Group DM's owner
     * @type {Snowflake}
     */
    this.ownerID = data.owner_id;

    /**
     * If the DM is managed by an application
     * @type {boolean}
     */
    this.managed = data.managed;

    /**
     * Application ID of the application that made this Group DM, if applicable
     * @type {?Snowflake}
     */
    this.applicationID = data.application_id;

    if (data.nicks) {
      /**
       * Nicknames for group members
       * @type {?Collection<Snowflake, string>}
       */
      this.nicks = new Collection(data.nicks.map(n => [n.id, n.nick]));
    }

    if (!this.recipients) {
      /**
       * A collection of the recipients of this DM, mapped by their ID
       * @type {Collection<Snowflake, User>}
       */
      this.recipients = new Collection();
    }

    if (data.recipients) {
      for (const recipient of data.recipients) {
        const user = this.client.users.create(recipient);
        this.recipients.set(user.id, user);
      }
    }

    this.lastMessageID = data.last_message_id;
  }

  /**
   * The owner of this Group DM
   * @type {User}
   * @readonly
   */
  get owner() {
    return this.client.users.get(this.ownerID);
  }

  /**
   * Gets the URL to this Group DM's icon.
   * @param {Object} [options={}] Options for the icon url
   * @param {string} [options.format='webp'] One of `webp`, `png`, `jpg`
   * @param {number} [options.size=128] One of `128`, `256`, `512`, `1024`, `2048`
   * @returns {?string}
   */
  iconURL({ format, size } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.GDMIcon(this.id, this.icon, format, size);
  }

  /**
   * Whether this channel equals another channel. It compares all properties, so for most operations
   * it is advisable to just compare `channel.id === channel2.id` as it is much faster and is often
   * what most users need.
   * @param {GroupDMChannel} channel Channel to compare with
   * @returns {boolean}
   */
  equals(channel) {
    const equal = channel &&
      this.id === channel.id &&
      this.name === channel.name &&
      this.icon === channel.icon &&
      this.ownerID === channel.ownerID;

    if (equal) {
      return this.recipients.equals(channel.recipients);
    }

    return equal;
  }

  /**
   * Edits this Group DM.
   * @param {Object} data New data for this Group DM
   * @param {string} [reason] Reason for editing this Group DM
   * @returns {Promise<GroupDMChannel>}
   */
  edit(data, reason) {
    return this.client.api.channels[this.id].patch({
      data: {
        icon: data.icon,
        name: data.name === null ? null : data.name || this.name,
      },
      reason,
    }).then(() => this);
  }

  /**
   * Sets a new icon for this Group DM.
   * @param {Base64Resolvable|BufferResolvable} icon The new icon of this Group DM
   * @returns {Promise<GroupDMChannel>}
   */
  async setIcon(icon) {
    return this.edit({ icon: await DataResolver.resolveImage(icon) });
  }

  /**
   * Sets a new name for this Group DM.
   * @param {string} name New name for this Group DM
   * @returns {Promise<GroupDMChannel>}
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Adds an user to this Group DM.
   * @param {Object} options Options for this method
   * @param {UserResolvable} options.user User to add to this Group DM
   * @param {string} [options.accessToken] Access token to use to add the user to this Group DM
   * (only available under a bot account)
   * @param {string} [options.nick] Permanent nickname to give the user (only available under a bot account)
   * @returns {Promise<GroupDMChannel>}
   */
  addUser({ user, accessToken, nick }) {
    const id = this.client.users.resolveID(user);
    const data = this.client.user.bot ?
      { nick, access_token: accessToken } :
      { recipient: id };
    return this.client.api.channels[this.id].recipients[id].put({ data })
      .then(() => this);
  }

  /**
   * Removes an user from this Group DM.
   * @param {UserResolvable} user User to remove
   * @returns {Promise<GroupDMChannel>}
   */
  removeUser(user) {
    const id = this.client.users.resolveID(user);
    return this.client.api.channels[this.id].recipients[id].delete()
      .then(() => this);
  }

  /**
   * When concatenated with a string, this automatically concatenates the channel's name instead of the Channel object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Group DM!
   * console.log(`Hello from ${channel}!`);
   * @example
   * // Logs: Hello from My Group DM!
   * console.log(`Hello from ' + channel + '!');
   */
  toString() {
    return this.name;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  search() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createMessageCollector() {}
  awaitMessages() {}
  // Doesn't work on Group DMs; bulkDelete() {}
  acknowledge() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(GroupDMChannel, true, ['bulkDelete']);

module.exports = GroupDMChannel;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

const GuildChannel = __webpack_require__(15);
const Webhook = __webpack_require__(16);
const TextBasedChannel = __webpack_require__(17);
const Collection = __webpack_require__(3);
const DataResolver = __webpack_require__(10);
const MessageStore = __webpack_require__(21);

/**
 * Represents a guild text channel on Discord.
 * @extends {GuildChannel}
 * @implements {TextBasedChannel}
 */
class TextChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);
    this.messages = new MessageStore(this);
    this._typing = new Map();
  }

  _patch(data) {
    super._patch(data);

    /**
     * The topic of the text channel
     * @type {?string}
     */
    this.topic = data.topic;

    /**
     * If the Discord considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = Boolean(data.nsfw);

    this.lastMessageID = data.last_message_id;

    if (data.messages) for (const message of data.messages) this.messages.create(message);
  }

  /**
   * Fetch all webhooks for the channel.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   */
  fetchWebhooks() {
    return this.client.api.channels[this.id].webhooks.get().then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  /**
   * Create a webhook for the channel.
   * @param {string} name The name of the webhook
   * @param {Object} [options] Options for creating the webhook
   * @param {BufferResolvable|Base64Resolvable} [options.avatar] Avatar for the webhook
   * @param {string} [options.reason] Reason for creating the webhook
   * @returns {Promise<Webhook>} webhook The created webhook
   * @example
   * channel.createWebhook('Snek', 'https://i.imgur.com/mI8XcpG.jpg')
   *   .then(webhook => console.log(`Created webhook ${webhook}`))
   *   .catch(console.error)
   */
  async createWebhook(name, { avatar, reason } = {}) {
    if (typeof avatar === 'string' && !avatar.startsWith('data:')) {
      avatar = await DataResolver.resolveImage(avatar);
    }
    return this.client.api.channels[this.id].webhooks.post({ data: {
      name, avatar,
    }, reason }).then(data => new Webhook(this.client, data));
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  search() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createMessageCollector() {}
  awaitMessages() {}
  bulkDelete() {}
  acknowledge() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(TextChannel, true);

module.exports = TextChannel;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const Permissions = __webpack_require__(9);

/**
 * Represents a permission overwrite for a role or member in a guild channel.
 */
class PermissionOverwrites {
  constructor(guildChannel, data) {
    /**
     * The GuildChannel this overwrite is for
     * @name PermissionOverwrites#channel
     * @type {GuildChannel}
     * @readonly
     */
    Object.defineProperty(this, 'channel', { value: guildChannel });

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of this overwrite, either a user ID or a role ID
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of a permission overwrite. It can be one of:
     * * member
     * * role
     * @typedef {string} OverwriteType
     */

    /**
     * The type of this overwrite
     * @type {OverwriteType}
     */
    this.type = data.type;

    /**
     * The permissions that are denied for the user or role.
     * @type {Permissions}
     */
    this.denied = new Permissions(data.deny).freeze();

    /**
     * The permissions that are allowed for the user or role.
     * @type {Permissions}
     */
    this.allowed = new Permissions(data.allow).freeze();
  }

  /**
   * Delete this Permission Overwrite.
   * @param {string} [reason] Reason for deleting this overwrite
   * @returns {Promise<PermissionOverwrites>}
   */
  delete(reason) {
    return this.channel.client.api.channels[this.channel.id].permissions[this.id]
      .delete({ reason })
      .then(() => this);
  }
}

module.exports = PermissionOverwrites;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

const GuildChannel = __webpack_require__(15);
const Collection = __webpack_require__(3);
const { browser } = __webpack_require__(0);
const { Error } = __webpack_require__(4);

/**
 * Represents a guild voice channel on Discord.
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);

    /**
     * The members in this voice channel
     * @type {Collection<Snowflake, GuildMember>}
     * @name VoiceChannel#members
     */
    Object.defineProperty(this, 'members', { value: new Collection() });
  }

  _patch(data) {
    super._patch(data);
    /**
     * The bitrate of this voice channel
     * @type {number}
     */
    this.bitrate = data.bitrate * 0.001;

    /**
     * The maximum amount of users allowed in this channel - 0 means unlimited.
     * @type {number}
     */
    this.userLimit = data.user_limit;
  }

  /**
   * The voice connection for this voice channel, if the client is connected
   * @type {?VoiceConnection}
   * @readonly
   */
  get connection() {
    const connection = this.guild.voiceConnection;
    if (connection && connection.channel.id === this.id) return connection;
    return null;
  }

  /**
   * Checks if the voice channel is full
   * @type {boolean}
   * @readonly
   */
  get full() {
    return this.userLimit > 0 && this.members.size >= this.userLimit;
  }

  /**
   * Checks if the client has permission join the voice channel
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    if (browser) return false;
    if (!this.permissionsFor(this.client.user).has('CONNECT')) return false;
    if (this.full && !this.permissionsFor(this.client.user).has('MOVE_MEMBERS')) return false;
    return true;
  }

  /**
   * Checks if the client has permission to send audio to the voice channel
   * @type {boolean}
   * @readonly
   */
  get speakable() {
    return this.permissionsFor(this.client.user).has('SPEAK');
  }

  /**
   * Sets the bitrate of the channel (in kbps).
   * @param {number} bitrate The new bitrate
   * @param {string} [reason] Reason for changing the channel's bitrate
   * @returns {Promise<VoiceChannel>}
   * @example
   * // Set the bitrate of a voice channel
   * voiceChannel.setBitrate(48)
   *   .then(vc => console.log(`Set bitrate to ${vc.bitrate}kbps for ${vc.name}`))
   *   .catch(console.error);
   */
  setBitrate(bitrate, reason) {
    bitrate *= 1000;
    return this.edit({ bitrate }, reason);
  }

  /**
   * Sets the user limit of the channel.
   * @param {number} userLimit The new user limit
   * @param {string} [reason] Reason for changing the user limit
   * @returns {Promise<VoiceChannel>}
   * @example
   * // Set the user limit of a voice channel
   * voiceChannel.setUserLimit(42)
   *   .then(vc => console.log(`Set user limit to ${vc.userLimit} for ${vc.name}`))
   *   .catch(console.error);
   */
  setUserLimit(userLimit, reason) {
    return this.edit({ userLimit }, reason);
  }

  /**
   * Attempts to join this voice channel.
   * @returns {Promise<VoiceConnection>}
   * @example
   * // Join a voice channel
   * voiceChannel.join()
   *   .then(connection => console.log('Connected!'))
   *   .catch(console.error);
   */
  join() {
    if (browser) return Promise.reject(new Error('VOICE_NO_BROWSER'));
    return this.client.voice.joinChannel(this);
  }

  /**
   * Leaves this voice channel.
   * @example
   * // Leave a voice channel
   * voiceChannel.leave();
   */
  leave() {
    if (browser) return;
    const connection = this.client.voice.connections.get(this.guild.id);
    if (connection && connection.channel.id === this.id) connection.disconnect();
  }
}

module.exports = VoiceChannel;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);
const Snowflake = __webpack_require__(7);
const Webhook = __webpack_require__(16);

const Targets = {
  ALL: 'ALL',
  GUILD: 'GUILD',
  CHANNEL: 'CHANNEL',
  USER: 'USER',
  ROLE: 'ROLE',
  INVITE: 'INVITE',
  WEBHOOK: 'WEBHOOK',
  EMOJI: 'EMOJI',
  MESSAGE: 'MESSAGE',
  UNKNOWN: 'UNKNOWN',
};

const Actions = {
  ALL: null,
  GUILD_UPDATE: 1,
  CHANNEL_CREATE: 10,
  CHANNEL_UPDATE: 11,
  CHANNEL_DELETE: 12,
  CHANNEL_OVERWRITE_CREATE: 13,
  CHANNEL_OVERWRITE_UPDATE: 14,
  CHANNEL_OVERWRITE_DELETE: 15,
  MEMBER_KICK: 20,
  MEMBER_PRUNE: 21,
  MEMBER_BAN_ADD: 22,
  MEMBER_BAN_REMOVE: 23,
  MEMBER_UPDATE: 24,
  MEMBER_ROLE_UPDATE: 25,
  ROLE_CREATE: 30,
  ROLE_UPDATE: 31,
  ROLE_DELETE: 32,
  INVITE_CREATE: 40,
  INVITE_UPDATE: 41,
  INVITE_DELETE: 42,
  WEBHOOK_CREATE: 50,
  WEBHOOK_UPDATE: 51,
  WEBHOOK_DELETE: 52,
  EMOJI_CREATE: 60,
  EMOJI_UPDATE: 61,
  EMOJI_DELETE: 62,
  MESSAGE_DELETE: 72,
};


/**
 * Audit logs entries are held in this class.
 */
class GuildAuditLogs {
  constructor(guild, data) {
    if (data.users) for (const user of data.users) guild.client.users.create(user);
    /**
     * Cached webhooks
     * @type {Collection<Snowflake, Webhook>}
     * @private
     */
    this.webhooks = new Collection();
    if (data.webhooks) {
      for (const hook of data.webhooks) {
        this.webhooks.set(hook.id, new Webhook(guild.client, hook));
      }
    }

    /**
     * The entries for this guild's audit logs
     * @type {Collection<Snowflake, GuildAuditLogsEntry>}
     */
    this.entries = new Collection();
    for (const item of data.audit_log_entries) {
      const entry = new GuildAuditLogsEntry(guild, item);
      this.entries.set(entry.id, entry);
    }
  }

  /**
   * Handles possible promises for entry targets.
   * @returns {Promise<GuildAuditLogs>}
   */
  static build(...args) {
    const logs = new GuildAuditLogs(...args);
    return Promise.all(logs.entries.map(e => e.target)).then(() => logs);
  }

  /**
   * The target type of an entry, e.g. `GUILD`. Here are the available types:
   * * GUILD
   * * CHANNEL
   * * USER
   * * ROLE
   * * INVITE
   * * WEBHOOK
   * * EMOJI
   * * MESSAGE
   * @typedef {string} TargetType
   */

  /**
   * The target for an audit log entry. It can be one of:
   * * A guild
   * * A user
   * * A role
   * * An emoji
   * * An invite
   * * A webhook
   * * An object where the keys represent either the new value or the old value
   * @typedef {?Object|Guild|User|Role|Emoji|Invite|Webhook} EntryTarget
   */

  /**
   * Find target type from entry action.
   * @param {number} target The action target
   * @returns {?string}
   */
  static targetType(target) {
    if (target < 10) return Targets.GUILD;
    if (target < 20) return Targets.CHANNEL;
    if (target < 30) return Targets.USER;
    if (target < 40) return Targets.ROLE;
    if (target < 50) return Targets.INVITE;
    if (target < 60) return Targets.WEBHOOK;
    if (target < 70) return Targets.EMOJI;
    if (target < 80) return Targets.MESSAGE;
    return Targets.UNKNOWN;
  }

  /**
   * The action type of an entry, e.g. `CREATE`. Here are the available types:
   * * CREATE
   * * DELETE
   * * UPDATE
   * @typedef {string} ActionType
   */

  /**
   * Find action type from entry action.
   * @param {string} action The action target
   * @returns {string}
   */
  static actionType(action) {
    if ([
      Actions.CHANNEL_CREATE,
      Actions.CHANNEL_OVERWRITE_CREATE,
      Actions.MEMBER_BAN_REMOVE,
      Actions.ROLE_CREATE,
      Actions.INVITE_CREATE,
      Actions.WEBHOOK_CREATE,
      Actions.EMOJI_CREATE,
    ].includes(action)) return 'CREATE';

    if ([
      Actions.CHANNEL_DELETE,
      Actions.CHANNEL_OVERWRITE_DELETE,
      Actions.MEMBER_KICK,
      Actions.MEMBER_PRUNE,
      Actions.MEMBER_BAN_ADD,
      Actions.ROLE_DELETE,
      Actions.INVITE_DELETE,
      Actions.WEBHOOK_DELETE,
      Actions.EMOJI_DELETE,
      Actions.MESSAGE_DELETE,
    ].includes(action)) return 'DELETE';

    if ([
      Actions.GUILD_UPDATE,
      Actions.CHANNEL_UPDATE,
      Actions.CHANNEL_OVERWRITE_UPDATE,
      Actions.MEMBER_UPDATE,
      Actions.MEMBER_ROLE_UPDATE,
      Actions.ROLE_UPDATE,
      Actions.INVITE_UPDATE,
      Actions.WEBHOOK_UPDATE,
      Actions.EMOJI_UPDATE,
    ].includes(action)) return 'UPDATE';

    return 'ALL';
  }
}

/**
 * Audit logs entry.
 */
class GuildAuditLogsEntry {
  constructor(guild, data) {
    const targetType = GuildAuditLogs.targetType(data.action_type);
    /**
     * The target type of this entry
     * @type {TargetType}
     */
    this.targetType = targetType;

    /**
     * The action type of this entry
     * @type {ActionType}
     */
    this.actionType = GuildAuditLogs.actionType(data.action_type);

    /**
     * Specific action type of this entry
     * @type {string}
     */
    this.action = Object.keys(Actions).find(k => Actions[k] === data.action_type);

    /**
     * The reason of this entry
     * @type {?string}
     */
    this.reason = data.reason || null;

    /**
     * The user that executed this entry
     * @type {User}
     */
    this.executor = guild.client.users.get(data.user_id);

    /**
     * An entry in the audit log representing a specific change.
     * @typedef {object} AuditLogChange
     * @property {string} key The property that was changed, e.g. `nick` for nickname changes
     * @property {*} [old] The old value of the change, e.g. for nicknames, the old nickname
     * @property {*} [new] The new value of the change, e.g. for nicknames, the new nickname
     */

    /**
     * Specific property changes
     * @type {AuditLogChange[]}
     */
    this.changes = data.changes ? data.changes.map(c => ({ key: c.key, old: c.old_value, new: c.new_value })) : null;

    /**
     * The ID of this entry
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * Any extra data from the entry
     * @type {?Object|Role|GuildMember}
     */
    this.extra = null;
    if (data.options) {
      if (data.action_type === Actions.MEMBER_PRUNE) {
        this.extra = {
          removed: data.options.members_removed,
          days: data.options.delete_member_days,
        };
      } else if (data.action_type === Actions.MESSAGE_DELETE) {
        this.extra = {
          count: data.options.count,
          channel: guild.channels.get(data.options.channel_id),
        };
      } else {
        switch (data.options.type) {
          case 'member':
            this.extra = guild.members.get(data.options.id);
            if (!this.extra) this.extra = { id: data.options.id };
            break;
          case 'role':
            this.extra = guild.roles.get(data.options.id);
            if (!this.extra) this.extra = { id: data.options.id, name: data.options.role_name };
            break;
          default:
            break;
        }
      }
    }


    if (targetType === Targets.UNKNOWN) {
      /**
       * The target of this entry
       * @type {EntryTarget}
       */
      this.target = this.changes.reduce((o, c) => {
        o[c.key] = c.new || c.old;
        return o;
      }, {});
      this.target.id = data.target_id;
    } else if ([Targets.USER, Targets.GUILD].includes(targetType)) {
      this.target = guild.client[`${targetType.toLowerCase()}s`].get(data.target_id);
    } else if (targetType === Targets.WEBHOOK) {
      this.target = this.webhooks.get(data.target_id);
    } else if (targetType === Targets.INVITE) {
      if (guild.me.permissions.has('MANAGE_GUILD')) {
        const change = this.changes.find(c => c.key === 'code');
        this.target = guild.fetchInvites()
          .then(invites => {
            this.target = invites.find(i => i.code === (change.new || change.old));
            return this.target;
          });
      } else {
        this.target = this.changes.reduce((o, c) => {
          o[c.key] = c.new || c.old;
          return o;
        }, {});
      }
    } else if (targetType === Targets.MESSAGE) {
      this.target = guild.client.users.get(data.target_id);
    } else {
      this.target = guild[`${targetType.toLowerCase()}s`].get(data.target_id);
    }
  }

  /**
   * The timestamp this entry was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time this entry was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }
}

GuildAuditLogs.Actions = Actions;
GuildAuditLogs.Targets = Targets;
GuildAuditLogs.Entry = GuildAuditLogsEntry;

module.exports = GuildAuditLogs;


/***/ }),
/* 51 */
/***/ (function(module, exports) {

/**
 * Represents a Discord voice region for guilds.
 */
class VoiceRegion {
  constructor(data) {
    /**
     * The ID of the region
     * @type {string}
     */
    this.id = data.id;

    /**
     * Name of the region
     * @type {string}
     */
    this.name = data.name;

    /**
     * Whether the region is VIP-only
     * @type {boolean}
     */
    this.vip = data.vip;

    /**
     * Whether the region is deprecated
     * @type {boolean}
     */
    this.deprecated = data.deprecated;

    /**
     * Whether the region is optimal
     * @type {boolean}
     */
    this.optimal = data.optimal;

    /**
     * Whether the region is custom
     * @type {boolean}
     */
    this.custom = data.custom;

    /**
     * A sample hostname for what a connection might look like
     * @type {string}
     */
    this.sampleHostname = data.sample_hostname;
  }
}

module.exports = VoiceRegion;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Emoji = __webpack_require__(33);
const ReactionEmoji = __webpack_require__(34);

/**
 * Stores emojis.
 * @private
 * @extends {DataStore}
 */
class EmojiStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, Emoji);
    this.guild = guild;
  }

  create(data, cache) {
    return super.create(data, cache, { extras: [this.guild] });
  }

  /**
   * Data that can be resolved into an Emoji object. This can be:
   * * A custom emoji ID
   * * An Emoji object
   * * A ReactionEmoji object
   * @typedef {Snowflake|Emoji|ReactionEmoji} EmojiResolvable
   */

  /**
   * Resolves a EmojiResolvable to a Emoji object.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?Emoji}
   */
  resolve(emoji) {
    if (emoji instanceof ReactionEmoji) return super.resolve(emoji.id);
    return super.resolve(emoji);
  }

  /**
   * Resolves a EmojiResolvable to a Emoji ID string.
   * @param {EmojiResolvable} emoji The Emoji resolvable to identify
   * @returns {?string}
   */
  resolveID(emoji) {
    if (emoji instanceof ReactionEmoji) return emoji.id;
    return super.resolveID(emoji);
  }

  /**
   * Data that can be resolved to give an emoji identifier. This can be:
   * * The unicode representation of an emoji
   * * An EmojiResolveable
   * @typedef {string|EmojiResolvable} EmojiIdentifierResolvable
   */

  /**
   * Resolves an EmojiResolvable to an emoji identifier.
   * @param {EmojiIdentifierResolvable} emoji The emoji resolvable to resolve
   * @returns {?string}
   */
  resolveIdentifier(emoji) {
    const emojiResolveable = this.resolve(emoji);
    if (emojiResolveable) return emojiResolveable.identifier;
    if (typeof emoji === 'string') {
      if (!emoji.includes('%')) return encodeURIComponent(emoji);
      else return emoji;
    }
    return null;
  }
}

module.exports = EmojiStore;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const { Presence } = __webpack_require__(13);

/**
 * Stores presences.
 * @private
 * @extends {DataStore}
 */
class PresenceStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Presence);
  }

  create(data, cache) {
    const existing = this.get(data.user.id);
    return existing ? existing.patch(data) : super.create(data, cache, { id: data.user.id });
  }

  /**
   * Data that can be resolved to a Presence object. This can be:
   * * A Presence
   * * A UserResolvable
   * * A Snowflake
   * @typedef {Presence|UserResolvable|Snowflake} PresenceResolvable
   */

  /**
    * Resolves a PresenceResolvable to a Presence object.
    * @param {PresenceResolvable} presence The presence resolvable to resolve
    * @returns {?Presence}
    */
  resolve(presence) {
    const presenceResolveable = super.resolve(presence);
    if (presenceResolveable) return presenceResolveable;
    const UserResolveable = this.client.users.resolveID(presence);
    return super.resolve(UserResolveable) || null;
  }

  /**
    * Resolves a PresenceResolvable to a Presence ID string.
    * @param {PresenceResolvable} presence The presence resolvable to resolve
    * @returns {?string}
    */
  resolveID(presence) {
    const presenceResolveable = super.resolveID(presence);
    if (presenceResolveable) return presenceResolveable;
    const userResolveable = this.client.users.resolveID(presence);
    return this.has(userResolveable) ? userResolveable : null;
  }
}

module.exports = PresenceStore;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

const { UserSettingsMap } = __webpack_require__(0);
const Util = __webpack_require__(5);
const { Error } = __webpack_require__(4);

/**
 * A wrapper around the ClientUser's settings.
 */
class ClientUserSettings {
  constructor(user, data) {
    this.user = user;
    this.patch(data);
  }

  /**
   * Patch the data contained in this class with new partial data.
   * @param {Object} data Data to patch this with
   * @private
   */
  patch(data) {
    for (const [key, value] of Object.entries(UserSettingsMap)) {
      if (!data.hasOwnProperty(key)) continue;
      if (typeof value === 'function') {
        this[value.name] = value(data[key]);
      } else {
        this[value] = data[key];
      }
    }
  }

  /**
   * Update a specific property of of user settings.
   * @param {string} name Name of property
   * @param {*} value Value to patch
   * @returns {Promise<Object>}
   * @private
   */
  update(name, value) {
    return this.user.client.api.users['@me'].settings.patch({ data: { [name]: value } });
  }

  /**
   * Sets the position of the guild in the guild listing.
   * @param {Guild} guild The guild to move
   * @param {number} position Absolute or relative position
   * @param {boolean} [relative=false] Whether to position relatively or absolutely
   * @returns {Promise<Guild>}
   */
  setGuildPosition(guild, position, relative) {
    const temp = Object.assign([], this.guildPositions);
    Util.moveElementInArray(temp, guild.id, position, relative);
    return this.update('guild_positions', temp).then(() => guild);
  }

  /**
   * Add a guild to the list of restricted guilds.
   * @param {Guild} guild The guild to add
   * @returns {Promise<Guild>}
   */
  addRestrictedGuild(guild) {
    const temp = Object.assign([], this.restrictedGuilds);
    if (temp.includes(guild.id)) return Promise.reject(new Error('GUILD_RESTRICTED', true));
    temp.push(guild.id);
    return this.update('restricted_guilds', temp).then(() => guild);
  }

  /**
   * Remove a guild from the list of restricted guilds.
   * @param {Guild} guild The guild to remove
   * @returns {Promise<Guild>}
   */
  removeRestrictedGuild(guild) {
    const temp = Object.assign([], this.restrictedGuilds);
    const index = temp.indexOf(guild.id);
    if (index < 0) return Promise.reject(new Error('GUILD_RESTRICTED'));
    temp.splice(index, 1);
    return this.update('restricted_guilds', temp).then(() => guild);
  }
}

module.exports = ClientUserSettings;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

const { UserGuildSettingsMap } = __webpack_require__(0);
const Collection = __webpack_require__(3);
const ClientUserChannelOverride = __webpack_require__(89);

/**
 * A wrapper around the ClientUser's guild settings.
 */
class ClientUserGuildSettings {
  constructor(client, data) {
    /**
     * The client that created the instance of the ClientUserGuildSettings
     * @name ClientUserGuildSettings#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    /**
     * The ID of the guild this settings are for
     * @type {Snowflake}
     */
    this.guildID = data.guild_id;
    this.channelOverrides = new Collection();
    this.patch(data);
  }

  /**
   * Patch the data contained in this class with new partial data.
   * @param {Object} data Data to patch this with
   * @private
   */
  patch(data) {
    for (const [key, value] of Object.entries(UserGuildSettingsMap)) {
      if (!data.hasOwnProperty(key)) continue;
      if (key === 'channel_overrides') {
        for (const channel of data[key]) {
          const override = this.channelOverrides.get(channel.channel_id);
          if (override) override.patch(channel);
          else this.channelOverrides.set(channel.channel_id, new ClientUserChannelOverride(channel));
        }
      } else if (typeof value === 'function') {
        this[value.name] = value(data[key]);
      } else {
        this[value] = data[key];
      }
    }
  }

  /**
   * Update a specific property of the guild settings.
   * @param {string} name Name of property
   * @param {*} value Value to patch
   * @returns {Promise<Object>}
   * @private
   */
  update(name, value) {
    return this.client.api.users('@me').guilds(this.guildID).settings.patch({ data: { [name]: value } });
  }
}

module.exports = ClientUserGuildSettings;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

const { browser } = __webpack_require__(0);
const zlib = __webpack_require__(32);
const querystring = __webpack_require__(27);

if (browser) {
  exports.WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    exports.WebSocket = __webpack_require__(126);
  } catch (err) {
    exports.WebSocket = __webpack_require__(127);
  }
}

try {
  var erlpack = __webpack_require__(128);
  if (!erlpack.pack) erlpack = null;
} catch (err) {} // eslint-disable-line no-empty

exports.encoding = erlpack ? 'etf' : 'json';

exports.pack = erlpack ? erlpack.pack : JSON.stringify;

exports.unpack = data => {
  if (Array.isArray(data)) data = Buffer.concat(data);
  if (!browser && data instanceof ArrayBuffer) data = Buffer.from(new Uint8Array(data));

  if (erlpack && typeof data !== 'string') {
    return erlpack.unpack(data);
  } else if (data instanceof ArrayBuffer || (!browser && data instanceof Buffer)) {
    data = zlib.inflateSync(data).toString();
  }
  return JSON.parse(data);
};

exports.create = (gateway, query = {}, ...args) => {
  const [g, q] = gateway.split('?');
  query.encoding = exports.encoding;
  if (q) query = Object.assign(querystring.parse(q), query);
  const ws = new exports.WebSocket(`${g}?${querystring.stringify(query)}`, ...args);
  if (browser) ws.binaryType = 'arraybuffer';
  return ws;
};

for (const state of ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']) exports[state] = exports.WebSocket[state];


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(5);

module.exports = {
  // "Root" classes (starting points)
  BaseClient: __webpack_require__(28),
  Client: __webpack_require__(73),
  Shard: __webpack_require__(164),
  ShardClientUtil: __webpack_require__(165),
  ShardingManager: __webpack_require__(166),
  WebhookClient: __webpack_require__(167),

  // Utilities
  Collection: __webpack_require__(3),
  Constants: __webpack_require__(0),
  DataResolver: __webpack_require__(10),
  DataStore: __webpack_require__(6),
  DiscordAPIError: __webpack_require__(38),
  EvaluatedPermissions: __webpack_require__(9),
  Permissions: __webpack_require__(9),
  Snowflake: __webpack_require__(7),
  SnowflakeUtil: __webpack_require__(7),
  Util: Util,
  util: Util,
  version: __webpack_require__(35).version,

  // Shortcuts to Util methods
  escapeMarkdown: Util.escapeMarkdown,
  fetchRecommendedShards: Util.fetchRecommendedShards,
  splitMessage: Util.splitMessage,

  // Structures
  Activity: __webpack_require__(13).Activity,
  Channel: __webpack_require__(11),
  ClientUser: __webpack_require__(39),
  ClientUserSettings: __webpack_require__(54),
  Collector: __webpack_require__(29),
  DMChannel: __webpack_require__(42),
  Emoji: __webpack_require__(33),
  GroupDMChannel: __webpack_require__(46),
  Guild: __webpack_require__(24),
  GuildAuditLogs: __webpack_require__(50),
  GuildChannel: __webpack_require__(15),
  GuildMember: __webpack_require__(12),
  Invite: __webpack_require__(23),
  Message: __webpack_require__(30),
  MessageAttachment: __webpack_require__(18),
  MessageCollector: __webpack_require__(40),
  MessageEmbed: __webpack_require__(14),
  MessageMentions: __webpack_require__(43),
  MessageReaction: __webpack_require__(45),
  ClientApplication: __webpack_require__(31),
  PermissionOverwrites: __webpack_require__(48),
  Presence: __webpack_require__(13).Presence,
  ReactionEmoji: __webpack_require__(34),
  ReactionCollector: __webpack_require__(44),
  Role: __webpack_require__(22),
  TextChannel: __webpack_require__(47),
  User: __webpack_require__(20),
  VoiceChannel: __webpack_require__(49),
  Webhook: __webpack_require__(16),

  WebSocket: __webpack_require__(56),
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

const browser = typeof window !== 'undefined';
const qs = __webpack_require__(27);
const Package = __webpack_require__(61);
const transport = browser ? __webpack_require__(62) : __webpack_require__(63);

/**
 * Snekfetch
 * @extends Stream.Readable
 * @extends Promise
 */
class Snekfetch extends (transport.extension || Object) {
  /**
   * Create a request, but you probably wanna use `snekfetch#method`
   * @param {string} method HTTP method
   * @param {string} url URL
   * @param {Object} opts Options
   * @param {Object} [opts.headers] Headers to initialize the request with
   * @param {Object|string|Buffer} [opts.data] Data to initialize the request with
   * @param {string|Object} [opts.query] Query to intialize the request with
   */
  constructor(method, url, opts = { headers: null, data: null, query: null, version: 1 }) {
    super();
    this.options = opts;
    this.request = transport.buildRequest.call(this, method, url, opts);
    if (opts.query) this.query(opts.query);
    if (opts.data) this.send(opts.data);
  }

  /**
   * Add a query param to the request
   * @param {string|Object} name Name of query param or object to add to query
   * @param {string} [value] If name is a string value, this will be the value of the query param
   * @returns {Snekfetch} This request
   */
  query(name, value) {
    if (this.response) throw new Error('Cannot modify query after being sent!');
    if (!this.request.query) this.request.query = browser ? new URLSearchParams() : {};
    if (name !== null && typeof name === 'object') {
      for (const [k, v] of Object.entries(name)) this.query(k, v);
    } else if (browser) {
      this.request.query.set(name, value);
    } else {
      this.request.query[name] = value;
    }
    return this;
  }

  /**
   * Add a header to the request
   * @param {string|Object} name Name of query param or object to add to headers
   * @param {string} [value] If name is a string value, this will be the value of the header
   * @returns {Snekfetch} This request
   */
  set(name, value) {
    if (this.response) throw new Error('Cannot modify headers after being sent!');
    if (name !== null && typeof name === 'object') {
      for (const key of Object.keys(name)) this.set(key, name[key]);
    } else {
      this.request.setHeader(name, value);
    }
    return this;
  }

  /**
   * Attach a form data object
   * @param {string} name Name of the form attachment
   * @param {string|Object|Buffer} data Data for the attachment
   * @param {string} [filename] Optional filename if form attachment name needs to be overridden
   * @returns {Snekfetch} This request
   */
  attach(name, data, filename) {
    if (this.response) throw new Error('Cannot modify data after being sent!');
    const form = this._getFormData();
    this.set('Content-Type', `multipart/form-data; boundary=${form.boundary}`);
    form.append(name, data, filename);
    this.data = form;
    return this;
  }

  /**
   * Send data with the request
   * @param {string|Buffer|Object} data Data to send
   * @returns {Snekfetch} This request
   */
  send(data) {
    if (this.response) throw new Error('Cannot modify data after being sent!');
    if (transport.shouldSendRaw(data)) {
      this.data = data;
    } else if (data !== null && typeof data === 'object') {
      const header = this._getRequestHeader('content-type');
      let serialize;
      if (header) {
        if (header.includes('json')) serialize = JSON.stringify;
        else if (header.includes('urlencoded')) serialize = qs.stringify;
      } else {
        this.set('Content-Type', 'application/json');
        serialize = JSON.stringify;
      }
      this.data = serialize(data);
    } else {
      this.data = data;
    }
    return this;
  }

  then(resolver, rejector) {
    transport.finalizeRequest.call(this, {
      data: this.data ? this.data.end ? this.data.end() : this.data : null,
    })
      .then(({ response, raw, redirect, headers }) => {
        if (redirect) {
          let method = this.request.method;
          if ([301, 302].includes(response.statusCode)) {
            if (method !== 'HEAD') method = 'GET';
            this.data = null;
          } else if (response.statusCode === 303) {
            method = 'GET';
          }

          const redirectHeaders = {};
          if (this.request._headerNames) {
            for (const name of Object.keys(this.request._headerNames)) {
              if (name.toLowerCase() === 'host') continue;
              redirectHeaders[this.request._headerNames[name]] = this.request._headers[name];
            }
          } else {
            for (const name of Object.keys(this.request._headers)) {
              if (name.toLowerCase() === 'host') continue;
              const header = this.request._headers[name];
              redirectHeaders[header.name] = header.value;
            }
          }

          return new Snekfetch(method, redirect, {
            data: this.data,
            headers: redirectHeaders,
            agent: this.options._req.agent,
          });
        }

        const statusCode = response.statusCode || response.status;
        /**
         * @typedef {Object} SnekfetchResponse
         * @prop {HTTP.Request} request
         * @prop {?string|object|Buffer} body Processed response body
         * @prop {string} text Raw response body
         * @prop {boolean} ok If the response code is >= 200 and < 300
         * @prop {number} status HTTP status code
         * @prop {string} statusText Human readable HTTP status
         */
        const res = {
          request: this.request,
          get body() {
            delete res.body;
            const type = this.headers['content-type'];
            if (type && type.includes('application/json')) {
              try {
                res.body = JSON.parse(res.text);
              } catch (err) {
                res.body = res.text;
              }
            } else if (type && type.includes('application/x-www-form-urlencoded')) {
              res.body = qs.parse(res.text);
            } else {
              res.body = raw;
            }

            return res.body;
          },
          text: raw.toString(),
          ok: statusCode >= 200 && statusCode < 400,
          headers: headers || response.headers,
          status: statusCode,
          statusText: response.statusText || transport.STATUS_CODES[response.statusCode],
        };

        if (res.ok) {
          return res;
        } else {
          const err = new Error(`${res.status} ${res.statusText}`.trim());
          Object.assign(err, res);
          return Promise.reject(err);
        }
      })
      .then(resolver, rejector);
  }

  catch(rejector) {
    return this.then(null, rejector);
  }

  /**
   * End the request
   * @param {Function} [cb] Optional callback to handle the response
   * @returns {Promise} This request
   */
  end(cb) {
    return this.then(
      (res) => cb ? cb(null, res) : res,
      (err) => cb ? cb(err, err.status ? err : null) : err
    );
  }

  _read() {
    this.resume();
    if (this.response) return;
    this.catch((err) => this.emit('error', err));
  }

  _shouldUnzip(res) {
    if (res.statusCode === 204 || res.statusCode === 304) return false;
    if (res.headers['content-length'] === '0') return false;
    return /^\s*(?:deflate|gzip)\s*$/.test(res.headers['content-encoding']);
  }

  _shouldRedirect(res) {
    return this.options.followRedirects !== false && [301, 302, 303, 307, 308].includes(res.statusCode);
  }

  _getFormData() {
    if (!this._formData) this._formData = new transport.FormData();
    return this._formData;
  }

  _addFinalHeaders() {
    if (!this.request) return;
    if (!this._getRequestHeader('user-agent')) {
      this.set('User-Agent', `snekfetch/${Snekfetch.version} (${Package.repository.url.replace(/\.?git/, '')})`);
    }
    if (this.request.method !== 'HEAD') this.set('Accept-Encoding', 'gzip, deflate');
    if (this.data && this.data.end) this.set('Content-Length', this.data.length);
  }

  get response() {
    return this.request ? this.request.res || this.request._response || null : null;
  }

  _getRequestHeader(header) {
    // https://github.com/jhiesey/stream-http/pull/77
    try {
      return this.request.getHeader(header);
    } catch (err) {
      return null;
    }
  }
}

Snekfetch.version = Package.version;

Snekfetch.METHODS = transport.METHODS.concat('BREW');
for (const method of Snekfetch.METHODS) {
  Snekfetch[method === 'M-SEARCH' ? 'msearch' : method.toLowerCase()] = (url, opts) => new Snekfetch(method, url, opts);
}

module.exports = Snekfetch;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = {"_from":"snekfetch@^3.0.0","_id":"snekfetch@3.4.0","_inBundle":false,"_integrity":"sha512-lQ7v4CV73qbU5BHC6BuO2YiKxXsQAyASwcxdSpZi9w+ecagDs+uh588P061/CmCqqIKFJVlfgTRW1ov0ZUG0BQ==","_location":"/snekfetch","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"snekfetch@^3.0.0","name":"snekfetch","escapedName":"snekfetch","rawSpec":"^3.0.0","saveSpec":null,"fetchSpec":"^3.0.0"},"_requiredBy":["/"],"_resolved":"https://registry.npmjs.org/snekfetch/-/snekfetch-3.4.0.tgz","_shasum":"b4647d72f1b51436c844adc73fe0399d6c9270c5","_spec":"snekfetch@^3.0.0","_where":"/home/travis/build/hydrabolt/discord.js","author":{"name":"Gus Caplan","email":"me@gus.host"},"browser":{"./src/node/index.js":false},"bugs":{"url":"https://github.com/devsnek/snekfetch/issues"},"bundleDependencies":false,"dependencies":{},"deprecated":false,"description":"Just do http requests without all that weird nastiness from other libs","devDependencies":{"uglifyjs-webpack-plugin":"^1.0.0-beta.2","webpack":"^3.6.0"},"homepage":"https://github.com/devsnek/snekfetch#readme","license":"MIT","main":"index.js","name":"snekfetch","repository":{"type":"git","url":"git+https://github.com/devsnek/snekfetch.git"},"version":"3.4.0"}

/***/ }),
/* 62 */
/***/ (function(module, exports) {

function buildRequest(method, url) {
  return {
    url, method,
    redirect: this.options.followRedirects ? 'follow' : 'manual',
    _headers: {},
    setHeader(name, value) {
      this._headers[name.toLowerCase()] = value;
    },
    getHeader(name) {
      return this._headers[name.toLowerCase()];
    },
  };
}

function finalizeRequest({ data }) {
  this._addFinalHeaders();
  if (this.request.query) this.request.url = `${this.request.url}?${this.request.query}`;
  if (data) this.request.body = data;
  return fetch(this.request.url, this.request)
    .then((r) => r.text().then((t) => {
      const headers = {};
      for (const [k, v] of r.headers) headers[k.toLowerCase()] = v;
      return { response: r, raw: t, headers };
    }));
}

function shouldSendRaw() {
  return false;
}

module.exports = {
  buildRequest, finalizeRequest, shouldSendRaw,
  METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  STATUS_CODES: {},
  FormData: window.FormData,
};


/***/ }),
/* 63 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

const { register } = __webpack_require__(36);

const Messages = {
  CLIENT_INVALID_OPTION: (prop, must) => `The ${prop} option must be ${must}`,

  TOKEN_INVALID: 'An invalid token was provided.',
  TOKEN_MISSING: 'Request to use token, but token was unavailable to the client.',

  FEATURE_USER_ONLY: 'Only user accounts are able to make use of this feature.',

  WS_CONNECTION_TIMEOUT: 'The connection to the gateway timed out.',
  WS_CONNECTION_EXISTS: 'There is already an existing WebSocket connection.',
  WS_NOT_OPEN: (data = 'data') => `Websocket not open to send ${data}`,

  PERMISSION_INVALID: 'Invalid permission string or number.',

  RATELIMIT_INVALID_METHOD: 'Unknown rate limiting method.',

  SHARDING_INVALID: 'Invalid shard settings were provided.',
  SHARDING_REQUIRED: 'This session would have handled too many guilds - Sharding is required.',
  SHARDING_CHILD_CONNECTION: 'Failed to send message to shard\'s process.',
  SHARDING_PARENT_CONNECTION: 'Failed to send message to master process.',
  SHARDING_NO_SHARDS: 'No shards have been spawned',
  SHARDING_IN_PROCESS: 'Shards are still being spawned',
  SHARDING_ALREADY_SPAWNED: count => `Already spawned ${count} shards`,

  COLOR_RANGE: 'Color must be within the range 0 - 16777215 (0xFFFFFF).',
  COLOR_CONVERT: 'Unable to convert color to a number.',

  EMBED_FIELD_COUNT: 'MessageEmbeds may not exceed 25 fields.',
  EMBED_FIELD_NAME: 'MessageEmbed field names may not exceed 256 characters or be empty.',
  EMBED_FIELD_VALUE: 'MessageEmbed field values may not exceed 1024 characters or be empty.',
  EMBED_DESCRIPTION: 'MessageEmbed descriptions may not exceed 2048 characters.',
  EMBED_FOOTER_TEXT: 'MessageEmbed footer text may not exceed 2048 characters.',
  EMBED_TITLE: 'MessageEmbed titles may not exceed 256 characters.',

  FILE_NOT_FOUND: file => `File could not be found: ${file}`,

  USER_NO_DMCHANNEL: 'No DM Channel exists!',

  VOICE_INVALID_HEARTBEAT: 'Tried to set voice heartbeat but no valid interval was specified.',
  VOICE_USER_MISSING: 'Couldn\'t resolve the user to create stream.',
  VOICE_STREAM_EXISTS: 'There is already an existing stream for that user.',
  VOICE_JOIN_CHANNEL: (full = false) =>
    `You do not have permission to join this voice channel${full ? '; it is full.' : '.'}`,
  VOICE_CONNECTION_TIMEOUT: 'Connection not established within 15 seconds.',
  VOICE_TOKEN_ABSENT: 'Token not provided from voice server packet.',
  VOICE_SESSION_ABSENT: 'Session ID not supplied.',
  VOICE_INVALID_ENDPOINT: 'Invalid endpoint received.',
  VOICE_NO_BROWSER: 'Voice connections are not available in browsers.',
  VOICE_CONNECTION_ATTEMPTS_EXCEEDED: attempts => `Too many connection attempts (${attempts}).`,
  VOICE_JOIN_SOCKET_CLOSED: 'Tried to send join packet, but the WebSocket is not open.',

  OPUS_ENGINE_MISSING: 'Couldn\'t find an Opus engine.',

  UDP_SEND_FAIL: 'Tried to send a UDP packet, but there is no socket available.',
  UDP_ADDRESS_MALFORMED: 'Malformed UDP address or port.',
  UDP_CONNECTION_EXISTS: 'There is already an existing UDP connection.',

  REQ_BODY_TYPE: 'The response body isn\'t a Buffer.',
  REQ_RESOURCE_TYPE: 'The resource must be a string, Buffer or a valid file stream.',

  IMAGE_FORMAT: format => `Invalid image format: ${format}`,
  IMAGE_SIZE: size => `Invalid image size: ${size}`,

  MESSAGE_MISSING: 'Message not found',
  MESSAGE_BULK_DELETE_TYPE: 'The messages must be an Array, Collection, or number.',
  MESSAGE_NONCE_TYPE: 'Message nonce must fit in an unsigned 64-bit integer.',

  TYPING_COUNT: 'Count must be at least 1',

  SPLIT_MAX_LEN: 'Message exceeds the max length and contains no split characters.',

  BAN_RESOLVE_ID: (ban = false) => `Couldn't resolve the user ID to ${ban ? 'ban' : 'unban'}.`,

  PRUNE_DAYS_TYPE: 'Days must be a number',

  SEARCH_CHANNEL_TYPE: 'Target must be a TextChannel, DMChannel, GroupDMChannel, or Guild.',

  MESSAGE_SPLIT_MISSING: 'Message exceeds the max length and contains no split characters.',

  GUILD_CHANNEL_RESOLVE: 'Could not resolve channel to a guild channel.',
  GUILD_CHANNEL_ORPHAN: 'Could not find a parent to this guild channel.',
  GUILD_OWNED: 'Guild is owned by the client.',
  GUILD_RESTRICTED: (state = false) => `Guild is ${state ? 'already' : 'not'} restricted.`,
  GUILD_MEMBERS_TIMEOUT: 'Members didn\'t arrive in time.',

  INVALID_TYPE: (name, expected, an = false) => `Supplied ${name} is not a${an ? 'n' : ''} ${expected}.`,

  WEBHOOK_MESSAGE: 'The message was not sent by a webhook.',

  EMOJI_TYPE: 'Emoji must be a string or Emoji/ReactionEmoji',

  REACTION_RESOLVE_USER: 'Couldn\'t resolve the user ID to remove from the reaction.',
};

for (const [name, message] of Object.entries(Messages)) register(name, message);


/***/ }),
/* 65 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  sequential: __webpack_require__(67),
  burst: __webpack_require__(68),
  RequestHandler: __webpack_require__(69),
};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = function sequential() {
  if (this.busy || this.limited || this.queue.length === 0) return;
  this.busy = true;
  this.execute(this.queue.shift())
    .then(() => {
      this.busy = false;
      this.handle();
    })
    .catch(({ timeout }) => {
      this.client.setTimeout(() => {
        this.reset();
        this.busy = false;
        this.handle();
      }, timeout || (this.resetTime - Date.now() + this.timeDifference + this.client.options.restTimeOffset));
    });
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = function burst() {
  if (this.limited || this.queue.length === 0) return;
  this.execute(this.queue.shift())
    .then(this.handle.bind(this))
    .catch(({ timeout }) => {
      this.client.setTimeout(() => {
        this.reset();
        this.handle();
      }, timeout || (this.resetTime - Date.now() + this.timeDifference + this.client.options.restTimeOffset));
    });
  this.remaining--;
  this.handle();
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

const DiscordAPIError = __webpack_require__(38);

class RequestHandler {
  constructor(manager, handler) {
    this.manager = manager;
    this.client = this.manager.client;
    this.handle = handler.bind(this);
    this.limit = Infinity;
    this.resetTime = null;
    this.remaining = 1;
    this.timeDifference = 0;

    this.queue = [];
  }

  get limited() {
    return this.manager.globallyRateLimited || this.remaining <= 0;
  }

  set globallyLimited(limited) {
    this.manager.globallyRateLimited = limited;
  }

  push(request) {
    this.queue.push(request);
    this.handle();
  }

  execute(item) {
    return new Promise((resolve, reject) => {
      const finish = timeout => {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (timeout || this.limited) reject({ timeout, limited: this.limited });
        else resolve();
      };
      item.request.gen().end((err, res) => {
        if (res && res.headers) {
          if (res.headers['x-ratelimit-global']) this.globallyLimited = true;
          this.limit = Number(res.headers['x-ratelimit-limit']);
          this.resetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
          this.remaining = Number(res.headers['x-ratelimit-remaining']);
          this.timeDifference = Date.now() - new Date(res.headers.date).getTime();
        }
        if (err) {
          if (err.status === 429) {
            this.queue.unshift(item);
            finish(Number(res.headers['retry-after']) + this.client.options.restTimeOffset);
          } else if (err.status >= 500 && err.status < 600) {
            this.queue.unshift(item);
            finish(1e3 + this.client.options.restTimeOffset);
          } else {
            item.reject(err.status >= 400 && err.status < 500 ? new DiscordAPIError(res.request.path, res.body) : err);
            finish();
          }
        } else {
          const data = res && res.body ? res.body : {};
          item.resolve(data);
          finish();
        }
      });
    });
  }

  reset() {
    this.globallyLimited = false;
    this.remaining = 1;
  }
}

module.exports = RequestHandler;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

const querystring = __webpack_require__(27);
const snekfetch = __webpack_require__(26);
const https = __webpack_require__(71);
const { browser } = __webpack_require__(0);

if (https.Agent) var agent = new https.Agent({ keepAlive: true });

class APIRequest {
  constructor(rest, method, path, options) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.path = path.toString();
    this.route = options.route;
    this.options = options;
  }

  gen() {
    const API = this.options.versioned === false ? this.client.options.http.api :
      `${this.client.options.http.api}/v${this.client.options.http.version}`;

    if (this.options.query) {
      const queryString = (querystring.stringify(this.options.query).match(/[^=&?]+=[^=&?]+/g) || []).join('&');
      this.path += `?${queryString}`;
    }

    const request = snekfetch[this.method](`${API}${this.path}`, { agent });

    if (this.options.auth !== false) request.set('Authorization', this.rest.getAuth());
    if (this.options.reason) request.set('X-Audit-Log-Reason', encodeURIComponent(this.options.reason));
    if (!browser) request.set('User-Agent', this.rest.userAgentManager.userAgent);
    if (this.options.headers) request.set(this.options.headers);

    if (this.options.files) {
      for (const file of this.options.files) if (file && file.file) request.attach(file.name, file.file, file.name);
      if (typeof this.options.data !== 'undefined') request.attach('payload_json', JSON.stringify(this.options.data));
    } else if (typeof this.options.data !== 'undefined') {
      request.send(this.options.data);
    }
    return request;
  }
}

module.exports = APIRequest;


/***/ }),
/* 71 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 72 */
/***/ (function(module, exports) {

const noop = () => {}; // eslint-disable-line no-empty-function
const methods = ['get', 'post', 'delete', 'patch', 'put'];
const reflectors = [
  'toString', 'valueOf', 'inspect', 'constructor',
  Symbol.toPrimitive, Symbol.for('util.inspect.custom'),
];

function buildRoute(manager) {
  const route = [''];
  const handler = {
    get(target, name) {
      if (reflectors.includes(name)) return () => route.join('/');
      if (methods.includes(name)) {
        return options => manager.request(name, route.join('/'), Object.assign({
          versioned: manager.versioned,
          route: route.map((r, i) => {
            if (/\d{16,19}/g.test(r)) return /channels|guilds/.test(route[i - 1]) ? r : ':id';
            return r;
          }).join('/'),
        }, options));
      }
      route.push(name);
      return new Proxy(noop, handler);
    },
    apply(target, _, args) {
      route.push(...args.filter(x => x != null)); // eslint-disable-line eqeqeq
      return new Proxy(noop, handler);
    },
  };
  return new Proxy(noop, handler);
}

module.exports = buildRoute;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

const BaseClient = __webpack_require__(28);
const Permissions = __webpack_require__(9);
const RESTManager = __webpack_require__(37);
const ClientManager = __webpack_require__(74);
const ClientVoiceManager = __webpack_require__(75);
const WebSocketManager = __webpack_require__(76);
const ActionsManager = __webpack_require__(129);
const Collection = __webpack_require__(3);
const VoiceRegion = __webpack_require__(51);
const Webhook = __webpack_require__(16);
const Invite = __webpack_require__(23);
const ClientApplication = __webpack_require__(31);
const ShardClientUtil = __webpack_require__(158);
const VoiceBroadcast = __webpack_require__(159);
const UserStore = __webpack_require__(160);
const ChannelStore = __webpack_require__(161);
const GuildStore = __webpack_require__(162);
const ClientPresenceStore = __webpack_require__(163);
const EmojiStore = __webpack_require__(52);
const { Events, browser } = __webpack_require__(0);
const DataResolver = __webpack_require__(10);
const { Error, TypeError, RangeError } = __webpack_require__(4);

/**
 * The main hub for interacting with the Discord API, and the starting point for any bot.
 * @extends {BaseClient}
 */
class Client extends BaseClient {
  /**
   * @param {ClientOptions} [options] Options for the client
   */
  constructor(options = {}) {
    super(Object.assign({ _tokenType: 'Bot' }, options));

    // Obtain shard details from environment
    if (!browser && !this.options.shardId && 'SHARD_ID' in process.env) {
      this.options.shardId = Number(process.env.SHARD_ID);
    }
    if (!browser && !this.options.shardCount && 'SHARD_COUNT' in process.env) {
      this.options.shardCount = Number(process.env.SHARD_COUNT);
    }

    this._validateOptions();

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this);

    /**
     * The manager of the client
     * @type {ClientManager}
     * @private
     */
    this.manager = new ClientManager(this);

    /**
     * The WebSocket manager of the client
     * @type {WebSocketManager}
     * @private
     */
    this.ws = new WebSocketManager(this);

    /**
     * The action manager of the client
     * @type {ActionsManager}
     * @private
     */
    this.actions = new ActionsManager(this);

    /**
     * The voice manager of the client (`null` in browsers)
     * @type {?ClientVoiceManager}
     * @private
     */
    this.voice = !browser ? new ClientVoiceManager(this) : null;

    /**
     * The shard helpers for the client
     * (only if the process was spawned as a child, such as from a {@link ShardingManager})
     * @type {?ShardClientUtil}
     */
    this.shard = !browser && process.send ? ShardClientUtil.singleton(this) : null;

    /**
     * All of the {@link User} objects that have been cached at any point, mapped by their IDs
     * @type {UserStore<Snowflake, User>}
     */
    this.users = new UserStore(this);

    /**
     * All of the guilds the client is currently handling, mapped by their IDs -
     * as long as sharding isn't being used, this will be *every* guild the bot is a member of
     * @type {GuildStore<Snowflake, Guild>}
     */
    this.guilds = new GuildStore(this);

    /**
     * All of the {@link Channel}s that the client is currently handling, mapped by their IDs -
     * as long as sharding isn't being used, this will be *every* channel in *every* guild, and all DM channels
     * @type {ChannelStore<Snowflake, Channel>}
     */
    this.channels = new ChannelStore(this);

    /**
     * Presences that have been received for the client user's friends, mapped by user IDs
     * <warn>This is only filled when using a user account.</warn>
     * @type {ClientPresenceStore<Snowflake, Presence>}
     */
    this.presences = new ClientPresenceStore(this);

    Object.defineProperty(this, 'token', { writable: true });
    if (!browser && !this.token && 'CLIENT_TOKEN' in process.env) {
      /**
       * Authorization token for the logged in user/bot
       * <warn>This should be kept private at all times.</warn>
       * @type {?string}
       */
      this.token = process.env.CLIENT_TOKEN;
    } else {
      this.token = null;
    }

    /**
     * User that the client is logged in as
     * @type {?ClientUser}
     */
    this.user = null;

    /**
     * Time at which the client was last regarded as being in the `READY` state
     * (each time the client disconnects and successfully reconnects, this will be overwritten)
     * @type {?Date}
     */
    this.readyAt = null;

    /**
     * Active voice broadcasts that have been created
     * @type {VoiceBroadcast[]}
     */
    this.broadcasts = [];

    /**
     * Previous heartbeat pings of the websocket (most recent first, limited to three elements)
     * @type {number[]}
     */
    this.pings = [];

    /**
     * Timeouts set by {@link Client#setTimeout} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._timeouts = new Set();

    /**
     * Intervals set by {@link Client#setInterval} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._intervals = new Set();

    if (this.options.messageSweepInterval > 0) {
      this.setInterval(this.sweepMessages.bind(this), this.options.messageSweepInterval * 1000);
    }
  }

  /**
   * Timestamp of the latest ping's start time
   * @type {number}
   * @private
   */
  get _pingTimestamp() {
    return this.ws.connection ? this.ws.connection.lastPingTimestamp : 0;
  }

  /**
   * Current status of the client's connection to Discord
   * @type {?Status}
   * @readonly
   */
  get status() {
    return this.ws.connection ? this.ws.connection.status : null;
  }

  /**
   * How long it has been since the client last entered the `READY` state
   * @type {?number}
   * @readonly
   */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
  }

  /**
   * Average heartbeat ping of the websocket, obtained by averaging the {@link Client#pings} property
   * @type {number}
   * @readonly
   */
  get ping() {
    return this.pings.reduce((prev, p) => prev + p, 0) / this.pings.length;
  }

  /**
   * All active voice connections that have been established, mapped by guild ID
   * @type {Collection<Snowflake, VoiceConnection>}
   * @readonly
   */
  get voiceConnections() {
    if (browser) return new Collection();
    return this.voice.connections;
  }

  /**
   * All custom emojis that the client has access to, mapped by their IDs
   * @type {EmojiStore<Snowflake, Emoji>}
   * @readonly
   */
  get emojis() {
    const emojis = new EmojiStore({ client: this });
    for (const guild of this.guilds.values()) {
      if (guild.available) for (const emoji of guild.emojis.values()) emojis.set(emoji.id, emoji);
    }
    return emojis;
  }

  /**
   * Timestamp of the time the client was last `READY` at
   * @type {?number}
   * @readonly
   */
  get readyTimestamp() {
    return this.readyAt ? this.readyAt.getTime() : null;
  }

  /**
   * Creates a voice broadcast.
   * @returns {VoiceBroadcast}
   */
  createVoiceBroadcast() {
    const broadcast = new VoiceBroadcast(this);
    this.broadcasts.push(broadcast);
    return broadcast;
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * <info>Both bot and regular user accounts are supported, but it is highly recommended to use a bot account whenever
   * possible. User accounts are subject to harsher ratelimits and other restrictions that don't apply to bot accounts.
   * Bot accounts also have access to many features that user accounts cannot utilise. User accounts that are found to
   * be abusing/overusing the API will be banned, locking you out of Discord entirely.</info>
   * @param {string} token Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   * @example
   * client.login('my token');
   */
  login(token) {
    return new Promise((resolve, reject) => {
      if (typeof token !== 'string') throw new Error('TOKEN_INVALID');
      token = token.replace(/^Bot\s*/i, '');
      this.manager.connectToWebSocket(token, resolve, reject);
    }).catch(e => {
      this.destroy();
      return Promise.reject(e);
    });
  }

  /**
   * Logs out, terminates the connection to Discord, and destroys the client.
   * @returns {Promise}
   */
  destroy() {
    super.destroy();
    return this.manager.destroy();
  }

  /**
   * Requests a sync of guild data with Discord.
   * <info>This can be done automatically every 30 seconds by enabling {@link ClientOptions#sync}.</info>
   * <warn>This is only available when using a user account.</warn>
   * @param {Guild[]|Collection<Snowflake, Guild>} [guilds=this.guilds] An array or collection of guilds to sync
   */
  syncGuilds(guilds = this.guilds) {
    if (this.user.bot) return;
    this.ws.send({
      op: 12,
      d: guilds instanceof Collection ? guilds.keyArray() : guilds.map(g => g.id),
    });
  }

  /**
   * Obtains an invite from Discord.
   * @param {InviteResolvable} invite Invite code or URL
   * @returns {Promise<Invite>}
   */
  fetchInvite(invite) {
    const code = DataResolver.resolveInviteCode(invite);
    return this.api.invites(code).get({ query: { with_counts: true } })
      .then(data => new Invite(this, data));
  }

  /**
   * Obtains a webhook from Discord.
   * @param {Snowflake} id ID of the webhook
   * @param {string} [token] Token for the webhook
   * @returns {Promise<Webhook>}
   */
  fetchWebhook(id, token) {
    return this.api.webhooks(id, token).get().then(data => new Webhook(this, data));
  }

  /**
   * Obtains the available voice regions from Discord.
   * @returns {Collection<string, VoiceRegion>}
   */
  fetchVoiceRegions() {
    return this.api.voice.regions.get().then(res => {
      const regions = new Collection();
      for (const region of res) regions.set(region.id, new VoiceRegion(region));
      return regions;
    });
  }

  /**
   * Sweeps all text-based channels' messages and removes the ones older than the max message lifetime.
   * If the message has been edited, the time of the edit is used rather than the time of the original message.
   * @param {number} [lifetime=this.options.messageCacheLifetime] Messages that are older than this (in seconds)
   * will be removed from the caches. The default is based on {@link ClientOptions#messageCacheLifetime}
   * @returns {number} Amount of messages that were removed from the caches,
   * or -1 if the message cache lifetime is unlimited
   */
  sweepMessages(lifetime = this.options.messageCacheLifetime) {
    if (typeof lifetime !== 'number' || isNaN(lifetime)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'Lifetime', 'a number');
    }
    if (lifetime <= 0) {
      this.emit(Events.DEBUG, 'Didn\'t sweep messages - lifetime is unlimited');
      return -1;
    }

    const lifetimeMs = lifetime * 1000;
    const now = Date.now();
    let channels = 0;
    let messages = 0;

    for (const channel of this.channels.values()) {
      if (!channel.messages) continue;
      channels++;

      for (const message of channel.messages.values()) {
        if (now - (message.editedTimestamp || message.createdTimestamp) > lifetimeMs) {
          channel.messages.delete(message.id);
          messages++;
        }
      }
    }

    this.emit(Events.DEBUG,
      `Swept ${messages} messages older than ${lifetime} seconds in ${channels} text-based channels`);
    return messages;
  }

  /**
   * Obtains the OAuth Application of the bot from Discord.
   * @param {Snowflake} [id='@me'] ID of application to fetch
   * @returns {Promise<ClientApplication>}
   */
  fetchApplication(id = '@me') {
    return this.api.oauth2.applications(id).get()
      .then(app => new ClientApplication(this, app));
  }

  /**
   * Generates a link that can be used to invite the bot to a guild.
   * <warn>This is only available when using a bot account.</warn>
   * @param {PermissionResolvable[]|number} [permissions] Permissions to request
   * @returns {Promise<string>}
   * @example
   * client.generateInvite(['SEND_MESSAGES', 'MANAGE_GUILD', 'MENTION_EVERYONE'])
   *   .then(link => {
   *     console.log(`Generated bot invite link: ${link}`);
   *   });
   */
  generateInvite(permissions) {
    if (permissions) {
      if (permissions instanceof Array) permissions = Permissions.resolve(permissions);
    } else {
      permissions = 0;
    }
    return this.fetchApplication().then(application =>
      `https://discordapp.com/oauth2/authorize?client_id=${application.id}&permissions=${permissions}&scope=bot`
    );
  }

  /**
   * Adds a ping to {@link Client#pings}.
   * @param {number} startTime Starting time of the ping
   * @private
   */
  _pong(startTime) {
    this.pings.unshift(Date.now() - startTime);
    if (this.pings.length > 3) this.pings.length = 3;
    this.ws.lastHeartbeatAck = true;
  }

  /**
   * Calls {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval} on a script
   * with the client as `this`.
   * @param {string} script Script to eval
   * @returns {*}
   * @private
   */
  _eval(script) {
    return eval(script);
  }

  /**
   * Validates the client options.
   * @param {ClientOptions} [options=this.options] Options to validate
   * @private
   */
  _validateOptions(options = this.options) {
    if (typeof options.shardCount !== 'number' || isNaN(options.shardCount)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'shardCount', 'a number');
    }
    if (typeof options.shardId !== 'number' || isNaN(options.shardId)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'shardId', 'a number');
    }
    if (options.shardCount < 0) throw new RangeError('CLIENT_INVALID_OPTION', 'shardCount', 'at least 0');
    if (options.shardId < 0) throw new RangeError('CLIENT_INVALID_OPTION', 'shardId', 'at least 0');
    if (options.shardId !== 0 && options.shardId >= options.shardCount) {
      throw new RangeError('CLIENT_INVALID_OPTION', 'shardId', 'less than shardCount');
    }
    if (typeof options.messageCacheMaxSize !== 'number' || isNaN(options.messageCacheMaxSize)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'messageCacheMaxSize', 'a number');
    }
    if (typeof options.messageCacheLifetime !== 'number' || isNaN(options.messageCacheLifetime)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'The messageCacheLifetime', 'a number');
    }
    if (typeof options.messageSweepInterval !== 'number' || isNaN(options.messageSweepInterval)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'messageSweepInterval', 'a number');
    }
    if (typeof options.fetchAllMembers !== 'boolean') {
      throw new TypeError('CLIENT_INVALID_OPTION', 'fetchAllMembers', 'a boolean');
    }
    if (typeof options.disableEveryone !== 'boolean') {
      throw new TypeError('CLIENT_INVALID_OPTION', 'disableEveryone', 'a boolean');
    }
    if (typeof options.restWsBridgeTimeout !== 'number' || isNaN(options.restWsBridgeTimeout)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'restWsBridgeTimeout', 'a number');
    }
    if (typeof options.internalSharding !== 'boolean') {
      throw new TypeError('CLIENT_INVALID_OPTION', 'internalSharding', 'a boolean');
    }
    if (!(options.disabledEvents instanceof Array)) {
      throw new TypeError('CLIENT_INVALID_OPTION', 'disabledEvents', 'an Array');
    }
  }
}

module.exports = Client;

/**
 * Emitted for general warnings.
 * @event Client#warn
 * @param {string} info The warning
 */

/**
 * Emitted for general debugging information.
 * @event Client#debug
 * @param {string} info The debug information
 */


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

const { Events, Status } = __webpack_require__(0);
const { Error } = __webpack_require__(4);

/**
 * Manages the state and background tasks of the client.
 * @private
 */
class ClientManager {
  constructor(client) {
    /**
     * The client that instantiated this Manager
     * @type {Client}
     */
    this.client = client;

    /**
     * The heartbeat interval
     * @type {?number}
     */
    this.heartbeatInterval = null;
  }

  /**
   * The status of the client
   * @type {number}
   */
  get status() {
    return this.connection ? this.connection.status : Status.IDLE;
  }

  /**
   * Connects the client to the WebSocket.
   * @param {string} token The authorization token
   * @param {Function} resolve Function to run when connection is successful
   * @param {Function} reject Function to run when connection fails
   */
  connectToWebSocket(token, resolve, reject) {
    this.client.emit(Events.DEBUG, `Authenticated using token ${token}`);
    this.client.token = token;
    const timeout = this.client.setTimeout(() => reject(new Error('WS_CONNECTION_TIMEOUT')), 1000 * 300);
    this.client.api.gateway.get().then(res => {
      const gateway = `${res.url}/`;
      this.client.emit(Events.DEBUG, `Using gateway ${gateway}`);
      this.client.ws.connect(gateway);
      this.client.ws.connection.once('error', reject);
      this.client.ws.connection.once('close', event => {
        if (event.code === 4004) reject(new Error('TOKEN_INVALID'));
        if (event.code === 4010) reject(new Error('SHARDING_INVALID'));
        if (event.code === 4011) reject(new Error('SHARDING_REQUIRED'));
      });
      this.client.once(Events.READY, () => {
        resolve(token);
        this.client.clearTimeout(timeout);
      });
    }, reject);
  }

  destroy() {
    this.client.ws.destroy();
    this.client.rest.destroy();
    if (!this.client.user) return Promise.resolve();
    if (this.client.user.bot) {
      this.client.token = null;
      return Promise.resolve();
    } else {
      return this.client.api.logout.post().then(() => {
        this.client.token = null;
      });
    }
  }
}

module.exports = ClientManager;


/***/ }),
/* 75 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(19);
const { Events, Status } = __webpack_require__(0);
const WebSocketConnection = __webpack_require__(77);

/**
 * WebSocket Manager of the client.
 * @private
 */
class WebSocketManager extends EventEmitter {
  constructor(client) {
    super();
    /**
     * The client that instantiated this WebSocketManager
     * @type {Client}
     */
    this.client = client;

    /**
     * The WebSocket connection of this manager
     * @type {?WebSocketConnection}
     */
    this.connection = null;
  }

  /**
   * Sends a heartbeat on the available connection.
   * @returns {void}
   */
  heartbeat() {
    if (!this.connection) return this.debug('No connection to heartbeat');
    return this.connection.heartbeat();
  }

  /**
   * Emits a debug event.
   * @param {string} message Debug message
   * @returns {void}
   */
  debug(message) {
    return this.client.emit(Events.DEBUG, `[ws] ${message}`);
  }

  /**
   * Destroy the client.
   * @returns {void} Whether or not destruction was successful
   */
  destroy() {
    if (!this.connection) {
      this.debug('Attempted to destroy WebSocket but no connection exists!');
      return false;
    }
    return this.connection.destroy();
  }

  /**
   * Send a packet on the available WebSocket.
   * @param {Object} packet Packet to send
   * @returns {void}
   */
  send(packet) {
    if (!this.connection) {
      this.debug('No connection to websocket');
      return;
    }
    this.connection.send(packet);
  }

  /**
   * Connects the client to a gateway.
   * @param {string} gateway The gateway to connect to
   * @returns {boolean}
   */
  connect(gateway) {
    if (!this.connection) {
      this.connection = new WebSocketConnection(this, gateway);
      return true;
    }
    switch (this.connection.status) {
      case Status.IDLE:
      case Status.DISCONNECTED:
        this.connection.connect(gateway, 5500);
        return true;
      default:
        this.debug(`Couldn't connect to ${gateway} as the websocket is at state ${this.connection.status}`);
        return false;
    }
  }
}

module.exports = WebSocketManager;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(19);
const { DefaultOptions, Events, OPCodes, Status, WSCodes } = __webpack_require__(0);
const PacketManager = __webpack_require__(78);
const WebSocket = __webpack_require__(56);

/**
 * Abstracts a WebSocket connection with decoding/encoding for the Discord gateway.
 * @private
 */
class WebSocketConnection extends EventEmitter {
  /**
   * @param {WebSocketManager} manager The WebSocket manager
   * @param {string} gateway The WebSocket gateway to connect to
   */
  constructor(manager, gateway) {
    super();
    /**
     * The WebSocket Manager of this connection
     * @type {WebSocketManager}
     */
    this.manager = manager;

    /**
     * The client this belongs to
     * @type {Client}
     */
    this.client = manager.client;

    /**
     * The WebSocket connection itself
     * @type {WebSocket}
     */
    this.ws = null;

    /**
     * The current sequence of the WebSocket
     * @type {number}
     */
    this.sequence = -1;

    /**
     * The current status of the client
     * @type {number}
     */
    this.status = Status.IDLE;

    /**
     * The Packet Manager of the connection
     * @type {WebSocketPacketManager}
     */
    this.packetManager = new PacketManager(this);

    /**
     * The last time a ping was sent (a timestamp)
     * @type {number}
     */
    this.lastPingTimestamp = 0;

    /**
     * Contains the rate limit queue and metadata
     * @type {Object}
     */
    this.ratelimit = {
      queue: [],
      remaining: 60,
      total: 60,
      resetTimer: null,
    };
    this.connect(gateway);

    /**
     * Events that are disabled (will not be processed)
     * @type {Object}
     */
    this.disabledEvents = {};

    /**
     * The sequence on WebSocket close
     * @type {number}
     */
    this.closeSequence = 0;

    /**
     * Whether or not the WebSocket is expecting to be closed
     * @type {boolean}
     */
    this.expectingClose = false;
    for (const event of this.client.options.disabledEvents) this.disabledEvents[event] = true;
  }

  /**
   * Causes the client to be marked as ready and emits the ready event.
   * @returns {void}
   */
  triggerReady() {
    if (this.status === Status.READY) {
      this.debug('Tried to mark self as ready, but already ready');
      return;
    }
    /**
     * Emitted when the client becomes ready to start working.
     * @event Client#ready
     */
    this.status = Status.READY;
    this.client.emit(Events.READY);
    this.packetManager.handleQueue();
  }

  /**
   * Checks whether the client is ready to be marked as ready.
   * @returns {void}
   */
  checkIfReady() {
    if (this.status === Status.READY || this.status === Status.NEARLY) return false;
    let unavailableGuilds = 0;
    for (const guild of this.client.guilds.values()) {
      if (!guild.available) unavailableGuilds++;
    }
    if (unavailableGuilds === 0) {
      this.status = Status.NEARLY;
      if (!this.client.options.fetchAllMembers) return this.triggerReady();
      // Fetch all members before marking self as ready
      const promises = this.client.guilds.map(g => g.members.fetch());
      Promise.all(promises)
        .then(() => this.triggerReady())
        .catch(e => {
          this.debug(`Failed to fetch all members before ready! ${e}`);
          this.triggerReady();
        });
    }
    return true;
  }

  // Util
  /**
   * Emits a debug message.
   * @param {string} message Debug message
   * @returns {void}
   */
  debug(message) {
    if (message instanceof Error) message = message.stack;
    return this.manager.debug(`[connection] ${message}`);
  }

  /**
   * Processes the current WebSocket queue.
   */
  processQueue() {
    if (this.ratelimit.remaining === 0) return;
    if (this.ratelimit.queue.length === 0) return;
    if (this.ratelimit.remaining === this.ratelimit.total) {
      this.ratelimit.resetTimer = this.client.setTimeout(() => {
        this.ratelimit.remaining = this.ratelimit.total;
        this.processQueue();
      }, 120e3);
    }
    while (this.ratelimit.remaining > 0) {
      const item = this.ratelimit.queue.shift();
      if (!item) return;
      this._send(item);
      this.ratelimit.remaining--;
    }
  }

  /**
   * Sends data, bypassing the queue.
   * @param {Object} data Packet to send
   * @returns {void}
   */
  _send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.debug(`Tried to send packet ${data} but no WebSocket is available!`);
      return;
    }
    this.ws.send(WebSocket.pack(data));
  }

  /**
   * Adds data to the queue to be sent.
   * @param {Object} data Packet to send
   * @returns {void}
   */
  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.debug(`Tried to send packet ${data} but no WebSocket is available!`);
      return;
    }
    this.ratelimit.queue.push(data);
    this.processQueue();
  }

  /**
   * Creates a connection to a gateway.
   * @param {string} gateway The gateway to connect to
   * @param {number} [after=0] How long to wait before connecting
   * @param {boolean} [force=false] Whether or not to force a new connection even if one already exists
   * @returns {boolean}
   */
  connect(gateway = this.gateway, after = 0, force = false) {
    if (after) return this.client.setTimeout(() => this.connect(gateway, 0, force), after); // eslint-disable-line
    if (this.ws && !force) {
      this.debug('WebSocket connection already exists');
      return false;
    } else if (typeof gateway !== 'string') {
      this.debug(`Tried to connect to an invalid gateway: ${gateway}`);
      return false;
    }
    this.expectingClose = false;
    this.gateway = gateway;
    this.debug(`Connecting to ${gateway}`);
    const ws = this.ws = WebSocket.create(gateway, { v: DefaultOptions.ws.version });
    ws.onmessage = this.onMessage.bind(this);
    ws.onopen = this.onOpen.bind(this);
    ws.onerror = this.onError.bind(this);
    ws.onclose = this.onClose.bind(this);
    this.status = Status.CONNECTING;
    return true;
  }

  /**
   * Destroys the connection.
   * @returns {boolean}
   */
  destroy() {
    const ws = this.ws;
    if (!ws) {
      this.debug('Attempted to destroy WebSocket but no connection exists!');
      return false;
    }
    this.heartbeat(-1);
    this.expectingClose = true;
    ws.close(1000);
    this.packetManager.handleQueue();
    this.ws = null;
    this.status = Status.DISCONNECTED;
    this.ratelimit.remaining = this.ratelimit.total;
    return true;
  }

  /**
   * Called whenever a message is received.
   * @param {Event} event Event received
   * @returns {boolean}
   */
  onMessage(event) {
    let data;
    try {
      data = WebSocket.unpack(event.data);
    } catch (err) {
      this.client.emit('debug', err);
    }
    const ret = this.onPacket(data);
    this.client.emit('raw', data);
    return ret;
  }

  /**
   * Sets the current sequence of the connection.
   * @param {number} s New sequence
   */
  setSequence(s) {
    this.sequence = s > this.sequence ? s : this.sequence;
  }

  /**
   * Called whenever a packet is received.
   * @param {Object} packet Received packet
   * @returns {boolean}
   */
  onPacket(packet) {
    if (!packet) {
      this.debug('Received null packet');
      return false;
    }
    switch (packet.op) {
      case OPCodes.HELLO:
        return this.heartbeat(packet.d.heartbeat_interval);
      case OPCodes.RECONNECT:
        return this.reconnect();
      case OPCodes.INVALID_SESSION:
        if (!packet.d) this.sessionID = null;
        this.sequence = -1;
        this.debug('Session invalidated -- will identify with a new session');
        return this.identify(packet.d ? 2500 : 0);
      case OPCodes.HEARTBEAT_ACK:
        return this.ackHeartbeat();
      case OPCodes.HEARTBEAT:
        return this.heartbeat();
      default:
        return this.packetManager.handle(packet);
    }
  }

  /**
   * Called whenever a connection is opened to the gateway.
   * @param {Event} event Received open event
   */
  onOpen(event) {
    if (event && event.target && event.target.url) this.gateway = event.target.url;
    this.debug(`Connected to gateway ${this.gateway}`);
    this.identify();
  }

  /**
   * Causes a reconnection to the gateway.
   */
  reconnect() {
    this.debug('Attemping to reconnect in 5500ms...');
    /**
     * Emitted whenever the client tries to reconnect to the WebSocket.
     * @event Client#reconnecting
     */
    this.client.emit(Events.RECONNECTING);
    this.connect(this.gateway, 5500, true);
  }

  /**
   * Called whenever an error occurs with the WebSocket.
   * @param {Error} error The error that occurred
   */
  onError(error) {
    if (error && error.message === 'uWs client connection error') {
      this.reconnect();
      return;
    }
    /**
     * Emitted whenever the client's WebSocket encounters a connection error.
     * @event Client#error
     * @param {Error} error The encountered error
     */
    this.client.emit(Events.ERROR, error);
  }

  /**
   * @external CloseEvent
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent}
   */

  /**
   * Called whenever a connection to the gateway is closed.
   * @param {CloseEvent} event Close event that was received
   */
  onClose(event) {
    this.debug(`${this.expectingClose ? 'Client' : 'Server'} closed the WebSocket connection: ${event.code}`);
    this.closeSequence = this.sequence;
    // Reset the state before trying to fix anything
    this.emit('close', event);
    this.heartbeat(-1);
    // Should we reconnect?
    if (event.code === 1000 ? this.expectingClose : WSCodes[event.code]) {
      this.expectingClose = false;
      /**
       * Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
       * @event Client#disconnect
       * @param {CloseEvent} event The WebSocket close event
       */
      this.client.emit(Events.DISCONNECT, event);
      this.debug(WSCodes[event.code]);
      this.destroy();
      return;
    }
    this.expectingClose = false;
    this.reconnect();
  }

  // Heartbeat
  /**
   * Acknowledges a heartbeat.
   */
  ackHeartbeat() {
    this.debug(`Heartbeat acknowledged, latency of ${Date.now() - this.lastPingTimestamp}ms`);
    this.client._pong(this.lastPingTimestamp);
  }

  /**
   * Sends a heartbeat or sets an interval for sending heartbeats.
   * @param {number} [time] If -1, clears the interval, any other number sets an interval
   * If no value is given, a heartbeat will be sent instantly
   */
  heartbeat(time) {
    if (!isNaN(time)) {
      if (time === -1) {
        this.debug('Clearing heartbeat interval');
        this.client.clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      } else {
        this.debug(`Setting a heartbeat interval for ${time}ms`);
        this.heartbeatInterval = this.client.setInterval(() => this.heartbeat(), time);
      }
      return;
    }
    this.debug('Sending a heartbeat');
    this.lastPingTimestamp = Date.now();
    this.send({
      op: OPCodes.HEARTBEAT,
      d: this.sequence,
    });
  }

  // Identification
  /**
   * Identifies the client on a connection.
   * @param {number} [after] How long to wait before identifying
   * @returns {void}
   */
  identify(after) {
    if (after) return this.client.setTimeout(this.identify.bind(this), after);
    return this.sessionID ? this.identifyResume() : this.identifyNew();
  }

  /**
   * Identifies as a new connection on the gateway.
   * @returns {void}
   */
  identifyNew() {
    if (!this.client.token) {
      this.debug('No token available to identify a new session with');
      return;
    }
    // Clone the generic payload and assign the token
    const d = Object.assign({ token: this.client.token }, this.client.options.ws);

    // Sharding stuff
    const { shardId, shardCount } = this.client.options;
    if (shardCount > 0) d.shard = [Number(shardId), Number(shardCount)];

    // Send the payload
    this.debug('Identifying as a new session');
    this.send({ op: OPCodes.IDENTIFY, d });
  }

  /**
   * Resumes a session on the gateway.
   * @returns {void}
   */
  identifyResume() {
    if (!this.sessionID) {
      this.debug('Warning: wanted to resume but session ID not available; identifying as a new session instead');
      return this.identifyNew();
    }
    this.debug(`Attempting to resume session ${this.sessionID}`);

    const d = {
      token: this.client.token,
      session_id: this.sessionID,
      seq: this.sequence,
    };

    return this.send({
      op: OPCodes.RESUME,
      d,
    });
  }
}

module.exports = WebSocketConnection;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

const { OPCodes, Status, WSEvents } = __webpack_require__(0);

const BeforeReadyWhitelist = [
  WSEvents.READY,
  WSEvents.RESUMED,
  WSEvents.GUILD_CREATE,
  WSEvents.GUILD_DELETE,
  WSEvents.GUILD_MEMBERS_CHUNK,
  WSEvents.GUILD_MEMBER_ADD,
  WSEvents.GUILD_MEMBER_REMOVE,
];

class WebSocketPacketManager {
  constructor(connection) {
    this.ws = connection;
    this.handlers = {};
    this.queue = [];

    this.register(WSEvents.READY, __webpack_require__(79));
    this.register(WSEvents.RESUMED, __webpack_require__(90));
    this.register(WSEvents.GUILD_CREATE, __webpack_require__(91));
    this.register(WSEvents.GUILD_DELETE, __webpack_require__(92));
    this.register(WSEvents.GUILD_UPDATE, __webpack_require__(93));
    this.register(WSEvents.GUILD_BAN_ADD, __webpack_require__(94));
    this.register(WSEvents.GUILD_BAN_REMOVE, __webpack_require__(95));
    this.register(WSEvents.GUILD_MEMBER_ADD, __webpack_require__(96));
    this.register(WSEvents.GUILD_MEMBER_REMOVE, __webpack_require__(97));
    this.register(WSEvents.GUILD_MEMBER_UPDATE, __webpack_require__(98));
    this.register(WSEvents.GUILD_ROLE_CREATE, __webpack_require__(99));
    this.register(WSEvents.GUILD_ROLE_DELETE, __webpack_require__(100));
    this.register(WSEvents.GUILD_ROLE_UPDATE, __webpack_require__(101));
    this.register(WSEvents.GUILD_EMOJIS_UPDATE, __webpack_require__(102));
    this.register(WSEvents.GUILD_MEMBERS_CHUNK, __webpack_require__(103));
    this.register(WSEvents.CHANNEL_CREATE, __webpack_require__(104));
    this.register(WSEvents.CHANNEL_DELETE, __webpack_require__(105));
    this.register(WSEvents.CHANNEL_UPDATE, __webpack_require__(106));
    this.register(WSEvents.CHANNEL_PINS_UPDATE, __webpack_require__(107));
    this.register(WSEvents.PRESENCE_UPDATE, __webpack_require__(108));
    this.register(WSEvents.USER_UPDATE, __webpack_require__(109));
    this.register(WSEvents.USER_NOTE_UPDATE, __webpack_require__(110));
    this.register(WSEvents.USER_SETTINGS_UPDATE, __webpack_require__(111));
    this.register(WSEvents.USER_GUILD_SETTINGS_UPDATE, __webpack_require__(112));
    this.register(WSEvents.VOICE_STATE_UPDATE, __webpack_require__(113));
    this.register(WSEvents.TYPING_START, __webpack_require__(114));
    this.register(WSEvents.MESSAGE_CREATE, __webpack_require__(115));
    this.register(WSEvents.MESSAGE_DELETE, __webpack_require__(116));
    this.register(WSEvents.MESSAGE_UPDATE, __webpack_require__(117));
    this.register(WSEvents.MESSAGE_DELETE_BULK, __webpack_require__(118));
    this.register(WSEvents.VOICE_SERVER_UPDATE, __webpack_require__(119));
    this.register(WSEvents.GUILD_SYNC, __webpack_require__(120));
    this.register(WSEvents.RELATIONSHIP_ADD, __webpack_require__(121));
    this.register(WSEvents.RELATIONSHIP_REMOVE, __webpack_require__(122));
    this.register(WSEvents.MESSAGE_REACTION_ADD, __webpack_require__(123));
    this.register(WSEvents.MESSAGE_REACTION_REMOVE, __webpack_require__(124));
    this.register(WSEvents.MESSAGE_REACTION_REMOVE_ALL, __webpack_require__(125));
  }

  get client() {
    return this.ws.client;
  }

  register(event, Handler) {
    this.handlers[event] = new Handler(this);
  }

  handleQueue() {
    this.queue.forEach((element, index) => {
      this.handle(this.queue[index], true);
      this.queue.splice(index, 1);
    });
  }

  handle(packet, queue = false) {
    if (packet.op === OPCodes.HEARTBEAT_ACK) {
      this.ws.client._pong(this.ws.client._pingTimestamp);
      this.ws.lastHeartbeatAck = true;
      this.ws.client.emit('debug', 'Heartbeat acknowledged');
    } else if (packet.op === OPCodes.HEARTBEAT) {
      this.client.ws.send({
        op: OPCodes.HEARTBEAT,
        d: this.client.ws.sequence,
      });
      this.ws.client.emit('debug', 'Received gateway heartbeat');
    }

    if (this.ws.status === Status.RECONNECTING) {
      this.ws.reconnecting = false;
      this.ws.checkIfReady();
    }

    this.ws.setSequence(packet.s);

    if (this.ws.disabledEvents[packet.t] !== undefined) return false;

    if (this.ws.status !== Status.READY) {
      if (BeforeReadyWhitelist.indexOf(packet.t) === -1) {
        this.queue.push(packet);
        return false;
      }
    }

    if (!queue && this.queue.length > 0) this.handleQueue();
    if (this.handlers[packet.t]) return this.handlers[packet.t].handle(packet);
    return false;
  }
}

module.exports = WebSocketPacketManager;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);
const ClientUser = __webpack_require__(39);

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.ws.heartbeat();

    data.user.user_settings = data.user_settings;
    data.user.user_guild_settings = data.user_guild_settings;

    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) client.guilds.create(guild);
    for (const privateDM of data.private_channels) client.channels.create(privateDM);

    for (const relation of data.relationships) {
      const user = client.users.create(relation.user);
      if (relation.type === 1) {
        client.user.friends.set(user.id, user);
      } else if (relation.type === 2) {
        client.user.blocked.set(user.id, user);
      }
    }

    for (const presence of data.presences || []) client.presences.create(presence);

    if (data.notes) {
      for (const user in data.notes) {
        let note = data.notes[user];
        if (!note.length) note = null;

        client.user.notes.set(user, note);
      }
    }

    if (!client.users.has('1')) {
      client.users.create({
        id: '1',
        username: 'Clyde',
        discriminator: '0000',
        avatar: 'https://discordapp.com/assets/f78426a064bc9dd24847519259bc42af.png',
        bot: true,
        status: 'online',
        activity: null,
        verified: true,
      });
    }

    const t = client.setTimeout(() => {
      client.ws.connection.triggerReady();
    }, 1200 * data.guilds.length);

    client.setMaxListeners(data.guilds.length + 10);

    client.once('ready', () => {
      client.syncGuilds();
      client.setMaxListeners(10);
      client.clearTimeout(t);
    });

    const ws = this.packetManager.ws;

    ws.sessionID = data.session_id;
    ws._trace = data._trace;
    client.emit(Events.DEBUG, `READY ${ws._trace.join(' -> ')} ${ws.sessionID}`);
    ws.checkIfReady();
  }
}

module.exports = ReadyHandler;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

const long = __webpack_require__(25);
const { TypeError } = __webpack_require__(4);

/**
 * @typedef {Object} MessageSearchOptions
 * @property {string} [content] Message content
 * @property {Snowflake} [maxID] Maximum ID for the filter
 * @property {Snowflake} [minID] Minimum ID for the filter
 * @property {string} [has] One of `link`, `embed`, `file`, `video`, `image`, or `sound`,
 * or add `-` to negate (e.g. `-file`)
 * @property {ChannelResolvable} [channel] Channel to limit search to (only for guild search endpoint)
 * @property {UserResolvable} [author] Author to limit search
 * @property {string} [authorType] One of `user`, `bot`, `webhook`, or add `-` to negate (e.g. `-webhook`)
 * @property {string} [sortBy='recent'] `recent` or `relevant`
 * @property {string} [sortOrder='descending'] `ascending` or `descending`
 * @property {number} [contextSize=2] How many messages to get around the matched message (0 to 2)
 * @property {number} [limit=25] Maximum number of results to get (1 to 25)
 * @property {number} [offset=0] Offset the "pages" of results (since you can only see 25 at a time)
 * @property {UserResolvable} [mentions] Mentioned user filter
 * @property {boolean} [mentionsEveryone] If everyone is mentioned
 * @property {string} [linkHostname] Filter links by hostname
 * @property {string} [embedProvider] The name of an embed provider
 * @property {string} [embedType] one of `image`, `video`, `url`, `rich`, or add `-` to negate (e.g. `-image`)
 * @property {string} [attachmentFilename] The name of an attachment
 * @property {string} [attachmentExtension] The extension of an attachment
 * @property {Date} [before] Date to find messages before
 * @property {Date} [after] Date to find messages before
 * @property {Date} [during] Date to find messages during (range of date to date + 24 hours)
 * @property {boolean} [nsfw=false] Include results from NSFW channels
 */

/**
 * @typedef {Object} MessageSearchResult
 * @property {number} total Total result count
 * @property {Array<Message[]>} results Array of message results
 * The message which has triggered the result will have the `hit` property set to `true`
 */

module.exports = function search(target, options) {
  if (typeof options === 'string') options = { content: options };
  if (options.before) {
    if (!(options.before instanceof Date)) options.before = new Date(options.before);
    options.maxID = long.fromNumber(options.before.getTime() - 14200704e5).shiftLeft(22).toString();
  }
  if (options.after) {
    if (!(options.after instanceof Date)) options.after = new Date(options.after);
    options.minID = long.fromNumber(options.after.getTime() - 14200704e5).shiftLeft(22).toString();
  }
  if (options.during) {
    if (!(options.during instanceof Date)) options.during = new Date(options.during);
    const t = options.during.getTime() - 14200704e5;
    options.minID = long.fromNumber(t).shiftLeft(22).toString();
    options.maxID = long.fromNumber(t + 864e5).shiftLeft(22).toString();
  }
  if (options.channel) options.channel = target.client.channels.resolveID(options.channel);
  if (options.author) options.author = target.client.users.resolveID(options.author);
  if (options.mentions) options.mentions = target.client.users.resolveID(options.options.mentions);
  if (options.sortOrder) {
    options.sortOrder = { ascending: 'asc', descending: 'desc' }[options.sortOrder] || options.sortOrder;
  }
  options = {
    content: options.content,
    max_id: options.maxID,
    min_id: options.minID,
    has: options.has,
    channel_id: options.channel,
    author_id: options.author,
    author_type: options.authorType,
    context_size: options.contextSize,
    sort_by: options.sortBy,
    sort_order: options.sortOrder,
    limit: options.limit,
    offset: options.offset,
    mentions: options.mentions,
    mentions_everyone: options.mentionsEveryone,
    link_hostname: options.linkHostname,
    embed_provider: options.embedProvider,
    embed_type: options.embedType,
    attachment_filename: options.attachmentFilename,
    attachment_extension: options.attachmentExtension,
    include_nsfw: options.nsfw,
  };

  // Lazy load these because some of them use util
  const Channel = __webpack_require__(11);
  const Guild = __webpack_require__(24);

  if (!(target instanceof Channel || target instanceof Guild)) throw new TypeError('SEARCH_CHANNEL_TYPE');

  let endpoint = target.client.api[target instanceof Channel ? 'channels' : 'guilds'](target.id).messages().search;
  return endpoint.get({ query: options }).then(body => {
    const results = body.messages.map(x =>
      x.map(m => target.client.channels.get(m.channel_id).messages.create(m, false))
    );
    return {
      total: body.total_results,
      results,
    };
  });
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const MessageReaction = __webpack_require__(45);

/**
 * Stores reactions.
 * @private
 * @extends {DataStore}
 */
class ReactionStore extends DataStore {
  constructor(message, iterable) {
    super(message.client, iterable, MessageReaction);
    this.message = message;
  }

  create(data, cache) {
    return super.create(data, cache, { id: data.emoji.id || data.emoji.name, extras: [this.message] });
  }

  /**
   * Data that can be resolved to a MessageReaction object. This can be:
   * * A MessageReaction
   * * A Snowflake
   * @typedef {MessageReaction|Snowflake} MessageReactionResolvable
   */

  /**
    * Resolves a MessageReactionResolvable to a MessageReaction object.
    * @method resolve
    * @memberof ReactionStore
    * @instance
    * @param {MessageReactionResolvable} reaction The MessageReaction to resolve
    * @returns {?MessageReaction}
    */

  /**
    * Resolves a MessageReactionResolvable to a MessageReaction ID string.
    * @method resolveID
    * @memberof ReactionStore
    * @instance
    * @param {MessageReactionResolvable} role The role resolvable to resolve
    * @returns {?string}
    */
}

module.exports = ReactionStore;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

const GuildChannel = __webpack_require__(15);

/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  /**
   * The channels that are part of this category
   * @type {?Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get children() {
    return this.guild.channels.filter(c => c.parentID === this.id);
  }
}

module.exports = CategoryChannel;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const GuildMember = __webpack_require__(12);
const { Events, OPCodes } = __webpack_require__(0);
const Collection = __webpack_require__(3);
const { Error } = __webpack_require__(4);

/**
 * Stores guild members.
 * @extends {DataStore}
 */
class GuildMemberStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildMember);
    this.guild = guild;
  }

  create(data, cache) {
    return super.create(data, cache, { extras: [this.guild] });
  }

  /**
   * Data that resolves to give a GuildMember object. This can be:
   * * A GuildMember object
   * * A User resolvable
   * @typedef {GuildMember|UserResolvable} GuildMemberResolvable
   */

  /**
   * Resolves a GuildMemberResolvable to a GuildMember object.
   * @param {GuildMemberResolvable} member The user that is part of the guild
   * @returns {?GuildMember}
   */
  resolve(member) {
    const memberResolveable = super.resolve(member);
    if (memberResolveable) return memberResolveable;
    const userResolveable = this.client.users.resolveID(member);
    if (userResolveable) return super.resolve(userResolveable);
    return null;
  }

  /**
   * Resolves a GuildMemberResolvable to an member ID string.
   * @param {GuildMemberResolvable} member The user that is part of the guild
   * @returns {?string}
   */
  resolveID(member) {
    const memberResolveable = super.resolveID(member);
    if (memberResolveable) return memberResolveable;
    const userResolveable = this.client.users.resolveID(member);
    return this.has(userResolveable) ? userResolveable : null;
  }

  /**
   * Options used to fetch a single member from a guild.
   * @typedef {Object} FetchMemberOptions
   * @property {UserResolvable} user The user to fetch
   * @property {boolean} [cache=true] Whether or not to cache the fetched member
   */

  /**
   * Options used to fetch multiple members from a guild.
   * @typedef {Object} FetchMembersOptions
   * @property {string} [query=''] Limit fetch to members with similar usernames
   * @property {number} [limit=0] Maximum number of members to request
   */

  /**
   * Fetch member(s) from Discord, even if they're offline.
   * @param {UserResolvable|FetchMemberOptions|FetchMembersOptions} [options] If a UserResolvable, the user to fetch.
   * If undefined, fetches all members.
   * If a query, it limits the results to users with similar usernames.
   * @returns {Promise<GuildMember>|Promise<Collection<Snowflake, GuildMember>>}
   * @example
   * // Fetch all members from a guild
   * guild.members.fetch();
   * @example
   * // Fetch a single member
   * guild.members.fetch('66564597481480192');
   * guild.members.fetch(user);
   * guild.members.fetch({ user, cache: false }); // Fetch and don't cache
   * @example
   * // Fetch by query
   * guild.members.fetch({
   *   query: 'hydra',
   * });
   * guild.members.fetch({
   *   query: 'hydra',
   *   limit: 10,
   * });
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const user = this.client.users.resolveID(options);
    if (user) return this._fetchSingle({ user, cache: true });
    if (options.user) {
      options.user = this.client.users.resolveID(options.user);
      if (options.user) return this._fetchSingle(options);
    }
    return this._fetchMany(options);
  }

  _fetchSingle({ user, cache }) {
    const existing = this.get(user);
    if (existing) return Promise.resolve(existing);
    return this.client.api.guilds(this.guild.id).members(user).get()
      .then(data => this.create(data, cache));
  }

  _fetchMany({ query = '', limit = 0 } = {}) {
    return new Promise((resolve, reject) => {
      if (this.guild.memberCount === this.size) {
        resolve(query || limit ? new Collection() : this);
        return;
      }
      this.guild.client.ws.send({
        op: OPCodes.REQUEST_GUILD_MEMBERS,
        d: {
          guild_id: this.guild.id,
          query,
          limit,
        },
      });
      const fetchedMembers = new Collection();
      const handler = (members, guild) => {
        if (guild.id !== this.guild.id) return;
        for (const member of members.values()) {
          if (query || limit) fetchedMembers.set(member.id, member);
        }
        if (this.guild.memberCount <= this.size ||
          ((query || limit) && members.size < 1000) ||
          (limit && fetchedMembers.size >= limit)) {
          this.guild.client.removeListener(Events.GUILD_MEMBERS_CHUNK, handler);
          resolve(query || limit ? fetchedMembers : this);
        }
      };
      this.guild.client.on(Events.GUILD_MEMBERS_CHUNK, handler);
      this.guild.client.setTimeout(() => {
        this.guild.client.removeListener(Events.GUILD_MEMBERS_CHUNK, handler);
        reject(new Error('GUILD_MEMBERS_TIMEOUT'));
      }, 120e3);
    });
  }
}

module.exports = GuildMemberStore;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Role = __webpack_require__(22);

/**
 * Stores roles.
 * @private
 * @extends {DataStore}
 */
class RoleStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, Role);
    this.guild = guild;
  }

  create(data, cache) {
    return super.create(data, cache, { extras: [this.guild] });
  }

  /**
   * Data that can be resolved to a Role object. This can be:
   * * A Role
   * * A Snowflake
   * @typedef {Role|Snowflake} RoleResolvable
   */

  /**
    * Resolves a RoleResolvable to a Role object.
    * @method resolve
    * @memberof RoleStore
    * @instance
    * @param {RoleResolvable} role The role resolvable to resolve
    * @returns {?Role}
    */

  /**
    * Resolves a RoleResolvable to a role ID string.
    * @method resolveID
    * @memberof RoleStore
    * @instance
    * @param {RoleResolvable} role The role resolvable to resolve
    * @returns {?string}
    */
}

module.exports = RoleStore;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Channel = __webpack_require__(11);
const GuildChannel = __webpack_require__(15);

/**
 * Stores guild channels.
 * @private
 * @extends {DataStore}
 */
class GuildChannelStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, GuildChannel);
    this.guild = guild;
  }

  create(data) {
    const existing = this.get(data.id);
    if (existing) return existing;

    return Channel.create(this.client, data, this.guild);
  }

  /**
   * Data that can be resolved to give a Guild Channel object. This can be:
   * * A GuildChannel object
   * * A Snowflake
   * @typedef {GuildChannel|Snowflake} GuildChannelResolvable
   */

  /**
   * Resolves a GuildChannelResolvable to a Channel object.
   * @method resolve
   * @memberof GuildChannelStore
   * @instance
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?Channel}
   */

  /**
   * Resolves a GuildChannelResolvable to a channel ID string.
   * @method resolveID
   * @memberof GuildChannelStore
   * @instance
   * @param {GuildChannelResolvable} channel The GuildChannel resolvable to resolve
   * @returns {?string}
   */
}

module.exports = GuildChannelStore;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(5);
const Embed = __webpack_require__(14);
const { RangeError } = __webpack_require__(4);

module.exports = function sendMessage(channel, options) { // eslint-disable-line complexity
  const User = __webpack_require__(20);
  const GuildMember = __webpack_require__(12);
  if (channel instanceof User || channel instanceof GuildMember) return channel.createDM().then(dm => dm.send(options));
  let { content, nonce, reply, code, disableEveryone, tts, embed, files, split } = options;

  if (embed) embed = new Embed(embed)._apiTransform();

  if (typeof nonce !== 'undefined') {
    nonce = parseInt(nonce);
    if (isNaN(nonce) || nonce < 0) throw new RangeError('MESSAGE_NONCE_TYPE');
  }

  // Add the reply prefix
  if (reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
    const id = channel.client.users.resolveID(reply);
    const mention = `<@${reply instanceof GuildMember && reply.nickname ? '!' : ''}${id}>`;
    if (split) split.prepend = `${mention}, ${split.prepend || ''}`;
    content = `${mention}${typeof content !== 'undefined' ? `, ${content}` : ''}`;
  }

  if (content) {
    content = Util.resolveString(content);
    if (split && typeof split !== 'object') split = {};
    // Wrap everything in a code block
    if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
      content = Util.escapeMarkdown(content, true);
      content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
      if (split) {
        split.prepend = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n`;
        split.append = '\n```';
      }
    }

    // Add zero-width spaces to @everyone/@here
    if (disableEveryone || (typeof disableEveryone === 'undefined' && channel.client.options.disableEveryone)) {
      content = content.replace(/@(everyone|here)/g, '@\u200b$1');
    }

    if (split) content = Util.splitMessage(content, split);
  }

  if (content instanceof Array) {
    return new Promise((resolve, reject) => {
      const messages = [];
      (function sendChunk() {
        const opt = content.length ? { tts } : { tts, embed, files };
        channel.send(content.shift(), opt).then(message => {
          messages.push(message);
          if (content.length === 0) return resolve(messages);
          return sendChunk();
        }).catch(reject);
      }());
    });
  }

  return channel.client.api.channels[channel.id].messages.post({
    data: { content, tts, nonce, embed },
    files,
  }).then(data => channel.client.actions.MessageCreate.handle(data).message);
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(3);
const { UserFlags } = __webpack_require__(0);
const UserConnection = __webpack_require__(88);
const Base = __webpack_require__(8);

/**
 * Represents a user's profile on Discord.
 * @extends {Base}
 */
class UserProfile extends Base {
  constructor(user, data) {
    super(user.client);

    /**
     * The owner of the profile
     * @type {User}
     */
    this.user = user;

    /**
     * The guilds that the client user and the user share
     * @type {Collection<Snowflake, Guild>}
     */
    this.mutualGuilds = new Collection();

    /**
     * The user's connections
     * @type {Collection<Snowflake, UserConnection>}
     */
    this.connections = new Collection();

    this._patch(data);
  }

  _patch(data) {
    /**
     * If the user has Discord Premium
     * @type {boolean}
     */
    this.premium = Boolean(data.premium_since);

    /**
     * The Bitfield of the users' flags
     * @type {number}
     * @private
     */
    this._flags = data.user.flags;

    /**
     * The date since which the user has had Discord Premium
     * @type {?Date}
     */
    this.premiumSince = data.premium_since ? new Date(data.premium_since) : null;

    for (const guild of data.mutual_guilds) {
      if (this.client.guilds.has(guild.id)) {
        this.mutualGuilds.set(guild.id, this.client.guilds.get(guild.id));
      }
    }
    for (const connection of data.connected_accounts) {
      this.connections.set(connection.id, new UserConnection(this.user, connection));
    }
  }

  /**
   * The flags the user has
   * @type {UserFlags[]}
   * @readonly
   */
  get flags() {
    const flags = [];
    for (const [name, flag] of Object.entries(UserFlags)) {
      if ((this._flags & flag) === flag) flags.push(name);
    }
    return flags;
  }
}

module.exports = UserProfile;


/***/ }),
/* 88 */
/***/ (function(module, exports) {

/**
 * Represents a user connection (or "platform identity").
 */
class UserConnection {
  constructor(user, data) {
    /**
     * The user that owns the connection
     * @type {User}
     */
    this.user = user;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The type of the connection
     * @type {string}
     */
    this.type = data.type;

    /**
     * The username of the connection account
     * @type {string}
     */
    this.name = data.name;

    /**
     * The id of the connection account
     * @type {string}
     */
    this.id = data.id;

    /**
     * Whether the connection is revoked
     * @type {boolean}
     */
    this.revoked = data.revoked;

    /**
     * Partial server integrations (not yet implemented)
     * @type {Object[]}
     */
    this.integrations = data.integrations;
  }
}

module.exports = UserConnection;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

const { UserChannelOverrideMap } = __webpack_require__(0);

/**
 * A wrapper around the ClientUser's channel overrides.
 */
class ClientUserChannelOverride {
  constructor(data) {
    this.patch(data);
  }

  /**
   * Patch the data contained in this class with new partial data.
   * @param {Object} data Data to patch this with
   * @private
   */
  patch(data) {
    for (const [key, value] of Object.entries(UserChannelOverrideMap)) {
      if (!data.hasOwnProperty(key)) continue;
      if (typeof value === 'function') {
        this[value.name] = value(data[key]);
      } else {
        this[value] = data[key];
      }
    }
  }
}

module.exports = ClientUserChannelOverride;


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events, Status } = __webpack_require__(0);

class ResumedHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const ws = client.ws.connection;

    ws._trace = packet.d._trace;

    ws.status = Status.READY;
    this.packetManager.handleQueue();

    const replayed = ws.sequence - ws.closeSequence;

    ws.debug(`RESUMED ${ws._trace.join(' -> ')} | replayed ${replayed} events.`);
    client.emit(Events.RESUMED, replayed);
    ws.heartbeat();
  }
}

/**
 * Emitted whenever a WebSocket resumed.
 * @event Client#resumed
 * @param {number} replayed The number of events that were replayed
 */

module.exports = ResumedHandler;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events, Status } = __webpack_require__(0);

class GuildCreateHandler extends AbstractHandler {
  async handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    let guild = client.guilds.get(data.id);
    if (guild) {
      if (!guild.available && !data.unavailable) {
        // A newly available guild
        guild._patch(data);
        this.packetManager.ws.checkIfReady();
      }
    } else {
      // A new guild
      guild = client.guilds.create(data);
      const emitEvent = client.ws.connection.status === Status.READY;
      if (emitEvent) {
        /**
         * Emitted whenever the client joins a guild.
         * @event Client#guildCreate
         * @param {Guild} guild The created guild
         */
        if (client.options.fetchAllMembers) await guild.members.fetch();
        client.emit(Events.GUILD_CREATE, guild);
      }
    }
  }
}

module.exports = GuildCreateHandler;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    client.actions.GuildDelete.handle(packet.d);
  }
}

/**
 * Emitted whenever a guild is deleted/left.
 * @event Client#guildDelete
 * @param {Guild} guild The guild that was deleted
 */

module.exports = GuildDeleteHandler;


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildUpdate.handle(data);
  }
}

module.exports = GuildUpdateHandler;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);

class GuildBanAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    const user = client.users.get(data.user.id);
    if (guild && user) client.emit(Events.GUILD_BAN_ADD, guild, user);
  }
}

/**
 * Emitted whenever a member is banned from a guild.
 * @event Client#guildBanAdd
 * @param {Guild} guild The guild that the ban occurred in
 * @param {User} user The user that was banned
 */

module.exports = GuildBanAddHandler;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);

class GuildBanRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildBanRemove.handle(data);
  }
}

/**
 * Emitted whenever a member is unbanned from a guild.
 * @event Client#guildBanRemove
 * @param {Guild} guild The guild that the unban occurred in
 * @param {User} user The user that was unbanned
 */

module.exports = GuildBanRemoveHandler;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);
const { Events, Status } = __webpack_require__(0);

class GuildMemberAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      guild.memberCount++;
      const member = guild.members.create(data);
      if (client.ws.connection.status === Status.READY) {
        client.emit(Events.GUILD_MEMBER_ADD, member);
      }
    }
  }
}

module.exports = GuildMemberAddHandler;

/**
 * Emitted whenever a user joins a guild.
 * @event Client#guildMemberAdd
 * @param {GuildMember} member The member that has joined a guild
 */


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);

class GuildMemberRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildMemberRemove.handle(data);
  }
}

module.exports = GuildMemberRemoveHandler;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// ##untested handler##

const AbstractHandler = __webpack_require__(1);
const { Events, Status } = __webpack_require__(0);

class GuildMemberUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user.id);
      if (member) {
        const old = member._update(data);
        if (client.ws.connection.status === Status.READY) {
          /**
           * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
           * @event Client#guildMemberUpdate
           * @param {GuildMember} oldMember The member before the update
           * @param {GuildMember} newMember The member after the update
           */
          client.emit(Events.GUILD_MEMBER_UPDATE, old, member);
        }
      }
    }
  }
}

module.exports = GuildMemberUpdateHandler;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildRoleCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildRoleCreate.handle(data);
  }
}

module.exports = GuildRoleCreateHandler;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildRoleDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildRoleDelete.handle(data);
  }
}

module.exports = GuildRoleDeleteHandler;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildRoleUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildRoleUpdate.handle(data);
  }
}

module.exports = GuildRoleUpdateHandler;


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildEmojisUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildEmojisUpdate.handle(data);
  }
}

module.exports = GuildEmojisUpdate;


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);
const Collection = __webpack_require__(3);

class GuildMembersChunkHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;
    const members = new Collection();

    for (const member of data.members) members.set(member.user.id, guild.members.create(member));

    client.emit(Events.GUILD_MEMBERS_CHUNK, members, guild);

    client.ws.lastHeartbeatAck = true;
  }
}

/**
 * Emitted whenever a chunk of guild members is received (all members come from the same guild).
 * @event Client#guildMembersChunk
 * @param {Collection<Snowflake, GuildMember>} members The members in the chunk
 * @param {Guild} guild The guild related to the member chunk
 */

module.exports = GuildMembersChunkHandler;


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class ChannelCreateHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.ChannelCreate.handle(packet.d);
  }
}

module.exports = ChannelCreateHandler;

/**
 * Emitted whenever a channel is created.
 * @event Client#channelCreate
 * @param {DMChannel|GroupDMChannel|GuildChannel} channel The channel that was created
 */


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class ChannelDeleteHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.ChannelDelete.handle(packet.d);
  }
}

module.exports = ChannelDeleteHandler;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);

class ChannelUpdateHandler extends AbstractHandler {
  handle(packet) {
    const { old, updated } = this.packetManager.client.actions.ChannelUpdate.handle(packet.d);
    if (old && updated) {
      this.packetManager.client.emit(Events.CHANNEL_UPDATE, old, updated);
    }
  }
}

module.exports = ChannelUpdateHandler;

/**
 * Emitted whenever a channel is updated - e.g. name change, topic change.
 * @event Client#channelUpdate
 * @param {DMChannel|GroupDMChannel|GuildChannel} oldChannel The channel before the update
 * @param {DMChannel|GroupDMChannel|GuildChannel} newChannel The channel after the update
 */


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);

/*
{ t: 'CHANNEL_PINS_UPDATE',
  s: 666,
  op: 0,
  d:
   { last_pin_timestamp: '2016-08-28T17:37:13.171774+00:00',
     channel_id: '314866471639044027' } }
*/

class ChannelPinsUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const channel = client.channels.get(data.channel_id);
    const time = new Date(data.last_pin_timestamp);
    if (channel && time) client.emit(Events.CHANNEL_PINS_UPDATE, channel, time);
  }
}

module.exports = ChannelPinsUpdate;

/**
 * Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event, not much information
 * can be provided easily here - you need to manually check the pins yourself.
 * @event Client#channelPinsUpdate
 * @param {DMChannel|GroupDMChannel|TextChannel} channel The channel that the pins update occured in
 * @param {Date} time The time of the pins update
 */


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);

class PresenceUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    let user = client.users.get(data.user.id);
    const guild = client.guilds.get(data.guild_id);

    // Step 1
    if (!user) {
      if (data.user.username) {
        user = client.users.create(data.user);
      } else {
        return;
      }
    }

    const oldUser = user._update(data.user);
    if (!user.equals(oldUser)) {
      client.emit(Events.USER_UPDATE, oldUser, user);
    }

    if (guild) {
      let member = guild.members.get(user.id);
      if (!member && data.status !== 'offline') {
        member = guild.members.create({
          user,
          roles: data.roles,
          deaf: false,
          mute: false,
        });
        client.emit(Events.GUILD_MEMBER_AVAILABLE, member);
      }
      if (member) {
        if (client.listenerCount(Events.PRESENCE_UPDATE) === 0) {
          guild.presences.create(data);
          return;
        }
        const oldMember = member._clone();
        if (member.presence) {
          oldMember.frozenPresence = member.presence._clone();
        }
        guild.presences.create(data);
        client.emit(Events.PRESENCE_UPDATE, oldMember, member);
      } else {
        guild.presences.create(data);
      }
    }
  }
}

/**
 * Emitted whenever a guild member's presence changes, or they change one of their details.
 * @event Client#presenceUpdate
 * @param {GuildMember} oldMember The member before the presence update
 * @param {GuildMember} newMember The member after the presence update
 */

/**
 * Emitted whenever a user's details (e.g. username) are changed.
 * @event Client#userUpdate
 * @param {User} oldUser The user before the update
 * @param {User} newUser The user after the update
 */

/**
 * Emitted whenever a member becomes available in a large guild.
 * @event Client#guildMemberAvailable
 * @param {GuildMember} member The member that became available
 */

module.exports = PresenceUpdateHandler;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class UserUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.UserUpdate.handle(data);
  }
}

module.exports = UserUpdateHandler;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class UserNoteUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.actions.UserNoteUpdate.handle(data);
  }
}

module.exports = UserNoteUpdateHandler;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);

class UserSettingsUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    client.user.settings.patch(packet.d);
    client.emit(Events.USER_SETTINGS_UPDATE, client.user.settings);
  }
}

/**
 * Emitted whenever the client user's settings update.
 * @event Client#clientUserSettingsUpdate
 * @param {ClientUserSettings} clientUserSettings The new client user settings
 */

module.exports = UserSettingsUpdateHandler;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);
const ClientUserGuildSettings = __webpack_require__(55);

class UserGuildSettingsUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const settings = client.user.guildSettings.get(packet.d.guild_id);
    if (settings) settings.patch(packet.d);
    else client.user.guildSettings.set(packet.d.guild_id, new ClientUserGuildSettings(this.client, packet.d));
    client.emit(Events.USER_GUILD_SETTINGS_UPDATE, client.user.guildSettings.get(packet.d.guild_id));
  }
}

/**
 * Emitted whenever the client user's settings update.
 * @event Client#clientUserGuildSettingsUpdate
 * @param {ClientUserGuildSettings} clientUserGuildSettings The new client user guild settings
 */

module.exports = UserGuildSettingsUpdateHandler;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

const { Events } = __webpack_require__(0);

class VoiceStateUpdateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      const member = guild.members.get(data.user_id);
      if (member) {
        const oldMember = member._clone();
        oldMember._frozenVoiceState = oldMember.voiceState;

        if (member.user.id === client.user.id && data.channel_id) {
          client.emit('self.voiceStateUpdate', data);
        }

        guild.voiceStates.set(member.user.id, data);

        client.emit(Events.VOICE_STATE_UPDATE, oldMember, member);
      }
    }
  }
}

/**
 * Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
 * @event Client#voiceStateUpdate
 * @param {GuildMember} oldMember The member before the voice state update
 * @param {GuildMember} newMember The member after the voice state update
 */

module.exports = VoiceStateUpdateHandler;


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);

class TypingStartHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const channel = client.channels.get(data.channel_id);
    const user = client.users.get(data.user_id);
    const timestamp = new Date(data.timestamp * 1000);

    if (channel && user) {
      if (channel.type === 'voice') {
        client.emit(Events.WARN, `Discord sent a typing packet to voice channel ${channel.id}`);
        return;
      }
      if (channel._typing.has(user.id)) {
        const typing = channel._typing.get(user.id);
        typing.lastTimestamp = timestamp;
        typing.resetTimeout(tooLate(channel, user));
      } else {
        channel._typing.set(user.id, new TypingData(client, timestamp, timestamp, tooLate(channel, user)));
        client.emit(Events.TYPING_START, channel, user);
      }
    }
  }
}

class TypingData {
  constructor(client, since, lastTimestamp, _timeout) {
    this.client = client;
    this.since = since;
    this.lastTimestamp = lastTimestamp;
    this._timeout = _timeout;
  }

  resetTimeout(_timeout) {
    this.client.clearTimeout(this._timeout);
    this._timeout = _timeout;
  }

  get elapsedTime() {
    return Date.now() - this.since;
  }
}

function tooLate(channel, user) {
  return channel.client.setTimeout(() => {
    channel.client.emit(Events.TYPING_STOP, channel, user, channel._typing.get(user.id));
    channel._typing.delete(user.id);
  }, 6000);
}

/**
 * Emitted whenever a user starts typing in a channel.
 * @event Client#typingStart
 * @param {Channel} channel The channel the user started typing in
 * @param {User} user The user that started typing
 */

/**
 * Emitted whenever a user stops typing in a channel.
 * @event Client#typingStop
 * @param {Channel} channel The channel the user stopped typing in
 * @param {User} user The user that stopped typing
 */

module.exports = TypingStartHandler;


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageCreateHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageCreate.handle(packet.d);
  }
}

module.exports = MessageCreateHandler;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageDeleteHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageDelete.handle(packet.d);
  }
}

module.exports = MessageDeleteHandler;


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);

class MessageUpdateHandler extends AbstractHandler {
  handle(packet) {
    const { old, updated } = this.packetManager.client.actions.MessageUpdate.handle(packet.d);
    if (old && updated) {
      this.packetManager.client.emit(Events.MESSAGE_UPDATE, old, updated);
    }
  }
}

module.exports = MessageUpdateHandler;

/**
 * Emitted whenever a message is updated - e.g. embed or content change.
 * @event Client#messageUpdate
 * @param {Message} oldMessage The message before the update
 * @param {Message} newMessage The message after the update
 */


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageDeleteBulkHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageDeleteBulk.handle(packet.d);
  }
}

module.exports = MessageDeleteBulkHandler;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

/*
{
    "token": "my_token",
    "guild_id": "41771983423143937",
    "endpoint": "smart.loyal.discord.gg"
}
*/

class VoiceServerUpdate extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.emit('self.voiceServer', data);
  }
}

module.exports = VoiceServerUpdate;


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildSyncHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.GuildSync.handle(data);
  }
}

module.exports = GuildSyncHandler;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class RelationshipAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (data.type === 1) {
      client.users.fetch(data.id).then(user => {
        client.user.friends.set(user.id, user);
      });
    } else if (data.type === 2) {
      client.users.fetch(data.id).then(user => {
        client.user.blocked.set(user.id, user);
      });
    }
  }
}

module.exports = RelationshipAddHandler;


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class RelationshipRemoveHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    if (data.type === 2) {
      if (client.user.blocked.has(data.id)) {
        client.user.blocked.delete(data.id);
      }
    } else if (data.type === 1) {
      if (client.user.friends.has(data.id)) {
        client.user.friends.delete(data.id);
      }
    }
  }
}

module.exports = RelationshipRemoveHandler;


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);

class MessageReactionAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const { user, reaction } = client.actions.MessageReactionAdd.handle(data);
    if (reaction) client.emit(Events.MESSAGE_REACTION_ADD, reaction, user);
  }
}

module.exports = MessageReactionAddHandler;


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageReactionRemove extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageReactionRemove.handle(data);
  }
}

module.exports = MessageReactionRemove;


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageReactionRemoveAll extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    client.actions.MessageReactionRemoveAll.handle(data);
  }
}

module.exports = MessageReactionRemoveAll;


/***/ }),
/* 126 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 127 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 128 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

class ActionsManager {
  constructor(client) {
    this.client = client;

    this.register(__webpack_require__(130));
    this.register(__webpack_require__(131));
    this.register(__webpack_require__(132));
    this.register(__webpack_require__(133));
    this.register(__webpack_require__(134));
    this.register(__webpack_require__(135));
    this.register(__webpack_require__(136));
    this.register(__webpack_require__(137));
    this.register(__webpack_require__(138));
    this.register(__webpack_require__(139));
    this.register(__webpack_require__(140));
    this.register(__webpack_require__(141));
    this.register(__webpack_require__(142));
    this.register(__webpack_require__(143));
    this.register(__webpack_require__(144));
    this.register(__webpack_require__(145));
    this.register(__webpack_require__(146));
    this.register(__webpack_require__(147));
    this.register(__webpack_require__(148));
    this.register(__webpack_require__(149));
    this.register(__webpack_require__(150));
    this.register(__webpack_require__(151));
    this.register(__webpack_require__(152));
    this.register(__webpack_require__(153));
    this.register(__webpack_require__(154));
    this.register(__webpack_require__(155));
    this.register(__webpack_require__(156));
    this.register(__webpack_require__(157));
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const existing = channel.messages.get(data.id);
      if (existing) return { message: existing };
      const message = channel.messages.create(data);
      const user = message.author;
      const member = channel.guild ? channel.guild.member(user) : null;
      channel.lastMessageID = data.id;
      channel.lastMessage = message;
      if (user) {
        user.lastMessageID = data.id;
        user.lastMessage = message;
      }
      if (member) {
        member.lastMessageID = data.id;
        member.lastMessage = message;
      }

      client.emit(Events.MESSAGE_CREATE, message);
      return { message };
    }

    return {};
  }
}

/**
 * Emitted whenever a message is created.
 * @event Client#message
 * @param {Message} message The created message
 */

module.exports = MessageCreateAction;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class MessageDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);
    let message;

    if (channel) {
      message = channel.messages.get(data.id);
      if (message) {
        channel.messages.delete(message.id);
        client.emit(Events.MESSAGE_DELETE, message);
      }
    }

    return { message };
  }
}

/**
 * Emitted whenever a message is deleted.
 * @event Client#messageDelete
 * @param {Message} message The deleted message
 */

module.exports = MessageDeleteAction;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const Collection = __webpack_require__(3);
const { Events } = __webpack_require__(0);

class MessageDeleteBulkAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);

    if (channel) {
      const ids = data.ids;
      const messages = new Collection();
      for (const id of ids) {
        const message = channel.messages.get(id);
        if (message) messages.set(message.id, message);
      }

      if (messages.size > 0) client.emit(Events.MESSAGE_BULK_DELETE, messages);
      return { messages };
    }
    return {};
  }
}

/**
 * Emitted whenever messages are deleted in bulk.
 * @event Client#messageDeleteBulk
 * @param {Collection<Snowflake, Message>} messages The deleted messages, mapped by their ID
 */

module.exports = MessageDeleteBulkAction;


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class MessageUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const message = channel.messages.get(data.id);
      if (message) {
        message.patch(data);
        return {
          old: message._edits[0],
          updated: message,
        };
      }
    }

    return {};
  }
}

module.exports = MessageUpdateAction;


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id' } }
*/

class MessageReactionAdd extends Action {
  handle(data) {
    const user = data.user || this.client.users.get(data.user_id);
    if (!user) return false;
    // Verify channel
    const channel = data.channel || this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;
    // Verify message
    const message = data.message || channel.messages.get(data.message_id);
    if (!message) return false;
    if (!data.emoji) return false;
    // Verify reaction
    const reaction = message.reactions.create({
      emoji: data.emoji,
      count: 0,
      me: user.id === this.client.user.id,
    });
    reaction._add(user);
    return { message, reaction, user };
  }
}

/**
 * Emitted whenever a reaction is added to a message.
 * @event Client#messageReactionAdd
 * @param {MessageReaction} messageReaction The reaction object
 * @param {User} user The user that applied the emoji or reaction emoji
 */

module.exports = MessageReactionAdd;


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

/*
{ user_id: 'id',
     message_id: 'id',
     emoji: { name: '�', id: null },
     channel_id: 'id' } }
*/

class MessageReactionRemove extends Action {
  handle(data) {
    const user = this.client.users.get(data.user_id);
    if (!user) return false;
    // Verify channel
    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;
    // Verify message
    const message = channel.messages.get(data.message_id);
    if (!message) return false;
    if (!data.emoji) return false;
    // Verify reaction
    const emojiID = data.emoji.id || decodeURIComponent(data.emoji.name);
    const reaction = message.reactions.get(emojiID);
    if (!reaction) return false;
    reaction._remove(user);
    this.client.emit(Events.MESSAGE_REACTION_REMOVE, reaction, user);

    return { message, reaction, user };
  }
}

/**
 * Emitted whenever a reaction is removed from a message.
 * @event Client#messageReactionRemove
 * @param {MessageReaction} messageReaction The reaction object
 * @param {User} user The user that removed the emoji or reaction emoji
 */

module.exports = MessageReactionRemove;


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class MessageReactionRemoveAll extends Action {
  handle(data) {
    const channel = this.client.channels.get(data.channel_id);
    if (!channel || channel.type === 'voice') return false;

    const message = channel.messages.get(data.message_id);
    if (!message) return false;

    message.reactions.clear();
    this.client.emit(Events.MESSAGE_REACTION_REMOVE_ALL, message);

    return { message };
  }
}

/**
 * Emitted whenever all reactions are removed from a message.
 * @event Client#messageReactionRemoveAll
 * @param {Message} message The message the reactions were removed from
 */

module.exports = MessageReactionRemoveAll;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const existing = client.channels.has(data.id);
    const channel = client.channels.create(data);
    if (!existing && channel) {
      client.emit(Events.CHANNEL_CREATE, channel);
    }
    return { channel };
  }
}

module.exports = ChannelCreateAction;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class ChannelDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;
    let channel = client.channels.get(data.id);

    if (channel) {
      client.channels.remove(channel.id);
      client.emit(Events.CHANNEL_DELETE, channel);
    }

    return { channel };
  }
}

/**
 * Emitted whenever a channel is deleted.
 * @event Client#channelDelete
 * @param {GroupDMChannel|GuildChannel} channel The channel that was deleted
 */

module.exports = ChannelDeleteAction;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class ChannelUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const channel = client.channels.get(data.id);
    if (channel) {
      const old = channel._update(data);
      return {
        old,
        updated: channel,
      };
    }

    return {};
  }
}

module.exports = ChannelUpdateAction;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    let guild = client.guilds.get(data.id);
    if (guild) {
      for (const channel of guild.channels.values()) {
        if (channel.type === 'text') channel.stopTyping(true);
      }

      if (guild.available && data.unavailable) {
        // Guild is unavailable
        guild.available = false;
        client.emit(Events.GUILD_UNAVAILABLE, guild);

        // Stops the GuildDelete packet thinking a guild was actually deleted,
        // handles emitting of event itself
        return {
          guild: null,
        };
      }

      // Delete guild
      client.guilds.remove(guild.id);
      client.emit(Events.GUILD_DELETE, guild);
      this.deleted.set(guild.id, guild);
      this.scheduleForDeletion(guild.id);
    } else {
      guild = this.deleted.get(data.id) || null;
    }

    return { guild };
  }

  scheduleForDeletion(id) {
    this.client.setTimeout(() => this.deleted.delete(id), this.client.options.restWsBridgeTimeout);
  }
}

/**
 * Emitted whenever a guild becomes unavailable, likely due to a server outage.
 * @event Client#guildUnavailable
 * @param {Guild} guild The guild that has become unavailable
 */

module.exports = GuildDeleteAction;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.id);
    if (guild) {
      const old = guild._update(data);
      client.emit(Events.GUILD_UPDATE, old, guild);
      return {
        old,
        updated: guild,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a guild is updated - e.g. name change.
 * @event Client#guildUpdate
 * @param {Guild} oldGuild The guild before the update
 * @param {Guild} newGuild The guild after the update
 */

module.exports = GuildUpdateAction;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildMemberGetAction extends Action {
  handle(guild, data) {
    const member = guild.members.create(data);
    return { member };
  }
}

module.exports = GuildMemberGetAction;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events, Status } = __webpack_require__(0);

class GuildMemberRemoveAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let member = null;
    if (guild) {
      member = guild.members.get(data.user.id);
      if (member) {
        guild.memberCount--;
        guild.members.remove(member.id);
        if (client.status === Status.READY) client.emit(Events.GUILD_MEMBER_REMOVE, member);
      }
    }
    return { guild, member };
  }
}

/**
 * Emitted whenever a member leaves a guild, or is kicked.
 * @event Client#guildMemberRemove
 * @param {GuildMember} member The member that has left/been kicked from the guild
 */

module.exports = GuildMemberRemoveAction;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildBanRemove extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    const user = client.users.create(data.user);
    if (guild && user) client.emit(Events.GUILD_BAN_REMOVE, guild, user);
  }
}

module.exports = GuildBanRemove;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildRoleCreate extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let role;
    if (guild) {
      const already = guild.roles.has(data.role.id);
      role = guild.roles.create(data.role);
      if (!already) client.emit(Events.GUILD_ROLE_CREATE, role);
    }
    return { role };
  }
}

/**
 * Emitted whenever a role is created.
 * @event Client#roleCreate
 * @param {Role} role The role that was created
 */

module.exports = GuildRoleCreate;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildRoleDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let role;

    if (guild) {
      role = guild.roles.get(data.role_id);
      if (role) {
        guild.roles.remove(data.role_id);
        client.emit(Events.GUILD_ROLE_DELETE, role);
      }
    }

    return { role };
  }
}

/**
 * Emitted whenever a guild role is deleted.
 * @event Client#roleDelete
 * @param {Role} role The role that was deleted
 */

module.exports = GuildRoleDeleteAction;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildRoleUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);

    if (guild) {
      let old = null;

      const role = guild.roles.get(data.role.id);
      if (role) {
        old = role._update(data.role);
        client.emit(Events.GUILD_ROLE_UPDATE, old, role);
      }

      return {
        old,
        updated: role,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a guild role is updated.
 * @event Client#roleUpdate
 * @param {Role} oldRole The role before the update
 * @param {Role} newRole The role after the update
 */

module.exports = GuildRoleUpdateAction;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class UserGetAction extends Action {
  handle(data) {
    const client = this.client;
    const user = client.users.create(data);
    return { user };
  }
}

module.exports = UserGetAction;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    if (client.user) {
      if (client.user.equals(data)) {
        return {
          old: client.user,
          updated: client.user,
        };
      }

      const oldUser = client.user._update(data);
      client.emit(Events.USER_UPDATE, oldUser, client.user);
      return {
        old: oldUser,
        updated: client.user,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = UserUpdateAction;


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class UserNoteUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const oldNote = client.user.notes.get(data.id);
    const note = data.note.length ? data.note : null;

    client.user.notes.set(data.id, note);

    client.emit(Events.USER_NOTE_UPDATE, data.id, oldNote, note);

    return {
      old: oldNote,
      updated: note,
    };
  }
}

/**
 * Emitted whenever a note is updated.
 * @event Client#userNoteUpdate
 * @param {User} user The user the note belongs to
 * @param {string} oldNote The note content before the update
 * @param {string} newNote The note content after the update
 */

module.exports = UserNoteUpdateAction;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildSync extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.id);
    if (guild) {
      if (data.presences) {
        for (const presence of data.presences) guild.presences.create(presence);
      }

      if (data.members) {
        for (const syncMember of data.members) {
          const member = guild.members.get(syncMember.user.id);
          if (member) {
            member._patch(syncMember);
          } else {
            guild.members.create(syncMember, false);
          }
        }
      }

      if ('large' in data) guild.large = data.large;
    }
  }
}

module.exports = GuildSync;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildEmojiCreateAction extends Action {
  handle(guild, createdEmoji) {
    const emoji = guild.emojis.create(createdEmoji);
    this.client.emit(Events.GUILD_EMOJI_CREATE, emoji);
    return { emoji };
  }
}

/**
 * Emitted whenever a custom emoji is created in a guild.
 * @event Client#emojiCreate
 * @param {Emoji} emoji The emoji that was created
 */

module.exports = GuildEmojiCreateAction;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildEmojiDeleteAction extends Action {
  handle(emoji) {
    emoji.guild.emojis.remove(emoji.id);
    this.client.emit(Events.GUILD_EMOJI_DELETE, emoji);
    return { emoji };
  }
}

/**
 * Emitted whenever a custom guild emoji is deleted.
 * @event Client#emojiDelete
 * @param {Emoji} emoji The emoji that was deleted
 */

module.exports = GuildEmojiDeleteAction;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);
const { Events } = __webpack_require__(0);

class GuildEmojiUpdateAction extends Action {
  handle(current, data) {
    const old = current._update(data);
    this.client.emit(Events.GUILD_EMOJI_UPDATE, old, current);
    return { emoji: current };
  }
}

/**
 * Emitted whenever a custom guild emoji is updated.
 * @event Client#emojiUpdate
 * @param {Emoji} oldEmoji The old emoji
 * @param {Emoji} newEmoji The new emoji
 */

module.exports = GuildEmojiUpdateAction;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

function mappify(iterable) {
  const map = new Map();
  for (const x of iterable) map.set(...x);
  return map;
}

class GuildEmojisUpdateAction extends Action {
  handle(data) {
    const guild = this.client.guilds.get(data.guild_id);
    if (!guild || !guild.emojis) return;

    const deletions = mappify(guild.emojis.entries());

    for (const emoji of data.emojis) {
      // Determine type of emoji event
      const cachedEmoji = guild.emojis.get(emoji.id);
      if (cachedEmoji) {
        deletions.delete(emoji.id);
        if (!cachedEmoji.equals(emoji, true)) {
          // Emoji updated
          this.client.actions.GuildEmojiUpdate.handle(cachedEmoji, emoji);
        }
      } else {
        // Emoji added
        this.client.actions.GuildEmojiCreate.handle(guild, emoji);
      }
    }

    for (const emoji of deletions.values()) {
      // Emoji deleted
      this.client.actions.GuildEmojiDelete.handle(emoji);
    }
  }
}

module.exports = GuildEmojisUpdateAction;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildRolesPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      for (const partialRole of data.roles) {
        const role = guild.roles.get(partialRole.id);
        if (role) role.rawPosition = partialRole.position;
      }
    }

    return { guild };
  }
}

module.exports = GuildRolesPositionUpdate;


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(2);

class GuildChannelsPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      for (const partialChannel of data.channels) {
        const channel = guild.channels.get(partialChannel.id);
        if (channel) channel.rawPosition = partialChannel.position;
      }
    }

    return { guild };
  }
}

module.exports = GuildChannelsPositionUpdate;


/***/ }),
/* 158 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 159 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const User = __webpack_require__(20);
const GuildMember = __webpack_require__(12);
const Message = __webpack_require__(30);

/**
 * A data store to store User models.
 * @extends {DataStore}
 */
class UserStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, User);
  }

  /**
   * Data that resolves to give a User object. This can be:
   * * A User object
   * * A Snowflake
   * * A Message object (resolves to the message author)
   * * A GuildMember object
   * @typedef {User|Snowflake|Message|GuildMember} UserResolvable
   */

  /**
   * Resolves a UserResolvable to a User object.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?User}
   */
  resolve(user) {
    if (user instanceof GuildMember) return user.user;
    if (user instanceof Message) return user.author;
    return super.resolve(user);
  }

  /**
   * Resolves a UserResolvable to a user ID string.
   * @param {UserResolvable} user The UserResolvable to identify
   * @returns {?string}
   */
  resolveID(user) {
    if (user instanceof GuildMember) return user.user.id;
    if (user instanceof Message) return user.author.id;
    return super.resolveID(user);
  }

  /**
   * Obtains a user from Discord, or the user cache if it's already available.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Snowflake} id ID of the user
   * @param {boolean} [cache=true] Whether to cache the new user object if it isn't already
   * @returns {Promise<User>}
   */
  fetch(id, cache = true) {
    const existing = this.get(id);
    if (existing) return Promise.resolve(existing);

    return this.client.api.users(id).get().then(data => this.create(data, cache));
  }
}

module.exports = UserStore;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Channel = __webpack_require__(11);
const { Events } = __webpack_require__(0);

const kLru = Symbol('LRU');
const lruable = ['group', 'dm'];

/**
 * Stores channels.
 * @private
 * @extends {DataStore}
 */
class ChannelStore extends DataStore {
  constructor(client, iterableOrOptions = {}, options) {
    if (!options && typeof iterableOrOptions[Symbol.iterator] !== 'function') {
      options = iterableOrOptions;
      iterableOrOptions = undefined;
    }
    super(client, iterableOrOptions, Channel);

    if (options.lru) {
      const lru = this[kLru] = [];
      lru.add = item => {
        lru.remove(item);
        lru.unshift(item);
        while (lru.length > options.lru) this.remove(lru[lru.length - 1]);
      };
      lru.remove = item => {
        const index = lru.indexOf(item);
        if (index > -1) lru.splice(index, 1);
      };
    }
  }

  get(key, peek = false) {
    const item = super.get(key);
    if (!item || !lruable.includes(item.type)) return item;
    if (!peek && this[kLru]) this[kLru].add(key);
    return item;
  }

  set(key, val) {
    if (this[kLru] && lruable.includes(val.type)) this[kLru].add(key);
    return super.set(key, val);
  }

  delete(key) {
    const item = this.get(key, true);
    if (!item) return false;
    if (this[kLru] && lruable.includes(item.type)) this[kLru].remove(key);
    return super.delete(key);
  }

  create(data, guild, cache = true) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const channel = Channel.create(this.client, data, guild);

    if (!channel) {
      this.client.emit(Events.DEBUG, `Failed to find guild for channel ${data.id} ${data.type}`);
      return null;
    }

    if (cache) this.set(channel.id, channel);

    return channel;
  }

  remove(id) {
    const channel = this.get(id);
    if (channel.guild) channel.guild.channels.remove(id);
    super.remove(id);
  }

  /**
   * Data that can be resolved to give a Channel object. This can be:
   * * A Channel object
   * * A Snowflake
   * @typedef {Channel|Snowflake} ChannelResolvable
   */

  /**
   * Resolves a ChannelResolvable to a Channel object.
   * @method resolve
   * @memberof ChannelStore
   * @instance
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Channel}
   */

  /**
   * Resolves a ChannelResolvable to a channel ID string.
   * @method resolveID
   * @memberof ChannelStore
   * @instance
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?string}
   */
}

module.exports = ChannelStore;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Guild = __webpack_require__(24);

/**
 * Stores guilds.
 * @private
 * @extends {DataStore}
 */
class GuildStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Guild);
  }

  /**
   * Data that resolves to give a Guild object. This can be:
   * * A Guild object
   * * A Snowflake
   * @typedef {Guild|Snowflake} GuildResolvable
   */

  /**
   * Resolves a GuildResolvable to a Guild object.
   * @method resolve
   * @memberof GuildStore
   * @instance
   * @param {GuildResolvable} guild The guild resolvable to identify
   * @returns {?Guild}
   */

  /**
   * Resolves a GuildResolvable to a Guild ID string.
   * @method resolveID
   * @memberof GuildStore
   * @instance
   * @param {GuildResolvable} guild The guild resolvable to identify
   * @returns {?string}
   */
}

module.exports = GuildStore;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

const PresenceStore = __webpack_require__(53);
const Collection = __webpack_require__(3);
const { ActivityTypes, OPCodes } = __webpack_require__(0);
const { Presence } = __webpack_require__(13);
const { TypeError } = __webpack_require__(4);

/**
 * Stores the client presence and other presences.
 * @extends {PresenceStore}
 * @private
 */
class ClientPresenceStore extends PresenceStore {
  constructor(...args) {
    super(...args);
    this.clientPresence = new Presence(this.client, {
      status: 'online',
      afk: false,
      since: null,
      activity: null,
    });
  }

  async setClientPresence({ status, since, afk, activity }) { // eslint-disable-line complexity
    const applicationID = activity && (activity.application ? activity.application.id || activity.application : null);
    let assets = new Collection();
    if (activity) {
      if (typeof activity.name !== 'string') throw new TypeError('INVALID_TYPE', 'name', 'string');
      if (!activity.type) activity.type = 0;
      if (activity.assets && applicationID) {
        try {
          const a = await this.client.api.oauth2.applications(applicationID).assets.get();
          for (const asset of a) assets.set(asset.name, asset.id);
        } catch (err) { } // eslint-disable-line no-empty
      }
    }

    const packet = {
      afk: afk != null ? afk : false, // eslint-disable-line eqeqeq
      since: since != null ? since : null, // eslint-disable-line eqeqeq
      status: status || this.clientPresence.status,
      game: activity ? {
        type: typeof activity.type === 'number' ? activity.type : ActivityTypes.indexOf(activity.type),
        name: activity.name,
        url: activity.url,
        details: activity.details || undefined,
        state: activity.state || undefined,
        assets: activity.assets ? {
          large_text: activity.assets.largeText || undefined,
          small_text: activity.assets.smallText || undefined,
          large_image: assets.get(activity.assets.largeImage) || activity.assets.largeImage,
          small_image: assets.get(activity.assets.smallImage) || activity.assets.smallImage,
        } : undefined,
        timestamps: activity.timestamps || undefined,
        party: activity.party || undefined,
        application_id: applicationID || undefined,
        secrets: activity.secrets || undefined,
        instance: activity.instance || undefined,
      } : null,
    };

    this.clientPresence.patch(packet);
    this.client.ws.send({ op: OPCodes.STATUS_UPDATE, d: packet });
    return this.clientPresence;
  }
}

module.exports = ClientPresenceStore;


/***/ }),
/* 164 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 165 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 166 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

const Webhook = __webpack_require__(16);
const BaseClient = __webpack_require__(28);

/**
 * The webhook client.
 * @extends {Webhook}
 * @extends {BaseClient}
 */
class WebhookClient extends BaseClient {
  /**
   * @param {Snowflake} id ID of the webhook
   * @param {string} token Token of the webhook
   * @param {ClientOptions} [options] Options for the client
   * @example
   * // Create a new webhook and send a message
   * const hook = new Discord.WebhookClient('1234', 'abcdef');
   * hook.send('This will send a message').catch(console.error);
   */
  constructor(id, token, options) {
    super(options);
    Object.defineProperty(this, 'client', { value: this });
    this.id = id;
    this.token = token;
  }
}

Webhook.applyToClass(WebhookClient);

module.exports = WebhookClient;


/***/ })
/******/ ]);
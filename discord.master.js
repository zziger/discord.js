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
/******/ 	return __webpack_require__(__webpack_require__.s = 77);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Package = exports.Package = __webpack_require__(42);
const { Error, RangeError } = __webpack_require__(4);
const browser = exports.browser = typeof window !== 'undefined';

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
   * @property {boolean} [compress=false] Whether to compress data sent on the connection
   * (defaults to `false` for browsers)
   */
  ws: {
    large_threshold: 250,
    compress: false,
    properties: {
      $os: browser ? 'browser' : process.platform,
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

exports.UserAgent = browser ? null :
  `DiscordBot (${Package.homepage.split('#')[0]}, ${Package.version}) Node.js/${process.version}`;

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
      Emoji: (emojiID, format = 'png') => `${root}/emojis/${emojiID}.${format}`,
      Asset: name => `${root}/assets/${name}`,
      DefaultAvatar: number => `${root}/embed/avatars/${number}.png`,
      Avatar: (userID, hash, format = 'default', size) => {
        if (userID === '1') return hash;
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
  RATE_LIMIT: 'rateLimit',
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
   * Automatically convert emoticons in your messages to emoji,
   * for example when you type `:-)` Discord will convert it to 😃
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
   * Display images, videos, and lolcats when posted as links in chat
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
 * * INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT
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
  INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: 50036,
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(43);
module.exports.Messages = __webpack_require__(85);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const snekfetch = __webpack_require__(30);
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
    if (splitText.length === 1) throw new RangeError('SPLIT_MAX_LEN');
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
   * * A Discord custom emoji (`<:name:id>` or `<a:name:id>`)
   * @param {string} text Emoji string to parse
   * @returns {Object} Object with `animated`, `name`, and `id` properties
   * @private
   */
  static parseEmoji(text) {
    if (text.includes('%')) text = decodeURIComponent(text);
    if (!text.includes(':')) return { animated: false, name: text, id: null };
    const m = text.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/);
    if (!m) return null;
    return { animated: Boolean(m[1]), name: m[2], id: m[3] };
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
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
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
   * Can be a number, hex string, an RGB array like:
   * ```js
   * [255, 0, 255] // purple
   * ```
   * or one of the following strings:
   * - `DEFAULT`
   * - `AQUA`
   * - `GREEN`
   * - `BLUE`
   * - `PURPLE`
   * - `GOLD`
   * - `ORANGE`
   * - `RED`
   * - `GREY`
   * - `DARKER_GREY`
   * - `NAVY`
   * - `DARK_AQUA`
   * - `DARK_GREEN`
   * - `DARK_BLUE`
   * - `DARK_PURPLE`
   * - `DARK_GOLD`
   * - `DARK_ORANGE`
   * - `DARK_RED`
   * - `DARK_GREY`
   * - `LIGHT_GREY`
   * - `DARK_NAVY`
   * - `RANDOM`
   * @typedef {string|number|number[]} ColorResolvable
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

    if (color < 0 || color > 0xFFFFFF) throw new RangeError('COLOR_RANGE');
    else if (color && isNaN(color)) throw new TypeError('COLOR_CONVERT');

    return color;
  }

  /**
   * Sorts by Discord's position and ID.
   * @param  {Collection} collection Collection of objects to sort
   * @returns {Collection}
   */
  static discordSort(collection) {
    return collection.sort((a, b) =>
      a.rawPosition - b.rawPosition ||
      parseInt(a.id.slice(0, -10)) - parseInt(b.id.slice(0, -10)) ||
      parseInt(a.id.slice(10)) - parseInt(b.id.slice(10))
    );
  }

  /**
   * Sets the position of a Channel or Role.
   * @param {Channel|Role} item Object to set the position of
   * @param {number} position New position for the object
   * @param {boolean} relative Whether `position` is relative to its current position
   * @param {Collection<string, Channel|Role>} sorted A collection of the objects sorted properly
   * @param {APIRouter} route Route to call PATCH on
   * @param {string} [reason] Reason for the change
   * @returns {Promise<Object[]>} Updated item list, with `id` and `position` properties
   * @private
   */
  static setPosition(item, position, relative, sorted, route, reason) {
    let updatedItems = sorted.array();
    Util.moveElementInArray(updatedItems, item, position, relative);
    updatedItems = updatedItems.map((r, i) => ({ id: r.id, position: i }));
    return route.patch({ data: updatedItems, reason }).then(() => updatedItems);
  }

  /**
   * Alternative to Node's `path.basename` that we have for some (probably stupid) reason.
   * @param {string} path Path to get the basename of
   * @param {string} [ext] File extension to remove
   * @returns {string} Basename of the path
   * @private
   */
  static basename(path, ext) {
    let f = splitPathRe.exec(path)[3];
    if (ext && f.endsWith(ext)) f = f.slice(0, -ext.length);
    return f;
  }

  /**
   * Transforms a snowflake from a decimal string to a bit string.
   * @param  {Snowflake} num Snowflake to be transformed
   * @returns {string}
   * @private
   */
  static idToBinary(num) {
    let bin = '';
    let high = parseInt(num.slice(0, -10)) || 0;
    let low = parseInt(num.slice(-10));
    while (low > 0 || high > 0) {
      bin = String(low & 1) + bin;
      low = Math.floor(low / 2);
      if (high > 0) {
        low += 5000000000 * (high % 2);
        high = Math.floor(high / 2);
      }
    }
    return bin;
  }

  /**
   * Transforms a snowflake from a bit string to a decimal string.
   * @param  {string} num Bit string to be transformed
   * @returns {Snowflake}
   * @private
   */
  static binaryToID(num) {
    let dec = '';

    while (num.length > 50) {
      const high = parseInt(num.slice(0, -32), 2);
      const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);

      dec = (low % 10).toString() + dec;
      num = Math.floor(high / 10).toString(2) + Math.floor(low / 10).toString(2).padStart(32, '0');
    }

    num = parseInt(num, 2);
    while (num > 0) {
      dec = (num % 10).toString() + dec;
      num = Math.floor(num / 10);
    }

    return dec;
  }

  /**
   * Creates a Promise that resolves after a specified duration.
   * @param {number} ms How long to wait before resolving (in milliseconds)
   * @returns {Promise<void>}
   * @private
   */
  static delayFor(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = Util;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(2);
let Structures;

/**
 * Manages the creation, retrieval and deletion of a specific data model.
 * @extends {Collection}
 */
class DataStore extends Collection {
  constructor(client, iterable, holds) {
    super();
    if (!Structures) Structures = __webpack_require__(23);
    Object.defineProperty(this, 'client', { value: client });
    Object.defineProperty(this, 'holds', { value: Structures.get(holds.name) || holds });
    if (iterable) for (const item of iterable) this.add(item);
  }

  add(data, cache = true, { id, extras = [] } = {}) {
    const existing = this.get(id || data.id);
    if (existing) return existing;

    const entry = this.holds ? new this.holds(this.client, data, ...extras) : data;
    if (cache) this.set(id || entry.id, entry);
    return entry;
  }

  remove(key) { return this.delete(key); }

  /**
   * Resolves a data entry to a data Object.
   * @param {string|Object} idOrInstance The id or instance of something in this DataStore
   * @returns {?Object} An instance from this DataStore
   */
  resolve(idOrInstance) {
    if (idOrInstance instanceof this.holds) return idOrInstance;
    if (typeof idOrInstance === 'string') return this.get(idOrInstance) || null;
    return null;
  }

  /**
   * Resolves a data entry to a instance ID.
   * @param {string|Instance} idOrInstance The id or instance of something in this DataStore
   * @returns {?Snowflake}
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(49);
const fs = __webpack_require__(49);
const snekfetch = __webpack_require__(30);
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(5);

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
    // eslint-disable-next-line max-len
    const BINARY = `${(Date.now() - EPOCH).toString(2).padStart(42, '0')}0000100000${(INCREMENT++).toString(2).padStart(12, '0')}`;
    return Util.binaryToID(BINARY);
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
    const BINARY = Util.idToBinary(snowflake).toString(2).padStart(64, '0');
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

module.exports = SnowflakeUtil;


/***/ }),
/* 10 */
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
   * Freezes these permissions, making them immutable.
   * @returns {Permissions} These permissions
   */
  freeze() {
    return Object.freeze(this);
  }

  /**
   * Adds permissions to these ones.
   * @param {...PermissionResolvable} permissions Permissions to add
   * @returns {Permissions} These permissions or new permissions if the instance is frozen.
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
   * Removes permissions from these.
   * @param {...PermissionResolvable} permissions Permissions to remove
   * @returns {Permissions} These permissions or new permissions if the instance is frozen.
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
/* 11 */
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
    this.status = data.status || this.status || 'offline';

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
   * Whether this presence is equal to another.
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
     * Hover text for the large image
     * @type {?string}
     */
    this.largeText = assets.large_text || null;

    /**
     * Hover text for the small image
     * @type {?string}
     */
    this.smallText = assets.small_text || null;

    /**
     * ID of the large image asset
     * @type {?Snowflake}
     */
    this.largeImage = assets.large_image || null;

    /**
     * ID of the small image asset
     * @type {?Snowflake}
     */
    this.smallImage = assets.small_image || null;
  }

  /**
   * Gets the URL of the small image asset
   * @param {Object} [options] Options for the image url
   * @param {string} [options.format] Format of the image
   * @param {number} [options.size] Size of the image
   * @returns {?string} The small image URL
   */
  smallImageURL({ format, size } = {}) {
    if (!this.smallImage) return null;
    return this.activity.presence.client.rest.cdn
      .AppAsset(this.activity.applicationID, this.smallImage, { format, size });
  }

  /**
   * Gets the URL of the large image asset
   * @param {Object} [options] Options for the image url
   * @param {string} [options.format] Format of the image
   * @param {number} [options.size] Size of the image
   * @returns {?string} The large image URL
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined');

function _has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

exports.assign = function (obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// reduce buffer size, avoiding mem copy
exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) { return buf; }
  if (buf.subarray) { return buf.subarray(0, size); }
  buf.length = size;
  return buf;
};


var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    return [].concat.apply([], chunks);
  }
};


// Enable/Disable typed arrays use, for testing
//
exports.setTyped = function (on) {
  if (on) {
    exports.Buf8  = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8  = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(9);
const Base = __webpack_require__(7);
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
   * The time the channel was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object.
   * @returns {string}
   * @example
   * // Logs: Hello from <#123456789012345678>!
   * console.log(`Hello from ${channel}!`);
   */
  toString() {
    return `<#${this.id}>`;
  }

  /**
   * Deletes this channel.
   * @returns {Promise<Channel>}
   * @example
   * // Delete the channel
   * channel.delete()
   *   .then(console.log)
   *   .catch(console.error);
   */
  delete() {
    return this.client.api.channels(this.id).delete().then(() => this);
  }

  static create(client, data, guild) {
    const Structures = __webpack_require__(23);
    let channel;
    if (data.type === ChannelTypes.DM) {
      const DMChannel = Structures.get('DMChannel');
      channel = new DMChannel(client, data);
    } else if (data.type === ChannelTypes.GROUP) {
      const GroupDMChannel = Structures.get('GroupDMChannel');
      channel = new GroupDMChannel(client, data);
    } else {
      guild = guild || client.guilds.get(data.guild_id);
      if (guild) {
        switch (data.type) {
          case ChannelTypes.TEXT: {
            const TextChannel = Structures.get('TextChannel');
            channel = new TextChannel(guild, data);
            break;
          }
          case ChannelTypes.VOICE: {
            const VoiceChannel = Structures.get('VoiceChannel');
            channel = new VoiceChannel(guild, data);
            break;
          }
          case ChannelTypes.CATEGORY: {
            const CategoryChannel = Structures.get('CategoryChannel');
            channel = new CategoryChannel(guild, data);
            break;
          }
          default: {
            const GuildChannel = Structures.get('GuildChannel');
            channel = new GuildChannel(guild, data);
          }
        }
        guild.channels.set(channel.id, channel);
      }
    }
    return channel;
  }
}

module.exports = Channel;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const DataResolver = __webpack_require__(8);
const { createMessage } = __webpack_require__(25);

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
   * @property {FileOptions[]|string[]} [files] Files to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message.
   */

  /* eslint-disable max-len */
  /**
   * Sends a message with this webhook.
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
  async send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = null;
    } else if (!options) {
      options = {};
    }
    if (!options.content) options.content = content;

    const { data, files } = await createMessage(this, options);

    if (data.content instanceof Array) {
      const messages = [];
      for (let i = 0; i < data.content.length; i++) {
        const opt = i === data.content.length - 1 ? { embeds: data.embeds, files } : {};
        Object.assign(opt, { avatarURL: data.avatar_url, content: data.content[i], username: data.username });
        // eslint-disable-next-line no-await-in-loop
        const message = await this.send(data.content[i], opt);
        messages.push(message);
      }
      return messages;
    }


    return this.client.api.webhooks(this.id, this.token).post({
      data, files,
      query: { wait: true },
      auth: false,
    }).then(d => {
      if (!this.client.channels) return d;
      return this.client.channels.get(d.channel_id).messages.add(d, false);
    });
  }

  /**
   * Sends a raw slack message with this webhook.
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
      return this.client.channels.get(data.channel_id).messages.add(data, false);
    });
  }

  /**
   * Edits the webhook.
   * @param {Object} options Options
   * @param {string} [options.name=this.name] New name for this webhook
   * @param {BufferResolvable} [options.avatar] New avatar for this webhook
   * @param {ChannelResolvable} [options.channel] New channel for this webhook
   * @param {string} [reason] Reason for editing this webhook
   * @returns {Promise<Webhook>}
   */
  edit({ name = this.name, avatar, channel }, reason) {
    if (avatar && (typeof avatar === 'string' && !avatar.startsWith('data:'))) {
      return DataResolver.resolveImage(avatar).then(image => this.edit({ name, avatar: image }, reason));
    }
    if (channel) channel = this.client.channels.resolveID(channel);
    return this.client.api.webhooks(this.id, channel ? undefined : this.token).patch({
      data: { name, avatar, channel_id: channel },
      reason,
    }).then(data => {
      this.name = data.name;
      this.avatar = data.avatar;
      this.channelID = data.channel_id;
      return this;
    });
  }

  /**
   * Deletes the webhook.
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const TextBasedChannel = __webpack_require__(18);
const Role = __webpack_require__(20);
const Permissions = __webpack_require__(10);
const Collection = __webpack_require__(2);
const Base = __webpack_require__(7);
const { Presence } = __webpack_require__(11);
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
    if (data.joined_at) this.joinedTimestamp = new Date(data.joined_at).getTime();

    this.user = this.guild.client.users.add(data.user);
    if (data.roles) this._roles = data.roles;
  }

  get voiceState() {
    return this._frozenVoiceState || this.guild.voiceStates.get(this.id) || {};
  }

  /**
   * Whether this member is deafened server-wide
   * @type {boolean}
   * @readonly
   */
  get serverDeaf() { return this.voiceState.deaf; }

  /**
   * Whether this member is muted server-wide
   * @type {boolean}
   * @readonly
   */
  get serverMute() { return this.voiceState.mute; }

  /**
   * Whether this member is self-muted
   * @type {boolean}
   * @readonly
   */
  get selfMute() { return this.voiceState.self_mute; }

  /**
   * Whether this member is self-deafened
   * @type {boolean}
   * @readonly
   */
  get selfDeaf() { return this.voiceState.self_deaf; }

  /**
   * The voice session ID of this member (if any)
   * @type {?Snowflake}
   * @readonly
   */
  get voiceSessionID() { return this.voiceState.session_id; }

  /**
   * The voice channel ID of this member, (if any)
   * @type {?Snowflake}
   * @readonly
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
    return this.frozenPresence || this.guild.presences.get(this.id) || new Presence(this.client);
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
   * @param {Object} [options] Options
   * @param {boolean} [options.checkAdmin=true] Whether to allow the administrator permission to override
   * @param {boolean} [options.checkOwner=true] Whether to allow being the guild's owner to override
   * @returns {boolean}
   */
  hasPermission(permission, { checkAdmin = true, checkOwner = true } = {}) {
    if (checkOwner && this.user.id === this.guild.ownerID) return true;
    return this.roles.some(r => r.permissions.has(permission, checkAdmin));
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
   * Edits a guild member.
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
   * Mute/unmutes a user.
   * @param {boolean} mute Whether or not the member should be muted
   * @param {string} [reason] Reason for muting or unmuting
   * @returns {Promise<GuildMember>}
   */
  setMute(mute, reason) {
    return this.edit({ mute }, reason);
  }

  /**
   * Deafen/undeafens a user.
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
   * @example
   * // Set the member's roles to a single role
   * guildMember.setRoles(['391156570408615936'])
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Remove all the roles from a member
   * guildMember.setRoles([])
   *   .then(member => console.log(`Member roles is now of ${member.roles.size} size`))
   *   .catch(console.error);
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
   * Sets the nickname for the guild member.
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
   * Kicks this member from the guild.
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
   * Bans this guild member.
   * @param {Object} [options] Options for the ban
   * @param {number} [options.days=0] Number of days of messages to delete
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<GuildMember>}
   * @example
   * // ban a guild member
   * guildMember.ban({ days: 7, reason: 'They deserved it' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  ban(options) {
    return this.guild.members.ban(this, options);
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention instead of the GuildMember object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(13);
const Role = __webpack_require__(20);
const Invite = __webpack_require__(26);
const PermissionOverwrites = __webpack_require__(53);
const Util = __webpack_require__(5);
const Permissions = __webpack_require__(10);
const Collection = __webpack_require__(2);
const { MessageNotificationTypes } = __webpack_require__(0);
const { Error, TypeError } = __webpack_require__(4);

/**
 * Represents a guild channel (i.g. a {@link TextChannel}, {@link VoiceChannel} or {@link CategoryChannel}).
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
   * @param {PermissionOverwriteOptions} options The options for the update
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
   * @property {boolean} [nsfw] Whether the channel is NSFW
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
   * channel.edit({ name: 'new-channel' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async edit(data, reason) {
    if (typeof data.position !== 'undefined') {
      await Util.setPosition(this, data.position, false,
        this.guild._sortedChannels(this), this.client.api.guilds(this.guild.id).channels, reason)
        .then(updatedChannels => {
          this.client.actions.GuildChannelsPositionUpdate.handle({
            guild_id: this.guild.id,
            channels: updatedChannels,
          });
        });
    }
    return this.client.api.channels(this.id).patch({
      data: {
        name: (data.name || this.name).trim(),
        topic: data.topic,
        nsfw: data.nsfw,
        bitrate: data.bitrate || (this.bitrate ? this.bitrate * 1000 : undefined),
        user_limit: typeof data.userLimit !== 'undefined' ? data.userLimit : this.userLimit,
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
   * Sets a new name for the guild channel.
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
   * Sets the category parent of this channel.
   * @param {?GuildChannel|Snowflake} channel Parent channel
   * @param {Object} [options={}] Options to pass
   * @param {boolean} [options.lockPermissions=true] Lock the permissions to what the parent's permissions are
   * @param {string} [options.reason] Reason for modifying the parent of this channel
   * @returns {Promise<GuildChannel>}
   */
  setParent(channel, { lockPermissions = true, reason } = {}) {
    return this.edit({
      parentID: channel !== null ? channel.id ? channel.id : channel : null,
      lockPermissions,
    }, reason);
  }

  /**
   * Sets a new topic for the guild channel.
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
   * Sets a new position for the guild channel.
   * @param {number} position The new position for the guild channel
   * @param {Object} [options] Options for setting position
   * @param {boolean} [options.relative=false] Change the position relative to its current value
   * @param {boolean} [options.reason] Reason for changing the position
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
          guild_id: this.guild.id,
          channels: updatedChannels,
        });
        return this;
      });
  }

  /**
   * Creates an invite to this guild channel.
   * @param {Object} [options={}] Options for the invite
   * @param {boolean} [options.temporary=false] Whether members that joined via the invite should be automatically
   * kicked after 24 hours if they have not yet received a role
   * @param {number} [options.maxAge=86400] How long the invite should last (in seconds, 0 for forever)
   * @param {number} [options.maxUses=0] Maximum number of uses
   * @param {boolean} [options.unique=false] Create a unique invite, or use an existing one with similar settings
   * @param {string} [options.reason] Reason for creating this
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a channel
   * channel.createInvite()
   *   .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
   *   .catch(console.error);
   */
  createInvite({ temporary = false, maxAge = 86400, maxUses = 0, unique, reason } = {}) {
    return this.client.api.channels(this.id).invites.post({ data: {
      temporary, max_age: maxAge, max_uses: maxUses, unique,
    }, reason })
      .then(invite => new Invite(this.client, invite));
  }

  /**
   * Clones this channel.
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
    const options = { overwrites: withPermissions ? this.permissionOverwrites : [], reason, type: this.type };
    return this.guild.channels.create(name, options)
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
}

module.exports = GuildChannel;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const TextBasedChannel = __webpack_require__(18);
const { Presence } = __webpack_require__(11);
const UserProfile = __webpack_require__(103);
const Snowflake = __webpack_require__(9);
const Base = __webpack_require__(7);
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

    /**
     * Whether or not the user is a bot
     * @type {boolean}
     * @name User#bot
     */
    this.bot = Boolean(data.bot);

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
     * @type {?string}
     * @name User#avatar
     */
    if (typeof data.avatar !== 'undefined') this.avatar = data.avatar;

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
   * The time the user was created at
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
    return new Presence(this.client);
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
   * The Discord "tag" (e.g. `hydrabolt#0086`) for this user
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
   * Checks whether the user is typing in a channel.
   * @param {ChannelResolvable} channel The channel to check in
   * @returns {boolean}
   */
  typingIn(channel) {
    channel = this.client.channels.resolve(channel);
    return channel._typing.has(this.id);
  }

  /**
   * Gets the time that the user started typing.
   * @param {ChannelResolvable} channel The channel to get the time in
   * @returns {?Date}
   */
  typingSinceIn(channel) {
    channel = this.client.channels.resolve(channel);
    return channel._typing.has(this.id) ? new Date(channel._typing.get(this.id).since) : null;
  }

  /**
   * Gets the amount of time the user has been typing in a channel for (in milliseconds), or -1 if they're not typing.
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
   * Gets the profile of the user.
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
   * When concatenated with a string, this automatically returns the user's mention instead of the User object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const MessageCollector = __webpack_require__(47);
const Shared = __webpack_require__(25);
const Snowflake = __webpack_require__(9);
const Collection = __webpack_require__(2);
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
   * Sends a message to this channel.
   * @param {StringResolvable} [content] Text for the message
   * @param {MessageOptions|MessageEmbed|MessageAttachment|MessageAttachment[]} [options={}] Options for the message
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Sends a message
   * channel.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   */
  send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = null;
    } else if (!options) {
      options = {};
    }
    if (!options.content) options.content = content;

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
   * @param {number} [count=1] The number of times startTyping should be considered to have been called
   * @returns {Promise} Resolves once the bot stops typing gracefully, or rejects when an error occurs
   * @example
   * // Start typing in a channel, or increase the typing count by one
   * channel.startTyping();
   * @example
   * // Start typing in a channel with a typing count of five, or set it to five
   * channel.startTyping(5);
   */
  startTyping(count) {
    if (typeof count !== 'undefined' && count < 1) throw new RangeError('TYPING_COUNT');
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count = count || entry.count + 1;
      return entry.promise;
    }

    const entry = {};
    entry.promise = new Promise((resolve, reject) => {
      const endpoint = this.client.api.channels[this.id].typing;
      Object.assign(entry, {
        count: count || 1,
        interval: this.client.setInterval(() => {
          endpoint.post().catch(error => {
            this.client.clearInterval(entry.interval);
            this.client.user._typing.delete(this.id);
            reject(error);
          });
        }, 9000),
        resolve,
      });
      endpoint.post().catch(error => {
        this.client.clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
        reject(error);
      });
      this.client.user._typing.set(this.id, entry);
    });
    return entry.promise;
  }

  /**
   * Stops the typing indicator in the channel.
   * The indicator will only stop if this is called as many times as startTyping().
   * <info>It can take a few seconds for the client user to stop typing.</info>
   * @param {boolean} [force=false] Whether or not to reset the call count and force the indicator to stop
   * @example
   * // Reduce the typing count by one and stop typing if it reached 0
   * channel.stopTyping();
   * @example
   * // Force typing to fully stop regardless of typing count
   * channel.stopTyping(true);
   */
  stopTyping(force = false) {
    if (this.client.user._typing.has(this.id)) {
      const entry = this.client.user._typing.get(this.id);
      entry.count--;
      if (entry.count <= 0 || force) {
        this.client.clearInterval(entry.interval);
        this.client.user._typing.delete(this.id);
        entry.resolve();
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
   * const filter = m => m.content.includes('discord');
   * const collector = channel.createMessageCollector(filter, { time: 15000 });
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
   * Bulk deletes given messages that are newer than two weeks.
   * <warn>This is only available when using a bot account.</warn>
   * @param {Collection<Snowflake, Message>|Message[]|Snowflake[]|number} messages
   * Messages or number of messages to delete
   * @param {boolean} [filterOld=false] Filter messages to remove those which are older than two weeks automatically
   * @returns {Promise<Collection<Snowflake, Message>>} Deleted messages
   * @example
   * // Bulk delete messages
   * channel.bulkDelete(5)
   *   .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
   *   .catch(console.error);
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const Invite = __webpack_require__(26);
const GuildAuditLogs = __webpack_require__(48);
const Webhook = __webpack_require__(14);
const VoiceRegion = __webpack_require__(34);
const { ChannelTypes, Events, browser } = __webpack_require__(0);
const Collection = __webpack_require__(2);
const Util = __webpack_require__(5);
const DataResolver = __webpack_require__(8);
const Snowflake = __webpack_require__(9);
const Shared = __webpack_require__(25);
const GuildMemberStore = __webpack_require__(50);
const RoleStore = __webpack_require__(51);
const EmojiStore = __webpack_require__(35);
const GuildChannelStore = __webpack_require__(52);
const PresenceStore = __webpack_require__(37);
const Base = __webpack_require__(7);
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
     * An array of enabled guild features, here are the possible values:
     * * INVITE_SPLASH
     * * MORE_EMOJI
     * * VERIFIED
     * * VIP_REGIONS
     * * VANITY_URL
     * @typedef {string} Features
     */

    /**
     * An array of guild features partnered guilds have enabled
     * @type {Features[]}
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
      for (const guildUser of data.members) this.members.add(guildUser);
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
        this.client.channels.add(rawChannel, this);
      }
    }

    if (data.roles) {
      this.roles.clear();
      for (const role of data.roles) this.roles.add(role);
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this.presences.add(presence);
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
      if (data.emojis) for (const emoji of data.emojis) this.emojis.add(emoji);
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
   * The time the guild was created at
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
   * If this guild is verified
   * @type {boolean}
   * @readonly
   */
  get verified() {
    return this.features.includes('VERIFIED');
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
   * @type {?TextChannel}
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

  /**
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
   * An object containing information about a guild member's ban.
   * @typedef {Object} BanInfo
   * @property {User} user User that was banned
   * @property {?string} reason Reason the user was banned
   */

  /**
   * Fetches a collection of banned users in this guild.
   * @returns {Promise<Collection<Snowflake, BanInfo>>}
   */
  fetchBans() {
    return this.client.api.guilds(this.id).bans.get().then(bans =>
      bans.reduce((collection, ban) => {
        collection.set(ban.user.id, {
          reason: ban.reason,
          user: this.client.users.add(ban.user),
        });
        return collection;
      }, new Collection())
    );
  }

  /**
   * Fetches a collection of invites to this guild.
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
   * Fetches all webhooks for the guild.
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
   * Fetches available voice regions.
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
   * Fetches audit logs for this guild.
   * @param {Object} [options={}] Options for fetching audit logs
   * @param {Snowflake|GuildAuditLogsEntry} [options.before] Limit to entries from before specified entry
   * @param {Snowflake|GuildAuditLogsEntry} [options.after] Limit to entries from after specified entry
   * @param {number} [options.limit] Limit number of entries
   * @param {UserResolvable} [options.user] Only show entries involving this user
   * @param {AuditLogAction|number} [options.type] Only show entries involving this action type
   * @returns {Promise<GuildAuditLogs>}
   * @example
   * // Output audit log entries
   * guild.fetchAuditLogs()
   *   .then(audit => console.log(audit.entries))
   *   .catch(console.error);
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
    user = this.client.users.resolveID(user);
    if (!user) return Promise.reject(new TypeError('INVALID_TYPE', 'user', 'UserResolvable'));
    if (this.members.has(user)) return Promise.resolve(this.members.get(user));
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
    return this.client.api.guilds(this.id).members(user).put({ data: options })
      .then(data => this.members.add(data));
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
   * Edits the level of the explicit content filter.
   * @param {number} explicitContentFilter The new level of the explicit content filter
   * @param {string} [reason] Reason for changing the level of the guild's explicit content filter
   * @returns {Promise<Guild>}
   */
  setExplicitContentFilter(explicitContentFilter, reason) {
    return this.edit({ explicitContentFilter }, reason);
  }

  /**
   * Edits the name of the guild.
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
   * Edits the region of the guild.
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
   * Edits the verification level of the guild.
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
   * Edits the AFK channel of the guild.
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
   * Edits the system channel of the guild.
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
   * Edits the AFK timeout of the guild.
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
   * Sets a new guild icon.
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
   * Sets a new guild splash screen.
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
   * Whether to allow direct messages from guild members.
   * <warn>This is only available when using a user account.</warn>
   * @param {boolean} allow Whether to allow direct messages
   * @returns {Promise<Guild>}
   */
  allowDMs(allow) {
    if (this.client.user.bot) return Promise.reject(new Error('FEATURE_USER_ONLY'));
    const settings = this.client.user.settings;
    if (allow) return settings.removeRestrictedGuild(this);
    else return settings.addRestrictedGuild(this);
  }

  /**
   * Syncs this guild (already done automatically every 30 seconds).
   * <warn>This is only available when using a user account.</warn>
   */
  sync() {
    if (!this.client.user.bot) this.client.syncGuilds([this]);
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
   * Leaves the guild.
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
   * Deletes the guild.
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
   * When concatenated with a string, this automatically returns the guild's name instead of the Guild object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Guild!
   * console.log(`Hello from ${guild}!`);
   */
  toString() {
    return this.name;
  }

  /**
   * Creates a collection of this guild's roles, sorted by their position and IDs.
   * @returns {Collection<Role>}
   * @private
   */
  _sortedRoles() {
    return Util.discordSort(this.roles);
  }

  /**
   * Creates a collection of this guild's or a specific category's channels, sorted by their position and IDs.
   * @param {GuildChannel} [channel] Category to get the channels of
   * @returns {Collection<GuildChannel>}
   * @private
   */
  _sortedChannels(channel) {
    const category = channel.type === ChannelTypes.CATEGORY;
    return Util.discordSort(this.channels.filter(c =>
      c.type === channel.type && (category || c.parent === channel.parent)
    ));
  }

  /**
   * Handles a user speaking update in a voice channel.
   * @param {Snowflake} user ID of the user that the update is for
   * @param {boolean} speaking Whether the user is speaking
   * @private
   */
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
}

// TODO: Document this thing
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(9);
const Permissions = __webpack_require__(10);
const Util = __webpack_require__(5);
const Base = __webpack_require__(7);
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
   * The time the role was created at
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
  async edit(data, reason) {
    if (data.permissions) data.permissions = Permissions.resolve(data.permissions);
    else data.permissions = this.permissions.bitfield;
    if (typeof data.position !== 'undefined') {
      await Util.setPosition(this, data.position, false, this.guild._sortedRoles(),
        this.client.api.guilds(this.guild.id).roles, reason)
        .then(updatedRoles => {
          this.client.actions.GuildRolesPositionUpdate.handle({
            guild_id: this.guild.id,
            roles: updatedRoles,
          });
        });
    }
    return this.client.api.guilds[this.guild.id].roles[this.id].patch({
      data: {
        name: data.name || this.name,
        color: Util.resolveColor(data.color || this.color),
        hoist: typeof data.hoist !== 'undefined' ? data.hoist : this.hoist,
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
   * Sets a new name for the role.
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
   * Sets a new color for the role.
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
   * Sets whether or not the role should be hoisted.
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
   * Sets the permissions of the role.
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
   * Sets whether this role is mentionable.
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
   * Sets the position of the role.
   * @param {number} position The position of the role
   * @param {Object} [options] Options for setting position
   * @param {boolean} [options.relative=false] Change the position relative to its current value
   * @param {boolean} [options.reason] Reason for changing the position
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
          guild_id: this.guild.id,
          roles: updatedRoles,
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
   * When concatenated with a string, this automatically returns the role's mention instead of the Role object.
   * @returns {string}
   * @example
   * // Logs: Role: <@&123456789012345678>
   * console.log(`Role: ${role}`);
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Collection = __webpack_require__(2);
const Message = __webpack_require__(29);
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

  add(data, cache) {
    return super.add(data, cache, { extras: [this.channel] });
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
      for (const message of data) messages.set(message.id, this.add(message));
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
      .then(data => this.add(data));
  }

  _fetchMany(options = {}) {
    return this.client.api.channels[this.channel.id].messages.get({ query: options })
      .then(data => {
        const messages = new Collection();
        for (const message of data) messages.set(message.id, this.add(message));
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
    * @returns {?Snowflake}
    */
}

module.exports = MessageStore;


/***/ }),
/* 22 */
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Allows for the extension of built-in Discord.js structures that are instantiated by {@link DataStore DataStores}.
 */
class Structures {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Retrieves a structure class.
   * @param {string} structure Name of the structure to retrieve
   * @returns {Function}
   */
  static get(structure) {
    if (typeof structure === 'string') return structures[structure];
    throw new TypeError(`"structure" argument must be a string (received ${typeof structure})`);
  }

  /**
   * Extends a structure.
   * @param {string} structure Name of the structure class to extend
   * @param {Function} extender Function that takes the base class to extend as its only parameter and returns the
   * extended class/prototype
   * @returns {Function} Extended class/prototype returned from the extender
   * @example
   * const { Structures } = require('discord.js');
   *
   * Structures.extend('Guild', Guild => {
   *   class CoolGuild extends Guild {
   *     constructor(client, data) {
   *       super(client, data);
   *       this.cool = true;
   *     }
   *   }
   *
   *   return CoolGuild;
   * });
   */
  static extend(structure, extender) {
    if (!structures[structure]) throw new RangeError(`"${structure}" is not a valid extensible structure.`);
    if (typeof extender !== 'function') {
      const received = `(received ${typeof extender})`;
      throw new TypeError(
        `"extender" argument must be a function that returns the extended structure class/prototype ${received}`
      );
    }

    const extended = extender(structures[structure]);
    if (typeof extended !== 'function') {
      throw new TypeError('The extender function must return the extended structure class/prototype.');
    }
    if (Object.getPrototypeOf(extended) !== structures[structure]) {
      throw new Error(
        'The class/prototype returned from the extender function must extend the existing structure class/prototype.'
      );
    }

    structures[structure] = extended;
    return extended;
  }
}

const structures = {
  Emoji: __webpack_require__(24),
  DMChannel: __webpack_require__(46),
  GroupDMChannel: __webpack_require__(60),
  TextChannel: __webpack_require__(61),
  VoiceChannel: __webpack_require__(62),
  CategoryChannel: __webpack_require__(63),
  GuildChannel: __webpack_require__(16),
  GuildMember: __webpack_require__(15),
  Guild: __webpack_require__(19),
  Message: __webpack_require__(29),
  MessageReaction: __webpack_require__(39),
  Presence: __webpack_require__(11).Presence,
  Role: __webpack_require__(20),
  User: __webpack_require__(17),
};

module.exports = Structures;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(2);
const Snowflake = __webpack_require__(9);
const Base = __webpack_require__(7);
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

    /**
     * Whether this emoji is animated
     * @type {boolean}
     */
    this.animated = data.animated;

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
   * The time the emoji was created at
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
    return this.client.rest.cdn.Emoji(this.id, this.animated ? 'gif' : 'png');
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
   * Sets the name of the emoji.
   * @param {string} name The new name for the emoji
   * @param {string} [reason] Reason for changing the emoji's name
   * @returns {Promise<Emoji>}
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Adds a role to the list of roles that can use this emoji.
   * @param {Role} role The role to add
   * @returns {Promise<Emoji>}
   */
  addRestrictedRole(role) {
    return this.addRestrictedRoles([role]);
  }

  /**
   * Adds multiple roles to the list of roles that can use this emoji.
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
   * Removes a role from the list of roles that can use this emoji.
   * @param {Role} role The role to remove
   * @returns {Promise<Emoji>}
   */
  removeRestrictedRole(role) {
    return this.removeRestrictedRoles([role]);
  }

  /**
   * Removes multiple roles from the list of roles that can use this emoji.
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
   * When concatenated with a string, this automatically concatenates the emoji's mention instead of the Emoji object.
   * @returns {string}
   * @example
   * // Send an emoji:
   * const emoji = guild.emojis.first();
   * msg.reply(`Hello! ${emoji}`);
   */
  toString() {
    if (!this.id || !this.requiresColons) {
      return this.name;
    }

    return `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>`;
  }

  /**
   * Deletes the emoji.
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  search: __webpack_require__(101),
  sendMessage: __webpack_require__(102),
  createMessage: __webpack_require__(54),
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const { Endpoints } = __webpack_require__(0);
const Base = __webpack_require__(7);

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
    this.guild = this.client.guilds.add(data.guild, false);

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
      this.inviter = this.client.users.add(data.inviter);
    }

    /**
     * The channel the invite is for
     * @type {GuildChannel}
     */
    this.channel = this.client.channels.add(data.channel, this.guild, false);

    /**
     * The timestamp the invite was created at
     * @type {number}
     */
    this.createdTimestamp = new Date(data.created_at).getTime();
  }

  /**
   * The time the invite was created at
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
   * The time the invite will expire at
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

const MessageAttachment = __webpack_require__(28);
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

    if (data.files) {
      /**
       * The files of this embed
       * @type {?Object}
       * @property {Array<FileOptions|string|MessageAttachment>} files Files to attach
       */
      this.files = data.files.map(file => {
        if (file instanceof MessageAttachment) {
          return typeof file.file === 'string' ? file.file : Util.cloneObject(file.file);
        }
        return file;
      });
    }
  }

  /**
   * The date this embed was created at
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.timestamp ? new Date(this.timestamp) : null;
  }

  /**
   * The hexadecimal version of the embed color, with a leading hash
   * @type {?string}
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
   * Sets the image of this embed.
   * @param {string} url The URL of the image
   * @returns {MessageEmbed}
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Sets the thumbnail of this embed.
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
/* 28 */
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
    * Sets the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
    * @param {string} name The name of the file
    * @returns {MessageAttachment} This attachment
    */
  setAttachment(file, name) {
    this.file = { attachment: file, name };
    return this;
  }

  /**
    * Sets the file of this attachment.
    * @param {BufferResolvable|Stream} attachment The file
    * @returns {MessageAttachment} This attachment
    */
  setFile(attachment) {
    this.file = { attachment };
    return this;
  }

  /**
    * Sets the name of this attachment.
    * @param {string} name The name of the image
    * @returns {MessageAttachment} This attachment
    */
  setName(name) {
    this.file.name = name;
    return this;
  }

  /**
    * Sets the file of this attachment.
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const Mentions = __webpack_require__(57);
const MessageAttachment = __webpack_require__(28);
const Embed = __webpack_require__(27);
const ReactionCollector = __webpack_require__(58);
const ClientApplication = __webpack_require__(38);
const Util = __webpack_require__(5);
const Collection = __webpack_require__(2);
const ReactionStore = __webpack_require__(104);
const { MessageTypes } = __webpack_require__(0);
const Permissions = __webpack_require__(10);
const Base = __webpack_require__(7);
const { Error, TypeError } = __webpack_require__(4);
const { createMessage } = __webpack_require__(25);

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
    this.author = this.client.users.add(data.author, !data.webhook_id);

    /**
     * Represents the author of the message as a guild member.
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
        this.reactions.add(reaction);
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
   * The time the message was sent at
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
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someID';
   * const collector = message.createReactionCollector(filter, { time: 15000 });
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
   * Similar to createReactionCollector but in promise form.
   * Resolves with a collection of reactions that pass the specified filter.
   * @param {CollectorFilter} filter The filter function to use
   * @param {AwaitReactionsOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<string, MessageReaction>>}
   * @example
   * // Create a reaction collector
   * const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === 'someID'
   * message.awaitReactions(filter, { time: 15000 })
   *   .then(collected => console.log(`Collected ${collected.size} reactions`))
   *   .catch(console.error);
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
   * Edits the content of the message.
   * @param {StringResolvable} [content] The new content for the message
   * @param {MessageEditOptions|MessageEmbed} [options] The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Update the content of a message
   * message.edit('This is my new content!')
   *   .then(msg => console.log(`Updated the content of a message from ${msg.author}`))
   *   .catch(console.error);
   */
  async edit(content, options) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = null;
    } else if (!options) {
      options = {};
    }
    if (!options.content) options.content = content;

    const { data } = await createMessage(this, options);

    return this.client.api.channels[this.channel.id].messages[this.id]
      .patch({ data })
      .then(d => {
        const clone = this._clone();
        clone._patch(d);
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
   * Adds a reaction to the message.
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
   * Replies to the message.
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
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delete", function() { return _delete; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_js__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__index_js__);


/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__index_js___default.a);

const version = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.version;
/* harmony export (immutable) */ __webpack_exports__["version"] = version;

const METHODS = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.METHODS;
/* harmony export (immutable) */ __webpack_exports__["METHODS"] = METHODS;


const acl = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.acl;
/* harmony export (immutable) */ __webpack_exports__["acl"] = acl;

const bind = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.bind;
/* harmony export (immutable) */ __webpack_exports__["bind"] = bind;

const checkout = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.checkout;
/* harmony export (immutable) */ __webpack_exports__["checkout"] = checkout;

const connect = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.connect;
/* harmony export (immutable) */ __webpack_exports__["connect"] = connect;

const copy = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.copy;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;

const _delete = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.delete;

const get = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.get;
/* harmony export (immutable) */ __webpack_exports__["get"] = get;

const head = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.head;
/* harmony export (immutable) */ __webpack_exports__["head"] = head;

const link = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.link;
/* harmony export (immutable) */ __webpack_exports__["link"] = link;

const lock = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.lock;
/* harmony export (immutable) */ __webpack_exports__["lock"] = lock;

const merge = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.merge;
/* harmony export (immutable) */ __webpack_exports__["merge"] = merge;

const mkactivity = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.mkactivity;
/* harmony export (immutable) */ __webpack_exports__["mkactivity"] = mkactivity;

const mkcalendar = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.mkcalendar;
/* harmony export (immutable) */ __webpack_exports__["mkcalendar"] = mkcalendar;

const mkcol = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.mkcol;
/* harmony export (immutable) */ __webpack_exports__["mkcol"] = mkcol;

const move = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.move;
/* harmony export (immutable) */ __webpack_exports__["move"] = move;

const notify = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.notify;
/* harmony export (immutable) */ __webpack_exports__["notify"] = notify;

const options = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.options;
/* harmony export (immutable) */ __webpack_exports__["options"] = options;

const patch = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.patch;
/* harmony export (immutable) */ __webpack_exports__["patch"] = patch;

const post = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.post;
/* harmony export (immutable) */ __webpack_exports__["post"] = post;

const propfind = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.propfind;
/* harmony export (immutable) */ __webpack_exports__["propfind"] = propfind;

const proppatch = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.proppatch;
/* harmony export (immutable) */ __webpack_exports__["proppatch"] = proppatch;

const purge = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.purge;
/* harmony export (immutable) */ __webpack_exports__["purge"] = purge;

const put = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.put;
/* harmony export (immutable) */ __webpack_exports__["put"] = put;

const rebind = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.rebind;
/* harmony export (immutable) */ __webpack_exports__["rebind"] = rebind;

const report = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.report;
/* harmony export (immutable) */ __webpack_exports__["report"] = report;

const search = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.search;
/* harmony export (immutable) */ __webpack_exports__["search"] = search;

const subscribe = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.subscribe;
/* harmony export (immutable) */ __webpack_exports__["subscribe"] = subscribe;

const trace = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.trace;
/* harmony export (immutable) */ __webpack_exports__["trace"] = trace;

const unbind = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.unbind;
/* harmony export (immutable) */ __webpack_exports__["unbind"] = unbind;

const unlink = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.unlink;
/* harmony export (immutable) */ __webpack_exports__["unlink"] = unlink;

const unlock = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.unlock;
/* harmony export (immutable) */ __webpack_exports__["unlock"] = unlock;

const unsubscribe = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.unsubscribe;
/* harmony export (immutable) */ __webpack_exports__["unsubscribe"] = unsubscribe;

const brew = __WEBPACK_IMPORTED_MODULE_0__index_js___default.a.brew;
/* harmony export (immutable) */ __webpack_exports__["brew"] = brew;



/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(80);
exports.encode = exports.stringify = __webpack_require__(81);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(22);
const RESTManager = __webpack_require__(86);
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
   * @readonly
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(2);
const EventEmitter = __webpack_require__(22);

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
     * The client that instantiated this Collector
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

    if (collect && this.filter(...args, this.collected)) {
      this.collected.set(collect.key, collect.value);

      /**
       * Emitted whenever an element is collected.
       * @event Collector#collect
       * @param {*} element The element that got collected
       * @param {...*} args The arguments emitted by the listener
       */
      this.emit('collect', collect.value, ...args);
    }
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
   * Returns a promise that resolves with the next collected element;
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
   * Stops this collector and emits the `end` event.
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
   * Checks whether the collector should end, and if so, ends it.
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
/* 34 */
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(2);
const DataStore = __webpack_require__(6);
const Emoji = __webpack_require__(24);
const ReactionEmoji = __webpack_require__(36);
const DataResolver = __webpack_require__(8);

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

  add(data, cache) {
    return super.add(data, cache, { extras: [this.guild] });
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
   * guild.emojis.create('https://i.imgur.com/w3duR07.png', 'rip')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   * @example
   * // Create a new emoji from a file on your computer
   * guild.emojis.create('./memes/banana.png', 'banana')
   *   .then(emoji => console.log(`Created new emoji with name ${emoji.name}!`))
   *   .catch(console.error);
   */
  create(attachment, name, { roles, reason } = {}) {
    if (typeof attachment === 'string' && attachment.startsWith('data:')) {
      const data = { image: attachment, name };
      if (roles) {
        data.roles = [];
        for (let role of roles instanceof Collection ? roles.values() : roles) {
          role = this.guild.roles.resolve(role);
          if (!role) {
            return Promise.reject(new TypeError('INVALID_TYPE', 'options.roles',
              'Array or Collection of Roles or Snowflakes', true));
          }
          data.roles.push(role.id);
        }
      }

      return this.client.api.guilds(this.guild.id).emojis.post({ data, reason })
        .then(emoji => this.client.actions.GuildEmojiCreate.handle(this.guild, emoji).emoji);
    }

    return DataResolver.resolveImage(attachment).then(image => this.create(image, name, { roles, reason }));
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
   * @returns {?Snowflake}
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
/* 36 */
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
   * When concatenated with a string, this automatically returns the text required to form a graphical emoji on Discord
   * instead of the ReactionEmoji object.
   * @returns {string}
   * @example
   * // Send the emoji used in a reaction to the channel the reaction is part of
   * reaction.message.channel.send(`The emoji used was: ${reaction.emoji}`);
   */
  toString() {
    return this.id ? `<:${this.name}:${this.id}>` : this.name;
  }
}

module.exports = ReactionEmoji;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const { Presence } = __webpack_require__(11);

/**
 * Stores presences.
 * @private
 * @extends {DataStore}
 */
class PresenceStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Presence);
  }

  add(data, cache) {
    const existing = this.get(data.user.id);
    return existing ? existing.patch(data) : super.add(data, cache, { id: data.user.id });
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
    * @returns {?Snowflake}
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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const Snowflake = __webpack_require__(9);
const { ClientApplicationAssetTypes, Endpoints } = __webpack_require__(0);
const DataResolver = __webpack_require__(8);
const Base = __webpack_require__(7);

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
      this.owner = this.client.users.add(data.owner);
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
   * The time the app was created at
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
    const types = Object.keys(ClientApplicationAssetTypes);
    return this.client.api.oauth2.applications(this.id).assets.get()
      .then(assets => assets.map(a => ({
        id: a.id,
        name: a.name,
        type: types[a.type - 1],
      })));
  }

  /**
   * Creates a rich presence asset.
   * @param {string} name Name of the asset
   * @param {Base64Resolvable} data Data of the asset
   * @param {string} type Type of the asset. `big`, or `small`
   * @returns {Promise}
   */
  createAsset(name, data, type) {
    return DataResolver.resolveBase64(data).then(b64 =>
      this.client.api.oauth2.applications(this.id).assets.post({ data: {
        name,
        data: b64,
        type: ClientApplicationAssetTypes[type.toUpperCase()],
      } }));
  }

  /**
   * Resets the app's secret.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<ClientApplication>}
   */
  resetSecret() {
    return this.client.api.oauth2.applications[this.id].reset.post()
      .then(app => new ClientApplication(this.client, app));
  }

  /**
   * Resets the app's bot token.
   * <warn>This is only available when using a user account.</warn>
   * @returns {Promise<ClientApplication>}
   */
  resetToken() {
    return this.client.api.oauth2.applications[this.id].bot.reset.post()
      .then(app => new ClientApplication(this.client, Object.assign({}, this, { bot: app })));
  }

  /**
   * When concatenated with a string, this automatically returns the application's name instead of the
   * ClientApplication object.
   * @returns {string}
   * @example
   * // Logs: Application name: My App
   * console.log(`Application name: ${application}`);
   */
  toString() {
    return this.name;
  }
}

module.exports = ClientApplication;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const Emoji = __webpack_require__(24);
const ReactionEmoji = __webpack_require__(36);
const ReactionUserStore = __webpack_require__(59);

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
     * @type {ReactionUserStore<Snowflake, User>}
     */
    this.users = new ReactionUserStore(client, undefined, this);

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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const { UserGuildSettingsMap } = __webpack_require__(0);
const Collection = __webpack_require__(2);
const ClientUserChannelOverride = __webpack_require__(65);

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
     * The ID of the guild these settings are for
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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = ({"version":"12.0.0-dev","homepage":"https://github.com/hydrabolt/discord.js#readme"})

/***/ }),
/* 43 */
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
/* 44 */
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

const Structures = __webpack_require__(23);
const Collection = __webpack_require__(2);
const ClientUserSettings = __webpack_require__(64);
const ClientUserGuildSettings = __webpack_require__(40);
const Util = __webpack_require__(5);
const DataResolver = __webpack_require__(8);
const Guild = __webpack_require__(19);

/**
 * Represents the logged in client's Discord user.
 * @extends {User}
 */
class ClientUser extends Structures.get('User') {
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

    if (data.token) this.client.token = data.token;
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
   * Sets the username of the logged in client.
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
   * Sets the avatar of the logged in client.
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
   * @param {Object} [options={}] Options for the fetch
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
      .then(data => data.map(m => this.client.channels.get(m.channel_id).messages.add(m, false)));
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
      .then(res => this.client.channels.add(res));
  }
}

module.exports = ClientUser;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(13);
const TextBasedChannel = __webpack_require__(18);
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
    this.recipient = this.client.users.add(data.recipients[0]);

    this.lastMessageID = data.last_message_id;
  }

  /**
   * When concatenated with a string, this automatically returns the recipient's mention instead of the
   * DMChannel object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
   * console.log(`Hello from ${channel}!`);
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

const Collector = __webpack_require__(33);
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
   * Handles a message for possible collection.
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
   * Handles a message for possible disposal.
   * @param {Message} message The message that could be disposed
   * @returns {?string}
   */
  dispose(message) {
    return message.channel.id === this.channel.id ? message.id : null;
  }

  /**
   * Checks after un/collection to see if the collector is done.
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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(2);
const Snowflake = __webpack_require__(9);
const Webhook = __webpack_require__(14);

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
 * @typedef {string} AuditLogTargetType
 */

/**
 * Key mirror of all available audit log targets.
 * @name GuildAuditLogs.Targets
 * @type {AuditLogTargetType}
 */
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

/**
 * The action of an entry. Here are the available actions:
 * * ALL: null
 * * GUILD_UPDATE: 1
 * * CHANNEL_CREATE: 10
 * * CHANNEL_UPDATE: 11
 * * CHANNEL_DELETE: 12
 * * CHANNEL_OVERWRITE_CREATE: 13
 * * CHANNEL_OVERWRITE_UPDATE: 14
 * * CHANNEL_OVERWRITE_DELETE: 15
 * * MEMBER_KICK: 20
 * * MEMBER_PRUNE: 21
 * * MEMBER_BAN_ADD: 22
 * * MEMBER_BAN_REMOVE: 23
 * * MEMBER_UPDATE: 24
 * * MEMBER_ROLE_UPDATE: 25
 * * ROLE_CREATE: 30
 * * ROLE_UPDATE: 31
 * * ROLE_DELETE: 32
 * * INVITE_CREATE: 40
 * * INVITE_UPDATE: 41
 * * INVITE_DELETE: 42
 * * WEBHOOK_CREATE: 50
 * * WEBHOOK_UPDATE: 51
 * * WEBHOOK_DELETE: 50
 * * EMOJI_CREATE: 60
 * * EMOJI_UPDATE: 61
 * * EMOJI_DELETE: 62
 * * MESSAGE_DELETE: 72
 * @typedef {?number|string} AuditLogAction
 */

/**
 * All available actions keyed under their names to their numeric values.
 * @name GuildAuditLogs.Actions
 * @type {AuditLogAction}
 */
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
    if (data.users) for (const user of data.users) guild.client.users.add(user);
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
      const entry = new GuildAuditLogsEntry(this, guild, item);
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
   * The target of an entry. It can be one of:
   * * A guild
   * * A user
   * * A role
   * * An emoji
   * * An invite
   * * A webhook
   * * An object where the keys represent either the new value or the old value
   * @typedef {?Object|Guild|User|Role|Emoji|Invite|Webhook} AuditLogEntryTarget
   */

  /**
   * Finds the target type from the entry action.
   * @param {AuditLogAction} target The action target
   * @returns {AuditLogTargetType}
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
   * * ALL
   * @typedef {string} AuditLogActionType
   */

  /**
   * Finds the action type from the entry action.
   * @param {AuditLogAction} action The action target
   * @returns {AuditLogActionType}
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
  constructor(logs, guild, data) {
    const targetType = GuildAuditLogs.targetType(data.action_type);
    /**
     * The target type of this entry
     * @type {AuditLogTargetType}
     */
    this.targetType = targetType;

    /**
     * The action type of this entry
     * @type {AuditLogActionType}
     */
    this.actionType = GuildAuditLogs.actionType(data.action_type);

    /**
     * Specific action type of this entry in its string presentation
     * @type {AuditLogAction}
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
       * @type {AuditLogEntryTarget}
       */
      this.target = this.changes.reduce((o, c) => {
        o[c.key] = c.new || c.old;
        return o;
      }, {});
      this.target.id = data.target_id;
    } else if ([Targets.USER, Targets.GUILD].includes(targetType)) {
      this.target = guild.client[`${targetType.toLowerCase()}s`].get(data.target_id);
    } else if (targetType === Targets.WEBHOOK) {
      this.target = logs.webhooks.get(data.target_id) ||
        new Webhook(guild.client,
          this.changes.reduce((o, c) => {
            o[c.key] = c.new || c.old;
            return o;
          }, {
            id: data.target_id,
            guild_id: guild.id,
          }));
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
   * The time this entry was created at
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
/* 49 */
/***/ (function(module, exports) {



/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const GuildMember = __webpack_require__(15);
const { Events, OPCodes } = __webpack_require__(0);
const Collection = __webpack_require__(2);
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

  add(data, cache) {
    return super.add(data, cache, { extras: [this.guild] });
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
   * @returns {?Snowflake}
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
   * Fetches member(s) from Discord, even if they're offline.
   * @param {UserResolvable|FetchMemberOptions|FetchMembersOptions} [options] If a UserResolvable, the user to fetch.
   * If undefined, fetches all members.
   * If a query, it limits the results to users with similar usernames.
   * @returns {Promise<GuildMember>|Promise<Collection<Snowflake, GuildMember>>}
   * @example
   * // Fetch all members from a guild
   * guild.members.fetch()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch a single member
   * guild.members.fetch('66564597481480192')
   *   .then(console.log)
   *   .catch(console.error);
   * guild.members.fetch({ user, cache: false }) // Fetch and don't cache
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Fetch by query
   * guild.members.fetch({ query: 'hydra' })
   *   .then(console.log)
   *   .catch(console.error);
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

  /**
   * Prunes members from the guild based on how long they have been inactive.
   * @param {Object} [options] Prune options
   * @param {number} [options.days=7] Number of days of inactivity required to kick
   * @param {boolean} [options.dry=false] Get number of users that will be kicked, without actually kicking them
   * @param {string} [options.reason] Reason for this prune
   * @returns {Promise<number>} The number of members that were/will be kicked
   * @example
   * // See how many members will be pruned
   * guild.members.prune({ dry: true })
   *   .then(pruned => console.log(`This will prune ${pruned} people!`))
   *   .catch(console.error);
   * @example
   * // Actually prune the members
   * guild.members.prune({ days: 1, reason: 'too many people!' })
   *   .then(pruned => console.log(`I just pruned ${pruned} people!`))
   *   .catch(console.error);
   */
  prune({ days = 7, dry = false, reason } = {}) {
    if (typeof days !== 'number') throw new TypeError('PRUNE_DAYS_TYPE');
    return this.client.api.guilds(this.guild.id).prune[dry ? 'get' : 'post']({ query: { days }, reason })
      .then(data => data.pruned);
  }

  /**
   * Bans a user from the guild.
   * @param {UserResolvable} user The user to ban
   * @param {Object} [options] Options for the ban
   * @param {number} [options.days=0] Number of days of messages to delete
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<GuildMember|User|Snowflake>} Result object will be resolved as specifically as possible.
   * If the GuildMember cannot be resolved, the User will instead be attempted to be resolved. If that also cannot
   * be resolved, the user ID will be the result.
   * @example
   * // Ban a user by ID (or with a user/guild member object)
   * guild.members.ban('84484653687267328')
   *   .then(user => console.log(`Banned ${user.username || user.id || user} from ${guild.name}`))
   *   .catch(console.error);
   */
  ban(user, options = { days: 0 }) {
    if (options.days) options['delete-message-days'] = options.days;
    const id = this.client.users.resolveID(user);
    if (!id) return Promise.reject(new Error('BAN_RESOLVE_ID', true));
    return this.client.api.guilds(this.guild.id).bans[id].put({ query: options })
      .then(() => {
        if (user instanceof GuildMember) return user;
        const _user = this.client.users.resolve(id);
        if (_user) {
          const member = this.resolve(_user);
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
   * guild.members.unban('84484653687267328')
   *   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
   *   .catch(console.error);
   */
  unban(user, reason) {
    const id = this.client.users.resolveID(user);
    if (!id) throw new Error('BAN_RESOLVE_ID');
    return this.client.api.guilds(this.guild.id).bans[id].delete({ reason })
      .then(() => user);
  }


  _fetchSingle({ user, cache }) {
    const existing = this.get(user);
    if (existing) return Promise.resolve(existing);
    return this.client.api.guilds(this.guild.id).members(user).get()
      .then(data => this.add(data, cache));
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Role = __webpack_require__(20);
const { resolveColor } = __webpack_require__(5);
const Permissions = __webpack_require__(10);

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

  add(data, cache) {
    return super.add(data, cache, { extras: [this.guild] });
  }

  /**
   * Creates a new role in the guild with given information.
   * <warn>The position will silently reset to 1 if an invalid one is provided, or none.</warn>
   * @param {RoleData} [data] The data to update the role with
   * @param {string} [reason] Reason for creating this role
   * @returns {Promise<Role>}
   * @example
   * // Create a new role
   * guild.roles.create()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create a new role with data and a reason
   * guild.roles.create({
   *     name: 'Super Cool People',
   *     color: 'BLUE'
   *   },
   *   reason: 'we needed a role for Super Cool People',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  create(data = {}, reason) {
    if (data.color) data.color = resolveColor(data.color);
    if (data.permissions) data.permissions = Permissions.resolve(data.permissions);

    return this.guild.client.api.guilds(this.guild.id).roles.post({ data, reason }).then(r => {
      const { role } = this.client.actions.GuildRoleCreate.handle({
        guild_id: this.guild.id,
        role: r,
      });
      if (data.position) return role.setPosition(data.position, reason);
      return role;
    });
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
    * @returns {?Snowflake}
    */
}

module.exports = RoleStore;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(2);
const Channel = __webpack_require__(13);
const { ChannelTypes } = __webpack_require__(0);
const DataStore = __webpack_require__(6);
const GuildChannel = __webpack_require__(16);
const Permissions = __webpack_require__(10);

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

  add(data) {
    const existing = this.get(data.id);
    if (existing) return existing;

    return Channel.create(this.client, data, this.guild);
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
   * @param {Object} [options] Options
   * @param {string} [options.type='text'] The type of the new channel, either `text`, `voice`, or `category`
   * @param {boolean} [options.nsfw] Whether the new channel is nsfw
   * @param {number} [options.bitrate] Bitrate of the new channel in bits (only voice)
   * @param {number} [options.userLimit] Maximum amount of users allowed in the new channel (only voice)
   * @param {ChannelResolvable} [options.parent] Parent of the new channel
   * @param {Array<PermissionOverwrites|ChannelCreationOverwrites>} [options.overwrites] Permission overwrites
   * @param {string} [options.reason] Reason for creating the channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create a new text channel
   * guild.channels.create('new-general', { reason: 'Needed a cool new channel' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  create(name, { type, nsfw, bitrate, userLimit, parent, overwrites, reason } = {}) {
    if (overwrites instanceof Collection || overwrites instanceof Array) {
      overwrites = overwrites.map(overwrite => {
        let allow = overwrite.allow || (overwrite.allowed ? overwrite.allowed.bitfield : 0);
        let deny = overwrite.deny || (overwrite.denied ? overwrite.denied.bitfield : 0);
        if (allow instanceof Array) allow = Permissions.resolve(allow);
        if (deny instanceof Array) deny = Permissions.resolve(deny);

        const role = this.guild.roles.resolve(overwrite.id);
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
    return this.client.api.guilds(this.guild.id).channels.post({
      data: {
        name,
        type: type ? ChannelTypes[type.toUpperCase()] : 'text',
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
   * @returns {?Snowflake}
   */
}

module.exports = GuildChannelStore;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

const Permissions = __webpack_require__(10);

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
   * Deletes this Permission Overwrite.
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
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

const Embed = __webpack_require__(27);
const DataResolver = __webpack_require__(8);
const MessageEmbed = __webpack_require__(27);
const MessageAttachment = __webpack_require__(28);
const { browser } = __webpack_require__(0);
const Util = __webpack_require__(5);

// eslint-disable-next-line complexity
module.exports = async function createMessage(channel, options) {
  const User = __webpack_require__(17);
  const GuildMember = __webpack_require__(15);
  const Webhook = __webpack_require__(14);
  const WebhookClient = __webpack_require__(56);

  const webhook = channel instanceof Webhook || channel instanceof WebhookClient;

  if (typeof options.nonce !== 'undefined') {
    options.nonce = parseInt(options.nonce);
    if (isNaN(options.nonce) || options.nonce < 0) throw new RangeError('MESSAGE_NONCE_TYPE');
  }

  let { content } = options;
  if (options instanceof MessageEmbed) options = webhook ? { embeds: [options] } : { embed: options };
  if (options instanceof MessageAttachment) options = { files: [options.file] };

  if (content instanceof Array || options instanceof Array) {
    const which = content instanceof Array ? content : options;
    const attachments = which.filter(item => item instanceof MessageAttachment);
    const embeds = which.filter(item => item instanceof MessageEmbed);
    if (attachments.length) options = { files: attachments };
    if (embeds.length) options = { embeds };
    if ((embeds.length || attachments.length) && content instanceof Array) {
      content = null;
      options.content = '';
    }
  }

  if (options.reply && !(channel instanceof User || channel instanceof GuildMember) && channel.type !== 'dm') {
    const id = channel.client.users.resolveID(options.reply);
    const mention = `<@${options.reply instanceof GuildMember && options.reply.nickname ? '!' : ''}${id}>`;
    if (options.split) options.split.prepend = `${mention}, ${options.split.prepend || ''}`;
    content = `${mention}${typeof options.content !== 'undefined' ? `, ${options.content}` : ''}`;
  }

  if (content) {
    options.content = Util.resolveString(content);
    if (options.split && typeof options.split !== 'object') options.split = {};
    // Wrap everything in a code block
    if (typeof options.code !== 'undefined' && (typeof options.code !== 'boolean' || options.code === true)) {
      options.content = Util.escapeMarkdown(options.content, true);
      options.content =
        `\`\`\`${typeof options.code !== 'boolean' ? options.code || '' : ''}\n${options.content}\n\`\`\``;
      if (options.split) {
        options.split.prepend = `\`\`\`${typeof options.code !== 'boolean' ? options.code || '' : ''}\n`;
        options.split.append = '\n```';
      }
    }

    // Add zero-width spaces to @everyone/@here
    if (options.disableEveryone ||
      (typeof options.disableEveryone === 'undefined' && channel.client.options.disableEveryone)) {
      options.content = options.content.replace(/@(everyone|here)/g, '@\u200b$1');
    }

    if (options.split) options.content = Util.splitMessage(options.content, options.split);
  }

  if (options.embed && options.embed.files) {
    if (options.files) options.files = options.files.concat(options.embed.files);
    else options.files = options.embed.files;
  }

  if (options.embed && webhook) options.embeds = [new Embed(options.embed)._apiTransform()];
  else if (options.embed) options.embed = new Embed(options.embed)._apiTransform();
  else if (options.embeds) options.embeds = options.embeds.map(e => new Embed(e)._apiTransform());

  let files;

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

    files = await Promise.all(options.files.map(file =>
      DataResolver.resolveFile(file.attachment).then(resource => {
        file.file = resource;
        return file;
      })
    ));
  }

  if (webhook) {
    if (!options.username) options.username = this.name;
    if (options.avatarURL) options.avatar_url = options.avatarURL;
  }

  return { data: {
    content: options.content,
    tts: options.tts,
    nonce: options.nonce,
    embed: options.embed,
    embeds: options.embeds,
    username: options.username,
    avatar_url: options.avatar_url,
  }, files };
};


/***/ }),
/* 55 */
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

const Webhook = __webpack_require__(14);
const BaseClient = __webpack_require__(32);

/**
 * The webhook client.
 * @implements {Webhook}
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


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(2);
const GuildMember = __webpack_require__(15);

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
          let user = message.client.users.add(mention);
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
   * Checks if a user, guild member, role, or channel is mentioned.
   * Takes into account user mentions, role mentions, and @everyone/@here mentions.
   * @param {UserResolvable|GuildMember|Role|GuildChannel} data User/GuildMember/Role/Channel to check
   * @param {Object} [options] Options
   * @param {boolean} [options.ignoreDirect=false] - Whether to ignore direct mentions to the item
   * @param {boolean} [options.ignoreRoles=false] - Whether to ignore role mentions to a guild member
   * @param {boolean} [options.ignoreEveryone=false] - Whether to ignore everyone/here mentions
   * @returns {boolean}
   */
  has(data, { ignoreDirect = false, ignoreRoles = false, ignoreEveryone = false } = {}) {
    if (!ignoreEveryone && this.everyone) return true;
    if (!ignoreRoles && data instanceof GuildMember) {
      for (const role of this.roles.values()) if (data.roles.has(role.id)) return true;
    }

    if (!ignoreDirect) {
      const id = data.id || data;
      return this.users.has(id) || this.channels.has(id) || this.roles.has(id);
    }

    return false;
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
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

const Collector = __webpack_require__(33);
const Collection = __webpack_require__(2);
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
     * The message upon which to collect reactions
     * @type {Message}
     */
    this.message = message;

    /**
     * The users which have reacted to this message
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
   * Handles an incoming reaction for possible collection.
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
   * Handles a reaction deletion for possible disposal.
   * @param {MessageReaction} reaction The reaction to possibly dispose
   * @returns {?Snowflake|string}
   */
  dispose(reaction) {
    if (reaction.message.id !== this.message.id) return null;

    /**
     * Emitted whenever a reaction is removed from a message. Will emit on all reaction removals,
     * as opposed to {@link Collector#dispose} which will only be emitted when the entire reaction
     * is removed.
     * @event ReactionCollector#remove
     * @param {MessageReaction} reaction The reaction that was removed
     */
    if (this.collected.has(reaction)) this.emit('remove', reaction);
    return reaction.count ? null : ReactionCollector.key(reaction);
  }

  /**
   * Empties this reaction collector.
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
   * Gets the collector key for a reaction.
   * @param {MessageReaction} reaction The message reaction to get the key for
   * @returns {Snowflake|string}
   */
  static key(reaction) {
    return reaction.emoji.id || reaction.emoji.name;
  }
}

module.exports = ReactionCollector;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
/**
 * A data store to store User models who reacted to a MessageReaction.
 * @extends {DataStore}
 */
class ReactionUserStore extends DataStore {
  constructor(client, iterable, reaction) {
    super(client, iterable, __webpack_require__(17));
    this.reaction = reaction;
  }

  /**
   * Fetches all the users that gave this reaction. Resolves with a collection of users, mapped by their IDs.
   * @param {Object} [options] Options for fetching the users
   * @param {number} [options.limit=100] The maximum amount of users to fetch, defaults to 100
   * @param {Snowflake} [options.before] Limit fetching users to those with an id lower than the supplied id
   * @param {Snowflake} [options.after] Limit fetching users to those with an id greater than the supplied id
   * @returns {Promise<ReactionUserStore<Snowflake, User>>}
   */
  async fetch({ limit = 100, after, before } = {}) {
    const message = this.reaction.message;
    const users = await this.client.api.channels[message.channel.id].messages[message.id]
      .reactions[this.reaction.emoji.identifier]
      .get({ query: { limit, before, after } });
    for (const rawUser of users) {
      const user = this.client.users.add(rawUser);
      this.set(user.id, user);
    }
    return this;
  }

  /**
   * Removes a user from this reaction.
   * @param {UserResolvable} [user=this.reaction.message.client.user] The user to remove the reaction of
   * @returns {Promise<MessageReaction>}
   */
  remove(user = this.reaction.message.client.user) {
    const message = this.reaction.message;
    const userID = message.client.users.resolveID(user);
    if (!userID) return Promise.reject(new Error('REACTION_RESOLVE_USER'));
    return message.client.api.channels[message.channel.id].messages[message.id]
      .reactions[this.reaction.emoji.identifier][userID === message.client.user.id ? '@me' : userID]
      .delete()
      .then(() =>
        message.client.actions.MessageReactionRemove.handle({
          user_id: userID,
          message_id: message.id,
          emoji: this.reaction.emoji,
          channel_id: message.channel.id,
        }).reaction
      );
  }
}

module.exports = ReactionUserStore;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

const Channel = __webpack_require__(13);
const TextBasedChannel = __webpack_require__(18);
const Collection = __webpack_require__(2);
const DataResolver = __webpack_require__(8);
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
        const user = this.client.users.add(recipient);
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
   * When concatenated with a string, this automatically returns the channel's name instead of the
   * GroupDMChannel object.
   * @returns {string}
   * @example
   * // Logs: Hello from My Group DM!
   * console.log(`Hello from ${channel}!`);
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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

const GuildChannel = __webpack_require__(16);
const Webhook = __webpack_require__(14);
const TextBasedChannel = __webpack_require__(18);
const Collection = __webpack_require__(2);
const DataResolver = __webpack_require__(8);
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
     * If the guild considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = Boolean(data.nsfw);

    this.lastMessageID = data.last_message_id;

    if (data.messages) for (const message of data.messages) this.messages.add(message);
  }

  /**
   * Sets whether this channel is flagged as NSFW.
   * @param {boolean} nsfw Whether the channel should be considered NSFW
   * @param {string} [reason] Reason for changing the channel's NSFW flag
   * @returns {Promise<TextChannel>}
   */
  setNSFW(nsfw, reason) {
    return this.edit({ nsfw }, reason);
  }

  /**
   * Fetches all webhooks for the channel.
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
   * Creates a webhook for the channel.
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
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

const GuildChannel = __webpack_require__(16);
const Collection = __webpack_require__(2);
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
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

const GuildChannel = __webpack_require__(16);

/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  /**
   * Channels that are part of this category
   * @type {?Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get children() {
    return this.guild.channels.filter(c => c.parentID === this.id);
  }

  /**
   * Sets the category parent of this channel.
   * <warn>It is not currently possible to set the parent of a CategoryChannel.</warn>
   * @method setParent
   * @memberof CategoryChannel
   * @instance
   * @param {?GuildChannel|Snowflake} channel Parent channel
   * @param {Object} [options={}] Options to pass
   * @param {boolean} [options.lockPermissions=true] Lock the permissions to what the parent's permissions are
   * @param {string} [options.reason] Reason for modifying the parent of this channel
   * @returns {Promise<GuildChannel>}
   */
}

module.exports = CategoryChannel;


/***/ }),
/* 64 */
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
   * Adds a guild to the list of restricted guilds.
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
   * Removes a guild from the list of restricted guilds.
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
/* 65 */
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
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

const { browser } = __webpack_require__(0);
const querystring = __webpack_require__(31);
try {
  var erlpack = __webpack_require__(141);
  if (!erlpack.pack) erlpack = null;
} catch (err) {} // eslint-disable-line no-empty

if (browser) {
  exports.WebSocket = window.WebSocket; // eslint-disable-line no-undef
} else {
  try {
    exports.WebSocket = __webpack_require__(142);
  } catch (err) {
    exports.WebSocket = __webpack_require__(143);
  }
}

exports.encoding = erlpack ? 'etf' : 'json';

exports.pack = erlpack ? erlpack.pack : JSON.stringify;

exports.unpack = data => {
  if (!erlpack || data[0] === '{') return JSON.parse(data);
  if (!(data instanceof Buffer)) data = Buffer.from(new Uint8Array(data));
  return erlpack.unpack(data);
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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Top level file is just a mixin of submodules & constants


var assign    = __webpack_require__(12).assign;

var deflate   = __webpack_require__(145);
var inflate   = __webpack_require__(148);
var constants = __webpack_require__(72);

var pako = {};

assign(pako, deflate, inflate, constants);

module.exports = pako;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
}


module.exports = adler32;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
function makeTable() {
  var c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}


module.exports = crc32;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// String encode/decode helpers



var utils = __webpack_require__(12);


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
var STR_APPLY_OK = true;
var STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, [ 0 ]); } catch (__) { STR_APPLY_OK = false; }
try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
var _utf8len = new utils.Buf8(256);
for (var q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
exports.string2buf = function (str) {
  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new utils.Buf8(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper (used in 2 places)
function buf2binstring(buf, len) {
  // use fallback for big arrays to avoid stack overflow
  if (len < 65537) {
    if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
      return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
    }
  }

  var result = '';
  for (var i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}


// Convert byte array to binary string
exports.buf2binstring = function (buf) {
  return buf2binstring(buf, buf.length);
};


// Convert binary string (typed, when possible)
exports.binstring2buf = function (str) {
  var buf = new utils.Buf8(str.length);
  for (var i = 0, len = buf.length; i < len; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
};


// convert array to string
exports.buf2string = function (buf, max) {
  var i, out, c, c_len;
  var len = max || buf.length;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  var utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
exports.utf8border = function (buf, max) {
  var pos;

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

module.exports = ZStream;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const User = __webpack_require__(17);
const GuildMember = __webpack_require__(15);
const Message = __webpack_require__(29);

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
   * @returns {?Snowflake}
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

    return this.client.api.users(id).get().then(data => this.add(data, cache));
  }
}

module.exports = UserStore;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const Channel = __webpack_require__(13);
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

  add(data, guild, cache = true) {
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
   * @returns {?Snowflake}
   */
}

module.exports = ChannelStore;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const DataResolver = __webpack_require__(8);
const { Events } = __webpack_require__(0);
const Guild = __webpack_require__(19);

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
   * @returns {?Snowflake}
   */

  /**
   * Creates a guild.
   * <warn>This is only available when using a user account.</warn>
   * @param {string} name The name of the guild
   * @param {Object} [options] Options for the creating
   * @param {string} [options.region] The region for the server, defaults to the closest one available
   * @param {BufferResolvable|Base64Resolvable} [options.icon=null] The icon for the guild
   * @returns {Promise<Guild>} The guild that was created
   */
  create(name, { region, icon = null } = {}) {
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
              resolve(this.client.guilds.add(data));
            }, 10000);
            return undefined;
          }, reject)
      );
    }

    return DataResolver.resolveImage(icon)
      .then(data => this.create(name, { region, icon: data || null }));
  }
}

module.exports = GuildStore;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

const PresenceStore = __webpack_require__(37);
const Collection = __webpack_require__(2);
const { ActivityTypes, OPCodes } = __webpack_require__(0);
const { Presence } = __webpack_require__(11);
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
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(5);

module.exports = {
  // "Root" classes (starting points)
  BaseClient: __webpack_require__(32),
  Client: __webpack_require__(94),
  Shard: __webpack_require__(182),
  ShardClientUtil: __webpack_require__(183),
  ShardingManager: __webpack_require__(184),
  WebhookClient: __webpack_require__(56),

  // Utilities
  Collection: __webpack_require__(2),
  Constants: __webpack_require__(0),
  DataResolver: __webpack_require__(8),
  DataStore: __webpack_require__(6),
  DiscordAPIError: __webpack_require__(44),
  Permissions: __webpack_require__(10),
  Snowflake: __webpack_require__(9),
  SnowflakeUtil: __webpack_require__(9),
  Structures: __webpack_require__(23),
  Util: Util,
  util: Util,
  version: __webpack_require__(42).version,

  // Stores
  ChannelStore: __webpack_require__(74),
  ClientPresenceStore: __webpack_require__(76),
  EmojiStore: __webpack_require__(35),
  GuildChannelStore: __webpack_require__(52),
  GuildMemberStore: __webpack_require__(50),
  GuildStore: __webpack_require__(75),
  ReactionUserStore: __webpack_require__(59),
  MessageStore: __webpack_require__(21),
  PresenceStore: __webpack_require__(37),
  RoleStore: __webpack_require__(51),
  UserStore: __webpack_require__(73),

  // Shortcuts to Util methods
  discordSort: Util.discordSort,
  escapeMarkdown: Util.escapeMarkdown,
  fetchRecommendedShards: Util.fetchRecommendedShards,
  resolveColor: Util.resolveColor,
  resolveString: Util.resolveString,
  splitMessage: Util.splitMessage,

  // Structures
  Base: __webpack_require__(7),
  Activity: __webpack_require__(11).Activity,
  CategoryChannel: __webpack_require__(63),
  Channel: __webpack_require__(13),
  ClientApplication: __webpack_require__(38),
  get ClientUser() {
    // This is a getter so that it properly extends any custom User class
    return __webpack_require__(45);
  },
  ClientUserChannelOverride: __webpack_require__(65),
  ClientUserGuildSettings: __webpack_require__(40),
  ClientUserSettings: __webpack_require__(64),
  Collector: __webpack_require__(33),
  DMChannel: __webpack_require__(46),
  Emoji: __webpack_require__(24),
  GroupDMChannel: __webpack_require__(60),
  Guild: __webpack_require__(19),
  GuildAuditLogs: __webpack_require__(48),
  GuildChannel: __webpack_require__(16),
  GuildMember: __webpack_require__(15),
  Invite: __webpack_require__(26),
  Message: __webpack_require__(29),
  MessageAttachment: __webpack_require__(28),
  MessageCollector: __webpack_require__(47),
  MessageEmbed: __webpack_require__(27),
  MessageMentions: __webpack_require__(57),
  MessageReaction: __webpack_require__(39),
  PermissionOverwrites: __webpack_require__(53),
  Presence: __webpack_require__(11).Presence,
  ReactionCollector: __webpack_require__(58),
  ReactionEmoji: __webpack_require__(36),
  RichPresenceAssets: __webpack_require__(11).RichPresenceAssets,
  Role: __webpack_require__(20),
  TextChannel: __webpack_require__(61),
  User: __webpack_require__(17),
  UserConnection: __webpack_require__(55),
  VoiceChannel: __webpack_require__(62),
  VoiceRegion: __webpack_require__(34),
  Webhook: __webpack_require__(14),

  WebSocket: __webpack_require__(66),
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(79);


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

const browser = typeof window !== 'undefined';
const querystring = __webpack_require__(31);
const Package = __webpack_require__(82);
const transport = browser ? __webpack_require__(83) : __webpack_require__(84);

/**
 * Snekfetch
 * @extends Stream.Readable
 * @extends Promise
 */
class Snekfetch extends transport.Extension {
  /**
   * Options to pass to the Snekfetch constructor
   * @typedef {object} SnekfetchOptions
   * @memberof Snekfetch
   * @property {object} [headers] Headers to initialize the request with
   * @property {object|string|Buffer} [data] Data to initialize the request with
   * @property {string|Object} [query] Query to intialize the request with
   * @property {boolean} [followRedirects=true] If the request should follow redirects
   * @property {object} [qs=querystring] Querystring module to use, any object providing
   * `stringify` and `parse` for querystrings
   * @property {number} [version = 1] The http version to use [1 or 2]
   * @property {external:Agent} [agent] Whether to use an http agent
   */

  /**
   * Create a request.
   * Usually you'll want to do `Snekfetch#method(url [, options])` instead of
   * `new Snekfetch(method, url [, options])`
   * @param {string} method HTTP method
   * @param {string} url URL
   * @param {SnekfetchOptions} [opts] Options
   */
  constructor(method, url, opts = {}) {
    super();
    this.options = Object.assign({ version: 1, qs: querystring, followRedirects: true }, opts);
    this.request = transport.buildRequest.call(this, method, url, opts);
    if (opts.query)
      this.query(opts.query);
    if (opts.data)
      this.send(opts.data);
  }

  /**
   * Add a query param to the request
   * @param {string|Object} name Name of query param or object to add to query
   * @param {string} [value] If name is a string value, this will be the value of the query param
   * @returns {Snekfetch} This request
   */
  query(name, value) {
    this._checkModify();
    if (!this.request.query)
      this.request.query = {};
    if (name !== null && typeof name === 'object') {
      for (const [k, v] of Object.entries(name))
        this.query(k, v);
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
    this._checkModify();
    if (name !== null && typeof name === 'object') {
      for (const key of Object.keys(name))
        this.set(key, name[key]);
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
  attach(...args) {
    this._checkModify();
    const form = this._getFormData();
    if (typeof args[0] === 'object') {
      for (const [k, v] of Object.entries(args[0]))
        this.attach(k, v);
    } else {
      form.append(...args);
    }

    return this;
  }

  /**
   * Send data with the request
   * @param {string|Buffer|Object} data Data to send
   * @returns {Snekfetch} This request
   */
  send(data) {
    this._checkModify();
    if (data instanceof transport.FormData || transport.shouldSendRaw(data)) {
      this.data = data;
    } else if (data !== null && typeof data === 'object') {
      const header = this.request.getHeader('content-type');
      let serialize;
      if (header) {
        if (header.includes('json'))
          serialize = JSON.stringify;
        else if (header.includes('urlencoded'))
          serialize = this.options.qs.stringify;
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
    if (this._response)
      return this._response.then(resolver, rejector);
    // eslint-disable-next-line no-return-assign
    return this._response = transport.finalizeRequest.call(this)
      .then(({ response, raw, redirect, headers }) => {
        if (redirect) {
          let method = this.request.method;
          if ([301, 302].includes(response.statusCode)) {
            if (method !== 'HEAD')
              method = 'GET';
            this.data = null;
          } else if (response.statusCode === 303) {
            method = 'GET';
          }

          const redirectHeaders = this.request.getHeaders();
          delete redirectHeaders.host;
          return new Snekfetch(method, redirect, {
            data: this.data,
            headers: redirectHeaders,
            version: this.options.version,
          });
        }

        const statusCode = response.statusCode || response.status;
        // forgive me :(
        const self = this; // eslint-disable-line consistent-this
        /**
         * Response from Snekfetch
         * @typedef {Object} SnekfetchResponse
         * @memberof Snekfetch
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
              res.body = self.options.qs.parse(res.text);
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
      (err) => cb ? cb(err, err.status ? err : null) : Promise.reject(err)
    );
  }

  _getFormData() {
    if (!(this.data instanceof transport.FormData))
      this.data = new transport.FormData();

    return this.data;
  }

  _finalizeRequest() {
    if (!this.request)
      return;
    if (!this.request.getHeader('user-agent'))
      this.set('User-Agent', `snekfetch/${Snekfetch.version} (${Package.homepage})`);

    if (this.request.method !== 'HEAD')
      this.set('Accept-Encoding', 'gzip, deflate');
    if (this.data && this.data.getBoundary)
      this.set('Content-Type', `multipart/form-data; boundary=${this.data.getBoundary()}`);

    if (this.request.query) {
      const [path, query] = this.request.path.split('?');
      this.request.path = `${path}?${this.options.qs.stringify(this.request.query)}${query ? `&${query}` : ''}`;
    }
  }

  _checkModify() {
    if (this.response)
      throw new Error('Cannot modify request after it has been sent!');
  }
}

Snekfetch.version = Package.version;

/**
 * Create a ((THIS)) request
 * @dynamic this.METHODS
 * @method Snekfetch.((THIS)lowerCase)
 * @param {string} url The url to request
 * @param {Snekfetch.snekfetchOptions} [opts] Options
 * @returns {Snekfetch}
 */
Snekfetch.METHODS = transport.METHODS.concat('BREW').filter((m) => m !== 'M-SEARCH');
for (const method of Snekfetch.METHODS) {
  Snekfetch[method.toLowerCase()] = function runMethod(url, opts) {
    const Constructor = this.prototype instanceof Snekfetch ? this : Snekfetch;
    return new Constructor(method, url, opts);
  };
}

module.exports = Snekfetch;

/**
 * @external Agent
 * @see {@link https://nodejs.org/api/http.html#http_class_http_agent}
 */


/***/ }),
/* 80 */
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
/* 81 */
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
/* 82 */
/***/ (function(module, exports) {

module.exports = ({"version":"3.6.1","homepage":"https://snekfetch.js.org/"})

/***/ }),
/* 83 */
/***/ (function(module, exports) {

function buildRequest(method, url) {
  return {
    method,
    path: url,
    redirect: this.options.followRedirects ? 'follow' : 'manual',
    headers: {},
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    getHeader(name) {
      return this.headers[name.toLowerCase()];
    },
  };
}

function finalizeRequest() {
  this._finalizeRequest();
  if (this.data)
    this.request.body = this.data;
  return window.fetch(this.request.path, this.request)
    .then((r) => r.text().then((t) => {
      const headers = {};
      for (const [k, v] of r.headers.entries())
        headers[k.toLowerCase()] = v;
      return { response: r, raw: t, headers };
    }));
}

module.exports = {
  buildRequest, finalizeRequest,
  shouldSendRaw: () => false,
  METHODS: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'PATCH'],
  STATUS_CODES: {},
  Extension: Object,
  FormData: window.FormData,
};


/***/ }),
/* 84 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

const { register } = __webpack_require__(43);

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
  SHARDING_NO_SHARDS: 'No shards have been spawned.',
  SHARDING_IN_PROCESS: 'Shards are still being spawned.',
  SHARDING_ALREADY_SPAWNED: count => `Already spawned ${count} shards.`,
  SHARDING_PROCESS_EXISTS: id => `Shard ${id} already has an active process.`,
  SHARDING_READY_TIMEOUT: id => `Shard ${id}'s Client took too long to become ready.`,
  SHARDING_READY_DISCONNECTED: id => `Shard ${id}'s Client disconnected before becoming ready.`,
  SHARDING_READY_DIED: id => `Shard ${id}'s process exited before its Client became ready.`,

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
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

const handlers = __webpack_require__(87);
const APIRequest = __webpack_require__(91);
const routeBuilder = __webpack_require__(93);
const { Error } = __webpack_require__(4);
const { Endpoints } = __webpack_require__(0);

class RESTManager {
  constructor(client, tokenPrefix = 'Bot') {
    this.client = client;
    this.handlers = {};
    this.rateLimitedEndpoints = {};
    this.globallyRateLimited = false;
    this.tokenPrefix = tokenPrefix;
    this.versioned = true;
    this.timeDifferences = [];
  }

  get api() {
    return routeBuilder(this);
  }

  get timeDifference() {
    return Math.round(this.timeDifferences.reduce((a, b) => a + b, 0) / this.timeDifferences.length);
  }

  set timeDifference(ms) {
    this.timeDifferences.unshift(ms);
    if (this.timeDifferences.length > 5) this.timeDifferences.length = 5;
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
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  sequential: __webpack_require__(88),
  burst: __webpack_require__(89),
  RequestHandler: __webpack_require__(90),
};


/***/ }),
/* 88 */
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
      }, timeout);
    });
};


/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = function burst() {
  if (this.limited || this.queue.length === 0) return;
  this.execute(this.queue.shift())
    .then(this.handle.bind(this))
    .catch(({ timeout }) => {
      this.client.setTimeout(() => {
        this.reset();
        this.handle();
      }, timeout);
    });
  this.remaining--;
  this.handle();
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

const DiscordAPIError = __webpack_require__(44);
const { Events: { RATE_LIMIT } } = __webpack_require__(0);

class RequestHandler {
  constructor(manager, handler) {
    this.manager = manager;
    this.client = this.manager.client;
    this.handle = handler.bind(this);
    this.limit = Infinity;
    this.resetTime = null;
    this.remaining = 1;

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
        if (timeout || this.limited) {
          if (!timeout) {
            timeout = this.resetTime - Date.now() + this.manager.timeDifference + this.client.options.restTimeOffset;
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ timeout });
          if (this.client.listenerCount(RATE_LIMIT)) {
            /**
             * Emitted when the client hits a rate limit while making a request
             * @event Client#rateLimit
             * @param {Object} rateLimitInfo Object containing the rate limit info
             * @param {number} rateLimitInfo.timeout Timeout in ms
             * @param {number} rateLimitInfo.limit Number of requests that can be made to this endpoint
             * @param {number} rateLimitInfo.timeDifference Delta-T in ms between your system and Discord servers
             * @param {string} rateLimitInfo.method HTTP method used for request that triggered this event
             * @param {string} rateLimitInfo.path Path used for request that triggered this event
             * @param {string} rateLimitInfo.route Route used for request that triggered this event
             */
            this.client.emit(RATE_LIMIT, {
              timeout,
              limit: this.limit,
              timeDifference: this.manager.timeDifference,
              method: item.request.method,
              path: item.request.path,
              route: item.request.route,
            });
          }
        } else {
          resolve();
        }
      };
      item.request.gen().end((err, res) => {
        if (res && res.headers) {
          if (res.headers['x-ratelimit-global']) this.globallyLimited = true;
          this.limit = Number(res.headers['x-ratelimit-limit']);
          this.resetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
          this.remaining = Number(res.headers['x-ratelimit-remaining']);
          this.manager.timeDifference = Date.now() - new Date(res.headers.date).getTime();
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
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

const querystring = __webpack_require__(31);
const snekfetch = __webpack_require__(30);
const https = __webpack_require__(92);
const { browser, UserAgent } = __webpack_require__(0);

if (https.Agent) var agent = new https.Agent({ keepAlive: true });

class APIRequest {
  constructor(rest, method, path, options) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.route = options.route;
    this.options = options;

    const queryString = (querystring.stringify(options.query).match(/[^=&?]+=[^=&?]+/g) || []).join('&');
    this.path = `${path}${queryString ? `?${queryString}` : ''}`;
  }

  gen() {
    const API = this.options.versioned === false ? this.client.options.http.api :
      `${this.client.options.http.api}/v${this.client.options.http.version}`;

    const request = snekfetch[this.method](`${API}${this.path}`, { agent });

    if (this.options.auth !== false) request.set('Authorization', this.rest.getAuth());
    if (this.options.reason) request.set('X-Audit-Log-Reason', encodeURIComponent(this.options.reason));
    if (!browser) request.set('User-Agent', UserAgent);
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
/* 92 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 93 */
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
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

const BaseClient = __webpack_require__(32);
const Permissions = __webpack_require__(10);
const ClientManager = __webpack_require__(95);
const ClientVoiceManager = __webpack_require__(96);
const WebSocketManager = __webpack_require__(97);
const ActionsManager = __webpack_require__(153);
const Collection = __webpack_require__(2);
const VoiceRegion = __webpack_require__(34);
const Webhook = __webpack_require__(14);
const Invite = __webpack_require__(26);
const ClientApplication = __webpack_require__(38);
const ShardClientUtil = __webpack_require__(180);
const VoiceBroadcast = __webpack_require__(181);
const UserStore = __webpack_require__(73);
const ChannelStore = __webpack_require__(74);
const GuildStore = __webpack_require__(75);
const ClientPresenceStore = __webpack_require__(76);
const EmojiStore = __webpack_require__(35);
const { Events, browser } = __webpack_require__(0);
const DataResolver = __webpack_require__(8);
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
     * Shard helpers for the client (only if the process was spawned from a {@link ShardingManager})
     * @type {?ShardClientUtil}
     */
    this.shard = !browser && process.env.SHARDING_MANAGER ? ShardClientUtil.singleton(this) : null;

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
     * as long as sharding isn't being used, this will be *every* channel in *every* guild the bot
     * is a member of, and all DM channels
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
   * @readonly
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
  login(token = this.token) {
    return new Promise((resolve, reject) => {
      if (!token || typeof token !== 'string') throw new Error('TOKEN_INVALID');
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
/* 95 */
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
   * @readonly
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
/* 96 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(22);
const { Events, Status } = __webpack_require__(0);
const WebSocketConnection = __webpack_require__(98);

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
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

const EventEmitter = __webpack_require__(22);
const { Events, OPCodes, Status, WSCodes } = __webpack_require__(0);
const PacketManager = __webpack_require__(99);
const WebSocket = __webpack_require__(66);
try {
  var zlib = __webpack_require__(144);
  if (!zlib.Inflate) zlib = __webpack_require__(67);
} catch (err) {
  zlib = __webpack_require__(67);
}

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
      remaining: 120,
      total: 120,
      time: 60e3,
      resetTimer: null,
    };

    /**
     * Events that are disabled (will not be processed)
     * @type {Object}
     */
    this.disabledEvents = {};
    for (const event of this.client.options.disabledEvents) this.disabledEvents[event] = true;

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

    this.inflate = null;
    this.connect(gateway);
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
      }, this.ratelimit.time);
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
    this.inflate = new zlib.Inflate({
      chunkSize: 65535,
      flush: zlib.Z_SYNC_FLUSH,
      to: WebSocket.encoding === 'json' ? 'string' : '',
    });
    this.expectingClose = false;
    this.gateway = gateway;
    this.debug(`Connecting to ${gateway}`);
    const ws = this.ws = WebSocket.create(gateway, {
      v: this.client.options.ws.version,
      compress: 'zlib-stream',
    });
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
   */
  onMessage({ data }) {
    if (data instanceof ArrayBuffer) data = new Uint8Array(data);
    const l = data.length;
    const flush = l >= 4 &&
      data[l - 4] === 0x00 &&
      data[l - 3] === 0x00 &&
      data[l - 2] === 0xFF &&
      data[l - 1] === 0xFF;

    this.inflate.push(data, flush && zlib.Z_SYNC_FLUSH);
    if (!flush) return;
    try {
      const packet = WebSocket.unpack(this.inflate.result);
      this.onPacket(packet);
      if (this.client.listenerCount('raw')) this.client.emit('raw', packet);
    } catch (err) {
      this.client.emit('debug', err);
    }
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
/* 99 */
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

    this.register(WSEvents.READY, __webpack_require__(100));
    this.register(WSEvents.RESUMED, __webpack_require__(105));
    this.register(WSEvents.GUILD_CREATE, __webpack_require__(106));
    this.register(WSEvents.GUILD_DELETE, __webpack_require__(107));
    this.register(WSEvents.GUILD_UPDATE, __webpack_require__(108));
    this.register(WSEvents.GUILD_BAN_ADD, __webpack_require__(109));
    this.register(WSEvents.GUILD_BAN_REMOVE, __webpack_require__(110));
    this.register(WSEvents.GUILD_MEMBER_ADD, __webpack_require__(111));
    this.register(WSEvents.GUILD_MEMBER_REMOVE, __webpack_require__(112));
    this.register(WSEvents.GUILD_MEMBER_UPDATE, __webpack_require__(113));
    this.register(WSEvents.GUILD_ROLE_CREATE, __webpack_require__(114));
    this.register(WSEvents.GUILD_ROLE_DELETE, __webpack_require__(115));
    this.register(WSEvents.GUILD_ROLE_UPDATE, __webpack_require__(116));
    this.register(WSEvents.GUILD_EMOJIS_UPDATE, __webpack_require__(117));
    this.register(WSEvents.GUILD_MEMBERS_CHUNK, __webpack_require__(118));
    this.register(WSEvents.CHANNEL_CREATE, __webpack_require__(119));
    this.register(WSEvents.CHANNEL_DELETE, __webpack_require__(120));
    this.register(WSEvents.CHANNEL_UPDATE, __webpack_require__(121));
    this.register(WSEvents.CHANNEL_PINS_UPDATE, __webpack_require__(122));
    this.register(WSEvents.PRESENCE_UPDATE, __webpack_require__(123));
    this.register(WSEvents.USER_UPDATE, __webpack_require__(124));
    this.register(WSEvents.USER_NOTE_UPDATE, __webpack_require__(125));
    this.register(WSEvents.USER_SETTINGS_UPDATE, __webpack_require__(126));
    this.register(WSEvents.USER_GUILD_SETTINGS_UPDATE, __webpack_require__(127));
    this.register(WSEvents.VOICE_STATE_UPDATE, __webpack_require__(128));
    this.register(WSEvents.TYPING_START, __webpack_require__(129));
    this.register(WSEvents.MESSAGE_CREATE, __webpack_require__(130));
    this.register(WSEvents.MESSAGE_DELETE, __webpack_require__(131));
    this.register(WSEvents.MESSAGE_UPDATE, __webpack_require__(132));
    this.register(WSEvents.MESSAGE_DELETE_BULK, __webpack_require__(133));
    this.register(WSEvents.VOICE_SERVER_UPDATE, __webpack_require__(134));
    this.register(WSEvents.GUILD_SYNC, __webpack_require__(135));
    this.register(WSEvents.RELATIONSHIP_ADD, __webpack_require__(136));
    this.register(WSEvents.RELATIONSHIP_REMOVE, __webpack_require__(137));
    this.register(WSEvents.MESSAGE_REACTION_ADD, __webpack_require__(138));
    this.register(WSEvents.MESSAGE_REACTION_REMOVE, __webpack_require__(139));
    this.register(WSEvents.MESSAGE_REACTION_REMOVE_ALL, __webpack_require__(140));
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
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);
let ClientUser;

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.ws.heartbeat();

    data.user.user_settings = data.user_settings;
    data.user.user_guild_settings = data.user_guild_settings;

    if (!ClientUser) ClientUser = __webpack_require__(45);
    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) client.guilds.add(guild);
    for (const privateDM of data.private_channels) client.channels.add(privateDM);

    for (const relation of data.relationships) {
      const user = client.users.add(relation.user);
      if (relation.type === 1) {
        client.user.friends.set(user.id, user);
      } else if (relation.type === 2) {
        client.user.blocked.set(user.id, user);
      }
    }

    for (const presence of data.presences || []) client.presences.add(presence);

    if (data.notes) {
      for (const user in data.notes) {
        let note = data.notes[user];
        if (!note.length) note = null;

        client.user.notes.set(user, note);
      }
    }

    if (!client.users.has('1')) {
      client.users.add({
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
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(5);
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
 * @property {string} [sortBy='timestamp'] `timestamp` or `relevant`
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
    options.maxID = Util.binaryToID((options.before.getTime() - 14200704e5).toString(2) + '0'.repeat(22));
  }
  if (options.after) {
    if (!(options.after instanceof Date)) options.after = new Date(options.after);
    options.minID = Util.binaryToID((options.after.getTime() - 14200704e5).toString(2) + '0'.repeat(22));
  }
  if (options.during) {
    if (!(options.during instanceof Date)) options.during = new Date(options.during);
    const t = options.during.getTime() - 14200704e5;
    options.minID = Util.binaryToID(t.toString(2) + '0'.repeat(22));
    options.maxID = Util.binaryToID((t + 864e5).toString(2) + '0'.repeat(22));
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
  const Channel = __webpack_require__(13);
  const Guild = __webpack_require__(19);

  if (!(target instanceof Channel || target instanceof Guild)) throw new TypeError('SEARCH_CHANNEL_TYPE');

  let endpoint = target.client.api[target instanceof Channel ? 'channels' : 'guilds'](target.id).messages().search;
  return endpoint.get({ query: options }).then(body => {
    const results = body.messages.map(x =>
      x.map(m => target.client.channels.get(m.channel_id).messages.add(m, false))
    );
    return {
      total: body.total_results,
      results,
    };
  });
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

const createMessage = __webpack_require__(54);

module.exports = async function sendMessage(channel, options) { // eslint-disable-line complexity
  const User = __webpack_require__(17);
  const GuildMember = __webpack_require__(15);
  if (channel instanceof User || channel instanceof GuildMember) return channel.createDM().then(dm => dm.send(options));

  const { data, files } = await createMessage(channel, options);

  if (data.content instanceof Array) {
    const messages = [];
    for (let i = 0; i < data.content.length; i++) {
      const opt = i === data.content.length - 1 ? { tts: data.tts, embed: data.embed, files } : { tts: data.tts };
      // eslint-disable-next-line no-await-in-loop
      const message = await channel.send(data.content[i], opt);
      messages.push(message);
    }
    return messages;
  }

  return channel.client.api.channels[channel.id].messages.post({ data, files })
    .then(d => channel.client.actions.MessageCreate.handle(d).message);
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

const Collection = __webpack_require__(2);
const { UserFlags } = __webpack_require__(0);
const UserConnection = __webpack_require__(55);
const Base = __webpack_require__(7);

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
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

const DataStore = __webpack_require__(6);
const MessageReaction = __webpack_require__(39);

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

  add(data, cache) {
    return super.add(data, cache, { id: data.emoji.id || data.emoji.name, extras: [this.message] });
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
    * @returns {?Snowflake}
    */

  /**
   * Removes all reactions from a message.
   * @returns {Promise<Message>}
   */
  removeAll() {
    return this.client.api.channels(this.message.channel.id).messages(this.message.id).reactions.delete()
      .then(() => this.message);
  }
}

module.exports = ReactionStore;


/***/ }),
/* 105 */
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
 * Emitted whenever a WebSocket resumes.
 * @event Client#resumed
 * @param {number} replayed The number of events that were replayed
 */

module.exports = ResumedHandler;


/***/ }),
/* 106 */
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
      guild = client.guilds.add(data);
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
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class GuildDeleteHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    client.actions.GuildDelete.handle(packet.d);
  }
}

/**
 * Emitted whenever a guild kicks the client or the guild is deleted/left.
 * @event Client#guildDelete
 * @param {Guild} guild The guild that was deleted
 */

module.exports = GuildDeleteHandler;


/***/ }),
/* 108 */
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
/* 109 */
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
/* 110 */
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
/* 111 */
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
      const member = guild.members.add(data);
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
/* 112 */
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
/* 113 */
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
/* 114 */
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
/* 115 */
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
/* 116 */
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
/* 117 */
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
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);
const Collection = __webpack_require__(2);

class GuildMembersChunkHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const guild = client.guilds.get(data.guild_id);
    if (!guild) return;
    const members = new Collection();

    for (const member of data.members) members.set(member.user.id, guild.members.add(member));

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
/* 119 */
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
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class ChannelDeleteHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.ChannelDelete.handle(packet.d);
  }
}

module.exports = ChannelDeleteHandler;


/***/ }),
/* 121 */
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
/* 122 */
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
/* 123 */
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
        user = client.users.add(data.user);
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
        member = guild.members.add({
          user,
          roles: data.roles,
          deaf: false,
          mute: false,
        });
        client.emit(Events.GUILD_MEMBER_AVAILABLE, member);
      }
      if (member) {
        if (client.listenerCount(Events.PRESENCE_UPDATE) === 0) {
          guild.presences.add(data);
          return;
        }
        const oldMember = member._clone();
        if (member.presence) {
          oldMember.frozenPresence = member.presence._clone();
        }
        guild.presences.add(data);
        client.emit(Events.PRESENCE_UPDATE, oldMember, member);
      } else {
        guild.presences.add(data);
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
/* 124 */
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
/* 125 */
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
/* 126 */
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
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);
const { Events } = __webpack_require__(0);
const ClientUserGuildSettings = __webpack_require__(40);

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
/* 128 */
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
/* 129 */
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
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageCreateHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageCreate.handle(packet.d);
  }
}

module.exports = MessageCreateHandler;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageDeleteHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageDelete.handle(packet.d);
  }
}

module.exports = MessageDeleteHandler;


/***/ }),
/* 132 */
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
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

const AbstractHandler = __webpack_require__(1);

class MessageDeleteBulkHandler extends AbstractHandler {
  handle(packet) {
    this.packetManager.client.actions.MessageDeleteBulk.handle(packet.d);
  }
}

module.exports = MessageDeleteBulkHandler;


/***/ }),
/* 134 */
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
/* 135 */
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
/* 136 */
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
/* 137 */
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
/* 138 */
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
/* 139 */
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
/* 140 */
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
/* 141 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 142 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 143 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 144 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var zlib_deflate = __webpack_require__(146);
var utils        = __webpack_require__(12);
var strings      = __webpack_require__(70);
var msg          = __webpack_require__(41);
var ZStream      = __webpack_require__(71);

var toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

var Z_NO_FLUSH      = 0;
var Z_FINISH        = 4;

var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_SYNC_FLUSH    = 2;

var Z_DEFAULT_COMPRESSION = -1;

var Z_DEFAULT_STRATEGY    = 0;

var Z_DEFLATED  = 8;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array|Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
 * push a chunk with explicit flush (call [[Deflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate(options) {
  if (!(this instanceof Deflate)) return new Deflate(options);

  this.options = utils.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY,
    to: ''
  }, options || {});

  var opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new ZStream();
  this.strm.avail_out = 0;

  var status = zlib_deflate.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }

  if (opt.header) {
    zlib_deflate.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    var dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = zlib_deflate.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the compression context.
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * array format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var status, _mode;

  if (this.ended) { return false; }

  _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = zlib_deflate.deflate(strm, _mode);    /* no bad return value */

    if (status !== Z_STREAM_END && status !== Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }
    if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
      if (this.options.to === 'string') {
        this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
      } else {
        this.onData(utils.shrinkBuf(strm.output, strm.next_out));
      }
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);

  // Finalize on the last chunk.
  if (_mode === Z_FINISH) {
    status = zlib_deflate.deflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === Z_SYNC_FLUSH) {
    this.onEnd(Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be "binary string"
 *    (each char code [0..255])
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate(input, options) {
  var deflator = new Deflate(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || msg[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return deflate(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate(input, options);
}


exports.Deflate = Deflate;
exports.deflate = deflate;
exports.deflateRaw = deflateRaw;
exports.gzip = gzip;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils   = __webpack_require__(12);
var trees   = __webpack_require__(147);
var adler32 = __webpack_require__(68);
var crc32   = __webpack_require__(69);
var msg     = __webpack_require__(41);

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH      = 0;
var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION = -1;


var Z_FILTERED            = 1;
var Z_HUFFMAN_ONLY        = 2;
var Z_RLE                 = 3;
var Z_FIXED               = 4;
var Z_DEFAULT_STRATEGY    = 0;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;


/* The deflate compression method */
var Z_DEFLATED  = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_MEM_LEVEL = 8;


var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS      = 256;
/* number of literal bytes 0..255 */
var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES       = 30;
/* number of distance codes */
var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
var MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE     = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only(s, last) {
  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}


function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  utils.arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;      /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match;                       /* matched string */
  var len;                           /* length of current match */
  var best_len = s.prev_length;              /* best match length so far */
  var nice_match = s.nice_match;             /* stop if match long enough */
  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1  = _win[scan + best_len - 1];
  var scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s.block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
//    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head;        /* head of the hash chain */
  var bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head;          /* head of hash chain */
  var bflush;              /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush;            /* set if current block must be flushed */
  var prev;              /* byte at distance one to match */
  var scan, strend;      /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new utils.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;          /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;      /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH;
  trees._tr_init(s);
  return Z_OK;
}


function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
}


function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
  strm.state.gzhead = head;
  return Z_OK;
}


function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;

  //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;
  s.pending_buf = new utils.Buf8(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);
  s.d_buf = 1 * s.lit_bufsize;

  //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}


function deflate(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {

    if (s.wrap === 2) { // GZIP header
      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) { // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      }
      else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
                );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    else // DEFLATE header
    {
      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s.strstart !== 0) { header |= PRESET_DICT; }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }

//#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    }
    else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    }
    else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    }
    else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    }
    else {
      s.status = BUSY_STATE;
    }
  }
//#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      }
      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH) { return Z_OK; }
  if (s.wrap <= 0) { return Z_STREAM_END; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  status = strm.state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  s = strm.state;
  wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    tmpDict = new utils.Buf8(s.w_size);
    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}


exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils = __webpack_require__(12);

/* Public constants ==========================================================*/
/* ===========================================================================*/


//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED               = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY              = 0;
var Z_TEXT                = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;

/*============================================================================*/


function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES    = 2;
/* The three kinds of block type */

var MIN_MATCH    = 3;
var MAX_MATCH    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS      = 256;
/* number of literal bytes 0..255 */

var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES       = 30;
/* number of distance codes */

var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */

var MAX_BITS      = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK   = 256;
/* end of block literal code */

var REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
var extra_lbits =   /* extra bits for each length code */
  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

var extra_dbits =   /* extra bits for each distance code */
  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

var extra_blbits =  /* extra bits for each bit length code */
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

var bl_order =
  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
var static_ltree  = new Array((L_CODES + 2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree  = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code    = new Array(DIST_CODE_LEN);
zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length   = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist     = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


var static_l_desc;
var static_d_desc;
var static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short(s, w) {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}


function send_code(s, c, tree) {
  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
}


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree            = desc.dyn_tree;
  var max_code        = desc.max_code;
  var stree           = desc.stat_desc.static_tree;
  var has_stree       = desc.stat_desc.has_stree;
  var extra           = desc.stat_desc.extra_bits;
  var base            = desc.stat_desc.extra_base;
  var max_length      = desc.stat_desc.max_length;
  var h;              /* heap index */
  var n, m;           /* iterate over the tree elements */
  var bits;           /* bit length */
  var xbits;          /* extra bits */
  var f;              /* frequency */
  var overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
}


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
  var code = 0;              /* running code value */
  var bits;                  /* bit index */
  var n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    var len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n;        /* iterates over tree elements */
  var bits;     /* bit counter */
  var length;   /* length value */
  var code;     /* code value */
  var dist;     /* distance index */
  var bl_count = new Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

  //static_init_done = true;
}


/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s)
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header)
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s);        /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
//  while (len--) {
//    put_byte(s, *buf++);
//  }
  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}


// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist;           /* distance of matched string */
  var lc;             /* match length or unmatched char (if dist == 0) */
  var lx = 0;         /* running index in l_buf */
  var code;           /* the code to send */
  var extra;          /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree     = desc.dyn_tree;
  var stree    = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems    = desc.stat_desc.elems;
  var n, m;          /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
}


var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s)
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}


/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  var max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility

//#ifdef TRUNCATE_BLOCK
//  /* Try to guess if it is profitable to stop the current block here */
//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
//    /* Compute an upper bound for the compressed length */
//    out_length = s.last_lit*8;
//    in_length = s.strstart - s.block_start;
//
//    for (dcode = 0; dcode < D_CODES; dcode++) {
//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
//    }
//    out_length >>>= 3;
//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
//    //       s->last_lit, in_length, out_length,
//    //       100L - out_length*100L/in_length));
//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
//      return true;
//    }
//  }
//#endif

  return (s.last_lit === s.lit_bufsize - 1);
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

exports._tr_init  = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block  = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var zlib_inflate = __webpack_require__(149);
var utils        = __webpack_require__(12);
var strings      = __webpack_require__(70);
var c            = __webpack_require__(72);
var msg          = __webpack_require__(41);
var ZStream      = __webpack_require__(71);
var GZheader     = __webpack_require__(152);

var toString = Object.prototype.toString;

/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
 * push a chunk with explicit flush (call [[Inflate#push]] with
 * `Z_SYNC_FLUSH` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * var inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate(options) {
  if (!(this instanceof Inflate)) return new Inflate(options);

  this.options = utils.assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ''
  }, options || {});

  var opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new ZStream();
  this.strm.avail_out = 0;

  var status  = zlib_inflate.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== c.Z_OK) {
    throw new Error(msg[status]);
  }

  this.header = new GZheader();

  zlib_inflate.inflateGetHeader(this.strm, this.header);
}

/**
 * Inflate#push(data[, mode]) -> Boolean
 * - data (Uint8Array|Array|ArrayBuffer|String): input data
 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. The last data block must have
 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * We strongly recommend to use `Uint8Array` on input for best speed (output
 * format is detected automatically). Also, don't skip last param and always
 * use the same type in your code (boolean or number). That will improve JS speed.
 *
 * For regular `Array`-s make sure all elements are [0..255].
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate.prototype.push = function (data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var dictionary = this.options.dictionary;
  var status, _mode;
  var next_out_utf8, tail, utf8str;
  var dict;

  // Flag to properly process Z_BUF_ERROR on testing inflate call
  // when we check that all output data was flushed.
  var allowBufError = false;

  if (this.ended) { return false; }
  _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);

  // Convert data if needed
  if (typeof data === 'string') {
    // Only binary strings can be decompressed on practice
    strm.input = strings.binstring2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  do {
    if (strm.avail_out === 0) {
      strm.output = new utils.Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */

    if (status === c.Z_NEED_DICT && dictionary) {
      // Convert data if needed
      if (typeof dictionary === 'string') {
        dict = strings.string2buf(dictionary);
      } else if (toString.call(dictionary) === '[object ArrayBuffer]') {
        dict = new Uint8Array(dictionary);
      } else {
        dict = dictionary;
      }

      status = zlib_inflate.inflateSetDictionary(this.strm, dict);

    }

    if (status === c.Z_BUF_ERROR && allowBufError === true) {
      status = c.Z_OK;
      allowBufError = false;
    }

    if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {

        if (this.options.to === 'string') {

          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          tail = strm.next_out - next_out_utf8;
          utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }

          this.onData(utf8str);

        } else {
          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
        }
      }
    }

    // When no more input data, we should check that internal inflate buffers
    // are flushed. The only way to do it when avail_out = 0 - run one more
    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
    // Here we set flag to process this error properly.
    //
    // NOTE. Deflate does not return error in this case and does not needs such
    // logic.
    if (strm.avail_in === 0 && strm.avail_out === 0) {
      allowBufError = true;
    }

  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);

  if (status === c.Z_STREAM_END) {
    _mode = c.Z_FINISH;
  }

  // Finalize on the last chunk.
  if (_mode === c.Z_FINISH) {
    status = zlib_inflate.inflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === c.Z_OK;
  }

  // callback interim results if Z_SYNC_FLUSH.
  if (_mode === c.Z_SYNC_FLUSH) {
    this.onEnd(c.Z_OK);
    strm.avail_out = 0;
    return true;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|Array|String): output data. Type of array depends
 *   on js engine support. When string output requested, each chunk
 *   will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
 * or if an error happened. By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === c.Z_OK) {
    if (this.options.to === 'string') {
      // Glue & convert here, until we teach pako to send
      // utf8 aligned strings to onData
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * var pako = require('pako')
 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
 *   , output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err)
 *   console.log(err);
 * }
 * ```
 **/
function inflate(input, options) {
  var inflator = new Inflate(options);

  inflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) { throw inflator.msg || msg[inflator.err]; }

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return inflate(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|Array|String
 * - data (Uint8Array|Array|String): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


exports.Inflate = Inflate;
exports.inflate = inflate;
exports.inflateRaw = inflateRaw;
exports.ungzip  = inflate;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils         = __webpack_require__(12);
var adler32       = __webpack_require__(68);
var crc32         = __webpack_require__(69);
var inflate_fast  = __webpack_require__(150);
var inflate_table = __webpack_require__(151);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED  = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var    HEAD = 1;       /* i: waiting for magic header */
var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
var    TIME = 3;       /* i: waiting for modification time (gzip) */
var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
var    NAME = 7;       /* i: waiting for end of file name (gzip) */
var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
var    HCRC = 9;       /* i: waiting for header crc (gzip) */
var    DICTID = 10;    /* i: waiting for dictionary check value */
var    DICT = 11;      /* waiting for inflateSetDictionary() call */
var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
var        STORED = 14;    /* i: waiting for stored size (length and complement) */
var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
var        LENLENS = 18;   /* i: waiting for code length code lengths */
var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
var            LEN = 21;       /* i: waiting for length/lit/eob code */
var            LENEXT = 22;    /* i: waiting for length extra bits */
var            DIST = 23;      /* i: waiting for distance code */
var            DISTEXT = 24;   /* i: waiting for distance extra bits */
var            MATCH = 25;     /* o: waiting for output space to copy string */
var            LIT = 26;       /* o: waiting for output space to write literal */
var    CHECK = 27;     /* i: waiting for 32-bit check value */
var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
var    DONE = 29;      /* finished check, done -- remain here until reset */
var    BAD = 30;       /* got a data error -- remain here until reset */
var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_WBITS = MAX_WBITS;


function zswap32(q) {
  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
}


function InflateState() {
  this.mode = 0;             /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
  this.work = new utils.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) { return Z_STREAM_ERROR; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null/*Z_NULL*/;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new utils.Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      utils.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
}

function inflate(strm, flush) {
  var state;
  var input, output;          // input/output buffers
  var next;                   /* next input INDEX */
  var put;                    /* next output INDEX */
  var have, left;             /* available input and output */
  var hold;                   /* bit buffer */
  var bits;                   /* bits in bit buffer */
  var _in, _out;              /* save starting available input and output */
  var copy;                   /* number of stored or match bytes to copy */
  var from;                   /* where to copy match bytes from */
  var from_source;
  var here = 0;               /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len;                    /* length to copy for repeats, bits to drop */
  var ret;                    /* return code */
  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];


  if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        state.flags = 0;           /* expect zlib header */
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        else if (len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }
        state.dmax = 1 << len;
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Array(state.head.extra_len);
              }
              utils.arraySet(
                state.head.extra,
                input,
                next,
                // extra field is limited to 65536 bytes
                // - no need for additional size check
                copy,
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          utils.arraySet(output, input, next, copy, put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inflate_fast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if (_out) {
            strm.adler = state.check =
                /*UPDATE(state.check, put - _out, _out);*/
                (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
    return Z_STREAM_ERROR;
  }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;

  /* check state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK;
}

function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;

  var state;
  var dictid;
  var ret;

  /* check state */
  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK;
}

exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
var BAD = 30;       /* got a data error -- remain here until reset */
var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
module.exports = function inflate_fast(strm, start) {
  var state;
  var _in;                    /* local strm.input */
  var last;                   /* have enough input while in < last */
  var _out;                   /* local strm.output */
  var beg;                    /* inflate()'s initial strm.output */
  var end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  var dmax;                   /* maximum distance from zlib header */
//#endif
  var wsize;                  /* window size or zero if not using window */
  var whave;                  /* valid bytes in the window */
  var wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  var s_window;               /* allocated sliding window, if wsize != 0 */
  var hold;                   /* local strm.hold */
  var bits;                   /* local strm.bits */
  var lcode;                  /* local strm.lencode */
  var dcode;                  /* local strm.distcode */
  var lmask;                  /* mask for first level of length codes */
  var dmask;                  /* mask for first level of distance codes */
  var here;                   /* retrieved table entry */
  var op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  var len;                    /* match length, unused bytes */
  var dist;                   /* match distance */
  var from;                   /* where to copy match from */
  var from_source;


  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils = __webpack_require__(12);

var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

var lbase = [ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

var lext = [ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];

var dbase = [ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
];

module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
{
  var bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  var len = 0;               /* a code's length in bits */
  var sym = 0;               /* index of code symbols */
  var min = 0, max = 0;          /* minimum and maximum code lengths */
  var root = 0;              /* number of index bits for root table */
  var curr = 0;              /* number of index bits for current table */
  var drop = 0;              /* code bits to drop for sub-table */
  var left = 0;                   /* number of prefix codes available */
  var used = 0;              /* code entries in table used */
  var huff = 0;              /* Huffman code */
  var incr;              /* for incrementing code, index */
  var fill;              /* index for replicating entries */
  var low;               /* low bits for current root entry */
  var mask;              /* mask for low root bits */
  var next;             /* next available space in table */
  var base = null;     /* base value table to use */
  var base_index = 0;
//  var shoextra;    /* extra bits table to use */
  var end;                    /* use base and extra for symbol > end */
  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work;    /* dummy value--not used */
    end = 19;

  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

module.exports = GZheader;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

class ActionsManager {
  constructor(client) {
    this.client = client;

    this.register(__webpack_require__(154));
    this.register(__webpack_require__(155));
    this.register(__webpack_require__(156));
    this.register(__webpack_require__(157));
    this.register(__webpack_require__(158));
    this.register(__webpack_require__(159));
    this.register(__webpack_require__(160));
    this.register(__webpack_require__(161));
    this.register(__webpack_require__(162));
    this.register(__webpack_require__(163));
    this.register(__webpack_require__(164));
    this.register(__webpack_require__(165));
    this.register(__webpack_require__(166));
    this.register(__webpack_require__(167));
    this.register(__webpack_require__(168));
    this.register(__webpack_require__(169));
    this.register(__webpack_require__(170));
    this.register(__webpack_require__(171));
    this.register(__webpack_require__(172));
    this.register(__webpack_require__(173));
    this.register(__webpack_require__(174));
    this.register(__webpack_require__(175));
    this.register(__webpack_require__(176));
    this.register(__webpack_require__(177));
    this.register(__webpack_require__(178));
    this.register(__webpack_require__(179));
  }

  register(Action) {
    this[Action.name.replace(/Action$/, '')] = new Action(this.client);
  }
}

module.exports = ActionsManager;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
const { Events } = __webpack_require__(0);

class MessageCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const channel = client.channels.get(data.channel_id);
    if (channel) {
      const existing = channel.messages.get(data.id);
      if (existing) return { message: existing };
      const message = channel.messages.add(data);
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
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
const Collection = __webpack_require__(2);
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
        if (message) {
          messages.set(message.id, message);
          channel.messages.delete(id);
        }
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
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);

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
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);

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
    const reaction = message.reactions.add({
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
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
const { Events } = __webpack_require__(0);

class ChannelCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const existing = client.channels.has(data.id);
    const channel = client.channels.add(data);
    if (!existing && channel) {
      client.emit(Events.CHANNEL_CREATE, channel);
    }
    return { channel };
  }
}

module.exports = ChannelCreateAction;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);

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
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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

      for (const channel of guild.channels.values()) this.client.channels.remove(channel.id);
      if (guild.voiceConnection) guild.voiceConnection.disconnect();

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
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
const { Events } = __webpack_require__(0);

class GuildBanRemove extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    const user = client.users.add(data.user);
    if (guild && user) client.emit(Events.GUILD_BAN_REMOVE, guild, user);
  }
}

module.exports = GuildBanRemove;


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
const { Events } = __webpack_require__(0);

class GuildRoleCreate extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let role;
    if (guild) {
      const already = guild.roles.has(data.role.id);
      role = guild.roles.add(data.role);
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
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);

class GuildSync extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.id);
    if (guild) {
      if (data.presences) {
        for (const presence of data.presences) guild.presences.add(presence);
      }

      if (data.members) {
        for (const syncMember of data.members) {
          const member = guild.members.get(syncMember.user.id);
          if (member) {
            member._patch(syncMember);
          } else {
            guild.members.add(syncMember, false);
          }
        }
      }

      if ('large' in data) guild.large = data.large;
    }
  }
}

module.exports = GuildSync;


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
const { Events } = __webpack_require__(0);

class GuildEmojiCreateAction extends Action {
  handle(guild, createdEmoji) {
    const emoji = guild.emojis.add(createdEmoji);
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
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);
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
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);

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
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);

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
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

const Action = __webpack_require__(3);

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
/* 180 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 181 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 182 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 183 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 184 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
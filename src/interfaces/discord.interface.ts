import { EmbedBuilder } from '@discordjs/builders';

export interface DiscordConfig {
  webHookUrl: string;
  /**
   * @description you can use "here" and "everyone" to mention or set a userId or roleId to mention persons. note that don't pass @ in mention text
   * @see  {@link https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID- Where can I find my User OR Role ID}
   * */
  mentionList?: Array<'here' | 'everyone' | string>;
}

export interface IDiscordBody {
  /**
   * @description the message contents (up to 2000 characters)
   */
  content?: string;

  /**
   * @description override the default username of the webhook
   */
  username?: string;

  /**
   * @description override the default avatar of the webhook
   */
  avatar_url?: string;

  /**
   * @description true if this is a TTS message
   */
  tts?: boolean;

  /**
   * @description message can be generated in embeds
   * @overview Array of up to 10 embed objects
   * @see {@link https://discord.com/developers/docs/resources/channel#embed-object Embed Object Structure}
   * @see {@link https://discordjs.guide/popular-topics/embeds.html#embed-preview How To Generate Embeds With EmbedBuilder Class}
   */
  embeds?: Array<EmbedBuilder | Embedded>;

  /**
   * @description allowed mentions for the message
   * @type  allowed mention object
   * @see {@link https://discord.com/developers/docs/resources/channel#allowed-mentions-objectallowed }
   */
  allowed_mentions?: AllowedMentions;

  /**
   * @description the components to include with the message
   * @type  array of message component
   * @see {@link https://discord.com/developers/docs/interactions/message-components#component-objectmessage }
   */
  components?: Array<string>;

  /**
   * @description the contents of the file being sent
   * @type  file contents
   */
  files?: any;

  /**
   * @description JSON encoded body of non-file params
   */
  payload_json?: string;

  /**
   * @description attachment objects with filename and description
   * @type  array of partial attachment objects
   * @see {@link https://discord.com/developers/docs/resources/channel#attachment-objectattachment}
   */
  attachments?: any;
}

interface AllowedMentions {
  parse?: Array<Allowed_Mention_Types>; //	array of allowed mention types	An array of allowed mention types to parse from the content.
  roles?: Array<string>; //	list of snowflakes	Array of role_ids to mention (Max size of 100)
  users?: Array<string>; //	list of snowflakes	Array of user_ids to mention (Max size of 100)
  replied_user?: boolean; //	For replies, whether to mention the author of the message being replied to (default false)
}

interface Embedded {
  title?: string; //	title of embed
  type?: 'rich'; //string	type of embed (always "rich" for webhook embeds)
  description?: string; //	description of embed
  url?: string; //	url of embed
  timestamp?: string; //	ISO8601 timestamp of embed content
  color?: number; //	integer	color code of the embed
  footer?: EmbeddedFooter; //	embed footer object	footer information
  image?: EmbeddedImage; //	embed image object	image information
  thumbnail?: EmbeddedThumbnail; //	embed thumbnail object	thumbnail information
  video?: any; //	embed video object	video information
  provider?: EmbeddedProvider; //embed provider object	provider information
  author?: any; //embed author object	author information
  fields?: Array<EmbeddedField>; //	array of embed field objects	fields information
}
interface EmbeddedField {
  name: string; //	name of the field
  value: string; //	value of the field
  inline?: boolean; //whether or not this field should display inline
}
interface EmbeddedProvider {
  name?: string; //	name of provider
  url?: string; //	url of provider
}
interface EmbeddedThumbnail {
  url: string; //source url of thumbnail (only supports http(s) and attachments)
  proxy_url?: string; //a proxied url of the thumbnail
  height?: number; //	height of thumbnail
  width?: number; //width of thumbnail
}
interface EmbeddedImage {
  url: string; //	source url of image (only supports http(s) and attachments)
  proxy_url?: string; //	a proxied url of the image
  height?: number; //	height of image
  width?: number; //	width of image
}
interface EmbeddedFooter {
  text: string; //	footer text
  icon_url?: string; //	url of footer icon (only supports http(s) and attachments)
  proxy_icon_url?: string; //a proxied url of footer icon
}

export enum Allowed_Mention_Types {
  RoleMentions = 'roles', //	Controls role mentions
  UserMentions = 'users', //	Controls user mentions
  EveryoneMentions = 'everyone', //	Controls @everyone and @here mentions
}

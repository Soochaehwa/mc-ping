/**
 * @param port The server port.
 * @param timeout The read/write socket timeout.
 * @param decode Whether to decode Forge binary data.
 */
type PingOptions = {
  port: number;
  timeout: number;
  decode: boolean;
};

export type SampleProp = {
  name: string;
  id: string;
};

export interface ForgeData {
  channels: Channel[];
  mods: Mod[];
  fmlNetworkVersion: number;
  truncated: boolean;
  d?: string; // Forge binary data
}

export interface Channel {
  res: string;
  version: string;
  required: boolean;
}

export interface Mod {
  modId: string;
  modmarker: string;
}

export interface ModpackData {
  protectID: number;
  name: string;
  version: string;
  versionID: number;
  releaseType?: string;
  isMetadata: boolean;
}

export interface ModList {
  modid: string;
  version: string;
}

export interface ModInfo {
  modList: ModList[];
  type: string;
}
/**
 * `JSON Response` field of Response packet.
 * @see https://wiki.vg/Server_List_Ping#Response
 */
export type JavaPingResponse = {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    online: number;
    sample: SampleProp[];
  };
  description: string;
  favicon: string;
  forgeData?: ForgeData; // Forge 1.13+
  modinfo?: ModInfo; // Forge 1.7 - 1.12
  modpackData?: ModpackData;
  preventsChatReports?: boolean;
  previewsChat?: boolean;
  enforcesSecureChat?: boolean;
  ip: string;
  port: number;
  latency: number;
  srvRecord: {
    host: string;
    port: number;
  } | null;
};

/**
 * Asynchronously ping Minecraft Java server.
 *
 * The optional `options` argument can be an object with a `ping` (default is `25565`) or/and `timeout` (default is `5000`) property.
 *
 * @param host The Java server address.
 * @param options The configuration for pinging Minecraft Java server.
 *
 * ```js
 * import { pingJava } from '@minescope/mineping';
 *
 * const data = await pingJava('mc.hypixel.net');
 * console.log(data);
 * ```
 *
 * The resulting output will resemble:
 * ```console
 * {
 * version: { name: 'Requires MC 1.8 / 1.18', protocol: 47 },
 * players: { max: 200000, online: 67336, sample: [] },
 * description: '   §f☃ §aHypixel Network  §eTRIPLE COINS & EXP §f☃\n' +
 *   '     §6✰ §f§lHOLIDAY SALE §c§lUP TO 85% OFF §6✰',
 * favicon: 'data:image/png;base64,iVBORw0KGg...
 * }
 * ```
 * @see [source](https://github.com/minescope/mineping/blob/8c84925ef7f5c420a7ef52740cba027491e82934/lib/bedrock.js#L158)
 */
export function pingJava(host: string, options?: PingOptions): Promise<JavaPingResponse>;

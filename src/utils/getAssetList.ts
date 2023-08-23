import { AssetResponseType, AssetTarget, AssetType } from "../interfaces/Asset";

/**
 * Gets a list of available files from the CDN.
 *
 * @template T The type of the response.
 * @param {AssetTarget} namespace The namespace to fetch.
 * @param {AssetType} assetType The asset type to fetch.
 * @returns {T} The list of files matching the prefix.
 */
export const getAssetList = async <T extends AssetResponseType>(
  namespace: AssetTarget,
  assetType: AssetType
): Promise<T> => {
  const raw = await fetch(
    `https://asset-list.naomi.lgbt/json/${namespace}/${assetType}.json`
  );
  const parsed = (await raw.json()) as T;
  return parsed;
};

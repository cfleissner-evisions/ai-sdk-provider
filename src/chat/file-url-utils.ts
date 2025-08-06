import type { LanguageModelV2FilePart } from '@ai-sdk/provider';

import { convertUint8ArrayToBase64 } from '@ai-sdk/provider-utils';
import { isUrl } from './is-url';

export function getFileUrl({
  part,
  defaultMediaType,
}: {
  part: LanguageModelV2FilePart;
  defaultMediaType: string;
}) {
  // Handle URL objects
  if (part.data instanceof URL) {
    return part.data.toString();
  }

  // Handle Uint8Array
  if (part.data instanceof Uint8Array) {
    const base64 = convertUint8ArrayToBase64(part.data);
    return `data:${part.mediaType ?? defaultMediaType};base64,${base64}`;
  }

  const stringData = part.data.toString();

  // Handle HTTP/HTTPS URLs
  if (
    isUrl({
      url: stringData,
      protocols: new Set(['http:', 'https:']),
    })
  ) {
    return stringData;
  }

  // Handle data URLs (already properly formatted)
  if (stringData.startsWith('data:')) {
    return stringData;
  }

  // Handle base64 strings (assume they need data URL wrapper)
  return `data:${part.mediaType ?? defaultMediaType};base64,${stringData}`;
}

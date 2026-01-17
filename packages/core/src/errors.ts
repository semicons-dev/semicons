export interface SemiconsErrorDetails {
  tokenName?: string;
  fieldPath: string;
}

export class SemiconsError extends Error {
  code: string;
  details: SemiconsErrorDetails;

  constructor(
    code: string,
    message: string,
    details: SemiconsErrorDetails
  ) {
    super(message);
    this.name = 'SemiconsError';
    this.code = code;
    this.details = details;
  }
}

export type ErrorCode =
  | 'INVALID_TOKEN_NAME'
  | 'INVALID_ASSET_REF'
  | 'UNKNOWN_NAMESPACE'
  | 'MISSING_THEME'
  | 'MISSING_DEFAULT_THEME'
  | 'MISSING_THEMES_CONFIG'
  | 'THEME_CONFLICT'
  | 'TOKEN_DEPRECATED';

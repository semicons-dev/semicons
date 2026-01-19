import { Position, Range, type TextDocument } from 'vscode';

export interface TokenMatch {
  name: string;
  range: Range;
  isAttributeValue: boolean;
}

const ICON_TAG_REGEX = /<Icon\b/gi;
const NAME_ATTR_REGEX = /\s+name\s*=\s*["']([^"']+)["']/g;
const VUE_NAME_ATTR_REGEX = /\s+:name\s*=\s*["']([^"']+)["']/g;

export function findIconTokens(document: TextDocument): TokenMatch[] {
  const text = document.getText();
  const matches: TokenMatch[] = [];
  
  let match;
  
  // Match <Icon name="..."> patterns
  while ((match = ICON_TAG_REGEX.exec(text)) !== null) {
    const tagStart = match.index;
    const tagEnd = tagStart + match[0].length;
    
    // Look for name attribute after the tag
    const remainingText = text.substring(tagEnd);
    
    // Check for name="value"
    let nameMatch;
    const nameRegex = new RegExp(NAME_ATTR_REGEX);
    while ((nameMatch = nameRegex.exec(remainingText)) !== null) {
      const nameStart = tagEnd + nameMatch.index;
      const nameEnd = nameStart + nameMatch[0].length;
      const nameValue = nameMatch[1];
      
      const startPos = document.positionAt(nameStart);
      const endPos = document.positionAt(nameEnd);
      
      matches.push({
        name: nameValue,
        range: new Range(startPos, endPos),
        isAttributeValue: true,
      });
    }
    
    // Check for Vue :name="'value'"
    const vueNameRegex = new RegExp(VUE_NAME_ATTR_REGEX);
    while ((nameMatch = vueNameRegex.exec(remainingText)) !== null) {
      const nameStart = tagEnd + nameMatch.index;
      const nameEnd = nameStart + nameMatch[0].length;
      const nameValue = nameMatch[1];
      
      const startPos = document.positionAt(nameStart);
      const endPos = document.positionAt(nameEnd);
      
      matches.push({
        name: nameValue,
        range: new Range(startPos, endPos),
        isAttributeValue: true,
      });
    }
  }
  
  return matches;
}

export function extractTokenNameAtPosition(
  document: TextDocument,
  position: Position
): string | null {
  const matches = findIconTokens(document);
  
  for (const match of matches) {
    if (match.range.contains(position)) {
      return match.name;
    }
  }
  
  return null;
}

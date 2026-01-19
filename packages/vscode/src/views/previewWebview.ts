import { window, ViewColumn, Uri, type WebviewPanel } from 'vscode';
import type { Token, Registry } from '../registry/types';
import { resolveAssetToFileUri, readSvgContent } from '../utils/path';

interface PreviewState {
  token: Token;
  registry: Registry;
  folderUri: Uri;
}

export class PreviewWebview {
  private panel: WebviewPanel | null = null;
  private state: PreviewState | null = null;

  async show(token: Token, registry: Registry, folderUri: Uri): Promise<void> {
    this.state = { token, registry, folderUri };
    
    if (this.panel) {
      this.panel.reveal(ViewColumn.Beside);
      this.updatePanel();
    } else {
      this.panel = window.createWebviewPanel(
        'semiconsPreview',
        `Preview: ${token.name}`,
        ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [folderUri],
        }
      );
      
      this.panel.onDidDispose(() => {
        this.panel = null;
        this.state = null;
      });
      
      this.updatePanel();
    }
  }

  private async updatePanel(): Promise<void> {
    if (!this.panel || !this.state) {
      return;
    }

    const { token, registry, folderUri } = this.state;
    const theme = registry.defaultTheme;
    const assetRef = token.themes[theme] || Object.values(token.themes)[0];
    
    // Try to get real SVG content
    const fileUri = await resolveAssetToFileUri(assetRef, folderUri);
    let svgContent: string | null = null;
    let svgExists = false;
    
    if (fileUri) {
      svgContent = await readSvgContent(fileUri);
      svgExists = svgContent !== null;
    }
    
    // Build preview HTML
    const previewHtml = svgExists && svgContent
      ? this.wrapSvg(svgContent)
      : this.createPlaceholder(token.name, assetRef, svgExists);
    
    const html = this.buildHtml(token, registry, assetRef, previewHtml);
    
    this.panel.webview.html = html;
  }

  private wrapSvg(svg: string): string {
    // Remove existing width/height/viewBox for consistent sizing
    return svg
      .replace(/\s+width="[^"]*"/g, '')
      .replace(/\s+height="[^"]*"/g, '')
      .replace(/\s+viewBox="[^"]*"/g, '')
      .replace(/^<svg/, '<svg width="100%" height="100%" viewBox="0 0 24 24"');
  }

  private createPlaceholder(name: string, assetRef: string, fileExists: boolean): string {
    return `
      <div class="placeholder">
        <div class="placeholder-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        </div>
        <p class="placeholder-text">${fileExists ? 'Preview unavailable' : 'File not found'}</p>
        <p class="placeholder-ref">${assetRef}</p>
        ${!fileExists ? `<p class="placeholder-hint">Expected: ${name.replace('local:', 'icons/local/') + '.svg'}</p>` : ''}
      </div>
    `;
  }

  private buildHtml(token: Token, registry: Registry, assetRef: string, previewHtml: string): string {
    const deprecated = token.meta.deprecated;
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${token.name}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 16px;
      background: #1e1e2e;
      color: #cdd6f4;
    }
    .header {
      margin-bottom: 16px;
    }
    .token-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    .token-name.deprecated {
      text-decoration: line-through;
      opacity: 0.7;
    }
    .token-ref {
      font-family: 'Fira Code', monospace;
      font-size: 12px;
      color: #a6adc8;
      background: #313244;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .section {
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 12px;
      text-transform: uppercase;
      color: #6c7086;
      margin-bottom: 8px;
    }
    .preview-container {
      background: #181825;
      border-radius: 8px;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 120px;
    }
    .preview-container svg {
      max-width: 100%;
      max-height: 100px;
    }
    .placeholder {
      text-align: center;
      padding: 24px;
    }
    .placeholder-icon {
      opacity: 0.3;
      margin-bottom: 8px;
    }
    .placeholder-text {
      font-size: 14px;
      color: #a6adc8;
      margin: 0 0 4px 0;
    }
    .placeholder-ref {
      font-family: 'Fira Code', monospace;
      font-size: 11px;
      color: #6c7086;
      margin: 0 0 8px 0;
    }
    .placeholder-hint {
      font-size: 11px;
      color: #f38ba8;
      margin: 0;
    }
    .meta-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tag {
      font-size: 11px;
      background: #313244;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .warning {
      background: #f9e2af;
      color: #1e1e2e;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="token-name ${deprecated ? 'deprecated' : ''}">${token.name}</h1>
    <span class="token-ref">${assetRef}</span>
  </div>
  
  ${deprecated ? `<div class="warning">⚠️ Deprecated: ${typeof deprecated === 'string' ? deprecated : 'This icon is deprecated'}</div>` : ''}
  
  <div class="section">
    <div class="section-title">Preview</div>
    <div class="preview-container">
      ${previewHtml}
    </div>
  </div>
  
  ${token.a11y?.label ? `
  <div class="section">
    <div class="section-title">Accessibility</div>
    <div>aria-label: "${token.a11y.label}"</div>
  </div>
  ` : ''}
  
  ${token.meta.description ? `
  <div class="section">
    <div class="section-title">Description</div>
    <div>${token.meta.description}</div>
  </div>
  ` : ''}
  
  ${token.meta.tags && token.meta.tags.length > 0 ? `
  <div class="section">
    <div class="section-title">Tags</div>
    <div class="meta-row">
      ${token.meta.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
  </div>
  ` : ''}
  
  <div class="section">
    <div class="section-title">Usage</div>
    <pre style="background: #313244; padding: 12px; border-radius: 6px; overflow-x: auto;"><code>&lt;Icon name="${token.name}" /&gt;</code></pre>
  </div>
</body>
</html>`;
  }

  dispose(): void {
    if (this.panel) {
      this.panel.dispose();
      this.panel = null;
    }
    this.state = null;
  }
}

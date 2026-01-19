import { Uri, workspace } from 'vscode';

export interface SemiconsConfig {
  registryPath: string;
  localIconDir: string;
  iconComponentName: string;
}

export function getSemiconsConfig(folder?: Uri): SemiconsConfig {
  const config = workspace.getConfiguration('semicons', folder);
  
  return {
    registryPath: config.get<string>('registryPath', 'src/icons.generated/registry.json'),
    localIconDir: config.get<string>('localIconDir', 'icons/local'),
    iconComponentName: config.get<string>('iconComponentName', 'Icon'),
  };
}

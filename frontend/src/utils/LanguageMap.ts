// Define supported language identifiers from Monaco Editor
export type MonacoLanguage =
  | 'typescript'
  | 'javascript'
  | 'html'
  | 'css'
  | 'json'
  | 'python'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'markdown'
  | 'yaml'
  | 'xml'
  | 'sql'
  | 'c'
  | "plaintext";

export class LanguageMapper {
  private extensionMap: Map<string, MonacoLanguage>;

  constructor() {
    this.extensionMap = new Map([
      // JavaScript/TypeScript
      ['ts', 'typescript'],
      ['tsx', 'typescript'],
      ['js', 'javascript'],
      ['jsx', 'javascript'],
      ['mjs', 'javascript'],
      
      // Web
      ['html', 'html'],
      ['htm', 'html'],
      ['css', 'css'],
      ['scss', 'css'],
      ['less', 'css'],
      ['json', 'json'],
      
      // Backend languages
      ['py', 'python'],
      ['java', 'java'],
      ['cpp', 'cpp'],
      ['cc', 'cpp'],
      ['hpp', 'cpp'],
      ['h', 'cpp'],
      ['cs', 'csharp'],
      ['php', 'php'],
      ['rb', 'ruby'],
      ['c','c'],
      
      // Markup/Config
      ['md', 'markdown'],
      ['markdown', 'markdown'],
      ['yml', 'yaml'],
      ['yaml', 'yaml'],
      ['xml', 'xml'],
      ['sql', 'sql'],
      ['txt',"plaintext"]
    ]);
  }

  /**
   * Get the Monaco language identifier from a file extension
   * @param filename The filename or file extension
   * @returns The corresponding Monaco language identifier or null if not found
   */
  getLanguage(filename: string): MonacoLanguage {
    // Extract extension from filename
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    // Return the mapped language or default to plaintext
    return this.extensionMap.get(extension) || 'plaintext';
  }

  /**
   * Add a custom file extension mapping
   * @param extension The file extension without the dot
   * @param language The Monaco language identifier
   */
  addMapping(extension: string, language: MonacoLanguage): void {
    this.extensionMap.set(extension.toLowerCase(), language);
  }

  /**
   * Get all supported file extensions
   * @returns Array of supported extensions
   */
  getSupportedExtensions(): string[] {
    return Array.from(this.extensionMap.keys());
  }
}
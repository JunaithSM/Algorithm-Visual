"use client";

import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";
import Editor, { OnMount, BeforeMount, EditorProps } from "@monaco-editor/react";
import {
  Settings,
  X,
  Code2,
  Type,
  WrapText,
  Hash,
  Palette,
  RotateCw,
  FileText,
  Play,
  Columns2,
  Maximize2,
} from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

export interface CodeAreaProps {
  /** Current editor content value */
  value?: string;
  /** Initial editor content value when uncontrolled */
  defaultValue?: string;
  /** Programming language for syntax highlighting & IntelliSense */
  language?: string;
  /** Callback when language selection changes */
  onLanguageChange?: (language: string) => void;
  /** Editor theme: 'vs-dark' | 'light' | 'hc-black' | 'dracula' | 'one-dark' | 'github-dark' */
  theme?: string;
  /** Callback when theme selection changes */
  onThemeChange?: (theme: string) => void;
  /** Currently active line number to highlight during execution animation */
  highlightedLine?: number;
  /** Callback fired when the editor content changes */
  onChange?: (value: string | undefined) => void;
  /** Callback fired when font size changes */
  onFontSizeChange?: (fontSize: number) => void;
  /** Callback fired when font family changes */
  onFontFamilyChange?: (fontFamily: string) => void;
  /** Callback fired when the Monaco editor instance mounts */
  onMount?: OnMount;
  /** Callback fired before the editor instance mounts */
  beforeMount?: BeforeMount;
  /** Read-only mode flag */
  readOnly?: boolean;
  /** Editor container height (CSS string or number of pixels). Default: '100%' */
  height?: string | number;
  /** Editor container width (CSS string or number of pixels). Default: '100%' */
  width?: string | number;
  /** Editor font size in pixels. Default: 14 */
  fontSize?: number;
  /** Font family for the editor code text */
  fontFamily?: string;
  /** Line numbers display mode: 'on' | 'off' | 'relative' | 'interval' */
  lineNumbers?: "on" | "off" | "relative" | "interval";
  /** Enable or disable the minimap sidebar. Default: false */
  minimap?: boolean;
  /** Word wrapping behavior: 'on' | 'off' | 'wordWrapColumn' | 'bounded' */
  wordWrap?: "on" | "off" | "wordWrapColumn" | "bounded";
  /** Number of spaces per tab indent. Default: 4 */
  tabSize?: number;
  /** Custom fallback loading UI while Monaco initializes */
  loading?: React.ReactNode;
  /** Additional CSS class names for the wrapping container */
  className?: string;
  /** Direct Monaco editor options override */
  options?: EditorProps["options"];
  /** Callback fired when user switches panel workspace view mode */
  onSelectView?: (view: "split" | "code" | "visualizer" | "description") => void;
  /** Active workspace panel view */
  activeView?: "split" | "code" | "visualizer" | "description";
}

/**
 * Custom Theme Definitions for Monaco
 */
const defineCustomThemes = (monaco: Parameters<BeforeMount>[0]) => {
  monaco.editor.defineTheme("dracula", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "type", foreground: "8be9fd" },
      { token: "function", foreground: "50fa7b" },
      { token: "variable", foreground: "f8f8f2" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#44475a",
      "editor.lineHighlightBackground": "#44475a44",
      "editorCursor.foreground": "#f8f8f2",
      "editorWhitespace.foreground": "#6272a4",
      "editorIndentGuide.background": "#44475a",
    },
  });

  monaco.editor.defineTheme("one-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "5c6370", fontStyle: "italic" },
      { token: "keyword", foreground: "c678dd" },
      { token: "string", foreground: "98c379" },
      { token: "number", foreground: "d19a66" },
      { token: "type", foreground: "e5c07b" },
      { token: "function", foreground: "61afef" },
      { token: "variable", foreground: "abb2bf" },
    ],
    colors: {
      "editor.background": "#1e222a",
      "editor.foreground": "#abb2bf",
      "editor.selectionBackground": "#3e4451",
      "editor.lineHighlightBackground": "#2c313a",
      "editorCursor.foreground": "#528bfc",
    },
  });

  monaco.editor.defineTheme("github-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8b949e", fontStyle: "italic" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "string", foreground: "a5d6ff" },
      { token: "number", foreground: "79c0ff" },
      { token: "type", foreground: "ffa657" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "c9d1d9" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.selectionBackground": "#264f78",
      "editor.lineHighlightBackground": "#161b22",
      "editorCursor.foreground": "#58a6ff",
    },
  });
};

/**
 * Normalizes language names to valid Monaco language identifiers
 */
const normalizeLanguage = (lang: string): string => {
  const lowered = lang.toLowerCase().trim();
  switch (lowered) {
    case "c++": return "cpp";
    case "c#": return "csharp";
    case "bash":
    case "sh":
    case "zsh": return "shell";
    case "js": return "javascript";
    case "ts": return "typescript";
    case "py": return "python";
    case "kt": return "kotlin";
    case "rb": return "ruby";
    default: return lowered;
  }
};

/**
 * CodeArea Component
 *
 * Multi-language Code Editor with top-left Language Selector (alphabetically ascending),
 * top-right Settings Icon Popover (Theme, Font Size, Font Family, Word Wrap, Relative Line Numbers),
 * font scaling, and active execution line highlighting.
 */
export const CodeArea: React.FC<CodeAreaProps> = ({
  value,
  defaultValue,
  language = "javascript",
  onLanguageChange,
  theme = "vs-dark",
  onThemeChange,
  highlightedLine,
  onChange,
  onFontSizeChange,
  onFontFamilyChange,
  onMount,
  beforeMount,
  readOnly = false,
  height = "100%",
  width = "100%",
  fontSize = 14,
  fontFamily = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
  lineNumbers = "on",
  minimap = false,
  wordWrap = "on",
  tabSize = 4,
  loading = (
    <div className="flex items-center justify-center h-full font-sans text-sm opacity-50">
      Loading Editor...
    </div>
  ),
  className = "",
  options = {},
  onSelectView,
  activeView = "split",
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const [internalWordWrap, setInternalWordWrap] = useState<boolean>(wordWrap === "on");
  const [internalRelativeLineNumbers, setInternalRelativeLineNumbers] = useState<boolean>(
    lineNumbers === "relative"
  );
  const [internalFontFamily, setInternalFontFamily] = useState<string>(fontFamily);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sort supported languages in ascending alphabetical order
  const sortedLanguages = useMemo(() => {
    return [...SUPPORTED_LANGUAGES].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  // Close settings popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSettingsOpen &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  const onFontSizeChangeRef = useRef(onFontSizeChange);
  useEffect(() => {
    onFontSizeChangeRef.current = onFontSizeChange;
  }, [onFontSizeChange]);

  const fontSizeRef = useRef(fontSize);
  useEffect(() => {
    fontSizeRef.current = fontSize;
  }, [fontSize]);

  // Handle active line decoration highlighting when highlightedLine prop changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;

      if (highlightedLine && highlightedLine > 0) {
        decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
          {
            range: new monaco.Range(highlightedLine, 1, highlightedLine, 1),
            options: {
              isWholeLine: true,
              className: "monaco-line-highlight-active",
              glyphMarginClassName: "monaco-glyph-active",
            },
          },
        ]);
        editor.revealLineInCenterIfOutsideViewport(highlightedLine);
      } else if (decorationsRef.current.length > 0) {
        decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
      }
    }
  }, [highlightedLine]);

  const handleBeforeMount: BeforeMount = useCallback(
    (monaco) => {
      defineCustomThemes(monaco);
      if (beforeMount) {
        beforeMount(monaco);
      }
    },
    [beforeMount]
  );

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      const domNode = editor.getDomNode();

      // Intercept Ctrl + Wheel scroll for font scaling
      if (domNode) {
        let lastWheelTime = 0;
        const onWheel = (e: WheelEvent) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const now = Date.now();
            if (now - lastWheelTime < 35) return;
            lastWheelTime = now;

            const currentSize = fontSizeRef.current;
            const delta = e.deltaY < 0 ? 1 : -1;
            const nextSize = Math.min(36, Math.max(8, currentSize + delta));

            if (nextSize !== currentSize && onFontSizeChangeRef.current) {
              onFontSizeChangeRef.current(nextSize);
            }
          }
        };

        domNode.addEventListener("wheel", onWheel, { passive: false });
      }

      // Key commands
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal, () => {
        const currentSize = fontSizeRef.current;
        const nextSize = Math.min(36, currentSize + 1);
        if (onFontSizeChangeRef.current) {
          onFontSizeChangeRef.current(nextSize);
        }
      });

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus, () => {
        const currentSize = fontSizeRef.current;
        const nextSize = Math.max(8, currentSize - 1);
        if (onFontSizeChangeRef.current) {
          onFontSizeChangeRef.current(nextSize);
        }
      });

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0, () => {
        if (onFontSizeChangeRef.current) {
          onFontSizeChangeRef.current(14);
        }
      });

      if (onMount) {
        onMount(editor, monaco);
      }
    },
    [onMount]
  );

  const computedWordWrap = internalWordWrap ? "on" : "off";
  const computedLineNumbers = internalRelativeLineNumbers ? "relative" : "on";

  const editorOptions = useMemo<EditorProps["options"]>(
    () => ({
      readOnly,
      fontSize,
      fontFamily: internalFontFamily,
      lineNumbers: computedLineNumbers,
      glyphMargin: true,
      minimap: { enabled: minimap },
      wordWrap: computedWordWrap,
      tabSize,
      mouseWheelZoom: false,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      padding: { top: 12, bottom: 12 },
      formatOnPaste: true,
      formatOnType: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      renderLineHighlight: "all",
      fontLigatures: true,
      ...options,
    }),
    [
      readOnly,
      fontSize,
      internalFontFamily,
      computedLineNumbers,
      minimap,
      computedWordWrap,
      tabSize,
      options,
    ]
  );

  const normalizedLang = normalizeLanguage(language);
  const isDark =
    theme.includes("dark") || theme === "hc-black" || theme === "dracula" || theme === "one-dark";

  return (
    <div
      className={`flex flex-col h-full border rounded-lg overflow-hidden transition-colors relative font-sans ${
        isDark
          ? "border-neutral-800 bg-neutral-950 text-white"
          : "border-neutral-200 bg-white text-neutral-900"
      } ${className}`}
      style={{ height, width }}
    >
      {/* Code Area Header Bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b text-xs font-medium z-10 ${
          isDark
            ? "border-neutral-800 bg-neutral-950 text-neutral-200"
            : "border-neutral-200 bg-neutral-50 text-neutral-800"
        }`}
      >
        {/* Top Left: Language Selector (Alphabetically Ascending Order) */}
        <div className="flex items-center gap-2 font-semibold">
          <Code2 className="w-4 h-4 text-sky-400" />
          {onLanguageChange ? (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className={`px-2 py-1 rounded-md border text-xs font-sans font-semibold focus:outline-none cursor-pointer ${
                isDark
                  ? "bg-neutral-900 border-neutral-800 text-white focus:border-neutral-700"
                  : "bg-white border-neutral-300 text-black focus:border-neutral-400"
              }`}
            >
              {sortedLanguages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="font-semibold text-xs capitalize font-sans">{language}</span>
          )}
        </div>

        {/* Top Right: Header Buttons (Settings) */}
        <div className="flex items-center gap-2">
          <button
            ref={settingsBtnRef}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            title="Code Editor Settings"
            className={`p-1.5 rounded-md border transition cursor-pointer flex items-center justify-center ${
              isSettingsOpen
                ? "bg-sky-500/20 border-sky-500/40 text-sky-400"
                : isDark
                ? "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                : "bg-neutral-100 border-neutral-300 text-neutral-600 hover:text-black hover:border-neutral-400"
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Area Settings Popover Dropdown Menu (Dynamic Theme Support) */}
      <div
        ref={settingsRef}
        className={`absolute top-11 right-4 z-50 w-72 p-4 rounded-xl border shadow-2xl transition-all duration-200 ease-out origin-top-right font-sans ${
          isDark
            ? "border-neutral-800 bg-neutral-900 text-neutral-100"
            : "border-neutral-200 bg-white text-neutral-900"
        } ${
          isSettingsOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Popover Header */}
        <div
          className={`flex items-center justify-between pb-2.5 mb-3 border-b ${
            isDark ? "border-neutral-800" : "border-neutral-100"
          }`}
        >
          <div
            className={`flex items-center gap-2 font-semibold text-xs uppercase tracking-wider ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            <Settings className={`w-3.5 h-3.5 ${isDark ? "text-neutral-300" : "text-neutral-700"}`} />
            <span>Editor Settings</span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className={`p-1 rounded-md transition cursor-pointer ${
              isDark
                ? "hover:bg-neutral-800 text-neutral-400 hover:text-white"
                : "hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800"
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-sans">
          {/* 1. Editor Theme Dropdown */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Palette className={`w-3.5 h-3.5 ${isDark ? "text-neutral-400" : "text-neutral-500"}`} />
              <span>Theme</span>
            </div>
            {onThemeChange ? (
              <select
                value={theme}
                onChange={(e) => onThemeChange(e.target.value)}
                className={`px-2 py-1 rounded border text-xs focus:outline-none cursor-pointer font-sans ${
                  isDark
                    ? "bg-neutral-950 border-neutral-800 text-white"
                    : "bg-neutral-100 border-neutral-300 text-black"
                }`}
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="dracula">Dracula</option>
                <option value="one-dark">One Dark</option>
                <option value="github-dark">GitHub Dark</option>
              </select>
            ) : (
              <span className="font-semibold capitalize">{theme}</span>
            )}
          </div>

          {/* 2. Font Size Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <Type className={`w-3.5 h-3.5 ${isDark ? "text-neutral-400" : "text-neutral-500"}`} />
                <span>Font Size</span>
              </div>
              <span className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="28"
              step="1"
              value={fontSize}
              onChange={(e) => onFontSizeChange?.(Number(e.target.value))}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                isDark ? "bg-neutral-800 accent-white" : "bg-neutral-200 accent-black"
              }`}
            />
            <div
              className={`flex justify-between text-[10px] font-sans ${
                isDark ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              <span>10px (Small)</span>
              <span>28px (Large)</span>
            </div>
          </div>

          {/* 3. Font Family Selector */}
          <div
            className={`flex items-center justify-between pt-2 border-t ${
              isDark ? "border-neutral-800" : "border-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              <Type className={`w-3.5 h-3.5 ${isDark ? "text-neutral-400" : "text-neutral-500"}`} />
              <span>Font Family</span>
            </div>
            <select
              value={internalFontFamily}
              onChange={(e) => {
                setInternalFontFamily(e.target.value);
                onFontFamilyChange?.(e.target.value);
              }}
              className={`px-2 py-1 rounded border text-xs focus:outline-none cursor-pointer font-sans ${
                isDark
                  ? "bg-neutral-950 border-neutral-800 text-white"
                  : "bg-neutral-100 border-neutral-300 text-black"
              }`}
            >
              <option value="'JetBrains Mono', 'Fira Code', Consolas, monospace">JetBrains Mono</option>
              <option value="'Fira Code', 'JetBrains Mono', Consolas, monospace">Fira Code</option>
              <option value="'Cascadia Code', 'JetBrains Mono', Consolas, monospace">Cascadia Code</option>
              <option value="'Source Code Pro', Consolas, monospace">Source Code Pro</option>
              <option value="Consolas, 'Courier New', monospace">Consolas</option>
              <option value="Monaco, 'Courier New', monospace">Monaco</option>
            </select>
          </div>

          {/* 4. Word Wrap Toggle Row */}
          <div
            className={`flex items-center justify-between pt-2 border-t ${
              isDark ? "border-neutral-800" : "border-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              <WrapText className={`w-3.5 h-3.5 ${isDark ? "text-neutral-400" : "text-neutral-500"}`} />
              <span>Word Wrap</span>
            </div>
            <button
              type="button"
              onClick={() => setInternalWordWrap(!internalWordWrap)}
              aria-label="Toggle Word Wrap"
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center ${
                internalWordWrap
                  ? isDark
                    ? "bg-white"
                    : "bg-black"
                  : isDark
                  ? "bg-neutral-800"
                  : "bg-neutral-200"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${
                  internalWordWrap
                    ? isDark
                      ? "translate-x-4 bg-black"
                      : "translate-x-4 bg-white"
                    : isDark
                    ? "translate-x-0 bg-neutral-400"
                    : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>

          {/* 5. Relative Line Numbers Toggle Row */}
          <div
            className={`flex items-center justify-between pt-2 border-t ${
              isDark ? "border-neutral-800" : "border-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              <Hash className={`w-3.5 h-3.5 ${isDark ? "text-neutral-400" : "text-neutral-500"}`} />
              <span>Relative Line Numbers</span>
            </div>
            <button
              type="button"
              onClick={() => setInternalRelativeLineNumbers(!internalRelativeLineNumbers)}
              aria-label="Toggle Relative Line Numbers"
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer flex items-center ${
                internalRelativeLineNumbers
                  ? isDark
                    ? "bg-white"
                    : "bg-black"
                  : isDark
                  ? "bg-neutral-800"
                  : "bg-neutral-200"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${
                  internalRelativeLineNumbers
                    ? isDark
                      ? "translate-x-4 bg-black"
                      : "translate-x-4 bg-white"
                    : isDark
                    ? "translate-x-0 bg-neutral-400"
                    : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>

          {/* 6. Reset Settings Button */}
          <div className={`pt-2 border-t ${isDark ? "border-neutral-800" : "border-neutral-100"}`}>
            <button
              onClick={() => {
                onFontSizeChange?.(14);
                onThemeChange?.("vs-dark");
                setInternalFontFamily(fontFamily);
                setInternalWordWrap(true);
                setInternalRelativeLineNumbers(false);
              }}
              className={`w-full py-1.5 px-3 rounded-md transition flex items-center justify-center gap-2 text-xs font-medium cursor-pointer ${
                isDark
                  ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isDark ? "text-neutral-400" : "text-neutral-600"}`} />
              <span>Reset Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          width="100%"
          language={normalizedLang}
          theme={theme}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onMount={handleMount}
          beforeMount={handleBeforeMount}
          loading={loading}
          options={editorOptions}
        />
      </div>
    </div>
  );
};

export default CodeArea;

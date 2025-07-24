import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import type { Nullable } from 'unplugin'

export const editorRef = shallowRef<Nullable<monacoEditor.editor.IStandaloneCodeEditor>>()

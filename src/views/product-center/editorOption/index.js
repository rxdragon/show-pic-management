export default {
  viewer: true,
  language: 'zh-CN',
  initialEditType: 'wysiwyg',
  initialValue: '',
  previewStyle: 'vertical',
  useCommandShortcut: true,
  useDefaultHTMLSanitizer: true,
  usageStatistics: false,
  hideModeSwitch: false,
  theme: 'forest', // 'default', 'forest', 'dark', 'neutral'
  editorEvents: [
    'load',
    'change',
    'stateChange',
    'focus',
    'blur',
  ],
  toolbarItems: [
    'heading',
    'bold',
    'italic',
    'strike',
    'divider',
    'hr',
    'quote',
    'divider',
    'ul',
    'ol',
    'task',
    'indent',
    'outdent',
    'divider',
    'table',
    'image',
    'link',
    'divider'
  ]
}

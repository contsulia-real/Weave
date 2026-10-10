import type { DocumentationComponentExampleDefinition } from './documentation-component-example-data'

export const documentationComponentExampleAdditions: Record<
  string,
  readonly DocumentationComponentExampleDefinition[]
> = {
  View: [
    {
      id: 'semantic-host',
      title: 'Semantic host',
      description:
        'View can add semantic and interaction behavior while remaining the same low-level layout host.',
      demo: 'View/semantic-host',
    },
    {
      id: 'state-styles',
      title: 'State styles',
      description:
        'State-style props let View define hover, active, focus-visible, and disabled feedback without a second wrapper.',
      demo: 'View/state-styles',
    },
    {
      id: 'responsive-view',
      title: 'Responsive view',
      description:
        'Breakpoint props let the same View change layout values without creating a second responsive wrapper.',
      demo: 'View/responsive-view',
    },
    {
      id: 'container-responsive',
      title: 'Container responsive',
      description:
        'Container breakpoint props respond to the nearest View container instead of the viewport.',
      demo: 'View/container-responsive',
    },
    {
      id: 'motion',
      title: 'Motion',
      description:
        'View enter and exit props plug directly into Presence for mount and unmount motion.',
      demo: 'View/motion',
    },
    {
      id: 'layout-animation',
      title: 'Layout animation',
      description:
        'layoutAnimation animates geometry changes without moving layout state into a separate animation component.',
      demo: 'View/layout-animation',
    },
    {
      id: 'scrolling',
      title: 'Scrolling',
      description:
        'Overflow and scrollbar props turn View into the framework scroll host while keeping native scrolling as the source of truth.',
      demo: 'View/scrolling',
    },
  ],
  Presence: [
    {
      id: 'toggle-presence',
      title: 'Toggle presence',
      description:
        'Presence keeps exiting content mounted long enough for its View exit motion to complete.',
      demo: 'Presence/toggle-presence',
    },
    {
      id: 'presence-layout',
      title: 'Presence in layout',
      description:
        'Presence can reserve no extra wrapper semantics while its child participates in the surrounding layout.',
      demo: 'Presence/presence-layout',
    },
  ],
  Text: [
    {
      id: 'truncated-copy',
      title: 'Truncated copy',
      description:
        'Limit long content to a known number of lines when the surrounding layout must stay compact.',
      demo: 'Text/truncated-copy',
    },
    {
      id: 'text-emphasis',
      title: 'Text emphasis',
      description:
        'Weight, decoration, case, and semantic colors can communicate emphasis without replacing Text.',
      demo: 'Text/text-emphasis',
    },
    {
      id: 'responsive-text',
      title: 'Responsive text',
      description:
        'Text-specific breakpoint props can change typography, alignment, wrapping, and emphasis without replacing the Text component.',
      demo: 'Text/responsive-text',
    },
  ],
  Code: [
    {
      id: 'tsx-snippet',
      title: 'TSX snippet',
      description:
        'Use TSX highlighting when documentation needs to show component composition rather than plain TypeScript.',
      demo: 'Code/tsx-snippet',
    },
    {
      id: 'scrolling-code',
      title: 'Scrolling code',
      description:
        'Constrain long snippets with ordinary View sizing so only the code surface becomes scrollable.',
      demo: 'Code/scrolling-code',
    },
    {
      id: 'custom-syntax',
      title: 'Custom syntax',
      description:
        'Use language="custom" with a TextMate grammar when syntax highlighting is not provided by a bundled Shiki language.',
      demo: 'Code/custom-syntax',
    },
  ],
  Image: [
    {
      id: 'contained-image',
      title: 'Contained image',
      description:
        'contain keeps the complete source visible when the image should fit inside a fixed presentation box.',
      demo: 'Image/contained-image',
    },
    {
      id: 'focal-position',
      title: 'Focal position',
      description:
        'Combine cover with position when a crop should preserve a particular area of the source.',
      demo: 'Image/focal-position',
    },
    {
      id: 'blob-events',
      title: 'Blob sources and events',
      description:
        'Image accepts Blob sources directly and exposes native load and error lifecycle callbacks.',
      demo: 'Image/blob-events',
    },
  ],
  Icon: [
    {
      id: 'stroke-emphasis',
      title: 'Stroke emphasis',
      description:
        'Stroke weight lets one icon source adapt to quieter metadata or stronger action affordances.',
      demo: 'Icon/stroke-emphasis',
    },
    {
      id: 'semantic-icon-color',
      title: 'Semantic icon color',
      description:
        'Icons inherit View color so they can follow the same semantic color system as surrounding content.',
      demo: 'Icon/semantic-icon-color',
    },
    {
      id: 'custom-svg',
      title: 'Custom SVG',
      description:
        'Icon accepts a direct SVG element and uses viewProps.label when the icon itself needs an accessible name.',
      demo: 'Icon/custom-svg',
    },
  ],
  Avatar: [
    {
      id: 'image-avatar',
      title: 'Image avatar',
      description:
        'Provide src when an entity has an image and retain name plus fallback for accessible and failure states.',
      demo: 'Avatar/image-avatar',
    },
    {
      id: 'fallback-behavior',
      title: 'Fallback behavior',
      description:
        'Avatar derives initials from name by default, accepts custom ReactNode fallback content, and falls back automatically when an image fails.',
      demo: 'Avatar/fallback-behavior',
    },
  ],
  Divider: [
    {
      id: 'vertical-divider',
      title: 'Vertical divider',
      description:
        'Vertical dividers separate adjacent actions without introducing another layout primitive.',
      demo: 'Divider/vertical-divider',
    },
    {
      id: 'spaced-divider',
      title: 'Spaced divider',
      description:
        'Use gap when a divider should carry its own breathing room between content groups.',
      demo: 'Divider/spaced-divider',
    },
    {
      id: 'zero-gap-boundary',
      title: 'Zero-gap boundary',
      description:
        'With gap at zero, Divider draws on the content boundary without adding extra layout spacing.',
      demo: 'Divider/zero-gap-boundary',
    },
  ],
  Link: [
    {
      id: 'quiet-link',
      title: 'Quiet link',
      description:
        'Hide the underline when the surrounding layout already makes the affordance obvious.',
      demo: 'Link/quiet-link',
    },
    {
      id: 'new-tab-link',
      title: 'New tab link',
      description:
        'target remains native anchor behavior, so links can opt into a new browsing context without custom routing.',
      demo: 'Link/new-tab-link',
    },
  ],
  Badge: [
    {
      id: 'status-dot',
      title: 'Status dot',
      description: 'Dot badges communicate status without introducing another text label.',
      demo: 'Badge/status-dot',
    },
    {
      id: 'badge-placement',
      title: 'Badge placement',
      description: 'Placement attaches the same badge content to the edge that best fits its host.',
      demo: 'Badge/badge-placement',
    },
    {
      id: 'visibility',
      title: 'Badge visibility',
      description:
        'visible controls only the badge surface, so the anchored child stays mounted while the badge enters or exits.',
      demo: 'Badge/visibility',
    },
  ],
  SegmentedButton: [
    {
      id: 'action-group',
      title: 'Action group',
      description:
        'With selection omitted, SegmentedButton is a connected group of real Button actions with no persistent selection state.',
      demo: 'SegmentedButton/action-group',
    },
    {
      id: 'controlled-selection',
      title: 'Controlled selection',
      description:
        'Use selected and onSelect when the parent owns the selection state; disabled items remain unavailable.',
      demo: 'SegmentedButton/controlled-selection',
    },
  ],
  Card: [
    {
      id: 'clickable-card',
      title: 'Clickable card',
      description:
        'Clickable cards keep the whole surface interactive when the content represents one action.',
      demo: 'Card/clickable-card',
    },
    {
      id: 'selectable-card',
      title: 'Selectable card',
      description:
        'Selectable cards expose a persistent selection state for pickers and choice grids.',
      demo: 'Card/selectable-card',
    },
    {
      id: 'combined-interaction',
      title: 'Combined interaction',
      description:
        'A controlled Card can be clickable and selectable at the same time while nested interactive controls remain independent.',
      demo: 'Card/combined-interaction',
    },
  ],
  AppBar: [
    {
      id: 'centered-title',
      title: 'Centered title',
      description:
        'Center the title when leading and trailing actions should frame a single page identity.',
      demo: 'AppBar/centered-title',
    },
    {
      id: 'floating-app-bar',
      title: 'Floating app bar',
      description:
        'Floating mode and elevation create a detached navigation surface when the bar should sit over page content.',
      demo: 'AppBar/floating-app-bar',
    },
    {
      id: 'sticky-app-bar',
      title: 'Sticky app bar',
      description:
        'sticky uses native sticky positioning inside a scroll container; this example also shows the large size and end-aligned title.',
      demo: 'AppBar/sticky-app-bar',
    },
  ],
  Form: [
    {
      id: 'field-metadata',
      title: 'Field metadata',
      description:
        'FormField convenience props connect label, description, required state, and error feedback to the enclosed Weave control.',
      demo: 'Form/field-metadata',
    },
    {
      id: 'explicit-field-parts',
      title: 'Explicit field parts',
      description:
        'Use FormLabel, FormDescription, and FormError directly when field metadata needs custom composition.',
      demo: 'Form/explicit-field-parts',
    },
    {
      id: 'fieldset-and-legend',
      title: 'Fieldset and legend',
      description:
        'FormFieldset and FormLegend preserve native grouping semantics without adding a card-like surface.',
      demo: 'Form/fieldset-and-legend',
    },
    {
      id: 'submit-and-reset',
      title: 'Submit and reset',
      description:
        'Form keeps native submit and reset events while Weave components provide the visible fields and actions.',
      demo: 'Form/submit-and-reset',
    },
    {
      id: 'native-validation',
      title: 'Native validation',
      description:
        'Required and pattern constraints stay on the native input elements inside the semantic Form root.',
      demo: 'Form/native-validation',
    },
  ],
  Table: [
    {
      id: 'column-sizing',
      title: 'Column sizing',
      description:
        'TableHead and TableCell accept shared width, minWidth, maxWidth, and alignment controls while retaining native table layout.',
      demo: 'Table/column-sizing',
    },
    {
      id: 'sticky-header',
      title: 'Sticky header',
      description:
        'stickyHeader keeps the header outside the vertical scroll area while tbody scrolls independently.',
      demo: 'Table/sticky-header',
    },
    {
      id: 'dense-table',
      title: 'Dense data table',
      description:
        'Dense rows and vertical borders fit data-heavy surfaces while preserving the same semantic table structure.',
      demo: 'Table/dense-table',
    },
    {
      id: 'selectable-cells',
      title: 'Selectable cells',
      description:
        'Selectable tables track explicit row and cell identifiers instead of coupling selection to visual position.',
      demo: 'Table/selectable-cells',
    },
  ],
  DataGrid: [
    {
      id: 'controlled-state',
      title: 'Controlled grid state',
      description:
        'Control sorting, resized column widths, and cell selection from the parent while using the same DataGrid interaction model.',
      demo: 'DataGrid/controlled-state',
    },
  ],
  Accordion: [
    {
      id: 'controlled-single',
      title: 'Controlled single accordion',
      description:
        'Control the open item from the parent and use collapsible=false when one item must remain open.',
      demo: 'Accordion/controlled-single',
    },
    {
      id: 'disabled-states',
      title: 'Disabled states',
      description:
        'Disable one AccordionItem or the whole Accordion without forcing already-open content to close.',
      demo: 'Accordion/disabled-states',
    },
    {
      id: 'trigger-options',
      title: 'Trigger options',
      description:
        'AccordionTrigger supports single-line truncation and custom expand and collapse icons.',
      demo: 'Accordion/trigger-options',
    },
    {
      id: 'multiple-panels',
      title: 'Multiple panels',
      description:
        'multiple lets more than one disclosure stay open when sections are independent.',
      demo: 'Accordion/multiple-panels',
    },
    {
      id: 'dividerless-accordion',
      title: 'Dividerless accordion',
      description:
        'Remove dividers when disclosure items already live inside another clearly bounded surface.',
      demo: 'Accordion/dividerless-accordion',
    },
  ],
  ToolTip: [
    {
      id: 'controlled-tooltip',
      title: 'Controlled tooltip',
      description:
        'Use open and onOpenChange when the parent owns tooltip visibility while hover, focus, and Escape still request changes.',
      demo: 'ToolTip/controlled-tooltip',
    },
    {
      id: 'rich-content',
      title: 'Rich tooltip content',
      description:
        'Tooltip content can be composed from Weave components instead of being limited to a single text string.',
      demo: 'ToolTip/rich-content',
    },
    {
      id: 'icon-button-tooltip',
      title: 'Icon button tooltip',
      description:
        'Tooltips are useful when an icon-only action needs a visible description on hover or focus.',
      demo: 'ToolTip/icon-button-tooltip',
    },
    {
      id: 'tooltip-placement',
      title: 'Tooltip placement',
      description:
        'Placement and offset keep help text attached to the trigger edge that fits the surrounding layout.',
      demo: 'ToolTip/tooltip-placement',
    },
  ],
  Popover: [
    {
      id: 'controlled-popover',
      title: 'Controlled popover',
      description:
        'Use open and onOpenChange when the parent owns visibility while Popover continues to request trigger, outside-click, and Escape changes.',
      demo: 'Popover/controlled-popover',
    },
    {
      id: 'contextual-actions',
      title: 'Contextual actions',
      description:
        'Popover can host a small action surface without promoting those controls into a modal flow.',
      demo: 'Popover/contextual-actions',
    },
    {
      id: 'focused-popover',
      title: 'Focused popover',
      description:
        'autoFocus moves focus into an interactive popover when its content should immediately accept keyboard input.',
      demo: 'Popover/focused-popover',
    },
  ],
  Dialog: [
    {
      id: 'modal-dialog',
      title: 'Modal dialog',
      description:
        'Modal Dialog uses the native top layer while the surrounding application owns the open state.',
      demo: 'Dialog/modal-dialog',
    },
    {
      id: 'non-modal-dialog',
      title: 'Non-modal dialog',
      description:
        'Non-modal Dialog reuses anchored Popover behavior for lightweight contextual surfaces.',
      demo: 'Dialog/non-modal-dialog',
    },
  ],
  Drawer: [
    {
      id: 'controlled-drawer',
      title: 'Controlled drawer',
      description:
        'Control open state and drawer size from the parent while resize gestures continue to report the next size.',
      demo: 'Drawer/controlled-drawer',
    },
    {
      id: 'responsive-mode',
      title: 'Responsive drawer mode',
      description:
        'auto mode switches between modal and non-modal layout at the selected Theme breakpoint without changing open state.',
      demo: 'Drawer/responsive-mode',
    },
    {
      id: 'modal-drawer',
      title: 'Modal drawer',
      description:
        'Modal Drawer reuses native Dialog behavior for backdrop, Escape, focus containment, initial focus, and focus restoration.',
      demo: 'Drawer/modal-drawer',
    },
    {
      id: 'right-drawer',
      title: 'Right-side drawer',
      description:
        'The same drawer model can place auxiliary content on the opposite side without changing the content tree.',
      demo: 'Drawer/right-drawer',
    },
    {
      id: 'closed-drawer',
      title: 'Closed drawer',
      description: 'A drawer can start closed while the main content keeps the same layout host.',
      demo: 'Drawer/closed-drawer',
    },
  ],
  Menu: [
    {
      id: 'controlled-menu',
      title: 'Controlled menu',
      description:
        'Control root visibility from the parent while placement, overlap, and viewport collision remain owned by Menu.',
      demo: 'Menu/controlled-menu',
    },
    {
      id: 'submenu',
      title: 'Nested submenu',
      description:
        'MenuItem submenu content opens as a keyboard-navigable child menu that reuses the shared anchored overlay geometry.',
      demo: 'Menu/submenu',
    },
    {
      id: 'selection-dismissal',
      title: 'Selection dismissal',
      description:
        'Menu and individual MenuItem instances can keep the menu open or close it after selection.',
      demo: 'Menu/selection-dismissal',
    },
    {
      id: 'menu-item-states',
      title: 'Menu item states',
      description:
        'Menu items can communicate secondary information, unavailable commands, and destructive actions.',
      demo: 'Menu/menu-item-states',
    },
    {
      id: 'menu-with-icons',
      title: 'Menu with icons',
      description:
        'Icons can reinforce command identity while text remains the primary accessible label.',
      demo: 'Menu/menu-with-icons',
    },
  ],
  Tabs: [
    {
      id: 'controlled-tabs',
      title: 'Controlled tabs',
      description:
        'Own the selected tab in parent state while Tabs continues to coordinate selection, roving focus, and panel visibility.',
      demo: 'Tabs/controlled-tabs',
    },
    {
      id: 'pill-tabs',
      title: 'Pill tabs',
      description:
        'The pill variant changes the shared indicator and TabList surface while preserving the same selection and keyboard model.',
      demo: 'Tabs/pill-tabs',
    },
    {
      id: 'disabled-tab',
      title: 'Disabled tab',
      description:
        'Disabled tabs are skipped by default selection and keyboard focus while their panels remain part of the compound structure.',
      demo: 'Tabs/disabled-tab',
    },
    {
      id: 'vertical-tabs',
      title: 'Vertical tabs',
      description:
        'Vertical orientation works for settings and inspector layouts where labels need more horizontal space.',
      demo: 'Tabs/vertical-tabs',
    },
    {
      id: 'manual-activation',
      title: 'Manual activation',
      description:
        'Manual activation separates keyboard focus from selection when switching panels is expensive.',
      demo: 'Tabs/manual-activation',
    },
  ],
  Snack: [
    {
      id: 'provider-queue',
      title: 'Provider queue',
      description:
        'SnackProvider with useSnack creates independent queued notifications and exposes show, dismiss, and dismissAll controls.',
      demo: 'Snack/provider-queue',
    },
    {
      id: 'lifetime-progress',
      title: 'Controlled lifetime progress',
      description:
        'A controlled Snack can expose its timed lifetime progress and report when its exit transition has fully dismissed.',
      demo: 'Snack/lifetime-progress',
    },
    {
      id: 'custom-content',
      title: 'Custom snack content',
      description:
        'Use children for fully composed Snack content instead of the text, icon, and action shortcut API.',
      demo: 'Snack/custom-content',
    },
    {
      id: 'snack-action',
      title: 'Snack action',
      description:
        'A Snack can expose one immediate action alongside the status message without becoming a dialog.',
      demo: 'Snack/snack-action',
    },
    {
      id: 'snack-variant',
      title: 'Status variant',
      description:
        'Semantic variants let transient messages communicate success, warning, or failure consistently.',
      demo: 'Snack/snack-variant',
    },
  ],
  List: [
    {
      id: 'controlled-multiple-selection',
      title: 'Controlled multiple selection',
      description:
        'Own a multiple-selection value in parent state while List handles option semantics, roving focus, and disabled items.',
      demo: 'List/controlled-multiple-selection',
    },
    {
      id: 'horizontal-list',
      title: 'Horizontal list',
      description:
        'orientation, gap, noDividers, and singleLine compose the same List model into a compact horizontal collection.',
      demo: 'List/horizontal-list',
    },
    {
      id: 'virtualized-list',
      title: 'Virtualized list',
      description:
        'virtualized windows a long collection inside the List scroll host while preserving List selection and focus semantics.',
      demo: 'List/virtualized-list',
    },
    {
      id: 'single-selection',
      title: 'Single selection',
      description: 'Single selection makes a list suitable for navigation or one-of-many pickers.',
      demo: 'List/single-selection',
    },
    {
      id: 'data-driven-list',
      title: 'Data-driven list',
      description:
        'items renders the same List model from data when the application already owns a collection.',
      demo: 'List/data-driven-list',
    },
  ],
  ThemeProvider: [
    {
      id: 'nested-theme-override',
      title: 'Nested theme override',
      description:
        'A nested ThemeProvider deep-merges a partial theme override with the surrounding theme instead of replacing unspecified tokens.',
      demo: 'ThemeProvider/nested-theme-override',
    },
    {
      id: 'scoped-color-mode',
      title: 'Scoped color mode',
      description:
        'A nested provider can force a color mode for one subtree without changing the surrounding application.',
      demo: 'ThemeProvider/scoped-color-mode',
    },
    {
      id: 'reduced-motion-scope',
      title: 'Reduced motion scope',
      description:
        'Reduced-motion preference can be scoped for previews, accessibility testing, or motion-sensitive regions.',
      demo: 'ThemeProvider/reduced-motion-scope',
    },
  ],
}

const viewPropDescriptions = {
  active: 'Overrides View styles while the element is in its active pointer state.',
  align: 'Aligns direct children on the cross axis; in Stack it controls vertical item alignment.',
  alignSelf: 'Overrides cross-axis alignment for this item.',
  animation: 'Runs a named animation or an explicit keyframe animation.',
  aspectRatio: 'Sets the preferred width-to-height aspect ratio.',
  autoFocus: 'Requests focus when the host element mounts.',
  backdropBlur: 'Applies blur to content behind the element.',
  backdropSaturate: 'Applies a saturation multiplier to content behind the element.',
  background: 'Sets the background using a theme color, direct color, or structured gradient.',
  basis: 'Sets the flex-basis used to size this item before free space is distributed.',
  blend: 'Sets the element blend mode.',
  blur: 'Applies a foreground blur filter.',
  border: 'Sets border width on all sides.',
  borderBottom: 'Sets the bottom border width.',
  borderBottomColor: 'Sets the bottom border color.',
  borderColor: 'Sets border color on all sides.',
  borderLeft: 'Sets the left border width.',
  borderLeftColor: 'Sets the left border color.',
  borderRight: 'Sets the right border width.',
  borderRightColor: 'Sets the right border color.',
  borderStyle: 'Sets the border line style.',
  borderTop: 'Sets the top border width.',
  borderTopColor: 'Sets the top border color.',
  bottom: 'Sets the bottom positional offset.',
  brightness: 'Applies a brightness filter multiplier.',
  busy: 'Marks the element as busy through aria-busy.',
  checked: 'Exposes checked or mixed state through aria-checked.',
  children: 'Content rendered inside the host element.',
  className: 'Adds custom CSS classes to the host element.',
  clickable:
    'Enables the shared hover and active surface treatment without adding click semantics, role, or keyboard behavior.',
  clip: 'Clips rendering with a CSS string, circle, polygon, or path definition.',
  color: 'Sets the foreground color using a theme color token or direct color value.',
  column: 'Places this item at the given grid column.',
  columns: 'Defines grid column tracks; a number creates that many equal columns.',
  columnSpan: 'Sets how many grid columns this item spans.',
  container: 'Names this element as a responsive container for descendant container breakpoints.',
  contrast: 'Applies a contrast filter multiplier.',
  controls: 'References the element controlled by this element through aria-controls.',
  cursor: 'Sets the pointer cursor shown over the element.',
  data: 'Adds data-* attributes from a key-value object.',
  describedBy:
    'References the element that supplies the accessible description through aria-describedby.',
  description: 'Provides an accessible description through aria-description.',
  direction: 'Sets the flex main-axis direction when using flex layout.',
  disabled: 'Marks the element as disabled for shared semantics and state styling.',
  disabledStyle: 'Overrides View styles while the element is disabled.',
  draggable: 'Enables native drag behavior on the host element.',
  enter: 'Configures the enter animation used when content appears through Presence.',
  exit: 'Configures the exit animation used before content is removed through Presence.',
  expanded: 'Exposes whether the controlled region is expanded through aria-expanded.',
  focus: 'Overrides View styles while the element has focus.',
  focusable:
    'Makes the element focusable when no semantic component already owns its focus behavior.',
  focusVisible: 'Overrides View styles while keyboard-style focus indication is visible.',
  gap: 'Sets spacing between direct layout children.',
  grayscale: 'Applies a grayscale filter amount.',
  grow: 'Sets the flex-grow factor for this item.',
  height: 'Sets height; semantic values include fill, fit, and content.',
  hidden: 'Hides the host element from rendering and layout.',
  hover: 'Overrides View styles while the pointer hovers the element.',
  hueRotate: 'Rotates the rendered hue by the given angle.',
  id: 'Sets the native host element id.',
  inset: 'Sets all four positional inset offsets.',
  insetX: 'Sets the left and right positional offsets.',
  insetY: 'Sets the top and bottom positional offsets.',
  invalid: 'Marks the current value or state as invalid through aria-invalid.',
  justify:
    'Distributes direct children on the main axis; in Stack it controls horizontal item alignment.',
  justifySelf: 'Overrides self-alignment on the inline or grid axis for this item.',
  label: 'Provides the element accessible name through aria-label.',
  labelledBy: 'References the element that supplies the accessible name through aria-labelledby.',
  layer: 'Assigns the element to a named Weave layer.',
  layout:
    'Selects the low-level View layout strategy. Application layout should normally use Flex, Row, Column, Grid, Stack, or Absolute.',
  layoutAnimation: 'Animates layout changes and controls how interrupted layout motion behaves.',
  left: 'Sets the left positional offset.',
  level: 'Sets aria-level for hierarchical roles that expose a level.',
  margin: 'Sets margin on all sides.',
  marginBottom: 'Sets the bottom margin.',
  marginLeft: 'Sets the left margin.',
  marginRight: 'Sets the right margin.',
  marginTop: 'Sets the top margin.',
  marginX: 'Sets horizontal margin on the left and right sides.',
  marginY: 'Sets vertical margin on the top and bottom sides.',
  mask: 'Applies a CSS mask image using a string or structured gradient.',
  maxHeight: 'Sets the maximum height.',
  maxWidth: 'Sets the maximum width.',
  minHeight: 'Sets the minimum height.',
  minWidth: 'Sets the minimum width.',
  opacity: 'Sets element opacity from 0 to 1.',
  order: 'Sets this item flex or grid ordering value.',
  outlineColor: 'Sets the outline color.',
  outlineOffset: 'Sets the distance between the outline and the element edge.',
  outlineStyle: 'Sets the outline line style.',
  outlineWidth: 'Sets the outline width.',
  overflow: 'Controls overflow behavior on both axes.',
  overflowX: 'Controls horizontal overflow behavior.',
  overflowY: 'Controls vertical overflow behavior.',
  owns: 'References elements owned by this element through aria-owns.',
  padding: 'Sets padding on all sides.',
  paddingBottom: 'Sets the bottom padding.',
  paddingLeft: 'Sets the left padding.',
  paddingRight: 'Sets the right padding.',
  paddingTop: 'Sets the top padding.',
  paddingX: 'Sets horizontal padding on the left and right sides.',
  paddingY: 'Sets vertical padding on the top and bottom sides.',
  pointerEvents: 'Controls how the element participates in pointer hit testing.',
  position: 'Sets the CSS positioning scheme for the host element.',
  pressed: 'Exposes pressed or mixed toggle state through aria-pressed.',
  radius: 'Sets all corner radii using a semantic radius or explicit length.',
  radiusBottomLeft: 'Sets the bottom-left corner radius.',
  radiusBottomRight: 'Sets the bottom-right corner radius.',
  radiusTopLeft: 'Sets the top-left corner radius.',
  radiusTopRight: 'Sets the top-right corner radius.',
  readOnly: 'Marks the element as read-only through aria-readonly.',
  ref: 'Forwards a React ref to the native host element.',
  required: 'Marks the element as required through aria-required.',
  right: 'Sets the right positional offset.',
  role: 'Sets the ARIA role exposed by the host element.',
  rotate: 'Rotates the element by the given angle.',
  row: 'Places this item at the given grid row.',
  rows: 'Defines grid row tracks; a number creates that many equal rows.',
  rowSpan: 'Sets how many grid rows this item spans.',
  saturate: 'Applies a saturation filter multiplier.',
  scale: 'Scales the element uniformly.',
  scaleX: 'Scales the element horizontally.',
  scaleY: 'Scales the element vertically.',
  scrollbar: 'Configures the scrollbar used when this element creates a scroll area.',
  selectable: 'Controls whether the element text or content can be selected.',
  selected: 'Exposes selection state through aria-selected.',
  sepia: 'Applies a sepia filter amount.',
  shadow: 'Applies a semantic, custom, or multi-layer box shadow.',
  shrink: 'Sets the flex-shrink factor for this item.',
  skewX: 'Skews the element horizontally.',
  skewY: 'Skews the element vertically.',
  style: 'Adds inline CSS properties after Weave resolved styles.',
  tabIndex: 'Sets the native tab order value.',
  top: 'Sets the top positional offset.',
  transform:
    'Applies an ordered list of transform operations when transform order must be explicit.',
  transformOrigin: 'Sets the origin used by transforms.',
  transition: 'Configures animated transitions when supported View style values change.',
  translateX: 'Translates the element horizontally.',
  translateY: 'Translates the element vertically.',
  valueMax: 'Sets the maximum numeric value exposed through aria-valuemax.',
  valueMin: 'Sets the minimum numeric value exposed through aria-valuemin.',
  valueNow: 'Sets the current numeric value exposed through aria-valuenow.',
  valueText: 'Provides human-readable text for the current value through aria-valuetext.',
  width: 'Sets width; semantic values include fill, fit, and content.',
  wrap: 'Controls flex wrapping; "reverse" uses reverse wrapping.',
  zIndex: 'Sets stacking order within the current stacking context.',
}

const componentPropDescriptions = {
  Flex: {
    direction: 'Sets the flex main-axis direction for this general-purpose flex container.',
    layout: 'Fixed to flex by Flex and cannot be changed.',
  },
  Row: {
    direction: 'Fixed to row by Row and cannot be changed.',
    layout: 'Fixed to flex by Row and cannot be changed.',
  },
  Column: {
    direction: 'Fixed to column by Column and cannot be changed.',
    layout: 'Fixed to flex by Column and cannot be changed.',
  },
  Grid: {
    layout: 'Fixed to grid by Grid and cannot be changed.',
  },
  Stack: {
    layout: 'Fixed to stack by Stack and cannot be changed.',
  },
  Absolute: {
    layout: 'Fixed to absolute by Absolute and cannot be changed.',
  },
  SplitBox: {
    children: 'Exactly two direct SplitBoxPane children that form the start and end panes.',
    collapsed: 'Controlled collapsed pane. false keeps both panes expanded.',
    collapseThreshold:
      'Pointer-drag threshold at which a collapsible pane snaps from its legal minimum size to fully collapsed.',
    collapsible:
      'Chooses which pane the user may collapse by dragging the splitter. It does not restrict externally controlled collapsed state.',
    defaultCollapsed: 'Initial collapsed pane when collapsed state is uncontrolled.',
    defaultSize:
      'Initial start-pane size for uncontrolled sizing. Use this instead of size when the parent does not own the current size.',
    direction: 'Chooses a horizontal left/right split or vertical top/bottom split.',
    disabled:
      'Disables pointer and keyboard splitter resizing while retaining the separator element and disabled semantics.',
    expandThreshold:
      'Pointer-drag threshold a collapsed pane must cross before it snaps back to its current legal minimum size.',
    maxEnd: 'Maximum allowed size of the end pane.',
    maxStart: 'Maximum allowed size of the start pane.',
    minEnd: 'Minimum allowed size of the end pane during normal, non-collapsed layout.',
    minStart: 'Minimum allowed size of the start pane during normal, non-collapsed layout.',
    onChange:
      'Called with the current start-pane size as a CSS pixel string while resizing and when threshold snapping changes the size.',
    onCollapsedChange: 'Called when user interaction requests a different collapsed pane state.',
    size: 'Controlled size of the start pane. Use this when the parent owns splitter size.',
    step: 'Distance moved by each keyboard resize step.',
    thickness:
      'Visible splitter-line thickness. A value of 0 hides the resting line without removing its pointer hit area.',
  },
  SplitBoxPane: {
    children:
      'Content rendered in one SplitBox layout slot. The pane adds no default surface styling.',
  },
  Presence: {
    children: 'Content kept mounted while Presence coordinates enter and exit lifecycles.',
    onExitComplete:
      'Called after every registered descendant exit has completed and the subtree can unmount.',
    present:
      'Controls whether the subtree should be present; false waits for descendant exit motion before unmounting.',
  },
  Text: {
    align: 'Sets horizontal text alignment within the available inline space.',
    bold: 'Convenience weight toggle: true uses bold and false uses regular; an explicit weight prop takes precedence.',
    case: 'Transforms text casing without changing the underlying content.',
    children: 'Text and other content rendered inside the semantic Text host.',
    color: 'Sets a semantic text color, theme extension token, or direct color value.',
    italic:
      'Switches between italic and normal font style; browser style synthesis remains allowed when no italic face exists.',
    letterSpacing:
      'Overrides character spacing; numeric values use the Weave spacing scale semantics.',
    lineHeight: 'Overrides line height; numeric values use the Weave scale semantics.',
    maxLines: 'Clamps wrapped text to at most this many lines.',
    overflow: 'Chooses whether overflowing text is clipped or rendered with an ellipsis.',
    overline: 'Adds an overline decoration and can be combined with other text decorations.',
    singleLine:
      'Forces one line with no wrapping and ellipsis overflow, overriding wrap, overflow, and maxLines including responsive overrides.',
    size: 'Overrides the font-size portion of the selected typo style, or sets size without a typo preset.',
    strikethrough:
      'Adds a line-through decoration and can be combined with other text decorations.',
    typo: 'Selects a complete theme typography role and the base semantic host element associated with that role.',
    underline: 'Adds an underline decoration and can be combined with other text decorations.',
    weight: 'Sets the exact typography weight and takes precedence over the bold convenience prop.',
    wrap: 'Controls normal wrapping, no wrapping, or balanced text wrapping.',
  },
  Code: {
    children: 'Source code string rendered inside the highlighted code block.',
    language:
      'Required syntax language. Use a Shiki bundled language name, or "custom" together with syntax.',
    syntax:
      'Custom Shiki language registration. Required only when language is "custom" and forbidden for bundled languages.',
  },
  Image: {
    alt: 'Accessible alternative text for the image. Use an empty string when the image is purely decorative.',
    fit: 'Controls how the image content is resized within its rendered box.',
    loading: 'Chooses native lazy or eager image loading.',
    onError: 'Called when the native image element fails to load its source.',
    onLoad: 'Called when the native image element successfully loads its source.',
    position:
      'Sets the image position inside its box when the fit mode leaves extra or cropped space.',
    src: 'Image source as a URL-like string, data/object URL, or Blob.',
  },
  Icon: {
    icon: 'Tabler-style React icon component to render. Mutually exclusive with svg so the icon can be statically imported and tree-shaken.',
    size: 'Selects the themed icon box size.',
    stroke:
      'Selects the themed stroke width applied to outline icons; filled icon geometry remains defined by the icon itself.',
    svg: 'Custom React SVG element to render instead of an icon component. Mutually exclusive with icon.',
  },
  Avatar: {
    fallback:
      'Explicit fallback content shown when no usable image is available. It takes precedence over initials generated from name.',
    name: 'Entity name used to generate initials when no image or explicit fallback is available; it does not replace accessible labeling in viewProps.',
    src: 'Optional image source. A successfully loaded image wins over fallback content; load failure automatically falls back.',
  },
  Divider: {
    direction:
      'Chooses a horizontal or vertical separator and sets the matching separator orientation semantics.',
    gap: 'Adds whitespace on both sides of the line: top/bottom for horizontal dividers and left/right for vertical dividers. A value of 0 adds no layout space.',
    size: 'Sets line thickness in pixels. Unlike normal numeric Length values, this number is always px and overrides the theme thickness.',
  },
  Link: {
    hideIcon:
      'Hides the decorative link icon appended after the visible label without changing the accessible name or navigation behavior.',
    hideUnderline:
      'Hides the animated bottom link marker while preserving text, icon, focus outline, and native anchor behavior.',
    href: 'Required native anchor destination. When text is omitted, href is also used as the visible label.',
    target:
      'Passes the native target value to the real anchor element without rewriting navigation or automatically changing rel.',
    text: 'Optional visible label. It replaces the displayed href text but never changes the actual navigation destination.',
  },
  Badge: {
    children:
      'Target content that the Badge attaches to. The badge is positioned from the target’s live visual bounds without taking normal layout space.',
    dot: 'Switches to the dot-only visual mode. When true, text is not allowed and the dot is treated as decorative.',
    placement:
      'Chooses one of eight edge positions around the target and also determines the direction of enter and exit motion.',
    text: 'Visible badge content in normal mode. Required unless dot is true and omitted entirely in dot mode.',
    visible:
      'Shows or hides only the badge indicator while keeping the wrapped children mounted and visible.',
  },
  Button: {
    children:
      'Custom button content. When children is used, text, icon, and iconPosition are not allowed.',
    disabled:
      'Disables the native button, prevents pointer and keyboard activation, and applies the shared disabled state. It takes precedence over pressed styling.',
    icon: 'Optional icon source for the semantic content mode. With no text it creates an icon-only button; it cannot be combined with children.',
    iconPosition:
      'Places the semantic-mode icon before or after text. It has no effect in custom children mode.',
    pressed:
      'Controlled persistent toggle-button state. When provided, Button exposes aria-pressed; when omitted, Button remains a normal push button.',
    size: 'Selects the themed control size, including minimum height, padding, content gap, and typography role.',
    text: 'Visible semantic button label. It can be paired with icon, and cannot be combined with custom children.',
    type: 'Sets the native button type. The default is button; use submit or reset only when native form behavior is intended.',
    variant: 'Selects the themed visual variant: primary, secondary, tertiary, ghost, or danger.',
  },
  SegmentedButton: {
    defaultSelected:
      'Initial selection for uncontrolled single or multiple selection. Its value shape follows the selection mode.',
    items:
      'Ordered segments. Each item uses a stable id as its selection value, renders children directly inside a real Button, and may be disabled or customize that Button through viewProps.',
    onSelect:
      'Called when user interaction requests a new selection. The callback value shape follows the selection mode.',
    selected:
      'Controlled selection value. Use a string or null for single selection and a string array for multiple selection.',
    selection:
      'Chooses no selection, single selection, or multiple selection behavior. The default is none.',
    size: 'Sets the shared Button size used by every segment.',
    variant: 'Sets the shared Button visual variant used by every segment.',
  },
  Card: {
    children: 'Content rendered inside the Card surface.',
    clickable:
      'Enables Card activation and keyboard activation. It is independent from selectable and uses viewProps.onClick for the activation handler.',
    defaultSelected:
      'Initial selected state for an uncontrolled selectable Card. It is available only when selectable is true.',
    onSelectedChange:
      'Called when Card activation requests a selection toggle. Calling preventDefault in viewProps.onClick cancels that default toggle.',
    selectable:
      'Enables boolean selection and aria-pressed semantics. Only selectable Cards may use selected, defaultSelected, and onSelectedChange.',
    selected:
      'Controlled selected state for a selectable Card. When provided, the parent owns the current selection value.',
  },
  AppBar: {
    elevated:
      'Switches the AppBar from its default flat surface to the themed raised surface. Sticky or scroll state never changes elevation automatically.',
    leading: 'Content rendered in the leading action region.',
    mode: 'Chooses full-width or floating geometry. Full removes outer margin and radius; floating keeps themed margin and radius.',
    size: 'Selects the themed AppBar height, slot margins, gap, and default title typography role.',
    sticky:
      'Uses native position: sticky with top: 0 while preserving the same visual state and elevation.',
    title:
      'Required direct Weave Text element rendered in the title region. An explicit Text typo overrides the size default.',
    titleAlign:
      'Aligns the title within the real middle grid region; it does not force absolute centering against the viewport.',
    trailing: 'Content rendered in the trailing action region.',
  },
  Input: {
    locale:
      'BCP 47 language tag overriding the document language for Weave calendar and clock pickers when type is date, time, datetime-local, month, or week.',
    autoComplete: 'Passes the native autocomplete hint to the input or textarea host.',
    clearable:
      'Controls the built-in clear action for single-line Input. It defaults to true and is unavailable in multiline mode.',
    clearLabel:
      'Accessible name for the single-line clear action. It is used only when the clear action is available.',
    defaultValue:
      'Initial value for an uncontrolled Input. Use value instead when the parent owns the current value.',
    disabled: 'Disables the native input or textarea and prevents editing and clear interaction.',
    leadingIcon:
      'Non-interactive leading icon for single-line Input. It is unavailable in multiline mode.',
    maxLength: 'Passes the native maximum text length constraint to the input or textarea.',
    minLength: 'Passes the native minimum text length constraint to the input or textarea.',
    min: 'Sets the native lower value constraint on supported single-line input types.',
    max: 'Sets the native upper value constraint on supported single-line input types.',
    step: 'Passes the native step constraint to number and temporal input types; time and datetime-local steps use seconds, month uses months, week uses weeks.',
    multiline:
      'Switches the native host from input to textarea. Multiline mode disables type, clear action, and leading/trailing icons.',
    name: 'Sets the native form field name used for form submission.',
    onChange:
      'Called with the current string value whenever the user edits the field or activates the clear action.',
    pattern: 'Passes the native validation pattern to the input or textarea.',
    placeholder: 'Sets placeholder text shown while the field has no value.',
    readOnly:
      'Makes the field non-editable while keeping its value focusable and available for selection.',
    required: 'Marks the native field as required for form validation.',
    rows: 'Sets the visible textarea row count in multiline mode.',
    trailingIcon:
      'Non-interactive trailing icon for single-line Input. When clear is also visible, this icon remains the rightmost adornment.',
    trailingAction:
      'Interactive content rendered inside the trailing edge of a single-line Input, e.g. a calendar Popover trigger.',
    type: 'Sets the native single-line input type, including date, time, datetime-local, month, and week. Temporal types use the Weave calendar or clock Popover while preserving native segment editing and form values.',
    value:
      'Controlled field value. When provided, the parent owns the rendered value and must update it from onChange.',
  },
  Select: {
    children: 'SelectOption children that define the fixed set of selectable choices.',
    defaultOpen: 'Initial open state when popup visibility is uncontrolled.',
    defaultValue:
      'Initial selected option value for uncontrolled selection; null means no selection.',
    disabled: 'Disables the combobox trigger and prevents opening or changing the selection.',
    listboxViewProps:
      'Applies View customization to the popup listbox without replacing its listbox semantics or positioning.',
    name: 'Optional native form field name used to submit the selected value.',
    offset: 'Distance between the trigger and popup along the placement axis.',
    onOpenChange: 'Called when interaction requests a change to popup visibility.',
    onValueChange: 'Called when the user commits an enabled option.',
    open: 'Controlled popup visibility.',
    overlapTrigger:
      'Allows the popup to overlap the trigger instead of being positioned outside its edge.',
    placeholder: 'Content shown in the trigger when no option is selected.',
    placement: 'Preferred anchored-overlay placement for the listbox popup.',
    value: 'Controlled selected option value; null means no selection.',
    viewportPadding: 'Minimum collision padding kept between the popup and viewport edges.',
  },
  SelectOption: {
    disabled:
      'Disables this option and excludes it from pointer selection, keyboard navigation, and typeahead.',
    icon: 'Optional icon shown with the option and echoed in the Select trigger when selected.',
    secondaryText:
      'Supplementary text shown only inside the popup option, not in the closed trigger.',
    text: 'Primary visible option content.',
    textValue:
      'Stable plain-text value used for typeahead when text cannot be converted directly to a string.',
    value: 'Unique string value submitted by this option within its Select.',
  },
  Combobox: {
    children: 'ComboboxOption children that define the fixed set of selectable choices.',
    clearable:
      'Controls the built-in clear action. Clearing explicitly sets value to null and clears the input text.',
    clearLabel: 'Accessible name for the built-in clear action.',
    defaultInputValue:
      'Initial editable text for uncontrolled input state. It does not select an option by itself.',
    defaultOpen: 'Initial popup visibility when open state is uncontrolled.',
    defaultValue:
      'Initial committed option value for uncontrolled selection; null means no selected option.',
    disabled: 'Disables editing, popup interaction, selection, and clearing.',
    emptyContent: 'Content shown in the listbox when filtering leaves no visible options.',
    filter:
      'Custom option filter called with option metadata and the current input text. When omitted, Combobox uses case-insensitive substring matching on textValue.',
    inputValue:
      'Controlled editable input text. Typing changes this state without changing the committed value.',
    listboxViewProps:
      'Applies View customization to the popup listbox without replacing its listbox semantics or positioning.',
    name: 'Optional native form field name used to submit the committed selected value.',
    offset: 'Distance between the input anchor and popup along the placement axis.',
    onInputValueChange:
      'Called when editable input text changes through typing, selection synchronization, or clearing.',
    onOpenChange: 'Called when interaction requests a change to popup visibility.',
    onValueChange:
      'Called when an option is committed or the control is cleared. Typing alone does not call it.',
    open: 'Controlled popup visibility.',
    overlapTrigger:
      'Allows the popup to overlap the input anchor instead of being positioned outside its edge.',
    placeholder: 'Placeholder text shown in the editable input when it is empty.',
    placement: 'Preferred anchored-overlay placement for the listbox popup.',
    value:
      'Controlled committed option value. It is independent from inputValue; null means no selected option.',
    viewportPadding: 'Minimum collision padding kept between the popup and viewport edges.',
  },
  ComboboxOption: {
    disabled:
      'Disables this option and excludes it from selection, keyboard navigation, and filtering results that can be committed.',
    icon: 'Optional icon shown with the option and with the committed selection.',
    secondaryText: 'Supplementary text shown in the popup option.',
    text: 'Primary visible option content.',
    textValue:
      'Stable plain-text representation used for filtering and input synchronization when text is not directly string-like.',
    value: 'Unique string value committed by this option within its Combobox.',
  },
  Slider: {
    defaultValue:
      'Initial value for uncontrolled state. Values outside min and max are clamped into the current range.',
    direction:
      'Chooses a horizontal or vertical value axis. Vertical grows from bottom to top unless inverse is true.',
    disabled: 'Disables pointer and keyboard value changes on the native range input.',
    inverse:
      'Reverses the spatial min/max endpoints without changing the numeric min, max, or value.',
    label:
      'Visible descriptive content referenced by the range for accessibility. It is not a clickable native label.',
    max: 'Maximum numeric value of the range.',
    min: 'Minimum numeric value of the range.',
    name: 'Native form field name for the underlying range input.',
    onChange: 'Called with the normalized numeric value when user interaction changes the slider.',
    size: 'Selects the themed track, thumb, gap, and interaction geometry size.',
    step: 'Native numeric step. When explicitly provided and positive, Slider also renders visual step dots.',
    value: 'Controlled numeric value. The rendered value is clamped into min and max.',
  },
  MarkSlider: {
    defaultValue:
      'Initial uncontrolled value inherited from Slider and normalized to the current range or nearest mark when restricted.',
    direction: 'Chooses the shared Slider horizontal or vertical value axis.',
    disabled: 'Disables pointer and keyboard value changes.',
    inverse: 'Reverses the shared Slider spatial value axis without changing numeric values.',
    label: 'Visible non-clickable descriptive content used as the slider accessible label.',
    marks:
      'Explicit mark definitions. Each flag is a real numeric position on the Slider value axis and each label is display content for that position.',
    max: 'Maximum numeric value and the default end-point mark.',
    min: 'Minimum numeric value and the default start-point mark.',
    name: 'Native form field name for the underlying range input.',
    onChange:
      'Called with the normalized value. In restricted mode emitted values are always one of the legal mark flags.',
    restricted:
      'Restricts every stable value to the merged mark flags, snapping pointer, keyboard, controlled, and uncontrolled values to the nearest legal mark.',
    size: 'Selects the shared Slider visual and interaction geometry size.',
    step: 'Controls normal range stepping when restricted is false; it never generates MarkSlider marks.',
    value:
      'Controlled value inherited from Slider and normalized to the nearest legal mark when restricted.',
  },
  RangeSlider: {
    defaultValue:
      'Initial uncontrolled [start, end] range. Values are clamped to min/max and normalized so start never exceeds end.',
    direction: 'Chooses the shared Slider horizontal or vertical value axis for both thumbs.',
    disabled: 'Disables pointer and keyboard changes for both native range inputs.',
    endLabel: 'Additional accessible name text for the end-value range input.',
    endName: 'Native form field name for the end-value range input.',
    inverse: 'Reverses the shared Slider spatial axis without changing start/end numeric ordering.',
    label:
      'Visible non-clickable descriptive content shared by the range control for accessibility.',
    max: 'Maximum numeric value allowed for both thumbs.',
    min: 'Minimum numeric value allowed for both thumbs.',
    onChange:
      'Called with the normalized [start, end] pair when either thumb changes. The two thumb identities never swap.',
    size: 'Selects the shared Slider track, thumb, gap, and interaction geometry size.',
    startLabel: 'Additional accessible name text for the start-value range input.',
    startName: 'Native form field name for the start-value range input.',
    step: 'Native numeric step shared by both range inputs. When explicitly positive, the shared Slider step dots are shown.',
    value:
      'Controlled [start, end] range. Values are clamped and normalized so start is always less than or equal to end.',
  },
  Switch: {
    checked: 'Controlled on/off state. When provided, the parent owns the current switch state.',
    defaultChecked: 'Initial on/off state for an uncontrolled Switch.',
    disabled: 'Disables pointer, keyboard, label, and drag interaction.',
    label:
      'Visible native-bound label content. Clicking the label activates the same switch control and contributes to its accessible name.',
    name: 'Native form field name used when the Switch participates in form submission.',
    onChange:
      'Called with the requested boolean state after click, keyboard, label, or drag interaction.',
    size: 'Selects the themed track, thumb, and field geometry size.',
    value: 'Native form value submitted for the Switch when it is checked.',
  },
  Radio: {
    checked: 'Controlled checked state for the native radio input.',
    defaultChecked: 'Initial checked state for an uncontrolled Radio.',
    disabled: 'Disables the native radio input and its bound label interaction.',
    group:
      'Framework group key mapped directly to the native name attribute. Radios with the same group participate in the same browser-managed exclusive group.',
    label:
      'Visible native-bound label content. Clicking the label activates this radio and contributes to its accessible name.',
    onChange: 'Called with the native boolean checked state when this radio changes.',
    size: 'Selects the themed control and surrounding state-layer geometry size.',
    value: 'Native radio value submitted when this option is checked.',
  },
  Checkbox: {
    checked: 'Controlled checked state for the native checkbox input.',
    defaultChecked: 'Initial checked state for an uncontrolled Checkbox.',
    disabled: 'Disables the native checkbox input and its bound label interaction.',
    group:
      'Framework group key mapped directly to the native name attribute. Checkboxes with the same group share a submission name while keeping independent checked states.',
    indeterminate:
      'Sets the native indeterminate property and exposes mixed accessibility state. It does not replace the underlying boolean checked value.',
    label:
      'Visible native-bound label content. Clicking the label toggles this checkbox and contributes to its accessible name.',
    onChange: 'Called with the native boolean checked state when this checkbox changes.',
    size: 'Selects the themed control and surrounding state-layer geometry size.',
    value: 'Native checkbox value submitted when this option is checked.',
  },
  Progress: {
    color:
      'Overrides the foreground progress color with a theme color token or direct color value.',
    direction:
      'Chooses horizontal or vertical motion/fill for linear mode. Spin mode does not use a direction axis.',
    indeterminate: 'Selects continuous indeterminate state. When true, progress is not allowed.',
    inverse: 'Reverses the linear fill and motion direction without changing the progress value.',
    mode: 'Chooses circular spin or linear progress geometry.',
    progress:
      'Determinate progress value from 0 to 1. It is mutually exclusive with indeterminate=true.',
    size: 'Selects the themed thickness and overall geometry size.',
    speed:
      'Controls indeterminate loop speed or the one-time determinate value transition duration. Numeric values are milliseconds.',
    tracked: 'Shows the lighter continuous background track behind the foreground progress.',
  },
  Skeleton: {
    shape:
      'Selects rectangle, circle, or single-line text placeholder geometry. Width and height remain controlled through viewProps.',
  },
  Form: {
    children: 'Form controls, fields, and actions rendered inside the native form element.',
    onReset:
      'Receives the React reset event from the real form element when native form reset occurs.',
    onSubmit:
      'Receives the React submit event from the real form element. Browser constraint validation remains enabled by default.',
  },
  FormField: {
    children: 'Field control and optional explicit FormLabel, FormDescription, or FormError parts.',
    description:
      'Convenience description content linked to participating controls through aria-describedby. Do not also provide an explicit FormDescription.',
    error:
      'Convenience error content shown immediately and linked to participating controls; its presence also marks them invalid. Do not also provide an explicit FormError.',
    label:
      'Convenience field label linked to participating controls through aria-labelledby. Do not also provide an explicit FormLabel.',
    required:
      'Propagates required semantics to participating controls and native required where the control is a real validation candidate.',
  },
  FormLabel: {
    children:
      'Field label content. FormLabel must be used inside FormField so it can use the field’s stable label id.',
  },
  FormDescription: {
    children:
      'Supporting field description. FormDescription must be used inside FormField so participating controls can reference its stable id.',
  },
  FormError: {
    children:
      'Visible field error content. FormError must be used inside FormField so participating controls can reference its stable id.',
  },
  FormFieldset: {
    children:
      'Grouped form content rendered inside a real fieldset without adding a Card or raised surface.',
  },
  FormLegend: {
    children: 'Legend content rendered by a real legend element for a FormFieldset.',
  },
  Table: {
    children: 'TableHeader and TableBody content rendered with native table semantics.',
    defaultSelected: 'Initial atomic cell selection for an uncontrolled selectable Table.',
    dense:
      'Uses the dense Table padding preset without changing typography or selection semantics.',
    onSelect:
      'Called with the complete atomic selected-cell set after a cell, row, or table selection change.',
    selectable:
      'Enables cell selection and the generated row/table Checkbox column. Selectable body rows and cells require stable ids.',
    selected:
      'Controlled atomic cell selection. Row and whole-table checked states are derived from this same cell set.',
    stickyHeader:
      'Makes header cells native sticky elements at top: 0 within the Table scroll container.',
    verticalBorders: 'Shows vertical dividers between adjacent table cells.',
  },
  TableHeader: {
    children: 'Header rows rendered inside the native table thead section.',
  },
  TableBody: {
    children: 'Body rows rendered inside the native table tbody section.',
  },
  TableRow: {
    children: 'Header or body cells rendered inside a native table row.',
    id: 'Stable body-row identifier used by selectable Table state. It is required for selectable body rows.',
  },
  TableHead: {
    align: 'Sets horizontal alignment for this header cell.',
    children: 'Header cell content.',
    maxWidth: 'Sets the maximum width constraint for this column header and its column track.',
    minWidth: 'Sets the minimum width constraint for this column header and its column track.',
    width: 'Sets the preferred width for this column header and its column track.',
  },
  TableCell: {
    align: 'Sets horizontal alignment for this body cell.',
    children: 'Body cell content.',
    id: 'Stable cell identifier used with its TableRow id by selectable Table state. It is required for selectable body cells.',
    maxWidth: 'Sets the maximum width constraint for this cell and its column track.',
    minWidth: 'Sets the minimum width constraint for this cell and its column track.',
    width: 'Sets the preferred width for this cell and its column track.',
  },
  DataGrid: {
    columns:
      'Ordered data-column definitions. Each column has a stable id, header renderer, cell renderer, and optional sort/resizing constraints.',
    columnWidths:
      'Controlled complete column-width map in CSS pixels. When provided, the parent owns resized widths.',
    defaultColumnWidths: 'Initial CSS-pixel column widths for uncontrolled resizing state.',
    defaultSelected: 'Initial atomic Table cell selection for an uncontrolled selectable DataGrid.',
    defaultSort: 'Initial sort state for uncontrolled sorting.',
    dense: 'Forwards the dense padding preset to the underlying Table.',
    onColumnWidthsChange:
      'Called continuously while a resizable column changes, with the complete current width map.',
    onSelect: 'Called with the complete atomic Table cell selection after selection changes.',
    onSortChange: 'Called when sortable-header interaction requests a new sort column/direction.',
    rows: 'Input rows to render. Every row must provide a stable id used for rendering and selection.',
    selectable:
      'Enables the underlying Table cell/row/table selection model using one atomic selected-cell set.',
    selected: 'Controlled atomic Table cell selection for the DataGrid.',
    sort: 'Controlled sort state. null means no active sort; only columns with a comparator can become sorted.',
    stickyHeader: 'Forwards native sticky-header behavior to the underlying Table.',
    verticalBorders: 'Forwards vertical cell dividers to the underlying Table.',
    virtualized:
      'Enables row windowing while preserving native table structure and selection knowledge for the complete row set.',
  },
  Accordion: {
    children: 'AccordionItem children that define the expandable sections.',
    collapsible:
      'In single mode, controls whether the currently open item may be closed so no item remains open. It is not used in multiple mode.',
    defaultValue:
      'Initial uncontrolled expanded item value in single mode or expanded item values in multiple mode.',
    disabled: 'Disables all trigger interaction without forcing already-open panels to close.',
    multiple: 'Switches from single-item selection to an array of independently open item values.',
    noDividers:
      'Removes the default public Divider rendered between adjacent AccordionItem children.',
    onValueChange:
      'Called when trigger interaction requests a new expanded value or value array according to the current mode.',
    value:
      'Controlled expanded item value in single mode or controlled expanded value array in multiple mode.',
  },
  AccordionItem: {
    children: 'The item AccordionTrigger and AccordionPanel content.',
    disabled:
      'Disables only this item’s trigger interaction without forcing an already-open panel to close.',
    value: 'Unique item identifier used by the parent Accordion expanded-state model.',
  },
  AccordionTrigger: {
    children: 'Trigger content rendered inside the real button.',
    collapseIcon: 'Icon source shown while this item is expanded.',
    expandIcon: 'Icon source shown while this item is collapsed.',
    singleLine:
      'Forces the trigger content slot to one line with ellipsis when it exceeds the available width.',
  },
  AccordionPanel: {
    children:
      'Expandable region content associated with its item trigger. Presence and layout motion keep closing content mounted until exit completes.',
  },
  ToolTip: {
    children:
      'Single target element used as the tooltip anchor. ToolTip does not add a visible layout wrapper around it.',
    content:
      'Tooltip content linked to the target through aria-describedby. Plain text uses the ToolTip typography; complex content is rendered as provided.',
    defaultOpen: 'Initial visibility when tooltip open state is uncontrolled.',
    delay: 'Delay in milliseconds before pointer or focus presence opens an uncontrolled tooltip.',
    offset: 'Distance between the tooltip surface and its target anchor.',
    onOpenChange:
      'Called when pointer, focus, Escape, or controlled interaction requests a visibility change.',
    open: 'Controlled tooltip visibility.',
    placement: 'Preferred side of the target: top, bottom, left, or right.',
  },
  Popover: {
    autoFocus:
      'Controls whether opening moves focus to the first focusable element in the panel, falling back to the panel itself.',
    children:
      'Single trigger element used as the anchored-overlay reference and open/close control.',
    content: 'Interactive content rendered inside the non-modal dialog surface.',
    defaultOpen: 'Initial visibility when Popover open state is uncontrolled.',
    offset: 'Distance between the resolved panel placement and the trigger anchor.',
    onOpenChange:
      'Called when trigger activation, outside pointer, Escape, anchor dismissal, or programmatic interaction requests a visibility change.',
    open: 'Controlled Popover visibility.',
    placement:
      'Preferred one of eight anchored placements. Collision handling may flip and shift to a better resolved placement.',
    restoreFocus:
      'Controls whether non-pointer dismissal restores focus to the trigger when focus is still in the panel or document body.',
    viewportPadding: 'Minimum collision padding kept between the panel and viewport edges.',
  },
  Dialog: {
    autoFocus:
      'Non-modal only. Forwards to Popover and controls whether opening moves focus into the dialog content.',
    children:
      'Dialog content rendered inside the non-modal Popover or modal native dialog surface.',
    closeOnBackdrop:
      'Modal only. Allows a click in the native dialog backdrop region to request closing. The default is false.',
    closeOnEscape:
      'Modal only. Allows the native dialog cancel event from Escape to request closing. The default is true.',
    defaultOpen: 'Initial open state when Dialog is uncontrolled.',
    initialFocus:
      'Modal only. Focus target used immediately after showModal(); when omitted, native dialog focusing behavior is preserved.',
    modal:
      'Selects the implementation branch: false or omitted reuses Popover; true uses a native dialog opened with showModal().',
    offset: 'Non-modal only. Forwards the anchor-to-surface distance to Popover.',
    onOpenChange:
      'Called when Dialog interaction or native dialog behavior requests an open-state change.',
    open: 'Controlled Dialog open state.',
    placement:
      'Non-modal only. Forwards the preferred anchored placement to Popover, including its collision handling.',
    restoreFocus:
      'Controls whether focus returns to the previously focused element after closing. It defaults to true.',
    trigger:
      'Non-modal only. Required trigger element used by Popover as both the anchor and open/close control.',
    viewportPadding:
      'Non-modal only. Forwards the minimum collision padding between the Popover surface and viewport edges.',
  },
  Drawer: {
    breakpoint:
      'In auto mode, names the current Theme breakpoint where Drawer switches from modal below it to non-modal at or above it. The default is md.',
    children: 'Main-view content shown alongside or behind the Drawer surface.',
    closeOnBackdrop:
      'Modal only. Allows clicks on the native dialog backdrop to request closing. The default is true.',
    closeOnEscape:
      'Modal only. Allows Escape through the native Dialog cancel event to request closing. The default is true.',
    closeThreshold:
      'Modal only below the Theme md breakpoint. Swipe distance required to request closing; the default is 64px.',
    collapseThreshold:
      'Non-modal only. SplitBox drag threshold where the Drawer snaps closed; the default is 32px.',
    defaultOpen: 'Initial open state when Drawer is uncontrolled.',
    defaultSize:
      'Initial uncontrolled Drawer size along its side axis. It is mutually exclusive with size; when neither is provided, the default is 320px.',
    drawer:
      'Drawer content. The same React subtree is moved between modal and non-modal hosts so its internal state is preserved.',
    drawerViewProps:
      'Configures the Drawer surface itself, including explicit surface styling and its AutoScrollbar settings.',
    expandThreshold:
      'Non-modal only. SplitBox drag distance required to reopen a collapsed Drawer to minSize; the default is 64px.',
    initialFocus:
      'Modal only. Focus target forwarded to the underlying modal Dialog after showModal().',
    minSize: 'Minimum Drawer size along its side axis; the default is 192px.',
    mode: 'Chooses auto, modal, or non-modal behavior. Auto is the default and switches at breakpoint.',
    onOpenChange:
      'Called when Drawer interaction requests an open-state change. Responsive mode changes do not call it.',
    onSizeChange:
      'Called with the current CSS size string when Drawer resizing requests a new size.',
    open: 'Controlled Drawer open state.',
    resizable:
      'Controls SplitBox pointer and keyboard resizing in non-modal mode. The default is true.',
    restoreFocus:
      'Modal only. Controls whether closing restores the previously focused element. The default is true.',
    side: 'Chooses the viewport edge for the Drawer and therefore whether its size controls width or height. The default is right.',
    size: 'Controlled Drawer size along its side axis. It is mutually exclusive with defaultSize.',
  },
  Menu: {
    children: 'MenuItem and Divider content rendered inside the root menu surface.',
    closeOnSelect:
      'Controls whether activating a normal item closes the entire menu tree by default. Individual MenuItem values can override it.',
    defaultOpen: 'Initial root-menu visibility when open state is uncontrolled.',
    offset:
      'Distance between the root menu and its trigger. The default is 6px, or 0 when overlapTrigger is true and offset is omitted.',
    onOpenChange:
      'Called when trigger interaction, outside dismissal, Escape, or anchor-hidden dismissal requests a visibility change.',
    open: 'Controlled root-menu visibility.',
    overlapTrigger:
      'Changes root positioning so the menu may overlap the trigger instead of starting outside it. The default is false.',
    placement:
      'Preferred one of eight root-menu placements. Collision handling may flip or shift the resolved placement; the default is bottom-left.',
    submenuOffset: 'Distance between each submenu surface and its parent item. The default is 4px.',
    trigger:
      'Single element used as the menu anchor and trigger with menu-specific expanded/controls semantics.',
    viewportPadding:
      'Minimum collision padding kept between root/submenu surfaces and viewport edges. The default is 8px.',
  },
  MenuItem: {
    closeOnSelect:
      'Overrides Menu closeOnSelect for this normal item. It is ignored when the item opens a submenu instead of selecting.',
    danger: 'Applies the Menu danger visual treatment without changing activation semantics.',
    disabled:
      'Disables activation and removes the item from roving keyboard navigation while preserving disabled semantics.',
    icon: 'Optional leading icon rendered before the primary and secondary text.',
    onSelect:
      'Called when this normal command item is activated by pointer, Enter, or Space. Submenu parent activation opens the submenu instead.',
    secondaryText:
      'Optional secondary text rendered below or alongside the primary item text according to Menu styling.',
    submenu:
      'Nested MenuItem/Divider content for a recursively positioned submenu. Providing it makes this item a submenu parent.',
    text: 'Primary visible command label for the menu item.',
  },
  Tabs: {
    activation:
      'Chooses whether roving keyboard focus also selects the focused tab automatically or waits for Enter/Space. The default is automatic.',
    children: 'Compound TabList, Tab, and TabPanel content sharing this Tabs selection context.',
    defaultValue:
      'Initial selected value for uncontrolled Tabs. When omitted with no controlled value, the first enabled Tab is selected.',
    indicatorThickness:
      'Overrides the shared selection indicator thickness in CSS pixels; otherwise the Tabs theme value is used.',
    onValueChange: 'Called when user interaction requests a different enabled tab value.',
    orientation:
      'Chooses horizontal or vertical layout, ARIA orientation, and matching arrow-key navigation. The default is horizontal.',
    value: 'Controlled selected Tab value.',
    variant:
      'Chooses underline or pill visuals without changing selection, focus, ARIA, or keyboard behavior. The default is underline.',
  },
  TabList: {
    children:
      'Tab children rendered inside the tablist together with the single shared moving selection indicator.',
  },
  Tab: {
    children: 'Visible content of the native button used as this tab.',
    disabled:
      'Disables the native tab button, removes it from default selection and roving navigation, and exposes aria-disabled.',
    value:
      'Unique value identifying this tab and linking it to the TabPanel with the same value inside the same Tabs root.',
  },
  TabPanel: {
    children:
      'Panel content. All panels stay mounted; inactive panels are hidden instead of unmounted.',
    value:
      'Value linking this panel to the Tab with the same value and determining whether the panel is selected.',
  },
  Snack: {
    action:
      'Shortcut-content action label or content. It must be provided together with onAction and cannot be combined with custom children.',
    children: 'Custom Snack content. When provided, text, icon, action, and onAction are not used.',
    defaultOpen: 'Initial visibility for an uncontrolled declarative Snack. The default is true.',
    duration:
      'Automatic-dismiss lifetime in milliseconds for a non-persistent Snack. The default is 4000ms and negative values clamp to zero.',
    icon: 'Optional leading icon for shortcut text content.',
    onAction:
      'Required callback paired with action. Running the action also requests that the current Snack close.',
    onDismissed:
      'Called after the Snack exit transition finishes and the instance is ready to be removed.',
    onOpenChange:
      'Called when lifetime expiry, an action, or other Snack behavior requests a visibility change.',
    open: 'Controlled visibility for a declarative Snack.',
    persistent:
      'Disables automatic dismissal and lifetime progress when true. The default is false.',
    placement:
      'Chooses one of six edge-aligned Snack regions and therefore the enter/exit direction. The default is bottom-center.',
    progress:
      'Shows the built-in lifetime Progress for auto-dismiss Snacks and keeps it synchronized with the remaining lifetime. The default is false.',
    text: 'Primary shortcut-content message. It can be combined with icon and an action pair, but not custom children.',
    variant:
      'Chooses default, success, warning, danger, or info presentation. Warning and danger use alert semantics; the rest use status semantics.',
  },
  SnackProvider: {
    children: 'Application subtree that receives the Snack queue controller through useSnack().',
    container:
      "Optional mount container for this provider's independent Snack regions. Accepts an element, ref, getter, or null; omitted uses the current default portal host.",
  },
  List: {
    children: 'Compound ListItem content entry mode. It is mutually exclusive with items.',
    defaultSelected:
      'Initial uncontrolled selection: string or null in single mode, or an array of ids in multiple mode.',
    disabled:
      'Disables the whole List for selection and roving focus, including all contained items.',
    gap: 'Gap between list entries using View spacing semantics; numeric values are px units.',
    items:
      'Data-driven list content. Each item supplies a stable id plus text and optional icon, secondary text, trailing content, or disabled state; mutually exclusive with children.',
    noDividers:
      'Suppresses the default zero-gap Divider inserted between neighboring entries without changing selection or layout behavior.',
    onSelect:
      'Called when selection changes: string or null for single selection, or an array of ids for multiple selection.',
    orientation:
      'Chooses vertical or horizontal layout and matching arrow-key navigation. The default is vertical.',
    selected:
      'Controlled selection value: string or null in single mode, or an array of ids in multiple mode.',
    selection:
      'Chooses none, single, or multiple selection semantics. The default is none; selection props are unavailable in none mode.',
    singleLine:
      'Applies Text.singleLine behavior to supported primary/secondary and direct Text content so overflowing text truncates with an ellipsis.',
    virtualized:
      'Enables windowed rendering of the viewport plus overscan while preserving the roving focus target and using the List itself as the scroll container.',
  },
  ListItem: {
    children:
      'Custom row content rendered inside this list item; direct text content participates in List singleLine behavior.',
    disabled:
      'Disables selection and removes this item from roving keyboard navigation; parent List disabled state also disables it.',
    id: 'Stable list-item identity used for selection, focus, and virtualization. Use viewProps.id separately for a DOM id.',
  },
  ThemeProvider: {
    children:
      "Subtree that receives this provider's merged theme, color mode, and reduced-motion policy.",
    mode: 'Chooses light, dark, or system color mode. When omitted, the provider inherits the parent requested mode; the root default is system.',
    reducedMotion:
      'Chooses system, reduce, or no-preference motion policy. When omitted, the provider inherits the parent policy; the root default is system.',
    theme:
      'Partial theme definition merged over the inherited theme for this subtree; unspecified values continue to inherit.',
  },
}

function responsiveDescription(name) {
  if (['sm', 'md', 'lg', 'xl'].includes(name)) {
    return `Overrides supported props at the ${name} viewport breakpoint.`
  }

  if (/^container[A-Z]/.test(name)) {
    return 'Overrides View styles when the nearest responsive container reaches this breakpoint.'
  }

  return ''
}

export function documentationPropDescription(componentName, propName) {
  if (componentName === 'View') {
    return viewPropDescriptions[propName] ?? responsiveDescription(propName)
  }

  return componentPropDescriptions[componentName]?.[propName] ?? responsiveDescription(propName)
}

import { config } from '@fortawesome/fontawesome-svg-core'

/**
 * Stops Font Awesome from injecting its stylesheet at runtime.
 *
 * That injected <style> is unlayered, and unlayered CSS outranks every `@layer` -- including
 * Tailwind 4's `utilities` -- so `.svg-inline--fa { height: 1em }` beat every `size-*` class
 * and collapsed every icon to 16px once the page hydrated. (Tailwind 3 emitted no real layers,
 * so this never came up: Font Awesome inserts its style as the first child of <head>, which
 * put it behind the Tailwind stylesheet on source order alone.) `globals.css` imports the same
 * stylesheet into `layer(base)` instead, where `size-*` outranks it.
 *
 * Import this from every **client** component that renders an icon. Only those matter: the
 * injection happens in `insertCss`, which returns early when there is no DOM, so a server
 * component can never trigger it and importing this there would do nothing.
 */
config.autoAddCss = false

// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Adam Thomas - Software Engineer & Eng Manager'
export const SITE_DESCRIPTION =
  'Personal profile of Adam Thomas, Experienced & collaborative tech lead who also enjoys building & managing great teams, with a front end spin.'


  /** List of data attributes used throughout for JS and CSS behaviour. */
export enum BehaviourAttributes {
  NAV = 'data-nav',

  NAV_SCROLL_POS_IS_BELOW = 'data-nav-scroll-pos-is-below',
  NAV_IS_STUCK = 'data-nav-is-stuck',
  NAV_HAS_SUB_NAV = 'data-nav-has-sub-nav',
  NAV_PAGE_LINK = 'data-nav-page-link'
}

export enum AttributeSelectorOperator {
  EQUALS = '',
}

export const asProp = <Attr extends BehaviourAttributes>(attr: Attr) =>
  ({ [attr]: true }) as { readonly [key in Attr]: boolean }

export const asSelector = <Attr extends BehaviourAttributes>(
  attr: Attr,
  val?: string,
  operator?: AttributeSelectorOperator,
) =>
  `[${attr}${
    val !== undefined
      ? `${operator ?? AttributeSelectorOperator.EQUALS}'${val}'`
      : ``
  }]`

// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Adam Thomas - Software Engineer & Eng Manager'
export const SITE_DESCRIPTION =
  'Personal profile of Adam Thomas, Experienced & collaborative tech lead who also enjoys building & managing great teams, with a front end spin.'

export enum BehaviourAttributes {
  SCROLLED_BELOW_HEADER = 'data-scrolled-below-header',
  NAV = 'data-nav',
  PRIMARY_HEADER_HAS_SUB_NAV = 'data-has-sub-nav',
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
      ? `${operator ?? AttributeSelectorOperator.EQUALS}${val}`
      : ``
  }]`

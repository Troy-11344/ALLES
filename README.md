# Allés theme

The Shopify theme for Allés, Kitchen & More (Atlanta). An Online Store 2.0 theme built from the
[homepage mockup](https://claude.ai/artifact/J6Qduw5h8xroh5LJRKbSBH) and the
[Allés Web Style Guide](https://claude.ai/code/artifact/b3e67210-8347-43e0-b398-5908b6f484fb).

## What lives here, and what lives in Shopify

| This repo | Shopify admin |
| --- | --- |
| Theme code: layout, sections, templates, CSS, JS | Products, collections, prices, allergens |
| Design tokens in `assets/theme.css` and `config/settings_schema.json` | Hero slides, tiles and copy the owners edit in the theme editor |
| Brand assets: logo snippets, fonts, default photos | Payments, pickup and delivery, domain, email, apps |
| Deployment through the Shopify GitHub integration | Customers, orders, subscriptions |

## Layout

```
layout/theme.liquid         page shell, fonts, header and footer groups
sections/                   one file per homepage block and per page body
snippets/                   logo marks, product card, icons
templates/*.json            which sections each page uses
config/settings_schema.json theme settings shown in the editor
assets/theme.css            tokens and all styles
assets/theme.js             hero slideshow, menu rail, add to order, scroll reveals
locales/en.default.json     editor labels and storefront strings
```

## What the theme expects from the store

- Collections for each part of the menu (for example Morning, Midday, Sweet), picked in the
  menu section of the homepage. The `all` collection is the full menu.
- Product metafields under the `alles` namespace: `ingredients` (one line under the dish name),
  `dietary` (list of values such as V, GF, DF) and `allergens` (text). Create them under Settings,
  Custom data, Products.
- A `location` metaobject (Settings, Custom data, Metaobjects) with fields `name`, `address`, `hours`,
  `pickup_window`, `map_url`, `image` and `open` (true/false), for the Locations page.
- Pages using the `page.catering` and `page.locations` templates (pick the template on the page in
  Online Store, Pages). Catering requests arrive through Shopify's contact form.
- Selling plans from the Shopify Subscriptions app; the dish page shows them as a one-time or
  recurring choice as soon as a product has one.
- Navigation menus named `main-menu` (header) and `footer`.
- Customer accounts switched on, so sign in, register, orders and addresses work.

## Working on it

1. Install the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli).
2. `shopify theme dev --store <store>.myshopify.com` to preview against the store.
3. `shopify theme check` before opening a pull request.

## Deploying

Connect the repository in the store under Online Store, Themes, Add theme, Connect from GitHub,
and pick the `main` branch. Every merge to `main` then updates that theme. Settings changed in the
theme editor are committed back to `config/settings_data.json` and `templates/*.json` by Shopify,
so pull before starting work.

## Brand

- Colors: Coconut Milk `#F4EFE7` page, Ink `#221C18` text and buttons, cream `#EAE3D7`,
  Pewter `#7D7267`, Stone `#CFC4B4`, Olive `#55603F` accent. Mulberry Jam `#4C0000` and
  Butter Yellow `#F4EBAA` are kept in the settings for later, unused by default.
- Type: Instrument Serif for headlines, BIZ UDMincho for text and small capitals,
  Pinyon Script as the stand-in for the brand's script until a license is sorted.
- Shapes: pill buttons, round icon buttons, 22 px corners on photographs.

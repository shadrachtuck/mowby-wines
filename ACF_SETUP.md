# ACF Setup Guide for Mowby Wines Website

This guide will help you set up Advanced Custom Fields (ACF) in WordPress for the Mowby Wines headless website.

## Prerequisites

1. Install and activate these WordPress plugins:
   - **Advanced Custom Fields** (ACF)
   - **WPGraphQL**
   - **WPGraphQL for Advanced Custom Fields** (download from GitHub: https://github.com/wp-graphql/wp-graphql-acf)

2. In WordPress Admin, go to `GraphQL > Settings` and enable:
   - ✅ Enable GraphQL Debug Mode
   - ✅ Enable Public Introspection

## Step 1: Create "Wines" Custom Post Type (Optional)

If you want to manage wines as a custom post type:

1. In WordPress Admin, go to `ACF > Post Types`
2. Click "Add New"
3. Configure as follows:

### Post Type Settings:
- **Post Type Key**: `wine`
- **Plural Label**: `Wines`
- **Singular Label**: `Wine`
- **Supports**: Title, Editor, Featured Image, Custom Fields
- **Public**: ✅ Yes
- **Show in GraphQL**: ✅ Yes

4. Click "Publish"

## Step 2: Create ACF Field Group for Wines (Optional)

1. In WordPress Admin, go to `Custom Fields > Field Groups`
2. Click "Add New"
3. Name the field group: "Wine Fields"

### Add fields for wine products:
- **Varietal** (Text)
- **Vintage** (Number or Text)
- **Description** (Textarea)
- **Tasting Notes** (Textarea)
- **Bottle Image** (Image)

### GraphQL Settings:
- Enable "Show in GraphQL": ✅ Yes
- **GraphQL Field Name**: `wineFields`

4. Click "Publish"

## Step 3: Create Pages

1. **About Page**: `Pages > Add New`
   - Title: "About"
   - Slug: "about"
   - Add winemaker and First Crush story content
   - Publish

2. **Contact Page** (optional - frontend has its own contact form)

3. **Blog** - Use WordPress Posts for blog content

## Step 4: Verify GraphQL Schema

1. Go to `GraphQL > GraphiQL IDE` in WordPress Admin
2. Run test query for pages:

```graphql
query TestPages {
  page(id: "about", idType: SLUG) {
    title
    content
  }
}
```

If you see results, the setup is working correctly!

## Troubleshooting

### If GraphQL query doesn't return ACF fields:
1. Check that "WPGraphQL for Advanced Custom Fields" plugin is active
2. Verify the field group's GraphQL settings
3. Clear any caching plugins

### If pages don't appear:
1. Verify pages are published
2. Check slug matches query (e.g., "about")

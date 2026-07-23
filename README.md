# My Hugo Blog

A tech/engineering blog built with [Hugo](https://gohugo.io/) using the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme.

## Local development

1. Install Hugo (extended edition, v0.147+): https://gohugo.io/installation/
2. From this directory, run:
   ```
   hugo server -D
   ```
3. Open http://localhost:1313

## Writing a new post

```
hugo new posts/my-new-post.md
```

Edit the file in `content/posts/`, set `draft: false` when ready to publish.

## Before you deploy

Update these in `hugo.yaml`:
- `baseURL` — your actual site URL
- `params.socialIcons` — your GitHub/LinkedIn URLs
- `params.editPost.URL` — your repo URL
- Replace "NishitHada" everywhere (search the repo)

## Deploying to GitHub Pages (free)

1. Push this folder to a new GitHub repo (e.g. `myblog`)
2. In the repo, go to Settings → Pages → Source → GitHub Actions
3. Add `.github/workflows/hugo.yml` (see Hugo docs: https://gohugo.io/host-and-deploy/host-on-github-pages/) — it builds and deploys on every push to `main`
4. Set `baseURL` in `hugo.yaml` to `https://<username>.github.io/<repo>/`
5. Push — your site goes live at that URL in ~1 minute

## Deploying to Netlify/Vercel/Cloudflare Pages (also free, simpler)

Just connect the GitHub repo — they auto-detect Hugo. Build command: `hugo --minify`. Publish directory: `public`.

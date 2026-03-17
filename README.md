### Licensing & Usage

This respository contains a mix of creative media and software, each of which are licensed under separate terms. Please see the appropriate [LICENSE](LICENSE) and [COPYRIGHT](COPYRIGHT) files for full details.

For additional inquiries around licensing, reproduction, or distribution, you may contact me via my website: [https://alexmarshall.me](https://alexmarshall.me/contact)

### Eleventy static site

This site is built using [Eleventy](https://www.11ty.dev), a static site generator, using Node.js, Markdown, and Liquid templates. The site is hosted on [Cloudflare](https://www.cloudflare.com) using Cloudflare [Workers](https://workers.cloudflare.com) and [R2](https://www.cloudflare.com/developer-platform/products/r2/) for larger assets.

Site design follows the principles laid out by [Andy Bell](https://bell.bz/about/), which he calls [CUBE CSS](https://cube.fyi). The main principle is that you design your site layout in a single way that works for any device and viewport size. A fluidly scalable type approach called [Utopia](https://utopia.fyi) results in type sizing that adapts to any display configuration or size.

### Cloudflare hosting

The site is hosted on Cloudflare Workers with static assets. Audio files for guided exercises are served from R2 via a Worker route that handles range requests for streaming playback.

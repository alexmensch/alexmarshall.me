export default {
  pagination: {
    before(data) {
      return data.filter((item) => {
        const tags = item.tags || [];
        return tags.includes("psychology");
      });
    }
  },
  eleventyComputed: {
    date: (data) => data.post.date,
    version_date: (data) => data.post.version_date,
    meta: (data) => data.post.meta,
    canonical_url: (data) => {
      if (data.post?.permalink) {
        return `https://alxm.me${data.post.permalink}`;
      }
      return undefined;
    }
  }
};

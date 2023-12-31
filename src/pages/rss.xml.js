import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: "Rahuletto.",
		description: "Building the future, pixel by pixel using a blend of code and imagination to design exceptional user experiences",
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blogs/${post.slug}/`,
		})),
	});
}

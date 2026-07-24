import ArticleFigure from "./ArticleFigure.astro";
import ArticleFooter from "./ArticleFooter.astro";
import ArticleHero from "./ArticleHero.astro";
import ArticleMeta from "./ArticleMeta.astro";
import AuthorCard from "./AuthorCard.astro";
import Breadcrumbs from "./Breadcrumbs.astro";
import CalloutBox from "./CalloutBox.astro";
import CodeBlock from "./CodeBlock.astro";
import ComparisonCards from "./ComparisonCards.astro";
import ContributorCard from "./ContributorCard.astro";
import DataHighlight from "./DataHighlight.astro";
import DefinitionBox from "./DefinitionBox.astro";
import DownloadResource from "./DownloadResource.astro";
import FAQBlock from "./FAQBlock.astro";
import Footnotes from "./Footnotes.astro";
import GiscusComments from "./GiscusComments.astro";
import InlineCTA from "./InlineCTA.astro";
import KeyTakeaways from "./KeyTakeaways.astro";
import ProsCons from "./ProsCons.astro";
import QuoteBlock from "./QuoteBlock.astro";
import RelatedArticles from "./RelatedArticles.astro";
import ResponsiveTable from "./ResponsiveTable.astro";
import ShareBar from "./ShareBar.astro";
import SidebarCta from "./SidebarCta.astro";
import TableOfContents from "./TableOfContents.astro";

export const editorialComponents = {
	ArticleFigure,
	ArticleFooter,
	ArticleHero,
	ArticleMeta,
	AuthorCard,
	Breadcrumbs,
	CalloutBox,
	CodeBlock,
	ComparisonCards,
	ContributorCard,
	DataHighlight,
	DefinitionBox,
	DownloadResource,
	FAQBlock,
	Footnotes,
	GiscusComments,
	InlineCTA,
	KeyTakeaways,
	ProsCons,
	QuoteBlock,
	RelatedArticles,
	ResponsiveTable,
	ShareBar,
	SidebarCta,
	TableOfContents
};

export type EditorialComponentName = keyof typeof editorialComponents;

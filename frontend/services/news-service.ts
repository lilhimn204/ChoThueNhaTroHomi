import { apiRequest, proxyRequest } from "@/services/api-client";
import type { NewsArticle, NewsArticleStatus, NewsCategory, PageResponse } from "@/types";

interface SearchNewsParams {
  keyword?: string;
  category?: string;
  page?: number;
  size?: number;
}

interface AdminSearchNewsParams extends SearchNewsParams {
  status?: NewsArticleStatus | "";
}

export interface NewsArticlePayload {
  title: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  summary: string;
  content: string;
  thumbnailUrl?: string;
  featured?: boolean;
  category: string;
  status: NewsArticleStatus;
  publishedAt?: string | null;
  authorName: string;
}

export interface NewsCategoryPayload {
  name: string;
  description?: string;
  displayOrder?: number;
  enabled?: boolean;
}

export function searchNewsArticles(params: SearchNewsParams, signal?: AbortSignal) {
  return apiRequest<PageResponse<NewsArticle>>("news", {
    query: {
      keyword: params.keyword,
      category: params.category,
      page: params.page ?? 0,
      size: params.size ?? 9,
    },
    signal,
  });
}

export function getNewsArticle(slug: string, signal?: AbortSignal) {
  return apiRequest<NewsArticle>(`news/${slug}`, { signal });
}

export function getNewsCategories(signal?: AbortSignal) {
  return apiRequest<NewsCategory[]>("news-categories", { signal });
}

export function searchAdminNewsArticles(
  params: AdminSearchNewsParams,
  signal?: AbortSignal,
) {
  return proxyRequest<PageResponse<NewsArticle>>("admin/news", {
    query: {
      keyword: params.keyword,
      category: params.category,
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
    signal,
  });
}

export function getAdminNewsArticle(articleId: number, signal?: AbortSignal) {
  return proxyRequest<NewsArticle>(`admin/news/${articleId}`, { signal });
}

export function getAdminNewsCategories(signal?: AbortSignal) {
  return proxyRequest<NewsCategory[]>("admin/news-categories", { signal });
}

export function createNewsCategory(payload: NewsCategoryPayload) {
  return proxyRequest<NewsCategory>("admin/news-categories", {
    method: "POST",
    body: payload,
  });
}

export function updateNewsCategory(categoryId: number, payload: NewsCategoryPayload) {
  return proxyRequest<NewsCategory>(`admin/news-categories/${categoryId}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteNewsCategory(categoryId: number) {
  return proxyRequest<{ message: string }>(`admin/news-categories/${categoryId}`, {
    method: "DELETE",
  });
}

export function createNewsArticle(payload: NewsArticlePayload) {
  return proxyRequest<NewsArticle>("admin/news", {
    method: "POST",
    body: payload,
  });
}

export function updateNewsArticle(articleId: number, payload: NewsArticlePayload) {
  return proxyRequest<NewsArticle>(`admin/news/${articleId}`, {
    method: "PUT",
    body: payload,
  });
}

export function updateNewsArticleStatus(articleId: number, status: NewsArticleStatus) {
  return proxyRequest<NewsArticle>(`admin/news/${articleId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteNewsArticle(articleId: number) {
  return proxyRequest<{ message: string }>(`admin/news/${articleId}`, {
    method: "DELETE",
  });
}

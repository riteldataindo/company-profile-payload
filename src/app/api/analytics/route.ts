import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from 'next/server';
import { authorizeAdminRequest, privateAdminHeaders } from '@/lib/admin-auth';

// Simple in-memory cache with TTL
interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const FAILURE_CACHE_TTL = 60 * 1000;

function getFromCache(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCache(key: string, data: unknown, ttl = CACHE_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

type GoogleApiError = {
  code?: number | string;
  message?: string;
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
  status?: number;
};

function getAnalyticsErrorReason(error: unknown): {
  log: Record<string, number | string | undefined>;
  message: string;
  reason: 'ga4_authentication_required' | 'ga4_unavailable';
} {
  const googleError = error && typeof error === 'object' ? error as GoogleApiError : {};
  const upstreamError = googleError.response?.data?.error;
  const isInvalidGrant = googleError.message === 'invalid_grant' || upstreamError === 'invalid_grant';

  return {
    log: {
      code: googleError.code,
      message: googleError.message,
      status: googleError.status ?? googleError.response?.status,
      upstreamError,
    },
    message: isInvalidGrant
      ? 'Google Analytics authorization has expired. Reconnect the GA4 credentials.'
      : 'Google Analytics is temporarily unavailable.',
    reason: isInvalidGrant ? 'ga4_authentication_required' : 'ga4_unavailable',
  };
}

function getPropertyId(): string {
  return process.env.GA_PROPERTY_ID || '530201251';
}

function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

async function runReport(
  client: BetaAnalyticsDataClient,
  dateRange: { startDate: string; endDate: string },
  dimensions: string[],
  metrics: string[],
  limit?: number,
) {
  const request = {
    property: `properties/${getPropertyId()}`,
    dateRanges: [dateRange],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    limit,
  };

  const response = await client.runReport(request as any);
  return response;
}

export async function GET(request: Request) {
  try {
    const authorization = await authorizeAdminRequest(request, 'read');
    if (!authorization.ok) return authorization.response;

    // Check cache first
    const cacheKey = 'analytics-dashboard';
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, { headers: privateAdminHeaders() });
    }

    const client = new BetaAnalyticsDataClient({ fallback: 'rest' });
    const today = getDaysAgo(0);
    const thirtyDaysAgo = getDaysAgo(30);
    const sevenDaysAgo = getDaysAgo(7);
    const sixtyDaysAgo = getDaysAgo(60);

    // Fetch stats for last 30 days
    const statsResponse = await runReport(
      client,
      { startDate: thirtyDaysAgo, endDate: today },
      [],
      ['sessions', 'screenPageViews', 'activeUsers', 'averageSessionDuration'],
    );

    const statsData = statsResponse[0];
    const statRow = statsData.rows?.[0];

    const stats = {
      sessions: parseInt(statRow?.metricValues?.[0]?.value || '0', 10),
      pageViews: parseInt(statRow?.metricValues?.[1]?.value || '0', 10),
      activeUsers: parseInt(statRow?.metricValues?.[2]?.value || '0', 10),
      avgSessionDuration: parseFloat(statRow?.metricValues?.[3]?.value || '0'),
    };

    // Fetch weekly traffic breakdown
    const weeklyResponse = await runReport(
      client,
      { startDate: sevenDaysAgo, endDate: today },
      ['date'],
      ['screenPageViews', 'activeUsers'],
    );

    const weeklyData = weeklyResponse[0];
    const weeklyTraffic = (weeklyData.rows || []).map((row) => {
      const dateStr = row.dimensionValues?.[0]?.value || '';
      const date = dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      return {
        date,
        pageViews: parseInt(row.metricValues?.[0]?.value || '0', 10),
        uniqueUsers: parseInt(row.metricValues?.[1]?.value || '0', 10),
      };
    });

    // Fetch traffic sources
    const sourcesResponse = await runReport(
      client,
      { startDate: thirtyDaysAgo, endDate: today },
      ['sessionDefaultChannelGroup'],
      ['sessions'],
    );

    const sourcesData = sourcesResponse[0];
    const totalSessions =
      statsData.totals?.[0]?.metricValues?.[0]?.value || '0';
    const totalSessionsNum = parseInt(totalSessions as string, 10);

    const trafficSources = (sourcesData.rows || []).map((row) => {
      const sessionCount = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const percentage =
        totalSessionsNum > 0
          ? ((sessionCount / totalSessionsNum) * 100).toFixed(1)
          : '0';
      return {
        source: row.dimensionValues?.[0]?.value || 'Unknown',
        sessions: sessionCount,
        percentage: parseFloat(percentage),
      };
    });

    // Fetch top pages
    const topPagesResponse = await runReport(
      client,
      { startDate: thirtyDaysAgo, endDate: today },
      ['pagePath', 'pageTitle'],
      ['screenPageViews'],
      5,
    );

    const topPagesData = topPagesResponse[0];

    // Fetch previous 30 days data for comparison
    const previousStartDate = getDaysAgo(60);
    const previousEndDate = getDaysAgo(30);

    const prevPagesResponse = await runReport(
      client,
      { startDate: previousStartDate, endDate: previousEndDate },
      ['pagePath', 'pageTitle'],
      ['screenPageViews'],
      5,
    );

    const prevPagesData = prevPagesResponse[0];
    const prevPagesMap = new Map();

    (prevPagesData.rows || []).forEach((row) => {
      const pagePath = row.dimensionValues?.[0]?.value || '';
      const views = parseInt(row.metricValues?.[0]?.value || '0', 10);
      prevPagesMap.set(pagePath, views);
    });

    const topPages = (topPagesData.rows || []).map((row) => {
      const pagePath = row.dimensionValues?.[0]?.value || '';
      const pageTitle = row.dimensionValues?.[1]?.value || 'Unknown';
      const currentViews = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const previousViews = prevPagesMap.get(pagePath) || 0;
      const change = previousViews > 0 ?
        (((currentViews - previousViews) / previousViews) * 100).toFixed(1) :
        '0';

      return {
        pagePath,
        pageTitle,
        views: currentViews,
        changePercent: parseFloat(change),
      };
    });

    // Fetch monthly comparison
    const thisMonthResponse = await runReport(
      client,
      { startDate: getDaysAgo(30), endDate: today },
      [],
      ['sessions'],
    );

    const lastMonthResponse = await runReport(
      client,
      { startDate: getDaysAgo(60), endDate: getDaysAgo(30) },
      [],
      ['sessions'],
    );

    const thisMonthSessions = parseInt(
      thisMonthResponse[0].rows?.[0]?.metricValues?.[0]?.value || '0',
      10,
    );
    const lastMonthSessions = parseInt(
      lastMonthResponse[0].rows?.[0]?.metricValues?.[0]?.value || '0',
      10,
    );

    const monthlyChangePercent =
      lastMonthSessions > 0
        ? (((thisMonthSessions - lastMonthSessions) / lastMonthSessions) * 100).toFixed(1)
        : '0';

    const analyticsData = {
      available: true,
      stats,
      weeklyTraffic,
      trafficSources,
      topPages,
      monthlyComparison: {
        thisMonth: thisMonthSessions,
        lastMonth: lastMonthSessions,
        changePercent: parseFloat(monthlyChangePercent),
      },
      lastUpdated: new Date().toISOString(),
    };

    // Cache the result
    setCache(cacheKey, analyticsData);

    return NextResponse.json(analyticsData, { headers: privateAdminHeaders() });
  } catch (error) {
    const failure = getAnalyticsErrorReason(error);
    console.error('Analytics API unavailable:', failure.log);

    const response = {
      available: false,
      message: failure.message,
      reason: failure.reason,
    };
    setCache('analytics-dashboard', response, FAILURE_CACHE_TTL);

    return NextResponse.json(response, { headers: privateAdminHeaders() });
  }
}

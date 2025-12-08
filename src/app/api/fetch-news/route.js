import { supabase } from "@/lib/supabase";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Domain to search terms mapping for better news relevance
const DOMAIN_SEARCH_TERMS = {
  'full-stack': 'web development OR javascript OR react OR nodejs OR frontend OR backend',
  'fullstack': 'web development OR javascript OR react OR nodejs OR frontend OR backend',
  'full_stack': 'web development OR javascript OR react OR nodejs OR frontend OR backend',
  'mobile-development': 'mobile development OR "react native" OR flutter OR "ios development" OR "android development"',
  'mobile_development': 'mobile development OR "react native" OR flutter OR "ios development" OR "android development"',
  'data-science': '"data science" OR "machine learning" OR python OR pandas OR "data analysis" OR AI',
  'data_science': '"data science" OR "machine learning" OR python OR pandas OR "data analysis" OR AI',
  'cybersecurity': 'cybersecurity OR "information security" OR hacking OR "data breach" OR "security vulnerability"',
  'cloud-computing': '"cloud computing" OR AWS OR Azure OR "google cloud" OR kubernetes OR serverless',
  'cloud_computing': '"cloud computing" OR AWS OR Azure OR "google cloud" OR kubernetes OR serverless',
  'ai-ml': '"artificial intelligence" OR "machine learning" OR "deep learning" OR neural OR AI OR ML',
  'ai_ml': '"artificial intelligence" OR "machine learning" OR "deep learning" OR neural OR AI OR ML',
  'blockchain': 'blockchain OR cryptocurrency OR bitcoin OR ethereum OR "smart contracts" OR DeFi',
  'devops': 'devops OR docker OR kubernetes OR "continuous integration" OR CI/CD OR automation',
  'ui-ux': '"ui design" OR "ux design" OR "user interface" OR "user experience" OR figma OR design',
  'ui_ux': '"ui design" OR "ux design" OR "user interface" OR "user experience" OR figma OR design',
  'game-development': '"game development" OR unity OR "unreal engine" OR gaming OR "indie games"',
  'game_development': '"game development" OR unity OR "unreal engine" OR gaming OR "indie games"',
  'software-engineering': '"software engineering" OR programming OR coding OR "software architecture" OR development',
  'software_engineering': '"software engineering" OR programming OR coding OR "software architecture" OR development',
  'product-management': '"product management" OR agile OR scrum OR "product strategy" OR roadmap',
  'product_management': '"product management" OR agile OR scrum OR "product strategy" OR roadmap',
  'digital-marketing': '"digital marketing" OR SEO OR "social media marketing" OR "content marketing" OR PPC',
  'digital_marketing': '"digital marketing" OR SEO OR "social media marketing" OR "content marketing" OR PPC',
  'graphic-design': '"graphic design" OR adobe OR photoshop OR illustrator OR "visual design"',
  'graphic_design': '"graphic design" OR adobe OR photoshop OR illustrator OR "visual design"',
  'web-development': 'web development OR HTML OR CSS OR javascript OR "web design" OR responsive',
  'web_development': 'web development OR HTML OR CSS OR javascript OR "web design" OR responsive',
  'backend-development': '"backend development" OR "server side" OR API OR database OR nodejs OR python',
  'backend_development': '"backend development" OR "server side" OR API OR database OR nodejs OR python',
  'frontend-development': '"frontend development" OR "user interface" OR react OR vue OR angular',
  'frontend_development': '"frontend development" OR "user interface" OR react OR vue OR angular',
  'machine-learning': '"machine learning" OR "deep learning" OR tensorflow OR pytorch OR "neural networks"',
  'machine_learning': '"machine learning" OR "deep learning" OR tensorflow OR pytorch OR "neural networks"',
  'data-analytics': '"data analytics" OR "business intelligence" OR tableau OR "data visualization"',
  'data_analytics': '"data analytics" OR "business intelligence" OR tableau OR "data visualization"',
};

// Popular tech domains for news sources
const TECH_DOMAINS = [
  'techcrunch.com',
  'theverge.com',
  'arstechnica.com',
  'wired.com',
  'engadget.com',
  'venturebeat.com',
  'zdnet.com',
  'cnet.com'
];

export async function GET(request) {
  try {
    console.log('🚀 Starting automated news fetch...');

    if (!NEWS_API_KEY) {
      console.error('❌ NEWS_API_KEY not configured');
      return Response.json({ error: 'NEWS_API_KEY not configured' }, { status: 500 });
    }

    // Get all unique domains from resources table
    const { data: existingResources, error: resourcesError } = await supabase
      .from('resources')
      .select('domain, id, materials')
      .not('domain', 'is', null);

    if (resourcesError) {
      throw resourcesError;
    }

    // Also get domains that might have subscriptions but no resources yet
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('user_subscriptions')
      .select('domain')
      .not('domain', 'is', null);

    if (subscriptionsError) {
      console.warn('Warning: Could not fetch subscriptions:', subscriptionsError);
    }

    // Only use domains that exist in database (resources or subscriptions)
    const resourceDomains = existingResources.map(r => r.domain);
    const subscriptionDomains = subscriptions?.map(s => s.domain) || [];
    const allDomains = [...new Set([...resourceDomains, ...subscriptionDomains])];

    console.log(`📊 Found ${allDomains.length} domains to update:`, allDomains);

    const results = {
      success: 0,
      failed: 0,
      domains: []
    };

    // Process each domain
    for (const domain of allDomains) {
      try {
        console.log(`📰 Fetching news for: ${domain}`);
        
        const searchQuery = DOMAIN_SEARCH_TERMS[domain] || domain.replace('-', ' ');
        const domainFilter = TECH_DOMAINS.join(',');
        
        // Calculate date range (last 7 days to ensure fresh content)
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
        const fromDateString = fromDate.toISOString().split('T')[0];

        // Fetch news from News API
        const newsUrl = new URL('https://newsapi.org/v2/everything');
        newsUrl.searchParams.set('q', searchQuery);
        newsUrl.searchParams.set('domains', domainFilter);
        newsUrl.searchParams.set('language', 'en');
        newsUrl.searchParams.set('sortBy', 'publishedAt');
        newsUrl.searchParams.set('from', fromDateString);
        newsUrl.searchParams.set('pageSize', '15');
        newsUrl.searchParams.set('apiKey', NEWS_API_KEY);

        const newsResponse = await fetch(newsUrl.toString());

        if (!newsResponse.ok) {
          console.error(`❌ News API error for ${domain}:`, newsResponse.status, newsResponse.statusText);
          results.failed++;
          continue;
        }

        const newsData = await newsResponse.json();
        
        if (newsData.status === 'error') {
          console.error(`❌ News API returned error for ${domain}:`, newsData.message);
          results.failed++;
          continue;
        }

        if (!newsData.articles || newsData.articles.length === 0) {
          console.log(`⚠️ No news found for domain: ${domain}`);
          results.failed++;
          continue;
        }

        // Filter and format news articles
        const formattedNews = newsData.articles
          .filter(article => {
            // Filter out bad articles
            return article.title && 
                   article.url && 
                   article.description &&
                   article.title !== '[Removed]' &&
                   !article.title.toLowerCase().includes('subscription required') &&
                   !article.title.toLowerCase().includes('access denied') &&
                   article.description !== '[Removed]' &&
                   article.url.startsWith('http');
          })
          .slice(0, 8) // Take top 8 articles
          .map(article => ({
            title: article.title.trim(),
            description: article.description ? article.description.trim().slice(0, 200) : '',
            url: article.url,
            imageUrl: article.urlToImage || null,
            publishedAt: article.publishedAt,
            source: article.source.name,
            domain: domain,
            created_at: new Date().toISOString()
          }));

        if (formattedNews.length === 0) {
          console.log(`⚠️ No valid news articles for domain: ${domain}`);
          results.failed++;
          continue;
        }

        // Find existing resource for this domain
        const existingResource = existingResources.find(r => r.domain === domain);
        
        // Only update if resource exists, don't create new ones
        if (!existingResource) {
          console.log(`⚠️ No existing resource found for domain: ${domain}, skipping...`);
          results.failed++;
          results.domains.push({
            domain,
            error: 'No existing resource found',
            updated: false
          });
          continue;
        }

        // Prepare resource data for update
        const resourceData = {
          domain: domain,
          materials: existingResource.materials || [],
          news: formattedNews,
          updated_at: new Date().toISOString()
        };

        // Update existing resource with new news
        const { error: updateError } = await supabase
          .from('resources')
          .update(resourceData)
          .eq('id', existingResource.id);

        if (updateError) {
          console.error(`❌ Error updating news for ${domain}:`, updateError);
          results.failed++;
          continue;
        }

        results.success++;
        results.domains.push({
          domain,
          newsCount: formattedNews.length,
          updated: true
        });

        console.log(`✅ Updated ${formattedNews.length} news articles for ${domain}`);

        // Rate limiting delay (NewsAPI allows 1000 requests per day)
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error processing domain ${domain}:`, error.message);
        results.failed++;
        results.domains.push({
          domain,
          error: error.message,
          updated: false
        });
      }
    }

    const totalProcessed = results.success + results.failed;
    console.log(`🎯 News fetch completed! Success: ${results.success}/${totalProcessed}`);

    return Response.json({
      success: true,
      message: `Successfully updated news for ${results.success} out of ${totalProcessed} domains`,
      results: {
        totalDomains: totalProcessed,
        successfulUpdates: results.success,
        failedUpdates: results.failed,
        domains: results.domains
      }
    });

  } catch (error) {
    console.error('💥 Critical error in automated news fetch:', error);
    return Response.json({
      success: false,
      error: 'Failed to fetch news',
      details: error.message
    }, { status: 500 });
  }
}

// Allow POST for manual triggering
export async function POST(request) {
  return GET(request);
}

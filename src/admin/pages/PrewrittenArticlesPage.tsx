import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Article {
  id: string
  title: string
  excerpt: string
  body: string
  category: 'content' | 'product' | 'origin'
  status: 'draft' | 'scheduled' | 'published'
  featured_image_url?: string
  featured_image_alt?: string
  scheduled_date?: string
  created_at: string
}

function PrewrittenArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'published'>('draft')
  const [publishing, setPublishing] = useState<string | null>(null)

  useEffect(() => {
    loadArticles()
  }, [filter])

  const loadArticles = async () => {
    setLoading(true)
    let query = supabase
      .from('prewritten_articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query
    if (error) console.error('Error loading articles:', error)
    else setArticles(data || [])
    setLoading(false)
  }

  const publishArticle = async (article: Article) => {
    setPublishing(article.id)
    try {
      // Generate slug
      const slug = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') +
        '-' + Date.now().toString(36).slice(-6)

      // Insert to blog_posts
      const { data: _newPost, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title: article.title,
          excerpt: article.excerpt,
          body: article.body,
          slug: slug,
          featured_image_url: article.featured_image_url,
          featured_image_alt: article.featured_image_alt,
          published: true
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Update status to published
      await supabase
        .from('prewritten_articles')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .eq('id', article.id)

      // Reload
      loadArticles()
    } catch (error) {
      console.error('Error publishing:', error)
      alert('Failed to publish article')
    } finally {
      setPublishing(null)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">📝 Prewritten Articles Manager</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {(['all', 'draft', 'scheduled', 'published'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 capitalize ${
              filter === status
                ? 'border-b-2 border-green-600 text-green-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No articles in this status</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <div key={article.id} className="border rounded-lg p-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded capitalize">
                  {article.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  article.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {article.status}
                </span>
              </div>

              <h3 className="font-semibold mb-2 text-sm line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 text-xs line-clamp-2 mb-3">{article.excerpt}</p>

              {article.featured_image_url && (
                <img
                  src={article.featured_image_url}
                  alt={article.featured_image_alt || article.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}

              <div className="text-xs text-gray-400 mb-3">
                {new Date(article.created_at).toLocaleDateString('vi-VN')}
              </div>

              {article.status === 'draft' && (
                <button
                  onClick={() => publishArticle(article)}
                  disabled={publishing === article.id}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded text-sm font-semibold transition"
                >
                  {publishing === article.id ? 'Publishing...' : '✓ Publish Today'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p><strong>ℹ️ Usage:</strong></p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Draft: Click "Publish Today" to post immediately to the website</li>
          <li>Scheduled: Will auto-publish on scheduled date at 8h</li>
          <li>Published: Already on the website, cannot modify</li>
        </ul>
      </div>
    </div>
  )
}

export default function PrewrittenArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <PrewrittenArticles />
      </div>
    </div>
  )
}

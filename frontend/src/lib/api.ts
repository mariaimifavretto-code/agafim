// API helper for Payload CMS integration
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001';

export interface Noticia {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: any; // Rich text content
  author?: {
    id: string;
    email: string;
  };
  _status: string;
  createdAt: Date | string;
  publishedAt: Date | string;
  updatedAt: Date | string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: any; // Rich text content
  category?: 'jurídico' | 'parlamentar';
  author?: {
    id: string;
    email: string;
  };
  _status: string;
  createdAt: Date | string;
  publishedAt: Date | string;
  updatedAt: Date | string;
}

export interface DenunciaData {
  type: 'denuncia' | 'sugestao' | 'outro';
  description: string;
  email?: string;
}

export interface Denuncia {
  id: string;
  type: 'denuncia' | 'sugestao' | 'outro';
  description: string;
  email?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export async function fetchNoticias(): Promise<Noticia[]> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/noticias?where[_status][equals]=published&sort=-createdAt&depth=2`);
    if (!response.ok) {
      throw new Error('Failed to fetch noticias');
    }
    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return [];
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts?where[_status][equals]=published&sort=-createdAt&depth=2`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function fetchNoticiaBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/noticia?where[slug][equals]=${slug}&where[_status][equals]=published&depth=2`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts?where[slug][equals]=${slug}&where[_status][equals]=published&depth=2`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function submitDenuncia(denunciaData: DenunciaData): Promise<boolean> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/denuncias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: denunciaData }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error submitting denuncia:', error);
    return false;
  }
}

export async function fetchDenuncias(): Promise<Denuncia[]> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/denuncias?sort=-createdAt`);
    if (!response.ok) {
      throw new Error('Failed to fetch denuncias');
    }
    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error('Error fetching denuncias:', error);
    return [];
  }
}

// Auth helpers (for future implementation)
export interface LoginData {
  identifier: string;
  password: string;
}

export async function login(loginData: LoginData): Promise<{ jwt?: string; user?: any; error?: string }> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error?.message || 'Login failed' };
    }

    return { jwt: data.token, user: data.user };
  } catch (error) {
    console.error('Error logging in:', error);
    return { error: 'Network error' };
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt');
  }
  return null;
}

export function setStoredToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', token);
  }
}

export function clearStoredToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
  }
}

// Admin functions
export async function fetchMe(): Promise<{ user: { roles: string[] } } | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/users/me`, {
      headers: { Authorization: `JWT ${token}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export interface CreatePostData {
  title: string;
  summary: string;
  content: string;
  category: 'jurídico' | 'parlamentar';
}

export async function createPost(data: CreatePostData): Promise<Post | null> {
  const token = getStoredToken();
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ ...data, status: 'draft' }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function updatePost(id: string, data: Partial<CreatePostData>): Promise<Post | null> {
  const token = getStoredToken();
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  const token = getStoredToken();
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `JWT ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function toggleStatus(id: string, status: 'draft' | 'published' | 'archived'): Promise<Post | null> {
  const token = getStoredToken();
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchPostsAdmin(params: { limit?: number; page?: number; category?: string; status?: string } = {}): Promise<{ docs: Post[]; totalDocs: number; page: number }> {
  const token = getStoredToken();
  const q = new URLSearchParams({
    limit: (params.limit || 10).toString(),
    page: (params.page || 1).toString(),
    depth: '2',
    ...(params.category && { 'where[category][equals]': params.category }),
    ...(params.status && { 'where[_status][equals]': params.status }),
  }).toString();
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts?${q}`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return await response.json();
  } catch {
    return { docs: [], totalDocs: 0, page: 1 };
  }
}

export async function fetchPostsByCategory(category: 'jurídico' | 'parlamentar'): Promise<Post[]> {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/posts?where[_status][equals]=published&where[category][equals]=${category}&sort=-createdAt&limit=20&depth=2`);
    const data = await response.json();
    return data.docs || [];
  } catch {
    return [];
  }
}

// Similar for News if needed later
export async function fetchNewsAdmin(params: { limit?: number; page?: number } = {}): Promise<{ docs: Noticia[]; totalDocs: number }> {
  // Implement as needed
  return { docs: [], totalDocs: 0 };
}

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
    const response = await fetch(`${PAYLOAD_URL}/api/auth/local`, {
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

    return { jwt: data.jwt, user: data.user };
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
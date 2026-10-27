import { isContentPath, isUploadPath, type Upload } from './content'
const repository = 'UDMSL/UDMSL.github.io'
const root = `https://api.github.com/repos/${repository}`
interface Ref { object: { sha: string } }
interface Commit { tree: { sha: string } }
interface TreeEntry { path: string; type: string; sha: string }
const decode = (value: string) => new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g,'')), c => c.charCodeAt(0)))
export class GitHubContent {
  private token: string
  constructor(token: string) { this.token = token }
  private async request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
    const response = await fetch(`${root}${path}`, { method, cache: 'no-store', headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000) }).catch(() => { throw new Error('GitHub와 통신하지 못했습니다. 인터넷 연결을 확인해 주세요. 게시 중이었다면 GitHub 저장 내역도 확인한 뒤 다시 시도해 주세요.') })
    if (!response.ok) {
      if (response.status === 401) throw new Error('GitHub 연결 키가 만료되었거나 올바르지 않습니다.')
      if (response.status === 403 || response.status === 404) throw new Error('저장소 접근 권한을 확인해 주세요. UDMSL.github.io 저장소의 Contents 읽기·쓰기 권한이 필요합니다. 요청 한도 초과일 수도 있습니다.')
      if (response.status === 409 || response.status === 422) throw new Error('다른 수정이 먼저 반영되었거나 GitHub가 변경을 거절했습니다. 초안을 내보낸 뒤 최신 내용을 다시 불러와 주세요.')
      throw new Error(`GitHub 요청에 실패했습니다 (${response.status}). 잠시 후 다시 시도해 주세요.`)
    }
    return response.json() as Promise<T>
  }
  async load() {
    const ref = await this.request<Ref>('/git/ref/heads/main')
    const commit = await this.request<Commit>(`/git/commits/${ref.object.sha}`)
    const tree = await this.request<{ tree: TreeEntry[]; truncated: boolean }>(`/git/trees/${commit.tree.sha}?recursive=1`)
    if (tree.truncated) throw new Error('저장소 파일 목록을 모두 불러오지 못했습니다.')
    const entries = tree.tree.filter(e => e.type === 'blob' && isContentPath(e.path))
    const files: Record<string,string> = {}
    // Limit concurrency to avoid triggering GitHub secondary rate limits.
    for (let i=0; i<entries.length; i+=5) {
      await Promise.all(entries.slice(i,i+5).map(async e => {
        const blob = await this.request<{ content: string; encoding: string }>(`/git/blobs/${e.sha}`)
        if (blob.encoding !== 'base64') throw new Error('콘텐츠 인코딩을 읽을 수 없습니다.')
        files[e.path] = decode(blob.content)
      }))
    }
    return { files, head: ref.object.sha }
  }
  async publish(head: string, files: Record<string,string | null>, uploads: Upload[], message: string) {
    const current = await this.request<Ref>('/git/ref/heads/main')
    if (current.object.sha !== head) throw new Error('편집 중 GitHub에 다른 수정이 반영되었습니다. 초안을 내보낸 뒤 최신 내용을 다시 불러와 주세요. 기존 내용은 덮어쓰지 않았습니다.')
    const commit = await this.request<Commit>(`/git/commits/${head}`)
    const tree: { path: string; mode: string; type: string; sha?: string | null; content?: string }[] = []
    for (const [path, content] of Object.entries(files)) {
      if (!isContentPath(path)) throw new Error('허용되지 않은 저장 경로입니다.')
      tree.push({ path, mode: '100644', type: 'blob', ...(content === null ? { sha: null } : { content }) })
    }
    for (const upload of uploads) {
      if (!isUploadPath(upload.path)) throw new Error('허용되지 않은 사진 경로입니다.')
      const blob = await this.request<{ sha: string }>('/git/blobs', 'POST', { content: upload.base64, encoding: 'base64' })
      tree.push({ path: upload.path, mode: '100644', type: 'blob', sha: blob.sha })
    }
    const nextTree = await this.request<{ sha: string }>('/git/trees', 'POST', { base_tree: commit.tree.sha, tree })
    const nextCommit = await this.request<{ sha: string; html_url: string }>('/git/commits', 'POST', { message, tree: nextTree.sha, parents: [head] })
    await this.request('/git/refs/heads/main', 'PATCH', { sha: nextCommit.sha, force: false })
    return nextCommit.sha
  }
}

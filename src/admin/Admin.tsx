import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Trash2, Upload, Download, ArrowUpRight, Check, LockKeyhole, ImagePlus, Undo2 } from 'lucide-react'
import { buildFiles, changedPaths, createEntry, labels, parseBackup, readEntries, validateEntries, type Draft, type Entry, type Kind } from './content'
import { GitHubContent } from './github'
import { splitCitation } from '../utils/citation'
import { pendingWriteCheck, startWriteCheck, restoreWriteCheck } from './writeCheck'
import ContentPreview from './ContentPreview'
import './admin.css'

const storageKey = 'udms-content-draft-v1'
const bundled = import.meta.glob('../content/{members/current,members/alumni,publications,gallery,news}/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string,string>
const initialFiles = Object.fromEntries(Object.entries(bundled).map(([path, raw]) => [path.replace('../','src/'), raw]))
function initialDraft(): Draft {
  try { const saved = localStorage.getItem(storageKey); if (saved) return parseBackup(saved) } catch { /* An unreadable backup must not prevent opening the editor. */ }
  return { version: 1, base: initialFiles, entries: readEntries(initialFiles), uploads: [], head: '' }
}
const displayName = (entry: Entry) => entry.fields.name || entry.fields.title || splitCitation(entry.fields.text || '').title || '새 항목'
const imageKey = (entry: Entry) => entry.kind === 'news' ? 'image' : 'img'
const download = (draft: Draft) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(draft,null,2)], { type: 'application/json' }))
  const link = document.createElement('a'); link.href = url; link.download = `UDMS-초안-${new Date().toISOString().slice(0,10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000)
}
export default function Admin() {
  const [draft,setDraft] = useState<Draft>(initialDraft)
  const [kind,setKind] = useState<Kind>('members')
  const [selected,setSelected] = useState('')
  const [query,setQuery] = useState('')
  const [token,setToken] = useState('')
  const [connected,setConnected] = useState(false)
  const [busy,setBusy] = useState('')
  const [notice,setNotice] = useState('')
  const [error,setError] = useState('')
  const [storageError,setStorageError] = useState(false)
  const [review,setReview] = useState(false)
  const [deleteId,setDeleteId] = useState('')
  const [deleted,setDeleted] = useState<Entry | null>(null)
  const [commit,setCommit] = useState('')
  const client = useRef<GitHubContent | null>(null)
  const importInput = useRef<HTMLInputElement>(null)
  const tokenInput = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const deleteDialog = useRef<HTMLDialogElement>(null)
  const visible = draft.entries.filter(e=>e.kind===kind && displayName(e).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>kind==='members' ? (a.path.includes('/alumni/')?1:0)-(b.path.includes('/alumni/')?1:0) || Number(a.fields.order)-Number(b.fields.order) : (b.fields.year || b.fields.date || '').localeCompare(a.fields.year || a.fields.date || ''))
  const entry = draft.entries.find(e=>e.id===selected && e.kind===kind) || visible[0]
  const next = useMemo(()=> { try { return buildFiles(draft.entries,draft.base) } catch { return null } },[draft.entries,draft.base])
  const paths = next ? changedPaths(draft.base,next) : []
  const activeUploads = draft.uploads.filter(u=>draft.entries.some(e=>Object.values(e.fields).includes(u.path.replace(/^public/,''))))
  const dirty = paths.length > 0 || !next || activeUploads.length > 0
  useEffect(()=> {
    try { localStorage.setItem(storageKey,JSON.stringify(draft)); setStorageError(false) } catch { setStorageError(true) }
  },[draft])
  useEffect(()=> {
    if (!dirty) return
    const handler = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload',handler)
    return ()=>window.removeEventListener('beforeunload',handler)
  },[dirty])
  useEffect(()=> { if (review) dialog.current?.showModal(); else dialog.current?.close() },[review])
  useEffect(()=> { if (deleteId) deleteDialog.current?.showModal(); else deleteDialog.current?.close() },[deleteId])
  const update = (patch: Partial<Entry>) => {
    if (!entry) return
    setDraft(d=>({...d,entries:d.entries.map(e=>e.id===entry.id?{...e,...patch}:e)})); setNotice(''); setCommit('')
  }
  const field = (key: string,value: string) => update({fields:{...entry.fields,[key]:value}})
  const connect = async () => {
    if (!token.trim()) { setError('GitHub 연결 키를 입력해 주세요.'); tokenInput.current?.focus(); return }
    setBusy('GitHub 최신 내용 불러오는 중'); setError('')
    const service = new GitHubContent(token.trim())
    try {
      const {files,head} = await service.load()
      const sameBase = Object.keys({...draft.base,...files}).every(path=>draft.base[path]===files[path])
      if(dirty && !sameBase && !window.confirm('GitHub 내용이 현재 초안의 원본과 다릅니다. 최신 내용으로 교체할까요? 취소하면 초안이 유지됩니다. 교체 전 초안을 내보내 보관해 주세요.')) return
      setDraft(dirty && sameBase ? {...draft,head} : {version:1,base:files,entries:readEntries(files),uploads:[],head})
      client.current=service; setConnected(true); setSelected(''); setToken(''); setCommit(''); setDeleted(null)
      setNotice(dirty && sameBase ? 'GitHub에 연결했습니다. 편집 중인 초안을 그대로 유지했습니다.' : 'GitHub 최신 내용을 불러왔습니다. 편집 후 변경 내용을 검토해 주세요.')
    } catch(e) { setError(e instanceof Error?e.message:'연결하지 못했습니다.') } finally { setBusy('') }
  }
  const upload = async (file?: File) => {
    if (!file || !entry) return
    setError('')
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>5*1024*1024) { setError('5MB 이하의 JPG, PNG, WebP 사진을 선택해 주세요.'); return }
    const id=entry.id
    const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp'
    const path=`public/img/uploads/${crypto.randomUUID()}.${ext}`
    try {
      const data = await new Promise<string>((resolve,reject)=> {const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('사진을 읽지 못했습니다.'));reader.readAsDataURL(file)})
      setDraft(d=>({...d,uploads:[...d.uploads,{path,base64:data,mime:file.type}],entries:d.entries.map(e=>e.id===id?{...e,fields:{...e.fields,[imageKey(e)]:path.replace(/^public/,'')}}:e)}))
      setNotice('사진이 초안에 추가되었습니다. 게시할 때 함께 업로드됩니다.')
    } catch { setError('사진을 읽지 못했습니다. 다시 선택해 주세요.') }
  }
  const importDraft = async (file?: File) => {
    if(!file)return
    if(file.size>25*1024*1024){setError('25MB 이하의 초안 파일만 불러올 수 있습니다.');return}
    if(dirty&&!window.confirm('현재 초안을 가져온 파일로 교체할까요?'))return
    try { const loaded=parseBackup(await file.text());setDraft(loaded);client.current=null;setConnected(false);setToken('');setSelected('');setError('');setNotice('초안을 불러왔습니다. 게시 전 GitHub 연결과 변경 내용을 확인해 주세요.');setDeleted(null);setCommit('') }
    catch(e){setError(e instanceof Error?e.message:'초안 파일을 확인해 주세요.')}
  }
  const publish = async () => {
    if(!client.current||!draft.head||!next||validateEntries(draft.entries).length)return
    setReview(false);setBusy('GitHub에 게시하는 중');setError('')
    try {
      const files=Object.fromEntries(paths.map(path=>[path,next[path]??null]))
      const sha=await client.current.publish(draft.head,files,activeUploads,`Update lab content through web editor (${paths.length} files)`)
      setDraft({...draft,base:next,entries:readEntries(next),uploads:[],head:sha});setSelected('');setDeleted(null);setCommit(sha)
      setNotice('GitHub에 저장했습니다. 자동 배포가 시작되며, 완료되면 공개 홈페이지에 반영됩니다.')
    } catch(e){setError(e instanceof Error?e.message:'게시하지 못했습니다. 초안은 유지됩니다.')}finally{setBusy('')}
  }
  const reviewChanges = () => {
    const errors=validateEntries(draft.entries)
    if(errors.length){setError(errors.slice(0,6).join('\n'));return}
    if(!connected||!draft.head){setError('게시하려면 먼저 GitHub에 연결하고 최신 내용을 불러와 주세요. 연결 전 초안은 내보내기로 보관할 수 있습니다.');return}
    if(!dirty){setNotice('게시할 변경사항이 없습니다.');return}
    setError('');setReview(true)
  }
  const liveWriteCheck = async (restore: boolean) => {
    if (!client.current) { setError('먼저 GitHub에 연결해 주세요.'); return }
    setBusy(restore ? '점검 전 내용으로 원상복구하는 중' : '네 가지 콘텐츠를 실제로 게시하고 다시 읽어 확인하는 중'); setError('')
    try {
      if(restore){
        const result=await restoreWriteCheck(client.current)
        setDraft(d=>Object.keys({...d.base,...result.before}).every(path=>d.base[path]===result.before[path]) ? {...d,head:result.head} : d)
        setCommit(result.head);setNotice('원상복구 완료. 점검 전 콘텐츠와 일치함을 다시 읽어 확인했습니다. 작성 중인 초안은 그대로 유지했습니다. 자동 배포 완료 후 공개 화면도 복구됩니다.')
      }else{
        const sha=await startWriteCheck(client.current)
        setCommit(sha);setNotice('구성원·논문·갤러리·뉴스 임시 항목 네 개의 실제 저장 및 다시 읽기 검증에 성공했습니다. 공개 배포 확인 후 반드시 점검 원상복구를 실행하세요. 작성 중인 초안은 변경하지 않았습니다.')
      }
    }catch(e){setError(e instanceof Error?e.message:'쓰기 점검에 실패했습니다. 복구 정보를 확인해 주세요.')}
    finally{setBusy('')}
  }
  const previewImage = entry && entry.fields[imageKey(entry)]
  const uploaded = activeUploads.find(u=>u.path.replace(/^public/,'')===previewImage)
  const safeImage = previewImage && (/^https?:\/\//i.test(previewImage)||/^\/img\//.test(previewImage)) ? uploaded?`data:${uploaded.mime};base64,${uploaded.base64}`:previewImage.startsWith('/img/')&&connected?`https://udmsl.github.io${previewImage}`:previewImage : ''
  const citation = entry?.kind==='publications' ? splitCitation(entry.fields.text || '') : null
  return <div className="admin-page site-container">
    <header className="admin-heading"><div><p className="eyebrow">UDMS CONTENT STUDIO</p><h1>홈페이지 콘텐츠 관리</h1><p>항목을 선택해 수정하고, 미리보기로 확인한 뒤 게시하세요.</p></div><Link className="text-link" to="/">홈페이지 보기 <ArrowUpRight size={16}/></Link></header>
    <details className="admin-connect" open={!connected}><summary><LockKeyhole size={17}/>{connected?'GitHub 연결됨 · UDMSL/UDMSL.github.io':'1. GitHub 연결 · 게시 권한이 있는 담당자만 사용'}</summary><div><p>GitHub의 Fine-grained personal access token을 사용합니다. 저장소는 <strong>UDMSL.github.io</strong> (Resource owner: UDMSL), 권한은 <strong>Contents: Read and write</strong>로 선택하세요. 연결 키는 현재 화면의 메모리에만 보관하며 초안·내보내기 파일에 저장하지 않습니다. 새로고침하면 다시 연결해야 합니다.</p><a className="text-link" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">GitHub 연결 키 만들기 <ArrowUpRight size={15}/></a><div className="admin-connect-row"><label>GitHub 연결 키<input ref={tokenInput} type="password" autoComplete="off" spellCheck={false} value={token} onChange={e=>setToken(e.target.value)} placeholder="github_pat_…" disabled={!!busy}/></label><button type="button" className="admin-primary" onClick={connect} disabled={!!busy}>{connected?'다시 연결 / 최신 내용 불러오기':'연결하고 최신 내용 불러오기'}</button>{connected&&<button onClick={()=>{client.current=null;setConnected(false);setToken('');setNotice('연결을 해제했습니다. 초안은 유지됩니다.')}} disabled={!!busy}>연결 해제</button>}</div><p className="admin-hint">기관 계정의 승인이 필요할 수 있습니다. 연결 없이도 현재 콘텐츠로 편집을 시험하고 초안을 내보낼 수 있습니다. <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer">연결 키 안내</a></p></div></details>
    <div className="admin-toolbar"><span className="admin-status"><Check size={15}/>{storageError?'자동 저장 실패 — 초안을 내보내 주세요':dirty?'변경사항을 이 브라우저에 초안으로 저장했습니다':'저장된 내용과 같습니다'}{!connected&&' · 연결 전 편집 모드'}</span><div><button onClick={()=>{if(window.confirm('현재 초안의 변경사항을 모두 취소하고 마지막으로 불러온 내용으로 되돌릴까요?')){setDraft(d=>({...d,entries:readEntries(d.base),uploads:[]}));setSelected('');setDeleted(null);setError('');setNotice('초안 변경사항을 취소했습니다.')}}} disabled={!!busy||!dirty}>초안 변경 취소</button><button onClick={()=>download(draft)} disabled={!!busy}><Download size={16}/>초안 내보내기</button><button onClick={()=>importInput.current?.click()} disabled={!!busy}><Upload size={16}/>초안 가져오기</button><input ref={importInput} type="file" accept="application/json,.json" hidden onChange={e=>{void importDraft(e.target.files?.[0]);e.target.value=''}}/><button className="admin-primary" onClick={reviewChanges} disabled={!!busy||!dirty}>변경 검토 및 게시</button></div></div>
    {(notice||error||busy||storageError)&&<div className={`admin-message ${error||storageError?'is-error':''}`} role={error?'alert':'status'}>{busy||error||notice}{storageError&&<p>브라우저 저장 공간이 부족합니다. 사진이 포함된 초안을 내보내 보관하세요.</p>}{commit&&<p><a href={`https://github.com/UDMSL/UDMSL.github.io/commit/${commit}`} target="_blank" rel="noopener noreferrer">저장 내역</a> · <a href="https://github.com/UDMSL/UDMSL.github.io/actions" target="_blank" rel="noopener noreferrer">배포 상태 확인</a> · <a href="https://udmsl.github.io/" target="_blank" rel="noopener noreferrer">공개 홈페이지</a></p>}</div>}
    <details className="admin-connect"><summary>실제 게시 기능 점검 및 원상복구</summary><div><p>네 종류의 임시 항목을 GitHub에 실제 게시하고, 다시 읽어 저장 여부를 검사합니다. 공개 사이트에도 일시적으로 표시됩니다. 확인 후 원상복구하세요. 작성 중인 초안은 그대로 유지됩니다.</p><div className="admin-connect-row"><button onClick={()=>liveWriteCheck(false)} disabled={!!busy||!connected||!!pendingWriteCheck()}>네 항목 실제 쓰기 점검</button><button onClick={()=>liveWriteCheck(true)} disabled={!!busy||!connected||!pendingWriteCheck()}>점검 원상복구</button></div></div></details>
    <div className="admin-tabs" role="group" aria-label="콘텐츠 종류">{(Object.keys(labels) as Kind[]).map(k=><button key={k} aria-pressed={kind===k} onClick={()=>{setKind(k);setSelected('');setQuery('')}} disabled={!!busy}>{labels[k]} <span>{draft.entries.filter(e=>e.kind===k).length}</span></button>)}</div>
    <div className="admin-workspace" aria-busy={!!busy}>
      <aside className="admin-list"><div className="admin-list-top"><h2>{labels[kind]}</h2><button aria-label={`${labels[kind]} 추가`} onClick={()=>{const added=createEntry(kind);setDraft(d=>({...d,entries:[added,...d.entries]}));setSelected(added.id);setQuery('')}} disabled={!!busy}><Plus size={17}/>추가</button></div><label className="admin-search"><Search size={16}/><input aria-label="항목 검색" placeholder="이름 또는 제목 검색" value={query} onChange={e=>{setQuery(e.target.value);setSelected('')}}/></label><div className="admin-entry-list">{visible.map(item=><button key={item.id} aria-pressed={entry?.id===item.id} onClick={()=>setSelected(item.id)} disabled={!!busy}><strong>{displayName(item)}</strong><span>{item.kind==='members'?(item.path.includes('/alumni/')?'Alumni':'Current Members')+' · '+item.fields.degree:item.fields.year||item.fields.date}</span></button>)}{!visible.length&&<p className="admin-empty">항목이 없습니다. ‘추가’를 눌러 새 항목을 만드세요.</p>}</div>{deleted&&<button className="admin-undo" onClick={()=>{setDraft(d=>({...d,entries:[...d.entries,deleted]}));setSelected(deleted.id);setDeleted(null)}} disabled={!!busy}><Undo2 size={16}/>방금 삭제한 항목 복원</button>}</aside>
      {entry?<div className="admin-editor" key={entry.id}><div className="admin-editor-heading"><div><p className="eyebrow">2. EDIT CONTENT</p><h2>내용 수정</h2></div><button className="admin-delete" onClick={()=>setDeleteId(entry.id)} disabled={!!busy}><Trash2 size={16}/>항목 삭제</button></div>
      <fieldset disabled={!!busy} className="admin-fields">
      {kind==='members'?<><label>이름<input value={entry.fields.name||''} onChange={e=>field('name',e.target.value)} required/></label><div className="admin-two"><label>구분<select value={entry.path.includes('/alumni/')?'alumni':'current'} onChange={e=>update({path:entry.path.replace(/members\/(current|alumni)\//,`members/${e.target.value}/`)})}><option value="current">Current Members · 재학생</option><option value="alumni">Alumni · 졸업생</option></select></label><label>학위 / 직함<input value={entry.fields.degree||entry.fields.role||''} onChange={e=>field('degree',e.target.value)} placeholder="M.S. Student"/></label></div><label>이메일<input type="email" value={entry.fields.email||''} onChange={e=>field('email',e.target.value)}/></label><div className="admin-two"><label>표시 순서<input type="number" value={entry.fields.order||''} onChange={e=>field('order',e.target.value)}/></label><label>현재 소속 (졸업생)<input value={entry.fields.currentPos||''} onChange={e=>field('currentPos',e.target.value)}/></label></div></>:kind==='publications'?<><label>논문 제목<textarea rows={4} value={citation?.title||''} onChange={e=>field('text',`"${e.target.value.replace(/\n/g,' ')}", ${citation?.details||''}`)}/></label><label>학술지 · 권(호) · 페이지 · 연도<textarea rows={3} value={citation?.details||''} onChange={e=>field('text',`"${citation?.title||''}", ${e.target.value.replace(/\n/g,' ')}`)} placeholder="MACROMOLECULES (2026)."/></label><div className="admin-two"><label>출판 연도<input type="number" min="1000" max="9999" value={entry.fields.year||''} onChange={e=>field('year',e.target.value)}/></label><label>DOI (선택)<input value={entry.fields.doi||''} onChange={e=>field('doi',e.target.value.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,''))} placeholder="10.xxxx/xxxxx"/></label></div><p className="admin-hint">DOI 주소를 붙여넣어도 됩니다. DOI가 없으면 홈페이지에서 Scholar 검색으로 연결됩니다.</p></>:<><label>{kind==='gallery'?'사진 제목 / 설명':'뉴스 제목'}<input value={entry.fields.title||''} onChange={e=>field('title',e.target.value)}/></label><label>날짜<input type="date" value={entry.fields.date||''} onChange={e=>field('date',e.target.value)}/></label>{kind==='news'&&<label>뉴스 내용<textarea rows={9} value={entry.body} onChange={e=>update({body:e.target.value})}/></label>}</>}
      {kind!=='publications'&&<div className="admin-image-field"><label>사진 주소 (선택)<input value={entry.fields[imageKey(entry)]||''} onChange={e=>field(imageKey(entry),e.target.value)} placeholder="사진을 업로드하거나 https:// 주소 입력"/></label><label className="admin-upload"><ImagePlus size={18}/>사진 파일 선택<input aria-label="사진 파일 선택" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{void upload(e.target.files?.[0]);e.target.value=''}}/></label><p className="admin-hint">JPG · PNG · WebP, 최대 5MB. 갤러리는 사진이 필요합니다.</p></div>}
      </fieldset></div>:<div className="admin-editor admin-empty">목록에서 항목을 선택하거나 새 항목을 추가하세요.</div>}
      <ContentPreview entry={entry} image={safeImage || ''} />
    </div>
    <dialog ref={dialog} className="admin-dialog" onCancel={()=>setReview(false)} aria-labelledby="review-title"><h2 id="review-title">변경 내용을 게시할까요?</h2><p>아래 {paths.length}개 콘텐츠 파일과 사진 {activeUploads.length}개를 GitHub main에 저장합니다. 자동 배포 완료 후 누구나 볼 수 있는 홈페이지에 반영됩니다.</p><ul>{paths.map(path=><li key={path}><strong>{next?.[path]===undefined?'삭제':draft.base[path]===undefined?'추가':'수정'}</strong> {path.replace('src/content/','')}</li>)}</ul><p className="admin-hint">내용 수정은 GitHub의 변경 기록에 남습니다. 연결 키는 저장하지 않습니다.</p><div><button onClick={()=>setReview(false)}>계속 편집</button><button className="admin-primary" onClick={publish}>GitHub에 저장하고 게시</button></div></dialog>
    <dialog ref={deleteDialog} className="admin-dialog" onCancel={()=>setDeleteId('')} aria-labelledby="delete-title"><h2 id="delete-title">이 항목을 초안에서 삭제할까요?</h2><p>{displayName(draft.entries.find(e=>e.id===deleteId)||{fields:{}} as Entry)}</p><p>게시 전까지 공개 홈페이지에는 영향이 없습니다. 삭제 직후 복원할 수 있습니다.</p><div><button onClick={()=>setDeleteId('')}>취소</button><button className="admin-primary" onClick={()=>{const removed=draft.entries.find(e=>e.id===deleteId);setDeleted(removed||null);setDraft(d=>({...d,entries:d.entries.filter(e=>e.id!==deleteId)}));setSelected('');setDeleteId('')}}>초안에서 삭제</button></div></dialog>
  </div>
}

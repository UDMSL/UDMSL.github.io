import { buildFiles, changedPaths, createEntry, isContentPath, readEntries, validateEntries, type Kind } from './content'
import type { GitHubContent } from './github'
const key = 'udms-live-write-check-v1'
interface CheckBackup { before: Record<string,string>; after: Record<string,string>; paths: string[]; head: string }
export function pendingWriteCheck(): CheckBackup | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const backup = JSON.parse(raw) as CheckBackup
  if (!backup || !Array.isArray(backup.paths) || backup.paths.length !== 4 || !backup.paths.every(isContentPath) || !backup.before || !backup.after || typeof backup.head !== 'string') throw new Error('쓰기 점검 복구 파일의 형식을 확인해 주세요.')
  return backup
}
export async function startWriteCheck(client: GitHubContent) {
  if (pendingWriteCheck()) throw new Error('진행 중인 쓰기 점검을 먼저 원상복구해 주세요.')
  const {files,head} = await client.load()
  const stamp = crypto.randomUUID()
  const date = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
  const additions = (['members','publications','gallery','news'] as Kind[]).map(kind=>{
    const item = createEntry(kind)
    item.path = item.path.replace(/[^/]+\.md$/,`cms-check-${stamp}.md`)
    if(kind==='members') item.fields={name:'[게시 점검] 임시 구성원',degree:'쓰기 기능 테스트 · 확인 후 삭제',email:'',currentPos:'',order:'9999',img:''}
    if(kind==='publications') item.fields={year:date.slice(0,4),text:'"[게시 점검] 임시 논문 — 실제 연구 성과가 아닙니다", UDMS 콘텐츠 쓰기 기능 테스트. 확인 후 삭제됩니다.',doi:''}
    if(kind==='gallery') item.fields={title:'[게시 점검] 임시 갤러리 — 확인 후 삭제',date,img:'/img/redesign/laser-hero-selected.png'}
    if(kind==='news'){item.fields={title:'[게시 점검] 임시 뉴스 — 확인 후 삭제',date,image:''};item.body='관리 화면의 실제 게시 기능을 확인하기 위한 임시 항목입니다. 점검 완료 후 원상복구합니다.'}
    return item
  })
  const entries=[...additions,...readEntries(files)]
  const errors=validateEntries(entries)
  if(errors.length)throw new Error(errors.join('\n'))
  const after=buildFiles(entries,files)
  const paths=changedPaths(files,after)
  if(paths.length!==4)throw new Error('예상과 다른 변경 파일이 있어 점검을 중단했습니다.')
  const backup: CheckBackup={before:files,after,paths,head:''}
  // Durable recovery information must be saved before making any remote write.
  localStorage.setItem(key,JSON.stringify(backup))
  const sha=await client.publish(head,Object.fromEntries(paths.map(path=>[path,after[path]])),[],'Test web editor: temporary member, publication, gallery and news')
  backup.head=sha
  localStorage.setItem(key,JSON.stringify(backup))
  const verified=await client.load()
  if(!paths.every(path=>verified.files[path]===after[path]))throw new Error('쓰기 후 다시 읽은 내용이 일치하지 않습니다. 원상복구를 실행해 주세요.')
  return sha
}
export async function restoreWriteCheck(client: GitHubContent) {
  const backup=pendingWriteCheck()
  if(!backup)throw new Error('복구할 쓰기 점검이 없습니다.')
  const current=await client.load()
  const alreadyRestored=backup.paths.every(path=>current.files[path]===backup.before[path])
  if(alreadyRestored){localStorage.removeItem(key);return {head:current.head,before:backup.before,files:current.files}}
  if(!backup.paths.every(path=>current.files[path]===backup.after[path]))throw new Error('점검 중 같은 항목에 다른 수정이 감지되었습니다. 자동으로 덮어쓰지 않았습니다. 복구 정보를 유지합니다.')
  const changes=Object.fromEntries(backup.paths.map(path=>[path,backup.before[path]??null]))
  const sha=await client.publish(current.head,changes,[],'Restore original content after successful web editor write test')
  const restored=await client.load()
  const expected={...current.files}
  for(const [path,content] of Object.entries(changes)){if(content===null)delete expected[path];else expected[path]=content}
  if(changedPaths(expected,restored.files).length)throw new Error('복구 후 내용이 일치하지 않습니다. 복구 정보를 유지합니다.')
  localStorage.removeItem(key)
  return {head:sha,before:backup.before,files:restored.files}
}

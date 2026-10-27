import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'
const moduleURL = async (path, imports={}) => {
 let source=await readFile(new URL(path,import.meta.url),'utf8')
 for(const [name,url] of Object.entries(imports))source=source.replaceAll(`'${name}'`,JSON.stringify(url))
 const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ESNext}})
 return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
}
const markdownURL=await moduleURL('../src/utils/markdown.ts')
const parserURL=await moduleURL('../src/utils/publicationParser.ts')
const contentURL=await moduleURL('../src/admin/content.ts',{'../utils/markdown':markdownURL,'../utils/publicationParser':parserURL})
const {readEntries,buildFiles,changedPaths,validateEntries,parseBackup}=await import(contentURL)
const {GitHubContent}=await import(await moduleURL('../src/admin/github.ts',{'./content':contentURL}))
const base={}
for(const folder of ['members/current','members/alumni','publications','gallery','news']) {
 for(const name of await readdir(new URL(`../src/content/${folder}/`,import.meta.url))) {
  if(name.endsWith('.md'))base[`src/content/${folder}/${name}`]=await readFile(new URL(`../src/content/${folder}/${name}`,import.meta.url),'utf8')
 }
}
const entries=readEntries(base)
test('editor round-trips all existing content without rewriting untouched files',()=>{
 assert.ok(entries.length>40)
 assert.deepEqual(buildFiles(entries,base),base)
 assert.deepEqual(validateEntries(entries),[])
})
test('moving a member to alumni removes only the old path and preserves all fields',()=>{
 const next=structuredClone(entries)
 const member=next.find(e=>e.path.includes('/members/current/'))
 const old=member.path
 member.path=old.replace('/current/','/alumni/')
 const files=buildFiles(next,base)
 assert.equal(files[old],undefined)
 assert.deepEqual(changedPaths(base,files).sort(),[old,member.path].sort())
 assert.deepEqual(readEntries(files).find(e=>e.path===member.path).fields,member.fields)
})
test('editing and moving a paper preserves quotes, Korean, DOI and other years',()=>{
 const next=structuredClone(entries)
 const paper=next.find(e=>e.kind==='publications'&&e.fields.year==='2026')
 paper.fields.text='"한글: \\"quoted\\" title", Journal (2027).'
 paper.fields.doi='10.1234/hello'
 paper.fields.year='2027'
 const files=buildFiles(next,base)
 const result=readEntries(files).find(e=>e.fields.doi==='10.1234/hello')
 assert.equal(result.fields.text,paper.fields.text)
 assert.equal(result.fields.year,'2027')
 assert.equal(files['src/content/publications/2025.md'],base['src/content/publications/2025.md'])
})
test('deletion is represented explicitly and unsafe input is rejected',()=>{
 const gallery=entries.find(e=>e.kind==='gallery')
 assert.equal(buildFiles(entries.filter(e=>e.id!==gallery.id),base)[gallery.path],undefined)
 const invalid=structuredClone(gallery)
 invalid.fields.img='javascript:alert(1)'
 invalid.fields.date='2026-02-30'
 assert.equal(validateEntries([invalid]).length,2)
 const draft={version:1,base,entries,uploads:[],head:''}
 assert.deepEqual(parseBackup(JSON.stringify(draft)),draft)
 draft.uploads=[{path:'public/../../malicious.js',base64:'AA==',mime:'image/png'}]
 assert.throws(()=>parseBackup(JSON.stringify(draft)))
})
test('publishing refuses stale base before any write',async()=>{
 const original=globalThis.fetch
 const calls=[]
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return Response.json({object:{sha:'newer'}})}
 try{
  await assert.rejects(new GitHubContent('test-key').publish('older',{},[],'test'),/다른 수정/)
  assert.equal(calls.length,1)
  assert.equal(calls[0].options.method,'GET')
 }finally{globalThis.fetch=original}
})
test('publishing creates one atomic content+image commit and never force-updates main',async()=>{
 const original=globalThis.fetch
 const calls=[]
 globalThis.fetch=async(url,options)=>{
  const body=options.body?JSON.parse(options.body):null
  calls.push({url,options,body})
  if(url.endsWith('/git/ref/heads/main'))return Response.json({object:{sha:'base'}})
  if(url.endsWith('/git/commits/base'))return Response.json({tree:{sha:'tree-base'}})
  if(url.endsWith('/git/blobs'))return Response.json({sha:'photo'})
  if(url.endsWith('/git/trees'))return Response.json({sha:'tree-new'})
  if(url.endsWith('/git/commits'))return Response.json({sha:'commit-new'})
  return Response.json({object:{sha:'commit-new'}})
 }
 try{
  const path='src/content/news/test.md'
  const deleted='src/content/gallery/old.md'
  const head=await new GitHubContent('test-key').publish('base',{[path]:'---\ntitle: hello\n---\n',[deleted]:null},[{path:'public/img/uploads/test.png',base64:'AA==',mime:'image/png'}],'Update')
  assert.equal(head,'commit-new')
  const tree=calls.find(c=>c.url.endsWith('/git/trees')).body
  assert.equal(tree.base_tree,'tree-base')
  assert.equal(tree.tree.find(e=>e.path===deleted).sha,null)
  assert.equal(tree.tree.find(e=>e.path.endsWith('test.png')).sha,'photo')
  assert.deepEqual(calls.at(-1).body,{sha:'commit-new',force:false})
  assert.ok(calls.every(c=>c.url.startsWith('https://api.github.com/repos/UDMSL/UDMSL.github.io/')))
 }finally{globalThis.fetch=original}
})

const {startWriteCheck,restoreWriteCheck}=await import(await moduleURL('../src/admin/writeCheck.ts',{'./content':contentURL}))
test('live write check adds exactly four entries and restores exact original content',async()=>{
 const oldStorage=globalThis.localStorage
 const storage=new Map()
 globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}
 let files=structuredClone(base)
 let head='original'
 const calls=[]
 const client={load:async()=>({files:structuredClone(files),head}),publish:async(expected,changes,uploads)=>{
  assert.equal(expected,head);assert.deepEqual(uploads,[]);calls.push(changes)
  for(const [path,content]of Object.entries(changes)){if(content===null)delete files[path];else files[path]=content}
  head=`head-${calls.length}`;return head
 }}
 try{
  await startWriteCheck(client)
  assert.equal(Object.keys(calls[0]).length,4)
  assert.equal(readEntries(files).length,entries.length+4)
  const restored=await restoreWriteCheck(client)
  assert.deepEqual(restored.files,base)
  assert.deepEqual(files,base)
  assert.equal(storage.size,0)
 }finally{globalThis.localStorage=oldStorage}
})

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Members from '../components/Members'
import Publications from '../components/Publications'
import Gallery from '../components/Gallery'
import News from '../components/News'
import type { Entry } from './content'

function PreviewFrame({ mode, children }: { mode: 'light' | 'dark'; children: ReactNode }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [target,setTarget] = useState<HTMLElement | null>(null)
  useEffect(()=> {
    const doc=target?.ownerDocument
    if(!doc || !target)return
    const copyStyles = () => {
      doc.head.querySelectorAll('[data-preview-style]').forEach(node=>node.remove())
      document.head.querySelectorAll('style,link[rel="stylesheet"]').forEach(node=>{
        const copy=node.cloneNode(true) as HTMLElement
        copy.setAttribute('data-preview-style','true');doc.head.appendChild(copy)
      })
    }
    copyStyles()
    // Separate documents give each preview its real responsive layout and theme.
    const styles=new MutationObserver(copyStyles)
    styles.observe(document.head,{childList:true,subtree:true,characterData:true})
    const resize=new ResizeObserver(()=>{
      if(frame.current)frame.current.style.height=`${Math.max(380,Math.ceil(target.getBoundingClientRect().height))}px`
    })
    resize.observe(target)
    return ()=>{styles.disconnect();resize.disconnect()}
  },[target])
  return <section className="admin-preview-variant"><h3>{mode==='light'?'라이트 모드':'다크 모드'}</h3><iframe ref={frame} title={`실제 페이지 미리보기 · ${mode==='light'?'라이트':'다크'}`} sandbox="allow-same-origin" srcDoc={'<!doctype html><html lang="ko"><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;height:auto}#preview-root{min-height:380px}</style></head><body><div id="preview-root"></div></body></html>'} onLoad={()=>setTarget(frame.current?.contentDocument?.getElementById('preview-root')||null)}/>{target&&createPortal(<div className="site-shell" data-palette="cobalt" data-mode={mode}>{children}</div>,target)}</section>
}
function PageContent({ entry, image }: { entry: Entry; image: string }) {
  const fields=entry.fields
  if(entry.kind==='members'){
    const member={name:fields.name||'이름을 입력하세요',degree:fields.degree||fields.role||'',email:fields.email||'',currentPos:fields.currentPos||'',order:Number(fields.order)||1,img:image}
    const alumni=entry.path.includes('/alumni/')
    return <Members data={{current:alumni?[]:[member],alumni:alumni?[member]:[]}}/>
  }
  if(entry.kind==='publications')return <Publications items={[{year:Number(fields.year)||new Date().getFullYear(),text:fields.text||'논문 제목을 입력하세요',doi:fields.doi||'',slug:entry.id}]}/>
  if(entry.kind==='gallery')return <Gallery items={[{title:fields.title||'사진 제목을 입력하세요',date:fields.date||'',img:image,slug:entry.id}]}/>
  return <News items={[{title:fields.title||'뉴스 제목을 입력하세요',date:fields.date||'',content:entry.body,image,slug:entry.id}]}/>
}
export default function ContentPreview({ entry, image }: { entry?: Entry; image: string }) {
  return <aside className="admin-preview"><p className="eyebrow">3. LIVE PREVIEW</p><h2>실제 페이지 미리보기</h2><p className="admin-hint">선택한 항목을 공개 페이지와 같은 화면으로 보여줍니다. 각 미리보기 폭에 맞춰 자동으로 배치됩니다.</p>{entry?<div className="admin-preview-pair">{(['light','dark'] as const).map(mode=><PreviewFrame key={`${mode}-${entry.kind}`} mode={mode}><PageContent key={entry.id} entry={entry} image={image}/></PreviewFrame>)}</div>:<p className="admin-empty">미리볼 항목을 선택하세요.</p>}</aside>
}

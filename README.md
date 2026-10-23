# Homepage of Ultrafast Dynamics & Materials Spectroscopy Laboratory

made by Wonwoo Shin by React & Vite

## 개발 및 검증

Node.js 24와 npm을 사용합니다. 프로젝트 폴더에서 실행합니다.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

`build`는 TypeScript 검사 후 `dist/`에 배포 파일을 생성합니다. GitHub Actions는 PR과 main 브랜치에서 린트, 이미지 URL 회귀 테스트, 빌드를 실행하고, main 푸시에서만 GitHub Pages에 배포합니다.

## 구조와 콘텐츠 수정

- `src/components/`: 페이지와 공통 UI. GitHub Pages에서 직접 경로 접근이 가능하도록 HashRouter를 사용합니다.
- `src/content/`: 교수 소개, 구성원, 연구, 논문, 갤러리, 소식의 Markdown 원본.
- `src/data/`: Markdown을 읽고 정렬하여 UI에 전달하는 모듈.
- `public/img/`: 로컬 이미지. 같은 이름의 `.webp` 파일을 우선 사용하며 없으면 원본으로 대체합니다. 외부 이미지 URL은 그대로 사용합니다.
- `src/utils/`, `src/hooks/`: 콘텐츠 파싱, 이미지 URL 처리, 이미지 미리 로딩.

기존 Markdown 파일의 frontmatter 형식을 따라 수정하면 됩니다. 연구 소개의 본문은 일반 텍스트로 표시합니다. 논문은 연도별 파일의 `items`에 추가하며, DOI가 없으면 Google Scholar 검색 링크가 표시됩니다.

교수의 `cvLink`가 비어 있거나 `#`이면 다운로드 버튼을 표시하지 않습니다. CV 파일을 `public/`에 추가하고 `src/content/professor.md`의 `cvLink`를 지정하면 버튼이 표시됩니다. 연구 이미지에는 현재 외부 placeholder가 포함되어 있으므로 실제 연구 이미지로 교체할 수 있습니다.

## 배포

현재 `vite.config.ts`의 `base: '/'`는 도메인 루트 배포용입니다. 로컬에서 `npm run build`와 `npm run preview`로 확인하거나, main 브랜치 푸시 시 기존 GitHub Pages 워크플로를 사용합니다.

## 시험 시계 및 미리보기

홈페이지 마지막 **Exam Clock** 탭 또는 `/#/exam-clock`에서 시험 시계를 엽니다. 전체 화면에서는 홈페이지 메뉴도 숨기고 시계와 메모만 표시합니다. 독립 미리보기도 계속 사용할 수 있습니다.

```sh
npm run dev:clock
```

개발 서버의 `/exam-clock-preview.html`을 엽니다. 12/24시간, 시계 좌우 배치, Enter 기준 줄바꿈과 메모 자동 크기, 메모 및 설정의 브라우저 저장을 지원합니다. 메모는 공백에서 자동으로 줄을 나누지 않으며, 입력한 각 줄이 영역 안에 들어가도록 전체 글자 크기를 조절합니다. 시각은 기기 현재 시간을 따르며 시·분·초를 표시합니다. 화면 갱신은 디스플레이의 프레임 속도를 따릅니다.

다이얼은 발뮤다 The Clock의 Light Hour 개념에서 영감을 받아 바늘 없이 표시합니다. 현재 시의 숫자를 백색으로 밝히고, 12시부터 현재 분까지 60개 대시가 시계 방향으로 채워집니다. 현재 분의 대시는 서서히 밝아지며 미세하게 빛이 흔들립니다. 다이얼 바깥의 작은 원은 매초 이동하며 살짝 지나친 뒤 흔들리며 멈춥니다. 움직임 줄이기 설정에서는 분 대시의 흔들림을 생략합니다. 초 반동은 별도 버튼으로 켜고 끄며 기본값은 ON입니다. 중앙에는 시·분·초만 표시합니다. 숫자와 분 대시는 간격을 두어 배치하고, 브랜드 문구와 날짜는 표시하지 않습니다. 실제 제품의 LED 구동이나 광학 구조를 복제한 것은 아닙니다.

F11 또는 전체 화면 버튼으로 진입하면 설정·하단 정보를 숨기고 시계와 메모만 표시합니다. F11 또는 Esc로 종료합니다. 일반 화면의 집중 모드는 Esc 또는 설정 표시 버튼으로 해제합니다. 좁은 화면에서는 시계와 메모를 위아래로 표시합니다.

`npm run build`에는 홈페이지의 시험 시계 탭이 포함됩니다. `npm run build:clock`은 독립 미리보기만 `dist-clock-preview/`에 빌드합니다.

---

### License
- Code: MIT © Wonwoo Shin@UDMSL, Inha University
- Images, Logos, and Documents: CC BY-NC 4.0

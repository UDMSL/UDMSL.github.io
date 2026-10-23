# NTP 시간 중계 서버

> 현재 시험 시계 화면은 TimeAPI.io에 직접 연결합니다. 아래 서버는 NTP 비교·진단용이며 페이지 실행에 필요하지 않습니다. [실측 결과](time-comparison.md)

Node.js 서버가 지정된 NTP 서버에 UDP 123으로 질의하고 JSON으로 전달합니다. GitHub Pages는 웹 화면을 계속 제공하며, 이 프로그램만 별도 PC 또는 VM에서 실행합니다. 서버 부분은 Node.js 내장 모듈만 사용하므로 추가 npm 설치가 필요하지 않습니다.

## 로컬 실행

프로젝트 루트에서 각각 별도 터미널로 실행합니다.

```sh
npm run time:server
npm run dev
```

진단 요청은 아래 중계 서버 주소를 직접 사용합니다. 현재 Vite 화면은 이 서버를 사용하지 않습니다. 네트워크에서 외부 DNS와 UDP 123 송수신이 가능해야 합니다.

```text
GET http://127.0.0.1:3100/api/time?server=ntp.kriss.re.kr
```

기본값은 `ntp.kriss.re.kr`, 대체 서버는 `time.nist.gov`입니다. 요청 서버가 실패하면 NIST로 대체하고 응답의 `sourceServer`, `fallbackUsed`에 실제 사용한 서버를 표시합니다. 여섯 서버 목록은 `src/data/timeServers.json`에서 관리합니다.

각 서버의 성공 결과는 60초, 실패는 15초 동안 캐시하며 동시 질의를 합칩니다. NTP 응답의 서버 상태, stratum, 원래 요청 타임스탬프와 송수신 시각을 검증합니다. NTP 왕복 지연과 처리 시간을 반영하고 캐시 이후 경과 시간은 단조 시계를 사용합니다.

이 중계 응답은 현재 화면에 연결되어 있지 않습니다. 별도 NTP 기반 클라이언트를 구현할 때 사용할 수 있습니다. 네트워크 비대칭에 따른 오차가 남을 수 있습니다.

## 선택적 중계 서버 호스팅

1. 계속 켜 두는 PC나 VM에 Node.js 24와 `server/`, `src/data/timeServers.json`을 배치합니다.
2. 프로세스를 서비스 관리자로 실행하고 HTTPS reverse proxy 또는 터널로 `/api/time`만 공개합니다. 기본 수신 주소는 `127.0.0.1`입니다. 호스팅이 요구하는 경우 `HOST=0.0.0.0`을 지정합니다.
3. `ALLOWED_ORIGIN=https://udmsl.github.io`를 사용합니다. 기본값도 같습니다. 포트는 `PORT`로 지정하며 기본값은 3100입니다.
4. 이 서버를 화면에 사용하려면 클라이언트의 응답 파싱·요청 방식을 중계 API 규격으로 다시 연결해야 합니다. 현재 TimeAPI.io 클라이언트에는 엔드포인트 환경 변수 전환 기능이 없습니다.

GitHub에 코드를 올리는 것만으로 이 Node.js 서버가 배포되지는 않습니다. 현재 TimeAPI.io 화면은 별도 서버 없이 GitHub Pages에서 동작합니다.

Docker는 프로젝트 루트에서 빌드합니다.

```sh
docker build -f server/Dockerfile -t udms-time .
docker run --rm -p 127.0.0.1:3100:3100 -e ALLOWED_ORIGIN=https://udmsl.github.io udms-time
```

컨테이너 이미지는 준비했으며 실제 컨테이너 실행과 클라우드 배포는 별도로 검증해야 합니다.

## 무료 운영 후보 (2026-10-23 확인)

- **기존 연구실 PC/소형 서버:** 추가 클라우드 호스팅 비용 없이 실행할 수 있습니다. 기기가 계속 켜져 있어야 하며 전력·네트워크 비용은 별도입니다. 임시 HTTPS 테스트는 [Cloudflare Quick Tunnel](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)로 가능하지만 임시 주소이고 개발·테스트용입니다. 정식 운영은 고정 HTTPS 주소를 마련해야 합니다.
- **Oracle Cloud Always Free VM:** [공식 무료 자원](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) 한도 내에서 Linux 중계 서버를 운영할 수 있습니다. 지역별 용량 부족과 유휴 VM 회수 정책이 있습니다. 가입과 자원 확보는 별도 확인 사항입니다.
- **Render Free:** [공식 문서](https://render.com/docs/free)에 따르면 15분 유휴 후 절전되고 재시작에 약 1분이 걸립니다. 시험 직전 빠른 연결이 필요할 때는 불리합니다. 해당 환경의 UDP 123 송수신도 배포 후 확인해야 합니다.

이번 로컬 테스트에서는 요청한 여섯 서버 모두 실제 NTP 응답을 받았습니다. 공개 호스팅을 선택하면 해당 네트워크에서 다시 확인해야 합니다.

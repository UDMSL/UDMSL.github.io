@echo off
chcp 65001
echo ==============================================
echo [1] Git 초기화 및 설정 확인 중 및 dist 폴더 삭제...
echo ==============================================

:: 0. dist 폴더 삭제
rmdir /s /q dist

:: 1. 깃 초기화 (이미 되어있어도 안전함)
git init

:: 2. 원격 저장소 연결 (이미 연결되어 있으면 에러 메시지를 숨기고 넘어감)
git remote add origin https://github.com/UDMSL/UDMSL.github.io 2>nul

echo.
echo ==============================================
echo [2] 변경 사항을 저장(Commit)합니다.
echo ==============================================

:: 3. 모든 파일 스테이징
git add .

:: 4. 커밋 메시지 입력받기 (엔터만 치면 날짜가 자동 입력됨)
set /p msg="커밋 메시지를 입력하세요 (엔터 시 자동 입력): "

if "%msg%"=="" set msg=Update %date% %time%
git commit -m "%msg%"

echo.
echo ==============================================
echo [3] GitHub에 소스 코드를 업로드(Push)합니다.
echo ==============================================

:: 5. 메인 브랜치로 푸시 (충돌 방지를 위해 일단 pull 시도 후 push)
:: 만약 강제로 덮어쓰길 원하면 아래 줄을 'git push -f origin main'으로 바꾸세요.
::git push -u origin main
git push -f origin main

echo.
echo ==============================================
echo [4] 웹사이트 배포(Deploy)를 시작합니다.
echo ==============================================

:: 6. npm deploy 실행 (배치파일에서 npm 실행 시 call이 필수입니다)
call npm run build && npx gh-pages -d dist

echo.
echo ==============================================
echo 모든 작업이 완료되었습니다! 창을 닫아주세요.
echo ==============================================
pause
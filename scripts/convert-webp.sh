#!/usr/bin/env bash
set -euo pipefail

# 변환할 이미지들이 들어 있는 디렉토리
SRC_DIR="public/img"

# 디렉토리 존재 여부 체크
if [ ! -d "$SRC_DIR" ]; then
  echo "디렉토리가 없습니다: $SRC_DIR"
  exit 1
fi

echo "▶ WebP 변환 시작: $SRC_DIR"

# png / jpg / jpeg 파일 전체 검색
find "$SRC_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
  # 출력 파일 경로: 확장자만 .webp 로 변경
  out="${img%.*}.webp"

  # 이미 .webp 파일이 있으면 스킵
  if [ -f "$out" ]; then
    echo " - 이미 존재, 스킵: $out"
    continue
  fi

  # 확장자에 따라 옵션 분기 (png → 무손실, jpg → 손실압축)
  lower_ext="$(echo "${img##*.}" | tr '[:upper:]' '[:lower:]')"

  if [ "$lower_ext" = "png" ]; then
    echo " + PNG → WebP (lossless): $img → $out"
    cwebp -lossless "$img" -o "$out" >/dev/null 2>&1
  else
    echo " + JPG → WebP (q=80): $img → $out"
    cwebp -q 80 "$img" -o "$out" >/dev/null 2>&1
  fi
done

echo "✅ WebP 변환 완료"

# 성수동 문화시설 추천 대시보드

#  최종 결과물
seongsu-dashboard/app/page.tsx 가 최종 코드입니다.

## 프로젝트 개요
성수동 23개 문화시설에 대해 사용자 프로필(성별, 연령대, 관심사, 방문시간)을
입력받아 효용 점수(0~100점)를 계산하고 맞춤 시설을 추천하는 웹 서비스입니다.

## 기술 스택
- Frontend: Next.js (React)
- 데이터 분석: Python, Pandas
- 데이터: 성수동 문화시설 카드 이용 데이터 (2024.08 ~ 2025.04)

## 폴더 구조
seongsu-dashboard/   → Next.js 웹 대시보드
notebooks/           → EDA 분석 노트북
model/               → 추천 모델 Python 코드
data/                → 원본 및 가공 데이터

## 실행 방법
cd seongsu-dashboard
npm install
npm run dev
브라우저에서 http://localhost:3000 접속

## 추천 모델 방식
사용자 입력값을 시설별 카드 이용 통계와 비교하여
성별/연령(30점) + 관심사(40점) + 방문시간(30점) 기준으로 점수 산출
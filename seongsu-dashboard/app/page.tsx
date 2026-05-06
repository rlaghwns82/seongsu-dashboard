"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

type Facility = {
  name: string;
  category: string;
  score: number;
  tagline: string;
};

type StepKey = "gender" | "age" | "interest" | "visitTime";

export default function Home() {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [interest, setInterest] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<Facility[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [pressedOption, setPressedOption] = useState<string | null>(null);
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const facilities: Facility[] = [
    {
      name: "그라운드시소",
      category: "전시",
      score: 92,
      tagline: "미디어 아트와 설치가 어우러진 감각적인 공간",
    },
    {
      name: "성수연방",
      category: "복합문화공간",
      score: 85,
      tagline: "복층 구조와 책·카페가 함께하는 성수 랜드마크",
    },
    {
      name: "뚝섬미술관",
      category: "미술관",
      score: 90,
      tagline: "한강과 맞닿은 여유로운 동시대 미술관",
    },
    {
      name: "에스팩토리",
      category: "전시장",
      score: 88,
      tagline: "산업 유산을 살린 넓은 전시·행사 공간",
    },
    {
      name: "성수아트홀",
      category: "공연",
      score: 80,
      tagline: "공연과 소극장 분위기를 즐기기 좋은 홀",
    },
    {
      name: "서울숲",
      category: "공원",
      score: 78,
      tagline: "산책과 피크닉, 계절 풍경이 함께하는 녹지",
    },
    {
      name: "언더스탠드에비뉴",
      category: "복합문화공간",
      score: 83,
      tagline: "브랜드와 소품숍이 모인 성수 대표 아케이드",
    },
  ];

  const buttonClass = (selected: boolean) =>
    `group relative flex min-h-[88px] min-w-[132px] items-center justify-center rounded-2xl border px-6 py-5 text-lg font-semibold transition-all duration-200 ${
      selected
        ? "border-transparent bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-[0_10px_24px_rgba(129,52,175,0.30)]"
        : "border-[#E4D7F3] bg-white text-[#262626] shadow-[0_2px_10px_rgba(131,58,180,0.08)] hover:-translate-y-0.5 hover:border-[#C9B0E8] hover:shadow-[0_8px_18px_rgba(131,58,180,0.18)]"
    }`;

  const stepConfig: {
    key: StepKey;
    question: string;
    options: string[];
  }[] = [
    { key: "gender", question: "성별을 선택해주세요", options: ["남", "여"] },
    {
      key: "age",
      question: "연령대가 어떻게 되세요?",
      options: ["20대", "30대", "40대", "50대"],
    },
    {
      key: "interest",
      question: "어떤 걸 좋아하세요?",
      options: ["문화", "여행", "아웃도어", "디지털"],
    },
    {
      key: "visitTime",
      question: "언제 방문하실 건가요?",
      options: ["오전", "오후", "저녁"],
    },
  ];

  const setAnswer = (key: StepKey, value: string) => {
    if (key === "gender") setGender(value);
    if (key === "age") setAge(value);
    if (key === "interest") setInterest(value);
    if (key === "visitTime") setVisitTime(value);
  };

  const getAnswer = (key: StepKey) => {
    if (key === "gender") return gender;
    if (key === "age") return age;
    if (key === "interest") return interest;
    return visitTime;
  };

  const recommend = () => {
    setTransitionDirection("forward");
    const sorted = [...facilities].sort((a, b) => b.score - a.score);
    setResult(sorted.slice(0, 5));
    setShowResult(true);
  };

  const handleSelect = (option: string) => {
    if (pressedOption) return;
    const step = stepConfig[currentStep - 1];
    setAnswer(step.key, option);
    setPressedOption(option);

    advanceTimeoutRef.current = setTimeout(() => {
      if (currentStep < 4) {
        setTransitionDirection("forward");
        setCurrentStep((prev) => prev + 1);
        setPressedOption(null);
        return;
      }

      setPressedOption(null);
      recommend();
    }, 170);
  };

  const handleBack = () => {
    if (currentStep === 1) return;
    setTransitionDirection("backward");
    setCurrentStep((prev) => prev - 1);
  };

  const resetSelection = () => {
    setGender("");
    setAge("");
    setInterest("");
    setVisitTime("");
    setTransitionDirection("backward");
    setCurrentStep(1);
    setShowResult(false);
    setResult([]);
  };

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const activeStep = stepConfig[currentStep - 1];

  return (
    <main
      className={`${notoSansKr.className} relative min-h-screen overflow-hidden bg-[#FCFAFF] px-3 py-8 text-[#262626] sm:px-5 lg:px-8 lg:py-10`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-24 h-[380px] w-[380px] rounded-full bg-[#FFB7DC]/65 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-[400px] w-[400px] rounded-full bg-[#D9BBFF]/70 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#F19BFF]/55 blur-3xl" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl">
        <section className="relative mb-8 rounded-3xl shadow-[0_24px_56px_rgba(131,58,180,0.18)] ring-1 ring-white/60">
          <div className="relative aspect-[21/9] min-h-[196px] w-full overflow-hidden rounded-3xl sm:aspect-[24/9] sm:min-h-[232px]">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"
              alt="성수동 골목 카페와 식사 테이블"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-9 pt-16 text-center sm:px-8 sm:pb-11">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.35em] text-white/85">
                Seongsu · Seoul
              </p>
              <h1 className="instagram-title-on-dark text-3xl font-extrabold tracking-tight sm:text-4xl">
                Seongsu Pick
              </h1>
            </div>
          </div>
        </section>

        {!showResult ? (
          <div
            key={`step-${currentStep}`}
            className={`rounded-3xl border border-[#EDE1FA] bg-white p-6 shadow-[0_16px_40px_rgba(131,58,180,0.10)] sm:p-8 ${
              transitionDirection === "forward" ? "step-enter-forward" : "step-enter-backward"
            }`}
          >
            <div className="mb-8">
              <div className="mb-4 flex gap-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1E9FB]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] transition-all duration-300"
                      style={{ width: currentStep > idx ? "100%" : "0%" }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  currentStep === 1
                    ? "cursor-not-allowed border-[#EDE1FA] bg-[#F8F3FD] text-[#B39ACF]"
                    : "border-[#D5B7F4] bg-white text-[#262626] hover:-translate-y-0.5 hover:bg-[#FAF5FF]"
                }`}
              >
                ← 이전
              </button>
                <p className="text-sm font-bold tracking-wide text-[#8E8E8E]">{currentStep}/4</p>
              </div>
            </div>

            <p className="mb-10 text-center text-[31px] font-extrabold leading-snug tracking-tight">
              {activeStep.question}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {activeStep.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${buttonClass(
                    getAnswer(activeStep.key) === option
                  )} ${pressedOption === option ? "card-press" : ""}`}
                  onClick={() => handleSelect(option)}
                  disabled={Boolean(pressedOption)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div key="result-screen" className="step-enter-forward space-y-4">
            <div className="rounded-3xl border border-[#EDE1FA] bg-white p-5 shadow-[0_16px_40px_rgba(131,58,180,0.10)] sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C13584]">your pick</p>
              <p className="mt-2 text-xl font-bold">
                {gender} · {age} · {interest} · {visitTime}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {result.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex flex-col rounded-3xl border border-[#EDE1FA] bg-white p-5 shadow-[0_10px_26px_rgba(131,58,180,0.09)] sm:min-h-[200px] sm:p-6 ${
                    index === 0 ? "sm:col-span-2 sm:p-8" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="inline rounded-full bg-[#F7EDFF] px-2.5 py-1 text-sm font-bold text-[#C13584]">
                        #{index + 1}
                      </p>
                      <p
                        className={`font-bold tracking-tight ${
                          index === 0 ? "mt-3 text-xl sm:text-2xl" : "mt-2 text-lg"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#8E8E8E]">{item.category}</p>
                    </div>
                    <p
                      className={`shrink-0 font-bold text-[#833AB4] ${
                        index === 0 ? "text-base sm:text-lg" : "text-sm"
                      }`}
                    >
                      {item.score}점
                    </p>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6B6B6B]">{item.tagline}</p>
                  <div className="mt-4">
                    <div className="h-2.5 w-full rounded-full bg-[#F1E9FB]">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-[#F58529]/90 via-[#DD2A7B]/85 to-[#8134AF]/90"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={resetSelection}
              className="w-full rounded-2xl border border-[#D5B7F4] bg-white px-4 py-3 text-base font-bold text-[#262626] transition-all hover:-translate-y-0.5 hover:bg-[#FAF5FF]"
            >
              다시 선택하기
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .step-enter-forward {
          animation: fadeSlideForward 180ms ease-out;
        }

        .step-enter-backward {
          animation: fadeSlideBackward 180ms ease-out;
        }

        @keyframes fadeSlideForward {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeSlideBackward {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .instagram-title-on-dark {
          display: block;
          width: 100%;
          margin: 0;
          padding-bottom: 0.08em;
          line-height: 1.28;
          background: linear-gradient(
            90deg,
            #ffe259 0%,
            #ffa751 28%,
            #ff6cab 55%,
            #e0c3fc 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        .card-press {
          animation: cardPressFlip 170ms ease-out forwards;
          transform-style: preserve-3d;
        }

        @keyframes cardPressFlip {
          0% {
            transform: perspective(900px) rotateY(0deg) scale(1);
            filter: brightness(1);
          }
          50% {
            transform: perspective(900px) rotateY(10deg) scale(0.97);
            filter: brightness(1.05) saturate(1.1);
          }
          100% {
            transform: perspective(900px) rotateY(0deg) scale(1.02);
            filter: brightness(1.02);
          }
        }
      `}</style>
    </main>
  );
}
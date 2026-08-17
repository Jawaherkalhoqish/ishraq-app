import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import type { ChildProfile as ChildProfileType } from '../types'

const AGES = [5, 6, 7, 8, 9, 10]

type Step = 'info' | 'adhd' | 'questions'

type Question = {
  id: string
  title: string
  options: string[]
}

const QUESTIONS: Question[] = [
  {
    id: 'attention',
    title: 'كيف يركز الطفل عادةً أثناء أداء مهمة أو نشاط؟',
    options: [
      'يستطيع التركيز لفترة طويلة',
      'يحتاج إلى تذكير بالتركيز',
      'يتشتت بسهولة',
      'يفقد اهتمامه بسرعة',
      'يستطيع التركيز بشكل أفضل مع وجود نشاط تفاعلي',
    ],
  },
  {
    id: 'learning',
    title: 'كيف يفضل الطفل التعلم؟',
    options: [
      'من خلال الألعاب',
      'من خلال الصور والرسومات',
      'من خلال الشرح الصوتي',
      'من خلال التجربة والتفاعل',
      'من خلال التحديات والمكافآت',
    ],
  },
  {
    id: 'behavior',
    title: 'ما الذي قد يحدث عندما يواجه الطفل سؤالًا صعبًا؟',
    options: [
      'يحاول مرة أخرى',
      'يطلب المساعدة',
      'يفقد تركيزه',
      'يشعر بالإحباط بسرعة',
      'ينتقل إلى نشاط آخر',
    ],
  },
  {
    id: 'environment',
    title: 'ما البيئة التي تساعد الطفل أكثر على التعلم؟',
    options: [
      'مكان هادئ',
      'تعلم قصير ومتقطع',
      'أنشطة تفاعلية',
      'وجود مكافآت وتشجيع',
      'التعلم مع الحركة',
    ],
  },
]

function UploadIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M5 20h14" />
      <path d="M5 16v4" />
      <path d="M19 16v4" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13">
      <path
        d="M2 6.5L5 10L11 3"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ChildProfile({
  navigate,
  setChildProfile,
}: ScreenProps) {
  const [name, setName] = useState('')
  const [age, setAge] = useState<number | null>(null)

  const [gender, setGender] = useState<
    'boy' | 'girl' | 'no-answer' | null
  >(null)

  const [adhd, setAdhd] = useState<
    'yes' | 'no' | 'prefer-not' | null
  >(null)

  const [step, setStep] = useState<Step>('info')
  const [animating, setAnimating] = useState(false)

  const [report, setReport] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [reportAnalyzed, setReportAnalyzed] = useState(false)

  const [answers, setAnswers] = useState<Record<string, string[]>>({})

  const isInfoReady = Boolean(
    name.trim() && age && gender,
  )

  const goToAdhd = () => {
    if (!isInfoReady) return

    setAnimating(true)

    setTimeout(() => {
      setStep('adhd')
      setAnimating(false)
    }, 280)
  }

  const handleReportUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('يرجى إرفاق ملف PDF أو صورة فقط.')
      return
    }

    setReport(file)
    setReportAnalyzed(false)
  }

  const handleAnalyzeReport = () => {
    if (!report) return

    setAnalyzing(true)

    setTimeout(() => {
      setAnalyzing(false)
      setReportAnalyzed(true)
    }, 1500)
  }

  const removeReport = () => {
    setReport(null)
    setReportAnalyzed(false)
  }

  const toggleAnswer = (
    questionId: string,
    option: string,
  ) => {
    setAnswers(current => {
      const currentAnswers = current[questionId] || []

      const alreadySelected =
        currentAnswers.includes(option)

      const updatedAnswers = alreadySelected
        ? currentAnswers.filter(item => item !== option)
        : [...currentAnswers, option]

      return {
        ...current,
        [questionId]: updatedAnswers,
      }
    })
  }

  const allQuestionsAnswered = QUESTIONS.every(
    question =>
      (answers[question.id] || []).length > 0,
  )

  const goToQuestions = () => {
    if (!adhd) return

    setAnimating(true)

    setTimeout(() => {
      setStep('questions')
      setAnimating(false)
    }, 280)
  }

  const handleSubmit = () => {
    if (
      !adhd ||
      !age ||
      !gender ||
      !allQuestionsAnswered
    ) {
      return
    }

    const profile: ChildProfileType = {
      name: name.trim(),
      age,
      gender,
      adhdDiagnosis: adhd,
      reportName: report?.name || null,
      reportAnalyzed,
      questionnaireAnswers: answers,
    }

    setChildProfile(profile)
    navigate('parent-pin-setup')
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center ishraq-bg-main px-8"
      style={{ direction: 'rtl' }}
    >
      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3, 4].map(i => {
          const active =
            (step === 'info' && i <= 2) ||
            (step === 'adhd' && i <= 3) ||
            (step === 'questions' && i <= 4)

          return (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width: active ? 32 : 12,
                height: 8,
                borderRadius: 4,
                background: active
                  ? '#A98FE0'
                  : 'rgba(169,143,224,0.25)',
              }}
            />
          )
        })}
      </div>

      <div
        className="w-full max-w-lg ishraq-scroll"
        style={{
          maxHeight: '78vh',
          opacity: animating ? 0 : 1,
          transform: animating
            ? 'translateY(12px)'
            : 'translateY(0)',
          transition: 'all 0.28s ease',
        }}
      >
        {/* ========================= */}
        {/* STEP 1 */}
        {/* ========================= */}

        {step === 'info' && (
          <>
            <div className="mb-8">
              <p
                className="text-sm font-bold mb-1"
                style={{ color: '#A98FE0' }}
              >
                الخطوة ٢ من ٤
              </p>

              <h2
                className="text-3xl font-black mb-2"
                style={{ color: '#2D1F5E' }}
              >
                ملف الطفل
              </h2>

              <p
                className="text-base font-medium"
                style={{ color: '#8878B0' }}
              >
                أخبرنا عن طفلك لنخصص تجربته
              </p>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label
                className="block text-sm font-bold mb-2"
                style={{ color: '#5A3FA0' }}
              >
                اسم الطفل
              </label>

              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="اسم الطفل"
                className="w-full px-5 py-4 rounded-2xl text-xl font-semibold outline-none"
                style={{
                  background: 'white',
                  border: `2px solid ${
                    name ? '#A98FE0' : '#E8E2F5'
                  }`,
                  color: '#2D1F5E',
                  boxShadow: name
                    ? '0 0 0 4px rgba(169,143,224,0.12)'
                    : 'none',
                }}
              />
            </div>

            {/* Age */}
            <div className="mb-6">
              <label
                className="block text-sm font-bold mb-3"
                style={{ color: '#5A3FA0' }}
              >
                عمر الطفل
              </label>

              <div className="flex gap-3 flex-wrap">
                {AGES.map(a => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className="btn-press w-16 h-16 rounded-2xl text-2xl font-black transition-all duration-200"
                    style={{
                      background:
                        age === a
                          ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)'
                          : 'white',
                      color:
                        age === a
                          ? 'white'
                          : '#5A3FA0',
                      border: `2px solid ${
                        age === a
                          ? 'transparent'
                          : '#E8E2F5'
                      }`,
                      boxShadow:
                        age === a
                          ? '0 6px 20px rgba(124,92,191,0.35)'
                          : '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="mb-8">
              <label
                className="block text-sm font-bold mb-3"
                style={{ color: '#5A3FA0' }}
              >
                جنس الطفل
              </label>

              <div className="flex gap-4">
                {([
                  {
                    val: 'boy',
                    label: 'ولد',
                  },
                  {
                    val: 'girl',
                    label: 'بنت',
                  },
                  {
                    val: 'no-answer',
                    label: 'أفضل عدم الإجابة',
                  },
                ] as const).map(g => (
                  <button
                    key={g.val}
                    onClick={() => setGender(g.val)}
                    className="btn-press flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200"
                    style={{
                      background:
                        gender === g.val
                          ? 'linear-gradient(135deg, rgba(169,143,224,0.15), rgba(124,92,191,0.1))'
                          : 'white',
                      border: `2px solid ${
                        gender === g.val
                          ? '#A98FE0'
                          : '#E8E2F5'
                      }`,
                      color:
                        gender === g.val
                          ? '#7C5CBF'
                          : '#8878B0',
                    }}
                  >
                    <span className="text-lg font-black">
                      {g.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={goToAdhd}
              disabled={!isInfoReady}
              className="w-full py-5 rounded-2xl text-xl font-black text-white"
              style={{
                background: isInfoReady
                  ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)'
                  : 'rgba(169,143,224,0.3)',
                boxShadow: isInfoReady
                  ? '0 8px 28px rgba(124,92,191,0.35)'
                  : 'none',
              }}
            >
              التالي
            </button>
          </>
        )}

        {/* ========================= */}
        {/* STEP 2 */}
        {/* ========================= */}

        {step === 'adhd' && (
          <>
            <div className="mb-8">
              <p
                className="text-sm font-bold mb-1"
                style={{ color: '#A98FE0' }}
              >
                الخطوة ٣ من ٤
              </p>

              <h2
                className="text-2xl font-black mb-3"
                style={{ color: '#2D1F5E' }}
              >
                هل الطفل مشخص باضطراب فرط الحركة وتشتت الانتباه (ADHD) من قِبل طبيب أو مختص؟
              </h2>

              <div
                className="p-4 rounded-2xl"
                style={{
                  background:
                    'rgba(123,184,240,0.12)',
                  border:
                    '1.5px solid rgba(123,184,240,0.3)',
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{
                    color: '#2D5A8A',
                    lineHeight: 1.7,
                  }}
                >
                  هذا السؤال لأغراض بحثية وتخصيص التجربة فقط. تطبيق إشراق لا يشخّص ولا يستنتج أي اضطراب أو حالة طبية من خلال أداء الطفل في الألعاب.
                </p>
              </div>
            </div>

            {/* ADHD options */}
            <div className="space-y-4 mb-6">
              {([
                {
                  val: 'yes',
                  label: 'نعم',
                  desc: 'لديه تشخيص رسمي من طبيب أو مختص',
                  color: '#A98FE0',
                },
                {
                  val: 'no',
                  label: 'لا',
                  desc: 'لا يوجد تشخيص',
                  color: '#7BB8F0',
                },
                {
                  val: 'prefer-not',
                  label: 'أفضل عدم الإجابة',
                  desc: '',
                  color: '#8878B0',
                },
              ] as const).map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setAdhd(opt.val)}
                  className="w-full p-5 rounded-2xl text-right flex items-center gap-4 btn-press"
                  style={{
                    background:
                      adhd === opt.val
                        ? 'rgba(169,143,224,0.10)'
                        : 'white',
                    border: `2px solid ${
                      adhd === opt.val
                        ? opt.color
                        : '#E8E2F5'
                    }`,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor:
                        adhd === opt.val
                          ? opt.color
                          : '#C9BDED',
                      background:
                        adhd === opt.val
                          ? opt.color
                          : 'transparent',
                    }}
                  >
                    {adhd === opt.val && (
                      <CheckIcon />
                    )}
                  </div>

                  <div>
                    <p
                      className="text-lg font-bold"
                      style={{ color: '#2D1F5E' }}
                    >
                      {opt.label}
                    </p>

                    {opt.desc && (
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#8878B0' }}
                      >
                        {opt.desc}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Report */}
            {adhd === 'yes' && (
              <div
                className="mb-8 p-5 rounded-2xl"
                style={{
                  background:
                    'rgba(169,143,224,0.07)',
                  border:
                    '1.5px solid rgba(169,143,224,0.25)',
                }}
              >
                <p
                  className="font-black text-base"
                  style={{ color: '#5A3FA0' }}
                >
                  التقرير التشخيصي
                  <span
                    className="text-xs font-medium mr-2"
                    style={{ color: '#8878B0' }}
                  >
                    اختياري
                  </span>
                </p>

                <p
                  className="text-xs mt-1 mb-4"
                  style={{
                    color: '#8878B0',
                    lineHeight: 1.7,
                  }}
                >
                  يمكنك إرفاق التقرير التشخيصي إذا رغبت، وسيتم استخدامه لتخصيص تجربة الطفل.
                </p>

                {!report ? (
                  <label
                    className="w-full min-h-32 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer btn-press"
                    style={{
                      background: 'white',
                      border:
                        '2px dashed rgba(169,143,224,0.45)',
                      color: '#7C5CBF',
                    }}
                  >
                    <UploadIcon />

                    <span className="font-bold text-sm">
                      إرفاق التقرير
                    </span>

                    <span
                      className="text-xs"
                      style={{ color: '#8878B0' }}
                    >
                      PDF أو صورة
                    </span>

                    <input
                      type="file"
                      accept=".pdf,image/jpeg,image/png,image/webp"
                      onChange={handleReportUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      background: 'white',
                      border:
                        '1.5px solid rgba(169,143,224,0.25)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background:
                            'rgba(169,143,224,0.12)',
                          color: '#7C5CBF',
                        }}
                      >
                        <FileIcon />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold text-sm truncate"
                          style={{ color: '#2D1F5E' }}
                        >
                          {report.name}
                        </p>

                        <p
                          className="text-xs mt-1"
                          style={{ color: '#8878B0' }}
                        >
                          تم إرفاق التقرير بنجاح
                        </p>
                      </div>

                      <button
                        onClick={removeReport}
                        className="text-xs font-bold"
                        style={{ color: '#FF6B6B' }}
                      >
                        حذف
                      </button>
                    </div>

                    <button
                      onClick={handleAnalyzeReport}
                      disabled={analyzing}
                      className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-white"
                      style={{
                        background: reportAnalyzed
                          ? '#63B46B'
                          : 'linear-gradient(135deg, #A98FE0, #7C5CBF)',
                      }}
                    >
                      {analyzing
                        ? 'جاري تحليل التقرير...'
                        : reportAnalyzed
                          ? 'تم تحليل التقرير ✓'
                          : 'تحليل التقرير'}
                    </button>

                    {reportAnalyzed && (
                      <div
                        className="mt-3 p-3 rounded-xl"
                        style={{
                          background:
                            'rgba(100,200,100,0.08)',
                          border:
                            '1px solid rgba(100,200,100,0.2)',
                        }}
                      >
                        <p
                          className="text-xs font-medium"
                          style={{
                            color: '#2D7A2D',
                            lineHeight: 1.7,
                          }}
                        >
                          تم تجهيز التقرير لتخصيص تجربة الطفل. التحليل الفعلي يحتاج إلى ربط التطبيق بخدمة ذكاء اصطناعي آمنة في الخلفية.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep('info')}
                className="btn-press px-8 py-4 rounded-2xl font-bold"
                style={{
                  background:
                    'rgba(124,92,191,0.08)',
                  color: '#7C5CBF',
                  border:
                    '1.5px solid rgba(124,92,191,0.2)',
                }}
              >
                رجوع
              </button>

              <button
                onClick={goToQuestions}
                disabled={!adhd}
                className="flex-1 py-4 rounded-2xl text-xl font-black text-white"
                style={{
                  background: adhd
                    ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)'
                    : 'rgba(169,143,224,0.3)',
                }}
              >
                التالي
              </button>
            </div>
          </>
        )}

        {/* ========================= */}
        {/* STEP 3 */}
        {/* ========================= */}

        {step === 'questions' && (
          <>
            <div className="mb-8">
              <p
                className="text-sm font-bold mb-1"
                style={{ color: '#A98FE0' }}
              >
                الخطوة ٤ من ٤
              </p>

              <h2
                className="text-2xl font-black mb-2"
                style={{ color: '#2D1F5E' }}
              >
                أخبرنا أكثر عن الطفل
              </h2>

              <p
                className="text-base font-medium"
                style={{
                  color: '#8878B0',
                  lineHeight: 1.7,
                }}
              >
                يمكنك اختيار أكثر من إجابة في كل سؤال. ستساعدنا إجاباتك على تخصيص تجربة إشراق.
              </p>
            </div>

            <div className="space-y-7">
              {QUESTIONS.map(
                (question, questionIndex) => {
                  const selected =
                    answers[question.id] || []

                  return (
                    <div
                      key={question.id}
                      className="p-5 rounded-2xl"
                      style={{
                        background: 'white',
                        border:
                          '1.5px solid rgba(169,143,224,0.22)',
                        boxShadow:
                          '0 4px 16px rgba(124,92,191,0.06)',
                      }}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black text-white"
                          style={{
                            background:
                              'linear-gradient(135deg, #A98FE0, #7C5CBF)',
                          }}
                        >
                          {questionIndex + 1}
                        </div>

                        <h3
                          className="font-black text-base"
                          style={{
                            color: '#2D1F5E',
                            lineHeight: 1.7,
                          }}
                        >
                          {question.title}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {question.options.map(option => {
                          const isSelected =
                            selected.includes(option)

                          return (
                            <button
                              key={option}
                              onClick={() =>
                                toggleAnswer(
                                  question.id,
                                  option,
                                )
                              }
                              className="w-full p-3.5 rounded-xl text-right flex items-center gap-3 btn-press transition-all duration-200"
                              style={{
                                background:
                                  isSelected
                                    ? 'rgba(169,143,224,0.10)'
                                    : '#FAF9FD',
                                border: `1.5px solid ${
                                  isSelected
                                    ? '#A98FE0'
                                    : '#E8E2F5'
                                }`,
                              }}
                            >
                              <div
                                className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0"
                                style={{
                                  borderColor:
                                    isSelected
                                      ? '#7C5CBF'
                                      : '#C9BDED',
                                  background:
                                    isSelected
                                      ? '#7C5CBF'
                                      : 'transparent',
                                }}
                              >
                                {isSelected && (
                                  <CheckIcon />
                                )}
                              </div>

                              <span
                                className="text-sm font-bold"
                                style={{
                                  color:
                                    isSelected
                                      ? '#5A3FA0'
                                      : '#6F6290',
                                }}
                              >
                                {option}
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      {selected.length > 0 && (
                        <p
                          className="text-xs mt-3 font-medium"
                          style={{ color: '#A98FE0' }}
                        >
                          تم اختيار {selected.length} إجابة
                        </p>
                      )}
                    </div>
                  )
                },
              )}
            </div>

            <div className="flex gap-4 mt-8 pb-5">
              <button
                onClick={() => setStep('adhd')}
                className="btn-press px-8 py-4 rounded-2xl font-bold"
                style={{
                  background:
                    'rgba(124,92,191,0.08)',
                  color: '#7C5CBF',
                  border:
                    '1.5px solid rgba(124,92,191,0.2)',
                }}
              >
                رجوع
              </button>

              <button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="flex-1 py-4 rounded-2xl text-xl font-black text-white"
                style={{
                  background:
                    allQuestionsAnswered
                      ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)'
                      : 'rgba(169,143,224,0.3)',
                }}
              >
                حفظ والبدء
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
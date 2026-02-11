'use client';

import { useState, useMemo } from 'react';
import api from '@/utils/axios';
import styles from './DefaultContent.module.scss';
import {
    ArrowRight,
    Copy,
    RotateCcw,
    Plus,
    Trash2,
    TrendingUp,
    TrendingDown,
    Calculator,
    MessageSquareQuote,
    Lightbulb
} from 'lucide-react';
import type { ApiResponse, ApiError } from "@/types/api";

type LuxuryItem = {
    id: number;
    name: string;
    price: number;
    lifespan: number;
};

type DignityAiContent = {
    content: string; // 서버가 주는 문자열 JSON
};

export type DignityAi = {
    dignityLevel: string;
    roastComment: string;
    comparisonAnalysis: string;
};

// 숫자 포맷팅
const fmt = (n: number) => Math.round(n).toLocaleString();

export default function DefaultContentInner({ companyId }: { companyId: number }) {
    // --- State ---
    const [currentItems, setCurrentItems] = useState<LuxuryItem[]>([]);
    const [futureItems, setFutureItems] = useState<LuxuryItem[]>([]);
    const [salaryStr, setSalaryStr] = useState('');

    // 입력 폼 State
    const [newCurrent, setNewCurrent] = useState({ name: '', price: '', lifespan: '24' });
    const [newFuture, setNewFuture] = useState({ name: '', price: '', lifespan: '24' });

    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<DignityAi | null>(null);

    // --- 계산 로직 ---
    const calcMonthly = (list: LuxuryItem[]) =>
        list.reduce((acc, item) => acc + (item.price / item.lifespan), 0);

    const currentTotal = useMemo(() => calcMonthly(currentItems), [currentItems]);
    const futureTotal = useMemo(() => calcMonthly(futureItems), [futureItems]);
    const diff = futureTotal - currentTotal;

    // --- 핸들러 ---
    const addItem = (target: 'current' | 'future') => {
        const input = target === 'current' ? newCurrent : newFuture;
        const setInput = target === 'current' ? setNewCurrent : setNewFuture;
        const setList = target === 'current' ? setCurrentItems : setFutureItems;

        if (!input.name || !input.price) return;

        const newItem: LuxuryItem = {
            id: Date.now() + Math.random(),
            name: input.name,
            price: parseInt(input.price.replace(/,/g, ''), 10),
            lifespan: parseInt(input.lifespan, 10) || 24,
        };

        setList(prev => [...prev, newItem]);
        setInput({ name: '', price: '', lifespan: '24' });
        setAnalysis(null); // 데이터 변경 시 결과 초기화
    };

    const removeItem = (target: 'current' | 'future', id: number) => {
        const setList = target === 'current' ? setCurrentItems : setFutureItems;
        setList(prev => prev.filter(i => i.id !== id));
        setAnalysis(null);
    };

    const copyCurrentToFuture = () => {
        // ID 부여하여 독립성 보장
        const copied = currentItems.map(item => ({
            ...item,
            id: Date.now() + Math.random()
        }));
        setFutureItems(copied);
        setAnalysis(null);
    };

    // 월급 입력 핸들러
    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            setSalaryStr(parseInt(value, 10).toLocaleString());
        } else {
            setSalaryStr('');
        }
    };

    // AI 분석 요청 핸들러
    const handleAnalyze = async () => {
        if (currentItems.length === 0 && futureItems.length === 0) {
            alert('비교할 아이템이 없습니다. 아이템을 추가해주세요.');
            return;
        }

        setLoading(true);
        setAnalysis(null);

        try {
            const monthlySalary = salaryStr ? parseInt(salaryStr.replace(/,/g, ''), 10) : null;

            const payload = {
                currentItems: currentItems.map(i => ({ name: i.name, price: i.price, lifespan: i.lifespan })),
                futureItems: futureItems.map(i => ({ name: i.name, price: i.price, lifespan: i.lifespan })),
                monthlySalary
            };

            const res = await api.post<DignityAiContent>(
                '/api/ai/generate/dignity',
                payload,
                { timeout: 180000 }
            );

            const content = res.data?.content ?? '{}';

            let parsed: DignityAi | null = null;
            try {
                parsed = JSON.parse(content) as DignityAi;
            } catch (err) {
                console.error('AI JSON parse failed:', err, content);
                parsed = {
                    dignityLevel: '파싱 실패',
                    roastComment: 'AI가 이상한 소리를 했음',
                    comparisonAnalysis: '응답 JSON 파싱에 실패했음. 서버 로그/응답 원문 확인 필요함.'
                };
            }

            setAnalysis(parsed);

        } catch (e: any) {
            console.error('AI Analysis Error:', e);
            alert(e?.message ?? '뀹 AI가 당신의 소비 계획을 보고 말문을 잃었습니다. (서버 오류)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>품위 유지비 계산기</h1>
                <p>당신의 품위 유지비는 적당할까요?</p>

                <div className={styles.salaryInputWrapper}>
                    <label>내 월급</label>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            placeholder="0"
                            value={salaryStr}
                            onChange={handleSalaryChange}
                        />
                        <span className={styles.unit}>원</span>
                    </div>
                    <p className={styles.guide}>* 입력 시 소득 기준으로 평가</p>
                </div>
            </header>

            {/* 1. 상단 대시보드 (Scoreboard) */}
            <div className={styles.scoreboard}>
                <div className={styles.scoreCard}>
                    <span className={styles.label}>CURRENT TOTAL</span>
                    <div className={styles.value}>{fmt(currentTotal)}원</div>
                </div>

                <div className={`${styles.diffBadge} ${diff > 0 ? styles.up : diff < 0 ? styles.down : ''}`}>
                    {diff > 0 ? <TrendingUp size={24} /> : diff < 0 ? <TrendingDown size={24} /> : <ArrowRight />}
                    <span className={styles.diffValue}>
                        {diff > 0 ? '+' : ''}{fmt(diff)}원
                    </span>
                    <span className={styles.diffLabel}>월 변동액</span>
                </div>

                <div className={`${styles.scoreCard} ${styles.future}`}>
                    <span className={styles.label}>FUTURE TOTAL</span>
                    <div className={styles.value}>{fmt(futureTotal)}원</div>
                </div>
            </div>

            {/* 2. 메인 2단 컬럼 */}
            <div className={styles.compareGrid}>
                {/* [LEFT] Current Items */}
                <section className={styles.column}>
                    <div className={styles.colHeader}>
                        <h2>현재 보유 목록</h2>
                        <span className={styles.count}>{currentItems.length}</span>
                    </div>
                    {/* ... (입력 폼 동일) ... */}
                    <div className={styles.miniInput}>
                        <input
                            placeholder="품목 (예: 아이폰)"
                            value={newCurrent.name}
                            onChange={e => setNewCurrent({...newCurrent, name: e.target.value})}
                        />
                        <div className={styles.row}>
                            <input
                                type="number" placeholder="가격"
                                value={newCurrent.price}
                                onChange={e => setNewCurrent({...newCurrent, price: e.target.value})}
                            />
                            <input
                                type="number" placeholder="개월"
                                value={newCurrent.lifespan}
                                onChange={e => setNewCurrent({...newCurrent, lifespan: e.target.value})}
                            />
                        </div>
                        <button onClick={() => addItem('current')} disabled={!newCurrent.name}>
                            <Plus size={14} /> 추가
                        </button>
                    </div>

                    <div className={styles.listArea}>
                        {currentItems.map(item => (
                            <div key={item.id} className={styles.itemRow}>
                                <div className={styles.info}>
                                    <div className={styles.name}>{item.name}</div>
                                    <div className={styles.meta}>{fmt(item.price)}원 / {item.lifespan}개월</div>
                                </div>
                                <div className={styles.cost}>
                                    월 {fmt(item.price/item.lifespan)}
                                    <button onClick={() => removeItem('current', item.id)}><Trash2 size={12}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* [CENTER] Action Zone */}
                <div className={styles.actionZone}>
                    <button
                        className={styles.btnSync}
                        onClick={copyCurrentToFuture}
                        title="현재 목록을 미래로 복사"
                    >
                        <Copy size={16} />
                        <span>Sync</span>
                        <ArrowRight size={16} />
                    </button>
                    <button
                        className={styles.btnReset}
                        onClick={() => setFutureItems([])}
                        title="미래 목록 초기화"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>

                {/* [RIGHT] Future Items */}
                <section className={`${styles.column} ${styles.futureCol}`}>
                    <div className={styles.colHeader}>
                        <h2>미래 시뮬레이션</h2>
                        <span className={styles.count}>{futureItems.length}</span>
                    </div>
                    {/* ... (입력 폼 동일) ... */}
                    <div className={styles.miniInput}>
                        <input
                            placeholder="추가할 꿈의 아이템"
                            value={newFuture.name}
                            onChange={e => setNewFuture({...newFuture, name: e.target.value})}
                        />
                        <div className={styles.row}>
                            <input
                                type="number" placeholder="가격"
                                value={newFuture.price}
                                onChange={e => setNewFuture({...newFuture, price: e.target.value})}
                            />
                            <input
                                type="number" placeholder="개월"
                                value={newFuture.lifespan}
                                onChange={e => setNewFuture({...newFuture, lifespan: e.target.value})}
                            />
                        </div>
                        <button className={styles.btnFutureAdd} onClick={() => addItem('future')} disabled={!newFuture.name}>
                            <Plus size={14} /> 시나리오 추가
                        </button>
                    </div>

                    <div className={styles.listArea}>
                        {futureItems.length === 0 && (
                            <div className={styles.emptyGuide}>
                                'Sync' 버튼을 눌러 현재 목록을 가져오거나<br/>새로운 아이템을 추가해보세요.
                            </div>
                        )}
                        {futureItems.map(item => (
                            <div key={item.id} className={styles.itemRow}>
                                <div className={styles.info}>
                                    <div className={styles.name}>{item.name}</div>
                                    <div className={styles.meta}>{fmt(item.price)}원 / {item.lifespan}개월</div>
                                </div>
                                <div className={styles.cost}>
                                    월 {fmt(item.price/item.lifespan)}
                                    <button onClick={() => removeItem('future', item.id)}><Trash2 size={12}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* 3. 하단 분석 요청 버튼 & 결과 영역 */}
            <div className={styles.footerAction}>
                <button
                    className={styles.analyzeBtn}
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? <span className="uSpinner"></span>: <Calculator />}
                    {loading ? '뀹 AI가 평가하는 중...' : 'AI 비교 분석 요청'}
                </button>
            </div>

            {/* AI 분석 결과 리포트 */}
            {analysis && (
                <div className={styles.reportSection}>
                    <div className={styles.reportCard}>
                        <div className={styles.gradeBadge}>
                            <span className={styles.gradeLabel}>당신의 등급</span>
                            <div className={styles.gradeValue}>{analysis.dignityLevel}</div>
                        </div>

                        <div className={styles.commentBox}>
                            <div className={styles.boxTitle}>
                                <MessageSquareQuote size={18} />
                                <span>AI's Roast</span>
                            </div>
                            <p className={styles.roastText}>
                                "{analysis.roastComment}"
                            </p>
                        </div>

                        <div className={styles.insightBox}>
                            <div className={styles.boxTitle}>
                                <Lightbulb size={18} />
                                <span>Analysis</span>
                            </div>
                            <p className={styles.insightText}>
                                {analysis.comparisonAnalysis}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
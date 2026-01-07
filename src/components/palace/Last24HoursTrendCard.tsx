'use client';

import React from 'react';
import cardStyles from '@components/palace/SummaryCard.module.scss';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

import { Last24HoursTrendData } from '@/app/(protected)/palace/data';

// Chart.js에서 라인 차트에 필요한 요소 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Props = {
/** 최근 24시간 콜/티켓 트렌드 데이터 */
    data: Last24HoursTrendData;
};

export function Last24HoursTrendCard({ data }: Props) {
    const labels = data.points.map((p) => p.hourLabel);

    const chartData = {
        labels,
        datasets: [
            // ─── 티켓 계열 (보라톤 그룹) ───
            {
                label: '티켓 생성',
                data: data.points.map((p) => p.ticketCreated),
                borderColor: 'rgba(147, 51, 234, 0.95)',      // 진한 보라
                backgroundColor: 'rgba(147, 51, 234, 0.28)',
                tension: 0.35,
                pointRadius: 3,
                pointHitRadius: 12,
            },
            {
                label: '티켓 처리',
                data: data.points.map((p) => p.ticketResolved),
                borderColor: 'rgba(196, 181, 253, 0.95)',     // 연보라
                backgroundColor: 'rgba(196, 181, 253, 0.25)',
                borderDash: [4, 4],                            // 점선
                tension: 0.35,
                pointRadius: 3,
                pointHitRadius: 12,
            },

            // ─── 콜 계열 (그린/하늘 그룹) ───
            {
                label: '콜 인입',
                data: data.points.map((p) => p.callInbound),
                borderColor: 'rgba(34, 197, 94, 0.95)',       // 초록
                backgroundColor: 'rgba(34, 197, 94, 0.25)',
                tension: 0.3,
                pointRadius: 3,
                pointHitRadius: 12,
            },
            {
                label: '콜 응대',
                data: data.points.map((p) => p.callAnswered),
                borderColor: 'rgba(56, 189, 248, 0.95)',      // 하늘색
                backgroundColor: 'rgba(56, 189, 248, 0.25)',
                borderDash: [4, 4],                            // 점선
                tension: 0.3,
                pointRadius: 3,
                pointHitRadius: 12,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            line: {
                borderWidth: 1,    // 모든 라인 공통 굵기
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    boxHeight: 8,
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label(context) {
                        const label = context.dataset.label || '';
                        const value = context.formattedValue;
                        return ` ${label}: ${value}건`;
                    },
                },
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.2)',
                },
            },
        },
    };

    return (
        <section
            className={cardStyles.card}
        >
            <header className={cardStyles.cardHeader}>
                <h2 className={cardStyles.cardTitle}>최근 24시간 흐름 (티켓 · 상담)</h2>
            </header>
            <div className={cardStyles.cardBody}>
                <div
                    style={{
                        width: '100%',
                        height: 260, // 카드 안에서 고정 높이 (스크롤 없이 보기 좋게)
                    }}
                >
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </section>
    );
}